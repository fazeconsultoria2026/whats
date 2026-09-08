#!/usr/bin/env node
/**
 * contaazul-cli.js - helper de acesso ao sistema financeiro.
 *
 * Cuida da parte chata (autenticar, renovar token, paginar, tratar erro) e devolve
 * JSON limpo no stdout para o agente analisar.
 *
 *   node contaazul-cli.js auth
 *   node contaazul-cli.js categorias
 *   node contaazul-cli.js lancamentos --de 2026-08-01 --ate 2026-08-31
 *   node contaazul-cli.js receber     --de 2026-08-01 --ate 2026-08-31
 *   node contaazul-cli.js pagar       --de 2026-08-01 --ate 2026-08-31
 *   node contaazul-cli.js saldo
 *
 * Trocar de sistema financeiro = mexer em ENDPOINTS e no config.json. Só isso.
 */

const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const CONFIG_PATH = path.join(RAIZ, 'config.json');
const CACHE_PATH = path.join(RAIZ, '.token-cache.json');

// Caminhos da API. Trocou de sistema? Ajuste aqui.
const ENDPOINTS = {
  categorias:  '/v1/categories',
  lancamentos: '/v1/financial-events',
  receber:     '/v1/financial-events?type=REVENUE',
  pagar:       '/v1/financial-events?type=EXPENSE',
  saldo:       '/v1/financial-accounts',
};

function morrer(msg, codigo = 1) {
  console.error(`[erro] ${msg}`);
  process.exit(codigo);
}

function lerConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    morrer('config.json nao encontrado. Copie config.example.json para config.json e preencha.');
  }
  const cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  const faltando = Object.entries(cfg.auth || {})
    .filter(([, v]) => typeof v === 'string' && v.startsWith('PREENCHA_'))
    .map(([k]) => k);
  if (faltando.length) morrer(`credenciais nao preenchidas no config.json: ${faltando.join(', ')}`);
  return cfg;
}

function arg(nome) {
  const i = process.argv.indexOf(`--${nome}`);
  return i === -1 ? null : process.argv[i + 1];
}

function validarData(valor, nome) {
  if (!valor) morrer(`--${nome} e obrigatorio no formato AAAA-MM-DD`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) morrer(`--${nome} invalido: use AAAA-MM-DD`);
  // regex nao basta: 2026-13-01 e 2026-02-31 passam no formato e nao existem no calendario
  const d = new Date(`${valor}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== valor) {
    morrer(`--${nome} nao e uma data existente: ${valor}`);
  }
  return valor;
}

// --- token -------------------------------------------------------------

function tokenEmCache() {
  if (!fs.existsSync(CACHE_PATH)) return null;
  try {
    const c = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
    // 60s de folga para nao usar token que expira no meio da chamada
    return c.expiraEm && c.expiraEm - 60_000 > Date.now() ? c.accessToken : null;
  } catch { return null; }
}

async function renovarToken(cfg) {
  const { clientId, clientSecret, refreshToken, tokenUrl } = cfg.auth;
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const r = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken }),
  });

  if (!r.ok) morrer(`falha ao renovar token (HTTP ${r.status}): ${(await r.text()).slice(0, 300)}`, 2);

  const j = await r.json();
  if (!j.access_token) morrer('resposta de token sem access_token', 2);

  fs.writeFileSync(CACHE_PATH, JSON.stringify({
    accessToken: j.access_token,
    expiraEm: Date.now() + (j.expires_in ?? 3600) * 1000,
  }, null, 2));
  fs.chmodSync(CACHE_PATH, 0o600);

  return j.access_token;
}

async function obterToken(cfg) {
  return tokenEmCache() || renovarToken(cfg);
}

// --- chamada -----------------------------------------------------------

async function buscar(cfg, caminho, params = {}) {
  const token = await obterToken(cfg);
  const url = new URL(caminho, cfg.baseUrl);
  for (const [k, v] of Object.entries(params)) if (v != null) url.searchParams.set(k, v);

  const itens = [];
  let pagina = 1;

  while (true) {
    url.searchParams.set('page', String(pagina));
    const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

    if (r.status === 401) morrer('token recusado. Rode "auth" e confira as credenciais.', 3);
    if (r.status === 429) { await new Promise(s => setTimeout(s, 2000)); continue; }
    if (!r.ok) morrer(`HTTP ${r.status} em ${url.pathname}: ${(await r.text()).slice(0, 300)}`, 4);

    const corpo = await r.json();
    const lote = Array.isArray(corpo) ? corpo : (corpo.data ?? corpo.items ?? []);
    itens.push(...lote);

    if (lote.length === 0 || pagina >= 200) break;
    pagina += 1;
  }

  return itens;
}

function imprimir(dados, meta = {}) {
  console.log(JSON.stringify({ ok: true, total: dados.length, ...meta, dados }, null, 2));
}

// --- comandos ----------------------------------------------------------

async function main() {
  const comando = process.argv[2];
  if (!comando) morrer('uso: contaazul-cli.js <auth|categorias|lancamentos|receber|pagar|saldo>');

  const cfg = lerConfig();

  if (comando === 'auth') {
    await renovarToken(cfg);
    console.log(JSON.stringify({ ok: true, mensagem: 'token renovado e valido' }, null, 2));
    return;
  }

  if (comando === 'categorias') {
    return imprimir(await buscar(cfg, ENDPOINTS.categorias));
  }

  if (comando === 'saldo') {
    return imprimir(await buscar(cfg, ENDPOINTS.saldo), { emissao: new Date().toISOString() });
  }

  if (['lancamentos', 'receber', 'pagar'].includes(comando)) {
    const de = validarData(arg('de'), 'de');
    const ate = validarData(arg('ate'), 'ate');
    if (de > ate) morrer('--de nao pode ser maior que --ate');
    const dados = await buscar(cfg, ENDPOINTS[comando], { start_date: de, end_date: ate });
    return imprimir(dados, { periodo: { de, ate } });
  }

  morrer(`comando desconhecido: ${comando}`);
}

main().catch(e => morrer(e?.message ?? String(e), 9));

#!/usr/bin/env node
/**
 * whatsapp-cli.js - helper de acesso ao WhatsApp.
 *
 * Leitura e envio, com trava de confirmacao no envio para nao sair mensagem por acidente.
 *
 *   node whatsapp-cli.js nao-lidas
 *   node whatsapp-cli.js conversas --limite 30
 *   node whatsapp-cli.js mensagens --chat 5521999998888 --limite 50
 *   node whatsapp-cli.js contatos --busca "maria"
 *   node whatsapp-cli.js grupos
 *   node whatsapp-cli.js anexos --chat 5521999998888
 *   node whatsapp-cli.js enviar --para 5521999998888 --texto "oi" --confirmado
 *
 * Trocar de provedor = mexer em ENDPOINTS e no config.json.
 */

const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const CONFIG_PATH = path.join(RAIZ, 'config.json');
const LOG_PATH = path.join(RAIZ, '.envios.log');

// Caminhos da API. Trocou de provedor? Ajuste aqui.
const ENDPOINTS = {
  conversas:  '/chat/list',
  mensagens:  '/message/list',
  contatos:   '/contact/list',
  grupos:     '/group/list',
  enviarTexto:   '/send/text',
  enviarArquivo: '/send/media',
};

function morrer(msg, codigo = 1) {
  console.error(`[erro] ${msg}`);
  process.exit(codigo);
}

function lerConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    morrer('config.json nao encontrado. Copie config.example.json para config.json e preencha.', 2);
  }
  const cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  const pendentes = [];
  if (!cfg.baseUrl || cfg.baseUrl.includes('PREENCHA')) pendentes.push('baseUrl');
  if (!cfg.token || cfg.token.includes('PREENCHA')) pendentes.push('token');
  if (pendentes.length) morrer(`preencha no config.json: ${pendentes.join(', ')}`, 2);
  return cfg;
}

function arg(nome) {
  const i = process.argv.indexOf(`--${nome}`);
  return i === -1 ? null : process.argv[i + 1];
}

const temFlag = nome => process.argv.includes(`--${nome}`);

function normalizarNumero(bruto) {
  const so = String(bruto ?? '').replace(/\D/g, '');
  if (so.length < 10 || so.length > 15) morrer(`numero invalido: "${bruto}". Use o formato 5521999998888.`);
  return so;
}

async function chamar(cfg, caminho, { metodo = 'GET', corpo = null, query = {} } = {}) {
  const url = new URL(caminho, cfg.baseUrl);
  for (const [k, v] of Object.entries(query)) if (v != null) url.searchParams.set(k, v);

  const r = await fetch(url, {
    method: metodo,
    headers: { token: cfg.token, 'Content-Type': 'application/json' },
    body: corpo ? JSON.stringify(corpo) : undefined,
  });

  if (r.status === 401 || r.status === 403) morrer('token recusado pela API. Confira o config.json.', 3);
  if (!r.ok) morrer(`HTTP ${r.status} em ${url.pathname}: ${(await r.text()).slice(0, 300)}`, 4);

  const texto = await r.text();
  try { return texto ? JSON.parse(texto) : {}; } catch { return { bruto: texto }; }
}

function imprimir(dados, meta = {}) {
  const lista = Array.isArray(dados) ? dados : (dados.data ?? dados.items ?? dados);
  console.log(JSON.stringify({
    ok: true,
    ...(Array.isArray(lista) ? { total: lista.length } : {}),
    ...meta,
    dados: lista,
  }, null, 2));
}

function registrarEnvio(destino, resumo) {
  const linha = `${new Date().toISOString()}\t${destino}\t${resumo.replace(/\s+/g, ' ').slice(0, 120)}\n`;
  fs.appendFileSync(LOG_PATH, linha);
}

// Conta envios da ultima hora no log, para respeitar o limite do config.
function enviosNaUltimaHora() {
  if (!fs.existsSync(LOG_PATH)) return 0;
  const limite = Date.now() - 3600_000;
  return fs.readFileSync(LOG_PATH, 'utf8')
    .split('\n')
    .filter(Boolean)
    .filter(l => Date.parse(l.split('\t')[0]) >= limite)
    .length;
}

async function main() {
  const comando = process.argv[2];
  if (!comando) {
    morrer('uso: whatsapp-cli.js <nao-lidas|conversas|mensagens|contatos|grupos|anexos|enviar>');
  }

  const cfg = lerConfig();
  const limite = Number(arg('limite') ?? 30);

  switch (comando) {
    case 'nao-lidas': {
      const r = await chamar(cfg, ENDPOINTS.conversas, { query: { unread: 'true', limit: limite } });
      return imprimir(r, { filtro: 'apenas nao lidas' });
    }

    case 'conversas':
      return imprimir(await chamar(cfg, ENDPOINTS.conversas, { query: { limit: limite } }));

    case 'mensagens': {
      const chat = arg('chat');
      if (!chat) morrer('--chat e obrigatorio');
      const r = await chamar(cfg, ENDPOINTS.mensagens, { query: { chatid: chat, limit: limite } });
      return imprimir(r, { chat });
    }

    case 'contatos': {
      const busca = arg('busca');
      return imprimir(await chamar(cfg, ENDPOINTS.contatos, { query: { search: busca, limit: limite } }),
        busca ? { busca } : {});
    }

    case 'grupos':
      return imprimir(await chamar(cfg, ENDPOINTS.grupos, { query: { limit: limite } }));

    case 'anexos': {
      const chat = arg('chat');
      if (!chat) morrer('--chat e obrigatorio');
      const r = await chamar(cfg, ENDPOINTS.mensagens, { query: { chatid: chat, onlyMedia: 'true', limit: limite } });
      return imprimir(r, { chat, filtro: 'apenas anexos' });
    }

    case 'enviar': {
      const exigeConfirmacao = cfg.seguranca?.exigirConfirmacaoParaEnviar !== false;
      if (exigeConfirmacao && !temFlag('confirmado')) {
        morrer('envio bloqueado. Rascunhe, mostre para a pessoa e rode de novo com --confirmado.', 5);
      }

      const teto = Number(cfg.seguranca?.limiteEnviosPorHora ?? 30);
      if (enviosNaUltimaHora() >= teto) {
        morrer(`limite de ${teto} envios por hora atingido. Isso e protecao anti-bloqueio.`, 5);
      }

      const para = normalizarNumero(arg('para'));
      const texto = arg('texto');
      const arquivo = arg('arquivo');
      if (!texto && !arquivo) morrer('informe --texto ou --arquivo');
      if (arquivo && !fs.existsSync(arquivo)) morrer(`arquivo nao encontrado: ${arquivo}`);

      let resposta;
      if (arquivo) {
        resposta = await chamar(cfg, ENDPOINTS.enviarArquivo, {
          metodo: 'POST',
          corpo: {
            number: para,
            file: fs.readFileSync(arquivo).toString('base64'),
            fileName: path.basename(arquivo),
            text: texto ?? '',
          },
        });
        registrarEnvio(para, `[arquivo] ${path.basename(arquivo)}`);
      } else {
        resposta = await chamar(cfg, ENDPOINTS.enviarTexto, {
          metodo: 'POST',
          corpo: { number: para, text: texto },
        });
        registrarEnvio(para, texto);
      }

      console.log(JSON.stringify({ ok: true, enviadoPara: para, resposta }, null, 2));
      return;
    }

    default:
      morrer(`comando desconhecido: ${comando}`);
  }
}

main().catch(e => morrer(e?.message ?? String(e), 9));

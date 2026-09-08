---
name: conta-azul
description: "Conecta no sistema financeiro (Conta Azul por padrão) e puxa lançamentos, contas a pagar, contas a receber, categorias e saldo para montar DRE e DFC. Use quando pedirem DRE, DFC, fechamento, análise financeira, visão de caixa, margem ou saúde financeira."
---

# Skill · Sistema Financeiro

Esta é a **habilidade** da Ana. Ela sozinha não decide nada: ela busca o dado bruto no sistema
financeiro e devolve normalizado, para que o agente faça a análise.

> Trocar de sistema é trocar esta skill. Conta Azul é o exemplo entregue, mas Omie, Asaas,
> Bling ou qualquer ferramenta com API funciona: veja "Trocando de sistema" no fim.

## Antes de usar

Copie `config.example.json` para `config.json` e preencha com as suas credenciais.
O `config.json` fica fora do controle de versão: ele tem segredo dentro.

```bash
cp skills/conta-azul/config.example.json skills/conta-azul/config.json
```

## Como executar

```bash
node skills/conta-azul/scripts/contaazul-cli.js <comando> [opções]
```

| Comando | O que faz |
|---|---|
| `auth` | Valida as credenciais e renova o token de acesso |
| `lancamentos --de AAAA-MM-DD --ate AAAA-MM-DD` | Lançamentos do período, com categoria |
| `receber --de ... --ate ...` | Contas a receber (competência e caixa) |
| `pagar --de ... --ate ...` | Contas a pagar (competência e caixa) |
| `categorias` | Plano de contas, necessário para os mapeamentos |
| `saldo` | Saldo das contas bancárias na data |

Toda saída é JSON no stdout. Erro vai para stderr com código de saída diferente de zero.

## Fluxo obrigatório

1. `auth` para garantir token válido.
2. `categorias` uma vez, para carregar o plano de contas.
3. Os comandos do período pedido.
4. Aplicar `referencia/dre-mapping.md` e `referencia/dfc-mapping.md`.

Se um comando falhar, **não estime o número que faltou**. Reporte o que não veio.

## Trocando de sistema

Três pontos, e só eles:

1. `config.json`: troque `baseUrl`, credenciais e o modo de autenticação.
2. `scripts/contaazul-cli.js`: ajuste os caminhos dos endpoints no bloco `ENDPOINTS`.
3. `referencia/*.md`: ajuste os nomes das categorias para o plano de contas do seu sistema.

O agente `ana.md` não muda.

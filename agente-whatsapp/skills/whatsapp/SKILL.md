---
name: whatsapp
description: "Conecta na API do WhatsApp para listar conversas, ler mensagens não lidas, buscar contatos e grupos, ver anexos e enviar mensagem. Use para qualquer tarefa de leitura ou envio no WhatsApp."
---

# Skill · WhatsApp

A habilidade que dá braço ao agente. Ela fala com a API do seu provedor de WhatsApp e devolve
JSON limpo. Quem decide o que fazer com isso é o agente.

## Antes de usar

```bash
cp skills/whatsapp/config.example.json skills/whatsapp/config.json
```

Preencha a `baseUrl` do seu provedor e o `token`. O `config.json` fica fora do git.

## Como executar

```bash
node skills/whatsapp/scripts/whatsapp-cli.js <comando> [opções]
```

### Leitura

| Comando | O que faz |
|---|---|
| `nao-lidas` | Conversas com mensagem não lida, o ponto de partida da triagem |
| `conversas --limite 30` | Últimas conversas, ordenadas por atividade |
| `mensagens --chat <id> --limite 50` | Histórico de uma conversa |
| `contatos --busca "nome"` | Procura contato por nome ou número |
| `grupos` | Grupos de que você participa |
| `anexos --chat <id>` | Arquivos e mídias trocados numa conversa |

### Envio

| Comando | O que faz |
|---|---|
| `enviar --para <numero> --texto "..."` | Manda mensagem de texto |
| `enviar --para <numero> --arquivo <caminho>` | Manda um arquivo |

**O envio exige confirmação humana.** O script recusa rodar sem a flag `--confirmado`,
justamente para não sair mensagem por acidente durante uma leitura.

## Fluxo de triagem

```bash
node scripts/whatsapp-cli.js nao-lidas
node scripts/whatsapp-cli.js mensagens --chat <id do que interessa> --limite 30
# agente lê, classifica e rascunha
node scripts/whatsapp-cli.js enviar --para <numero> --texto "..." --confirmado
```

Sempre ler o histórico antes de responder. Responder só a última mensagem é como entrar no meio
de uma conversa e chutar o assunto.

## Trocando de provedor

Ajuste o bloco `ENDPOINTS` no topo do `whatsapp-cli.js` e a `baseUrl` no `config.json`.
O agente não muda.

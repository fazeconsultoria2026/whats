# Referência de comandos

Cola rápida para o agente. Todos devolvem JSON no stdout.

## Triagem do dia

```bash
node scripts/whatsapp-cli.js nao-lidas
```

Devolve, por conversa: id, nome, número, quantidade de não lidas, prévia e horário da última.
É por aqui que começa toda triagem.

## Entender uma conversa

```bash
node scripts/whatsapp-cli.js mensagens --chat 5521999998888 --limite 30
```

Leia de trás para frente. Procure: o que ficou combinado, o que ficou em aberto, qual o tom.

## Achar alguém

```bash
node scripts/whatsapp-cli.js contatos --busca "maria"
node scripts/whatsapp-cli.js grupos
```

## Responder

```bash
node scripts/whatsapp-cli.js enviar --para 5521999998888 --texto "..." --confirmado
```

Sem `--confirmado` o script não envia. É proposital.

## Códigos de saída

| Código | Significado |
|---|---|
| 0 | Deu certo |
| 1 | Erro de uso, parâmetro faltando ou inválido |
| 2 | Configuração ausente ou incompleta |
| 3 | Token recusado pela API |
| 4 | Erro HTTP da API |
| 5 | Envio bloqueado por falta de confirmação |

## Boas práticas que evitam dor de cabeça

- Leia antes de escrever. Sempre.
- Um assunto por mensagem.
- Não mande a mesma mensagem para muita gente: isso é disparo, tem outra ferramenta e outras regras.
- Respeite horário. Mensagem comercial de madrugada queima o relacionamento.
- Se a pessoa pediu para não receber mais, registre isso na memória e respeite.

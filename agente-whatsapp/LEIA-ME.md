# Agente de WhatsApp

O segundo agente entregue na aula. Ele lê a sua caixa, faz a triagem, entende o histórico de
cada conversa e escreve a resposta no tom certo. Você aprova, ele envia.

## O que tem aqui dentro

```
agente-whatsapp/
├── agents/
│   └── whatsapp.md                   o agente (o funcionário)
└── skills/
    └── whatsapp/
        ├── SKILL.md                  a habilidade
        ├── config.example.json       modelo das credenciais
        ├── referencia/
        │   └── comandos.md           cola rápida dos comandos
        └── scripts/
            └── whatsapp-cli.js       o script que conecta de verdade
```

## Instalação em 3 passos

**1. Copie para a sua pasta `.claude`**

```bash
cp -r agents/whatsapp.md ~/.claude/agents/
cp -r skills/whatsapp ~/.claude/skills/
```

No Mac, se você não enxerga a pasta `.claude`, aperte `Command + Shift + .` no Finder.

**2. Preencha as credenciais**

```bash
cp ~/.claude/skills/whatsapp/config.example.json ~/.claude/skills/whatsapp/config.json
```

Coloque a `baseUrl` da sua API de WhatsApp e o `token`. Qualquer provedor com API HTTP serve:
você ajusta os caminhos no bloco `ENDPOINTS`, no topo do `whatsapp-cli.js`.

Confira que funcionou:

```bash
node ~/.claude/skills/whatsapp/scripts/whatsapp-cli.js nao-lidas
```

**3. Chame o agente**

Abra o Claude Code no terminal e peça: *"faz a triagem do meu WhatsApp"*.
Ele puxa as não lidas, lê o histórico, classifica e te traz os rascunhos.

## As três travas de segurança

Estão ligadas de fábrica. Foram colocadas de propósito.

| Trava | O que faz |
|---|---|
| **Confirmação no envio** | Sem a flag `--confirmado`, nenhuma mensagem sai. Ler é livre, enviar não. |
| **Limite por hora** | 30 envios por hora por padrão. Protege a sua conta de bloqueio. |
| **Log de envio** | Todo envio fica registrado em `.envios.log`, com data, destino e resumo. |

Você pode afrouxar isso no `config.json`. Recomendação: não afrouxe.

## Duas coisas importantes

- **Isto não é ferramenta de disparo em massa.** É atendimento um a um. Mandar a mesma
  mensagem para muita gente tem outras regras, outro risco e pede outra ferramenta.
- **O `config.json` tem segredo dentro.** Não suba para o GitHub, não mande por WhatsApp.
  O `.gitignore` já ignora ele.

---

Bravy School · agente entregue na aula Dominando Claude Code

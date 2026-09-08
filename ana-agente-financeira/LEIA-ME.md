# Ana · sua analista financeira

Este é o agente que foi construído ao vivo na aula. Ele fecha **DRE** e **DFC**, lê os números,
aponta tendência e alerta, e te entrega um plano de ação. Não é um resumo de planilha.

## O que tem aqui dentro

```
ana-agente-financeira/
├── agents/
│   └── ana.md                        o agente (o funcionário)
└── skills/
    └── conta-azul/
        ├── SKILL.md                  a habilidade
        ├── config.example.json       modelo das credenciais
        ├── referencia/
        │   ├── dre-mapping.md        como montar a DRE
        │   └── dfc-mapping.md        como montar a DFC
        └── scripts/
            └── contaazul-cli.js      o script que conecta de verdade
```

Agente, skill e tool. Os três que você viu na aula.

## Instalação em 3 passos

**1. Copie para a sua pasta `.claude`**

Global, vale em qualquer projeto:

```bash
cp -r agents/ana.md ~/.claude/agents/
cp -r skills/conta-azul ~/.claude/skills/
```

No Mac, se você não enxerga a pasta `.claude`, aperte `Command + Shift + .` no Finder.

**2. Preencha as credenciais**

```bash
cp ~/.claude/skills/conta-azul/config.example.json ~/.claude/skills/conta-azul/config.json
```

Abra o `config.json` e coloque o `clientId`, o `clientSecret` e o `refreshToken` da sua conta.
No Conta Azul isso sai em Configurações, na área de integrações e aplicativos.

Confira que funcionou:

```bash
node ~/.claude/skills/conta-azul/scripts/contaazul-cli.js auth
```

Resposta boa: `{ "ok": true, "mensagem": "token renovado e valido" }`.

**3. Chame a Ana**

Abra o Claude Code no terminal e digite `@ana`. Ela se apresenta e te oferece o menu:
resumo do mês, DRE, DFC, fechamento completo, análise pontual ou saúde financeira.

## Não usa Conta Azul?

Funciona igual com Omie, Asaas, Bling ou qualquer sistema com API. Você mexe em três lugares:

1. `config.json`: a `baseUrl` e as credenciais
2. `scripts/contaazul-cli.js`: o bloco `ENDPOINTS` no topo do arquivo
3. `referencia/*.md`: os nomes das categorias, para bater com o seu plano de contas

O `ana.md` não muda. É essa a graça de separar agente, skill e tool.

## Duas coisas importantes

- **O `config.json` tem segredo dentro.** Não suba para o GitHub, não mande por WhatsApp.
  O `.gitignore` do pacote já ignora ele.
- **A Ana não lança nada sem confirmar.** Ela lê, analisa e sugere. Para escrever no sistema,
  ela pede autorização antes. A IA só faz o que você deixa.

---

Bravy School · agente entregue na aula Dominando Claude Code

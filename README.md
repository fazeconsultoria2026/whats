# Bônus da aula · Dominando Claude Code

Os dois agentes que foram construídos e prometidos na aula, prontos para instalar,
mais as anotações completas do que foi ensinado.

Você não precisa saber programar para usar. Cada agente vem com um `LEIA-ME.md`
que te leva do zero ao funcionando em três passos.

---

## O que tem aqui

| | O que é | Onde está |
|---|---|---|
| 📄 | **Anotações da aula** (6 páginas) | [`anotacoes-aula-claude-code.pdf`](anotacoes-aula-claude-code.pdf) |
| 🤖 | **Ana**, sua analista financeira | [`ana-agente-financeira/`](ana-agente-financeira/) |
| 💬 | **Agente de WhatsApp** | [`agente-whatsapp/`](agente-whatsapp/) |

---

## Como baixar

**Nunca usou GitHub? É só isso:** clique no botão verde **`Code`** ali em cima e depois em
**`Download ZIP`**. Descompacte e siga o `LEIA-ME.md` de cada pasta.

Se você já vive no terminal:

```bash
git clone https://github.com/asv-digital/bonus-aula-claude-code.git
```

---

## 🤖 Ana · analista financeira

O agente que a gente construiu ao vivo na aula.

Ela fecha **DRE** e **DFC**, lê os números e devolve tendência, alerta e plano de ação.
Não é resumo de planilha: é a análise que um analista sênior entregaria.

- Escopo travado em DRE e DFC, do jeito que foi definido na aula
- Vem com os mapeamentos prontos: o que entra em cada linha, competência x caixa,
  as armadilhas que destroem a margem quando você classifica errado
- Conecta no Conta Azul por padrão, e troca para Omie, Asaas ou Bling mexendo em três lugares

👉 [Instruções de instalação](ana-agente-financeira/LEIA-ME.md)

---

## 💬 Agente de WhatsApp

Lê a sua caixa, faz a triagem, entende o histórico de cada conversa e escreve a resposta
no tom certo. Você aprova, ele envia.

- Classifica o que é urgente, o que é lead, o que é ruído
- Ordena por custo de não responder, não por ordem de chegada
- Lê o histórico antes de escrever, nunca só a última mensagem

**Três travas de segurança, ligadas de fábrica:** nenhuma mensagem sai sem confirmação
explícita, teto de 30 envios por hora e log de tudo que foi enviado. Ler é livre, enviar não.

👉 [Instruções de instalação](agente-whatsapp/LEIA-ME.md)

---

## A estrutura que você viu na aula

Os dois seguem exatamente os pilares ensinados:

```
.claude/
├── CLAUDE.md          quem é você        (você preenche)
├── memory.md          o que não esquecer (você preenche)
├── agents/            os funcionários    ← ana.md, whatsapp.md
└── skills/            as habilidades     ← conta-azul/, whatsapp/
```

E os três conceitos que sustentam tudo:

> O **agente** é o funcionário. A **skill** é a habilidade.
> A **tool** é a ferramenta que ele opera. Falta um, não funciona.

Um agente sem skill é o Carlos, aquele funcionário do exemplo que não sabia fazer nada.
Uma skill sem tool sabe o que fazer, mas não alcança nada.

---

## Perguntas que sempre aparecem

**Não acho a pasta `.claude` no meu computador.**
No Mac ela é oculta: aperte `Command + Shift + .` no Finder para revelar. Ela fica na raiz
do seu usuário. Se mesmo assim não aparecer, o Claude Code ainda não foi instalado.

**Preciso saber programar?**
Não. Você copia dois arquivos, preenche as credenciais e chama o agente pelo nome.

**Uso outro sistema financeiro, não o Conta Azul.**
Funciona igual. O `LEIA-ME.md` da Ana mostra os três pontos que mudam. O agente em si
não muda: é essa a vantagem de separar agente, skill e tool.

**Onde coloco minhas senhas?**
No `config.json` de cada skill, que você cria a partir do `config.example.json`.
Ele já está no `.gitignore`: nunca suba esse arquivo para lugar nenhum.

**Posso mudar os agentes?**
Pode e deve. São arquivos de texto. Mude o tom, o escopo, as regras. É seu funcionário agora.

---

Bravy School · material da aula Dominando Claude Code

# DFC Mapping

Como transformar as movimentações em Demonstração do Fluxo de Caixa.
Método indireto não se aplica aqui: trabalhamos com **caixa realizado**, pela data de
pagamento e de recebimento.

## Os três grupos

| Grupo | O que entra | Pergunta que responde |
|---|---|---|
| **Operacional** | Recebimento de cliente, pagamento de fornecedor, folha, impostos, aluguel, marketing | A operação se paga? |
| **Investimento** | Compra e venda de máquina, veículo, software, obra, aplicação de longo prazo | Estou colocando dinheiro no futuro? |
| **Financiamento** | Empréstimo tomado e pago, aporte de sócio, distribuição de lucro, juros de dívida | De onde vem o dinheiro que não é da operação? |

## Estrutura da entrega

```
Saldo inicial do período
  (+/-) Fluxo Operacional
  (+/-) Fluxo de Investimento
  (+/-) Fluxo de Financiamento
= Geração líquida de caixa
Saldo final do período
```

O saldo final calculado **tem que bater** com o saldo bancário na data. Se não bater, existe
lançamento sem conciliação: reporte a diferença em vez de forçar o fechamento.

## Regras de classificação

- **Data de caixa, sempre.** Nota emitida em janeiro e paga em março é caixa de março.
- **Transferência entre contas próprias não é fluxo.** Elimine antes de somar, senão o caixa
  aparece dobrado.
- **Antecipação de recebível** é financiamento, não operacional. O desconto cobrado é despesa
  financeira.
- **Parcelamento de imposto** é operacional na parcela e financiamento nos juros.
- Estorno e chargeback entram como saída operacional na data em que ocorreram.

## Leitura obrigatória

Além do relatório, sempre responda:

- Quantos dias de caixa a empresa tem no ritmo atual de saída
- Se a geração operacional é positiva sem depender de aporte ou empréstimo
- Qual o maior vazamento de caixa do período e quanto ele representa
- O que vence nos próximos 30 dias e se o caixa cobre

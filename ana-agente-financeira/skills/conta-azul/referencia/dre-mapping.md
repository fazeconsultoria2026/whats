# DRE Mapping

Como transformar o plano de contas do sistema financeiro nas linhas da DRE.
Ajuste os nomes das categorias para os que existem na sua empresa.

## Estrutura da DRE

| # | Linha | O que entra | Sinal |
|---|---|---|---|
| 1 | Receita Bruta | Vendas de produto, prestação de serviço, mensalidades | + |
| 2 | Deduções | Impostos sobre venda, devoluções, cancelamentos, descontos | - |
| 3 | **Receita Líquida** | Linha 1 menos linha 2 | = |
| 4 | CPV / CSP | Custo do produto vendido, custo do serviço prestado | - |
| 5 | **Lucro Bruto** | Linha 3 menos linha 4 | = |
| 6 | Despesas Operacionais | Pessoal, comercial, marketing, administrativo, ocupação | - |
| 7 | **EBITDA** | Linha 5 menos linha 6 | = |
| 8 | Depreciação e Amortização | Baixa contábil de ativos | - |
| 9 | Resultado Financeiro | Juros recebidos menos juros e tarifas pagos | +/- |
| 10 | **Lucro Líquido** | Linha 7 menos 8 mais ou menos 9 | = |

## Regras de classificação

- **Regime de competência.** A DRE usa a data do fato gerador, não a data do pagamento.
  Quem usa data de pagamento é a DFC.
- **Custo x despesa.** Custo é o que varia com a venda (matéria-prima, hora do time alocado,
  taxa de gateway). Despesa é o que existe mesmo sem venda (aluguel, salário administrativo).
  Errar isso destrói a margem bruta.
- **Pró-labore** é despesa de pessoal. **Distribuição de lucro** não entra na DRE.
- **Investimento em ativo** (máquina, veículo, obra) não é despesa: entra pela depreciação.
- Categoria que não bater em nenhuma linha vai para "Não classificado" e **precisa ser
  reportada ao usuário**, nunca diluída em outra linha.

## Indicadores obrigatórios

Calcule e apresente sempre, com o comparativo do período anterior:

- Margem bruta: Lucro Bruto / Receita Líquida
- Margem EBITDA: EBITDA / Receita Líquida
- Margem líquida: Lucro Líquido / Receita Líquida
- Peso da folha: Despesa de Pessoal / Receita Líquida
- Ticket médio, se houver contagem de vendas no período

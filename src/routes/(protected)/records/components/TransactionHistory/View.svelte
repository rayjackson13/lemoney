<script lang="ts">
  import type { Transaction } from '$types/forms'
  import DayBlock from './DayBlock.svelte'
  import Header from './Header.svelte'

  type Props = {
    transactions: Map<string, Transaction[]>
  }

  let searchValue = $state('')
  const { transactions }: Props = $props()
  const flatList = Array.from(transactions.values()).flat()
  const transactionSum = Array.from(transactions.values())
    .flat()
    .reduce((total, item) => (total += item?.amount ?? 0), 0)

  const formatter = Intl.NumberFormat('ru', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  })
</script>

<div class="Card flex-1">
  <Header bind:searchValue />

  <div class="flex flex-1 flex-col gap-2 py-2">
    {#each Array.from(transactions) as [dateISO, array] (dateISO)}
      <DayBlock {dateISO} transactions={array} />
    {/each}
  </div>

  <div class="Card-footer min-h-8! justify-between">
    <span class="text-xs opacity-70">Всего записей: {flatList.length}</span>

    <span class="text-xs opacity-70">
      Сумма транзакций: {formatter.format(transactionSum)} &#x20BD;
    </span>
  </div>
</div>

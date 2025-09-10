<script lang="ts">
  import { transactions } from '$stores/transactions'
  import { getTotalSum } from '../../helpers/getTotalSum'
  import { groupTransactionsByDate } from '../../helpers/groupTransactionsByDate'
  import DayBlock from './DayBlock.svelte'
  import Header from './Header.svelte'

  let searchValue = $state('')
  const groupedTransactions = $derived(groupTransactionsByDate($transactions))
  const flatList = $derived(Array.from(groupedTransactions.values()).flat())
  const transactionSum = $derived(getTotalSum(flatList))

  const formatter = Intl.NumberFormat('ru', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  })
</script>

<div class="Card flex-1">
  <Header bind:searchValue />

  <div class="flex flex-1 flex-col gap-2 overflow-auto py-2">
    {#each Array.from(groupedTransactions) as [dateISO, array] (dateISO)}
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

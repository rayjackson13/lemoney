<script lang="ts">
  import { transactions } from '$stores/transactions'
  import { groupTransactionsByCategory } from '../../helpers/groupTransactionsByCategory'
  import Entry from './Entry.svelte'

  const filtered = $derived(
    $transactions.filter((item) => item.type && ['Expense', 'ExpensePlanned'].includes(item.type)),
  )
  const grouped = $derived(groupTransactionsByCategory(filtered))
</script>

<div class="Card flex-1">
  <div class="Card-header items-center justify-between">
    <p class="text-sm leading-[16px] font-medium">Расходы по категориям</p>
  </div>

  <div class="flex flex-1 flex-col gap-2 overflow-auto p-2">
    {#each Array.from(grouped) as [categoryId, list] (categoryId)}
      <Entry {categoryId} {list} />
    {/each}
  </div>
</div>

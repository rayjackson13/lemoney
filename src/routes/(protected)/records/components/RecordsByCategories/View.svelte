<script lang="ts">
  import { transactionsStore } from '$stores/transactions'
  import { groupTransactionsByCategory } from '../../helpers/groupTransactionsByCategory'
  import Entry from './Entry.svelte'

  const filtered = $derived(
    $transactionsStore.filter(
      (item) => item.type && ['Expense', 'ExpensePlanned'].includes(item.type),
    ),
  )
  const grouped = $derived(groupTransactionsByCategory(filtered))
</script>

<div class="Card flex-1">
  <div class="Card-header">
    <p class="text-sm font-medium leading-[16px]">Расходы по категориям</p>
  </div>

  <div class="flex flex-1 flex-col gap-2 overflow-auto p-2">
    {#each grouped as [categoryId, list] (categoryId)}
      <Entry {categoryId} {list} />
    {/each}
  </div>
</div>

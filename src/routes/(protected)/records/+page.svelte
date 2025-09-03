<script lang="ts">
  import AddExpenseForm from './components/AddRecordView/Form.svelte'
  import TransactionHistory from './components/TransactionHistory/View.svelte'
  import { groupTransactionsByDate } from './helpers/groupTransactionsByDate'

  let { data } = $props()
</script>

<div class="flex flex-1 gap-4">
  <div class="flex flex-1 flex-col gap-4">
    <AddExpenseForm />

    <div class="flex flex-1 gap-4">
      <TransactionHistory transactions={groupTransactionsByDate(data.transactions)} />

      <div class="flex-1"></div>
    </div>
  </div>

  <div class="flex w-105 flex-col gap-4"></div>
</div>

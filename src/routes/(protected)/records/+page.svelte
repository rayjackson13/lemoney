<script lang="ts">
  import AddExpenseForm from './components/AddRecordView/Form.svelte'
  import SummaryView from './components/SummaryView/SummaryView.svelte'
  import TransactionHistory from './components/TransactionHistory/View.svelte'
  import RecordsByCategories from './components/RecordsByCategories/View.svelte'
  import EditTransactionModal from './modals/EditTransactionModal.svelte'
  import type { Transaction } from '$types/forms'
  import { transactionsStore } from '$stores/transactions'

  type Props = {
    data: {
      transactions: Transaction[]
    }
  }

  const { data }: Props = $props()

  transactionsStore.set(data.transactions)
</script>

<svelte:head><title>lemoney | Бюджет</title></svelte:head>

<div class="flex flex-1 gap-4">
  <div class="flex flex-1 flex-col gap-4">
    <AddExpenseForm />

    <div class="flex min-h-0 flex-1 gap-4">
      <TransactionHistory />

      <RecordsByCategories />
    </div>
  </div>

  <div class="flex w-105 flex-col gap-4">
    <SummaryView />
  </div>
</div>

<EditTransactionModal />

<script lang="ts">
  import { onMount } from 'svelte'
  import AddExpenseForm from './components/AddRecordView/Form.svelte'
  import SummaryView from './components/SummaryView/SummaryView.svelte'
  import TransactionHistory from './components/TransactionHistory/View.svelte'
  import RecordsByCategories from './components/RecordsByCategories/View.svelte'
  import { transactions } from '$stores/transactions'
  import type { SocketData } from '$types/global'
  import type { Transaction } from '$types/forms'
  import EditTransactionModal from './modals/EditTransactionModal.svelte'

  let { data } = $props()

  transactions.set(data.transactions)

  onMount(() => {
    const wss = new WebSocket(`ws://localhost:8080/transactions`)

    wss.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      $transactions = (msg as SocketData<Transaction[]>).data
    }

    return () => {
      wss.close()
    }
  })
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

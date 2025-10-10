<script lang="ts">
  import AddExpenseForm from './components/AddRecordView/Form.svelte'
  import SummaryView from './components/SummaryView/SummaryView.svelte'
  import TransactionHistory from './components/TransactionHistory/View.svelte'
  import RecordsByCategories from './components/RecordsByCategories/View.svelte'
  import EditTransactionModal from './modals/EditTransactionModal.svelte'
  import { useMediaQuery } from '$utils/hooks/useMediaQuery'

  const isDesktop = useMediaQuery('lg')
</script>

<svelte:head><title>lemoney | Бюджет</title></svelte:head>

{#if $isDesktop}
  <div class="flex flex-1 gap-4">
    <div class="flex flex-1 flex-col gap-4">
      <AddExpenseForm />

      <div class="flex min-h-0 flex-1 gap-4">
        <TransactionHistory />

        <RecordsByCategories />
      </div>
    </div>

    <div class="w-105 flex flex-col gap-4">
      <SummaryView />
    </div>
  </div>
{/if}

{#if !$isDesktop}
  <div class="flex flex-1 flex-col gap-4 overflow-scroll">
    <SummaryView />

    <RecordsByCategories />

    <TransactionHistory />
  </div>
{/if}

<EditTransactionModal />

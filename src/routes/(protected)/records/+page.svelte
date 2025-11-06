<script lang="ts">
  import AddExpenseForm from './components/AddRecordView/Form.svelte'
  import SummaryView from './components/SummaryView/SummaryView.svelte'
  import TransactionHistory from './components/TransactionHistory/View.svelte'
  import RecordsByCategories from './components/RecordsByCategories/View.svelte'
  import EditTransactionModal from './modals/EditTransactionModal.svelte'
  import { useMediaQuery } from '$utils/hooks/useMediaQuery'

  const isDesktop = useMediaQuery('xl')
</script>

<svelte:head><title>lemoney | Бюджет</title></svelte:head>

{#if $isDesktop}
  <div class="Records-root flex flex-1 gap-4">
    <div class="flex flex-1 flex-col gap-4">
      <AddExpenseForm />

      <div class="flex min-h-0 flex-1 gap-4">
        <TransactionHistory />

        <RecordsByCategories />
      </div>
    </div>

    <div class="w-105 flex flex-col gap-4 self-start">
      <SummaryView />
    </div>
  </div>
{/if}

{#if !$isDesktop}
  <div class="Records-root">
    <SummaryView />

    <TransactionHistory />
  </div>
{/if}

<EditTransactionModal />

<style lang="scss">
  @use '$styles/theme' as *;

  .Records-root {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 16px;

    @include screen(md) {
      padding-inline: 16px;
      flex-direction: row-reverse;
    }

    @include screen(xl) {
      padding-inline: 0;
      flex-direction: row;
    }

    :global(.Card-summary) {
      @include screen(md) {
        align-self: flex-start;
        flex: 0.8;
      }

      @include screen(md) {
        align-self: unset;
      }
    }
  }
</style>

<script lang="ts">
  import type { Transaction } from '$types/forms'
  import Header from './Header.svelte'

  type Props = {
    transactions: Map<string, Transaction[]>
  }

  let searchValue = $state('')
  let { transactions }: Props = $props()

  $inspect(transactions)
</script>

<div class="Card flex-1">
  <Header bind:searchValue />

  <div class="flex flex-1 flex-col gap-2 py-2"></div>
</div>

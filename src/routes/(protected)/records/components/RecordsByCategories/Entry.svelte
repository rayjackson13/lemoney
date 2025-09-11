<script lang="ts">
  import { categories } from '$stores/categories'
  import type { Transaction } from '$types/forms'
  import { slide } from 'svelte/transition'
  import { groupTransactionsByDate } from '../../helpers/groupTransactionsByDate'
  import DayBlock from '../TransactionHistory/DayBlock.svelte'
  import clsx from 'clsx'

  type Props = {
    categoryId: string | null
    list: Transaction[]
  }

  const formatter = Intl.NumberFormat('ru', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  })

  const { categoryId, list }: Props = $props()
  let isOpen = $state(false)

  const toggleOpen = () => {
    isOpen = !isOpen
  }

  const categoryName =
    categoryId === null
      ? '<без категории>'
      : ($categories.find((item) => item.value === categoryId)?.name ?? '')

  const totalSum = $derived(list.reduce((total, current) => (total += current.amount ?? 0), 0))

  const groupedTransactions = $derived(groupTransactionsByDate(list))
</script>

<div
  class={clsx(
    'flex min-h-0 min-w-0 shrink-0 flex-col overflow-hidden rounded-lg select-none',
    isOpen && 'bg-gray-100',
  )}
>
  <button
    class="flex h-10 items-center gap-2 px-2 py-1 text-left transition-colors duration-50 select-none hover:bg-gray-100"
    onclick={toggleOpen}
    type="button"
  >
    <div class="flex h-8 min-w-0 flex-1 flex-col overflow-hidden">
      <p class="overflow-hidden text-sm leading-[1.2] text-ellipsis whitespace-nowrap">
        {categoryName}
      </p>

      <span class="text-xs leading-[1.2] opacity-70">
        {list.length} операций
      </span>
    </div>

    <p class="text-sm">
      -{formatter.format(totalSum)} &#x20BD;
    </p>

    <i
      class={clsx(
        'fas fa-chevron-down text-[10px] transition-transform',
        isOpen && '-translate-y-px rotate-180',
      )}
    ></i>
  </button>

  {#if isOpen}
    <div class="flex flex-col gap-2 py-2" transition:slide={{ duration: 150 }}>
      {#each Array.from(groupedTransactions) as [dateISO, array] (dateISO)}
        <DayBlock {dateISO} transactions={array} />
      {/each}
    </div>
  {/if}
</div>

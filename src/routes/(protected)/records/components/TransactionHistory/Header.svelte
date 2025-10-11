<script lang="ts">
  import Autocomplete from '$components/common/Autocomplete/Autocomplete.svelte'
  import NumberInput from '$components/common/NumberInput/NumberInput.svelte'
  import { categories } from '$stores/categories'
  import { transactionTypes } from '$stores/transactionTypes'
  import type { TransactionFilters } from '$types/forms'
  import { getOS } from '$utils/platform/getOS'
  import clsx from 'clsx'
  import { onMount } from 'svelte'
  import { fly, slide } from 'svelte/transition'

  type Props = {
    filters: TransactionFilters
  }

  const complexInputClasses = {
    root: 'w-full! h-[28px]!',
    input: 'Input-small',
    adornment: 'w-[28px]! h-[28px]! text-xs',
  }
  const moneyInputClasses = {
    root: 'w-full h-[28px]!',
    input: 'Input-small w-full! text-left!',
    adornment: 'text-xs pt-[1px] pr-[10px]',
  }

  let { filters = $bindable() }: Props = $props()
  let isFiltersOpen = $state(false)
  let searchInputRef: HTMLInputElement

  const toggleFilters = (): void => {
    isFiltersOpen = !isFiltersOpen
  }

  const handleShortcuts = (ev: KeyboardEvent): void => {
    if (ev.code === 'KeyF' && (getOS() === 'mac' ? ev.metaKey : ev.ctrlKey)) {
      ev.preventDefault()
      searchInputRef.focus()
      searchInputRef.select()
      return
    }

    if (ev.code === 'Escape' && document.activeElement === searchInputRef) {
      ev.preventDefault()
      searchInputRef.blur()
      return
    }
  }

  onMount(() => {
    document.addEventListener('keydown', handleShortcuts)

    return () => {
      document.removeEventListener('keydown', handleShortcuts)
    }
  })
</script>

<div class="Card-header flex-col gap-1">
  <div class="flex w-full flex-1 items-center gap-1">
    <p class="flex-1 text-sm font-medium leading-[1]">История транзакций</p>

    <div class="relative">
      <input
        bind:this={searchInputRef}
        bind:value={filters.query}
        class="Input-small pr-6! w-36"
        type="text"
        placeholder="Поиск..."
      />

      <div class="pointer-events-none absolute right-2 top-0 flex h-full items-center gap-1">
        {#if !filters.query}
          <span class="Hotkey pt-[2px]" transition:fly={{ x: 8, duration: 150 }}>Ctrl+F</span>
        {/if}

        <i class="fas fa-magnifying-glass h-3 w-3 pt-[2px] text-[10px] text-slate-500"></i>
      </div>
    </div>

    <button
      class={clsx('IconButton', isFiltersOpen && 'text-slate-700')}
      aria-label="Открыть/скрыть фильтры"
      type="button"
      onclick={toggleFilters}
    >
      <i class="fas fa-filter w-4! leading-4! h-4 text-xs"></i>
    </button>
  </div>

  {#if isFiltersOpen}
    <div class="grid w-full grid-cols-2 gap-1" transition:slide={{ duration: 150 }}>
      <Autocomplete
        bind:value={filters.type}
        classes={complexInputClasses}
        hasResetOption
        options={transactionTypes}
        placeholder="Тип"
      />

      <Autocomplete
        bind:value={filters.category}
        classes={complexInputClasses}
        hasResetOption
        options={$categories}
        placeholder="Категория"
      />

      <NumberInput
        bind:value={filters.minAmount}
        classes={moneyInputClasses}
        placeholder="Сумма от"
      />

      <NumberInput
        bind:value={filters.maxAmount}
        classes={moneyInputClasses}
        placeholder="Сумма до"
      />
    </div>
  {/if}
</div>

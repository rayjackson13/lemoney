<script lang="ts">
  import Autocomplete from '$components/common/Autocomplete/Autocomplete.svelte'
  import DatePicker from '$components/common/DatePicker/DatePicker.svelte'
  import NumberInput from '$components/common/NumberInput/NumberInput.svelte'
  import { categories } from '$stores/categories'
  import { transactionTypes } from '$stores/transactionTypes'
  import { getOS } from '$utils/platform/getOS'
  import clsx from 'clsx'
  import { onMount } from 'svelte'
  import { fly, slide } from 'svelte/transition'

  type Props = {
    searchValue: string
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

  let { searchValue = $bindable() }: Props = $props()
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

<div class="Card-header flex-col gap-1! py-[6px]!">
  <div class="flex w-full items-center gap-1">
    <p class="flex-1 text-sm leading-[1] font-medium">История транзакций</p>

    <div class="relative">
      <input
        bind:this={searchInputRef}
        bind:value={searchValue}
        class="Input-small w-36 pr-6!"
        type="text"
        placeholder="Поиск..."
      />

      <div class="pointer-events-none absolute top-0 right-2 flex h-full items-center gap-1">
        {#if !searchValue}
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
      <i class="fas fa-filter h-4 w-4! text-xs leading-4!"></i>
    </button>
  </div>

  {#if isFiltersOpen}
    <div class="grid w-full grid-cols-3 gap-1" transition:slide={{ duration: 150 }}>
      <DatePicker classes={complexInputClasses} placeholder="Дата от" />

      <DatePicker classes={complexInputClasses} placeholder="Дата до" />

      <Autocomplete classes={complexInputClasses} options={$categories} placeholder="Категория" />

      <Autocomplete classes={complexInputClasses} options={transactionTypes} placeholder="Тип" />

      <NumberInput placeholder="Сумма от" value={null} classes={moneyInputClasses} />

      <NumberInput placeholder="Сумма до" value={null} classes={moneyInputClasses} />
    </div>
  {/if}
</div>

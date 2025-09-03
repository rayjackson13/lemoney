<script lang="ts">
  import type { Option } from '$types/forms'
  import { onOutsideClick } from '$utils/ui/onOutsideClick'
  import { teleport } from '$utils/ui/teleport'
  import clsx from 'clsx'
  import { onMount } from 'svelte'
  import type { FormEventHandler } from 'svelte/elements'
  import { fly } from 'svelte/transition'

  type Props = {
    classes?: {
      adornment?: string
      input?: string
      root?: string
    }
    options: Option[]
    placeholder?: string
    value?: string | null
  }

  let { classes, options, placeholder, value = $bindable() }: Props = $props()

  const getOptionName = (): Option | null =>
    value ? (options.find((item) => item.value === value) ?? null) : null

  let inputRef = $state<HTMLInputElement>()
  let popoverRef = $state<HTMLDivElement>()
  let inputBox = $state<DOMRect>()
  let isDropdownVisible = $state(false)
  let isContainerVisible = $state(false)
  let visibleOptions = $state<Option[]>(options)
  let highlightedIndex = $state<number | null>(null)
  let inputValue = $derived<string>(getOptionName()?.name ?? '')
  let selectedOption = $derived<Option | null>(getOptionName())

  const openDropdown = (): void => {
    highlightedIndex = null
    isDropdownVisible = true
  }

  const closeDropdown = (): void => {
    highlightedIndex = null
    isDropdownVisible = false
  }

  const onFocus = () => {
    inputBox = inputRef?.getBoundingClientRect()
    inputRef?.select()
    openDropdown()
  }

  const onBlur = () => {
    inputValue = selectedOption?.name ?? ''
  }

  const onInput: FormEventHandler<HTMLInputElement> = (ev) => {
    const value = ev.currentTarget.value

    visibleOptions = options.filter((item) => item.name.toLowerCase().includes(value.toLowerCase()))
  }

  const onSelect = (item: Option): void => {
    if (value === item.value) return

    value = item.value
    inputValue = item.name
    closeDropdown()
  }

  const keyHandler = (ev: KeyboardEvent): void => {
    if (!isDropdownVisible) return

    if (ev.code === 'Escape' && document.activeElement === inputRef) {
      closeDropdown()
    }

    if (ev.code === 'ArrowDown') {
      highlightedIndex =
        highlightedIndex === null ? 0 : Math.min(highlightedIndex + 1, visibleOptions.length - 1)
      ev.preventDefault()
    }

    if (ev.code === 'ArrowUp') {
      highlightedIndex =
        highlightedIndex === null ? visibleOptions.length - 1 : Math.max(highlightedIndex - 1, 0)
      ev.preventDefault()
    }

    if (ev.code === 'Enter' && highlightedIndex !== null) {
      onSelect(visibleOptions[highlightedIndex])
      ev.preventDefault()
    }
  }

  function onWindowResize() {
    closeDropdown()
  }

  onMount(() => {
    document.addEventListener('keydown', keyHandler)
    window.addEventListener('resize', onWindowResize)

    return () => {
      document.removeEventListener('keydown', keyHandler)
      window.removeEventListener('resize', onWindowResize)
    }
  })
</script>

<div
  class={clsx('relative h-8 w-36', classes?.root)}
  use:onOutsideClick={{ callback: closeDropdown, refs: [popoverRef] }}
>
  <input
    bind:this={inputRef}
    bind:value={inputValue}
    type="text"
    class={clsx(
      'Input w-full overflow-hidden pr-8! text-ellipsis',
      selectedOption?.ribbon && 'pl-[14px]!',
      classes?.input,
    )}
    onfocus={onFocus}
    oninput={onInput}
    onblur={onBlur}
    {placeholder}
  />

  {#if selectedOption?.ribbon}
    <span class={clsx('ribbon', selectedOption.ribbon)}></span>
  {/if}

  <div
    class={clsx(
      'pointer-events-none absolute top-0 right-0 flex h-8 w-8 items-center justify-center text-[10px] text-slate-500',
      classes?.adornment,
    )}
  >
    <i class="fas fa-chevron-down"></i>
  </div>

  {#if isDropdownVisible && !!visibleOptions.length}
    <div
      bind:this={popoverRef}
      use:teleport={inputBox}
      class="z-10 mt-1 max-h-[40vh] min-w-full overflow-auto overflow-x-hidden rounded-lg bg-white py-1 shadow-lg"
      transition:fly={{ y: -8, duration: 50 }}
      onintrostart={() => (isContainerVisible = true)}
      onoutroend={() => (isContainerVisible = false)}
    >
      {#each visibleOptions as option, index (option.value + '-' + isDropdownVisible)}
        {#if isContainerVisible}
          <button
            class={clsx(
              'relative block w-full px-4 py-1 text-left text-sm whitespace-nowrap',
              'transition-colors hover:bg-gray-100 active:bg-gray-200',
              option.value === value && 'bg-slate-200 hover:bg-slate-200 active:bg-slate-200',
              index === highlightedIndex && 'bg-gray-200',
            )}
            onclick={() => onSelect(option)}
            tabindex="-1"
            type="button"
            transition:fly={{ x: 8, duration: 150, delay: index * 30 }}
          >
            {#if option.ribbon}
              <span class={clsx('ribbon', option.ribbon)}></span>
            {/if}
            <span>{option.name}</span>
          </button>
        {/if}
      {/each}
    </div>
  {/if}
</div>

<style>
  .ribbon {
    height: 16px;
    position: absolute;
    left: 8px;
    width: 2px;
    top: calc(50% - 8px);
    border-radius: 2px;
  }
</style>

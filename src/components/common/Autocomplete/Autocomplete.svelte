<script lang="ts">
  import type { Option } from '$types/forms'
  import { onBlurWithin } from '$utils/ui/onBlurWithin'
  import { onOutsideClick } from '$utils/ui/onOutsideClick'
  import clsx from 'clsx'
  import { onMount } from 'svelte'
  import type { FormEventHandler } from 'svelte/elements'
  import { fly } from 'svelte/transition'

  type Props = {
    defaultValue?: string
    options: Option[]
    placeholder?: string
  }

  const getDefaultOption = (): Option | null =>
    defaultValue ? (options.find((item) => item.value === defaultValue) ?? null) : null

  let inputRef: HTMLInputElement
  let { defaultValue, options, placeholder }: Props = $props()
  let isDropdownVisible = $state(false)
  let isContainerVisible = $state(false)
  let selectedOption = $state<Option | null>(getDefaultOption())
  let inputValue = $state(getDefaultOption()?.name ?? '')
  let visibleOptions = $state<Option[]>(options)
  let highlightedIndex = $state<number | null>(null)

  const openDropdown = (): void => {
    highlightedIndex = null
    isDropdownVisible = true
  }

  const closeDropdown = (): void => {
    highlightedIndex = null
    isDropdownVisible = false
  }

  const onFocus = () => {
    inputRef.select()
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
    if (selectedOption?.value === item.value) return

    selectedOption = item
    inputValue = item.name
    closeDropdown()
  }

  const keyHandler = (ev: KeyboardEvent): void => {
    if (!isDropdownVisible) return

    if (ev.code === 'Escape') {
      inputRef.blur()
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

  onMount(() => {
    document.addEventListener('keydown', keyHandler)

    return () => {
      document.removeEventListener('keydown', keyHandler)
    }
  })
</script>

<div class="relative h-8 w-36" use:onOutsideClick={closeDropdown} use:onBlurWithin={closeDropdown}>
  <input
    bind:this={inputRef}
    bind:value={inputValue}
    type="text"
    class={clsx('Input w-full', selectedOption?.ribbon && 'pl-[14px]!')}
    onfocus={onFocus}
    oninput={onInput}
    onblur={onBlur}
    {placeholder}
  />

  {#if selectedOption?.ribbon}
    <span class={clsx('ribbon', selectedOption.ribbon)}></span>
  {/if}

  <div
    class="pointer-events-none absolute top-0 right-0 flex h-8 w-8 items-center justify-center text-[10px] text-slate-500"
  >
    <i class="fas fa-chevron-down"></i>
  </div>

  {#if isDropdownVisible && !!visibleOptions.length}
    <div
      class="absolute z-10 mt-1 w-auto min-w-32 overflow-hidden rounded-lg bg-white py-1 shadow-lg"
      transition:fly={{ y: -8, duration: 200 }}
      onintroend={() => (isContainerVisible = true)}
      onoutroend={() => (isContainerVisible = false)}
    >
      {#each visibleOptions as option, index (option.value + '-' + isDropdownVisible)}
        {#if isContainerVisible}
          <button
            class={clsx(
              'relative block w-full px-4 py-1 text-left text-sm transition-colors hover:bg-gray-100 active:bg-gray-200',
              option.value === selectedOption?.value &&
                'bg-slate-200 hover:bg-slate-200 active:bg-slate-200',
              index === highlightedIndex && 'bg-gray-200',
            )}
            onclick={() => onSelect(option)}
            tabindex="-1"
            transition:fly={{ x: 8, duration: 150, delay: index * 50 }}
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

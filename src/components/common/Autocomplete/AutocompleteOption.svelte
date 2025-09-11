<script lang="ts">
  import type { Option } from '$types/forms'
  import clsx from 'clsx'
  import { fly } from 'svelte/transition'

  type Props = {
    isHighlighted: boolean
    isSelected: boolean
    index: number
    onSelect: () => void
    option: Option
  }

  const { isHighlighted, isSelected, index, onSelect, option }: Props = $props()
</script>

<button
  class={clsx(
    'relative block w-full px-4 py-1 text-left text-sm whitespace-nowrap',
    'transition-colors hover:bg-gray-100 active:bg-gray-200',
    isSelected && 'bg-slate-200 hover:bg-slate-200 active:bg-slate-200',
    isHighlighted && 'bg-gray-200',
  )}
  onclick={onSelect}
  tabindex="-1"
  type="button"
  transition:fly={{ x: 8, duration: 150, delay: index * 30 }}
>
  {#if option.ribbon}
    <span class={clsx('ribbon', option.ribbon)}></span>
  {/if}
  <span>{option.name}</span>
</button>

{#if !option.value}
  <hr class="my-1 text-gray-200" />
{/if}

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

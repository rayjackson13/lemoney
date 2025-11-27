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
    'Autocomplete-option option',
    isSelected && 'selected',
    isHighlighted && 'highlighted',
  )}
  onclick={onSelect}
  tabindex="-1"
  type="button"
  data-index={index}
  transition:fly={{ x: 8, duration: 150, delay: index * 30 }}
>
  {#if option.ribbon}
    <span class={clsx('Ribbon', option.ribbon)}></span>
  {/if}
  <span>{option.name}</span>
</button>

{#if !option.value}
  <hr class="my-1 text-gray-200" />
{/if}

<style lang="scss">
  .option {
    position: relative;
    display: block;
    width: 100%;
    white-space: nowrap;
    padding-inline: 16px;
    padding-block: 4px;
    text-align: left;
    font-size: 14px;
    line-height: 20px;

    &.selected {
      background-color: var(--color-slate-200);
    }

    &:hover,
    &.highlighted {
      background-color: color-mix(in srgb, var(--color-gray-300) 30%, transparent);
    }

    &:active {
      background-color: color-mix(in srgb, var(--color-gray-400) 30%, transparent);
    }
  }
</style>

<script lang="ts">
  import type { Position } from '$types/global'
  import { onOutsideClick } from '$utils/ui/onOutsideClick'
  import { teleport } from '$utils/ui/teleport'
  import clsx from 'clsx'
  import { fly, scale } from 'svelte/transition'

  type Props = {
    close: () => unknown
    isOpen: boolean
    mousePosition: Position | null
  }

  let { close, isOpen, mousePosition }: Props = $props()
  let popoverRef = $state<HTMLElement>()
  let isContainerVisible = $state(false)

  const options = [
    {
      icon: 'fas fa-pencil',
      name: 'Изменить',
      shortcut: 'Ctrl+E',
    },
    {
      icon: 'fas fa-close',
      name: 'Удалить',
      shortcut: 'Del',
    },
  ]

  const onContextMenu = (ev: MouseEvent) => {
    ev.preventDefault()
    ev.stopPropagation()
  }
</script>

{#if isOpen}
  <div
    bind:this={popoverRef}
    use:teleport={{ position: mousePosition }}
    use:onOutsideClick={{ callback: close, refs: [popoverRef] }}
    class="z-10 mt-1 max-h-[40vh] min-w-full overflow-hidden rounded-lg bg-white py-1 shadow-2xl"
    oncontextmenu={onContextMenu}
    role="dialog"
    tabindex="0"
    onintrostart={() => (isContainerVisible = true)}
    onoutroend={() => (isContainerVisible = false)}
    transition:scale={{ start: 0.7, duration: 50 }}
  >
    {#each options as option, index (index)}
      {#if isContainerVisible}
        <button
          class={clsx(
            'relative block w-full px-4 py-1 text-left text-sm whitespace-nowrap',
            'transition-colors hover:bg-gray-100 active:bg-gray-200',
          )}
          onclick={close}
          tabindex="-1"
          type="button"
          transition:fly={{ x: 8, duration: 150, delay: index * 30 }}
        >
          {option.name}
        </button>
      {/if}
    {/each}
  </div>
{/if}

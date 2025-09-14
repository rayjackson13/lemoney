<script lang="ts">
  import type { ContextMenuOption } from '$types/forms'
  import type { Position } from '$types/global'
  import { onOutsideClick } from '$utils/ui/onOutsideClick'
  import { teleport } from '$utils/ui/teleport'
  import { scale } from 'svelte/transition'
  import ContextMenuItem from './ContextMenuItem.svelte'

  type Props = {
    closeMenu: () => unknown
    isOpen: boolean
    mousePosition: Position | null
    options: ContextMenuOption[]
  }

  let { closeMenu, isOpen, mousePosition, options }: Props = $props()
  let popoverRef = $state<HTMLElement>()
  let isContainerVisible = $state(false)

  const onContextMenu = (ev: MouseEvent) => {
    ev.preventDefault()
    ev.stopPropagation()
  }
</script>

{#if isOpen}
  <div
    bind:this={popoverRef}
    use:teleport={{ position: mousePosition }}
    use:onOutsideClick={{ callback: closeMenu, refs: [popoverRef] }}
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
        <ContextMenuItem {closeMenu} {option} {index} />
      {/if}
    {/each}
  </div>
{/if}

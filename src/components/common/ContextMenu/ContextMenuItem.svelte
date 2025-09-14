<script lang="ts">
  import type { ContextMenuOption } from '$types/forms'
  import clsx from 'clsx'
  import { fly } from 'svelte/transition'

  type Props = {
    closeMenu: () => unknown
    index: number
    option: ContextMenuOption
  }

  const { closeMenu, index, option }: Props = $props()

  const onClick = () => {
    if (typeof option.onClick === 'function') {
      option.onClick()
    }

    closeMenu()
  }
</script>

<button
  class={clsx(
    'relative block w-full px-4 py-1 text-left text-sm whitespace-nowrap',
    'transition-colors hover:bg-gray-100 active:bg-gray-200',
  )}
  onclick={onClick}
  tabindex="-1"
  type="button"
  transition:fly={{ x: 8, duration: 150, delay: index * 30 }}
>
  {option.name}
</button>

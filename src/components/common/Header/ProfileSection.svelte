<script lang="ts">
  import { clsx } from 'clsx'
  import { fly, slide } from 'svelte/transition'
  import { onOutsideClick } from '$utils/ui/onOutsideClick'
  import { goto, invalidateAll } from '$app/navigation'
  import type { UserInfo } from '$types/user'

  type Props = {
    user: UserInfo
  }

  let { user }: Props = $props()
  let isMenuOpen = $state(false)

  const toggleMenu = (): void => {
    isMenuOpen = !isMenuOpen
  }

  const closeMenu = (): void => {
    isMenuOpen = false
  }

  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      await invalidateAll()
      goto('/login', { replaceState: true })
    } catch (e) {
      console.error('Could not log out', e)
    }
  }
</script>

<div
  class={clsx(
    'AppHeader-userMenu absolute top-0 right-4 z-1 flex min-h-full',
    'cursor-pointer flex-col rounded-lg backdrop-blur-xs transition-colors',
    isMenuOpen && 'AppHeader-userMenu--open shadow-sm',
  )}
  use:onOutsideClick={{ callback: closeMenu }}
>
  <button type="button" class="flex items-center rounded-lg" onclick={toggleMenu}>
    <img class="h-8 w-8 rounded-lg bg-teal-400" src={user.picture} alt="Аватар пользователя" />

    <div class="flex items-center gap-2 px-3">
      <span class="pb-[1px] text-sm">{user.name}</span>
      <i
        class={clsx(
          'fas fa-chevron-down w-auto! text-[10px] transition-transform',
          isMenuOpen && '-translate-y-px rotate-180',
        )}
      ></i>
    </div>
  </button>

  <!-- User Menu -->
  {#if isMenuOpen}
    <aside class="items-center py-2 text-sm" transition:slide={{ duration: 150 }}>
      <ul>
        <li in:fly={{ x: -20 }}>
          <a class="flex items-center py-1 hover:bg-neutral-700" href="/help">
            <i class="fas fa-question w-8! pl-4 text-left! text-xs"></i>
            <span class="px-3">Справка</span>
          </a>
        </li>
        <li in:fly={{ x: -20, delay: 50 }}>
          <button
            class="flex w-full items-center py-1 hover:bg-neutral-700"
            type="button"
            onclick={logout}
          >
            <i class="fas fa-arrow-right-from-bracket w-8! pl-4 text-left! text-xs"></i>
            <span class="px-3">Выйти</span>
          </button>
        </li>
      </ul>
    </aside>
  {/if}
  <!-- /User Menu -->
</div>

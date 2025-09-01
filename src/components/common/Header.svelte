<script lang="ts">
  import { page } from '$app/state'
  import type { NavigationItem } from '$types/navigation'
  import { clsx } from 'clsx'
  import { slide } from 'svelte/transition'
  import { onOutsideClick } from '$utils/ui/onOutsideClick'
  import { goto, invalidateAll } from '$app/navigation'
  import { onMount } from 'svelte'
  import type { UserInfo } from '../../app'

  type Props = {
    user: UserInfo
  }

  let { user }: Props = $props()
  let isReady = $state(false)
  let isMenuOpen = $state(false)

  const navItems: NavigationItem[] = [
    {
      path: '/dashboard',
      label: 'Главная',
    },
    {
      path: '/records',
      label: 'Бюджет',
    },
    {
      path: '/planning',
      label: 'Планирование',
    },
    {
      path: '/settings',
      label: 'Настройки',
      icon: 'fas fa-cog',
      iconOnly: true,
    },
  ]

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

  onMount(() => {
    isReady = true
  })
</script>

{#if isReady}
  <header class="AppHeader h-12 w-full px-4 py-2 text-neutral-200 shadow-md">
    <div
      class="relative mx-auto flex h-full w-full max-w-[1400px] items-center justify-between gap-4 px-4"
    >
      <nav class="AppHeader-navbar h-full rounded-lg px-4 backdrop-blur-xs">
        <ul class="flex h-full items-center gap-4">
          {#each navItems as item (item.path)}
            {@const isCurrent = item.path === page.url.pathname}

            <li class="h-full">
              <a
                class={clsx(
                  'flex h-full items-center  transition-colors select-none hover:text-white',
                  isCurrent && 'pointer-events-none font-semibold text-white',
                )}
                href={item.path}
              >
                {#if item.icon}<i class={clsx(item.icon, 'w-auto! text-sm')}></i>{/if}

                <span class={clsx('pb-[1px] text-sm', item.iconOnly && 'sr-only')}
                  >{item.label}</span
                >
              </a>
            </li>
          {/each}
        </ul>
      </nav>

      <div
        class={clsx(
          'AppHeader-userMenu absolute top-0 right-4 z-1 flex min-h-full',
          'cursor-pointer flex-col rounded-lg backdrop-blur-xs transition-colors',
          isMenuOpen && 'AppHeader-userMenu--open shadow-sm',
        )}
        use:onOutsideClick={closeMenu}
      >
        <button type="button" class="flex items-center rounded-lg" onclick={toggleMenu}>
          <img
            class="h-8 w-8 rounded-lg bg-teal-400"
            src={user.picture}
            alt="Аватар пользователя"
          />

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

        {#if isMenuOpen}
          <aside class="items-center py-2 text-sm" transition:slide={{ duration: 150 }}>
            <ul>
              <li>
                <a class="flex items-center py-1 hover:bg-neutral-700" href="/help">
                  <i class="fas fa-question w-8! pl-4 text-left! text-xs"></i>
                  <span class="px-3">Справка</span>
                </a>
              </li>
              <li>
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
      </div>
    </div>
  </header>
{/if}

<style scoped>
  .AppHeader {
    background-color: #19212c;
    background-image: url('/pattern.svg');
    background-repeat: repeat-x;
  }

  .AppHeader-navbar,
  .AppHeader-userMenu {
    background-color: rgb(0 0 0 / 50%);
  }

  .AppHeader-userMenu--open,
  .AppHeader-userMenu:hover {
    background-color: rgb(0 0 0 / 80%);
    color: #fff;
  }
</style>

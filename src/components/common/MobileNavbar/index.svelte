<script lang="ts">
  import { userStore } from '$stores/user'
  import type { NavigationItem } from '$types/navigation'
  import { FirebaseController } from '$utils/FirebaseController'
  import { fly, slide } from 'svelte/transition'
  import './MobileNavbar.css'
  import NavLink from './NavLink.svelte'
  import { onOutsideClick } from '$utils/ui/onOutsideClick'
  import clsx from 'clsx'

  const user = $derived($userStore.user)
  let isMenuOpen = $state(false)

  const toggleMenuOpen = (): void => {
    isMenuOpen = !isMenuOpen
  }

  const closeMenu = (): void => {
    isMenuOpen = false
  }

  const logout = async (): Promise<void> => {
    await FirebaseController.logout()
    closeMenu()
  }

  const navItems: NavigationItem[] = [
    {
      path: '/dashboard',
      label: 'Главная',
      icon: 'fas fa-house',
    },
    {
      path: '/records',
      label: 'Бюджет',
      icon: 'fas fa-coins',
    },
    {
      path: '/planning',
      label: 'План',
      icon: 'fas fa-clipboard-list',
    },
  ]
</script>

{#if user}
  <div
    class={clsx(
      'pointer-events-none fixed top-0 right-0 bottom-0 left-0 z-1 transition-all xl:hidden',
      isMenuOpen && 'Navbar-backdropVisible backdrop-blur-xs',
    )}
  >
    <div
      class="Navbar pointer-events-auto absolute right-0 bottom-0 left-0 flex flex-col-reverse gap-4"
      use:onOutsideClick={{ callback: closeMenu }}
      transition:fly={{ y: 48 }}
    >
      <div
        class={clsx(
          'Navbar-gradient absolute top-0 right-0 bottom-0 left-0 -z-1 opacity-100 transition-opacity',
          isMenuOpen && 'opacity-0!',
        )}
      ></div>

      <div class="mx-auto w-full max-w-[450px] px-4 pb-4">
        <div class="flex items-center gap-3">
          <div class="Navbar-linkContainer section-shadow">
            {#each navItems.slice(0, 2) as link (link.path)}
              <NavLink {...link} />
            {/each}
          </div>

          <button class="Navbar-actionButton section-shadow" aria-label="Добавить запись">
            <i class="fas fa-plus Navbar-actionButtonIcon"></i>
          </button>

          <div class="Navbar-linkContainer section-shadow">
            {#each navItems.slice(2, 3) as link (link.path)}
              <NavLink {...link} />
            {/each}

            <button class="Navbar-link" onclick={toggleMenuOpen}>
              <span class="p-[2px]">
                <img
                  class="h-6 w-6 rounded-[24px] bg-teal-400"
                  src={user.photoURL}
                  alt="Аватар пользователя"
                />
              </span>
              <span class="Navbar-linkText">Меню</span>
            </button>
          </div>
        </div>
      </div>

      {#if isMenuOpen}
        <div class="mx-auto w-full max-w-[450px] px-4">
          <aside
            class="Navbar-linkContainer section-shadow z-0 px-0! py-2"
            transition:slide={{ duration: 150 }}
          >
            <ul class="w-full">
              <li in:fly={{ x: -20 }}>
                <a
                  class="flex items-center py-1 active:bg-neutral-200"
                  href="/help"
                  onclick={closeMenu}
                >
                  <i class="fas fa-question w-10! pl-6 text-left! text-sm"></i>
                  <span class="px-3">Справка</span>
                </a>
              </li>
              <li in:fly={{ x: -20, delay: 50 }}>
                <button
                  class="flex w-full items-center py-1 active:bg-neutral-200"
                  type="button"
                  onclick={logout}
                >
                  <i class="fas fa-arrow-right-from-bracket w-10! pl-6 text-left! text-sm"></i>
                  <span class="px-3">Выйти</span>
                </button>
              </li>
            </ul>
          </aside>
        </div>
      {/if}
    </div>
  </div>
{/if}

<script lang="ts">
  import { clsx } from 'clsx'
  import { fly, slide } from 'svelte/transition'
  import { onOutsideClick } from '$utils/ui/onOutsideClick'
  import { userStore } from '$stores/user'
  import { logout } from '$utils/firebase/auth/logout'

  const user = $derived($userStore.user)
  let isMenuOpen = $state(false)

  const toggleMenu = (): void => {
    isMenuOpen = !isMenuOpen
  }

  const closeMenu = (): void => {
    isMenuOpen = false
  }

  const onLogout = async (): Promise<void> => {
    try {
      await logout()
    } catch {
      console.error('Произошла ошибка при попытке выйти')
    }
  }
</script>

{#if user}
  <div
    class={clsx(
      'AppHeader-userMenu z-1 absolute right-4 top-0 flex min-h-full',
      'backdrop-blur-xs cursor-pointer flex-col rounded-lg transition-colors',
      isMenuOpen && 'AppHeader-userMenu--open shadow-sm',
    )}
    use:onOutsideClick={{ callback: closeMenu }}
  >
    <button type="button" class="flex items-center rounded-lg" onclick={toggleMenu}>
      <img class="h-8 w-8 rounded-lg bg-teal-400" src={user.photoURL} alt="Аватар пользователя" />

      <div class="flex items-center gap-2 px-3">
        <span class="pb-[1px] text-sm">{user.displayName}</span>
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
      <aside class="items-center overflow-hidden py-2 text-sm" transition:slide={{ duration: 150 }}>
        <ul>
          <li in:fly={{ x: -20 }}>
            <a class="flex items-center py-1 hover:bg-neutral-700" href="/help">
              <i class="fas fa-question w-8! text-left! pl-4 text-xs"></i>
              <span class="px-3">Справка</span>
            </a>
          </li>
          <li in:fly={{ x: -20, delay: 50 }}>
            <button
              class="flex w-full items-center py-1 hover:bg-neutral-700"
              type="button"
              onclick={onLogout}
            >
              <i class="fas fa-arrow-right-from-bracket w-8! text-left! pl-4 text-xs"></i>
              <span class="px-3">Выйти</span>
            </button>
          </li>
        </ul>
      </aside>
    {/if}
    <!-- /User Menu -->
  </div>
{/if}

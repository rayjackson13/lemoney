<script lang="ts">
  import { page } from '$app/state'
  import type { NavigationItem } from '$types/navigation'
  import { clsx } from 'clsx'
  import TimeBlock from './TimeBlock.svelte'
  import ProfileSection from './ProfileSection.svelte'

  const navItems: NavigationItem[] = [
    {
      path: '/records',
      label: 'Бюджет',
    },
    {
      path: '/settings',
      label: 'Настройки',
      icon: 'fas fa-cog',
      iconOnly: true,
    },
  ]
</script>

<header class="AppHeader w-full py-2 text-neutral-200 shadow-md">
  <div
    class="relative mx-auto flex h-full w-full max-w-[1400px] items-center justify-between gap-4 px-4"
  >
    <nav class="AppHeader-navbar z-1 backdrop-blur-xs h-full rounded-lg px-4">
      <ul class="flex h-full items-center gap-4">
        {#each navItems as item (item.path)}
          {@const isCurrent = item.path === page.url.pathname}

          <li class="h-full">
            <a
              class={clsx(
                'flex h-full select-none  items-center transition-colors hover:text-white',
                isCurrent && 'pointer-events-none font-semibold text-white',
              )}
              href={item.path}
            >
              {#if item.icon}<i class={clsx(item.icon, 'w-auto! text-sm')}></i>{/if}

              <span class={clsx('pb-[1px] text-sm', item.iconOnly && 'sr-only')}>{item.label}</span>
            </a>
          </li>
        {/each}
      </ul>
    </nav>

    <TimeBlock />

    <ProfileSection />
  </div>
</header>

<style>
  .AppHeader {
    height: var(--header-height);
    background-color: #19212c;
    background-image: url('/pattern.svg');
    background-repeat: repeat-x;
  }

  :global(.AppHeader-navbar, .AppHeader-userMenu) {
    background-color: rgb(0 0 0 / 50%);
  }

  :global(.AppHeader-userMenu--open, .AppHeader-userMenu:hover) {
    background-color: rgb(0 0 0 / 80%);
    color: #fff;
  }
</style>

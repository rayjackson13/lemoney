<script lang="ts">
  import { page } from '$app/state'
  import type { NavigationItem } from '$types/navigation'
  import clsx from 'clsx'

  const { path, icon, label }: NavigationItem = $props()
  const isCurrent = $derived(path === page.url.pathname)
</script>

<a class={clsx('Navbar-link', isCurrent && 'Navbar-linkActive')} href={path}>
  <i class={`${icon} Navbar-linkIcon`}></i>
  <span class="Navbar-linkText">{label}</span>
</a>

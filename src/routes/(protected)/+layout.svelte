<script lang="ts">
  import { goto } from '$app/navigation'
  import { userStore } from '$stores/user'
  import Header from '$components/common/Header/index.svelte'
  import { fly } from 'svelte/transition'

  let { children } = $props()

  $effect(() => {
    if ($userStore.isReady && !$userStore.user) {
      goto('/login')
    }
  })
</script>

<div class="absolute top-0 left-0 w-full" transition:fly={{ y: -48 }}>
  <Header />
</div>

<main class="h-full w-full pt-12">
  <div class="relative mx-auto flex h-full w-full max-w-[1400px] px-4 py-8">
    {@render children?.()}
  </div>
</main>

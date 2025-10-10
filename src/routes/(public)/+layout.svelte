<script lang="ts">
  import { goto } from '$app/navigation'
  import { userStore } from '$stores/user'

  let { children } = $props()

  $effect(() => {
    console.log($userStore)
    if ($userStore.isReady && !!$userStore.user) {
      goto('/', { replaceState: true })
    }
  })
</script>

<main class="h-full w-full">
  {@render children?.()}
</main>

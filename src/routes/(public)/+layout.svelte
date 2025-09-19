<script lang="ts">
  import { goto } from '$app/navigation'
  import { userStore } from '$stores/user'

  let { children } = $props()

  const handleUserAuth = () => {
    console.log('handleUserAuth', $userStore)
    if ($userStore.isReady && !!$userStore.user) {
      goto('/', { replaceState: true })
    }
  }

  $effect(() => {
    handleUserAuth()
  })
</script>

{@render children?.()}

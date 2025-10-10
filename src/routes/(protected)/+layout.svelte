<script lang="ts">
  import Header from '$components/common/Header/index.svelte'
  import { fly } from 'svelte/transition'
  import { type Snippet } from 'svelte'
  import { FirebaseController } from '$utils/FirebaseController'
  import { timePeriod } from '$stores/timePeriod'
  import { userStore } from '$stores/user'
  import { goto } from '$app/navigation'
  import SplashScreen from '$components/common/SplashScreen/SplashScreen.svelte'
  import { appReady } from '$stores/appReady'

  type Props = {
    children: Snippet<[]>
  }

  let { children }: Props = $props()

  let unsubscribe: () => void

  $effect(() => {
    if ($appReady && !!$userStore.user) {
      unsubscribe = FirebaseController.watchTransactions($timePeriod)
    }

    return () => {
      if (unsubscribe) unsubscribe()
    }
  })

  $effect(() => {
    if ($userStore.isReady && !$userStore.user) {
      goto('/login', { replaceState: true })
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

<SplashScreen />

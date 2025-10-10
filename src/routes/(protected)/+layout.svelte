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
  import MobileNavbar from '$components/common/MobileNavbar/index.svelte'
  import TimeBlock from '$components/common/Header/TimeBlock.svelte'
  import { useMediaQuery } from '$utils/hooks/useMediaQuery'

  type Props = {
    children: Snippet<[]>
  }

  const isDesktop = useMediaQuery('xl')
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

{#if $isDesktop}
  <div class="absolute left-0 top-0 w-full" transition:fly={{ y: -48 }}>
    <Header />
  </div>
{/if}

{#if !$isDesktop}
  <TimeBlock />
{/if}

<main class="App-main h-full w-full xl:pt-12">
  <div class="relative mx-auto flex h-full w-full max-w-[1400px] py-4 xl:px-4 xl:py-8">
    {@render children?.()}
  </div>
</main>

{#if !$isDesktop}
  <MobileNavbar />
{/if}

<SplashScreen />

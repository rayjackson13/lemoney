<script lang="ts">
  import Header from '$components/common/Header/index.svelte'
  import { fly } from 'svelte/transition'
  import { type Snippet } from 'svelte'
  import { FirebaseController } from '$utils/firebase/FirebaseController'
  import { timePeriod } from '$stores/timePeriod'
  import { userStore } from '$stores/user'
  import { goto } from '$app/navigation'
  import SplashScreen from '$components/common/SplashScreen/SplashScreen.svelte'
  import { appReady } from '$stores/appReady'
  import MobileNavbar from '$components/common/MobileNavbar/index.svelte'
  import TimeBlock from '$components/common/Header/TimeBlock.svelte'
  import { useMediaQuery } from '$utils/hooks/useMediaQuery'
  import CreateTransactionModal from '$components/modals/CreateTransactionModal/CreateTransactionModal.svelte'

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

<main class="App-main">
  {#if !$isDesktop}
    <TimeBlock />
  {/if}

  <div class="App-mainContent">
    {@render children?.()}
  </div>
</main>

{#if !$isDesktop}
  <MobileNavbar />
{/if}

<SplashScreen />

<CreateTransactionModal />

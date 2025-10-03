<script lang="ts">
  import Header from '$components/common/Header/index.svelte'
  import { fly } from 'svelte/transition'
  import { type Snippet } from 'svelte'
  import { type UserInfo } from 'firebase/auth'
  import { userStore } from '$stores/user'
  import { FirebaseClientController } from '$utils/FirebaseClientController'
  import { timePeriod } from '$stores/timePeriod'

  type Props = {
    children: Snippet<[]>
    data: {
      user: UserInfo
    }
  }

  let { children, data }: Props = $props()

  if (data.user) {
    userStore.set({
      isReady: true,
      user: data.user,
    })
  }

  let unsubscribe: () => void

  const watchTransactions = async (dates: [Date, Date]) => {
    await FirebaseClientController.waitForAuth()
    unsubscribe = FirebaseClientController.watchTransactions(dates)
  }

  $effect(() => {
    watchTransactions($timePeriod)

    return () => {
      if (unsubscribe) unsubscribe()
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

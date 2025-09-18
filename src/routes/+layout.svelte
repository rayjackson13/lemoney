<script lang="ts">
  import '../app.css'
  import { FirebaseController } from '$utils/firebase'
  import Header from '$components/common/Header/index.svelte'
  import { userStore as user } from '$stores/user'
  import { fly } from 'svelte/transition'
  import { AjaxHandler } from '$utils/ajax'
  import type { Snippet } from 'svelte'
  import type { UserInfo } from '$types/user'

  type Props = {
    children: Snippet<[]>
    data: {
      token: string
      user: UserInfo
    }
  }

  let { children, data }: Props = $props()

  if (data.token) AjaxHandler.setToken(data.token)
  FirebaseController.initialize()
</script>

<main class="h-full w-full">
  {#if $user}
    <div class="absolute top-0 left-0 w-full" transition:fly={{ y: -48 }}>
      <Header user={$user} />
    </div>
  {/if}

  {@render children?.()}
</main>

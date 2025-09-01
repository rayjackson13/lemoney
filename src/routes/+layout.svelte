<script lang="ts">
  import '../app.css'
  import { FirebaseController } from '$utils/firebase'
  import Header from '$components/common/Header/index.svelte'
  import { userStore as user } from '$stores/user'
  import { fly } from 'svelte/transition'

  let { children } = $props()

  FirebaseController.initialize()
</script>

<main>
  {#if $user}
    <div class="absolute top-0 left-0 w-full" transition:fly={{ y: -48 }}>
      <Header user={$user} />
    </div>
  {/if}

  {@render children?.()}
</main>

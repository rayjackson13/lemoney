<script lang="ts">
  import '../app.css'
  import { FirebaseController } from '$utils/firebase'
  import { userStore } from '$stores/user'
  import Header from '$components/common/Header.svelte'

  let { children } = $props()

  FirebaseController.initialize()
</script>

<main>
  <Header user={$userStore} />

  {@render children?.()}
</main>

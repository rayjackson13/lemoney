<script lang="ts">
  import '../app.css'
  import { FirebaseController } from '$utils/firebase'
  import Header from '$components/common/Header.svelte'

  let { children, data } = $props()

  FirebaseController.initialize()
</script>

<main>
  <Header user={data.user} />
  {@render children()}
</main>

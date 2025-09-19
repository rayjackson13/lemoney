<script lang="ts">
  import '../app.css'
  import { FirebaseClientController } from '$utils/FirebaseClientController'
  import type { Snippet } from 'svelte'

  type Props = {
    children: Snippet<[]>
  }

  let { children }: Props = $props()

  FirebaseClientController.initialize()
</script>

<main class="h-full w-full">
  {@render children?.()}
</main>

<script lang="ts">
  import '../app.css'
  import { FirebaseController } from '$utils/firebase'
  import type { Snippet } from 'svelte'

  type Props = {
    children: Snippet<[]>
  }

  let { children }: Props = $props()

  FirebaseController.initialize()
</script>

<main class="h-full w-full">
  {@render children?.()}
</main>

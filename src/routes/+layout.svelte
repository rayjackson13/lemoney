<script lang="ts">
  import '../app.css'
  import { FirebaseController } from '$utils/FirebaseController'
  import type { Snippet } from 'svelte'

  type Props = {
    children: Snippet<[]>
  }

  let { children }: Props = $props()

  $effect.pre(() => {
    FirebaseController.initialize()
  })
</script>

{@render children?.()}

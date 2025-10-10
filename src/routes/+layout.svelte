<script lang="ts">
  import '../tw.css'
  import '../styles/index.scss'
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

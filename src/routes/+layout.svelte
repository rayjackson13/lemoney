<script lang="ts">
  import '../app.css'
  import { FirebaseClientController } from '$utils/FirebaseClientController'
  import type { Snippet } from 'svelte'
  import type { UserInfo } from 'firebase/auth'

  type Props = {
    children: Snippet<[]>
    data: {
      user: UserInfo | null
    }
  }

  let { children }: Props = $props()

  FirebaseClientController.initialize()
</script>

<main class="h-full w-full">
  {@render children?.()}
</main>

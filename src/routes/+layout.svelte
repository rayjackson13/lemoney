<script lang="ts">
  import '../tw.css'
  import '../styles/index.scss'
  import { FirebaseController } from '$utils/FirebaseController'
  import type { Snippet } from 'svelte'
  import { browser } from '$app/environment'

  type Props = {
    children: Snippet<[]>
  }

  let { children }: Props = $props()

  $effect.pre(() => {
    FirebaseController.initialize()
  })

  if (browser) {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

    // Disable body scroll on iOS when the keyboard is open
    window.addEventListener('focusin', () => {
      const focusedEl = document.activeElement

      if (
        isIOS &&
        (focusedEl instanceof HTMLInputElement || focusedEl instanceof HTMLTextAreaElement)
      ) {
        document.body.style.position = 'fixed'
        focusedEl.scrollIntoView()
      }
    })

    window.addEventListener('focusout', () => {
      if (isIOS) document.body.style.position = ''
    })
  }
</script>

{@render children?.()}

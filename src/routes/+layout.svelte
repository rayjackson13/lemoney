<script lang="ts">
  import '../tw.css'
  import '../styles/index.scss'
  import type { Snippet } from 'svelte'
  import { browser } from '$app/environment'
  import { isTouchDevice } from '$utils/platform/getOS'
  import { loadInitialData } from '$utils/firebase/helpers/loadInitialData'

  type Props = {
    children: Snippet<[]>
  }

  let { children }: Props = $props()

  $effect.pre(() => {
    try {
      loadInitialData()
    } catch {
      console.error('Не удалось загрузить данные')
    }
  })

  if (browser) {
    // Disable body scroll on iOS when the keyboard is open
    window.addEventListener('focusin', () => {
      const focusedEl = document.activeElement

      if (
        isTouchDevice() &&
        (focusedEl instanceof HTMLInputElement || focusedEl instanceof HTMLTextAreaElement)
      ) {
        document.body.style.position = 'fixed'
        setTimeout(() => {
          focusedEl.scrollIntoView({
            block: 'center',
            behavior: 'smooth',
          })
        }, 300)
      }
    })

    window.addEventListener('focusout', () => {
      if (isTouchDevice()) document.body.style.position = ''
    })
  }
</script>

{@render children?.()}

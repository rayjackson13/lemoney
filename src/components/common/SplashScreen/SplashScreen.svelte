<script lang="ts">
  import Logo from '$assets/icons/logo.svg?component'
  import { appReady } from '$stores/appReady'
  import { userStore } from '$stores/user'
  import { wait } from '$utils/wait'
  import { Spring } from 'svelte/motion'

  let isVisible = $state(!$appReady)
  let animationFinished = $state(false)

  const bgAnim = new Spring({ opacity: 1 }, { stiffness: 0.2, damping: 0.3, precision: 0.1 })
  const logoAnim = new Spring(
    { opacity: 0, scale: 0.85 },
    {
      stiffness: 0.05,
      damping: 0.15,
      precision: 0.001,
    },
  )

  const bgStyle = $derived.by(() => {
    const { opacity } = bgAnim.current
    return `opacity: ${opacity}`
  })

  const logoStyle = $derived.by(() => {
    const { scale, opacity } = logoAnim.current
    return `transform: scale(${scale}); opacity: ${opacity}`
  })

  const onLoad = async () => {
    await wait(200)
    await logoAnim.set({ opacity: 1, scale: 1 })
    animationFinished = true
  }

  const onBeforeClose = async () => {
    logoAnim.damping = 0.3
    logoAnim.precision = 0.1
    await Promise.allSettled([logoAnim.set({ opacity: 0, scale: 2 }), bgAnim.set({ opacity: 0 })])
    isVisible = false
  }

  $effect.pre(() => {
    if ($userStore.isReady) {
      onLoad()
    }
  })

  $effect.pre(() => {
    if ($appReady && animationFinished) {
      onBeforeClose()
    }
  })
</script>

{#if isVisible}
  <div class="absolute top-0 left-0 z-100 h-full w-full bg-white" style={bgStyle}>
    <div class="LoginBackground"></div>

    <div class="relative flex h-screen w-screen justify-center overflow-hidden">
      <div class="flex w-full flex-col items-center justify-center overflow-hidden px-4 pt-8 pb-24">
        <div class="flex w-full flex-col items-center justify-center gap-8 pb-16">
          <div style={logoStyle}>
            <Logo class="h-[56px] w-[194px] text-zinc-50 lg:h-[72px] lg:w-[250px]" />
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

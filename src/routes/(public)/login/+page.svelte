<script lang="ts">
  import Logo from '$assets/icons/logo.svg?component'
  import QuoteView from '$components/login/QuoteView.svelte'
  import { appReady } from '$stores/appReady.js'
  import { FirebaseController } from '$utils/FirebaseController.js'
  import { Spring } from 'svelte/motion'

  let { data } = $props()

  const config = {
    stiffness: 0.02,
    damping: 0.9,
    precision: 0.001,
  }

  const logoAnim = new Spring({ y: 120, opacity: 0, scale: 0.95 }, config)
  const quotesAnim = new Spring({ y: 50, opacity: 0, scale: 0.95 }, config)
  const buttonAnim = new Spring({ y: 50, opacity: 0 }, config)

  const logoStyle = $derived.by(() => {
    const { y, scale, opacity } = logoAnim.current
    return `transform: translateY(${y}px) scale(${scale}); opacity: ${opacity}`
  })

  const quotesStyle = $derived.by(() => {
    const { y, scale, opacity } = quotesAnim.current
    return `transform: translateY(${y}px) scale(${scale}); opacity: ${opacity}`
  })

  const buttonStyle = $derived.by(() => {
    const { y, opacity } = buttonAnim.current
    return `transform: translateY(${y}px); opacity: ${opacity}`
  })

  const onLoad = async (): Promise<void> => {
    logoAnim.set({ y: 50, opacity: 1, scale: 1 })

    setTimeout(() => {
      logoAnim.damping = 0.4
      quotesAnim.damping = 0.4
      buttonAnim.damping = 0.4

      logoAnim.set({ y: 0, opacity: 1, scale: 1 }, { preserveMomentum: 1 })
      quotesAnim.set({ y: 0, opacity: 1, scale: 1 })
      buttonAnim.set({ y: 0, opacity: 1 })
    }, 1500)
  }

  $effect.pre(() => {
    if ($appReady) {
      onLoad()
    }
  })

  const onLoginPressed = async () => {
    try {
      await FirebaseController.authorize()
    } catch (e) {
      console.error(e)
    }
  }
</script>

<svelte:head>
  <title>lemoney | Войти</title>
</svelte:head>

<div class="LoginBackground"></div>

<div class="relative flex h-screen w-screen justify-center overflow-hidden">
  <div
    class="flex w-full max-w-[440px] flex-col items-center justify-center overflow-hidden px-4 pb-24 pt-8"
  >
    <div class="flex w-full flex-col items-center justify-center gap-8">
      <div style={logoStyle}>
        <Logo class="h-[56px] w-[194px] text-zinc-50 lg:h-[72px] lg:w-[250px]" />
      </div>

      <div style={quotesStyle} class="w-full">
        <QuoteView quote={data.quote} />
      </div>

      <div class="w-full" style={buttonStyle}>
        <button type="button" class="Button-light" onclick={onLoginPressed}>
          <i class="fab fa-google text-[16px]"></i>
          Войти с Google
        </button>
      </div>
    </div>
  </div>
</div>

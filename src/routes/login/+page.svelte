<script lang="ts">
	import { goto } from '$app/navigation'
	import Logo from '$assets/icons/logo.svg?component'
	import QuoteView from '$components/login/QuoteView.svelte'
	import { FirebaseController } from '$utils/firebase.js'
	import { onMount } from 'svelte'
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

	onMount(() => {
		logoAnim.set({ y: 50, opacity: 1, scale: 1 })

		setTimeout(() => {
			logoAnim.damping = 0.4
			quotesAnim.damping = 0.4
			buttonAnim.damping = 0.4

			logoAnim.set({ y: 0, opacity: 1, scale: 1 }, { preserveMomentum: 1 })
			quotesAnim.set({ y: 0, opacity: 1, scale: 1 })
			buttonAnim.set({ y: 0, opacity: 1 })
		}, 1500)
	})

	const onLoginPressed = async () => {
		await FirebaseController.authorize()
		goto('/')
	}
</script>

<svelte:head>
	<title>lemoney | Войти</title>
</svelte:head>

<div class="LoginBackground"></div>

<div class="relative flex h-screen w-screen justify-center">
	<main
		class="flex w-full max-w-[440px] flex-col items-center justify-center overflow-hidden px-4 pt-8 pb-24"
	>
		<div class="flex w-full flex-col items-center justify-center gap-8">
			<div style={logoStyle}>
				<Logo class="h-[56px] w-[194px] lg:h-[72px] lg:w-[250px]" />
			</div>

			<div style={quotesStyle}>
				<QuoteView quote={data.quote} />
			</div>

			<div class="w-full" style={buttonStyle}>
				<button type="button" class="Button-light" onclick={onLoginPressed}>
					<i class="fab fa-google text-[16px]"></i>
					Войти с Google
				</button>
			</div>
		</div>
	</main>
</div>

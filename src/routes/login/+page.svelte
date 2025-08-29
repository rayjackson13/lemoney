<script lang="ts">
	import Logo from '$assets/icons/logo.svg?component'
	import QuoteView from '$components/login/QuoteView.svelte'

	export let data
</script>

<svelte:head>
	<title>lemoney | Войти</title>
</svelte:head>

<div class="LoginBackground"></div>

<div class="relative flex h-screen w-screen justify-center">
	<main
		class="flex w-full max-w-[440px] flex-col items-center justify-center gap-8 px-4 pt-8 pb-24"
	>
		<Logo class="h-[56px] w-[194px] lg:h-[72px] lg:w-[250px]" />

		<QuoteView quote={data.quote} />

		<button type="button" class="Button-light" on:click={() => alert('login')}>
			<i class="fab fa-google text-[16px]"></i>
			Войти с Google
		</button>
	</main>
</div>

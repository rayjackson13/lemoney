<script lang="ts">
	import type { Quote } from '$routes/login/types'
	import { fly } from 'svelte/transition'

	export let quote: Quote
</script>

<div
	class="root w-full rounded-lg px-8 py-4 shadow-sm backdrop-blur-xs lg:px-12 lg:py-6"
	in:fly={{ y: 100, duration: 250, delay: 500 }}
>
	<i class="fa-solid fa-quote-left absolute -top-4 left-4 text-[32px] text-slate-700"></i>

	<p class="mb-1 text-center text-base leading-5 font-light tracking-[-0.04px]">
		{quote.message}
	</p>

	<span class="block text-right text-xs leading-3 font-light tracking-[-0.04px] italic opacity-70">
		{quote.author}
	</span>
</div>

<style scoped>
	.root {
		background-color: rgb(255 255 255 / 70%);
	}
</style>

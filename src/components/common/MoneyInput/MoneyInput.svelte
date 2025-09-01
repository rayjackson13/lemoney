<script lang="ts">
  import { onMount } from 'svelte'
  import type { InputMask } from 'imask/esm'
  import imask from 'imask'
  import clsx from 'clsx'
  import { fly } from 'svelte/transition'

  let inputRef: HTMLInputElement
  let mask: InputMask
  let value = $state<number | null>(null)

  onMount(() => {
    mask = imask(inputRef, {
      mask: Number,
      scale: 0,
      signed: false,
      thousandsSeparator: ' ',
      padFractionalZeros: false,
      normalizeZeros: true,
      max: 99_999_999,
    })

    mask.on('accept', () => {
      value = mask.unmaskedValue ? Number(mask.unmaskedValue) : null
      console.log(value)
    })
  })
</script>

<div class="relative">
  <input
    bind:this={inputRef}
    class={clsx('Input w-30 text-right', value !== null && 'pr-5!')}
    type="text"
    placeholder="Сумма"
  />

  {#if value !== null}
    <div
      class="pointer-events-none absolute top-0 right-0 flex h-full items-center justify-center pr-2 text-sm text-slate-900 opacity-70"
      in:fly={{ x: 8 }}
    >
      <span class="w-2 text-right">&#x20BD;</span>
    </div>
  {/if}
</div>

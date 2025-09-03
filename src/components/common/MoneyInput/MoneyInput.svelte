<script lang="ts">
  import { onMount } from 'svelte'
  import type { InputMask } from 'imask/esm'
  import imask from 'imask'
  import clsx from 'clsx'
  import { fly } from 'svelte/transition'

  type Props = {
    classes?: {
      adornment?: string
      input?: string
      root?: string
    }
    placeholder?: string
    value: number | null
  }

  const maskOptions = {
    mask: Number,
    scale: 0,
    signed: false,
    thousandsSeparator: ' ',
    padFractionalZeros: false,
    normalizeZeros: true,
    max: 99_999_999,
  }

  let inputRef: HTMLInputElement
  let mask: InputMask
  let { classes, placeholder, value = $bindable() }: Props = $props()
  let inputValue = $derived(String(value ?? ''))

  onMount(() => {
    mask = imask(inputRef, maskOptions)

    mask.on('accept', () => {
      value = mask.unmaskedValue ? Number(mask.unmaskedValue) : null
    })
  })
</script>

<div class={clsx('relative', classes?.root)}>
  <input
    bind:this={inputRef}
    class={clsx('Input w-30 text-right', !!inputValue && 'pr-5!', classes?.input)}
    type="text"
    {placeholder}
    bind:value={inputValue}
  />

  {#if !!inputValue}
    <div
      class={clsx(
        'pointer-events-none absolute top-0 right-0 flex h-full items-center justify-center pr-2 text-sm text-slate-900 opacity-70',
        classes?.adornment,
      )}
      in:fly={{ x: 8 }}
    >
      <span class="w-2 text-right">&#x20BD;</span>
    </div>
  {/if}
</div>

<script lang="ts">
  import clsx from 'clsx'
  import { maska } from 'maska/svelte'
  import type { MaskInputOptions } from 'maska'

  type Props = {
    classes?: {
      adornment?: string
      input?: string
      root?: string
    }
    maxLength?: number
    mode?: 'money' | 'percent' | 'normal'
    onInput?: (v: number | null) => unknown
    placeholder?: string
    value: number | null
  }

  const formatter = new Intl.NumberFormat('ru', {
    maximumFractionDigits: 0,
  })

  let {
    classes,
    placeholder,
    onInput,
    maxLength,
    mode = 'money',
    value = $bindable(),
  }: Props = $props()
  let inputValue = $derived.by(() => {
    if (!value) return ''

    return mode === 'money' ? formatter.format(value) : String(value)
  })
  let inputRef: HTMLInputElement

  const maskOptions: MaskInputOptions = {
    mask: mode === 'percent' ? '' : '#########',
    number: {
      locale: 'ru',
      fraction: 0,
      unsigned: true,
    },
    onMaska: ({ unmasked }) => {
      value = unmasked ? Number(unmasked) : 0
      if (onInput && typeof onInput === 'function') onInput(value)
    },
    preProcess: (text) => {
      return maxLength ? text.replace(/\s+/g, '').slice(0, maxLength) : text
    },
  }

  const onFocus = () => {
    inputRef?.select()
  }
</script>

<span class={clsx('relative', classes?.root)}>
  <input
    bind:this={inputRef}
    bind:value={inputValue}
    use:maska={maskOptions}
    onfocus={onFocus}
    class={clsx('Input Input-numeric', mode === 'normal' && 'pr-2!', classes?.input)}
    type="text"
    inputmode="numeric"
    {placeholder}
  />

  {#if mode !== 'normal'}
    <div
      class={clsx(
        'pointer-events-none absolute top-0 right-0 flex h-full items-center justify-center pr-2 text-sm text-slate-900 opacity-70',
        classes?.adornment,
      )}
    >
      <span class="w-4 text-right">{mode === 'money' ? '\u20bd' : '%'}</span>
    </div>
  {/if}
</span>

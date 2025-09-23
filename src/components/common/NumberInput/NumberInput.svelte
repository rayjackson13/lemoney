<script lang="ts">
  import { evaluateNumString } from '$utils/numbers'
  import clsx from 'clsx'
  import type { FormEventHandler } from 'svelte/elements'

  type Props = {
    classes?: {
      adornment?: string
      input?: string
      root?: string
    }
    maxValue?: number
    mode?: 'money' | 'percent' | 'normal'
    onInput?: (v: number | null) => unknown
    placeholder?: string
    value: number | null | undefined
  }

  let {
    classes,
    placeholder,
    onInput,
    maxValue,
    mode = 'money',
    value = $bindable(),
  }: Props = $props()

  const getInputValue = (): string => (!value ? '' : String(value))

  let error = $state<string | null>(null)
  let inputValue = $state(getInputValue())
  let inputRef: HTMLInputElement

  const handleBeforeInput = (ev: InputEvent) => {
    const allowedChars = /^[\d+-]+$/
    const char = ev.data

    if (!char) return

    if (!allowedChars.test(char)) {
      ev.preventDefault()
    }
  }

  const handleInput: FormEventHandler<HTMLInputElement> = (ev) => {
    const text = ev.currentTarget.value

    try {
      error = null
      const result = evaluateNumString(text, maxValue)
      value = result

      if (typeof onInput === 'function') {
        onInput(value)
      }
    } catch (e) {
      console.error(e)
      error = (e as Error).message
    }
  }

  const handleFocus = () => {
    inputRef?.select()
  }

  const handleBlur = () => {
    inputValue = getInputValue()
  }
</script>

<span class={clsx('relative', classes?.root)}>
  <input
    bind:this={inputRef}
    bind:value={inputValue}
    onfocus={handleFocus}
    onblur={handleBlur}
    oninput={handleInput}
    onbeforeinput={handleBeforeInput}
    class={clsx(
      'Input Input-numeric',
      mode === 'normal' && 'pr-2!',
      !!error && 'outline-red-800!',
      classes?.input,
    )}
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

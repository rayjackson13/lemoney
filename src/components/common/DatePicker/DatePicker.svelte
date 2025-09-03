<script lang="ts">
  import { onOutsideClick } from '$utils/ui/onOutsideClick'
  import { addMonths, format, getDay, startOfMonth } from 'date-fns'
  import { ru } from 'date-fns/locale'
  import { fly } from 'svelte/transition'
  import imask from 'imask'
  import { onMount } from 'svelte'
  import type { FormEventHandler } from 'svelte/elements'
  import { onBlurWithin } from '$utils/ui/onBlurWithin'
  import clsx from 'clsx'
  import { dateToISOString, parseDateFromInputString, parseDateFromISOString } from '$utils/dates'
  import { getDates } from './helpers/getDates'

  type Props = {
    classes?: {
      adornment?: string
      input?: string
      root?: string
    }
    placeholder?: string
    value?: string | null
  }

  let { classes, placeholder, value = $bindable() }: Props = $props()
  let isCalendarVisible = $state(false)
  let currentMonth = $state(new Date().getMonth())
  let currentYear = $state(new Date().getFullYear())

  let inputRef: HTMLInputElement
  const selectedDate = $derived(value ? parseDateFromISOString(value)! : null)
  const formattedDate = $derived(selectedDate ? format(selectedDate, 'dd.MM.yyyy') : '')
  const firstDayOfWeek = $derived(getDay(startOfMonth(new Date(currentYear, currentMonth))))

  const openCalendar = () => {
    isCalendarVisible = true
  }

  const closeCalendar = () => {
    if (document.activeElement !== inputRef) {
      isCalendarVisible = false
    }
  }

  const selectDate = (date: Date | null) => {
    if (!date) return

    value = dateToISOString(date)
    closeCalendar()
  }

  const changeMonth = (offset: number) => {
    const date = addMonths(new Date(currentYear, currentMonth), offset)
    currentMonth = date.getMonth()
    currentYear = date.getFullYear()
  }

  const onInput: FormEventHandler<HTMLInputElement> = (ev) => {
    const inputValue = (ev.currentTarget as HTMLInputElement)?.value
    const date = parseDateFromInputString(inputValue)

    if (!date) return

    value = dateToISOString(date)
    currentMonth = date.getMonth()
    currentYear = date.getFullYear()
  }

  const onFocus = () => {
    inputRef.select()
    openCalendar()
  }

  const keyHandler = (ev: KeyboardEvent): void => {
    if (ev.code === 'Escape') {
      inputRef.blur()
      closeCalendar()
    }
  }

  const isSelected = (date: Date): boolean =>
    !!selectedDate && dateToISOString(date) === dateToISOString(selectedDate)

  onMount(() => {
    imask(inputRef, { mask: Date })
    document.addEventListener('keydown', keyHandler)

    return () => {
      document.removeEventListener('keydown', keyHandler)
    }
  })
</script>

<div
  class={clsx('relative h-8 w-30', classes?.root)}
  use:onOutsideClick={closeCalendar}
  use:onBlurWithin={closeCalendar}
>
  <input
    bind:this={inputRef}
    type="text"
    class={clsx('Input w-full', classes?.input)}
    onfocus={onFocus}
    oninput={onInput}
    value={formattedDate}
    {placeholder}
  />

  <div
    class={clsx(
      'pointer-events-none absolute top-0 right-0 flex h-8 w-8 items-center justify-center text-sm text-slate-500',
      classes?.adornment,
    )}
  >
    <i class="fas fa-calendar"></i>
  </div>

  {#if isCalendarVisible}
    <div
      class="absolute z-10 mt-1 w-64 overflow-hidden rounded-lg bg-white shadow-lg"
      transition:fly={{ y: -8, duration: 200 }}
    >
      <div
        class="flex items-center justify-between border-b-1 border-b-gray-200 bg-neutral-50 px-4 py-2"
        in:fly={{ x: 16, duration: 200 }}
      >
        <button
          onclick={() => changeMonth(-1)}
          class="IconButton text-sm"
          aria-label="Предыдущий месяц"
          tabindex="-1"
          type="button"
        >
          <i class="fas fa-chevron-left"></i>
        </button>

        <span class="text-sm font-medium text-slate-700 capitalize select-none">
          {format(new Date(currentYear, currentMonth), 'LLLL yyyy', { locale: ru })}
        </span>

        <button
          onclick={() => changeMonth(1)}
          class="IconButton text-sm"
          aria-label="Следующий месяц"
          tabindex="-1"
          type="button"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>

      <div class="grid grid-cols-7 gap-1 p-2" in:fly={{ x: 16, delay: 50, duration: 200 }}>
        {#each ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] as day (day)}
          <div
            class="flex h-5 items-center justify-center text-center text-xs font-medium text-slate-500 select-none"
          >
            {day}
          </div>
        {/each}

        {#each getDates(currentYear, currentMonth) as date, index (date?.getTime())}
          <button
            class={clsx(
              'h-8 cursor-pointer rounded text-center text-sm transition-colors hover:bg-gray-200 active:bg-gray-300',
              isSelected(date) && 'bg-slate-700 text-white',
            )}
            style={index === 0 ? `grid-column: ${firstDayOfWeek}` : ''}
            onclick={() => selectDate(date)}
            tabindex="-1"
            type="button"
          >
            {date ? format(date, 'd') : ''}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>

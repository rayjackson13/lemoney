<script lang="ts">
  import { onOutsideClick } from '$utils/ui/onOutsideClick'
  import { addMonths, format, getDay, getDaysInMonth, isValid, startOfMonth } from 'date-fns'
  import { ru } from 'date-fns/locale'
  import { fly } from 'svelte/transition'
  import imask from 'imask'
  import { onMount } from 'svelte'
  import type { FormEventHandler } from 'svelte/elements'
  import { onBlurWithin } from '$utils/ui/onBlurWithin'
  import clsx from 'clsx'

  type Props = {
    defaultValue?: Date
  }

  let inputRef: HTMLInputElement
  let { defaultValue = new Date() }: Props = $props()
  let selectedDate = $state(defaultValue)
  let isCalendarVisible = $state(false)
  let currentMonth = $state(new Date().getMonth())
  let currentYear = $state(new Date().getFullYear())

  const firstDayOfWeek = $derived.by(() =>
    getDay(startOfMonth(new Date(currentYear, currentMonth))),
  )

  const getDates = () => {
    const totalDays = getDaysInMonth(new Date(currentYear, currentMonth))
    const dates = []

    for (let i = 1; i <= totalDays; i++) {
      dates.push(new Date(currentYear, currentMonth, i))
    }

    return dates
  }

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

    selectedDate = date
    closeCalendar()
  }

  const formattedDate = $derived.by(() => (selectedDate ? format(selectedDate, 'dd.MM.yyyy') : ''))

  const prevMonthClicked = () => {
    const prev = addMonths(new Date(currentYear, currentMonth), -1)
    currentMonth = prev.getMonth()
    currentYear = prev.getFullYear()
  }

  const nextMonthClicked = () => {
    const next = addMonths(new Date(currentYear, currentMonth), 1)
    currentMonth = next.getMonth()
    currentYear = next.getFullYear()
  }

  const onInput: FormEventHandler<HTMLInputElement> = (ev) => {
    const value = (ev.currentTarget as HTMLInputElement)?.value
    const [day, month, year] = value.split('.').map((i) => Number(i))
    const date = new Date(year, month - 1, day)

    if (String(year).length === 4 && isValid(date)) {
      selectedDate = date
      currentMonth = date.getMonth()
      currentYear = date.getFullYear()
    }
  }

  const keyHandler = (ev: KeyboardEvent): void => {
    if (ev.code === 'Escape') {
      inputRef.blur()
      closeCalendar()
    }
  }

  const isSelected = (date: Date): boolean =>
    selectedDate && format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')

  onMount(() => {
    imask(inputRef, { mask: Date })
    document.addEventListener('keydown', keyHandler)

    return () => {
      document.removeEventListener('keydown', keyHandler)
    }
  })
</script>

<div class="relative h-8 w-30" use:onOutsideClick={closeCalendar} use:onBlurWithin={closeCalendar}>
  <input
    bind:this={inputRef}
    type="text"
    class="Input w-full"
    onfocus={openCalendar}
    oninput={onInput}
    value={formattedDate}
  />

  <div
    class="pointer-events-none absolute top-0 right-0 flex h-8 w-8 items-center justify-center text-sm text-slate-500"
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
          onclick={prevMonthClicked}
          class="IconButton text-sm"
          aria-label="Предыдущий месяц"
          tabindex="-1"
        >
          <i class="fas fa-chevron-left"></i>
        </button>

        <span class="text-sm font-medium text-slate-700 capitalize select-none">
          {format(new Date(currentYear, currentMonth), 'LLLL yyyy', { locale: ru })}
        </span>

        <button
          onclick={nextMonthClicked}
          class="IconButton text-sm"
          aria-label="Следующий месяц"
          tabindex="-1"
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

        {#each getDates() as date, index (date?.getTime())}
          <button
            class={clsx(
              'h-8 cursor-pointer rounded text-center text-sm transition-colors hover:bg-gray-200 active:bg-gray-300',
              isSelected(date) && 'bg-slate-700 text-white',
            )}
            style={index === 0 ? `grid-column: ${firstDayOfWeek}` : ''}
            class:selected={isSelected(date)}
            onclick={() => selectDate(date)}
            tabindex="-1"
          >
            {date ? format(date, 'd') : ''}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>

<script lang="ts">
  import { timePeriod } from '$stores/timePeriod'
  import { clsx } from 'clsx'
  import {
    addMonths,
    format,
    getDate,
    isFirstDayOfMonth,
    isLastDayOfMonth,
    lastDayOfMonth,
    setDate,
  } from 'date-fns'
  import { ru } from 'date-fns/locale'

  const formatOpts = { locale: ru }

  const periodLabel = $derived.by((): string => {
    if (isFirstDayOfMonth($timePeriod[0]) && isLastDayOfMonth($timePeriod[1])) {
      const formatted = format($timePeriod[0], 'LLLL yyyy', { locale: ru })
      return formatted.charAt(0).toUpperCase() + formatted.slice(1)
    }

    const formatStr = 'dd LLL'
    return (
      `${format($timePeriod[0], formatStr, formatOpts)}` +
      ' \u2014 ' +
      `${format($timePeriod[1], formatStr, formatOpts)}`
    ).replace(/\./g, '')
  })

  const isNextDisabled = $derived.by((): boolean => {
    return $timePeriod[1].getTime() > new Date().getTime()
  })

  const shiftDateByMonths = (date: Date, offset: number): Date => {
    const isFirstDate = date.getDate() === 1
    const shifted = addMonths(date, offset)
    const lastDay = getDate(lastDayOfMonth(shifted))

    return setDate(shifted, isFirstDate ? 1 : lastDay)
  }

  const shiftDateRange = (range: [Date, Date], offset: number): [Date, Date] => {
    return range.map((date) => shiftDateByMonths(date, offset)) as [Date, Date]
  }

  const prevPeriodClicked = (): void => {
    const range = shiftDateRange($timePeriod, -1)
    timePeriod.set(range)
  }

  const nextPeriodClicked = (): void => {
    if (isNextDisabled) return

    const range = shiftDateRange($timePeriod, 1)
    timePeriod.set(range)
  }
</script>

<div class="absolute top-0 left-0 flex h-full w-full justify-center">
  <div
    class="AppHeader-timeBlock flex h-full w-54 items-center gap-2 rounded-lg px-2 backdrop-blur-xs select-none"
  >
    <button
      class="h-8 w-8 transition-colors hover:text-white"
      aria-label="Предыдущий период"
      onclick={prevPeriodClicked}
    >
      <i class="fas fa-arrow-left text-sm"></i>
    </button>

    <span class="flex-1 pb-[1px] text-center text-sm">{periodLabel}</span>

    <button
      disabled={isNextDisabled}
      class={clsx(
        'h-8 w-8 transition-colors hover:text-white',
        isNextDisabled && 'pointer-events-none opacity-50',
      )}
      aria-label="Следующий период"
      onclick={nextPeriodClicked}
    >
      <i class="fas fa-arrow-right text-sm"></i>
    </button>
  </div>
</div>

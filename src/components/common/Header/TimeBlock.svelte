<script lang="ts">
  import { timePeriod } from '$stores/timePeriod'
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

<div class="TimeBlock-outer">
  <div class="TimeBlock-root section-shadow">
    <button class="TimeBlock-button" aria-label="Предыдущий период" onclick={prevPeriodClicked}>
      <i class="TimeBlock-buttonIcon fas fa-arrow-left"></i>
    </button>

    <span class="TimeBlock-text">{periodLabel}</span>

    <button
      disabled={isNextDisabled}
      class="TimeBlock-button"
      aria-label="Следующий период"
      onclick={nextPeriodClicked}
    >
      <i class="TimeBlock-buttonIcon fas fa-arrow-right"></i>
    </button>
  </div>
</div>

<style lang="scss">
  @use '$styles/theme' as *;

  .TimeBlock-outer {
    display: flex;
    width: 100%;
    justify-content: center;
    padding-inline: 16px;
    padding-top: 16px;

    @include screen(xl) {
      position: absolute;
      top: 0;
      left: 0;
      padding-inline: 0;
      padding-top: 0;
      height: 100%;
    }
  }

  .TimeBlock-root {
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
    gap: 8px;
    border-radius: 32px;
    background-color: var(--color-neutral-50);
    user-select: none;
    padding-inline: 8px;
    overflow: hidden;
    max-width: 450px;

    @include screen(xl) {
      background-color: rgb(0 0 0 / 50%);
      backdrop-filter: blur(4px);
      width: 216px;
      box-shadow: none;
      border-radius: 8px;
    }
  }

  .TimeBlock-button {
    width: 40px;
    height: 40px;
    color: var(--color-slate-500);
    transition:
      color,
      background-color 0.15s;

    @include screen(xl) {
      color: var(--color-gray-200);
      height: 32px;
      width: 32px;
    }
  }

  .TimeBlock-button:hover {
    @include screen(xl) {
      color: white;
    }
  }

  .TimeBlock-button:active {
    background-color: var(--color-neutral-200);
    color: var(--color-slate-700);

    @include screen(xl) {
      background-color: transparent;
      color: var(--color-gray-200);
      opacity: 0.7;
    }
  }

  .TimeBlock-button[disabled] {
    pointer-events: none;
    opacity: 0.5;
  }

  .TimeBlock-buttonIcon {
    font-size: 14px;
  }

  .TimeBlock-text {
    flex: 1;
    padding-bottom: 1px;
    text-align: center;
    font-size: 14px;
    line-height: 20px;
  }
</style>

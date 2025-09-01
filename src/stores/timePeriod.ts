import { writable } from 'svelte/store'
import { lastDayOfMonth, setDate } from 'date-fns'

const getNormalizedTodayDate = (): Date => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

const getDefaultPeriod = (): [Date, Date] => {
  const today = getNormalizedTodayDate()

  return [setDate(today, 1), lastDayOfMonth(today)]
}

export const timePeriod = writable<[Date, Date]>(getDefaultPeriod())

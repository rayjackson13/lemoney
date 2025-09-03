import { format, isValid, lastDayOfMonth, setDate } from 'date-fns'

export const parseDateFromISOString = (iso: string): Date | null => {
  if (!iso) return null

  const date = new Date(iso)
  return isValid(date) ? date : null
}

export const parseDateFromInputString = (text: string): Date | null => {
  const [day, month, year] = text.split('.')
  return parseDateFromISOString(`${year}-${month}-${day}`)
}

export const dateToISOString = (date: Date) => format(date, 'yyyy-MM-dd')

export const validateISOString = (text: string): boolean => !!text && isValid(new Date(text))

const getNormalizedTodayDate = (): Date => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

export const getDefaultTimePeriod = (): [Date, Date] => {
  const today = getNormalizedTodayDate()

  return [setDate(today, 1), lastDayOfMonth(today)]
}

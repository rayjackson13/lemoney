import { format, isValid } from 'date-fns'

export const parseDateFromISOString = (iso: string): Date | null => {
  const date = new Date(iso)
  return isValid(date) ? date : null
}

export const parseDateFromInputString = (text: string): Date | null => {
  const [day, month, year] = text.split('.')
  return parseDateFromISOString(`${year}-${month}-${day}`)
}

export const dateToISOString = (date: Date) => format(date, 'yyyy-MM-dd')

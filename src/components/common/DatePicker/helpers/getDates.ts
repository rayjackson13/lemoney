import { getDaysInMonth } from 'date-fns'

export const getDates = (year: number, month: number) => {
  const totalDays = getDaysInMonth(new Date(year, month))
  const dates = []

  for (let i = 1; i <= totalDays; i++) {
    dates.push(new Date(year, month, i))
  }

  return dates
}

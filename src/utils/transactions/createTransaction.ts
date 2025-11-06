import type { Transaction } from '$types/forms'
import { dateToISOString } from '$utils/dates'

export const createTransaction = (): Transaction => ({
  amount: null,
  category: null,
  date: dateToISOString(new Date()),
  description: '',
  id: crypto.randomUUID(),
  type: 'Expense',
})

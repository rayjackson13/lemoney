import type { Transaction } from '$types/forms'
import { dateToISOString } from '$utils/dates'
import { v4 as uuidv4 } from 'uuid'

export const createTransaction = (): Transaction => ({
  amount: null,
  category: null,
  date: dateToISOString(new Date()),
  description: '',
  id: uuidv4(),
  type: 'Expense',
})

import type { Option } from '$types/forms'

export const transactionTypes: Option[] = [
  { name: 'Расход', value: 'Expense', ribbon: 'bg-red-300 border-red-300' },
  { name: 'Доход', value: 'Income', ribbon: 'bg-green-300 border-green-300' },
  { name: 'План', value: 'ExpensePlanned', ribbon: 'bg-red-300 border-red-300' },
  { name: 'Инвестиции', value: 'Investment', ribbon: 'bg-violet-300 border-violet-300' },
  { name: 'Сбережения', value: 'Savings', ribbon: 'bg-amber-300 border-amber-300' },
]

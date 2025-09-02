const TransactionTypes = {
  Expense: 'Расход',
  ExpensePlanned: 'План',
  Income: 'Доход',
  Investment: 'Инвестиции',
  Savings: 'Сбережения',
} as const

export type Option = {
  name: string
  value: string
  ribbon?: string
}

export type Transaction = {
  amount: number | null
  category: string | null
  date: string
  description?: string
  id: string
  type?: keyof typeof TransactionTypes
}

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

export type ContextMenuOption = {
  name: string
  icon?: string
  onClick?: () => void
}

export type Transaction = {
  amount: number | null
  category: string | null
  date: string
  description?: string
  id: string
  type?: keyof typeof TransactionTypes
}

export type TransactionDTO = Transaction & {
  key: string
}

export type TransactionFilters = Partial<{
  query: string
  type: keyof typeof TransactionTypes
  category: string
  minAmount: number
  maxAmount: number
}>

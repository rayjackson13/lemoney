import type { Transaction, TransactionFilters } from '$types/forms'

export function filterTransactions(
  data: Transaction[],
  { query, type, category, minAmount, maxAmount }: TransactionFilters,
): Transaction[] {
  return data.filter((item) => {
    if (
      query &&
      (!item.description || !item.description.toLowerCase().includes(query.toLowerCase()))
    )
      return false

    if (type && item.type !== type) return false

    if (category && item.category !== category) return false

    if (minAmount && (!item.amount || item.amount < minAmount)) return false

    if (maxAmount && (!item.amount || item.amount > maxAmount)) return false

    return true
  })
}

import type { Transaction } from '$types/forms'

export function groupTransactionsByCategory(
  data: Transaction[],
): Map<string | null, Transaction[]> {
  return data
    .toSorted((a, b) => {
      if (!a.category) return 1
      if (!b.category) return -1

      return b.category.localeCompare(a.category)
    })
    .reduce((total: Map<string | null, Transaction[]>, current: Transaction) => {
      if (!total.has(current.category)) {
        total.set(current.category, [])
      }
      total.get(current.category)!.push(current)
      return total
    }, new Map())
}

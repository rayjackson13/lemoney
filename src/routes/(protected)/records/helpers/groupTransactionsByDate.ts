import type { Transaction } from '$types/forms'

export function groupTransactionsByDate(data: Transaction[]): Map<string, Transaction[]> {
  return data
    .toSorted((a, b) => b.date.localeCompare(a.date))
    .reduce((total: Map<string, Transaction[]>, current: Transaction) => {
      if (!total.has(current.date)) {
        total.set(current.date, [])
      }
      total.get(current.date)!.push(current)
      return total
    }, new Map())
}

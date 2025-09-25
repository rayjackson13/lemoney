import type { Transaction } from '$types/forms'

function sortTransactions(data: Transaction[]): Transaction[] {
  return data.reverse().toSorted((a, b) => b.date.localeCompare(a.date))
}

export function groupTransactionsByDate(data: Transaction[]): Map<string, Transaction[]> {
  return sortTransactions(data).reduce(
    (total: Map<string, Transaction[]>, current: Transaction) => {
      if (!total.has(current.date)) {
        total.set(current.date, [])
      }
      total.get(current.date)!.push(current)
      return total
    },
    new Map(),
  )
}

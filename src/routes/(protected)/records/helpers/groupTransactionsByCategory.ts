import type { Transaction } from '$types/forms'

type Grouped = {
  category: string | null
  transactions: Transaction[]
  total: number
}

export function groupTransactionsByCategory(data: Transaction[]): [string | null, Transaction[]][] {
  const map = new Map<string | null, Grouped>()

  for (const tx of data) {
    const key = tx.category
    const group = map.get(key)

    if (group) {
      group.transactions.push(tx)
      group.total += tx.amount ?? 0
    } else {
      map.set(key, {
        category: key,
        transactions: [tx],
        total: tx.amount ?? 0,
      })
    }
  }

  return Array.from(map.values())
    .sort((a, b) => b.total - a.total)
    .map(({ category, transactions }) => [category, transactions])
}

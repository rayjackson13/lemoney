import type { Transaction } from '$types/forms'

export function getTotalSum(transactions: Transaction[]): number {
  return transactions.reduce((total, current) => {
    const modifier = current.type === 'Income' ? 1 : -1

    return total + (current.amount ?? 0) * modifier
  }, 0)
}

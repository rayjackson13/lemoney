import type { Transaction } from '$types/forms'
import type { FetchFn } from '$types/global.js'
import { dateToISOString, getDefaultTimePeriod } from '$utils/dates.js'

async function loadTransactions(fetch: FetchFn): Promise<Transaction[]> {
  const baseURL = '/api/transactions'
  const dateRange = getDefaultTimePeriod()
  const params = new URLSearchParams()
  params.set('dateFrom', dateToISOString(dateRange[0]))
  params.set('dateTo', dateToISOString(dateRange[1]))

  try {
    const response = await fetch(`${baseURL}?${params.toString()}`)
    const { transactions: result } = await response.json()
    return result
  } catch (e) {
    console.error('Не удалось загрузить историю транзакций', e)
    return []
  }
}

export async function load({ fetch }) {
  const transactions = await loadTransactions(fetch)

  return {
    transactions,
  }
}

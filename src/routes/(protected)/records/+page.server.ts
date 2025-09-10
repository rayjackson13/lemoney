import type { Transaction } from '$types/forms'
import type { FetchFn } from '$types/global.js'
import { ajax } from '$utils/ajax.js'
import { dateToISOString, getDefaultTimePeriod } from '$utils/dates.js'

async function loadTransactions(fetch: FetchFn): Promise<Transaction[]> {
  const dateRange = getDefaultTimePeriod()
  const params = new URLSearchParams()
  params.set('dateFrom', dateToISOString(dateRange[0]))
  params.set('dateTo', dateToISOString(dateRange[1]))

  try {
    const { data } = await ajax<{ data: Transaction[] }>(
      `transactions?${params.toString()}`,
      {},
      fetch,
    )
    return data
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

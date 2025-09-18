import type { Transaction } from '$types/forms'
import type { FetchFn } from '$types/global.js'
import { AjaxHandler } from '$utils/ajax.js'
import { dateToISOString, getDefaultTimePeriod } from '$utils/dates.js'

async function loadTransactions(fetch: FetchFn, token?: string): Promise<Transaction[]> {
  if (!token) return []

  const dateRange = getDefaultTimePeriod()
  const params = new URLSearchParams()
  params.set('dateFrom', dateToISOString(dateRange[0]))
  params.set('dateTo', dateToISOString(dateRange[1]))

  try {
    AjaxHandler.setFetchAPI(fetch)
    AjaxHandler.setToken(token)
    const { data } = await AjaxHandler.get<{ data: Transaction[] }>(
      `transactions?${params.toString()}`,
    )
    return data
  } catch (e) {
    console.error('Не удалось загрузить историю транзакций', e)
    return []
  }
}

export async function load({ cookies, fetch }) {
  const token = cookies.get('__session')
  const transactions = await loadTransactions(fetch, token)

  return {
    transactions,
  }
}

import { query, where } from 'firebase/firestore'
import { getTransactionsRef } from './getRef'
import { dateToISOString } from '$utils/dates'

export const getTransactionQuery = ([from, to]: [Date, Date]) => {
  return query(
    getTransactionsRef(),
    where('date', '>=', dateToISOString(from)),
    where('date', '<=', dateToISOString(to)),
  )
}

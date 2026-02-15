import { get } from 'svelte/store'
import { getTransactionQuery } from './getQuery'
import { timePeriod } from '$stores/timePeriod'
import { getDocs } from 'firebase/firestore'
import type { TransactionDTO } from '$types/forms'
import { transactionsStore } from '$stores/transactions'

export const loadTransactions = async () => {
  const q = getTransactionQuery(get(timePeriod))
  const snapshot = await getDocs(q)

  const docs = snapshot.docs
    .map((doc) => ({
      ...(doc.data() as TransactionDTO),
      id: doc.id,
    }))
    .toSorted((a, b) => a.key.localeCompare(b.key))

  transactionsStore.set(docs)
}

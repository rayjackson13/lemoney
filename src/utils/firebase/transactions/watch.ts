import { onSnapshot } from 'firebase/firestore'
import { getTransactionQuery } from './getQuery'
import { transactionsStore } from '$stores/transactions'
import type { TransactionDTO } from '$types/forms'

export const watchTransactions = (dates: [Date, Date]): (() => void) => {
  const q = getTransactionQuery(dates)

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs
      .map((doc) => ({
        ...(doc.data() as TransactionDTO),
        id: doc.id,
      }))
      .toSorted((a, b) => a.key.localeCompare(b.key))

    transactionsStore.set(docs)
  })

  return unsubscribe
}

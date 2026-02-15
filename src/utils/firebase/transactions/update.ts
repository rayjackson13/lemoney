import { doc, updateDoc } from 'firebase/firestore'
import { getTransactionsRef } from './getRef'
import type { Transaction } from '$types/forms'

export const updateTransaction = (id: string, data: Transaction): Promise<void> =>
  updateDoc(doc(getTransactionsRef(), id), data)

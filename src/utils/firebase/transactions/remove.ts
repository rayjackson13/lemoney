import { deleteDoc, doc } from 'firebase/firestore'
import { getTransactionsRef } from './getRef'

export const removeTransaction = (id: string): Promise<void> =>
  deleteDoc(doc(getTransactionsRef(), id))

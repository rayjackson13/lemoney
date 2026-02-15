import type { Transaction } from '$types/forms'
import { doc, writeBatch } from 'firebase/firestore'
import { getTransactionsRef } from './getRef'
import { db } from '../core/firestore'

export const addTransactions = async (data: Transaction[]): Promise<void> => {
  const ref = getTransactionsRef()
  const timestamp = new Date().getTime()
  let batch = writeBatch(db)
  let count = 0

  for (const item of data) {
    const key = `${timestamp}-${count}`
    batch.set(doc(ref), { ...item, key })
    count++

    if (count === 5) {
      await batch.commit()
      batch = writeBatch(db)
    }
  }

  if (count > 0) {
    await batch.commit()
  }
}

import { collection } from 'firebase/firestore'
import { auth } from '../core/auth'
import { db } from '../core/firestore'

export const getTransactionsRef = () => {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('User unauthorized')
  return collection(db, `/users/${uid}/transactions`)
}

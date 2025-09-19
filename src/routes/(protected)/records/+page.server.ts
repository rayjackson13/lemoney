import {
  getAuth,
  onAuthStateChanged,
  type Auth,
  type Unsubscribe,
  type User,
  type UserInfo,
} from 'firebase/auth'
import { firebaseConfig } from '$utils/FirebaseClientController'
import { initializeServerApp, type FirebaseServerApp } from 'firebase/app'
import type { Transaction } from '$types/forms'
import { collection, getDocs, getFirestore } from 'firebase/firestore/lite'
import type { TransactionDTO } from '$types/forms'

const waitForUserState = async (auth: Auth, timeoutMs = 2000): Promise<User | null> => {
  let unsubscribe: Unsubscribe

  if (auth.currentUser) {
    return auth.currentUser
  }

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      unsubscribe()
      resolve(null)
    }, timeoutMs)

    unsubscribe = onAuthStateChanged(auth, (user) => {
      clearTimeout(timeout)
      unsubscribe()
      resolve(user)
    })
  })
}

const loadUserInfo = async (token?: string): Promise<UserInfo | null> => {
  const serverApp = initializeServerApp(firebaseConfig, {
    authIdToken: token,
  })

  const auth = getAuth(serverApp)
  const user = await waitForUserState(auth)
  return (user?.toJSON() as UserInfo) ?? null
}

const loadTransactions = async (
  app: FirebaseServerApp,
  user: UserInfo | null,
): Promise<Transaction[]> => {
  if (!user) return []

  const db = getFirestore(app)
  const collectionPath = `/users/${user.uid}/transactions`
  const docs = (await getDocs(collection(db, collectionPath))).docs
  return docs
    .map((doc) => ({
      ...(doc.data() as TransactionDTO),
      id: doc.id,
    }))
    .toSorted((a, b) => a.key.localeCompare(b.key))
}

export const load = async ({ cookies }) => {
  const token = cookies.get('session_token')
  const serverApp = initializeServerApp(firebaseConfig, { authIdToken: token })
  const user = await loadUserInfo(token)
  const transactions = await loadTransactions(serverApp, user)

  return { transactions }
}

import { initializeServerApp, type FirebaseServerApp } from 'firebase/app'
import {
  getAuth,
  onAuthStateChanged,
  type Auth,
  type Unsubscribe,
  type User,
  type UserInfo,
} from 'firebase/auth'
import { collection, getDocs, getFirestore, type Firestore } from 'firebase/firestore'
import { firebaseConfig } from './FirebaseClientController'
import type { Transaction, TransactionDTO } from '$types/forms'

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

export class FirebaseSSRController {
  private static _app: FirebaseServerApp
  private static _auth: Auth
  private static _db: Firestore
  private static isReady: boolean = false

  static initialize = async (token?: string) => {
    this._app = initializeServerApp(firebaseConfig, { authIdToken: token })
    this._auth = getAuth(this._app)
    this._db = getFirestore(this._app)

    await waitForUserState(this._auth)
    this.isReady = true
  }

  static getUser = async (): Promise<UserInfo | null> => {
    if (!this.isReady) {
      console.error('Attempted to use FirebaseSSRController before it was initialized.')
      return null
    }

    const user = this._auth.currentUser
    return (user?.toJSON() as UserInfo) ?? null
  }

  static loadTransactions = async (): Promise<Transaction[]> => {
    if (!this._auth) {
      console.error('Attempted to use FirebaseSSRController before it was initialized.')
      return []
    }

    const user = this._auth.currentUser
    if (!user) {
      console.error('User unauthorized.')
      return []
    }

    const db = getFirestore(this._app)
    const collectionPath = `/users/${user.uid}/transactions`
    const docs = (await getDocs(collection(db, collectionPath))).docs
    return docs
      .map((doc) => ({
        ...(doc.data() as TransactionDTO),
        id: doc.id,
      }))
      .toSorted((a, b) => a.key.localeCompare(b.key))
  }

  static waitForUserState = async (auth: Auth, timeoutMs = 2000): Promise<User | null> => {
    if (!this._auth) {
      console.error('SSR: Attempted to call Firebase Auth before it was initialized.')
      return null
    }

    if (auth.currentUser) {
      return auth.currentUser
    }

    let unsubscribe: Unsubscribe

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
}

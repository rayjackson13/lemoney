import { initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app'
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut,
  type Auth,
  type User,
} from 'firebase/auth'
import {
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  Query,
  query,
  updateDoc,
  where,
  writeBatch,
  type Firestore,
  type Unsubscribe,
} from 'firebase/firestore'
import type { Transaction, TransactionDTO } from '$types/forms'
import { userStore } from '$stores/user'
import { transactionsStore } from '$stores/transactions'
import { browser } from '$app/environment'
import Cookies from 'js-cookie'
import { dateToISOString } from './dates'

const provider = new GoogleAuthProvider()

export const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'lemoney-32aae.firebaseapp.com',
  projectId: 'lemoney-32aae',
  storageBucket: 'lemoney-32aae.firebasestorage.app',
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export class FirebaseClientController {
  private static _app: FirebaseApp
  private static _auth: Auth
  private static _db: Firestore
  private static _unsubscribeWatcher: Unsubscribe | null = null

  static initialize = () => {
    this._app = initializeApp(firebaseConfig)
    this._auth = getAuth(this._app)
    this._db = getFirestore(this._app)

    if (browser) onAuthStateChanged(this._auth, this.onAuthChanged)
  }

  private static onAuthChanged = async (user: User | null): Promise<void> => {
    if (!user) {
      if (this._unsubscribeWatcher && typeof this._unsubscribeWatcher === 'function') {
        this._unsubscribeWatcher()
        this._unsubscribeWatcher = null
      }

      userStore.set({ isReady: true, user: null })
      Cookies.remove('session_token')
      return
    }

    userStore.set({ isReady: true, user })
    const { token } = await user.getIdTokenResult()
    Cookies.set('session_token', token, {
      path: '/',
      sameSite: 'strict',
    })
  }

  static waitForAuth = async (): Promise<User | null> => {
    if (this._auth.currentUser) return Promise.resolve(this._auth.currentUser)

    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(this._auth, (user) => {
        unsubscribe()
        resolve(user)
      })
    })
  }

  private static checkAuth = (): void => {
    if (!this._auth) {
      throw new Error('Attempted to call Firebase Auth before it was initialized.')
    }
  }

  static authorize = async (): Promise<void> => {
    this.checkAuth()

    try {
      await setPersistence(this._auth, browserLocalPersistence)
      await signInWithPopup(this._auth, provider)
    } catch (error) {
      throw new Error(`Unsuccessful login attempt: ${error}`)
    }
  }

  static logout = async (): Promise<void> => {
    this.checkAuth()

    try {
      await signOut(this._auth)
    } catch (error) {
      throw new Error(`Unsuccessful logout attempt: ${error}`)
    }
  }

  static getTransactionsReference = (): CollectionReference => {
    this.checkAuth()

    const userUid = this._auth.currentUser?.uid
    if (!userUid) throw new Error('User unauthorized')

    const collectionPath = `/users/${userUid}/transactions`
    return collection(this._db, collectionPath)
  }

  static getTransactionsQuery = (dates: [Date, Date]): Query =>
    query(
      this.getTransactionsReference(),
      where('date', '>=', dateToISOString(dates[0])),
      where('date', '<=', dateToISOString(dates[1])),
    )

  static watchTransactions = (dates: [Date, Date]) => {
    const collectionRef = this.getTransactionsQuery(dates)

    this._unsubscribeWatcher = onSnapshot(collectionRef, (snapshot) => {
      const allDocs = snapshot.docs
        .map((doc) => ({
          ...(doc.data() as TransactionDTO),
          id: doc.id,
        }))
        .toSorted((a, b) => a.key.localeCompare(b.key))

      transactionsStore.set(allDocs)
    })

    return this._unsubscribeWatcher
  }

  static addTransactions = async (data: Transaction[]) => {
    const collectionRef = this.getTransactionsReference()
    const timestamp = new Date().getTime()
    let batch = writeBatch(this._db)
    let count = 0

    for (const item of data) {
      const key = `${timestamp}-${count}`
      const docRef = doc(collectionRef)
      batch.set(docRef, { ...item, key })
      count++

      if (count === 5) {
        await batch.commit()
        batch = writeBatch(this._db)
        count = 0
      }
    }

    if (count > 0) {
      await batch.commit()
    }
  }

  static updateTransaction = async (id: string, data: Transaction) => {
    try {
      const collectionRef = this.getTransactionsReference()
      await updateDoc(doc(collectionRef, id), data)
    } catch (e) {
      console.error(e)
    }
  }

  static removeTransaction = async (id: string) => {
    const collectionRef = this.getTransactionsReference()
    await deleteDoc(doc(collectionRef, id))
  }
}

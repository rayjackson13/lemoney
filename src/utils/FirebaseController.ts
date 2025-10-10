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
  type UserInfo,
} from 'firebase/auth'
import {
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  getDocs,
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
import { dateToISOString } from './dates'
import { timePeriod } from '$stores/timePeriod'
import { get } from 'svelte/store'
import { appReady } from '$stores/appReady'

const provider = new GoogleAuthProvider()

export const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'lemoney-32aae.firebaseapp.com',
  projectId: 'lemoney-32aae',
  storageBucket: 'lemoney-32aae.firebasestorage.app',
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export class FirebaseController {
  private static _app: FirebaseApp
  private static _auth: Auth
  private static _db: Firestore
  private static _unsubscribeWatcher: Unsubscribe | null = null

  static initialize = async () => {
    this._app = initializeApp(firebaseConfig)
    this._auth = getAuth(this._app)
    this._db = getFirestore(this._app)

    await this.loadInitialData()
  }

  static loadInitialData = async () => {
    if (!browser) return

    const user = await this.waitForAuth()
    userStore.set({ isReady: true, user })
    if (user) await this.loadCurrentTransactions()

    appReady.set(true)
  }

  static waitForAuth = async (): Promise<User | null> => {
    if (this._auth.currentUser) return Promise.resolve(this._auth.currentUser)

    const user = await new Promise<User | null>((resolve) => {
      const unsubscribe = onAuthStateChanged(this._auth, (user) => {
        unsubscribe()
        resolve(user)
      })
    })

    return user
  }

  static authorize = async (): Promise<void> => {
    try {
      await setPersistence(this._auth, browserLocalPersistence)
      const result = await signInWithPopup(this._auth, provider)
      const user = result.user.toJSON() as UserInfo
      userStore.set({ isReady: true, user })
    } catch (error) {
      console.error(`Unsuccessful login attempt: ${error}`)
    }
  }

  static logout = async (): Promise<void> => {
    try {
      await signOut(this._auth)
      userStore.set({ isReady: true, user: null })
    } catch (error) {
      console.error(`Unsuccessful logout attempt: ${error}`)
    }
  }

  static getTransactionsReference = (): CollectionReference => {
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

  static loadCurrentTransactions = async (): Promise<void> => {
    const collectionRef = this.getTransactionsQuery(get(timePeriod))

    const snapshot = await getDocs(collectionRef)
    const docs = snapshot.docs
      .map((doc) => ({
        ...(doc.data() as TransactionDTO),
        id: doc.id,
      }))
      .toSorted((a, b) => a.key.localeCompare(b.key))

    transactionsStore.set(docs)
  }

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

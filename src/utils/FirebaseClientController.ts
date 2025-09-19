import { initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
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
  updateDoc,
  writeBatch,
  type Firestore,
  type Unsubscribe,
} from 'firebase/firestore'
import type { Transaction, TransactionDTO } from '$types/forms'
import { userStore } from '$stores/user'
import { transactionsStore } from '$stores/transactions'
import { browser } from '$app/environment'
import Cookies from 'js-cookie'
import { parseDateFromISOString } from './dates'
import { goto } from '$app/navigation'

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
  static authReady: boolean
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
      goto('/login')
      return
    }

    userStore.set({ isReady: true, user })
    const { token, expirationTime } = await user.getIdTokenResult()
    Cookies.set('session_token', token, {
      path: '/',
      sameSite: 'strict',
      expires: parseDateFromISOString(expirationTime) ?? undefined,
    })
    try {
      this.watchTransactions()
    } catch (e) {
      console.error(e)
    }
  }

  private static checkAuth = (): void => {
    if (!this._auth) {
      throw new Error('Attempted to call Firebase Auth before it was initialized.')
    }
  }

  static authorize = async (): Promise<void> => {
    this.checkAuth()

    try {
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

  static watchTransactions = () => {
    const collectionRef = this.getTransactionsReference()

    this._unsubscribeWatcher = onSnapshot(collectionRef, (snapshot) => {
      const allDocs = snapshot.docs
        .map((doc) => ({
          ...(doc.data() as TransactionDTO),
          id: doc.id,
        }))
        .toSorted((a, b) => a.key.localeCompare(b.key))

      transactionsStore.set(allDocs)
    })
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

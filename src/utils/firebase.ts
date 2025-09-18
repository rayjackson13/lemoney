import { initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  type Auth,
  type User,
} from 'firebase/auth'
import { collection, getDocs, getFirestore, type Firestore } from 'firebase/firestore'
import type { Transaction, TransactionDTO } from '$types/forms'
import { userStore } from '$stores/user'

const provider = new GoogleAuthProvider()

const config: FirebaseOptions = {
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
  static authReady: boolean

  static initialize() {
    this._app = initializeApp(config)
    this._auth = getAuth(this._app)
    this._db = getFirestore(this._app)

    onAuthStateChanged(this._auth, (user) => {
      userStore.set({ isReady: true, user })
    })
  }

  static async authorize(): Promise<void> {
    if (!this._auth) {
      throw new Error('Attempted to call Firebase Auth before it was initialized.')
    }

    try {
      await signInWithPopup(this._auth, provider)
    } catch (error) {
      throw new Error(`Unsuccessful login attempt: ${error}`)
    }
  }

  static getCurrentUser(): User | null {
    if (!this._auth) {
      throw new Error('Attempted to call Firebase Auth before it was initialized.')
    }

    return this._auth.currentUser
  }

  static async fetchRecords(): Promise<Transaction[]> {
    if (!this._auth) {
      throw new Error('Attempted to call Firestore before it was initialized.')
    }

    try {
      const snapshot = await getDocs(
        collection(this._db, 'users/rAmr4zNEx7WJI14s6AGGx24axt83/transactions'),
      )
      const transactions = snapshot.docs
        .map((doc) => ({
          ...(doc.data() as TransactionDTO),
          id: doc.id,
        }))
        .toSorted((a, b) => a.key.localeCompare(b.key))

      console.log(transactions)
      return transactions
    } catch (e) {
      console.error(e)
      return []
    }
  }
}

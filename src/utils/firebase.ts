import { initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, type Auth } from 'firebase/auth'

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

  static initialize() {
    this._app = initializeApp(config)
    this._auth = getAuth(this._app)
  }

  static get app() {
    return this._app
  }

  static async authorize(): Promise<boolean> {
    if (!this._auth) {
      console.error('Attempted to call Firebase Auth before it was initialized.')
      return false
    }

    try {
      const { user } = await signInWithPopup(this._auth, provider)
      const token = await user.getIdTokenResult()
      await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ accessToken: token.token }),
      })
      return true
    } catch (error) {
      console.error('Unsuccessful login attempt:', error)
      return false
    }
  }
}

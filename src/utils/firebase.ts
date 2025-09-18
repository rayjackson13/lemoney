import { initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, type Auth } from 'firebase/auth'
import { AjaxHandler } from './ajax'
import type { LoginResponse } from '$types/user'
import Cookies from 'js-cookie'

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

  static async authorize(): Promise<void> {
    if (!this._auth) {
      throw new Error('Attempted to call Firebase Auth before it was initialized.')
    }

    try {
      const { user } = await signInWithPopup(this._auth, provider)
      const idToken = await user.getIdTokenResult()
      const { token } = await AjaxHandler.post<LoginResponse>('auth/login', {
        accessToken: idToken.token,
      })

      AjaxHandler.setToken(token)
      Cookies.set('__session', token, {
        sameSite: 'lax',
        expires: 7,
      })
    } catch (error) {
      throw new Error(`Unsuccessful login attempt: ${error}`)
    }
  }
}

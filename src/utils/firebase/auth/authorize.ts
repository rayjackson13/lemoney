import {
  browserLocalPersistence,
  GoogleAuthProvider,
  setPersistence,
  signInWithPopup,
  type UserInfo,
} from 'firebase/auth'
import { auth } from '../core/auth'
import { userStore } from '$stores/user'

const provider = new GoogleAuthProvider()

export const authorize = async () => {
  await setPersistence(auth, browserLocalPersistence)
  const result = await signInWithPopup(auth, provider)
  userStore.set({ isReady: true, user: result.user.toJSON() as UserInfo })
}

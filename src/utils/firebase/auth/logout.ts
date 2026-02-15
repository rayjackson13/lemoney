import { signOut } from 'firebase/auth'
import { auth } from '../core/auth'
import { userStore } from '$stores/user'

export const logout = async () => {
  await signOut(auth)
  userStore.set({ isReady: true, user: null })
}

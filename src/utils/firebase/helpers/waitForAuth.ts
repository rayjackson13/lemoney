import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '../core/auth'

export const waitForAuth = (): Promise<User | null> => {
  if (auth.currentUser) return Promise.resolve(auth.currentUser)

  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub()
      resolve(user)
    })
  })
}

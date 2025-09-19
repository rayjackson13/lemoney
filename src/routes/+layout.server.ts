import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'
import {
  getAuth,
  onAuthStateChanged,
  type Auth,
  type Unsubscribe,
  type User,
  type UserInfo,
} from 'firebase/auth'
import { firebaseConfig } from '$utils/FirebaseClientController'
import { initializeServerApp } from 'firebase/app'

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

const loadUserInfo = async (token?: string): Promise<UserInfo | null> => {
  const serverApp = initializeServerApp(firebaseConfig, {
    authIdToken: token,
  })

  const auth = getAuth(serverApp)
  const user = await waitForUserState(auth)
  return (user?.toJSON() as UserInfo) ?? null
}

export const load: LayoutServerLoad = async ({ cookies, url }) => {
  const token = cookies.get('session_token')
  console.log('server layout load', url.pathname, !!token)
  const user = await loadUserInfo(token)
  console.log(!!user)

  if (!user && url.pathname !== '/login') {
    throw redirect(302, '/login')
  }

  if (!!user && url.pathname === '/login') {
    throw redirect(302, '/records')
  }

  return { user }
}

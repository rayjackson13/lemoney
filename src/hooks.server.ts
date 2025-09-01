import type { Handle } from '@sveltejs/kit'
import { adminAuth } from '$utils/server/firebase-admin'
import type { UserInfo } from '$types/user'

export const handle: Handle = async ({ event, resolve }) => {
  const sessionCookie = event.cookies.get('__session')

  if (!sessionCookie) {
    event.locals.user = null
    return resolve(event)
  }

  try {
    const decodedToken = (await adminAuth.verifySessionCookie(sessionCookie, true)) as UserInfo
    event.locals.user = decodedToken as UserInfo
  } catch (err) {
    console.warn('Invalid or expired session cookie', err)
    event.locals.user = null
  }

  return resolve(event)
}

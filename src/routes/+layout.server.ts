import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'
import { FirebaseSSRController } from '$utils/FirebaseSSRController'

export const load: LayoutServerLoad = async ({ cookies, url }) => {
  const token = cookies.get('session_token')

  await FirebaseSSRController.initialize(token)
  const user = await FirebaseSSRController.getUser()

  if (!user && url.pathname !== '/login') {
    throw redirect(302, '/login')
  }

  if (!!user && url.pathname === '/login') {
    throw redirect(302, '/records')
  }

  return { user }
}

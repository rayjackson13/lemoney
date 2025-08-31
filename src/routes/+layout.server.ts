import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = ({ url, locals }) => {
  if (!locals.user && url.pathname !== '/login') {
    throw redirect(302, '/login')
  }

  return {
    user: locals.user,
  }
}

import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'
import { ajax } from '$utils/ajax'
import type { FetchFn } from '$types/global'
import type { UserInfo } from '$types/user'

const loadUserInfo = async (fetch: FetchFn): Promise<UserInfo | null> => {
  try {
    const response = await ajax<{ data: UserInfo }>('auth/userInfo', { method: 'GET' }, fetch)
    return response.data
  } catch (e) {
    console.error('Could not load user data', e)
    return null
  }
}

export const load: LayoutServerLoad = async ({ url, fetch }) => {
  const userInfo = await loadUserInfo(fetch)

  console.log(userInfo)

  if (!userInfo && url.pathname !== '/login') {
    throw redirect(302, '/login')
  }

  if (!!userInfo && url.pathname === '/login') {
    throw redirect(302, '/records')
  }

  return {
    user: userInfo,
  }
}

import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'
import { AjaxHandler } from '$utils/ajax'
import type { FetchFn } from '$types/global'
import type { UserInfo } from '$types/user'

const loadUserInfo = async (fetch: FetchFn, token?: string): Promise<UserInfo | null> => {
  if (!token) return null

  try {
    AjaxHandler.setFetchAPI(fetch)
    AjaxHandler.setToken(token)
    const response = await AjaxHandler.get<{ data: UserInfo }>('auth/userInfo')
    return response.data
  } catch (e) {
    console.error('Could not load user data', e)
    return null
  }
}

export const load: LayoutServerLoad = async ({ url, fetch, cookies }) => {
  const token = cookies.get('__session')
  const userInfo = await loadUserInfo(fetch, token)

  if (!userInfo && url.pathname !== '/login') {
    throw redirect(302, '/login')
  }

  if (!!userInfo && url.pathname === '/login') {
    throw redirect(302, '/records')
  }

  return {
    user: userInfo,
    token,
  }
}

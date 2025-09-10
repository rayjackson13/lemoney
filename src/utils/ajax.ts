import type { FetchFn } from '$types/global'

const apiUrl = import.meta.env.VITE_API_URL

export const ajax = async <T>(
  url: string,
  init?: RequestInit,
  fetchApi: FetchFn = fetch,
): Promise<T> => {
  const config: RequestInit = {
    credentials: 'include',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  }
  const response = await fetchApi(`${apiUrl}/${url}`, config)

  return await response.json()
}

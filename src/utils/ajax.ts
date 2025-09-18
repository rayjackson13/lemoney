import type { FetchFn } from '$types/global'

type FetchMethod = 'POST' | 'PATCH' | 'GET' | 'DELETE' | 'PUT' | 'OPTIONS'

type Config = Omit<RequestInit, 'headers'> & {
  headers: HeadersInit & {
    Authorization?: string
  }
  method: FetchMethod
  body?: BodyInit | null | undefined
}

const apiUrl = import.meta.env.VITE_API_URL

export class AjaxHandler {
  private static _authToken: string | null = null
  private static _fetchApi: FetchFn = fetch

  static async setToken(token: string) {
    this._authToken = token
  }

  static async removeToken() {
    this._authToken = null
  }

  static async setFetchAPI(api: FetchFn) {
    this._fetchApi = api
  }

  static async fetch<T>(method: FetchMethod, url: string, data?: unknown): Promise<T> {
    const config: Config = {
      headers: {
        'Content-Type': 'application/json',
      },
      method,
      body: data ? JSON.stringify(data) : undefined,
    }

    if (this._authToken) {
      config.headers['Authorization'] = `Bearer ${this._authToken}`
    }

    const response = await this._fetchApi(`${apiUrl}/${url}`, config)
    const body = await response.json()

    if (!response.ok) {
      throw new Error(`Error while sending AJAX request.\n${JSON.stringify(body)}`)
    }

    return body
  }

  static async get<T>(url: string): Promise<T> {
    return this.fetch('GET', url)
  }

  static async post<T>(url: string, data?: unknown): Promise<T> {
    return this.fetch('POST', url, data)
  }

  static async patch<T>(url: string, data?: unknown): Promise<T> {
    return this.fetch('PATCH', url, data)
  }

  static async delete<T>(url: string): Promise<T> {
    return this.fetch('DELETE', url)
  }
}

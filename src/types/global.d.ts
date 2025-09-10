export type FetchFn = (
  input: string | URL | Request,
  init?: RequestInit | undefined,
) => Promise<Response>

export type SocketData<T> = {
  type: string
  data: T
}

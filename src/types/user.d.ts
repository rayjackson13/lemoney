export type UserInfo = {
  name?: string
  picture?: string
  email?: string
}

export type PageData = {
  user: UserInfo | null
}

export type LoginResponse = {
  message: string
  token: string
}

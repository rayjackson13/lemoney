import type { UserInfo } from 'firebase/auth'
import { writable } from 'svelte/store'

type UserStore = {
  isReady: boolean
  user: UserInfo | null
}

export const userStore = writable<UserStore>({
  isReady: false,
  user: null,
})

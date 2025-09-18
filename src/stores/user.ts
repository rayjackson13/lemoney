import type { User } from 'firebase/auth'
import { writable } from 'svelte/store'

type UserStore = {
  isReady: boolean
  user: User | null
}

export const userStore = writable<UserStore>({
  isReady: false,
  user: null,
})

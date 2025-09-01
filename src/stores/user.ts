import type { UserInfo } from '$types/user'
import { writable } from 'svelte/store'

export const userStore = writable<UserInfo | null>(null)

import { writable } from 'svelte/store'
import type { UserInfo } from '../app'

export const userStore = writable<UserInfo | null>(null)

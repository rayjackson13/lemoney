import type { Transaction } from '$types/forms'
import { writable } from 'svelte/store'

export const transactions = writable<Transaction[]>([])

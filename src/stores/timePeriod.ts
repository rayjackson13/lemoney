import { getDefaultTimePeriod } from '$utils/dates'
import { writable } from 'svelte/store'

export const timePeriod = writable<[Date, Date]>(getDefaultTimePeriod())

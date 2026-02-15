import { browser } from '$app/environment'
import { appReady } from '$stores/appReady'
import { userStore } from '$stores/user'
import { loadTransactions } from '../transactions/load'
import { waitForAuth } from './waitForAuth'

export const loadInitialData = async () => {
  if (!browser) return

  const user = await waitForAuth()
  userStore.set({ isReady: true, user })

  if (user) await loadTransactions()

  appReady.set(true)
}

import { FirebaseSSRController } from '$utils/FirebaseSSRController'

export const load = async ({ cookies }) => {
  const token = cookies.get('session_token')
  await FirebaseSSRController.initialize(token)
  const transactions = await FirebaseSSRController.loadTransactions()

  return { transactions }
}

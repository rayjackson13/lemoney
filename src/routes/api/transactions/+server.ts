import type { Transaction } from '$types/forms.js'
import { adminAuth, adminFS } from '$utils/server/firebase-admin.js'
import { json, type Cookies } from '@sveltejs/kit'
import type { DecodedIdToken } from 'firebase-admin/auth'

type PostRequestParams = Transaction[]

const getUserData = async (cookies: Cookies): Promise<DecodedIdToken | null> => {
  const sessionCookie = cookies.get('__session')

  if (!sessionCookie) return null

  const decodedToken = await adminAuth.verifySessionCookie(sessionCookie)
  return decodedToken ?? null
}

const getTransactions = async (userId: string): Promise<Transaction[]> => {
  const collection = adminFS.collection(`/users/${userId}/transactions`)
  const snapshot = await collection.get()

  if (snapshot.empty) {
    return []
  }

  console.log(snapshot.docs[0].data(), snapshot.docs[0].id)
  snapshot.docs.map((doc) => doc.data())
  return snapshot.docs.map((doc) => ({
    ...(doc.data() as Transaction),
    id: doc.id,
  }))
}

const addTransactions = async (userId: string, data: Transaction[]): Promise<void> => {
  const collection = adminFS.collection(`/users/${userId}/transactions`)
  let batch = adminFS.batch()
  let count = 0

  for (const item of data) {
    const docRef = collection.doc()
    batch.set(docRef, item)
    count++

    if (count === 500) {
      await batch.commit()
      batch = adminFS.batch()
      count = 0
    }
  }

  if (count > 0) {
    await batch.commit()
  }
}

export async function GET({ cookies }) {
  const user = await getUserData(cookies)

  if (!user)
    return json({ message: 'There was a problem with Firebase authentication' }, { status: 401 })

  const transactions = await getTransactions(user.uid)
  return json({ transactions }, { status: 200 })
}

export async function POST({ cookies, request }) {
  const user = await getUserData(cookies)

  if (!user)
    return json({ message: 'There was a problem with Firebase authentication' }, { status: 401 })

  const transactions: PostRequestParams = await request.json()
  await addTransactions(user.uid, transactions)

  const allData = await getTransactions(user.uid)
  return json({ transactions: allData }, { status: 200 })
}

import { initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

const app = initializeApp({
  credential: cert({
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    clientEmail: import.meta.env.VITE_FIREBASE_ADMIN_EMAIL,
    privateKey: import.meta.env.VITE_FIREBASE_ADMIN_KEY.replace(/\\n/g, '\n'),
  }),
  databaseURL: 'https://lemoney-32aae.firebaseio.com',
})

export const adminAuth = getAuth(app)
export const adminFS = getFirestore(app)

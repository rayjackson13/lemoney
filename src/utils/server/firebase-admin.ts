import { initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

initializeApp({
	credential: cert({
		projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
		clientEmail: import.meta.env.VITE_FIREBASE_ADMIN_EMAIL,
		privateKey: import.meta.env.VITE_FIREBASE_ADMIN_KEY.replace(/\\n/g, '\n'),
	}),
})

export const adminAuth = getAuth()

import { adminAuth } from '$utils/server/firebase-admin.js'
import { json } from '@sveltejs/kit'

type RequestParams = {
	accessToken: string
}

const checkTokenValidity = async (token: string): Promise<boolean> => {
	if (!token) return false

	const decodedToken = await adminAuth.verifyIdToken(token)
	return !!decodedToken
}

export async function POST({ request, cookies }) {
	const { accessToken }: RequestParams = await request.json()
	const isValid = await checkTokenValidity(accessToken)

	if (!isValid) {
		return json({ message: 'There was a problem with Firebase authentication' }, { status: 401 })
	}

	const sessionCookie = await adminAuth.createSessionCookie(accessToken, {
		expiresIn: 7 * 24 * 60 * 60 * 1000,
	})

	cookies.set('__session', sessionCookie, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: true,
	})

	return json({ message: 'Authorization successful' }, { status: 200 })
}

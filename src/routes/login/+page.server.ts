import type { Quote } from './types'
import quotes from './quotes.json'
import type { LayoutServerLoad } from '../$types'
import { redirect } from '@sveltejs/kit'

// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true

export const load: LayoutServerLoad = ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/')
	}

	const quote: Quote = quotes[Math.floor(Math.random() * quotes.length)]

	return { quote }
}

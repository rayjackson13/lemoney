import type { Quote } from './types'
import quotes from './quotes.json'

// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true

export const load = () => {
  const quote: Quote = quotes[Math.floor(Math.random() * quotes.length)]

  return { quote }
}

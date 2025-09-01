import { json } from '@sveltejs/kit'

export async function POST({ cookies, locals }) {
  locals.user = null
  cookies.delete('__session', {
    path: '/',
    httpOnly: false,
  })

  return json({ message: 'Logged out successfully' }, { status: 200 })
}

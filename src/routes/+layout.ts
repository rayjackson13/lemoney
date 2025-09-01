import { userStore } from '$stores/user'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = ({ data }) => {
  userStore.set(data.user)
}

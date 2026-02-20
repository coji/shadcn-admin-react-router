import ComingSoon from '~/components/coming-soon'
import type { RouteHandle } from '~/routes/_authenticated/_layout'

export const handle: RouteHandle = {
  breadcrumb: () => ({ label: 'Help Center' }),
}

export default ComingSoon

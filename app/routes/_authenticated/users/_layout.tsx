import { href, Outlet } from 'react-router'
import type { RouteHandle } from '~/routes/_authenticated/_layout'

export const handle: RouteHandle = {
  breadcrumb: () => ({ label: 'Users', to: href('/users') }),
}

export default function UsersLayout() {
  return <Outlet />
}

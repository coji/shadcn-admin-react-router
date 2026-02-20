import { href, Outlet } from 'react-router'
import type { RouteHandle } from '~/routes/_authenticated/_layout'

export const handle: RouteHandle = {
  breadcrumb: () => ({ label: 'Tasks', to: href('/tasks') }),
}

export default function TasksLayout() {
  return <Outlet />
}

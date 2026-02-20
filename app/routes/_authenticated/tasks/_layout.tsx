import { Outlet } from 'react-router'

export const handle = {
  breadcrumb: () => ({ label: 'Tasks', to: '/tasks' }),
}

export default function TasksLayout() {
  return <Outlet />
}

import {
  IconBrowserCheck,
  IconNotification,
  IconPalette,
  IconTool,
  IconUser,
} from '@tabler/icons-react'
import { href, Outlet } from 'react-router'
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderTitle,
} from '~/components/layout/page-header'
import { Separator } from '~/components/ui/separator'
import type { RouteHandle } from '~/routes/_authenticated/_layout'
import SidebarNav from './+components/sidebar-nav'

export const handle: RouteHandle = {
  breadcrumb: () => ({ label: 'Settings', to: href('/settings') }),
}

export default function Settings() {
  return (
    <>
      <PageHeader>
        <PageHeaderHeading>
          <PageHeaderTitle>Settings</PageHeaderTitle>
          <PageHeaderDescription>
            Manage your account settings and set e-mail preferences.
          </PageHeaderDescription>
        </PageHeaderHeading>
      </PageHeader>
      <Separator className="my-0 lg:my-2" />
      <div className="flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12">
        <aside className="top-0 lg:sticky lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex w-full overflow-y-hidden p-1 pr-4">
          <Outlet />
        </div>
      </div>
    </>
  )
}

const sidebarNavItems = [
  {
    title: 'Profile',
    icon: <IconUser size={18} />,
    href: href('/settings'),
  },
  {
    title: 'Account',
    icon: <IconTool size={18} />,
    href: href('/settings/account'),
  },
  {
    title: 'Appearance',
    icon: <IconPalette size={18} />,
    href: href('/settings/appearance'),
  },
  {
    title: 'Notifications',
    icon: <IconNotification size={18} />,
    href: href('/settings/notifications'),
  },
  {
    title: 'Display',
    icon: <IconBrowserCheck size={18} />,
    href: href('/settings/display'),
  },
]

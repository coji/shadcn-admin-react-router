import {
  IconBarrierBlock,
  IconBrowserCheck,
  IconBug,
  IconChecklist,
  IconError404,
  IconHelp,
  IconLayoutDashboard,
  IconLock,
  IconLockAccess,
  IconMessages,
  IconNotification,
  IconPackages,
  IconPalette,
  IconServerOff,
  IconSettings,
  IconTool,
  IconUserCog,
  IconUserOff,
  IconUsers,
} from '@tabler/icons-react'
import { AudioWaveform, Command, GalleryVerticalEnd } from 'lucide-react'
import { href } from 'react-router'
import type { SidebarData } from '../components/layout/types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Mizoguchi Coji',
    email: 'coji@techtalk.jp',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Shadcn Admin',
      logo: Command,
      plan: 'React Router + ShadcnUI',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: href('/'),
          icon: IconLayoutDashboard,
        },
        {
          title: 'Tasks',
          url: href('/tasks'),
          icon: IconChecklist,
        },
        {
          title: 'Apps',
          url: href('/apps'),
          icon: IconPackages,
        },
        {
          title: 'Chats',
          url: href('/chats'),
          badge: '3',
          icon: IconMessages,
        },
        {
          title: 'Users',
          url: href('/users'),
          icon: IconUsers,
        },
      ],
    },
    {
      title: 'Pages',
      items: [
        {
          title: 'Auth',
          icon: IconLockAccess,
          items: [
            {
              title: 'Sign In',
              url: href('/sign-in'),
            },
            {
              title: 'Sign In (2 Col)',
              url: href('/sign-in-2'),
            },
            {
              title: 'Sign Up',
              url: href('/sign-up'),
            },
            {
              title: 'Forgot Password',
              url: href('/forgot-password'),
            },
            {
              title: 'OTP',
              url: href('/otp'),
            },
          ],
        },
        {
          title: 'Errors',
          icon: IconBug,
          items: [
            {
              title: 'Unauthorized',
              url: href('/401'),
              icon: IconLock,
            },
            {
              title: 'Forbidden',
              url: href('/403'),
              icon: IconUserOff,
            },
            {
              title: 'Not Found',
              url: href('/404'),
              icon: IconError404,
            },
            {
              title: 'Internal Server Error',
              url: href('/500'),
              icon: IconServerOff,
            },
            {
              title: 'Maintenance Error',
              url: href('/503'),
              icon: IconBarrierBlock,
            },
          ],
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: IconSettings,
          items: [
            {
              title: 'Profile',
              url: href('/settings'),
              icon: IconUserCog,
            },
            {
              title: 'Account',
              url: href('/settings/account'),
              icon: IconTool,
            },
            {
              title: 'Appearance',
              url: href('/settings/appearance'),
              icon: IconPalette,
            },
            {
              title: 'Notifications',
              url: href('/settings/notifications'),
              icon: IconNotification,
            },
            {
              title: 'Display',
              url: href('/settings/display'),
              icon: IconBrowserCheck,
            },
          ],
        },
        {
          title: 'Help Center',
          url: href('/help-center'),
          icon: IconHelp,
        },
      ],
    },
  ],
}

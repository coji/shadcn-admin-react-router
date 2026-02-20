import type React from 'react'
import { Outlet, useMatches } from 'react-router'
import { AppSidebar } from '~/components/layout/app-sidebar'
import { Header } from '~/components/layout/header'
import { Main } from '~/components/layout/main'
import { ProfileDropdown } from '~/components/profile-dropdown'
import { Search } from '~/components/search'
import { ThemeSwitch } from '~/components/theme-switch'
import { SidebarProvider } from '~/components/ui/sidebar'
import { SearchProvider } from '~/context/search-context'
import { useBreadcrumbs } from '~/hooks/use-breadcrumbs'
import { cn } from '~/lib/utils'

interface RouteHandle {
  breadcrumb?: (data?: unknown) => { label: string; to?: string }
  headerFixed?: boolean
  mainFixed?: boolean
  headerNavigation?: () => React.ReactNode
}

export default function DashboardLayout() {
  const { Breadcrumbs } = useBreadcrumbs()
  const matches = useMatches()
  const handle = matches.reduce<Record<string, unknown>>((acc, m) => {
    if (m.handle && typeof m.handle === 'object') Object.assign(acc, m.handle)
    return acc
  }, {}) as RouteHandle

  return (
    <SearchProvider>
      <SidebarProvider>
        <AppSidebar />
        <div
          id="content"
          className={cn(
            'ml-auto w-full max-w-full',
            'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
            'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
            'transition-[width] duration-200 ease-linear',
            'flex h-svh flex-col',
            'group-data-[scroll-locked=1]/body:h-full',
            'has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh',
          )}
        >
          <Header fixed={handle.headerFixed}>
            {handle.headerNavigation?.()}
            <Search />
            <div className="ml-auto flex items-center gap-4">
              <ThemeSwitch />
              <ProfileDropdown />
            </div>
          </Header>
          <Breadcrumbs />
          <Main fixed={handle.mainFixed}>
            <Outlet />
          </Main>
        </div>
      </SidebarProvider>
    </SearchProvider>
  )
}

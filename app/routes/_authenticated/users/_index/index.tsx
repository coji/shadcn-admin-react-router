import { IconMailPlus, IconUserPlus } from '@tabler/icons-react'
import { href, Link } from 'react-router'
import {
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderTitle,
} from '~/components/layout/page-header'
import { Button } from '~/components/ui/button'
import { useSmartNavigation } from '~/hooks/use-smart-navigation'
import type { RouteHandle } from '~/routes/_authenticated/_layout'
import { columns } from './+components/users-columns'
import { UsersTable } from './+components/users-table'
import {
  FilterSchema,
  PaginationSchema,
  QuerySchema,
  SortSchema,
} from './+hooks/use-data-table-state'
import { getFacetedCounts, listFilteredUsers } from './+queries.server'
import type { Route } from './+types/index'

export const handle: RouteHandle = {
  headerFixed: true,
}

export const loader = ({ request }: Route.LoaderArgs) => {
  const searchParams = new URLSearchParams(new URL(request.url).searchParams)

  const { username } = QuerySchema.parse({
    username: searchParams.get('username'),
  })

  const { ...filters } = FilterSchema.parse({
    status: searchParams.getAll('status'),
    priority: searchParams.getAll('priority'),
  })

  const { sort_by: sortBy, sort_order: sortOrder } = SortSchema.parse({
    sort_by: searchParams.get('sort_by'),
    sort_order: searchParams.get('sort_order'),
  })

  const { page: currentPage, per_page: pageSize } = PaginationSchema.parse({
    page: searchParams.get('page'),
    per_page: searchParams.get('per_page'),
  })

  const { pagination, data: users } = listFilteredUsers({
    username,
    filters,
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
  })

  const facetedCounts = getFacetedCounts({
    facets: ['status', 'role'],
    username,
    filters,
  })

  return { users, pagination, facetedCounts }
}

export default function Users({
  loaderData: { users, pagination, facetedCounts },
}: Route.ComponentProps) {
  useSmartNavigation({ autoSave: true, baseUrl: href('/users') })

  return (
    <>
      <PageHeader>
        <PageHeaderHeading>
          <PageHeaderTitle>User List</PageHeaderTitle>
          <PageHeaderDescription>
            Manage your users and their roles here.
          </PageHeaderDescription>
        </PageHeaderHeading>
        <PageHeaderActions>
          <Button variant="outline" className="space-x-1" asChild>
            <Link to={href('/users/invite')}>
              <span>Invite User</span> <IconMailPlus size={18} />
            </Link>
          </Button>
          <Button className="space-x-1" asChild>
            <Link to={href('/users/create')}>
              <span>Add User</span> <IconUserPlus size={18} />
            </Link>
          </Button>
        </PageHeaderActions>
      </PageHeader>
      {/* Breakout: negate Main's px-4 so the table can use full width */}
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
        <UsersTable
          data={users}
          columns={columns}
          pagination={pagination}
          facetedCounts={facetedCounts}
        />
      </div>
    </>
  )
}

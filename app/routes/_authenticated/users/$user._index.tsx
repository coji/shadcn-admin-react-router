import { parseSubmission, report } from '@conform-to/react/future'
import { setTimeout as sleep } from 'node:timers/promises'
import { data } from 'react-router'
import { redirectWithSuccess } from 'remix-toast'
import { Separator } from '~/components/ui/separator'
import type { RouteHandle } from '~/routes/_authenticated/_layout'
import { UsersMutateForm, editSchema } from './+components/users-mutate-form'
import { users } from './+data/users'
import type { Route } from './+types/$user._index'

export const handle: RouteHandle = {
  breadcrumb: () => ({ label: 'Edit' }),
}

export const loader = ({ params }: Route.LoaderArgs) => {
  const user = users.find((u) => u.id === params.user)
  if (!user) {
    throw data(null, { status: 404 })
  }
  return { user }
}

export const action = async ({ request, params }: Route.ActionArgs) => {
  const url = new URL(request.url)
  const user = users.find((u) => u.id === params.user)
  if (!user) {
    throw data(null, { status: 404 })
  }

  const submission = parseSubmission(await request.formData())
  const result = editSchema.safeParse(submission.payload)

  if (!result.success) {
    return {
      result: report(submission, { error: { issues: result.error.issues } }),
    }
  }

  // Update the user
  await sleep(1000)
  const updatedUser = {
    ...result.data,
    id: user.id,
    createdAt: user.createdAt,
    status: user.status,
    updatedAt: new Date(),
  }
  const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u))
  users.length = 0
  users.push(...updatedUsers)

  return redirectWithSuccess(`/users?${url.searchParams.toString()}`, {
    message: 'User updated successfully',
    description: `The user ${updatedUser.username} has been updated.`,
  })
}

export default function UserEdit({
  loaderData: { user },
}: Route.ComponentProps) {
  return (
    <div>
      <div className="text-center sm:text-left">
        <h2 className="text-foreground text-lg font-semibold">Edit User</h2>
        <div className="text-muted-foreground text-sm">
          Update the user here. Click save when you&apos;re done.
        </div>
      </div>

      <Separator className="my-4 lg:my-6" />

      <UsersMutateForm user={user} />
    </div>
  )
}

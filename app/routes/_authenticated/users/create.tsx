import { parseSubmission, report } from '@conform-to/react/future'
import { setTimeout as sleep } from 'node:timers/promises'
import { redirectWithSuccess } from 'remix-toast'
import { Separator } from '~/components/ui/separator'
import type { RouteHandle } from '~/routes/_authenticated/_layout'
import { UsersMutateForm, createSchema } from './+components/users-mutate-form'
import { users } from './+data/users'
import type { Route } from './+types/create'

export const handle: RouteHandle = {
  breadcrumb: () => ({ label: 'Create' }),
}

export const action = async ({ request }: Route.ActionArgs) => {
  const url = new URL(request.url)
  const submission = parseSubmission(await request.formData())
  const result = createSchema.safeParse(submission.payload)

  if (!result.success) {
    return {
      result: report(submission, { error: { issues: result.error.issues } }),
    }
  }

  // Create a new user
  await sleep(1000)
  const newUser = {
    ...result.data,
    createdAt: new Date(),
    updatedAt: new Date(),
    id: crypto.randomUUID(),
    status: 'active',
  } as const
  users.unshift(newUser)

  return redirectWithSuccess(`/users?${url.searchParams.toString()}`, {
    message: 'User added successfully',
    description: JSON.stringify(newUser),
  })
}

export default function UserCreate() {
  return (
    <div>
      <div className="text-center sm:text-left">
        <h2 className="text-foreground text-lg font-semibold">Add New User</h2>
        <div className="text-muted-foreground text-sm">
          Create a new user here. Click save when you&apos;re done.
        </div>
      </div>

      <Separator className="my-4 lg:my-6" />

      <UsersMutateForm />
    </div>
  )
}

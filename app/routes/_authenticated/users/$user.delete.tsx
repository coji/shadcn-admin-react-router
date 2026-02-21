import { setTimeout as sleep } from 'node:timers/promises'
import { data } from 'react-router'
import { dataWithSuccess } from 'remix-toast'
import { users } from './+data/users'
import type { Route } from './+types/$user.delete'

export const action = async ({ params }: Route.ActionArgs) => {
  const user = users.find((user) => user.id === params.user)
  if (!user) {
    throw data(null, { status: 404, statusText: 'User not found' })
  }

  await sleep(1000)
  // remove the user from the list
  const index = users.findIndex((u) => u.id === user.id)
  if (index !== -1) users.splice(index, 1)

  return dataWithSuccess(
    {
      done: true,
    },
    {
      message: 'User deleted successfully!',
      description: `The user ${user.email} has been removed.`,
    },
  )
}

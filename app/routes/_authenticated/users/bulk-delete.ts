import { setTimeout as sleep } from 'node:timers/promises'
import { dataWithSuccess } from 'remix-toast'
import { z } from 'zod'
import { users } from './+data/users'
import type { Route } from './+types/bulk-delete'

const schema = z.object({
  ids: z.array(z.string()).min(1),
})

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData()
  const { ids } = schema.parse({ ids: formData.getAll('ids') })

  await sleep(500)
  for (const id of ids) {
    const index = users.findIndex((u) => u.id === id)
    if (index !== -1) users.splice(index, 1)
  }

  return dataWithSuccess(
    { done: true },
    {
      message: `${ids.length} user${ids.length > 1 ? 's' : ''} deleted`,
    },
  )
}

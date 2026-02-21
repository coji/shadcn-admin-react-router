import { setTimeout as sleep } from 'node:timers/promises'
import { dataWithSuccess } from 'remix-toast'
import { z } from 'zod'
import { tasks } from './+shared/data/tasks'
import type { Route } from './+types/bulk-delete'

const schema = z.object({
  ids: z.array(z.string()).min(1),
})

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData()
  const { ids } = schema.parse({ ids: formData.getAll('ids') })

  await sleep(500)
  for (const id of ids) {
    const index = tasks.findIndex((t) => t.id === id)
    if (index !== -1) tasks.splice(index, 1)
  }

  return dataWithSuccess(
    { done: true },
    {
      message: `${ids.length} task${ids.length > 1 ? 's' : ''} deleted`,
    },
  )
}

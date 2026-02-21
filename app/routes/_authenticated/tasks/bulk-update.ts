import { setTimeout as sleep } from 'node:timers/promises'
import { dataWithSuccess } from 'remix-toast'
import { z } from 'zod'
import { tasks } from './+shared/data/tasks'
import type { Route } from './+types/bulk-update'

const schema = z.object({
  ids: z.array(z.string()).min(1),
  field: z.enum(['label', 'status', 'priority']),
  value: z.string(),
})

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData()
  const { ids, field, value } = schema.parse({
    ids: formData.getAll('ids'),
    field: formData.get('field'),
    value: formData.get('value'),
  })

  await sleep(500)
  for (const id of ids) {
    const task = tasks.find((t) => t.id === id)
    if (task) task[field] = value
  }

  return dataWithSuccess(
    { done: true },
    {
      message: `${ids.length} task${ids.length > 1 ? 's' : ''} updated`,
      description: `${field} set to "${value}"`,
    },
  )
}

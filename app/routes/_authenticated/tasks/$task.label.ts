import { parseSubmission, report } from '@conform-to/react/future'
import { coerceFormValue } from '@conform-to/zod/v4/future'
import { setTimeout } from 'node:timers/promises'
import { dataWithError, dataWithSuccess } from 'remix-toast'
import { z } from 'zod'
import { tasks } from './+shared/data/tasks'
import type { Route } from './+types/$task.label'

const schema = coerceFormValue(z.object({ label: z.string() }))

export const action = async ({ request, params }: Route.ActionArgs) => {
  const taskIndex = tasks.findIndex((t) => t.id === params.task)
  if (taskIndex === -1) {
    throw dataWithError(null, { message: 'Task not found' })
  }

  const submission = parseSubmission(await request.formData())
  const result = schema.safeParse(submission.payload)

  if (!result.success) {
    throw dataWithError(
      report(submission, { error: { issues: result.error.issues } }),
      { message: 'Invalid submission' },
    )
  }

  // update task label
  await setTimeout(1000)
  tasks[taskIndex].label = result.data.label

  return dataWithSuccess(null, {
    message: 'Task label updated successfully',
    description: `Task ${params.task} label has been updated to ${result.data.label}`,
  })
}

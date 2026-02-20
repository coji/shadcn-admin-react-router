import { parseSubmission, report } from '@conform-to/react/future'
import { setTimeout as sleep } from 'node:timers/promises'
import { href } from 'react-router'
import { redirectWithSuccess } from 'remix-toast'
import { Separator } from '~/components/ui/separator'
import type { RouteHandle } from '~/routes/_authenticated/_layout'
import {
  TasksMutateForm,
  createSchema,
} from './+shared/components/tasks-mutate-form'
import { tasks } from './+shared/data/tasks'
import type { Route } from './+types/create'

export const handle: RouteHandle = {
  breadcrumb: () => ({ label: 'Create' }),
}

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseSubmission(await request.formData())
  const result = createSchema.safeParse(submission.payload)

  if (!result.success) {
    return {
      result: report(submission, { error: { issues: result.error.issues } }),
    }
  }

  // Create a new task
  await sleep(1000)
  const { intent: _intent, ...task } = result.data
  const maxIdNumber = tasks.reduce((max, t) => {
    const idNumber = Number.parseInt(t.id.split('-')[1], 10)
    return idNumber > max ? idNumber : max
  }, 0)
  const id = `TASK-${String(maxIdNumber + 1).padStart(4, '0')}`
  tasks.unshift({ id, ...task })

  return redirectWithSuccess(href('/tasks'), {
    message: 'Task created successfully',
    description: JSON.stringify(task),
  })
}

export default function TaskCreate() {
  return (
    <div>
      <div className="text-center sm:text-left">
        <h2 className="text-foreground text-lg font-semibold">Create Task</h2>
        <div className="text-muted-foreground text-sm">
          Add a new task by providing necessary info. Click save when
          you&apos;re done.
        </div>
      </div>

      <Separator className="my-4 lg:my-6" />

      <TasksMutateForm />
    </div>
  )
}

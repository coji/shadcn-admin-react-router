import { parseSubmission, report } from '@conform-to/react/future'
import { setTimeout as sleep } from 'node:timers/promises'
import { data } from 'react-router'
import { redirectWithSuccess } from 'remix-toast'
import { Separator } from '~/components/ui/separator'
import type { RouteHandle } from '~/routes/_authenticated/_layout'
import {
  TasksMutateForm,
  updateSchema,
} from './+shared/components/tasks-mutate-form'
import { tasks } from './+shared/data/tasks'
import type { Route } from './+types/$task._index'

export const handle: RouteHandle = {
  breadcrumb: () => ({ label: 'Edit' }),
}

export const loader = ({ params }: Route.LoaderArgs) => {
  const task = tasks.find((t) => t.id === params.task)
  if (!task) {
    throw data(null, { status: 404 })
  }
  return { task }
}

export const action = async ({ request }: Route.ActionArgs) => {
  const url = new URL(request.url)
  const submission = parseSubmission(await request.formData())
  const result = updateSchema.safeParse(submission.payload)

  if (!result.success) {
    return {
      result: report(submission, { error: { issues: result.error.issues } }),
    }
  }

  // Update the task
  await sleep(1000)
  const taskIndex = tasks.findIndex((t) => t.id === result.data.id)
  if (taskIndex === -1) {
    throw data(null, { status: 404, statusText: 'Task not found' })
  }
  tasks.splice(taskIndex, 1, result.data)

  return redirectWithSuccess(`/tasks?${url.searchParams.toString()}`, {
    message: 'Task updated successfully',
    description: `The task ${result.data.id} has been updated.`,
  })
}

export default function TaskEdit({
  loaderData: { task },
}: Route.ComponentProps) {
  return (
    <div>
      <div className="text-center sm:text-left">
        <h2 className="text-foreground text-lg font-semibold">Edit Task</h2>
        <div className="text-muted-foreground text-sm">
          Edit the task by providing necessary info. Click save when you&apos;re
          done.
        </div>
      </div>

      <Separator className="my-4 lg:my-6" />

      <TasksMutateForm task={task} />
    </div>
  )
}

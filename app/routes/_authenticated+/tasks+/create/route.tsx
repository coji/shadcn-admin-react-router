import { parseWithZod } from '@conform-to/zod'
import { setTimeout as sleep } from 'node:timers/promises'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { redirectWithSuccess } from 'remix-toast'
import { z } from 'zod'
import { TasksMutateDrawer } from '../_shared/components/tasks-mutate-drawer'
import type { Route } from './+types/route'

export const formSchema = z.object({
  intent: z.literal('create'),
  title: z.string({ required_error: 'Title is required.' }),
  status: z.string({ required_error: 'Please select a status.' }),
  label: z.string({ required_error: 'Please select a label.' }),
  priority: z.string({ required_error: 'Please choose a priority.' }),
})

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseWithZod(await request.formData(), {
    schema: formSchema,
  })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  // Create a new task
  await sleep(1000)

  return redirectWithSuccess('/tasks', {
    message: 'Task created successfully',
    description: JSON.stringify(submission.value),
  })
}

export default function TaskCreate() {
  const [open, setOpen] = useState(true)
  const navigate = useNavigate()

  return (
    <TasksMutateDrawer
      key="task-create"
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(false)
          // wait for the drawer to close
          setTimeout(() => {
            navigate('/tasks', {
              viewTransition: true,
            })
          }, 300) // the duration of the drawer close animation
        }
      }}
    />
  )
}
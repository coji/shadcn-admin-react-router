import { parseSubmission, report } from '@conform-to/react/future'
import { setTimeout as sleep } from 'node:timers/promises'
import { useState } from 'react'
import { href } from 'react-router'
import { redirectWithSuccess } from 'remix-toast'
import { useSmartNavigation } from '~/hooks/use-smart-navigation'
import { UsersInviteDialog } from './+components/users-invite-dialog'
import { formSchema } from './+schema'
import type { Route } from './+types/index'

export const action = async ({ request }: Route.ActionArgs) => {
  const url = new URL(request.url)
  const submission = parseSubmission(await request.formData())
  const result = formSchema.safeParse(submission.payload)

  if (!result.success) {
    return {
      result: report(submission, { error: { issues: result.error.issues } }),
    }
  }

  await sleep(1000)

  return redirectWithSuccess(`/users?${url.searchParams.toString()}`, {
    message: 'User invited successfully!',
    description: JSON.stringify(result.data),
  })
}

export default function UserInvite() {
  const [open, setOpen] = useState(true)
  const { goBack } = useSmartNavigation({ baseUrl: href('/users') })

  return (
    <UsersInviteDialog
      key="user-invite"
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(false)
          // wait for the drawer to close
          setTimeout(() => {
            goBack()
          }, 300) // the duration of the modal close animation
        }
      }}
    />
  )
}

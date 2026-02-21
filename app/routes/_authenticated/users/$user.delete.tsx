import { IconAlertTriangle } from '@tabler/icons-react'
import { setTimeout as sleep } from 'node:timers/promises'
import { useEffect, useState } from 'react'
import { data, href, useFetcher } from 'react-router'
import { dataWithSuccess } from 'remix-toast'
import { ConfirmDialog } from '~/components/confirm-dialog'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import type { User } from './+data/schema'
import { users } from './+data/users'
import type { Route } from './+types/$user.delete'

export const action = async ({ params }: Route.ActionArgs) => {
  const user = users.find((user) => user.id === params.user)
  if (!user) {
    throw data(null, { status: 404, statusText: 'User not found' })
  }

  await sleep(1000)
  // remove the user from the list
  const updatedUsers = users.filter((u) => u.id !== user.id)
  users.length = 0
  users.push(...updatedUsers)

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

export function UserDeleteConfirmDialog({
  user,
  open,
  onOpenChange,
}: {
  user: User
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const [value, setValue] = useState('')
  const fetcher = useFetcher<typeof action>({ key: `user-delete-${user.id}` })

  useEffect(() => {
    if (fetcher.data?.done) onOpenChange(false)
  }, [fetcher.data, onOpenChange])

  useEffect(() => {
    if (!open) setValue('')
  }, [open])

  return (
    <ConfirmDialog
      key="user-delete"
      destructive
      open={open}
      onOpenChange={onOpenChange}
      disabled={value.trim() !== user.username}
      className="max-w-md"
      title={
        <span className="text-destructive">
          <IconAlertTriangle
            className="stroke-destructive mr-1 inline-block"
            size={18}
          />{' '}
          Delete User
        </span>
      }
      fetcher={fetcher}
      action={href('/users/:user/delete', { user: user.id })}
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Are you sure you want to delete{' '}
            <span className="font-bold">{user.username}</span>?
            <br />
            This action will permanently remove the user with the role of{' '}
            <span className="font-bold">{user.role.toUpperCase()}</span> from
            the system. This cannot be undone.
          </p>

          <Label className="my-2">
            Username:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter username to confirm deletion."
            />
          </Label>

          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be carefull, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText="Delete"
    />
  )
}

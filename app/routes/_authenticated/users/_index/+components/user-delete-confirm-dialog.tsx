import { IconAlertTriangle } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { href, useFetcher } from 'react-router'
import { ConfirmDialog } from '~/components/confirm-dialog'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import type { action } from '../../$user.delete'
import type { User } from '../../+data/schema'

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
              Please be careful, this operation cannot be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText="Delete"
    />
  )
}

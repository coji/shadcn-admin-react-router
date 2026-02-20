import type { SubmissionResult } from '@conform-to/react/future'
import { IconMailPlus, IconSend } from '@tabler/icons-react'
import { Form, useActionData, useNavigation } from 'react-router'
import { Select as ConformSelect } from '~/components/conform'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { SelectItem } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import { useForm } from '~/lib/forms'
import { formSchema } from '../+schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersInviteDialog({ open, onOpenChange }: Props) {
  const actionData = useActionData<{ result: SubmissionResult }>()
  const { form, fields, intent } = useForm(formSchema, {
    lastResult: actionData?.result,
    defaultValue: { email: '', role: '', desc: '' },
  })
  const navigation = useNavigation()

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        intent.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2">
            <IconMailPlus /> Invite User
          </DialogTitle>
          <DialogDescription>
            Invite new user to join your team by sending them an email
            invitation. Assign a role to define their access level.
          </DialogDescription>
        </DialogHeader>
        <Form method="POST" {...form.props} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor={fields.email.id}>Email</Label>
            <Input
              {...fields.email.inputProps}
              type="email"
              placeholder="eg: john.doe@gmail.com"
            />
            <div
              id={fields.email.errorId}
              className="text-destructive text-[0.8rem] font-medium empty:hidden"
            >
              {fields.email.errors}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor={fields.role.id}>Role</Label>
            <ConformSelect
              {...fields.role.selectProps}
              placeholder="Select a role"
            >
              <SelectItem value="superadmin">Superadmin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="cashier">Cashier</SelectItem>
            </ConformSelect>
            <div
              id={fields.role.errorId}
              className="text-destructive text-[0.8rem] font-medium empty:hidden"
            >
              {fields.role.errors}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor={fields.desc.id}>Description (optional)</Label>
            <Textarea
              {...fields.desc.textareaProps}
              className="resize-none"
              placeholder="Add a personal note to your invitation (optional)"
            />
            <div
              id={fields.desc.errorId}
              className="text-destructive text-[0.8rem] font-medium empty:hidden"
            >
              {fields.desc.errors}
            </div>
          </div>
        </Form>
        <DialogFooter className="gap-y-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            form={form.id}
            type="submit"
            disabled={navigation.state === 'submitting'}
          >
            Invite <IconSend />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

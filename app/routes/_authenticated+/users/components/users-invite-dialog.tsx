import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { IconMailPlus, IconSend } from '@tabler/icons-react'
import { Form } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'

const formSchema = z.object({
  email: z
    .string({ required_error: 'Email is required.' })
    .email({ message: 'Email is invalid.' }),
  role: z.string({ required_error: 'Role is required.' }),
  desc: z.string().optional(),
})

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersInviteDialog({ open, onOpenChange }: Props) {
  const [form, fields] = useForm({
    defaultValue: { email: '', role: '', desc: '' },
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: formSchema }),
    constraint: getZodConstraint(formSchema),
    onSubmit: (event, { submission }) => {
      event.preventDefault()
      if (submission?.status !== 'success') return
      form.reset()
      toast('You submitted the following values:', {
        description: (
          <pre className="mt-2 w-[320px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(submission.value, null, 2)}
            </code>
          </pre>
        ),
      })
      onOpenChange(false)
    },
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
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
        <Form {...getFormProps(form)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor={fields.email.id}>Email</Label>
            <Input
              {...getInputProps(fields.email, { type: 'email' })}
              key={fields.email.key}
              placeholder="eg: john.doe@gmail.com"
            />
            <div
              id={fields.email.errorId}
              className="text-[0.8rem] font-medium text-destructive"
            >
              {fields.email.errors}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor={fields.role.id}>Role</Label>
            <Select
              key={fields.role.key}
              name={fields.role.name}
              defaultValue={fields.role.initialValue}
              onValueChange={(value) => {
                form.update({
                  name: fields.role.name,
                  value,
                })
              }}
            >
              <SelectTrigger id={fields.role.id}>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="superadmin">Superadmin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="cashier">Cashier</SelectItem>
              </SelectContent>
            </Select>
            <div
              id={fields.email.errorId}
              className="text-[0.8rem] font-medium text-destructive"
            >
              {fields.role.errors}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor={fields.desc.id}>Description (optional)</Label>
            <Textarea
              {...getTextareaProps(fields.desc)}
              className="resize-none"
              placeholder="Add a personal note to your invitation (optional)"
            />
            <div
              id={fields.desc.errorId}
              className="text-[0.8rem] font-medium text-destructive"
            >
              {fields.desc.errors}
            </div>
          </div>
        </Form>
        <DialogFooter className="gap-y-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form={form.id}>
            Invite <IconSend />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

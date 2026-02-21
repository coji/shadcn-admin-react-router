import type { SubmissionResult } from '@conform-to/react/future'
import { parseSubmission, report } from '@conform-to/react/future'
import { coerceFormValue } from '@conform-to/zod/v4/future'
import { setTimeout as sleep } from 'node:timers/promises'
import { Form, href, Link, useActionData, useNavigation } from 'react-router'
import { redirectWithSuccess } from 'remix-toast'
import { z } from 'zod'
import { Select as ConformSelect } from '~/components/conform'
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderTitle,
} from '~/components/layout/page-header'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { SelectItem } from '~/components/ui/select'
import { Separator } from '~/components/ui/separator'
import { HStack } from '~/components/ui/stack'
import { Textarea } from '~/components/ui/textarea'
import { useSmartNavigation } from '~/hooks/use-smart-navigation'
import { useForm } from '~/lib/forms'
import type { RouteHandle } from '~/routes/_authenticated/_layout'
import type { Route } from './+types/invite'

export const handle: RouteHandle = {
  breadcrumb: () => ({ label: 'Invite' }),
}

const formSchema = coerceFormValue(
  z.object({
    email: z.email({
      error: (issue) =>
        issue.input === undefined
          ? 'Please enter your email'
          : 'Invalid email address',
    }),
    role: z.enum(['superadmin', 'admin', 'manager', 'cashier'], {
      error: 'Role is required.',
    }),
    desc: z.string().optional(),
  }),
)

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

  return redirectWithSuccess(
    `${href('/users')}?${url.searchParams.toString()}`,
    {
      message: 'User invited successfully!',
      description: JSON.stringify(result.data),
    },
  )
}

export default function UserInvite() {
  const actionData = useActionData<{ result: SubmissionResult }>()
  const { form, fields } = useForm(formSchema, {
    lastResult: actionData?.result,
    defaultValue: { email: '', role: '', desc: '' },
  })
  const navigation = useNavigation()
  const { backUrl } = useSmartNavigation({ baseUrl: href('/users') })

  return (
    <div>
      <PageHeader>
        <PageHeaderHeading>
          <PageHeaderTitle>Invite User</PageHeaderTitle>
          <PageHeaderDescription>
            Invite new user to join your team by sending them an email
            invitation. Assign a role to define their access level.
          </PageHeaderDescription>
        </PageHeaderHeading>
      </PageHeader>

      <Separator className="my-4 lg:my-6" />

      <Form method="POST" {...form.props} className="max-w-2xl space-y-4">
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

        <Separator className="my-4 lg:my-6" />

        <HStack className="justify-end gap-2">
          <Button variant="link" asChild>
            <Link to={backUrl}>Cancel</Link>
          </Button>
          <Button
            form={form.id}
            type="submit"
            disabled={navigation.state === 'submitting'}
          >
            Invite
          </Button>
        </HStack>
      </Form>
    </div>
  )
}

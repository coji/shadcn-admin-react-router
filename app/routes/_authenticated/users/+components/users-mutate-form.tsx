import type { SubmissionResult } from '@conform-to/react/future'
import { coerceFormValue } from '@conform-to/zod/v4/future'
import { Form, href, Link, useActionData, useNavigation } from 'react-router'
import { z } from 'zod'
import { Select as ConformSelect } from '~/components/conform'
import { PasswordInput } from '~/components/password-input'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { SelectItem } from '~/components/ui/select'
import { Separator } from '~/components/ui/separator'
import { HStack } from '~/components/ui/stack'
import { useSmartNavigation } from '~/hooks/use-smart-navigation'
import { useForm } from '~/lib/forms'
import { userTypes } from '../+data/data'
import type { User } from '../+data/schema'

const baseSchema = z.object({
  firstName: z.string({ error: 'First Name is required.' }),
  lastName: z.string({ error: 'Last Name is required.' }),
  username: z.string({ error: 'Username is required.' }),
  phoneNumber: z.string({ error: 'Phone number is required.' }),
  email: z.email({
    error: (issue) =>
      issue.input === undefined
        ? 'Email is required.'
        : 'Invalid email address',
  }),
  role: z.enum(['superadmin', 'admin', 'manager', 'cashier'], {
    error: 'Role is required.',
  }),
})

export const createSchema = coerceFormValue(
  baseSchema.merge(
    z.object({
      intent: z.literal('create'),
      password: z
        .string({
          error: (issue) =>
            issue.input === undefined
              ? 'Password is required.'
              : 'Invalid password',
        })
        .trim()
        .min(8, { error: 'Password must be at least 8 characters long.' })
        .regex(/[a-z]/, {
          error: 'Password must contain at least one lowercase letter.',
        })
        .regex(/\d/, { error: 'Password must contain at least one number.' }),
      confirmPassword: z
        .string({
          error: (issue) =>
            issue.input === undefined
              ? 'Confirm Password is required.'
              : 'Please confirm your password.',
        })
        .trim()
        .min(8, { error: 'Password must be at least 8 characters long.' })
        .regex(/[a-z]/, {
          error: 'Password must contain at least one lowercase letter.',
        })
        .regex(/\d/, { error: 'Password must contain at least one number.' }),
    }),
  ),
)

export const editSchema = coerceFormValue(
  baseSchema.merge(z.object({ intent: z.literal('edit') })),
)

const formSchema = coerceFormValue(
  z
    .discriminatedUnion('intent', [
      baseSchema.merge(
        z.object({
          intent: z.literal('create'),
          password: z
            .string({
              error: (issue) =>
                issue.input === undefined
                  ? 'Password is required.'
                  : 'Invalid password',
            })
            .trim()
            .min(8, { error: 'Password must be at least 8 characters long.' })
            .regex(/[a-z]/, {
              error: 'Password must contain at least one lowercase letter.',
            })
            .regex(/\d/, {
              error: 'Password must contain at least one number.',
            }),
          confirmPassword: z
            .string({
              error: (issue) =>
                issue.input === undefined
                  ? 'Confirm Password is required.'
                  : 'Please confirm your password.',
            })
            .trim()
            .min(8, { error: 'Password must be at least 8 characters long.' })
            .regex(/[a-z]/, {
              error: 'Password must contain at least one lowercase letter.',
            })
            .regex(/\d/, {
              error: 'Password must contain at least one number.',
            }),
        }),
      ),
      baseSchema.merge(z.object({ intent: z.literal('edit') })),
    ])
    .superRefine((arg, ctx) => {
      if (arg.intent !== 'create') return
      if (arg.password !== arg.confirmPassword) {
        ctx.addIssue({
          code: 'custom',
          message: "Passwords don't match.",
          path: ['confirmPassword'],
        })
      }
    }),
)

export function UsersMutateForm({ user }: { user?: User }) {
  const isEdit = !!user
  const actionData = useActionData<{ result: SubmissionResult }>()
  const { form, fields } = useForm(formSchema, {
    lastResult: actionData?.result,
    defaultValue: isEdit
      ? {
          ...user,
          password: '',
          confirmPassword: '',
        }
      : {
          firstName: '',
          lastName: '',
          username: '',
          email: '',
          role: '',
          phoneNumber: '',
          password: '',
          confirmPassword: '',
        },
  })
  const isPasswordTouched = fields.password.touched
  const navigation = useNavigation()
  const { backUrl } = useSmartNavigation({ baseUrl: href('/users') })

  return (
    <Form method="POST" {...form.props} className="max-w-2xl space-y-4">
      <Separator className="my-4 lg:my-6" />
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor={fields.firstName.id}>First Name</Label>
          <Input
            {...fields.firstName.inputProps}
            type="text"
            placeholder="John"
          />
          <div
            id={fields.firstName.errorId}
            className="text-destructive text-[0.8rem] font-medium empty:hidden"
          >
            {fields.firstName.errors}
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor={fields.lastName.id}>Last Name</Label>
          <Input
            {...fields.lastName.inputProps}
            type="text"
            placeholder="Doe"
          />
          <div
            id={fields.lastName.errorId}
            className="text-destructive text-[0.8rem] font-medium empty:hidden"
          >
            {fields.lastName.errors}
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor={fields.username.id}>Username</Label>
        <Input
          {...fields.username.inputProps}
          type="text"
          placeholder="john_doe"
        />
        <div
          id={fields.username.errorId}
          className="text-destructive text-[0.8rem] font-medium empty:hidden"
        >
          {fields.username.errors}
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor={fields.email.id}>Email</Label>
        <Input
          {...fields.email.inputProps}
          type="email"
          placeholder="john.doe@gmail.com"
        />
        <div
          id={fields.email.errorId}
          className="text-destructive text-[0.8rem] font-medium empty:hidden"
        >
          {fields.email.errors}
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor={fields.phoneNumber.id}>Phone Number</Label>
        <Input
          {...fields.phoneNumber.inputProps}
          type="tel"
          placeholder="+123456789"
        />
        <div
          id={fields.phoneNumber.errorId}
          className="text-destructive text-[0.8rem] font-medium empty:hidden"
        >
          {fields.phoneNumber.errors}
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor={fields.role.id}>Role</Label>
        <ConformSelect {...fields.role.selectProps} placeholder="Select a role">
          {userTypes.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </ConformSelect>
        <div
          id={fields.role.errorId}
          className="text-destructive text-[0.8rem] font-medium empty:hidden"
        >
          {fields.role.errors}
        </div>
      </div>

      {!isEdit && (
        <>
          <div className="space-y-1">
            <Label htmlFor={fields.password.id}>Password</Label>
            <PasswordInput
              {...fields.password.inputProps}
              placeholder="e.g., S3cur3P@ssw0rd"
            />
            <div
              id={fields.password.errorId}
              className="text-destructive text-[0.8rem] font-medium empty:hidden"
            >
              {fields.password.errors}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor={fields.confirmPassword.id}>Confirm Password</Label>
            <PasswordInput
              disabled={!isPasswordTouched}
              {...fields.confirmPassword.inputProps}
              placeholder="e.g., S3cur3P@ssw0rd"
            />
            <div
              id={fields.confirmPassword.errorId}
              className="text-destructive text-[0.8rem] font-medium empty:hidden"
            >
              {fields.confirmPassword.errors}
            </div>
          </div>
        </>
      )}

      <Separator className="my-4 lg:my-6" />

      <HStack className="justify-end gap-2">
        <Button variant="link" asChild>
          <Link to={backUrl}>Cancel</Link>
        </Button>
        <Button
          form={form.id}
          type="submit"
          name="intent"
          value={isEdit ? 'edit' : 'create'}
          disabled={navigation.state === 'submitting'}
        >
          Save changes
        </Button>
      </HStack>
    </Form>
  )
}

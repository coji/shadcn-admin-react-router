import { IconBrandFacebook, IconBrandGithub } from '@tabler/icons-react'
import type { HTMLAttributes } from 'react'
import { Form, href, Link, useActionData, useNavigation } from 'react-router'
import { PasswordInput } from '~/components/password-input'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { useForm } from '~/lib/forms'
import { cn } from '~/lib/utils'
import { formSchema } from '../+schema'
import type { action } from '../index'

type UserAuthFormProps = HTMLAttributes<HTMLFormElement>

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const actionData = useActionData<typeof action>()
  const { form, fields } = useForm(formSchema, {
    lastResult: actionData?.result,
    defaultValue: {
      email: '',
      password: '',
    },
  })
  const navigation = useNavigation()
  const isLoading = navigation.state === 'submitting'

  return (
    <Form
      method="POST"
      {...form.props}
      className={cn('grid gap-2', className)}
      {...props}
    >
      <div className="space-y-1">
        <Label htmlFor={fields.email.id}>Email</Label>
        <Input
          {...fields.email.inputProps}
          type="email"
          placeholder="name@example.com"
        />
        <div
          id={fields.email.errorId}
          className="text-destructive text-[0.8rem] font-medium empty:hidden"
        >
          {fields.email.errors}
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label htmlFor={fields.password.id}>Password</Label>
          <Link
            to={href('/forgot-password')}
            className="text-muted-foreground text-sm font-medium hover:opacity-75"
          >
            Forgot password?
          </Link>
        </div>
        <PasswordInput {...fields.password.inputProps} placeholder="********" />
        <div
          id={fields.password.errorId}
          className="text-destructive text-[0.8rem] font-medium empty:hidden"
        >
          {fields.password.errors}
        </div>
      </div>

      {form.errors && (
        <Alert variant="destructive">
          <AlertTitle>Login Error</AlertTitle>
          <AlertDescription>{form.errors}</AlertDescription>
        </Alert>
      )}

      <Button className="mt-2" disabled={isLoading}>
        Login
      </Button>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">
            Or continue with
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="w-full"
          type="button"
          disabled={isLoading}
        >
          <IconBrandGithub className="h-4 w-4" /> GitHub
        </Button>
        <Button
          variant="outline"
          className="w-full"
          type="button"
          disabled={isLoading}
        >
          <IconBrandFacebook className="h-4 w-4" /> Facebook
        </Button>
      </div>
    </Form>
  )
}

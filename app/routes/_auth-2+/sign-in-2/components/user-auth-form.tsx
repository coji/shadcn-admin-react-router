import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { IconBrandFacebook, IconBrandGithub } from '@tabler/icons-react'
import type { HTMLAttributes } from 'react'
import { Form, Link, useNavigation } from 'react-router'
import { z } from 'zod'
import { PasswordInput } from '~/components/password-input'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { cn } from '~/lib/utils'

type UserAuthFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z.object({
  email: z
    .string({ required_error: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  password: z.string({ required_error: 'Please enter your password' }).min(7, {
    message: 'Password must be at least 7 characters long',
  }),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [form, { email, password }] = useForm({
    defaultValue: {
      email: '',
      password: '',
    },
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: formSchema }),
  })
  const navigation = useNavigation()
  const isLoading = navigation.state === 'submitting'

  return (
    <Form
      method="POST"
      {...getFormProps(form)}
      className={cn('grid gap-2', className)}
      {...props}
    >
      <div>
        <Label htmlFor={email.id}>Email</Label>
        <Input
          {...getInputProps(email, { type: 'email' })}
          key={email.key}
          placeholder="name@example.com"
        />
        <div id={email.errorId} className="text-sm text-destructive">
          {email.errors}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor={password.id}>Password</Label>
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-muted-foreground hover:opacity-75"
          >
            Forgot password?
          </Link>
        </div>
        <PasswordInput
          {...getInputProps(password, { type: 'password' })}
          key={password.key}
          placeholder="********"
        />
        <div id={password.errorId} className="text-sm text-destructive">
          {password.errors}
        </div>
      </div>

      <Button className="mt-2" disabled={isLoading}>
        Login
      </Button>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
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
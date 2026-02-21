import { parseSubmission, report } from '@conform-to/react/future'
import { setTimeout } from 'node:timers/promises'
import { href } from 'react-router'
import { redirectWithSuccess } from 'remix-toast'
import { Card } from '~/components/ui/card'
import { UserAuthForm } from './+components/user-auth-form'
import { formSchema } from './+schema'
import type { Route } from './+types/index'

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseSubmission(await request.formData())
  const result = formSchema.safeParse(submission.payload)

  if (!result.success) {
    return {
      result: report(submission, { error: { issues: result.error.issues } }),
    }
  }

  if (result.data.email !== 'name@example.com') {
    return {
      result: report(submission, {
        error: { formErrors: ['Invalid email or password'] },
      }),
    }
  }
  await setTimeout(1000)

  throw await redirectWithSuccess(href('/'), {
    message: 'You have successfully logged in!',
  })
}

export default function SignIn() {
  return (
    <Card className="p-6">
      <div className="flex flex-col space-y-2 text-left">
        <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
        <p className="text-muted-foreground text-sm">
          Enter your email and password below <br />
          to log into your account
        </p>
      </div>
      <UserAuthForm />
      <p className="text-muted-foreground mt-4 px-8 text-center text-sm">
        By clicking login, you agree to our{' '}
        <a
          href="/terms"
          className="hover:text-primary underline underline-offset-4"
        >
          Terms of Service
        </a>{' '}
        and{' '}
        <a
          href="/privacy"
          className="hover:text-primary underline underline-offset-4"
        >
          Privacy Policy
        </a>
        .
      </p>
    </Card>
  )
}

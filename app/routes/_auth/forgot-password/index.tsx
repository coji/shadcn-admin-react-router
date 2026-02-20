import { parseSubmission, report } from '@conform-to/react/future'
import { setTimeout } from 'node:timers/promises'
import { href, Link } from 'react-router'
import { dataWithSuccess } from 'remix-toast'
import { Card } from '~/components/ui/card'
import { ForgotForm } from './+components/forgot-password-form'
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
        error: {
          formErrors: ['Email not found in our records. Please try again.'],
        },
      }),
    }
  }
  await setTimeout(1000)
  return dataWithSuccess(
    { result: report(submission, { reset: true }) },
    {
      message: 'Password reset link sent to your email',
    },
  )
}

export default function ForgotPassword() {
  return (
    <Card className="p-6">
      <div className="mb-2 flex flex-col space-y-2 text-left">
        <h1 className="text-md font-semibold tracking-tight">
          Forgot Password
        </h1>
        <p className="text-muted-foreground text-sm">
          Enter your registered email and <br /> we will send you a link to
          reset your password.
        </p>
      </div>
      <ForgotForm />
      <p className="text-muted-foreground mt-4 px-8 text-center text-sm">
        Don't have an account?{' '}
        <Link
          to={href('/sign-up')}
          className="hover:text-primary underline underline-offset-4"
        >
          Sign up
        </Link>
        .
      </p>
    </Card>
  )
}

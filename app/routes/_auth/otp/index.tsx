import { parseSubmission, report } from '@conform-to/react/future'
import { setTimeout } from 'node:timers/promises'
import { href, Link } from 'react-router'
import { redirectWithSuccess } from 'remix-toast'
import { Card } from '~/components/ui/card'
import { OtpForm } from './+components/otp-form'
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

  if (result.data.otp !== '123456') {
    return {
      result: report(submission, {
        error: { formErrors: ['Invalid OTP code'] },
      }),
    }
  }
  await setTimeout(1000)

  throw await redirectWithSuccess(href('/'), {
    message: 'You have successfully logged in!',
  })
}

export default function Otp() {
  return (
    <Card className="p-6">
      <div className="mb-2 flex flex-col space-y-2 text-left">
        <h1 className="text-md font-semibold tracking-tight">
          Two-factor Authentication
        </h1>
        <p className="text-muted-foreground text-sm">
          Please enter the authentication code. <br /> We have sent the
          authentication code to your email.
        </p>
      </div>
      <OtpForm />
      <p className="text-muted-foreground mt-4 px-8 text-center text-sm">
        Haven't received it?{' '}
        <Link
          to={href('/sign-in')}
          className="hover:text-primary underline underline-offset-4"
        >
          Resend a new code.
        </Link>
        .
      </p>
    </Card>
  )
}

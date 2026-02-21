import { parseSubmission, report } from '@conform-to/react/future'
import { setTimeout } from 'node:timers/promises'
import { href, Link } from 'react-router'
import { redirectWithSuccess } from 'remix-toast'
import { Card } from '~/components/ui/card'
import { SignUpForm } from './+components/sign-up-form'
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

  if (result.data.email === 'name@example.com') {
    return {
      result: report(submission, {
        error: {
          formErrors: ['User already exists with this email address'],
        },
      }),
    }
  }
  await setTimeout(1000)

  throw await redirectWithSuccess(href('/'), {
    message: 'Account created successfully!',
  })
}

export default function SignUp({ actionData }: Route.ComponentProps) {
  return (
    <Card className="p-6">
      <div className="mb-2 flex flex-col space-y-2 text-left">
        <h1 className="text-lg font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-muted-foreground text-sm">
          Enter your email and password to create an account. <br />
          Already have an account?{' '}
          <Link
            to={href('/sign-in')}
            className="hover:text-primary underline underline-offset-4"
          >
            Sign In
          </Link>
        </p>
      </div>
      <SignUpForm actionData={actionData} />
      <p className="text-muted-foreground mt-4 px-8 text-center text-sm">
        By creating an account, you agree to our{' '}
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

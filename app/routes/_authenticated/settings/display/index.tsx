import { parseSubmission, report } from '@conform-to/react/future'
import { setTimeout } from 'node:timers/promises'
import { dataWithSuccess } from 'remix-toast'
import type { RouteHandle } from '~/routes/_authenticated/_layout'
import ContentSection from '../+components/content-section'
import { DisplayForm } from './+display-form'
import { displayFormSchema } from './+schema'
import type { Route } from './+types/index'

export const handle: RouteHandle = {
  breadcrumb: () => ({ label: 'Display' }),
}

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseSubmission(await request.formData())
  const result = displayFormSchema.safeParse(submission.payload)

  if (!result.success) {
    return {
      result: report(submission, { error: { issues: result.error.issues } }),
    }
  }

  // Save the form data to the database or API.
  await setTimeout(1000)

  return dataWithSuccess(
    {
      result: report(submission, { reset: true }),
    },
    {
      message: 'Display settings updated.',
      description: JSON.stringify(result.data, null, 2),
    },
  )
}

export default function SettingsDisplay() {
  return (
    <ContentSection
      title="Display"
      desc="Turn items on or off to control what's displayed in the app."
    >
      <DisplayForm />
    </ContentSection>
  )
}

import { parseSubmission, report } from '@conform-to/react/future'
import { setTimeout } from 'node:timers/promises'
import { dataWithSuccess } from 'remix-toast'
import type { RouteHandle } from '~/routes/_authenticated/_layout'
import ContentSection from '../+components/content-section'
import ProfileForm from './+profile-form'
import { profileFormSchema } from './+schema'
import type { Route } from './+types/index'

export const handle: RouteHandle = {
  breadcrumb: () => ({ label: 'Profile' }),
}

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseSubmission(await request.formData())
  const result = profileFormSchema.safeParse(submission.payload)

  if (!result.success) {
    return {
      result: report(submission, { error: { issues: result.error.issues } }),
    }
  }

  if (result.data.username !== 'shadcn') {
    return {
      result: report(submission, {
        error: { formErrors: ['Username must be shadcn'] },
      }),
    }
  }

  // Save the form data to the database or API.
  await setTimeout(1000)

  return dataWithSuccess(
    {
      result: report(submission, { reset: true }),
    },
    {
      message: 'Profile updated!',
      description: JSON.stringify(result.data, null, 2),
    },
  )
}

export default function SettingsProfile() {
  return (
    <ContentSection
      title="Profile"
      desc="This is how others will see you on the site."
    >
      <ProfileForm />
    </ContentSection>
  )
}

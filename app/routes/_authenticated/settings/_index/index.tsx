import { parseWithZod } from '@conform-to/zod/v4'
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
  const submission = parseWithZod(await request.formData(), {
    schema: profileFormSchema,
  })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }
  if (submission.value.username !== 'shadcn') {
    return {
      lastResult: submission.reply({
        formErrors: ['Username must be shadcn'],
      }),
    }
  }

  // Save the form data to the database or API.
  await setTimeout(1000)

  return dataWithSuccess(
    {
      lastResult: submission.reply({ resetForm: true }),
    },
    {
      message: 'Profile updated!',
      description: JSON.stringify(submission.value, null, 2),
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

import { Form, href, Link, useActionData, useNavigation } from 'react-router'
import {
  Checkbox as ConformCheckbox,
  RadioGroup as ConformRadioGroup,
  Switch as ConformSwitch,
} from '~/components/conform'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { RadioGroupItem } from '~/components/ui/radio-group'
import { useForm } from '~/lib/forms'
import { notificationsFormSchema } from './+schema'
import type { action } from './index'

// This can come from your database or API.
const defaultValue = {
  communication_emails: false,
  marketing_emails: false,
  social_emails: true,
  security_emails: true,
}

export function NotificationsForm() {
  const actionData = useActionData<typeof action>()
  const { form, fields } = useForm(notificationsFormSchema, {
    lastResult: actionData?.result,
    defaultValue,
  })
  const navigation = useNavigation()

  return (
    <Form method="POST" {...form.props} className="space-y-8">
      <div className="relative space-y-3">
        <Label htmlFor={fields.type.id}>Notify me about...</Label>
        <ConformRadioGroup
          {...fields.type.radioGroupProps}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-y-0 space-x-3">
            <RadioGroupItem id={`${fields.type.id}-all`} value="all" />
            <Label htmlFor={`${fields.type.id}-all`} className="font-normal">
              All new messages
            </Label>
          </div>

          <div className="flex items-center space-y-0 space-x-3">
            <RadioGroupItem
              id={`${fields.type.id}-mentions`}
              value="mentions"
            />
            <Label
              htmlFor={`${fields.type.id}-mentions`}
              className="font-normal"
            >
              Direct messages and mentions
            </Label>
          </div>

          <div className="flex items-center space-y-0 space-x-3">
            <RadioGroupItem id={`${fields.type.id}-none`} value="none" />
            <Label htmlFor={`${fields.type.id}-none`} className="font-normal">
              Nothing
            </Label>
          </div>
        </ConformRadioGroup>
        <div
          id={fields.type.errorId}
          className="text-destructive text-[0.8rem] font-medium empty:hidden"
        >
          {fields.type.errors}
        </div>
      </div>

      <div className="relative">
        <h3 className="mb-4 text-lg font-medium">Email Notifications</h3>
        <div className="space-y-4">
          <div className="flex flex-row items-center justify-between space-y-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label
                htmlFor={fields.communication_emails.id}
                className="text-base"
              >
                Communication emails
              </Label>
              <div className="text-muted-foreground text-[0.8rem]">
                Receive emails about your account activity.
              </div>
            </div>
            <ConformSwitch {...fields.communication_emails.switchProps} />
          </div>

          <div className="flex flex-row items-center justify-between space-y-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor={fields.marketing_emails.id} className="text-base">
                Marketing emails
              </Label>
              <div className="text-muted-foreground text-[0.8rem]">
                Receive emails about new products, features, and more.
              </div>
            </div>
            <ConformSwitch {...fields.marketing_emails.switchProps} />
          </div>

          <div className="flex flex-row items-center justify-between space-y-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor={fields.social_emails.id} className="text-base">
                Social emails
              </Label>
              <div className="text-muted-foreground text-[0.8rem]">
                Receive emails for friend requests, follows, and more.
              </div>
            </div>
            <ConformSwitch {...fields.social_emails.switchProps} />
          </div>

          <div className="flex flex-row items-center justify-between space-y-2 rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor={fields.security_emails.id} className="text-base">
                Security emails
              </Label>
              <div className="text-muted-foreground text-[0.8rem]">
                Receive emails about your account activity and security.
              </div>
            </div>
            <ConformSwitch
              {...fields.security_emails.switchProps}
              disabled
              aria-readonly
            />
          </div>
        </div>
      </div>

      <div className="relative flex flex-row items-start space-y-0 space-x-3">
        <ConformCheckbox {...fields.mobile.checkboxProps} />

        <div className="space-y-1 leading-none">
          <Label htmlFor={fields.mobile.id}>
            Use different settings for my mobile devices
          </Label>
          <div className="text-muted-foreground text-[0.8rem]">
            You can manage your mobile notifications in the{' '}
            <Link
              to={href('/settings')}
              className="underline decoration-dashed underline-offset-4 hover:decoration-solid"
            >
              mobile settings
            </Link>{' '}
            page.
          </div>
        </div>
      </div>

      {form.errors && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{form.errors}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={navigation.state === 'submitting'}>
        Update notifications
      </Button>
    </Form>
  )
}

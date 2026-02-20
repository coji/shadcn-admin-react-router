import { XIcon } from 'lucide-react'
import { Form, href, Link, useActionData, useNavigation } from 'react-router'
import { Select as ConformSelect } from '~/components/conform'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { SelectItem } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import { useForm } from '~/lib/forms'
import { profileFormSchema } from './+schema'
import type { action } from './index'

// This can come from your database or API.
const defaultValue = {
  username: 'shadcn',
  email: 'm@example.com',
  bio: 'I own a computer.',
  urls: ['https://shadcn.com', 'http://twitter.com/shadcn'],
}

export default function ProfileForm() {
  const actionData = useActionData<typeof action>()
  const { form, fields, intent } = useForm(profileFormSchema, {
    lastResult: actionData?.result,
    defaultValue,
  })
  const urls = fields.urls.getFieldList()
  const navigation = useNavigation()

  return (
    <Form method="POST" {...form.props} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor={fields.username.id}>Username</Label>
        <Input
          {...fields.username.inputProps}
          type="text"
          placeholder="shadcn"
        />
        <div className="text-muted-foreground text-[0.8rem]">
          This is your public display name. It can be your real name or a
          pseudonym. You can only change this once every 30 days.
        </div>
        <div
          id={fields.username.errorId}
          className="text-destructive text-[0.8rem] font-medium empty:hidden"
        >
          {fields.username.errors}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={fields.email.id}>Email</Label>
        <ConformSelect
          {...fields.email.selectProps}
          placeholder="Select a verified email to display"
        >
          <SelectItem value="m@example.com">m@example.com</SelectItem>
          <SelectItem value="m@google.com">m@google.com</SelectItem>
          <SelectItem value="m@support.com">m@support.com</SelectItem>
        </ConformSelect>
        <div className="text-muted-foreground text-[0.8rem]">
          You can manage verified email addresses in your{' '}
          <Link to={href('/')}>email settings</Link>.
        </div>
        <div
          id={fields.email.errorId}
          className="text-destructive text-[0.8rem] font-medium empty:hidden"
        >
          {fields.email.errors}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={fields.bio.id}>Bio</Label>
        <Textarea
          {...fields.bio.textareaProps}
          placeholder="Tell us a little bit about yourself"
          className="resize-none"
        />
        <div className="text-muted-foreground text-[0.8rem]">
          You can <span>@mention</span> other users and organizations to link to
          them.
        </div>
        <div
          id={fields.bio.errorId}
          className="text-destructive text-[0.8rem] font-medium empty:hidden"
        >
          {fields.bio.errors}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={fields.urls.id}>URLs</Label>
        <div className="text-muted-foreground text-[0.8rem]">
          Add links to your website, blog, or social media profiles.
        </div>

        {urls.map((url, index) => (
          <div key={url.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                {...url.inputProps}
                type="url"
                placeholder="https://example.com"
                className="flex-1"
              />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="text-muted-foreground hover:text-muted-foreground"
                onClick={() =>
                  intent.remove({
                    name: fields.urls.name,
                    index,
                  })
                }
              >
                <XIcon />
              </Button>
            </div>
            <div
              id={url.errorId}
              className="text-destructive text-[0.8rem] font-medium empty:hidden"
            >
              {url.errors}
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() =>
            intent.insert({
              name: fields.urls.name,
            })
          }
        >
          Add URL
        </Button>
      </div>

      {form.errors && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{form.errors}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={navigation.state === 'submitting'}>
        Update profile
      </Button>
    </Form>
  )
}

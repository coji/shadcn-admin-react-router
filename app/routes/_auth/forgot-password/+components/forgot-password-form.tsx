import type { HTMLAttributes } from 'react'
import { Form, useActionData, useNavigation } from 'react-router'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { useForm } from '~/lib/forms'
import { cn } from '~/lib/utils'
import { formSchema } from '../+schema'
import type { action } from '../index'

type ForgotFormProps = HTMLAttributes<HTMLFormElement>

export function ForgotForm({ className, ...props }: ForgotFormProps) {
  const actionData = useActionData<typeof action>()
  const { form, fields } = useForm(formSchema, {
    lastResult: actionData?.result,
    defaultValue: { email: '' },
  })
  const navigation = useNavigation()

  return (
    <Form
      method="POST"
      {...form.props}
      className={cn('grid gap-2', className)}
      {...props}
    >
      <div className="space-y-1">
        <Label htmlFor={fields.email.id}>Email</Label>
        <Input
          {...fields.email.inputProps}
          type="email"
          placeholder="name@example.com"
        />
        <div
          id={fields.email.errorId}
          className="text-destructive text-[0.8rem] font-medium empty:hidden"
        >
          {fields.email.errors}
        </div>
      </div>

      {form.errors && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{form.errors}</AlertDescription>
        </Alert>
      )}

      <Button className="mt-2" disabled={navigation.state === 'submitting'}>
        Continue
      </Button>
    </Form>
  )
}

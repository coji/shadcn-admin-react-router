import { useFormData } from '@conform-to/react/future'
import type { HTMLAttributes } from 'react'
import { Form, useNavigation } from 'react-router'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '~/components/ui/input-otp'
import { useForm } from '~/lib/forms'
import { cn } from '~/lib/utils'
import { formSchema } from '../+schema'
import type { action } from '../index'

type OtpFormProps = HTMLAttributes<HTMLFormElement> & {
  actionData?: Awaited<ReturnType<typeof action>>
}

export function OtpForm({ className, actionData, ...props }: OtpFormProps) {
  const { form, fields, intent } = useForm(formSchema, {
    lastResult: actionData?.result,
    defaultValue: { otp: '' },
  })
  const navigation = useNavigation()
  const otpValue = useFormData(form.id, (formData) =>
    formData.get(fields.otp.name),
  )

  return (
    <Form
      method="POST"
      {...form.props}
      className={cn('grid gap-2', className)}
      {...props}
    >
      <div className="space-y-1">
        <InputOTP
          name={fields.otp.name}
          maxLength={6}
          containerClassName="justify-center"
          onComplete={(value) => {
            intent.update({
              name: fields.otp.name,
              value,
            })
          }}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>

          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {form.errors && (
        <Alert variant="destructive">
          <AlertTitle>Login Error</AlertTitle>
          <AlertDescription>{form.errors}</AlertDescription>
        </Alert>
      )}

      <Button
        className="mt-2"
        disabled={
          !otpValue ||
          String(otpValue).length < 6 ||
          navigation.state === 'submitting'
        }
      >
        Verify
      </Button>
    </Form>
  )
}

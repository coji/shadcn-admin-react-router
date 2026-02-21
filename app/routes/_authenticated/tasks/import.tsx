import { parseSubmission, report } from '@conform-to/react/future'
import { coerceFormValue } from '@conform-to/zod/v4/future'
import { setTimeout as sleep } from 'node:timers/promises'
import { Form, href, Link } from 'react-router'
import { redirectWithSuccess } from 'remix-toast'
import { z } from 'zod'
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderTitle,
} from '~/components/layout/page-header'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Separator } from '~/components/ui/separator'
import { HStack } from '~/components/ui/stack'
import { useSmartNavigation } from '~/hooks/use-smart-navigation'
import { useForm } from '~/lib/forms'
import type { RouteHandle } from '~/routes/_authenticated/_layout'
import type { Route } from './+types/import'

export const formSchema = coerceFormValue(
  z.object({
    file: z
      .instanceof(File, { message: 'Please upload a file.' })
      .refine(
        (file) => ['text/csv'].includes(file.type),
        'Please upload csv format.',
      ),
  }),
)

export const handle: RouteHandle = {
  breadcrumb: () => ({ label: 'Import' }),
}

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseSubmission(await request.formData())
  const result = formSchema.safeParse(submission.payload)

  if (!result.success) {
    return {
      result: report(submission, { error: { issues: result.error.issues } }),
    }
  }

  await sleep(1000)

  // Create a new task
  return redirectWithSuccess(href('/tasks'), {
    message: 'Tasks imported successfully.',
    description: `File: ${result.data.file.name}`,
  })
}

export default function TaskImport({ actionData }: Route.ComponentProps) {
  const { form, fields } = useForm(formSchema, {
    lastResult: actionData?.result,
    defaultValue: { file: undefined },
  })
  const { backUrl } = useSmartNavigation({ baseUrl: href('/tasks') })

  return (
    <div>
      <PageHeader>
        <PageHeaderHeading>
          <PageHeaderTitle>Import Task</PageHeaderTitle>
          <PageHeaderDescription>
            Import tasks quickly from a CSV file.
          </PageHeaderDescription>
        </PageHeaderHeading>
      </PageHeader>

      <Separator className="my-4 lg:my-6" />

      <Form
        method="POST"
        encType="multipart/form-data"
        {...form.props}
        className="max-w-2xl"
      >
        <div className="mb-2 space-y-1">
          <Label htmlFor={fields.file.id}>File</Label>
          <Input {...fields.file.inputProps} type="file" />
          <div
            id={fields.file.errorId}
            className="text-destructive text-[0.8rem] font-medium empty:hidden"
          >
            {fields.file.errors}
          </div>
        </div>

        <Separator className="my-4 lg:my-6" />

        <HStack className="justify-end">
          <Button variant="link" asChild>
            <Link to={backUrl}>Cancel</Link>
          </Button>
          <Button type="submit">Import</Button>
        </HStack>
      </Form>
    </div>
  )
}

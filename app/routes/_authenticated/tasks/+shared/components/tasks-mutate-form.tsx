import type { SubmissionResult } from '@conform-to/react/future'
import { coerceFormValue } from '@conform-to/zod/v4/future'
import { Form, href, Link, useActionData, useNavigation } from 'react-router'
import { z } from 'zod'
import {
  RadioGroup as ConformRadioGroup,
  Select as ConformSelect,
} from '~/components/conform'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { RadioGroupItem } from '~/components/ui/radio-group'
import { SelectItem } from '~/components/ui/select'
import { Separator } from '~/components/ui/separator'
import { HStack } from '~/components/ui/stack'
import { useSmartNavigation } from '~/hooks/use-smart-navigation'
import { useForm } from '~/lib/forms'
import type { Task } from '../data/schema'

export const createSchema = coerceFormValue(
  z.object({
    intent: z.literal('create'),
    title: z
      .string({
        error: 'Title is required.',
      })
      .trim()
      .min(1, 'Title is required.'),
    status: z.string({ error: 'Please select a status.' }),
    label: z.string({ error: 'Please select a label.' }),
    priority: z.string({ error: 'Please choose a priority.' }),
  }),
)

export const updateSchema = coerceFormValue(
  z.object({
    intent: z.literal('update'),
    id: z.string(),
    title: z
      .string({ error: 'Title is required.' })
      .trim()
      .min(1, 'Title is required.'),
    status: z.string({ error: 'Please select a status.' }),
    label: z.string({ error: 'Please select a label.' }),
    priority: z.string({ error: 'Please choose a priority.' }),
  }),
)

const formSchema = coerceFormValue(
  z.discriminatedUnion('intent', [
    z.object({
      intent: z.literal('create'),
      title: z
        .string({ error: 'Title is required.' })
        .trim()
        .min(1, 'Title is required.'),
      status: z.string({ error: 'Please select a status.' }),
      label: z.string({ error: 'Please select a label.' }),
      priority: z.string({ error: 'Please choose a priority.' }),
    }),
    z.object({
      intent: z.literal('update'),
      id: z.string(),
      title: z
        .string({ error: 'Title is required.' })
        .trim()
        .min(1, 'Title is required.'),
      status: z.string({ error: 'Please select a status.' }),
      label: z.string({ error: 'Please select a label.' }),
      priority: z.string({ error: 'Please choose a priority.' }),
    }),
  ]),
)

export function TasksMutateForm({ task }: { task?: Task }) {
  const isUpdate = !!task
  const actionData = useActionData<{ result: SubmissionResult }>()
  const { form, fields } = useForm(formSchema, {
    lastResult: actionData?.result,
    defaultValue: task ?? {
      title: '',
      status: '',
      label: '',
      priority: '',
    },
  })
  const navigation = useNavigation()
  const { backUrl } = useSmartNavigation({ baseUrl: href('/tasks') })

  return (
    <Form method="POST" {...form.props} className="max-w-2xl space-y-5">
      <input
        type="hidden"
        name={fields.id.name}
        defaultValue={fields.id.defaultValue}
      />
      <div className="space-y-1">
        <Label htmlFor={fields.title.id}>Title</Label>
        <Input
          {...fields.title.inputProps}
          type="text"
          placeholder="Enter a title"
        />
        <div
          id={fields.title.errorId}
          className="text-destructive text-[0.8rem] font-medium empty:hidden"
        >
          {fields.title.errors}
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor={fields.status.id}>Status</Label>
        <ConformSelect
          {...fields.status.selectProps}
          placeholder="Select dropdown"
        >
          <SelectItem value="in progress">In Progress</SelectItem>
          <SelectItem value="backlog">Backlog</SelectItem>
          <SelectItem value="todo">Todo</SelectItem>
          <SelectItem value="canceled">Canceled</SelectItem>
          <SelectItem value="done">Done</SelectItem>
        </ConformSelect>
        <div
          id={fields.status.errorId}
          className="text-destructive text-[0.8rem] font-medium empty:hidden"
        >
          {fields.status.errors}
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor={fields.label.id}>Label</Label>
        <ConformRadioGroup {...fields.label.radioGroupProps} className="gap-3">
          <HStack className="gap-3">
            <RadioGroupItem id="documentation" value="documentation" />
            <Label htmlFor="documentation" className="font-normal">
              Documentation
            </Label>
          </HStack>
          <HStack className="gap-3">
            <RadioGroupItem id="feature" value="feature" />
            <Label htmlFor="feature" className="font-normal">
              Feature
            </Label>
          </HStack>
          <HStack className="gap-3">
            <RadioGroupItem id="bug" value="bug" />
            <Label htmlFor="bug" className="font-normal">
              Bug
            </Label>
          </HStack>
        </ConformRadioGroup>
        <div
          id={fields.label.errorId}
          className="text-destructive text-[0.8rem] font-medium empty:hidden"
        >
          {fields.label.errors}
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor={fields.priority.id}>Priority</Label>
        <ConformRadioGroup
          {...fields.priority.radioGroupProps}
          className="gap-3"
        >
          <HStack className="gap-3">
            <RadioGroupItem id="high" value="high" />
            <Label htmlFor="high" className="font-normal">
              High
            </Label>
          </HStack>
          <HStack className="gap-3">
            <RadioGroupItem id="medium" value="medium" />
            <Label htmlFor="medium" className="font-normal">
              Medium
            </Label>
          </HStack>
          <HStack className="gap-3">
            <RadioGroupItem id="low" value="low" />
            <Label htmlFor="low" className="font-normal">
              Low
            </Label>
          </HStack>
        </ConformRadioGroup>
        <div
          id={fields.priority.errorId}
          className="text-destructive text-[0.8rem] font-medium empty:hidden"
        >
          {fields.priority.errors}
        </div>
      </div>

      <Separator className="my-4 lg:my-6" />

      <HStack className="justify-end gap-2">
        <Button variant="link" asChild>
          <Link to={backUrl}>Cancel</Link>
        </Button>
        <Button
          form={form.id}
          type="submit"
          name="intent"
          value={isUpdate ? 'update' : 'create'}
          disabled={navigation.state === 'submitting'}
        >
          Save changes
        </Button>
      </HStack>
    </Form>
  )
}

import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { Form } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet'
import { HStack } from '~/components/ui/stack'
import type { Task } from '../data/schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Task
}

const formSchema = z.object({
  title: z.string({ required_error: 'Title is required.' }),
  status: z.string({ required_error: 'Please select a status.' }),
  label: z.string({ required_error: 'Please select a label.' }),
  priority: z.string({ required_error: 'Please choose a priority.' }),
})
type TasksForm = z.infer<typeof formSchema>

export function TasksMutateDrawer({ open, onOpenChange, currentRow }: Props) {
  const isUpdate = !!currentRow

  const [form, fields] = useForm<TasksForm>({
    defaultValue: currentRow ?? {
      title: '',
      status: '',
      label: '',
      priority: '',
    },
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: formSchema }),
    onSubmit: (event, { submission }) => {
      event.preventDefault()
      if (submission?.status !== 'success') return

      onOpenChange(false)
      form.reset()
      toast('You submitted the following values:', {
        description: (
          <pre className="mt-2 w-[320px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(submission.value, null, 2)}
            </code>
          </pre>
        ),
      })
    },
  })

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        form.reset()
      }}
    >
      <SheetContent className="flex flex-col">
        <SheetHeader className="text-center sm:text-left">
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Task</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the task by providing necessary info.'
              : 'Add a new task by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <Form {...getFormProps(form)} className="flex-1 space-y-5">
          <div className="space-y-1">
            <Label htmlFor={fields.title.id}>Title</Label>
            <Input
              {...getInputProps(fields.title, { type: 'text' })}
              key={fields.title.key}
              placeholder="Enter a title"
            />
            <div
              id={fields.title.errorId}
              className="text-[0.8rem] font-medium text-destructive empty:hidden"
            >
              {fields.title.errors}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor={fields.status.id}>Status</Label>
            <Select
              key={fields.status.key}
              name={fields.status.name}
              defaultValue={fields.status.initialValue}
              onValueChange={(value) => {
                form.update({
                  name: fields.status.name,
                  value,
                })
              }}
            >
              <SelectTrigger id={fields.status.id}>
                <SelectValue placeholder="Select dropdown" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in progress">In Progress</SelectItem>
                <SelectItem value="backlog">Backlog</SelectItem>
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
            <div
              id={fields.status.errorId}
              className="text-[0.8rem] font-medium text-destructive empty:hidden"
            >
              {fields.status.errors}
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor={fields.label.id}>Label</Label>
            <RadioGroup
              key={fields.label.key}
              name={fields.label.name}
              defaultValue={fields.label.initialValue}
              onValueChange={(value) => {
                form.update({
                  name: fields.label.name,
                  value,
                })
              }}
              className="gap-3"
            >
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
            </RadioGroup>
            <div
              id={fields.label.errorId}
              className="text-[0.8rem] font-medium text-destructive empty:hidden"
            >
              {fields.label.errors}
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor={fields.priority.id}>Priority</Label>
            <RadioGroup
              key={fields.priority.key}
              name={fields.priority.name}
              defaultValue={fields.priority.initialValue}
              onValueChange={(value) => {
                form.update({
                  name: fields.priority.name,
                  value,
                })
              }}
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
            </RadioGroup>
            <div
              id={fields.priority.errorId}
              className="text-[0.8rem] font-medium text-destructive empty:hidden"
            >
              {fields.priority.errors}
            </div>
          </div>
        </Form>

        <SheetFooter className="gap-2">
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
          <Button form={form.id} type="submit">
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

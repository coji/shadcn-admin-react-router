import { useControl } from '@conform-to/react/future'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { useRef } from 'react'
import { Form, useActionData, useNavigation } from 'react-router'
import { DatePicker } from '~/components/conform'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { useForm } from '~/lib/forms'
import { cn } from '~/lib/utils'
import { accountFormSchema } from './+schema'
import type { action } from './index'

const languages = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Spanish', value: 'es' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Russian', value: 'ru' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Chinese', value: 'zh' },
] as const

// This can come from your database or API.
const defaultValue = {
  name: '',
}

function LanguageCombobox({
  id,
  name,
  defaultValue,
  'aria-describedby': ariaDescribedBy,
}: {
  id?: string
  name: string
  defaultValue?: string
  'aria-describedby'?: string
}) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const control = useControl({
    defaultValue,
    onFocus() {
      triggerRef.current?.focus()
    },
  })

  return (
    <>
      <input ref={control.register} name={name} hidden />
      <Popover
        onOpenChange={(open) => {
          if (!open) {
            control.blur()
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            id={id}
            ref={triggerRef}
            variant="outline"
            role="combobox"
            aria-describedby={ariaDescribedBy}
            className={cn(
              'w-50 justify-between',
              !control.value && 'text-muted-foreground',
            )}
          >
            {control.value
              ? languages.find((language) => language.value === control.value)
                  ?.label
              : 'Select language'}
            <CaretSortIcon className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-50 p-0">
          <Command>
            <CommandInput placeholder="Search language..." />
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              <CommandList>
                {languages.map((language) => (
                  <CommandItem
                    value={language.label}
                    key={language.value}
                    onSelect={(value) => {
                      const selectedLanguage = languages.find(
                        (lang) => lang.label === value,
                      )
                      if (!selectedLanguage) return
                      control.change(selectedLanguage.value)
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        'h-4 w-4',
                        language.value === control.value
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                    {language.label}
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  )
}

export function AccountForm() {
  const actionData = useActionData<typeof action>()
  const { form, fields } = useForm(accountFormSchema, {
    lastResult: actionData?.result,
    defaultValue,
  })
  const navigation = useNavigation()

  return (
    <Form method="POST" {...form.props} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor={fields.name.id}>Name</Label>
        <Input
          {...fields.name.inputProps}
          type="text"
          placeholder="Your name"
        />
        <div className="text-muted-foreground text-[0.8rem]">
          This is the name that will be displayed on your profile and in emails.
        </div>
        <div
          id={fields.name.errorId}
          className="text-destructive text-[0.8rem] font-medium empty:hidden"
        >
          {fields.name.errors}
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <Label htmlFor={fields.dob.id}>Date of birth</Label>
        <DatePicker
          {...fields.dob.datePickerProps}
          calendarDisabled={(date: Date) =>
            date > new Date() || date < new Date('1900-01-01')
          }
        />
        <div className="text-muted-foreground text-[0.8rem]">
          Your date of birth is used to calculate your age.
        </div>
        <div
          id={fields.dob.errorId}
          className="text-destructive text-[0.8rem] font-medium empty:hidden"
        >
          {fields.dob.errors}
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <Label htmlFor={fields.language.id}>Language</Label>
        <LanguageCombobox {...fields.language.comboBoxProps} />
        <div className="text-muted-foreground text-[0.8rem]">
          This is the language that will be used in the dashboard.
        </div>
        <div
          id={fields.language.errorId}
          className="text-destructive text-[0.8rem] font-medium empty:hidden"
        >
          {fields.language.errors}
        </div>
      </div>

      {form.errors && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{form.errors}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={navigation.state === 'submitting'}>
        Update account
      </Button>
    </Form>
  )
}

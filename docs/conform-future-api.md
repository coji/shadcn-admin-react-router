# Conform Future API Guide

This project builds all forms using Conform's **future API** (`@conform-to/react/future`).

## Why the Future API?

Compared to the legacy API (`getFormProps`, `getInputProps`, `parseWithZod`, etc.):

- **Schema-first**: `useForm(schema, options)` automatically infers types from the schema
- **Props spreading**: Spread directly with `form.props`, `fields.email.inputProps`
- **Intent as functions**: `intent.insert()`, `intent.remove()`, etc. are function calls, not button props
- **useControl**: Concise integration with non-native components like shadcn/ui

## Architecture

```
app/lib/forms.ts              <- configureForms() defines project-wide useForm
app/components/conform/*.tsx   <- shadcn/ui wrappers (useControl-based)
app/routes/**/+schema.ts       <- Zod schemas (wrapped with coerceFormValue)
app/routes/**/index.tsx        <- Server actions (parseSubmission + report)
app/routes/**/*.tsx            <- Form components (useForm from ~/lib/forms)
```

## Setup: `app/lib/forms.ts`

Call `configureForms()` once for the entire project and export a customized `useForm`.

```ts
import { configureForms } from '@conform-to/react/future'
import { getConstraints } from '@conform-to/zod/v4/future'

const forms = configureForms({
  getConstraints,
  shouldValidate: 'onInput',
  shouldRevalidate: 'onBlur',
  extendFieldMetadata(metadata) {
    return {
      get inputProps() {
        return {
          id: metadata.id,
          name: metadata.name,
          defaultValue: metadata.defaultValue,
          required: metadata.required,
          minLength: metadata.minLength,
          maxLength: metadata.maxLength,
          min: metadata.min,
          max: metadata.max,
          step: metadata.step,
          multiple: metadata.multiple,
          pattern: metadata.pattern,
          accept: metadata.accept,
          'aria-describedby': metadata.ariaDescribedBy,
          'aria-invalid': metadata.ariaInvalid,
        }
      },
      // textareaProps, checkboxProps, switchProps, selectProps,
      // radioGroupProps, datePickerProps, comboBoxProps, inputOTPProps
      // defined similarly with relevant subset of constraint props
    }
  },
})

export const { useForm, useFormMetadata, useField, useIntent, FormProvider } =
  forms
```

### Metadata Properties Used in Props Spreaders

The `metadata` object provided to `extendFieldMetadata` contains properties derived from the Zod schema via `getConstraints`, plus Conform's runtime state:

| Property                     | Source                                     | Used in                                        |
| ---------------------------- | ------------------------------------------ | ---------------------------------------------- |
| `id`, `name`, `defaultValue` | Conform core                               | All props                                      |
| `ariaDescribedBy`            | Conform (links to `errorId`)               | All props                                      |
| `ariaInvalid`                | Conform (touched + has errors)             | All props                                      |
| `required`                   | `getConstraints` from schema               | All props                                      |
| `minLength`, `maxLength`     | `getConstraints` from `z.string().min/max` | `inputProps`, `textareaProps`, `inputOTPProps` |
| `min`, `max`, `step`         | `getConstraints` from `z.number().min/max` | `inputProps`                                   |
| `multiple`                   | `getConstraints` from `z.array()`          | `inputProps`                                   |
| `pattern`                    | `getConstraints` from `z.regex()`          | `inputProps`                                   |
| `accept`                     | Manual constraint                          | `inputProps`                                   |
| `defaultChecked`             | Conform core                               | `checkboxProps`, `switchProps`                 |

**Note on `ariaInvalid`**: Use `metadata.ariaInvalid` rather than `!metadata.valid`. The `ariaInvalid` property is `true` only when the field has been touched and has errors, while `valid` is `false` even before the user interacts with the field.

### Do Not Pass `isSchema`

Passing `isSchema` to `configureForms` causes `BaseSchema` to be inferred as `ZodAny`,
making the return type of `coerceFormValue()` (`ZodType<O, I>`) unassignable to `ZodAny`, resulting in a type error.

`isSchema` is designed to be used together with `validateSchema` + module augmentation
(see [PR #1131](https://github.com/edmundhung/conform/pull/1131)),
but with Zod v4 supporting Standard Schema v1, the schema-first `useForm(schema, opts)`
works as-is, so `getConstraints` alone is sufficient.

## Schema Definition: `+schema.ts`

Wrapping with `coerceFormValue()` automatically converts form string values to the correct types.

```ts
import { coerceFormValue } from '@conform-to/zod/v4/future'
import { z } from 'zod'

export const formSchema = coerceFormValue(
  z.object({
    email: z.email({
      error: (issue) => (!issue.input ? 'Required' : 'Invalid'),
    }),
    password: z.string({ error: 'Required' }).min(7, { message: 'Too short' }),
  }),
)
```

Cases where `coerceFormValue` is especially useful:

- `z.number()` - string `"25"` -> number `25`
- `z.boolean()` - `"on"` -> `true`
- `z.date()` - ISO string -> `Date`

Wrap even string-only schemas for pattern consistency.

### Discriminated Union Schemas

When using `z.discriminatedUnion()` (e.g., forms with separate create/update schemas),
wrap **both individual variants** and the **combined schema** with `coerceFormValue`.

```ts
// Individual variants (used in server actions)
export const createSchema = coerceFormValue(
  z.object({
    intent: z.literal('create'),
    title: z.string().min(1),
    status: z.enum(['todo', 'in-progress', 'done']),
  }),
)

export const updateSchema = coerceFormValue(
  z.object({
    intent: z.literal('update'),
    id: z.string(),
    title: z.string().min(1),
    status: z.enum(['todo', 'in-progress', 'done']),
  }),
)

// Combined schema (used in client-side useForm)
// ⚠️ coerceFormValue returns a ZodPipe, so it can't be passed directly to z.discriminatedUnion().
//    The inner schemas must be written out again.
export const formSchema = coerceFormValue(
  z.discriminatedUnion('intent', [
    z.object({ intent: z.literal('create'), title: z.string().min(1), ... }),
    z.object({ intent: z.literal('update'), id: z.string(), ... }),
  ]),
)
```

**Note**: The return type of `coerceFormValue()` is `ZodPipe`, which cannot be used as a member of `z.discriminatedUnion()`. For the combined schema, rewrite the inner object schemas and wrap the entire thing with `coerceFormValue`.

## Server Actions: `index.tsx`

```ts
import { parseSubmission, report } from '@conform-to/react/future'
import { formSchema } from './+schema'

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseSubmission(await request.formData())
  const result = formSchema.safeParse(submission.payload)

  // Validation error
  if (!result.success) {
    return {
      result: report(submission, { error: { issues: result.error.issues } }),
    }
  }

  // Business logic error
  if (someConditionFails) {
    return {
      result: report(submission, {
        error: { formErrors: ['Something went wrong'] },
      }),
    }
  }

  // Success
  return redirect('/dashboard')
}
```

### Usage with remix-toast

When using `dataWithError` / `dataWithSuccess`:

```ts
import { dataWithError, dataWithSuccess } from 'remix-toast'

// On error
throw dataWithError(
  report(submission, { error: { issues: result.error.issues } }),
  { message: 'Invalid submission' },
)

// On success
return dataWithSuccess(null, { message: 'Updated successfully' })
```

### Legacy -> Future Migration Table (Server)

| Legacy                                    | Future                                                               |
| ----------------------------------------- | -------------------------------------------------------------------- |
| `parseWithZod(formData, { schema })`      | `parseSubmission(formData)` + `schema.safeParse(submission.payload)` |
| `submission.reply()`                      | `report(submission, { error: { issues } })`                          |
| `submission.reply({ formErrors: [...] })` | `report(submission, { error: { formErrors: [...] } })`               |
| `submission.reply({ resetForm: true })`   | `report(submission, { reset: true })`                                |
| `{ lastResult: submission.reply() }`      | `{ result: report(submission, ...) }`                                |

## Form Components

```tsx
import { Form, useActionData } from 'react-router'
import { useForm } from '~/lib/forms'
import { formSchema } from '../+schema'

export function MyForm() {
  const actionData = useActionData<typeof action>()
  const { form, fields } = useForm(formSchema, {
    lastResult: actionData?.result,
    defaultValue: { email: '', password: '' },
  })

  return (
    <Form method="POST" {...form.props}>
      {/* Native input - spread inputProps */}
      <Input {...fields.email.inputProps} type="email" />
      <div id={fields.email.errorId}>{fields.email.errors}</div>

      {/* Form-level errors */}
      {form.errors && <Alert>{form.errors}</Alert>}

      <Button type="submit">Submit</Button>
    </Form>
  )
}
```

### Legacy -> Future Migration Table (Client)

| Legacy                                            | Future                                                    |
| ------------------------------------------------- | --------------------------------------------------------- |
| `const [form, fields] = useForm({...})`           | `const { form, fields, intent } = useForm(schema, {...})` |
| `<Form {...getFormProps(form)}>`                  | `<Form {...form.props}>`                                  |
| `getInputProps(fields.x, { type })`               | `{...fields.x.inputProps}` + `type="email"` etc.          |
| `getTextareaProps(fields.x)`                      | `{...fields.x.textareaProps}`                             |
| `getSelectProps(fields.x)`                        | `{...fields.x.selectProps}` (native select only)          |
| `onValidate: ({ formData }) => parseWithZod(...)` | Not needed (automatic with schema-first)                  |
| `lastResult: actionData?.lastResult`              | `lastResult: actionData?.result`                          |
| `fields.x.dirty`                                  | `fields.x.touched`                                        |
| `form.insert.getButtonProps(...)`                 | `intent.insert({ name, ... })`                            |
| `form.remove.getButtonProps(...)`                 | `intent.remove({ name, index })`                          |
| `form.update.getButtonProps(...)`                 | `intent.update({ name, value })`                          |
| `form.reset()` / `form.reset.getButtonProps()`    | `intent.reset()`                                          |

## shadcn/ui Wrapper Components (`app/components/conform/`)

shadcn/ui components like Select, Checkbox, Switch, and RadioGroup are not native inputs,
so we provide wrapper components that connect them via the `useControl` hook with a hidden input.

### Available Components

| Component    | Import                 | Props Spreader             |
| ------------ | ---------------------- | -------------------------- |
| `Select`     | `~/components/conform` | `fields.x.selectProps`     |
| `Checkbox`   | `~/components/conform` | `fields.x.checkboxProps`   |
| `Switch`     | `~/components/conform` | `fields.x.switchProps`     |
| `RadioGroup` | `~/components/conform` | `fields.x.radioGroupProps` |
| `DatePicker` | `~/components/conform` | `fields.x.datePickerProps` |
| `Field`      | `~/components/conform` | -- (layout only)           |
| `FieldError` | `~/components/conform` | -- (error display)         |

### Design Principle: Children Pattern

Wrappers accept `children` instead of an `items` array.
This allows flexible rendering such as SelectItems with icons or custom RadioGroupItem layouts.

```tsx
import { Select } from '~/components/conform'
import { SelectItem } from '~/components/ui/select'
;<Select {...fields.status.selectProps} placeholder="Select status">
  <SelectItem value="todo">Todo</SelectItem>
  <SelectItem value="in-progress">In Progress</SelectItem>
  <SelectItem value="done">Done</SelectItem>
</Select>
```

```tsx
import { RadioGroup } from '~/components/conform'
import { RadioGroupItem } from '~/components/ui/radio-group'
;<RadioGroup {...fields.priority.radioGroupProps}>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="low" id="low" />
    <Label htmlFor="low">Low</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="high" id="high" />
    <Label htmlFor="high">High</Label>
  </div>
</RadioGroup>
```

### Props Type Design

Each wrapper extends the underlying shadcn/ui component's props using `Omit<ComponentProps<...>, ...>`, so all native props (`className`, `disabled`, `data-*`, ARIA attributes, etc.) pass through automatically. Only props managed by `useControl` are omitted. The `aria-invalid` and `required` props from `configureForms` are automatically forwarded through the spreader.

```ts
// Example: Select extends SelectTrigger props
export type SelectProps = Omit<
  React.ComponentProps<typeof SelectTrigger>,
  'ref' | 'children'
> & {
  name: string
  defaultValue?: string
  placeholder?: string
  disabled?: boolean // -> forwarded to Select Root
  required?: boolean // -> forwarded to Select Root
  children: React.ReactNode
}
```

### useControl Pattern Details

Each wrapper is built on the following common pattern:

1. **Hidden input** manages Conform's form data (`control.register`)
2. **ref** delegates focus to the shadcn/ui component (`onFocus`)
3. **Value/checked sync**: shadcn/ui -> `control.change()` -> hidden input

```tsx
// Select implementation example
import { useControl } from '@conform-to/react/future'

function Select({ name, defaultValue, placeholder, children, ...props }) {
  const selectRef = useRef(null)
  const control = useControl({
    defaultValue,
    onFocus() {
      selectRef.current?.focus()
    },
  })

  return (
    <>
      <input name={name} ref={control.register} hidden />
      <ShadcnSelect
        value={control.value}
        onValueChange={(v) => control.change(v)}
        onOpenChange={(open) => {
          if (!open) control.blur()
        }}
      >
        <SelectTrigger {...props} ref={selectRef}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </ShadcnSelect>
    </>
  )
}
```

### `useControl` Usage by Component

| Component  | Hidden input                       | Reading control   | Writing control                      |
| ---------- | ---------------------------------- | ----------------- | ------------------------------------ |
| Select     | `<input hidden />`                 | `control.value`   | `control.change(value)`              |
| Checkbox   | `<input type="checkbox" hidden />` | `control.checked` | `control.change(checked)`            |
| Switch     | `<input type="checkbox" hidden />` | `control.checked` | `control.change(checked)`            |
| RadioGroup | `<input hidden />`                 | `control.value`   | `control.change(value)`              |
| DatePicker | `<input hidden />`                 | `control.value`   | `control.change(date.toISOString())` |

### Checkbox Array Pattern

To submit array values with multiple checkboxes, set the same `name` and different `value` on each Checkbox:

```tsx
const itemList = fields.items.getFieldList()

{
  displayItems.map((item) => {
    const isChecked = itemList.some((i) => i.defaultValue === item.id)
    return (
      <div key={item.id} className="flex items-center space-x-2">
        <Checkbox
          name={fields.items.name}
          value={item.id}
          defaultChecked={isChecked}
        />
        <Label>{item.label}</Label>
      </div>
    )
  })
}
```

### Native `<select>`

When using a native `<select>` instead of shadcn/ui Select, no wrapper is needed.
Spread props manually:

```tsx
<select
  id={fields.font.id}
  name={fields.font.name}
  defaultValue={fields.font.defaultValue}
  aria-describedby={fields.font.ariaDescribedBy}
>
  <option value="inter">Inter</option>
  <option value="mono">Monospace</option>
</select>
```

### Combobox (Inline useControl)

Comboboxes vary significantly in data, search, and display logic across applications,
so instead of a generic wrapper, use `useControl` inline within the form.

```tsx
function LanguageCombobox({
  id,
  name,
  defaultValue,
  'aria-describedby': ariaDescribedBy,
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
          if (!open) control.blur()
        }}
      >
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            variant="outline"
            role="combobox"
            id={id}
            aria-describedby={ariaDescribedBy}
          >
            {control.value
              ? languages.find((l) => l.value === control.value)?.label
              : 'Select...'}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              {languages.map((lang) => (
                <CommandItem
                  key={lang.value}
                  value={lang.value}
                  onSelect={(value) => control.change(value)}
                >
                  {lang.label}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  )
}

// Usage in a form
;<LanguageCombobox {...fields.language.comboBoxProps} />
```

### DatePicker Props

The DatePicker wraps multiple components (Button, Calendar, Popover), so it uses explicit props rather than extending a single component type:

- `required: boolean` - from schema constraints via `datePickerProps`
- `aria-invalid: boolean` - from Conform's validation state via `datePickerProps`
- `disabled: boolean` - disables the trigger button
- `calendarDisabled: (date: Date) => boolean` - disables specific calendar dates
- `calendarProps: Omit<ComponentProps<typeof Calendar>, 'mode' | 'selected' | 'onSelect' | 'disabled'>` - pass-through for Calendar options like `fromYear`, `toYear`, `numberOfMonths`

```tsx
<DatePicker
  {...fields.dob.datePickerProps}
  calendarDisabled={(date) =>
    date > new Date() || date < new Date('1900-01-01')
  }
/>
```

### Field / FieldError Components

Simple layout components:

```tsx
import { Field, FieldError } from '~/components/conform'
;<Field>
  <Label htmlFor={fields.email.id}>Email</Label>
  <Input {...fields.email.inputProps} type="email" />
  <FieldError id={fields.email.errorId}>{fields.email.errors}</FieldError>
</Field>
```

## Dynamic List Fields

```tsx
const { form, fields, intent } = useForm(schema, { ... })
const urls = fields.urls.getFieldList()

{urls.map((url, index) => {
  const urlFields = url.getFieldset()
  return (
    <div key={url.key}>
      <Input {...urlFields.value.inputProps} />
      <Button type="button" onClick={() => intent.remove({ name: fields.urls.name, index })}>
        Delete
      </Button>
    </div>
  )
})}

<Button type="button" onClick={() => intent.insert({ name: fields.urls.name })}>
  Add
</Button>
```

### Intent Methods

| Method                               | Purpose                         |
| ------------------------------------ | ------------------------------- |
| `intent.validate()`                  | Validate the entire form        |
| `intent.validate('fieldName')`       | Validate a specific field       |
| `intent.reset()`                     | Reset to default values         |
| `intent.update({ name, value })`     | Update a field value            |
| `intent.insert({ name })`            | Add an element to an array      |
| `intent.remove({ name, index })`     | Remove an element from an array |
| `intent.reorder({ name, from, to })` | Reorder array elements          |

### Resetting in Dialogs

To reset a form when closing a dialog, use `intent.reset()`:

```tsx
const { form, fields, intent } = useForm(schema, { ... })

<Dialog onOpenChange={(open) => {
  if (!open) {
    intent.reset()
    // Handle dialog close
  }
}}>
```

## Other Useful APIs

### `useFormData` - Reactive Form Data Subscription

```ts
import { isDirty, useFormData } from '@conform-to/react/future'

const dirty = useFormData(form.id, (formData) =>
  isDirty(formData, { defaultValue: form.defaultValue }),
)

<Button disabled={!dirty}>Save</Button>
```

### `memoize` - Async Validation Cache

```ts
import { memoize } from '@conform-to/react/future'

const checkUsername = useMemo(
  () =>
    memoize(async (username: string) => {
      const res = await fetch(`/api/check?name=${username}`)
      return res.ok ? null : ['Already taken']
    }),
  [],
)

const { form, fields } = useForm(schema, {
  async onValidate({ payload, error }) {
    if (typeof payload.username === 'string' && !error.fieldErrors.username) {
      const messages = await checkUsername(payload.username)
      if (messages) error.fieldErrors.username = messages
    }
    return error
  },
})
```

### `FormProvider` + `useField` - Field Access in Child Components

```tsx
// Parent
;<FormProvider context={form.context}>
  <MyFieldComponent name={fields.email.name} />
</FormProvider>

// Child
function MyFieldComponent({ name }) {
  const field = useField(name)
  return <Input {...field.inputProps} />
}
```

## Migration Gotchas

### Common Pitfalls

1. **`dirty` -> `touched`**: The future API does not have `fields.x.dirty`. Use `fields.x.touched` instead.

2. **`form.reset()` -> `intent.reset()`**: The `form` object does not have a `reset()` method. Use `intent.reset()` for resets.

3. **`coerceFormValue` + `discriminatedUnion`**: The return type of `coerceFormValue()` is `ZodPipe`, so it cannot be used as a member of `z.discriminatedUnion()`. Rewrite the inner object schemas in the combined schema and wrap the whole thing.

4. **Hidden input `type`**: Checkbox/Switch require `<input type="checkbox" hidden />`, while others use `<input hidden />`. Using the wrong type causes submission values to be processed incorrectly.

5. **`blur()` on `onOpenChange`**: Failing to call `control.blur()` when closing a Select or Popover prevents validation from firing.

6. **File input**: File inputs are native elements, so `inputProps` spread + `type="file"` works. No wrapper needed.

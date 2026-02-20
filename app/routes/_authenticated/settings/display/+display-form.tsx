import { Form, useActionData, useNavigation } from 'react-router'
import { Checkbox as ConformCheckbox } from '~/components/conform'
import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { useForm } from '~/lib/forms'
import { displayFormSchema } from './+schema'
import type { action } from './index'

const items = [
  {
    id: 'recents',
    label: 'Recents',
  },
  {
    id: 'home',
    label: 'Home',
  },
  {
    id: 'applications',
    label: 'Applications',
  },
  {
    id: 'desktop',
    label: 'Desktop',
  },
  {
    id: 'downloads',
    label: 'Downloads',
  },
  {
    id: 'documents',
    label: 'Documents',
  },
] as const

// This can come from your database or API.
const defaultValue = {
  items: ['recents', 'home'],
}

export function DisplayForm() {
  const actionData = useActionData<typeof action>()
  const { form, fields } = useForm(displayFormSchema, {
    lastResult: actionData?.result,
    defaultValue,
  })
  const itemList = fields.items.getFieldList()
  const navigation = useNavigation()

  return (
    <Form method="POST" {...form.props} className="space-y-8">
      <div className="space-y-2">
        <div className="mb-4">
          <Label className="text-base">Sidebar</Label>
          <div className="text-muted-foreground text-[0.8rem]">
            Select the items you want to display in the sidebar.
          </div>
        </div>

        {items.map((item) => {
          const isChecked = itemList.some((i) => i.defaultValue === item.id)
          return (
            <div
              className="flex flex-row items-start space-y-0 space-x-3"
              key={item.id}
            >
              <ConformCheckbox
                id={item.id}
                name={fields.items.name}
                value={item.id}
                defaultChecked={isChecked}
              />
              <Label htmlFor={item.id} className="font-normal">
                {item.label}
              </Label>
            </div>
          )
        })}
        <div className="text-destructive text-[0.8rem] font-medium empty:hidden">
          {fields.items.errors}
        </div>
      </div>

      <Button type="submit" disabled={navigation.state === 'submitting'}>
        Update display
      </Button>
    </Form>
  )
}

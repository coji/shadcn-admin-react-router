import { useControl } from '@conform-to/react/future'
import { useRef } from 'react'
import { Checkbox as ShadcnCheckbox } from '~/components/ui/checkbox'

export type CheckboxProps = Omit<
  React.ComponentProps<typeof ShadcnCheckbox>,
  'ref' | 'checked' | 'onCheckedChange' | 'onBlur' | 'defaultChecked'
> & {
  name: string
  value?: string
  defaultChecked?: boolean
}

export function Checkbox({
  name,
  value,
  defaultChecked,
  ...props
}: CheckboxProps) {
  const checkboxRef = useRef<React.ComponentRef<typeof ShadcnCheckbox>>(null)
  const control = useControl({
    defaultChecked,
    value,
    onFocus() {
      checkboxRef.current?.focus()
    },
  })

  return (
    <>
      <input type="checkbox" ref={control.register} name={name} hidden />
      <ShadcnCheckbox
        {...props}
        ref={checkboxRef}
        checked={control.checked}
        onCheckedChange={(checked) => control.change(checked)}
        onBlur={() => control.blur()}
      />
    </>
  )
}

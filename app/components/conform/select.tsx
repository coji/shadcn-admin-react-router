import { useControl } from '@conform-to/react/future'
import { useRef } from 'react'
import {
  SelectContent,
  SelectTrigger,
  SelectValue,
  Select as ShadcnSelect,
} from '~/components/ui/select'

export type SelectProps = Omit<
  React.ComponentProps<typeof SelectTrigger>,
  'ref' | 'children'
> & {
  name: string
  defaultValue?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  children: React.ReactNode
}

export function Select({
  name,
  defaultValue,
  placeholder,
  disabled,
  required,
  children,
  ...props
}: SelectProps) {
  const selectRef = useRef<React.ComponentRef<typeof SelectTrigger>>(null)
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
        onValueChange={(value) => control.change(value)}
        onOpenChange={(open) => {
          if (!open) {
            control.blur()
          }
        }}
        disabled={disabled}
        required={required}
      >
        <SelectTrigger {...props} ref={selectRef}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </ShadcnSelect>
    </>
  )
}

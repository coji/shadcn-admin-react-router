import { useControl } from '@conform-to/react/future'
import { useRef } from 'react'
import { RadioGroup as ShadcnRadioGroup } from '~/components/ui/radio-group'

export type RadioGroupProps = Omit<
  React.ComponentProps<typeof ShadcnRadioGroup>,
  'ref' | 'value' | 'onValueChange' | 'onBlur' | 'defaultValue'
> & {
  name: string
  defaultValue?: string
  children: React.ReactNode
}

export function RadioGroup({
  name,
  defaultValue,
  children,
  ...props
}: RadioGroupProps) {
  const radioGroupRef =
    useRef<React.ComponentRef<typeof ShadcnRadioGroup>>(null)
  const control = useControl({
    defaultValue,
    onFocus() {
      radioGroupRef.current?.focus()
    },
  })

  return (
    <>
      <input ref={control.register} name={name} hidden />
      <ShadcnRadioGroup
        {...props}
        ref={radioGroupRef}
        value={control.value ?? ''}
        onValueChange={(value) => control.change(value)}
        onBlur={() => control.blur()}
      >
        {children}
      </ShadcnRadioGroup>
    </>
  )
}

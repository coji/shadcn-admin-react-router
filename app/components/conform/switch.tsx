import { useControl } from '@conform-to/react/future'
import { useRef } from 'react'
import { Switch as ShadcnSwitch } from '~/components/ui/switch'

export type SwitchProps = Omit<
  React.ComponentProps<typeof ShadcnSwitch>,
  'ref' | 'checked' | 'onCheckedChange' | 'onBlur' | 'defaultChecked'
> & {
  name: string
  value?: string
  defaultChecked?: boolean
}

export function Switch({ name, value, defaultChecked, ...props }: SwitchProps) {
  const switchRef = useRef<React.ComponentRef<typeof ShadcnSwitch>>(null)
  const control = useControl({
    defaultChecked,
    value,
    onFocus() {
      switchRef.current?.focus()
    },
  })

  return (
    <>
      <input type="checkbox" name={name} ref={control.register} hidden />
      <ShadcnSwitch
        {...props}
        ref={switchRef}
        checked={control.checked}
        onCheckedChange={(checked) => control.change(checked)}
        onBlur={() => control.blur()}
      />
    </>
  )
}

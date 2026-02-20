import { useControl } from '@conform-to/react/future'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useRef } from 'react'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { cn } from '~/lib/utils'

export type DatePickerProps = {
  id?: string
  name: string
  defaultValue?: string
  required?: boolean
  'aria-describedby'?: string
  'aria-invalid'?: boolean
  className?: string
  placeholder?: string
  dateFormat?: string
  disabled?: boolean
  calendarDisabled?: (date: Date) => boolean
  calendarProps?: Omit<
    React.ComponentProps<typeof Calendar>,
    'mode' | 'selected' | 'onSelect' | 'disabled'
  >
}

export function DatePicker({
  name,
  defaultValue,
  className,
  placeholder = 'Pick a date',
  dateFormat = 'MMM d, yyyy',
  disabled,
  calendarDisabled,
  calendarProps,
  ...props
}: DatePickerProps) {
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
            {...props}
            ref={triggerRef}
            variant="outline"
            disabled={disabled}
            className={cn(
              'w-60 pl-3 text-left font-normal',
              !control.value && 'text-muted-foreground',
              className,
            )}
          >
            {control.value ? (
              format(control.value, dateFormat)
            ) : (
              <span>{placeholder}</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            {...calendarProps}
            mode="single"
            selected={control.value ? new Date(control.value) : undefined}
            onSelect={(date) =>
              control.change(date ? format(date, 'yyyy-MM-dd') : '')
            }
            disabled={calendarDisabled}
          />
        </PopoverContent>
      </Popover>
    </>
  )
}

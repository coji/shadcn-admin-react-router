import { cn } from '~/lib/utils'

function PageHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'mb-4 flex flex-wrap items-center justify-between gap-4',
        className,
      )}
      {...props}
    />
  )
}

function PageHeaderHeading({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return <div className={cn('space-y-1', className)} {...props} />
}

function PageHeaderTitle({ className, ...props }: React.ComponentProps<'h1'>) {
  return (
    <h1
      className={cn('text-2xl font-bold tracking-tight', className)}
      {...props}
    />
  )
}

function PageHeaderDescription({
  className,
  ...props
}: React.ComponentProps<'p'>) {
  return <p className={cn('text-muted-foreground', className)} {...props} />
}

function PageHeaderActions({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return <div className={cn('flex gap-2', className)} {...props} />
}

export {
  PageHeader,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderTitle,
}

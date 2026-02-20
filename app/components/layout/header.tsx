import React from 'react'
import { Separator } from '~/components/ui/separator'
import { SidebarTrigger } from '~/components/ui/sidebar'
import { cn } from '~/lib/utils'

interface HeaderProps extends React.ComponentPropsWithRef<'header'> {
  fixed?: boolean
}

export const Header = ({
  className,
  fixed,
  children,
  ...props
}: HeaderProps) => {
  const [offset, setOffset] = React.useState(0)

  React.useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }

    document.addEventListener('scroll', onScroll, { passive: true })

    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'z-50 h-16 shrink-0',
        fixed && 'header-fixed peer/header sticky top-0 w-[inherit]',
        offset > 10 && fixed ? 'shadow-sm' : 'shadow-none',
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'relative flex h-full items-center gap-3 p-4 sm:gap-4',
          offset > 10 &&
            fixed &&
            'bg-background/80 after:absolute after:inset-0 after:-z-10 after:backdrop-blur-lg',
        )}
      >
        <SidebarTrigger
          variant="outline"
          className="scale-125 sm:scale-100"
        />
        <Separator orientation="vertical" className="h-6" />
        {children}
      </div>
    </header>
  )
}

Header.displayName = 'Header'

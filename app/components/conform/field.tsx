export function Field({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1">{children}</div>
}

export function FieldError({
  id,
  children,
}: {
  id?: string
  children: React.ReactNode
}) {
  return (
    <div
      id={id}
      className="text-destructive text-[0.8rem] font-medium empty:hidden"
    >
      {children}
    </div>
  )
}

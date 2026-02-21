import { IconLoader, IconTrash, IconZoomReset } from '@tabler/icons-react'
import type { Table } from '@tanstack/react-table'
import { useEffect } from 'react'
import { href, useFetcher } from 'react-router'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import type { User } from '../../+data/schema'
import type { action as bulkDeleteAction } from '../../bulk-delete'

interface DataTableFloatingBarProps {
  table: Table<User>
}

export function DataTableFloatingBar({ table }: DataTableFloatingBarProps) {
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedCount = selectedRows.length

  const deleteFetcher = useFetcher<typeof bulkDeleteAction>({
    key: 'users-bulk-delete',
  })

  const isDeleting = deleteFetcher.state !== 'idle'

  useEffect(() => {
    if (deleteFetcher.data?.done) {
      table.resetRowSelection()
    }
  }, [deleteFetcher.data, table])

  if (selectedCount === 0) return null

  const selectedIds = selectedRows.map((row) => row.original.id)

  const handleBulkDelete = () => {
    const formData = new FormData()
    for (const id of selectedIds) formData.append('ids', id)
    deleteFetcher.submit(formData, {
      action: href('/users/bulk-delete'),
      method: 'POST',
    })
  }

  return (
    <div className="fixed inset-x-0 bottom-6 z-50 mx-4 flex justify-center sm:mx-auto sm:max-w-sm">
      <div className="bg-background flex w-full items-center gap-1 rounded-lg border px-3 py-2 shadow-lg">
        <span className="text-muted-foreground min-w-0 flex-1 text-sm font-medium whitespace-nowrap">
          {selectedCount} selected
        </span>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:flex"
            onClick={() => table.resetRowSelection()}
            disabled={isDeleting}
          >
            <IconZoomReset size={16} />
            Deselect
          </Button>

          <Separator
            orientation="vertical"
            className="mx-1 hidden h-5 sm:block"
          />

          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <IconLoader size={16} className="animate-spin" />
            ) : (
              <IconTrash size={16} />
            )}
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}

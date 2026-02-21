import {
  IconLoader,
  IconTag,
  IconTrash,
  IconZoomReset,
} from '@tabler/icons-react'
import type { Table } from '@tanstack/react-table'
import { useEffect } from 'react'
import { href, useFetcher } from 'react-router'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Separator } from '~/components/ui/separator'
import { FILTER_FIELD_LABELS } from '../+config'
import { labels } from '../../+shared/data/data'
import type { Task } from '../../+shared/data/schema'
import type { action as bulkDeleteAction } from '../../bulk-delete'
import type { action as bulkUpdateAction } from '../../bulk-update'

interface DataTableFloatingBarProps {
  table: Table<Task>
}

export function DataTableFloatingBar({ table }: DataTableFloatingBarProps) {
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedCount = selectedRows.length

  const deleteFetcher = useFetcher<typeof bulkDeleteAction>({
    key: 'tasks-bulk-delete',
  })
  const updateFetcher = useFetcher<typeof bulkUpdateAction>({
    key: 'tasks-bulk-update',
  })

  const isDeleting = deleteFetcher.state !== 'idle'
  const isUpdating = updateFetcher.state !== 'idle'
  const isPending = isDeleting || isUpdating

  useEffect(() => {
    if (deleteFetcher.data?.done) {
      table.resetRowSelection()
    }
  }, [deleteFetcher.data, table])

  useEffect(() => {
    if (updateFetcher.data?.done) {
      table.resetRowSelection()
    }
  }, [updateFetcher.data, table])

  if (selectedCount === 0) return null

  const selectedIds = selectedRows.map((row) => row.original.id)

  const handleBulkDelete = () => {
    const formData = new FormData()
    for (const id of selectedIds) formData.append('ids', id)
    deleteFetcher.submit(formData, {
      action: href('/tasks/bulk-delete'),
      method: 'POST',
    })
  }

  const handleBulkUpdate = (
    field: 'label' | 'status' | 'priority',
    value: string,
  ) => {
    const formData = new FormData()
    for (const id of selectedIds) formData.append('ids', id)
    formData.append('field', field)
    formData.append('value', value)
    updateFetcher.submit(formData, {
      action: href('/tasks/bulk-update'),
      method: 'POST',
    })
  }

  return (
    <div className="fixed inset-x-0 bottom-6 z-50 mx-4 flex justify-center sm:mx-auto sm:max-w-xl">
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
            disabled={isPending}
          >
            <IconZoomReset size={16} />
            Deselect
          </Button>

          <Separator
            orientation="vertical"
            className="mx-1 hidden h-5 sm:block"
          />

          {/* Label */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" disabled={isPending}>
                {isUpdating ? (
                  <IconLoader size={16} className="animate-spin" />
                ) : (
                  <IconTag size={16} />
                )}
                Label
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {labels.map((label) => (
                <DropdownMenuItem
                  key={label.value}
                  onSelect={() => handleBulkUpdate('label', label.value)}
                >
                  {label.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status & Priority */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" disabled={isPending}>
                {isUpdating ? (
                  <IconLoader size={16} className="animate-spin" />
                ) : null}
                <span className="hidden sm:inline">Status / </span>Priority
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {FILTER_FIELD_LABELS.status.map((s) => (
                    <DropdownMenuItem
                      key={s.value}
                      onSelect={() => handleBulkUpdate('status', s.value)}
                    >
                      {s.icon && <s.icon size={14} className="mr-2" />}
                      {s.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Priority</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {FILTER_FIELD_LABELS.priority.map((p) => (
                    <DropdownMenuItem
                      key={p.value}
                      onSelect={() => handleBulkUpdate('priority', p.value)}
                    >
                      {p.icon && <p.icon size={14} className="mr-2" />}
                      {p.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Delete */}
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            disabled={isPending}
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

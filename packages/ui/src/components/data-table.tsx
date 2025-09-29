import React from "react"
import { cn } from "../lib/utils"
import { Button } from "./button"
import { Badge } from "./badge"

export interface Column<T> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
  width?: string
  align?: "left" | "center" | "right"
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  emptyMessage?: string
  onSort?: (key: keyof T, direction: "asc" | "desc") => void
  sortKey?: keyof T
  sortDirection?: "asc" | "desc"
  className?: string
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  emptyMessage = "No data available",
  onSort,
  sortKey,
  sortDirection,
  className,
}: DataTableProps<T>) {
  const handleSort = (key: keyof T) => {
    if (!onSort) return
    
    const direction = sortKey === key && sortDirection === "asc" ? "desc" : "asc"
    onSort(key, direction)
  }

  if (loading) {
    return (
      <div className={cn("rounded-brand-md border border-neutral-200 bg-white", className)}>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex space-x-4">
                <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
                <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
                <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
                <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className={cn("rounded-brand-md border border-neutral-200 bg-white p-8 text-center", className)}>
        <div className="text-neutral-500 text-sm">{emptyMessage}</div>
      </div>
    )
  }

  return (
    <div className={cn("rounded-brand-md border border-neutral-200 bg-white overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider",
                    column.sortable && "cursor-pointer hover:bg-neutral-100",
                    column.align === "center" && "text-center",
                    column.align === "right" && "text-right"
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <svg
                          className={cn(
                            "h-3 w-3",
                            sortKey === column.key && sortDirection === "asc" && "text-primary-600"
                          )}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                        <svg
                          className={cn(
                            "h-3 w-3 -mt-1",
                            sortKey === column.key && sortDirection === "desc" && "text-primary-600"
                          )}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-neutral-50 transition-colors">
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={cn(
                      "px-4 py-4 text-sm text-neutral-900",
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right"
                    )}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : String(row[column.key] || "-")
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Helper function to render status badges
export function renderStatusBadge(status: string) {
  const statusConfig = {
    active: { variant: "success" as const, label: "Active" },
    inactive: { variant: "secondary" as const, label: "Inactive" },
    pending: { variant: "warning" as const, label: "Pending" },
    error: { variant: "error" as const, label: "Error" },
    completed: { variant: "success" as const, label: "Completed" },
    cancelled: { variant: "secondary" as const, label: "Cancelled" },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || {
    variant: "secondary" as const,
    label: status,
  }

  return <Badge variant={config.variant}>{config.label}</Badge>
}

// Helper function to render numbers with formatting
export function renderNumber(value: number, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat("en-US", options).format(value)
}

// Helper function to render dates
export function renderDate(date: string | Date, options?: Intl.DateTimeFormatOptions) {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("en-US", options).format(dateObj)
}

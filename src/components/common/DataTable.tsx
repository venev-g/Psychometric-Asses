'use client'

import React, { useState } from 'react'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Pagination } from '@/components/common/Pagination'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface Column {
  key: string
  header: string
  sortable?: boolean
  render?: (value: any, row: any) => React.ReactNode
}

interface DataTableProps {
  data: any[]
  columns: Column[]
  loading?: boolean
  emptyMessage?: string
  pagination?: {
    page: number
    totalPages: number
    onPageChange: (page: number) => void
  }
  sortable?: boolean
}

export function DataTable({
  data,
  columns,
  loading = false,
  emptyMessage = 'No data available',
  pagination,
  sortable = true
}: DataTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const handleSort = (columnKey: string) => {
    if (!sortable) return

    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(columnKey)
      setSortDirection('asc')
    }
  }

  const sortedData = React.useMemo(() => {
    if (!sortColumn || !sortable) return data

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn]
      const bValue = b[sortColumn]

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sortColumn, sortDirection, sortable])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="medium" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`text-left p-4 font-medium text-gray-900 ${
                    sortable && column.sortable !== false ? 'cursor-pointer hover:bg-gray-50' : ''
                  }`}
                  onClick={() => sortable && column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {sortable && column.sortable !== false && sortColumn === column.key && (
                      sortDirection === 'asc' ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center p-8 text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((row, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={column.key} className="p-4">
                      {column.render 
                        ? column.render(row[column.key], row)
                        : row[column.key]
                      }
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
        />
      )}
    </div>
  )
}
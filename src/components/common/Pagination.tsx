'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showFirstLast?: boolean
  maxVisiblePages?: number
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  maxVisiblePages = 7
}: PaginationProps) {
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const half = Math.floor(maxVisiblePages / 2)
    let start = Math.max(currentPage - half, 1)
    let end = Math.min(start + maxVisiblePages - 1, totalPages)

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(end - maxVisiblePages + 1, 1)
    }

    const pages = []
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  }

  const visiblePages = getVisiblePages()
  const showStartEllipsis = visiblePages[0] > 1
  const showEndEllipsis = visiblePages[visiblePages.length - 1] < totalPages

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center space-x-1">
      {/* First page */}
      {showFirstLast && currentPage > 1 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
        >
          First
        </Button>
      )}

      {/* Previous page */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {/* Start ellipsis */}
      {showStartEllipsis && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
          >
            1
          </Button>
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </>
      )}

      {/* Visible page numbers */}
      {visiblePages.map(page => (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      {/* End ellipsis */}
      {showEndEllipsis && (
        <>
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}

      {/* Next page */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      {/* Last page */}
      {showFirstLast && currentPage < totalPages && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
        >
          Last
        </Button>
      )}
    </div>
  )
}
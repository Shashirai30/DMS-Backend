"use client"

import type React from "react"

interface CustomPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const renderPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1)
    }

    // Add first page if not visible
    if (startPage > 0) {
      pages.push(
        <button
          key={0}
          onClick={() => onPageChange(0)}
          className="px-3 py-2 mx-1 border rounded bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
        >
          1
        </button>,
      )
      if (startPage > 1) {
        pages.push(
          <span key="start-ellipsis" className="px-2">
            ...
          </span>,
        )
      }
    }

    // Add visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-2 mx-1 border rounded font-medium ${
            i === currentPage
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          {i + 1}
        </button>,
      )
    }

    // Add last page if not visible
    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        pages.push(
          <span key="end-ellipsis" className="px-2">
            ...
          </span>,
        )
      }
      pages.push(
        <button
          key={totalPages - 1}
          onClick={() => onPageChange(totalPages - 1)}
          className="px-3 py-2 mx-1 border rounded bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
        >
          {totalPages}
        </button>,
      )
    }

    return pages
  }

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-4 py-2 border rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-700 border-gray-300 hover:bg-gray-50 disabled:hover:bg-white"
      >
        ← Previous
      </button>

      {/* Page numbers */}
      <div className="flex items-center">{renderPageNumbers()}</div>

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className="px-4 py-2 border rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-700 border-gray-300 hover:bg-gray-50 disabled:hover:bg-white"
      >
        Next →
      </button>
    </div>
  )
}

export default CustomPagination

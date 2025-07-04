"use client"

import { useMemo } from "react"
import Table from "@/components/ui/Table"
import FileSegment from "./FileSegment"
import FileRow from "./FileRow"
import type { Files, Layout } from "../types"
import FileNotFound from "@/assets/svg/FileNotFound"
import { useFileManagerStore } from "../store/useFolderManagerStore"
import { useSessionUser } from "@/store/authStore"
import CustomPagination from "./CustomPagination"

const { TBody, THead, Th, Tr } = Table

type FileListProps = {
  fileList: Files
  layout: Layout
  onDownload: (id: string) => void
  onShare: (id: string) => void
  onDelete: (id: string) => void
  onOpen: (id: string) => void
  onPreview: (id: string) => void
  onClick: (id: string) => void
  onDetails: (id: string) => void
  onRename: (id: string) => void
  onEdit: (id: string) => void
  openedDirectoryId?: string
  triggerGetDoc: (params: any) => void
  triggerGetFile: (params: any) => void
  pageSize: number
  currentPage: number
  totalItems: number
  totalPages: number
  onPaginationChange: (page: number) => void
  onPageSizeChange: (value: number) => void
}

const pageSizeOptions = [
  { value: 10, label: "10 / page" },
  { value: 20, label: "20 / page" },
  { value: 30, label: "30 / page" },
  { value: 50, label: "50 / page" },
]

const FileList = (props: FileListProps) => {
  const {
    layout,
    fileList,
    onDelete,
    onDownload,
    onShare,
    onOpen,
    onClick,
    onPreview,
    onDetails,
    onRename,
    onEdit,
    openedDirectoryId,
    pageSize,
    currentPage,
    totalItems,
    totalPages,
    onPaginationChange,
    onPageSizeChange,
  } = props

  const user = useSessionUser((state) => state.user)
  const isAdmin = user.roles.includes("ADMIN")

  const folders = useFileManagerStore((state) =>
    state.fileList
      .filter((file) => file.fileType === "directory")
      .map((folder) => ({
        ...folder,
        code: folder.code || "N/A",
      })),
  )

  const files = useMemo(() => {
    return fileList.filter((file) => file.fileType !== "directory")
  }, [fileList])

  const renderFileSegment = (list: Files, isFolder?: boolean) => (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mt-4 gap-4 lg:gap-6">
      {list.map((file) => (
        <FileSegment
          key={file.id}
          id={file.id}
          documentNumber={isFolder ? file.code : file.documentNumber}
          fileType={file.fileType}
          size={file.size}
          category={file.fileCategory}
          name={file.name}
          onClick={() => onClick(file.id)}
          onDownload={file.fileType !== "directory" ? () => onDownload(file.id) : undefined}
          onShare={() => onShare(file.id)}
          onDetails={() => onDetails(file.id)}
          onDelete={isAdmin ? () => onDelete(file.id) : undefined}
          {...(openedDirectoryId ? { onPreview: () => onPreview(file.id) } : {})}
          onRename={isAdmin && file.fileType !== "directory" ? () => onRename(file.id) : undefined}
          {...(file.fileType === "directory" && isAdmin
            ? {
                onOpen: () => onOpen(file.id),
                onEdit: () => onEdit(file.id),
              }
            : {})}
        />
      ))}
    </div>
  )

  const renderFileRow = (list: Files, isFolder?: boolean) => (
    <Table className="mt-4">
      <THead>
        <Tr>
          <Th>{isFolder ? "Directory Code" : "Document Id"}</Th>
          <Th>File</Th>
          <Th>Size</Th>
          <Th>Type</Th>
          {!isFolder && <Th>Category</Th>}
          <Th></Th>
        </Tr>
      </THead>
      <TBody>
        {list.map((file) => (
          <FileRow
            key={file.id}
            id={file.id}
            fileType={file.fileType}
            size={file.size}
            name={file.name}
            documentNumber={isFolder ? file.code : file.documentNumber}
            category={file.fileCategory}
            onClick={() => onClick(file.id)}
            onShare={() => onShare(file.id)}
            onDelete={isAdmin ? () => onDelete(file.id) : undefined}
            onDownload={file.fileType !== "directory" ? () => onDownload(file.id) : undefined}
            {...(openedDirectoryId ? { onPreview: () => onPreview(file.id) } : {})}
            onDetails={() => onDetails(file.id)}
            onRename={isAdmin && file.fileType !== "directory" ? () => onRename(file.id) : undefined}
            {...(file.fileType === "directory" && isAdmin
              ? {
                  onOpen: () => onOpen(file.id),
                  onEdit: () => onEdit(file.id),
                }
              : {})}
          />
        ))}
      </TBody>
    </Table>
  )

  if (folders.length === 0 && files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <>
          <FileNotFound />
          <span className="font-semibold">No data found!</span>
        </>
      </div>
    )
  }

  return (
    <div>
      {folders.length > 0 && (
        <div>
          <h4>Folders</h4>
          {layout === "grid" && renderFileSegment(folders, true)}
          {layout === "list" && renderFileRow(folders, true)}
        </div>
      )}
      {files.length > 0 && (
        <div className="mt-8">
          <h4>Files</h4>
          {layout === "grid" && renderFileSegment(files)}
          {layout === "list" && renderFileRow(files)}
        </div>
      )}

      {/* Always show pagination controls and page size selector */}
      <div className="mt-4 p-4 border-t bg-gray-50 rounded">
        {/* Page size selector - always visible */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Items per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="border rounded px-3 py-1 bg-white"
            >
              <option value={5}>5 / page</option>
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={30}>30 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalItems)} of {totalItems}{" "}
            entries
          </div>
        </div>

        {/* Pagination controls - show when more than 1 page */}
        {totalPages > 1 && (
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={onPaginationChange}
            onPageSizeChange={onPageSizeChange}
          />
        )}
      </div>

      {/* Debug info - remove in production */}
      <div className="mt-2 text-xs text-gray-500">
        Debug: Page {currentPage + 1} of {totalPages} | Total: {totalItems} | Page size: {pageSize}
      </div>
    </div>
  )
}

export default FileList

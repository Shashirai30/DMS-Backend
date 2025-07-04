

"use client"

import { useEffect, useState } from "react"
import Table from "@/components/ui/Table"
import TableRowSkeleton from "@/components/shared/loaders/TableRowSkeleton"
import FileManagerHeader from "./components/FolderManagerHeader"
import FileSegment from "./components/FileSegment"
import FileList from "./components/FolderList"
import FileDetails from "./components/FolderDetails"
import FileManagerDeleteDialog from "./components/FileManagerDeleteDialog"
import FileManagerInviteDialog from "./components/FileManagerInviteDialog"
import { useFileManagerStore } from "./store/useFolderManagerStore"
import { apiDocPreview, apiGetdoc, apiGetFolders } from "@/services/FileService"
import useSWRMutation from "swr/mutation"
import type { GetFilesListResponse, GetFoldersListResponse } from "./types"
import "../../../../assets/styles/app.css"
import FileManagerRenameDialog from "./components/FileMangerRenameDialog"
import FolderEdit from "./components/FolderEdit"
import FolderManagerFilters from "./components/FileMangerFilter"
import DocumentPreview from "./components/PreviewFile"
import { useSessionUser } from "@/store/authStore"

const { THead, Th, Tr } = Table

async function getFile(
  _: string,
  { arg }: { arg: { ids: number[]; page: number; size: number; sortBy?: string; sortDir?: string } },
) {
  try {
    const data = await apiGetFolders<
      GetFoldersListResponse,
      { ids: number[]; page: number; size: number; sortBy?: string; sortDir?: string }
    >({
      ids: arg.ids,
      page: arg.page,
      size: arg.size,
      sortBy: arg.sortBy || "code",
      sortDir: arg.sortDir || "asc",
    })

    if (!data) {
      console.log("No folders")
      return { data: { content: [], page: { totalElements: 0, totalPages: 1 } } }
    }

    console.log("Response from Folder API:", data)
    return data
  } catch (error) {
    console.error("Error fetching folders:", error)
    return { data: { content: [], page: { totalElements: 0, totalPages: 1 } } }
  }
}

async function getdoc(
  _: string,
  {
    arg,
  }: {
    arg: {
      id: string
      page: number
      year?: string
      size: number
      name?: string
      code?: string
      fileType?: string
      fileCategory?: string
    }
  },
) {
  const data = await apiGetdoc<
    GetFilesListResponse,
    {
      id: string
      page: number
      year?: string
      size: number
      name?: string
      code?: string
      fileType?: string
      fileCategory?: string
    }
  >({
    id: arg.id,
    page: arg.page,
    size: arg.size,
    name: arg.name || undefined,
    code: arg.code || undefined,
    fileType: arg.fileType || undefined,
    fileCategory: arg.fileCategory || undefined,
    year: arg.year || undefined,
  })
  return data
}

const FolderManager = () => {
  const {
    layout,
    fileList,
    setFileList,
    setDeleteDialog,
    setInviteDialog,
    setRenameDialog,
    openedDirectoryId,
    setOpenedDirectoryId,
    setDirectories,
    setfolderInfo,
    setSelectedFile,
    setFolderEditDialog,

    // Folder pagination
    folderPage,
    folderPageSize,
    folderTotalItems,
    folderTotalPages,
    setFolderPage,
    setFolderPageSize,
    setFolderTotalItems,
    setFolderTotalPages,

    // File pagination
    filePage,
    filePageSize,
    fileTotalItems,
    fileTotalPages,
    setFilePage,
    setFilePageSize,
    setFileTotalItems,
    setFileTotalPages,

    resetPagination,
    showFilters,
  } = useFileManagerStore()

  const [previewFile, setPreviewFile] = useState<string | null>(null)
  const [FileTypeFilter, setSelectedFileType] = useState<string>("")
  const [fileNameFilter, setFileNameFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [yearFilter, setYearFilter] = useState("")

  const user = useSessionUser((state) => state.user)
  console.log("User accessible files in FolderManager:", user.projectFileIds)

  useEffect(() => {
    // Clear all existing data and reset pagination
    setFileList([])
    setDirectories([])
    setfolderInfo(null)
    setOpenedDirectoryId("")
    resetPagination()

    

    // Reload data if user has accessible files
    if (user?.projectFileIds?.length > 0) {
      triggerGetFile({
        ids: user.projectFileIds,
        page: folderPage,
        size: folderPageSize,
      }).catch(console.error)
    }
  }, [user?.id])


  // Separate effect for folder pagination changes
  useEffect(() => {
    if (!openedDirectoryId && user?.projectFileIds?.length > 0) {
      triggerGetFile({
        ids: user.projectFileIds,
        page: folderPage,
        size: folderPageSize,
      }).catch(console.error)
    }
  }, [folderPage, folderPageSize])

  const { trigger: triggerGetFile, isMutating: isFileMutating } = useSWRMutation(`/project-files`, getFile, {
    onSuccess: (resp) => {
      if (resp && resp.data) {
        console.log("✅ Folder API Success:", {
          content: resp.data.content?.length,
          totalElements: resp.data.page?.totalElements,
          totalPages: resp.data.page?.totalPages,
          currentPage: resp.data.page?.number,
        })

        setDirectories([])

        if (Array.isArray(resp.data.content)) {
          setFileList(resp.data.content)
          setFolderTotalItems(resp.data.page?.totalElements || 0)
          setFolderTotalPages(resp.data.page?.totalPages || 1)
        } else {
          console.error("Unexpected data format:", resp.data)
          setFileList([])
          setFolderTotalItems(0)
          setFolderTotalPages(1)
        }
      } else {
        console.log("No folders found")
        setFileList([])
        setFolderTotalItems(0)
        setFolderTotalPages(1)
      }
    },
  })

  const { trigger: triggerGetDoc, isMutating: isDocMutating } = useSWRMutation(
    `/documents?folderId=${openedDirectoryId}`,
    getdoc,
    {
      onSuccess: (resp) => {
        if (resp && resp.data) {
          console.log("Response from Files API:", resp.data)
          setDirectories([])

          if (Array.isArray(resp.data.content)) {
            setFileList(resp.data.content)
            setFileTotalItems(resp.data.page.totalElements)
            setFileTotalPages(resp.data.page.totalPages)
          } else {
            console.error("Unexpected data format:", resp.data)
            setFileList([])
            setFileTotalItems(0)
            setFileTotalPages(1)
          }
        } else {
          console.log("No files found")
          setFileList([])
          setFileTotalItems(0)
          setFileTotalPages(1)
        }
      },
    },
  )

  const shouldFetchFiles = !openedDirectoryId && fileList.length === 0

  useEffect(() => {
    if (openedDirectoryId) {
      // Fetch documents under a specific directory with filters
      triggerGetDoc({
        id: openedDirectoryId,
        page: filePage,
        size: filePageSize,
        name: fileNameFilter,
        fileType: FileTypeFilter,
        fileCategory: categoryFilter,
        year: yearFilter,
      })
    } else if (shouldFetchFiles && user.projectFileIds && user.projectFileIds.length > 0) {
      // Fetch top-level files using user's accessible file IDs
      triggerGetFile({
        ids: user.projectFileIds,
        page: folderPage,
        size: folderPageSize,
      })
    }
  }, [
    openedDirectoryId,
    filePage,
    filePageSize,
    fileNameFilter,
    yearFilter,
    FileTypeFilter,
    categoryFilter,
    triggerGetDoc,
    triggerGetFile,
    shouldFetchFiles,
    user.projectFileIds,
  ])

  const handleShare = (id: string) => {
    setInviteDialog({ id, open: true })
  }

  const handleFolderEdit = (id: string) => {
    const folder = fileList.find((f) => f.id === id && f.fileType === "directory")
    console.log("Folder to edit:", folder)

    if (folder) {
      setFolderEditDialog({
        id,
        foldername: folder.name,
        description: folder.description || "",
        categories: folder.categories || [],
        open: true,
        directoryCode: folder.code || "",
      })
    }
  }

  const handleDelete = (id: string) => {
    const file = fileList.find((f) => f.id === id)
    if (!file) return
    setDeleteDialog({ id, open: true, fileType: file.fileType })
  }

  const handleRename = (id: string) => {
    const fileToRename = fileList.find((file) => file.id === id)
    if (fileToRename) {
      console.log("Click option Rename file", id, fileToRename.name)
      setRenameDialog({
        id,
        filename: fileToRename.name,
        open: true,
      })
    }
  }

  const handleDetails = (itemId: string) => {
    setSelectedFile(itemId)
  }

  const handleDownload = async (fileId: string) => {
    try {
      const file = fileList.find((f) => f.id === fileId)
      if (!file) {
        console.error("File not found")
        return
      }
      const response = await apiDocPreview<BlobPart, { id: string }>({
        id: fileId,
      })

      const blob = new Blob([response], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      console.log("URL:", url)

      const link = document.createElement("a")
      link.href = window.URL.createObjectURL(blob)
      link.download = file.name || "document"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(link.href)
    } catch (error) {
      console.error("Error fetching file preview:", error)
    }
  }

  const handlePreview = async (fileId: string) => {
    try {
      const file = fileList.find((f) => f.id === fileId)
      if (!file) {
        console.error("File not found")
        return
      }
      const response = await apiDocPreview<BlobPart, { id: string }>({
        id: fileId,
      })

      const blob = new Blob([response], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      console.log("URL:", url)
      const updatedFile = { ...file, srcUrl: url }
      setPreviewFile(updatedFile.srcUrl)
    } catch (error) {
      console.error("Error fetching file preview:", error)
    }
  }

  const handleClick = (itemId: string) => {
    const clickedItem = fileList.find((item) => item.id === itemId)
    if (clickedItem) {
      if (clickedItem.categories) {
        setfolderInfo({
          categories: clickedItem.categories,
          name: clickedItem.name,
        })
      } else {
        setfolderInfo(null)
      }
      if (clickedItem.fileType === "directory") {
        setOpenedDirectoryId(itemId)
        setFilePage(0) // Reset file pagination when entering directory
        triggerGetDoc({
          id: itemId,
          page: 0,
          size: filePageSize,
          name: fileNameFilter,
          fileType: FileTypeFilter,
          fileCategory: categoryFilter,
          year: yearFilter,
        })
      } else {
        handlePreview(itemId)
      }
    }
  }

  const handleClosePreview = () => {
    setPreviewFile(null)
  }

  const handleOpen = (id: string) => {
    const clickedItem = fileList.find((item) => item.id === id)

    if (clickedItem) {
      if (clickedItem.categories) {
        setfolderInfo({
          categories: clickedItem.categories,
          name: clickedItem.name,
        })
      } else {
        setfolderInfo(null)
      }
    }
    setOpenedDirectoryId(id)
    setFilePage(0) // Reset file pagination
    triggerGetDoc({
      id: id,
      page: 0,
      size: filePageSize,
    })
  }

  const handleEntryClick = () => {
    setOpenedDirectoryId("")
    setFolderPage(0) // Reset folder pagination
    // Pass user's accessible file IDs when going back to root
    if (user.projectFileIds && user.projectFileIds.length > 0) {
      triggerGetFile({
        ids: user.projectFileIds,
        page: 0,
        size: folderPageSize,
      })
    }
  }

  const handleDirectoryClick = (id: string) => {
    console.log(`Directory clicked: ${id}`)
    setOpenedDirectoryId(id)
    setFilePage(0) // Reset file pagination
    triggerGetDoc({
      id: id,
      page: 0,
      size: filePageSize,
      name: fileNameFilter,
      fileType: FileTypeFilter,
      fileCategory: categoryFilter,
      year: yearFilter,
    })
  }

  // Folder pagination handlers
  const handleFolderPaginationChange = (page: number) => {
    console.log("Folder pagination change:", page)
    setFolderPage(page)
  }

  const handleFolderPageSizeChange = (size: number) => {
    console.log("Folder page size change:", size)
    setFolderPageSize(size)
    setFolderPage(0)
  }

  // File pagination handlers
  const handleFilePaginationChange = (page: number) => {
    console.log("File pagination change:", page)
    setFilePage(page)
  }

  const handleFilePageSizeChange = (size: number) => {
    console.log("File page size change:", size)
    setFilePageSize(size)
    setFilePage(0)
  }

  return (
    <>
      <div>
        <FileManagerHeader
          isFileView={!!openedDirectoryId}
          onEntryClick={handleEntryClick}
          onDirectoryClick={handleDirectoryClick}
        />
        {showFilters && (
          <FolderManagerFilters
            fileName={fileNameFilter}
            FileTypeFilter={FileTypeFilter}
            fileCategoryFilter={categoryFilter}
            isViewingFiles={!!openedDirectoryId}
            fileYearFilter={yearFilter}
            onYearChange={setYearFilter}
            onFileNameChange={setFileNameFilter}
            onFileTypeChange={setSelectedFileType}
            onCategoryChange={setCategoryFilter}
          />
        )}
        <div className="mt-6">
          {isFileMutating || isDocMutating ? (
            layout === "grid" ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mt-4 gap-4 lg:gap-6">
                {[...Array(4).keys()].map((item) => (
                  <FileSegment key={item} id={`loading-${item}`} loading={isFileMutating || isDocMutating} />
                ))}
              </div>
            ) : (
              <Table>
                <THead>
                  <Tr>
                    <Th>Document Id</Th>
                    <Th>File</Th>
                    <Th>Size</Th>
                    <Th>Type</Th>
                    <Th>Category</Th>
                  </Tr>
                </THead>
                <TableRowSkeleton
                  avatarInColumns={[0]}
                  columns={5}
                  rows={5}
                  avatarProps={{
                    width: 30,
                    height: 30,
                  }}
                />
              </Table>
            )
          ) : (
            <>
              <FileList
                fileList={fileList}
                layout={layout}
                openedDirectoryId={openedDirectoryId}
                triggerGetDoc={triggerGetDoc}
                triggerGetFile={triggerGetFile}
                // Use appropriate pagination based on context
                currentPage={openedDirectoryId ? filePage : folderPage}
                totalItems={openedDirectoryId ? fileTotalItems : folderTotalItems}
                totalPages={openedDirectoryId ? fileTotalPages : folderTotalPages}
                pageSize={openedDirectoryId ? filePageSize : folderPageSize}
                onDownload={handleDownload}
                onShare={handleShare}
                onDelete={handleDelete}
                onOpen={handleOpen}
                onClick={handleClick}
                onPreview={handlePreview}
                onRename={handleRename}
                onEdit={handleFolderEdit}
                onDetails={handleDetails}
                // Use appropriate pagination handlers based on context
                onPageSizeChange={openedDirectoryId ? handleFilePageSizeChange : handleFolderPageSizeChange}
                onPaginationChange={openedDirectoryId ? handleFilePaginationChange : handleFolderPaginationChange}
              />
            </>
          )}
        </div>
      </div>
      {previewFile && <DocumentPreview previewFile={previewFile} onClose={handleClosePreview} />}
      <FileDetails onShare={handleShare} />
      <FolderEdit />
      <FileManagerDeleteDialog />
      <FileManagerInviteDialog />
      <FileManagerRenameDialog />
    </>
  )
}

export default FolderManager


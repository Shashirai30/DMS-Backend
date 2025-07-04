import { create } from "zustand"
import type { Files, Directories, Layout } from "../types"
import { apiGetdoc } from "@/services/FileService"

type DialogProps = {
  id: string
  open: boolean
  filename?: string
  fileType?: string | undefined
  foldername?: string
  description?: string
  directoryCode?: string
  categories?: (string | Category)[]
  fileCategory?: string
}

type Category = { id: string; name: string }

type FolderInfo = {
  name: string
  categories?: (string | Category)[]
  directoryCode?: string
}

export type FileManagerState = {
  fileList: Files
  layout: Layout
  selectedFile: string
  openedDirectoryId: string

  // Folder pagination (root level)
  folderPage: number
  folderPageSize: number
  folderTotalItems: number
  folderTotalPages: number

  // File pagination (inside directories)
  filePage: number
  filePageSize: number
  fileTotalItems: number
  fileTotalPages: number

  directoryCode?: string
  directories: Directories
  folderInfo: FolderInfo | null
  showFilters: boolean
  deleteDialog: DialogProps
  inviteDialog: DialogProps
  renameDialog: DialogProps
  folderEditDialog: DialogProps
}

type Folder = {
  id: string
  name: string
  fileType: "directory"
  description: string
  categories: Category[]
  directoryCode?: string
  fileCategory: string
  category: string
  srcUrl: string
  createdAt: string
  size: number
  filecategory: string
  folder: string
  uploadDate: string
  recentts: string
  code: string
}

type FileManagerAction = {
  // Folder pagination actions
  setFolderPage: (page: number) => void
  setFolderPageSize: (size: number) => void
  setFolderTotalItems: (total: number) => void
  setFolderTotalPages: (pages: number) => void

  // File pagination actions
  setFilePage: (page: number) => void
  setFilePageSize: (size: number) => void
  setFileTotalItems: (total: number) => void
  setFileTotalPages: (pages: number) => void

  // Other actions
  setFileList: (payload: Files) => void
  setLayout: (payload: Layout) => void
  setOpenedDirectoryId: (payload: string) => void
  setDirectories: (payload: Directories) => void
  setSelectedFile: (payload: string) => void
  setfolderInfo: (payload: FolderInfo | null) => void
  setShowFilters: (val: boolean) => void
  setDeleteDialog: (payload: DialogProps) => void
  setInviteDialog: (payload: DialogProps) => void
  setRenameDialog: (payload: DialogProps) => void
  setFolderEditDialog: (payload: DialogProps) => void
  deleteFile: (payload: string) => void
  renameFile: (payload: {
    id: string
    fileName: string
    fileCategory: string
  }) => void
  renameFolder: (payload: {
    id: string
    folderName: string
    folderdescription: string
  }) => void
  addFolder: (payload: {
    id: string
    folderName: string
    folderdescription: string
    categories: Category[]
    directoryCode: string
  }) => void
  fetchFileList: () => Promise<void>

  // Reset pagination when switching contexts
  resetPagination: () => void
}

const initialState: FileManagerState = {
  // Folder pagination
  folderPage: 0,
  folderPageSize: 10,
  folderTotalItems: 0,
  folderTotalPages: 1,

  // File pagination
  filePage: 0,
  filePageSize: 10,
  fileTotalItems: 0,
  fileTotalPages: 1,

  fileList: [],
  layout: "list",
  selectedFile: "",
  showFilters: false,
  folderInfo: null,
  openedDirectoryId: "",
  directories: [],
  deleteDialog: { open: false, id: "" },
  inviteDialog: { open: false, id: "" },
  renameDialog: { open: false, id: "", filename: "", fileCategory: "" },
  folderEditDialog: {
    open: false,
    id: "",
    foldername: "",
    description: "",
    directoryCode: "",
    categories: [],
  },
}

export const useFileManagerStore = create<FileManagerState & FileManagerAction>((set, get) => ({
  ...initialState,

  // Folder pagination setters
  setFolderPage: (page) => set(() => ({ folderPage: page })),
  setFolderPageSize: (size) => set(() => ({ folderPageSize: size })),
  setFolderTotalItems: (total) => set(() => ({ folderTotalItems: total })),
  setFolderTotalPages: (pages) => set(() => ({ folderTotalPages: pages })),

  // File pagination setters
  setFilePage: (page) => set(() => ({ filePage: page })),
  setFilePageSize: (size) => set(() => ({ filePageSize: size })),
  setFileTotalItems: (total) => set(() => ({ fileTotalItems: total })),
  setFileTotalPages: (pages) => set(() => ({ fileTotalPages: pages })),

  // Reset pagination when switching contexts
  resetPagination: () =>
    set(() => ({
      folderPage: 0,
      filePage: 0,
    })),

  setFileList: (payload) => set(() => ({ fileList: payload })),
  setLayout: (payload: Layout) => set(() => ({ layout: payload })),
  setOpenedDirectoryId: (payload) => set(() => ({ openedDirectoryId: payload })),
  setSelectedFile: (payload) => set(() => ({ selectedFile: payload })),
  setDirectories: (payload) => set(() => ({ directories: payload })),
  setfolderInfo: (payload) => set(() => ({ folderInfo: payload })),
  setShowFilters: (val) => set({ showFilters: val }),
  setDeleteDialog: (payload) => set(() => ({ deleteDialog: payload })),
  setInviteDialog: (payload) => set(() => ({ inviteDialog: payload })),
  setRenameDialog: (payload) => set(() => ({ renameDialog: payload })),
  setFolderEditDialog: (payload) => set(() => ({ folderEditDialog: payload })),
  deleteFile: (payload) =>
    set(() => ({
      fileList: get().fileList.filter((file) => file.id !== payload),
    })),
  renameFile: (payload) =>
    set(() => ({
      fileList: get().fileList.map((file) => {
        if (file.id === payload.id) {
          const fileAbbreviationArr = file.name.split(".")
          const fileAbbreviation =
            fileAbbreviationArr.length > 1 ? fileAbbreviationArr[fileAbbreviationArr.length - 1] : null

          return {
            ...file,
            name: fileAbbreviation ? `${payload.fileName}.${fileAbbreviation}` : payload.fileName,
            fileCategory: payload.fileCategory,
          }
        }
        return file
      }),
    })),

  addFolder: (payload) => {
    console.log("Add Folder Payload:", payload)

    return set((state) => ({
      fileList: [
        ...state.fileList,
        {
          id: payload.id,
          name: payload.folderName,
          fileType: "directory",
          description: payload.folderdescription,
          categories: payload.categories,
          fileCategory: "",
          category: "",
          srcUrl: "",
          createdAt: new Date().toISOString(),
          size: 0,
          filecategory: "",
          folder: "",
          uploadDate: "",
          recentts: "",
          code: payload.directoryCode,
        } as Folder,
      ],
      directories: [...state.directories, { id: payload.id, label: payload.folderName }],
    }))
  },

  renameFolder: (payload) =>
    set(() => ({
      fileList: get().fileList.map((file) => {
        if (file.id === payload.id && file.fileType === "directory") {
          file.name = payload.folderName
        }
        return file
      }),
      directories: get().directories.map((dir) => {
        if (dir.id === payload.id) {
          return { ...dir, label: payload.folderName }
        }
        return dir
      }),
    })),
  fetchFileList: async () => {
    try {
      const data = (await apiGetdoc({
        id: get().openedDirectoryId,
        page: 0,
        size: 10,
      })) as { data: { content: Files } }

      set({ fileList: data.data.content })
    } catch (error) {
      if (error) {
        console.error("Error Response:", error)
      } else {
        console.error("Unexpected error:", error)
      }
    }
  },
}))


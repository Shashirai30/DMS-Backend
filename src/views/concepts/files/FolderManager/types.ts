// Updated File type to include documentNumber
export type File = {
  fileCategory: string | undefined
  category: string
  code: string
  description: string
  categories: string[]
  id: string
  name: string
  documentNumber?: string 
  filecategory: string
  fileType: string
  srcUrl: string
  size: number
  folder: string
  
  author: {
    name: string
    email: string
    img: string
  }
  activities: {
    userName: string
    userImg: string
    actionType: string
    timestamp: number
  }[]
  permissions: {
    userName: string
    userImg: string
    role: string
  }[]
  uploadDate: number
  recent: boolean
}

export type Category = { id: string; name: string }

export type FolderInfo = {
  categories: Category[]
  name: string
}

export type Folder = {
  id: string
  name: string
  documentNumber?: string
  code: string;
  fileType: "directory"
  description: string
  directoryCode?: string
  categories: Category[]
  fileCategory: string
  category: string
  srcUrl: string
  createdAt: string
  size: number
  filecategory: string
  folder: string
  uploadDate: string
  recentts: string
}

export type DropdownItemCallbackProps = {
  id: string
  onOpen?: () => void
  onDownload?: () => void
  onShare?: () => void
  onRename?: () => void
  onDelete?: () => void
  onpreview?: () => void
  onDetails?: () => void
  onEdit?: () => void
}

export type Layout = "grid" | "list"

export type Files = Array<File | Folder>

export type Directories = { id: string; label: string }[]

export type GetFoldersListResponse = {
  length: number
  data: File[]
  directory: Directories
}

export type GetFilesListResponse = {
  length: number
  forEach(arg0: (item: any) => void): unknown
  data: {
    content: File[]
    page: {
      number: number
      size: number
      totalElements: number
      totalPages: number
    }
  }
  directory: Directories
}

export interface FilePreviewResponse {
  srcUrl: string
}

export type BaseFileItemProps = {
  id?: string
  name?: string
    documentNumber?: string 
    directoryCode?: string
  fileType?: string
  size?: number
  category?: string
  loading?: boolean
  onClick?: () => void
  onPreview?: () => void | undefined
  onDetails?: (id: string) => void
} & DropdownItemCallbackProps


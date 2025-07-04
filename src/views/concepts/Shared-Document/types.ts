// ShareFile Types

export type ShareFile = {
    permissions?: Array<{
        shareToken: string // Define the structure of permissions
    }> 
    id: string
    name: string
    fileType: string
    srcUrl: string
    size: number
    owner: string
    modifiedDate: string
    folder: string
    isShared: boolean; 
    
    author: {
        name: string
        email: string
        img: string
    }
    uploadDate: number
}

export type ShareDropdownItemCallbackProps = {
    // id: string
    onOpen?: () => void
    onDownload?: () => void
    onShare?: () => void
    onPreview?: () => void
    onDetails?: () => void
}

export type ShareLayout = 'grid' | 'list'

export type ShareFiles = ShareFile[]

export type ShareDirectories = { id: string; label: string }[]

export type GetShareFilesListResponse = {
    length: number
    data: {
        content: ShareFile[]
        page: {
            number: number
            size: number
            totalElements: number
            totalPages: number
        }
    }
    directory: ShareDirectories
}

export interface ShareFilePreviewResponse {
    srcUrl: string
}

export type ShareBaseFileItemProps = {
    id?: string
    name?: string
    fileType?: string
    size?: number
    owner?: string
    department?: string
    modfiedDate?: string
    loading?: boolean
    isShared?: boolean; 
    onClick?: () => void
    onPreview?: () => void | undefined
} & ShareDropdownItemCallbackProps

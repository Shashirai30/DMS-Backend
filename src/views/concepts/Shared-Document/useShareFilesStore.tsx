import { create } from 'zustand'
import type { ShareFiles, ShareDirectories, ShareLayout } from './types'

type DialogProps = {
    id: string
    open: boolean
}

export type ShareFileManagerState = {
    fileList: ShareFiles
    selectedFile: string
    layout: ShareLayout
    
    openedDirectoryId: string
    directories: ShareDirectories
    inviteDialog: DialogProps
}

type ShareFileManagerAction = {
    setFileList: (payload: ShareFiles) => void
    setSelectedFile: (payload: string) => void
    setLayout: (payload: ShareLayout) => void
    
    setOpenedDirectoryId: (payload: string) => void
    setDirectories: (payload: ShareDirectories) => void
    setInviteDialog: (payload: DialogProps) => void
}

const initialState: ShareFileManagerState = {
    fileList: [],
    layout: 'list',
    selectedFile: '',
    openedDirectoryId: '',
    directories: [],
    inviteDialog: { open: false, id: '' },
}

export const useShareFileManagerStore = create<ShareFileManagerState & ShareFileManagerAction>(
    (set) => ({
        ...initialState,
        setFileList: (payload) => set(() => ({ fileList: payload })),
        setLayout: (payload: ShareLayout) => set(() => ({ layout: payload })),
        setSelectedFile: (payload) => set(() => ({ selectedFile: payload })),
        setOpenedDirectoryId: (payload) => set(() => ({ openedDirectoryId: payload })),
        setDirectories: (payload) => set(() => ({ directories: payload })),
        setInviteDialog: (payload) => set(() => ({ inviteDialog: payload })),
    })
)

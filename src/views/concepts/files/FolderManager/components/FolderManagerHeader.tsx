// Note: Folder Manager Header Component
import { Fragment, useState, useEffect } from 'react' // Added useEffect
import Segment from '@/components/ui/Segment'
import { useFileManagerStore } from '../store/useFolderManagerStore'
import { TbChevronRight, TbFilter, TbLayoutGrid, TbList } from 'react-icons/tb'
import type { Layout } from '../types'
import CreateFolder from './CreateFolder'
import UploadFile from './UploadFile'
import { Button } from '@/components/ui'
import { useSessionUser } from '@/store/authStore'

type FileManagerHeaderProps = {
    onEntryClick: () => void
    onDirectoryClick: (id: string) => void
    isFileView: boolean // Determines if current view is for files
}

const FileManagerHeader = ({
    onEntryClick,
    isFileView
}: FileManagerHeaderProps) => {
    const { showFilters, folderInfo, layout, setfolderInfo, setLayout, setShowFilters } = useFileManagerStore()
    const user = useSessionUser((state) => state.user)
    const isAdmin = user.roles.includes("ADMIN") 
    
    // Track last valid folder info
    const [lastFolderInfo, setLastFolderInfo] = useState(folderInfo)
    useEffect(() => {
        if (folderInfo) {
            setLastFolderInfo(folderInfo)
        }
    }, [folderInfo])
    
    // Use last folder info when in file view and current info is missing
    const displayFolderInfo = isFileView && !folderInfo ? lastFolderInfo : folderInfo

    const handleEntryClick = () => {
        setfolderInfo(null) 
        onEntryClick()
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <div className="flex items-center gap-2">
                    <h3 className="flex items-center gap-2 text-base sm:text-2xl">
                        <span
                            className="hover:text-primary cursor-pointer"
                            role="button"
                            onClick={handleEntryClick}
                        >
                            Folder Manager
                        </span>

                        {displayFolderInfo?.name && ( // Updated to use displayFolderInfo
                            <>
                                <TbChevronRight className="text-lg" />
                                <span>{displayFolderInfo.name}</span>
                            </>
                        )}
                    </h3>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button icon={<TbFilter />}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    Filter
                </Button>

                <Segment
                    value={layout}
                    onChange={(val) => setLayout(val as Layout)}
                >
                    <Segment.Item value="grid" className="text-xl px-3">
                        <TbLayoutGrid />
                    </Segment.Item>
                    <Segment.Item value="list" className="text-xl px-3">
                        <TbList />
                    </Segment.Item>
                </Segment>

                {isAdmin && (isFileView ? <UploadFile /> : <CreateFolder />)}
            </div>
        </div>
    )
}

export default FileManagerHeader

// // Note: Folder Manager Header Component
// import { Fragment } from 'react'
// import Segment from '@/components/ui/Segment'
// import { useFileManagerStore } from '../store/useFolderManagerStore'
// import { TbChevronRight, TbFilter, TbLayoutGrid, TbList } from 'react-icons/tb'
// import type { Layout } from '../types'
// import CreateFolder from './CreateFolder'
// import UploadFile from './UploadFile'
// import { Button } from '@/components/ui'
// import { useSessionUser } from '@/store/authStore'

// type FileManagerHeaderProps = {
//     onEntryClick: () => void
//     onDirectoryClick: (id: string) => void
//     isFileView: boolean // Determines if current view is for files
// }

// const FileManagerHeader = ({
//     onEntryClick,
//     isFileView
// }: FileManagerHeaderProps) => {
//     const { showFilters, folderInfo, layout, setfolderInfo, setLayout, setShowFilters } = useFileManagerStore()
//     const user = useSessionUser((state) => state.user)
//     const isAdmin = user.roles.includes("ADMIN") 

//     const handleEntryClick = () => {
//         setfolderInfo(null) 
//         onEntryClick()
//     }

//     return (
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//             <div>
//                 <div className="flex items-center gap-2">
//                     <h3 className="flex items-center gap-2 text-base sm:text-2xl">
//                         <span
//                             className="hover:text-primary cursor-pointer"
//                             role="button"
//                             onClick={handleEntryClick}
//                         >
//                             Folder Manager
//                         </span>

//                         {folderInfo?.name && (
//                             <>
//                                 <TbChevronRight className="text-lg" />
//                                 <span>{folderInfo.name}</span>
//                             </>
//                         )}
//                     </h3>
//                 </div>
//             </div>
//             <div className="flex items-center gap-2">
//                 <Button icon={<TbFilter />}
//                     onClick={() => setShowFilters(!showFilters)}
//                 >
//                     Filter
//                 </Button>

//                 <Segment
//                     value={layout}
//                     onChange={(val) => setLayout(val as Layout)}
//                 >
//                     <Segment.Item value="grid" className="text-xl px-3">
//                         <TbLayoutGrid />
//                     </Segment.Item>
//                     <Segment.Item value="list" className="text-xl px-3">
//                         <TbList />
//                     </Segment.Item>
//                 </Segment>

//                 {isAdmin && (isFileView ? <UploadFile /> : <CreateFolder />)}
//             </div>
//         </div>
//     )
// }

// export default FileManagerHeader


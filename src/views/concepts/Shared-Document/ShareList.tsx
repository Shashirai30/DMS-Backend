import { useMemo } from 'react'
import Table from '@/components/ui/Table'
import SharedRow from './SharedRow'
import type { ShareFiles, ShareLayout } from './types'
import ShareSegment from './ShareSegment'
import Pagination from '@/components/ui/Pagination' 
import Select from '@/components/ui/Select' 

type FileListProps = {
    fileList: ShareFiles
    layout: ShareLayout
    onClick: (id: string, shareToken?: string) => void
    onPreview: (id: string) => void;
    pageSize: number
    currentPage: number
    totalItems: number
    totalPages: number
    onPaginationChange: (page: number) => void
    onPageSizeChange: (value: number) => void
}

// Page size options for dropdown
const pageSizeOptions = [
    { label: '5 / page', value: 5 },
    { label: '10 / page', value: 10 },
    { label: '20 / page', value: 20 },
    { label: '50 / page', value: 50 },
]

const { TBody, THead, Th, Tr } = Table
const ShareList = ({
    fileList,
    layout,
    onClick,
    pageSize,
    currentPage,
    totalItems,
    onPreview,
    onPaginationChange,
    onPageSizeChange,
}: FileListProps) => {
    const files = useMemo(() => {
        return fileList.filter((file) => file.fileType !== 'directory')
    }, [fileList])

    const renderFileSegment = (list: ShareFiles) => (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mt-4 gap-4 lg:gap-6">
            {list.map((file) => {
                // console.log('File:', file.permissions?.[1]?.shareToken)
                
                return (
                    <ShareSegment
                        key={file.id}
                        fileType={file.fileType}
                        name={file.name}
                        owner={file.owner || 'Unknown'}
                        size={file.size}
                        department={file.folder} 
                        onClick={() => onClick(file.id, file.permissions?.[1]?.shareToken)}
                    />
                );
            })}
        </div>
    )


    const renderFileRow = (list: ShareFiles) => (
        <Table className="mt-4">
            <THead>
                <Tr>
                    <Th>File</Th>
                    <Th>Department</Th>
                    <Th>Size</Th>
                    <Th>Type</Th>
                </Tr>
            </THead>
            <TBody>
                {list.map((file) => {
                    // console.log('File:', file.permissions?.[0]?.shareToken)

                 
                    return (
                        <SharedRow
                            key={file.id}
                            id={file.id}
                            fileType={file.fileType}
                            size={file.size}
                            name={file.name}
                            department={file.folder} 
                            onPreview={() => onPreview(file.id)}
                            onClick={() => onClick(file.id, file.permissions?.[1]?.shareToken)}
                        />
                    );
                })}
            </TBody>
        </Table>
    )


    return (
        <div>
            {files.length > 0 && (
                <>
                    <div className="mt-4">
                        {layout === 'grid' ? renderFileSegment(files) : renderFileRow(files)}
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        {/* Pagination Controls */}
                        <Pagination
                            pageSize={pageSize}
                            currentPage={currentPage + 1} // Display 1-based for user
                            total={totalItems}
                            onChange={(page) => onPaginationChange(page - 1)} // Send 0-based back
                        />
                        {/* Page Size Dropdown */}
                        <div style={{ minWidth: 130 }}>
                            <Select
                                size="sm"
                                menuPlacement="top"
                                isSearchable={false}
                                value={pageSizeOptions.find((option) => option.value === pageSize)}
                                options={pageSizeOptions}
                                onChange={(option) => option && onPageSizeChange(option.value)}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default ShareList

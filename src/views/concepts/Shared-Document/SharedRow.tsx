import Table from '@/components/ui/Table'
import ShareFileType from './ShareFileType'
import fileSizeUnit from '@/utils/fileSizeUnit'
import FileIcon from '@/components/view/FileIcon'
import type { ShareBaseFileItemProps } from './types'

type FileRowProps = ShareBaseFileItemProps 

const { Tr, Td } = Table

const FileRow = (props: FileRowProps) => {
    const {  fileType, size, name,  onClick, department } = props

    return (
        <Tr>
            <Td width="70%">
                <div
                    className="inline-flex items-center gap-2 cursor-pointer group"
                    role="button"
                    onClick={onClick}
                >
                    <div className="text-3xl">
                        <FileIcon type={fileType || ''} />
                    </div>
                    <div className="font-bold heading-text group-hover:text-primary">
                        {name}
                    </div>
                </div>
            </Td>
            <Td>{department || 'N/A'}</Td> 
            <Td>{fileSizeUnit(size || 0)}</Td>
            <Td>
                <ShareFileType type={fileType || ''} />
            </Td>
           
        </Tr>
    )
}

export default FileRow

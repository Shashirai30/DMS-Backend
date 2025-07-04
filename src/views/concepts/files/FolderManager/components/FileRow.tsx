"use client"

import Table from "@/components/ui/Table"
import FileType from "./FileType"
import FileItemDropdown from "./FileItemDropdown"
import fileSizeUnit from "@/utils/fileSizeUnit"
import FileIcon from "@/components/view/FileIcon"
import type { BaseFileItemProps } from "../types"

type FileRowProps = BaseFileItemProps

const { Tr, Td } = Table

const FileRow = (props: FileRowProps) => {
  const { id, fileType, category, directoryCode, size, documentNumber, name, onClick, onPreview, ...rest } = props

  return (
    <Tr
      onClick={onClick}
      className="cursor-pointer hover:bg-gray-50 transition-colors"
      role="button"
      aria-label={`Open ${name}`}
    >
      <Td width="30%">
        <div className="inline-flex items-center gap-2">
          <div className="text-3xl">
            <FileIcon type={fileType || ""} />
          </div>
          <div className="font-bold heading-text group-hover:text-primary">{documentNumber}</div>
        </div>
      </Td>
      <Td>
        <div className="heading-text group-hover:text-primary">{name}</div>
      </Td>
      <Td>{fileSizeUnit(size || 0)}</Td>
      <Td>
        <FileType type={fileType || ""} />
      </Td>
      {fileType !== "directory" && <Td>{category}</Td>}
      <Td onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end">
          <FileItemDropdown id={id} {...rest} onPreview={onPreview} />
        </div>
      </Td>
    </Tr>
  )
}

export default FileRow

"use client"

import FileItemDropdown from "./FileItemDropdown"
import fileSizeUnit from "@/utils/fileSizeUnit"
import MediaSkeleton from "@/components/shared/loaders/MediaSkeleton"
import FileIcon from "@/components/view/FileIcon"
import type { BaseFileItemProps } from "../types"

type FileSegmentProps = BaseFileItemProps & {
  onPreview?: () => void
  fileType?: string
  onEdit?: (id: string) => void
}

const FileSegment = (props: FileSegmentProps) => {
  const { id, fileType, size, name, documentNumber, directoryCode, category, onClick, loading, ...rest } = props

  return (
    <div
      className="bg-white rounded-2xl dark:bg-gray-800 border border-gray-200 dark:border-transparent py-4 px-3.5 flex items-center justify-between gap-2 transition-all hover:shadow-[0_0_1rem_0.25rem_rgba(0,0,0,0.04),0px_2rem_1.5rem_-1rem_rgba(0,0,0,0.12)] cursor-pointer"
      role="button"
      onClick={onClick}
      aria-label={`Open ${name}`}
    >
      {loading ? (
        <MediaSkeleton
          avatarProps={{
            width: 33,
            height: 33,
          }}
        />
      ) : (
        <>
          <div className="flex items-center gap-2 flex-grow">
            <div className="text-3xl">
              <FileIcon type={fileType || ""} />
            </div>

            <div className="flex flex-col">
              <div className="font-bold heading-text group-hover:text-primary">{documentNumber}</div>
              <div className="font-bold heading-text">{name}</div>
              {fileType !== "directory" && <div className="text-xs opacity-60">{category}</div>}
              <span className="text-xs">{fileSizeUnit(size || 0)}</span>
            </div>
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            <FileItemDropdown id={id} fileType={fileType} {...rest} />
          </div>
        </>
      )}
    </div>
  )
}

export default FileSegment

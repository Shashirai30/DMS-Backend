"use client"

import { useRef } from "react"
import Dropdown from "@/components/ui/Dropdown"
import EllipsisButton from "@/components/shared/EllipsisButton"
import { TbCloudDownload, TbTrash, TbFolderSymlink, TbEye, TbPencil, TbEdit } from "react-icons/tb"
import type { DropdownItemCallbackProps } from "../types"
import type { DropdownRef } from "@/components/ui/Dropdown"
import type { MouseEvent, SyntheticEvent } from "react"
import { HiOutlineShare } from "react-icons/hi"
import { useSessionUser } from "@/store/authStore"

type FileItemDropdownProps = DropdownItemCallbackProps & {
  onPreview?: () => void
  fileType?: string
  id?: string
}

const FileItemDropdown = (props: FileItemDropdownProps) => {
  const { onDelete, onShare, onDownload, onOpen, onRename, onPreview, onEdit, onDetails, fileType } = props

  const user = useSessionUser((state) => state.user)
  const isAdmin = user.roles.includes("ADMIN")
  const dropdownRef = useRef<DropdownRef>(null)

  const handleDropdownClick = (e: MouseEvent) => {
    e.stopPropagation()
    dropdownRef.current?.handleDropdownOpen()
  }

  const handleDropdownItemClick = (e: SyntheticEvent, callback?: () => void) => {
    e.stopPropagation()
    callback?.()
  }

  return (
    <Dropdown ref={dropdownRef} renderTitle={<EllipsisButton onClick={handleDropdownClick} />} placement="bottom-end">
      {/* Show Open option only for directories */}
      {onOpen && fileType === "directory" && (
        <Dropdown.Item eventKey="Open" onClick={(e) => handleDropdownItemClick(e, onOpen)}>
          <TbFolderSymlink className="text-xl" />
          <span>Open</span>
        </Dropdown.Item>
      )}

      {/* Show Preview option only for files (not directories) */}
      {onPreview && fileType !== "directory" && (
        <Dropdown.Item eventKey="preview" onClick={(e) => handleDropdownItemClick(e, onPreview)}>
          <TbEye className="text-xl" />
          <span>Preview</span>
        </Dropdown.Item>
      )}

      {/* Only show download if not a directory */}
      {onDownload && fileType !== "directory" && (
        <Dropdown.Item eventKey="download" onClick={(e) => handleDropdownItemClick(e, onDownload)}>
          <TbCloudDownload className="text-xl" />
          <span>Download</span>
        </Dropdown.Item>
      )}

      {/* Share option for all items */}
      <Dropdown.Item eventKey="share" onClick={(e) => handleDropdownItemClick(e, onShare)}>
        <HiOutlineShare className="text-xl" />
        <span>Share</span>
      </Dropdown.Item>

      {/* Edit option only for directories and only for admins */}
      {fileType === "directory" && onEdit && isAdmin && (
        <Dropdown.Item eventKey="edit" onClick={(e) => handleDropdownItemClick(e, onEdit)}>
          <TbEdit className="text-xl" />
          <span>Edit Folder</span>
        </Dropdown.Item>
      )}

      {/* Rename option only for files (not directories) and only for admins */}
      {fileType !== "directory" && onRename && isAdmin && (
        <Dropdown.Item eventKey="rename" onClick={(e) => handleDropdownItemClick(e, onRename)}>
          <TbPencil className="text-xl" />
          <span>Rename</span>
        </Dropdown.Item>
      )}

      {/* Delete option only for admins */}
      {isAdmin && onDelete && (
        <Dropdown.Item eventKey="delete" onClick={(e) => handleDropdownItemClick(e, onDelete)}>
          <span className="flex items-center gap-2 text-error">
            <TbTrash className="text-xl" />
            <span>Delete</span>
          </span>
        </Dropdown.Item>
      )}

      {/* Details option for all items */}
      {onDetails && (
        <Dropdown.Item eventKey="Details" onClick={(e) => handleDropdownItemClick(e, onDetails)}>
          <TbFolderSymlink className="text-xl" />
          <span>Details</span>
        </Dropdown.Item>
      )}
    </Dropdown>
  )
}

export default FileItemDropdown


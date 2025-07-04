"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Button from "@/components/ui/Button"
import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import Table from "@/components/ui/Table"
import Dialog from "@/components/ui/Dialog"
import { Notification } from "@/components/ui/Notification"
import {
  apiGetAllNextNumbering,
  apiDeleteNextNumbering,
  apiUpdateNextNumberingIndex,
} from "@/services/NextNumberingService"
import { apiGetFolders } from "@/services/FileService"
import type { NextNumbering } from "@/@types/next-numbering"
import { toast } from "@/components/ui"

interface FolderData {
  id: string
  name: string
  code: string
  categories: Array<{ id: string; name: string; code?: string }>
}

const NextNumberingList = () => {
  const [numberings, setNumberings] = useState<NextNumbering[]>([])
  const [filteredNumberings, setFilteredNumberings] = useState<NextNumbering[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteConfirmation, setDeleteConfirmation] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [foldersData, setFoldersData] = useState<FolderData[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchNumberings()
    fetchFoldersData()
  }, [])

  useEffect(() => {
    const filtered = numberings.filter(
      (numbering) =>
        numbering.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        numbering.process.toLowerCase().includes(searchTerm.toLowerCase()) ||
        numbering.docId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        numbering.docNumber.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredNumberings(filtered)
  }, [searchTerm, numberings])

  const fetchFoldersData = async () => {
    try {
      console.log("🔄 Fetching folders data for display names...")
      const response = await apiGetFolders<any, any>({
        sortBy: "code",
        sortDir: "asc",
        page: 0,
        size: 100,
      })

      if (response?.data?.content && Array.isArray(response.data.content)) {
        const folderList = response.data.content
          .filter((item: any) => item.fileType === "directory")
          .map((item: any) => ({
            id: item.id.toString(),
            name: item.name,
            code: item.code || "",
            categories: item.categories || [],
          }))

        console.log("📁 Folders data loaded:", folderList)
        setFoldersData(folderList)
      }
    } catch (error) {
      console.error("❌ Error fetching folders data:", error)
    }
  }

  const fetchNumberings = async () => {
    try {
      setLoading(true)
      console.log("🔄 Fetching all numbering sequences...")
      const response = await apiGetAllNextNumbering()
      console.log("📥 API Response:", response)

      if (response.status === 200 && Array.isArray(response.data)) {
        console.log("✅ Successfully fetched numberings:", response.data)
        setNumberings(response.data)
        setFilteredNumberings(response.data)
      }
    } catch (error) {
      console.error("❌ Error fetching numberings:", error)
      toast.push(
        <Notification title="Error" type="danger">
          Failed to fetch numbering sequences
        </Notification>,
      )
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedId) return

    try {
      console.log("🗑️ Deleting numbering sequence with ID:", selectedId)
      const response = await apiDeleteNextNumbering(selectedId)
      console.log("📥 Delete API Response:", response)

      if (response.status === 200) {
        console.log("✅ Successfully deleted numbering sequence")
        toast.push(
          <Notification title="Success" type="success">
            Numbering sequence deleted successfully
          </Notification>,
        )
        fetchNumberings()
      }
    } catch (error) {
      console.error("❌ Error deleting numbering sequence:", error)
      toast.push(
        <Notification title="Error" type="danger">
          Failed to delete numbering sequence
        </Notification>,
      )
    }
    setDeleteConfirmation(false)
    setSelectedId(null)
  }

  const handleUpdateIndex = async (id: number) => {
    try {
      console.log("🔄 Updating index for numbering sequence with ID:", id)
      const response = await apiUpdateNextNumberingIndex(id)
      console.log("📥 Update Index API Response:", response)

      if (response.status === 200) {
        console.log("✅ Successfully updated index")
        toast.push(
          <Notification title="Success" type="success">
            Index updated successfully
          </Notification>,
        )
        fetchNumberings()
      }
    } catch (error) {
      console.error("❌ Error updating index:", error)
      toast.push(
        <Notification title="Error" type="danger">
          Failed to update index
        </Notification>,
      )
    }
  }

  const handleEdit = (id: number) => {
    console.log("✏️ Navigating to edit page for ID:", id)
    navigate(`/concepts/next-numbering/edit/${id}`)
  }

  const confirmDelete = (id: number) => {
    setSelectedId(id)
    setDeleteConfirmation(true)
  }

  const getStatusBadge = (status: number) => {
    return status === 1 ? (
      <Badge className="bg-emerald-500 text-black">Active</Badge>
    ) : (
      <Badge className="bg-gray-400 text-black">Inactive</Badge>
    )
  }

  // Helper function to get folder display name
  const getFolderDisplay = (folderCode: string) => {
    const folder = foldersData.find((f) => f.code === folderCode)
    if (folder) {
      return (
        <div className="flex flex-col">
          <span className="font-medium">{folder.name}</span>
          <span className="text-xs text-gray-500">ID: {folder.code}</span>
        </div>
      )
    }
    return (
      <div className="flex flex-col">
        <span className="font-medium">{folderCode}</span>
        <span className="text-xs text-gray-500">Code: {folderCode}</span>
      </div>
    )
  }

  // Helper function to get category display name
  const getCategoryDisplay = (categoryCode: string, folderCode: string) => {
    const folder = foldersData.find((f) => f.code === folderCode)
    if (folder) {
      // Try to find category by code (after hyphen) or by full name
      const category = folder.categories.find((cat) => {
        const extractedCode = cat.name.substring(cat.name.lastIndexOf("-") + 1)
        return extractedCode === categoryCode || cat.name === categoryCode
      })

      if (category) {
        return (
          <div className="flex flex-col">
            <span className="font-medium">{category.name}</span>
            <span className="text-xs text-gray-500">Code: {categoryCode}</span>
          </div>
        )
      }
    }
    return (
      <div className="flex flex-col">
        <span className="font-medium">{categoryCode}</span>
        <span className="text-xs text-gray-500">Code: {categoryCode}</span>
      </div>
    )
  }

  return (
    <>
      <div className="lg:flex items-center justify-end mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-2">
          <Button variant="solid" onClick={() => navigate("/concepts/next-numbering/create")}>
            <span className="flex items-center gap-1">
              <i className="ri-add-line" />
              <span>Add Sequence</span>
            </span>
          </Button>
        </div>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <thead>
              <tr>
                <th>Doc ID</th>
                <th>Process</th>
                <th>Folder</th>
                <th>Category</th>
                <th>Year</th>
                <th>Last Number</th>
                <th>Status</th>
                {/* <th>Action</th> */}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center">
                    <div className="flex items-center justify-center h-36">
                      <div className="animate-spin">
                        <i className="ri-loader-4-line text-2xl" />
                      </div>
                    </div>
                  </td>
                </tr>
              ) : filteredNumberings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center">
                    <div className="flex flex-col items-center justify-center h-36">
                      <i className="ri-file-search-line text-4xl text-gray-400" />
                      <p className="mt-2">No numbering sequences found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredNumberings.map((numbering) => (
                  <tr key={numbering.id}>
                    <td className="font-medium">
                      <div className="flex flex-col">
                        <span>{numbering.docId}</span>
                        {/* <span className="text-xs text-gray-500">ID: {numbering.id}</span> */}
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <span className="font-medium">{numbering.process}</span>
                        {/* <span className="text-xs text-gray-500">Process Code</span> */}
                      </div>
                    </td>
                    <td>{getFolderDisplay(numbering.folder)}</td>
                    <td>{getCategoryDisplay(numbering.category, numbering.folder)}</td>
                    <td>
                      <div className="flex flex-col">
                        <span className="font-medium">20{numbering.year}</span>
                        {/* <span className="text-xs text-gray-500">Year: {numbering.year}</span> */}
                      </div>
                    </td>
                    <td className="font-mono text-sm">
                      <div className="flex flex-col">
                        <span className="font-medium">{numbering.lastNumber}</span>
                        {/* <span className="text-xs text-gray-500">Current Index</span> */}
                      </div>
                    </td>
                    <td>{getStatusBadge(numbering.status)}</td>
                        <td> 
                       <div className="flex items-center gap-2"> 
                        {/* <Button
                         size="xs"
                         variant="twoTone"
                         color="blue-600"
                         icon={<i className="ri-edit-line" />}
                         onClick={() => handleEdit(numbering.id)}
                         title="Edit"
                        />
                         <Button
                           size="xs"
                           variant="twoTone"
                           color="emerald-600"
                           icon={<i className="ri-refresh-line" />}
                           onClick={() => handleUpdateIndex(numbering.id)}
                           title="Update Index"
                         />  */}
                        
                          {/* could be used below delete */}
                         {/* <Button
                           size="xs"
                           variant="twoTone"
                           color="red-600"
                           icon={
                             <i
                               className="ri-delete-bin-line"
                               aria-hidden="true"
                             />
                           }
                           onClick={() => confirmDelete(numbering.id)}
                           title="Delete"
                           aria-label="Delete"
                         />  */}
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </Card>

      <Dialog
        isOpen={deleteConfirmation}
        onClose={() => setDeleteConfirmation(false)}
        onRequestClose={() => setDeleteConfirmation(false)}
      >
        <h5 className="mb-4">Delete Numbering Sequence</h5>
        <p>Are you sure you want to delete this numbering sequence? This action cannot be undone.</p>
        <div className="text-right mt-6">
          <Button size="sm" className="mr-2" variant="plain" onClick={() => setDeleteConfirmation(false)}>
            Cancel
          </Button>
          <Button size="sm" variant="solid" color="red-600" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Dialog>
    </>
  )
}

export default NextNumberingList


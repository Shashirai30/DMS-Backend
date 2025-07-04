"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Button from "@/components/ui/Button"
import Card from "@/components/ui/Card"
import Input from "@/components/ui/Input"
import { FormItem } from "@/components/ui/Form"
import { Notification} from "@/components/ui/Notification"
import Switcher from "@/components/ui/Switcher"
import { apiGetNextNumberingById, apiUpdateNextNumbering } from "@/services/NextNumberingService"
import type { NextNumbering, UpdateNextNumberingRequest } from "@/@types/next-numbering"
import { toast } from "@/components/ui"

const NextNumberingEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [formData, setFormData] = useState<UpdateNextNumberingRequest>({
    id: 0,
    category: "",
    process: "",
    year: new Date().getFullYear() % 100,
    currentIndex: 0,
    length: 8,
    docId: "",
    folder: "",
    status: 1,
  })

  useEffect(() => {
    if (id) {
      fetchNumbering(Number(id))
    }
  }, [id])

  const fetchNumbering = async (numberingId: number) => {
    try {
      setFetchLoading(true)
      console.log("🔄 Fetching numbering sequence for edit, ID:", numberingId)
      const response = await apiGetNextNumberingById(numberingId)
      console.log("📥 Fetch response:", response)

      if (response.status === 200 && !Array.isArray(response.data)) {
        const numbering = response.data as NextNumbering
        console.log("✅ Setting form data:", numbering)
        setFormData({
          id: numbering.id,
          category: numbering.category,
          process: numbering.process,
          year: numbering.year,
          currentIndex: numbering.currentIndex,
          length: numbering.length,
          docId: numbering.docId,
          folder: numbering.folder,
          status: numbering.status,
        })
      }
    } catch (error) {
      console.error("❌ Error fetching numbering sequence:", error)
      toast.push(
        <Notification title="Error" type="danger">
          Failed to fetch numbering sequence
        </Notification>,
      )
      navigate("/concepts/next-numbering")
    } finally {
      setFetchLoading(false)
    }
  }

  const handleInputChange = (field: keyof UpdateNextNumberingRequest, value: string | number | boolean) => {
    console.log(`🔄 Form field changed: ${field} = ${value}`)
    setFormData((prev) => ({
      ...prev,
      [field]: field === "status" ? (value ? 1 : 0) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("🚀 Update form submitted!")
    console.log("📝 Form data:", formData)

    if (!formData.category || !formData.process || !formData.docId) {
      console.log("❌ Validation failed - missing required fields")
      toast.push(
        <Notification title="Validation Error" type="danger">
          Please fill in all required fields
        </Notification>,
      )
      return
    }

    try {
      setLoading(true)
      console.log("📤 Sending API request to update numbering sequence...")
      const response = await apiUpdateNextNumbering(formData.id, formData)
      console.log("📥 Update API Response:", response)

      if (response.status === 200) {
        console.log("✅ Successfully updated numbering sequence")
        toast.push(
          <Notification title="Success" type="success">
            Numbering sequence updated successfully
          </Notification>,
        )
        navigate("/concepts/next-numbering")
      }
    } catch (error) {
      console.error("❌ Error updating numbering sequence:", error)
      toast.push(
        <Notification title="Error" type="danger">
          Failed to update numbering sequence
        </Notification>,
      )
    } finally {
      setLoading(false)
    }
  }

  const generatePreview = () => {
    if (formData.process && formData.folder && formData.category) {
      return `${formData.process}/${formData.folder}/${formData.category}`
    }
    return "Process/Folder/Category"
  }

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="animate-spin">
          <i className="ri-loader-4-line text-2xl" />
        </div>
      </div>
    )
  }

  return (
    <Card>
      <div className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FormItem label="Document ID *" invalid={!formData.docId} errorMessage="Document ID is required">
              <Input
                value={formData.docId}
                onChange={(e) => handleInputChange("docId", e.target.value)}
                placeholder="e.g., 00-01"
              />
            </FormItem>

            <FormItem label="Category *" invalid={!formData.category} errorMessage="Category is required">
              <Input
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                placeholder="e.g., 01"
              />
            </FormItem>

            <FormItem label="Process *" invalid={!formData.process} errorMessage="Process is required">
              <Input
                value={formData.process}
                onChange={(e) => handleInputChange("process", e.target.value)}
                placeholder="e.g., RKT"
              />
            </FormItem>

            <FormItem label="Folder">
              <Input
                value={formData.folder}
                onChange={(e) => handleInputChange("folder", e.target.value)}
                placeholder="e.g., 00"
              />
            </FormItem>

            <FormItem label="Year">
              <Input type="number" value={formData.year} disabled className="bg-gray-100" />
            </FormItem>

            <FormItem label="Current Index">
              <Input
                type="number"
                value={formData.currentIndex}
                onChange={(e) => handleInputChange("currentIndex", Number(e.target.value) || 0)}
                min="0"
              />
            </FormItem>

            <FormItem label="Total Length">
              <Input type="number" value={formData.length} disabled className="bg-gray-100" />
            </FormItem>

            <FormItem label="Status">
              <div className="flex items-center gap-2">
                <Switcher
                  checked={formData.status === 1}
                  onChange={(checked) => handleInputChange("status", checked)}
                />
                <span>{formData.status === 1 ? "Active" : "Inactive"}</span>
              </div>
            </FormItem>
          </div>

          <FormItem label="Number Format Preview">
            <div className="p-3 bg-gray-50 rounded-md font-mono text-sm">{generatePreview()}</div>
          </FormItem>

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="plain" onClick={() => navigate("/concepts/next-numbering")}>
              Cancel
            </Button>
            <Button type="submit" variant="solid" loading={loading}>
              {loading ? "Updating..." : "Update Sequence"}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  )
}

export default NextNumberingEdit


// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { useNavigate, useParams } from "react-router-dom"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { FormItem, FormContainer } from "@/components/ui/form"
// import { Notification } from "@/components/ui/notification"
// import { Switcher } from "@/components/ui/switcher"
// import { apiGetNextNumberingById, apiUpdateNextNumbering } from "@/services/NextNumberingService"
// import type { NextNumbering, UpdateNextNumberingRequest } from "@/@types/next-numbering"
// import { toast } from "@/components/ui"

// const NextNumberingEdit = () => {
//   const navigate = useNavigate()
//   const { id } = useParams<{ id: string }>()
//   const [loading, setLoading] = useState(false)
//   const [fetchLoading, setFetchLoading] = useState(true)
//   const [formData, setFormData] = useState<UpdateNextNumberingRequest>({
//     id: 0,
//     category: "",
//     process: "",
//     year: new Date().getFullYear() % 100,
//     currentIndex: 0,
//     length: 8,
//     docId: "",
//     folder: "",
//     status: 1,
//   })

//   useEffect(() => {
//     if (id) {
//       fetchNumbering(Number(id))
//     }
//   }, [id])

//   const fetchNumbering = async (numberingId: number) => {
//     try {
//       setFetchLoading(true)
//       const response = await apiGetNextNumberingById(numberingId)

//       if (response.status === 200 && !Array.isArray(response.data)) {
//         const numbering = response.data as NextNumbering
//         setFormData({
//           id: numbering.id,
//           category: numbering.category,
//           process: numbering.process,
//           year: numbering.year,
//           currentIndex: numbering.currentIndex,
//           length: numbering.length,
//           docId: numbering.docId,
//           folder: numbering.folder,
//           status: numbering.status,
//         })
//       }
//     } catch (error) {
//       toast.push(
//         <Notification title="Error" type="danger">
//           Failed to fetch numbering sequence
//         </Notification>,
//       )
//       navigate("/concepts/next-numbering")
//     } finally {
//       setFetchLoading(false)
//     }
//   }

//   const handleInputChange = (field: keyof UpdateNextNumberingRequest, value: string | number | boolean) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: field === "status" ? (value ? 1 : 0) : value,
//     }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!formData.category || !formData.process || !formData.docId) {
//       toast.push(
//         <Notification title="Validation Error" type="danger">
//           Please fill in all required fields
//         </Notification>,
//       )
//       return
//     }

//     try {
//       setLoading(true)
//       const response = await apiUpdateNextNumbering(formData.id, formData)

//       if (response.status === 200) {
//         toast.push(
//           <Notification title="Success" type="success">
//             Numbering sequence updated successfully
//           </Notification>,
//         )
//         navigate("/concepts/next-numbering")
//       }
//     } catch (error) {
//       toast.push(
//         <Notification title="Error" type="danger">
//           Failed to update numbering sequence
//         </Notification>,
//       )
//     } finally {
//       setLoading(false)
//     }
//   }

//   const generatePreview = () => {
//     if (formData.process && formData.folder && formData.category) {
//       const paddedIndex = String(formData.currentIndex + 1).padStart(formData.length - 6, "0")
//       return `${formData.process}/${formData.folder}/${formData.category}-${formData.year}${paddedIndex}`
//     }
//     return "Preview will appear here..."
//   }

//   if (fetchLoading) {
//     return (
//       <div className="flex items-center justify-center h-80">
//         <div className="animate-spin">
//           <i className="ri-loader-4-line text-2xl" />
//         </div>
//       </div>
//     )
//   }

//   return (
//     <Card>
//       <div className="p-4">
//         <FormContainer onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//             <FormItem label="Document ID *" invalid={!formData.docId} errorMessage="Document ID is required">
//               <Input
//                 value={formData.docId}
//                 onChange={(e) => handleInputChange("docId", e.target.value)}
//                 placeholder="e.g., 00-01"
//               />
//             </FormItem>

//             <FormItem label="Category *" invalid={!formData.category} errorMessage="Category is required">
//               <Input
//                 value={formData.category}
//                 onChange={(e) => handleInputChange("category", e.target.value)}
//                 placeholder="e.g., 01"
//               />
//             </FormItem>

//             <FormItem label="Process *" invalid={!formData.process} errorMessage="Process is required">
//               <Input
//                 value={formData.process}
//                 onChange={(e) => handleInputChange("process", e.target.value)}
//                 placeholder="e.g., RKT"
//               />
//             </FormItem>

//             <FormItem label="Folder">
//               <Input
//                 value={formData.folder}
//                 onChange={(e) => handleInputChange("folder", e.target.value)}
//                 placeholder="e.g., 00"
//               />
//             </FormItem>

//             <FormItem label="Year">
//               <Input
//                 type="number"
//                 value={formData.year}
//                 onChange={(e) => handleInputChange("year", Number(e.target.value) || 0)}
//                 min="0"
//                 max="99"
//               />
//             </FormItem>

//             <FormItem label="Current Index">
//               <Input
//                 type="number"
//                 value={formData.currentIndex}
//                 onChange={(e) => handleInputChange("currentIndex", Number(e.target.value) || 0)}
//                 min="0"
//               />
//             </FormItem>

//             <FormItem label="Total Length">
//               <Input
//                 type="number"
//                 value={formData.length}
//                 onChange={(e) => handleInputChange("length", Number(e.target.value) || 8)}
//                 min="6"
//                 max="20"
//               />
//             </FormItem>

//             <FormItem label="Status">
//               <Switcher checked={formData.status === 1} onChange={(checked) => handleInputChange("status", checked)} />
//               <span className="ml-2">{formData.status === 1 ? "Active" : "Inactive"}</span>
//             </FormItem>
//           </div>

//           <FormItem label="Number Format Preview">
//             <div className="p-3 bg-gray-50 rounded-md font-mono text-sm">{generatePreview()}</div>
//           </FormItem>

//           <div className="flex justify-end gap-2 mt-6">
//             <Button type="button" variant="plain" onClick={() => navigate("/concepts/next-numbering")}>
//               Cancel
//             </Button>
//             <Button type="submit" variant="solid" loading={loading}>
//               {loading ? "Updating..." : "Update Sequence"}
//             </Button>
//           </div>
//         </FormContainer>
//       </div>
//     </Card>
//   )
// }

// export default NextNumberingEdit

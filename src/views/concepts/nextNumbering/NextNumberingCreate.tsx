"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Button from "@/components/ui/Button"
import Card from "@/components/ui/Card"
import Input from "@/components/ui/Input"
import Select from "@/components/ui/Select"
import { FormItem } from "@/components/ui/Form"
import { Notification } from "@/components/ui/Notification"
import Switcher from "@/components/ui/Switcher"
import { apiCreateNextNumbering } from "@/services/NextNumberingService"
import { apiGetFolders } from "@/services/FileService"
import type { CreateNextNumberingRequest } from "@/@types/next-numbering"
import { toast } from "@/components/ui"

interface FolderOption {
  value: string
  label: string
  code: string
}

interface CategoryOption {
  value: string
  label: string
  code: string
}

const NextNumberingCreate = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [foldersLoading, setFoldersLoading] = useState(false)
  const [folders, setFolders] = useState<FolderOption[]>([])
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [selectedFolder, setSelectedFolder] = useState<FolderOption | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption | null>(null)
  const [formData, setFormData] = useState<CreateNextNumberingRequest>({
    category: "",
    process: "",
    year: new Date().getFullYear() % 100,
    currentIndex: 0,
    length: 8,
    docId: "",
    folder: "",
    status: 1,
  })

  // Fetch folders on component mount
  useEffect(() => {
    fetchFolders()
  }, [])

  // Update categories when folder changes
  useEffect(() => {
    if (selectedFolder) {
      setFormData((prev) => ({
        ...prev,
        folder: selectedFolder.code, // Use directory code for form submission
      }))
    }
  }, [selectedFolder])

  const fetchFolders = async () => {
    setFoldersLoading(true)
    try {
      console.log("🔄 Fetching folders...")

      // Use the same approach as RolesSection - authenticated API call
      const response = await apiGetFolders<any, any>({
        sortBy: "code",
        sortDir: "asc",
        page: 0,
        size: 100,
      })

      console.log("📥 Folders API Response:", response)

      if (response?.data?.content && Array.isArray(response.data.content)) {
        const folderList = response.data.content
          .filter((item: any) => item.fileType === "directory")
          .map((item: any) => ({
            value: item.id.toString(),
            label: item.name, // Show directory name in dropdown
            code: item.code || "", // Use directory code for form submission
            categories: item.categories || [],
          }))

        console.log("📁 Processed folders:", folderList)
        setFolders(folderList)
      }
    } catch (error) {
      console.error("❌ Error fetching folders:", error)
      toast.push(
        <Notification title="Error" type="danger">
          Failed to fetch folders
        </Notification>,
      )
    } finally {
      setFoldersLoading(false)
    }
  }

  // Helper function to extract code after hyphen
  const extractCategoryCode = (categoryName: string): string => {
    // Find the last hyphen and extract everything after it
    const lastHyphenIndex = categoryName.lastIndexOf("-")
    if (lastHyphenIndex !== -1 && lastHyphenIndex < categoryName.length - 1) {
      return categoryName.substring(lastHyphenIndex + 1)
    }
    // If no hyphen or nothing after hyphen, return the full name
    return categoryName
  }

  const handleFolderChange = (selectedOption: FolderOption | null) => {
    console.log("📁 Folder selected:", selectedOption)
    setSelectedFolder(selectedOption)

    if (selectedOption) {
      // Find the full folder data to get categories
      const fullFolderData = folders.find((f) => f.value === selectedOption.value)
      if (fullFolderData && (fullFolderData as any).categories) {
        const categoryOptions = (fullFolderData as any).categories.map((cat: any) => {
          const categoryCode = extractCategoryCode(cat.name)
          return {
            value: cat.id.toString(),
            label: cat.name, // Show full category name in dropdown
            code: categoryCode, // Use only the part after hyphen for form submission
          }
        })
        console.log("📂 Categories for folder:", categoryOptions)
        setCategories(categoryOptions)
      } else {
        setCategories([])
      }

      // Reset category when folder changes
      setSelectedCategory(null)
      setFormData((prev) => ({
        ...prev,
        category: "",
        folder: selectedOption.code, // Store directory code
      }))
    } else {
      setCategories([])
      setSelectedCategory(null)
      setFormData((prev) => ({
        ...prev,
        category: "",
        folder: "",
      }))
    }
  }

  const handleCategoryChange = (selectedOption: CategoryOption | null) => {
    console.log("📂 Category selected:", selectedOption)
    setSelectedCategory(selectedOption)
    setFormData((prev) => ({
      ...prev,
      category: selectedOption?.code || "", // Use code after hyphen
    }))
  }

  const handleInputChange = (field: keyof CreateNextNumberingRequest, value: string | number | boolean) => {
    // Only log for non-trivial changes, not every keystroke
    if (field === "process" || field === "docId") {
      // Don't log every character typed
    } else {
      console.log(`🔄 Form field changed: ${field} = ${value}`)
    }
    setFormData((prev) => ({
      ...prev,
      [field]: field === "status" ? (value ? 1 : 0) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("🚀 Form submitted!")
    console.log("📝 Form data:", formData)

    if (!formData.category || !formData.process || !formData.docId || !formData.folder) {
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
      console.log("📤 Sending API request to create numbering sequence...")
      console.log("📤 Payload:", JSON.stringify(formData, null, 2))

      const response = await apiCreateNextNumbering(formData)
      console.log("📥 API Response:", response)

      if (response.status === 200) {
        console.log("✅ Successfully created numbering sequence")
        toast.push(
          <Notification title="Success" type="success">
            Numbering sequence created successfully
          </Notification>,
        )
        navigate("/concepts/next-numbering")
      } else {
        console.log("⚠️ Unexpected response status:", response.status)
      }
    } catch (error) {
      console.error("❌ Error creating numbering sequence:", error)
      toast.push(
        <Notification title="Error" type="danger">
          Failed to create numbering sequence
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

  return (
    <Card>
      <div className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FormItem label="Folder *" invalid={!formData.folder} errorMessage="Folder is required">
              <Select
                placeholder="Select Folder"
                options={folders}
                value={selectedFolder}
                onChange={handleFolderChange}
                isLoading={foldersLoading}
                noOptionsMessage={() => (foldersLoading ? "Loading folders..." : "No folders available")}
              />
            </FormItem>

            <FormItem label="Category *" invalid={!formData.category} errorMessage="Category is required">
              <Select
                placeholder="Select Category"
                options={categories}
                value={selectedCategory}
                onChange={handleCategoryChange}
                isDisabled={!selectedFolder}
                noOptionsMessage={() => "No categories available"}
              />
            </FormItem>

            <FormItem label="Process *" invalid={!formData.process} errorMessage="Process is required">
              <Input
                value={formData.process}
                onChange={(e) => handleInputChange("process", e.target.value)}
                placeholder="e.g., RKT"
              />
            </FormItem>

            <FormItem label="Document ID *" invalid={!formData.docId} errorMessage="Document ID is required">
              <Input
                value={formData.docId}
                onChange={(e) => handleInputChange("docId", e.target.value)}
                placeholder="e.g., 00-01"
              />
            </FormItem>

            <FormItem label="Year">
              <Input type="number" value={formData.year} disabled className="bg-gray-100" />
            </FormItem>

            <FormItem label="Total Length">
              <Input type="number" value={formData.length} disabled className="bg-gray-100" />
            </FormItem>

            <FormItem label="Starting Index">
              <Input type="number" disabled value={formData.currentIndex} className="bg-gray-100" />
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
            <div className="p-3 bg-gray-50 rounded-md font-mono text-sm border">{generatePreview()}</div>
          </FormItem>

          {/* Debug info - remove in production */}
          <div className="mt-2 text-xs text-gray-500">
            Debug: {folders.length} folders loaded | Selected folder code: {formData.folder} | Selected category code:{" "}
            {formData.category}
            {selectedCategory && (
              <span>
                {" "}
                | Category display: "{selectedCategory.label}" → Code: "{selectedCategory.code}"
              </span>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="plain" onClick={() => navigate("/concepts/next-numbering")}>
              Cancel
            </Button>
            <Button type="submit" variant="solid" loading={loading}>
              {loading ? "Creating..." : "Create Sequence"}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  )
}

export default NextNumberingCreate


// "use client"

// import type React from "react"
// import { useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import Button from "@/components/ui/Button"
// import Card from "@/components/ui/Card"
// import Input from "@/components/ui/Input"
// import Select from "@/components/ui/Select"
// import { FormItem } from "@/components/ui/Form"
// import { Notification } from "@/components/ui/Notification"
// import Switcher from "@/components/ui/Switcher"
// import { apiCreateNextNumbering } from "@/services/NextNumberingService"
// import { apiGetFolders } from "@/services/FileService"
// import type { CreateNextNumberingRequest } from "@/@types/next-numbering"
// import { toast } from "@/components/ui"

// interface FolderOption {
//   value: string
//   label: string
//   code: string
// }

// interface CategoryOption {
//   value: string
//   label: string
//   code: string
// }

// const NextNumberingCreate = () => {
//   const navigate = useNavigate()
//   const [loading, setLoading] = useState(false)
//   const [foldersLoading, setFoldersLoading] = useState(false)
//   const [folders, setFolders] = useState<FolderOption[]>([])
//   const [categories, setCategories] = useState<CategoryOption[]>([])
//   const [selectedFolder, setSelectedFolder] = useState<FolderOption | null>(null)
//   const [selectedCategory, setSelectedCategory] = useState<CategoryOption | null>(null)
//   const [formData, setFormData] = useState<CreateNextNumberingRequest>({
//     category: "",
//     process: "",
//     year: new Date().getFullYear() % 100,
//     currentIndex: 0,
//     length: 8,
//     docId: "",
//     folder: "",
//     status: 1,
//   })

//   // Fetch folders on component mount
//   useEffect(() => {
//     fetchFolders()
//   }, [])

//   // Update categories when folder changes
//   useEffect(() => {
//     if (selectedFolder) {
//       setFormData((prev) => ({
//         ...prev,
//         folder: selectedFolder.code, // Use directory code for form submission
//       }))
//     }
//   }, [selectedFolder])

//   const fetchFolders = async () => {
//     setFoldersLoading(true)
//     try {
//       console.log("🔄 Fetching folders...")

//       // Use the same approach as RolesSection - authenticated API call
//       const response = await apiGetFolders<any, any>({
//         sortBy: "code",
//         sortDir: "asc",
//         page: 0,
//         size: 100,
//       })

//       console.log("📥 Folders API Response:", response)

//       if (response?.data?.content && Array.isArray(response.data.content)) {
//         const folderList = response.data.content
//           .filter((item: any) => item.fileType === "directory")
//           .map((item: any) => ({
//             value: item.id.toString(),
//             label: item.name, // Show directory name in dropdown
//             code: item.code || "", // Use directory code for form submission
//             categories: item.categories || [],
//           }))

//         console.log("📁 Processed folders:", folderList)
//         setFolders(folderList)
//       }
//     } catch (error) {
//       console.error("❌ Error fetching folders:", error)
//       toast.push(
//         <Notification title="Error" type="danger">
//           Failed to fetch folders
//         </Notification>,
//       )
//     } finally {
//       setFoldersLoading(false)
//     }
//   }

//   // Helper function to extract code after hyphen
//   const extractCategoryCode = (categoryName: string): string => {
//     // Find the last hyphen and extract everything after it
//     const lastHyphenIndex = categoryName.lastIndexOf("-")
//     if (lastHyphenIndex !== -1 && lastHyphenIndex < categoryName.length - 1) {
//       return categoryName.substring(lastHyphenIndex + 1)
//     }
//     // If no hyphen or nothing after hyphen, return the full name
//     return categoryName
//   }

//   const handleFolderChange = (selectedOption: FolderOption | null) => {
//     console.log("📁 Folder selected:", selectedOption)
//     setSelectedFolder(selectedOption)

//     if (selectedOption) {
//       // Find the full folder data to get categories
//       const fullFolderData = folders.find((f) => f.value === selectedOption.value)
//       if (fullFolderData && (fullFolderData as any).categories) {
//         const categoryOptions = (fullFolderData as any).categories.map((cat: any) => {
//           const categoryCode = extractCategoryCode(cat.name)
//           return {
//             value: cat.id.toString(),
//             label: cat.name, // Show full category name in dropdown
//             code: categoryCode, // Use only the part after hyphen for form submission
//           }
//         })
//         console.log("📂 Categories for folder:", categoryOptions)
//         setCategories(categoryOptions)
//       } else {
//         setCategories([])
//       }

//       // Reset category when folder changes
//       setSelectedCategory(null)
//       setFormData((prev) => ({
//         ...prev,
//         category: "",
//         folder: selectedOption.code, // Store directory code
//       }))
//     } else {
//       setCategories([])
//       setSelectedCategory(null)
//       setFormData((prev) => ({
//         ...prev,
//         category: "",
//         folder: "",
//       }))
//     }
//   }

//   const handleCategoryChange = (selectedOption: CategoryOption | null) => {
//     console.log("📂 Category selected:", selectedOption)
//     setSelectedCategory(selectedOption)
//     setFormData((prev) => ({
//       ...prev,
//       category: selectedOption?.code || "", // Use code after hyphen
//     }))
//   }

//   const handleInputChange = (field: keyof CreateNextNumberingRequest, value: string | number | boolean) => {
//     console.log(`🔄 Form field changed: ${field} = ${value}`)
//     setFormData((prev) => ({
//       ...prev,
//       [field]: field === "status" ? (value ? 1 : 0) : value,
//     }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     console.log("🚀 Form submitted!")
//     console.log("📝 Form data:", formData)

//     if (!formData.category || !formData.process || !formData.docId || !formData.folder) {
//       console.log("❌ Validation failed - missing required fields")
//       toast.push(
//         <Notification title="Validation Error" type="danger">
//           Please fill in all required fields
//         </Notification>,
//       )
//       return
//     }

//     try {
//       setLoading(true)
//       console.log("📤 Sending API request to create numbering sequence...")
//       console.log("📤 Payload:", JSON.stringify(formData, null, 2))

//       const response = await apiCreateNextNumbering(formData)
//       console.log("📥 API Response:", response)

//       if (response.status === 200) {
//         console.log("✅ Successfully created numbering sequence")
//         toast.push(
//           <Notification title="Success" type="success">
//             Numbering sequence created successfully
//           </Notification>,
//         )
//         navigate("/concepts/next-numbering")
//       } else {
//         console.log("⚠️ Unexpected response status:", response.status)
//       }
//     } catch (error) {
//       console.error("❌ Error creating numbering sequence:", error)
//       toast.push(
//         <Notification title="Error" type="danger">
//           Failed to create numbering sequence
//         </Notification>,
//       )
//     } finally {
//       setLoading(false)
//     }
//   }

//   const generatePreview = () => {
//     if (formData.process && formData.folder && formData.category) {
//       return `${formData.process}/${formData.folder}/${formData.category}`
//     }
//     return "Process/Folder/Category"
//   }

//   console.log("🎨 Rendering NextNumberingCreate component")
//   console.log("📊 Current form data:", formData)
//   console.log("📁 Available folders:", folders)
//   console.log("📂 Available categories:", categories)

//   return (
//     <Card>
//       <div className="p-4">
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//             <FormItem label="Folder *" invalid={!formData.folder} errorMessage="Folder is required">
//               <Select
//                 placeholder="Select Folder"
//                 options={folders}
//                 value={selectedFolder}
//                 onChange={handleFolderChange}
//                 isLoading={foldersLoading}
//                 noOptionsMessage={() => (foldersLoading ? "Loading folders..." : "No folders available")}
//               />
//             </FormItem>

//             <FormItem label="Category *" invalid={!formData.category} errorMessage="Category is required">
//               <Select
//                 placeholder="Select Category"
//                 options={categories}
//                 value={selectedCategory}
//                 onChange={handleCategoryChange}
//                 isDisabled={!selectedFolder}
//                 noOptionsMessage={() => "No categories available"}
//               />
//             </FormItem>

//             <FormItem label="Process *" invalid={!formData.process} errorMessage="Process is required">
//               <Input
//                 value={formData.process}
//                 onChange={(e) => handleInputChange("process", e.target.value)}
//                 placeholder="e.g., RKT"
//               />
//             </FormItem>

//             <FormItem label="Document ID *" invalid={!formData.docId} errorMessage="Document ID is required">
//               <Input
//                 value={formData.docId}
//                 onChange={(e) => handleInputChange("docId", e.target.value)}
//                 placeholder="e.g., 00-01"
//               />
//             </FormItem>

//             <FormItem label="Year">
//               <Input type="number" value={formData.year} disabled className="bg-gray-100" />
//             </FormItem>

//             <FormItem label="Total Length">
//               <Input type="number" value={formData.length} disabled className="bg-gray-100" />
//             </FormItem>

//             <FormItem label="Starting Index">
//               <Input type="number" disabled value={formData.currentIndex} className="bg-gray-100" />
//             </FormItem>

//             <FormItem label="Status">
//               <div className="flex items-center gap-2">
//                 <Switcher
//                   checked={formData.status === 1}
//                   onChange={(checked) => handleInputChange("status", checked)}
//                 />
//                 <span>{formData.status === 1 ? "Active" : "Inactive"}</span>
//               </div>
//             </FormItem>
//           </div>

//           <FormItem label="Number Format Preview">
//             <div className="p-3 bg-gray-50 rounded-md font-mono text-sm border">{generatePreview()}</div>
//           </FormItem>

//           {/* Debug info - remove in production */}
//           <div className="mt-2 text-xs text-gray-500">
//             Debug: {folders.length} folders loaded | Selected folder code: {formData.folder} | Selected category code:{" "}
//             {formData.category}
//             {selectedCategory && (
//               <span>
//                 {" "}
//                 | Category display: "{selectedCategory.label}" → Code: "{selectedCategory.code}"
//               </span>
//             )}
//           </div>

//           <div className="flex justify-end gap-2 mt-6">
//             <Button type="button" variant="plain" onClick={() => navigate("/concepts/next-numbering")}>
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               variant="solid"
//               loading={loading}
//               onClick={(e) => {
//                 console.log("🖱️ Create button clicked!")
//               }}
//             >
//               {loading ? "Creating..." : "Create Sequence"}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </Card>
//   )
// }

// export default NextNumberingCreate


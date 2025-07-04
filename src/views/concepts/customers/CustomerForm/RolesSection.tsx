"use client"

import { useEffect, useState } from "react"
import Card from "@/components/ui/Card"
import Select from "@/components/ui/Select"
import { FormItem } from "@/components/ui/Form"
import { Controller, useWatch } from "react-hook-form"
import type { FormSectionBaseProps } from "./types"
import { apiGetFolders } from "@/services/FileService"

type RolesSectionProps = FormSectionBaseProps & {
  directories?: { id: number; label: string }[]
  setValue: (name: string, value: unknown) => void
}

const roleOptions = [
  { value: "USER", label: "User" },
  { value: "ADMIN", label: "Admin" },
]

const RolesSection = ({ control, errors, directories = [], setValue }: RolesSectionProps) => {
  const [loading, setLoading] = useState(false)
  const [availableDirectories, setAvailableDirectories] = useState<{ id: number; label: string }[]>(directories)

  const watchedRoles = useWatch({
    control,
    name: "roles",
  })

  // Fetch all directories using the authenticated API service
  useEffect(() => {
    const fetchAllDirectories = async () => {
      if (availableDirectories.length === 0) {
        setLoading(true)
        try {
          // Use the apiGetFolders function which handles authentication
          const response = await apiGetFolders<any, any>({
            sortBy: "code",
            sortDir: "asc",
            page: 0,
            size: 100,
          })

          console.log("Directory API Response:", response)

          if (response?.data?.content && Array.isArray(response.data.content)) {
            const folderList = response.data.content
              .filter((item: any) => item.fileType === "directory")
              .map((item: any) => ({
                id: Number(item.id),
                label: item.name || "Unnamed Directory",
              }))

            console.log("Fetched directories:", folderList)
            setAvailableDirectories(folderList)

            // If admin role is already selected, auto-assign all directories
            if (watchedRoles?.includes("ADMIN")) {
              const allDirectoryIds = folderList.map((dir) => dir.id)
              setValue("projectFileIds", allDirectoryIds)
            }
          }
        } catch (error) {
          console.error("Failed to fetch directories:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchAllDirectories()
  }, [availableDirectories.length, watchedRoles, setValue])

  // Auto-assign all directories when admin role is selected
  useEffect(() => {
    if (watchedRoles?.includes("ADMIN") && availableDirectories.length > 0) {
      const allDirectoryIds = availableDirectories.map((dir) => dir.id)
      setValue("projectFileIds", allDirectoryIds)
    }
  }, [watchedRoles, availableDirectories, setValue])

  return (
    <Card>
      <h4 className="mb-6">Access Rights</h4>

      <FormItem label="Select Role" invalid={Boolean(errors.roles)} errorMessage={errors.roles?.message} required>
        <Controller
          name="roles"
          control={control}
          render={({ field }) => (
            <Select
              options={roleOptions}
              placeholder="Select Role"
              value={roleOptions.find((option) => field.value?.includes(option.value)) || null}
              onChange={(selectedOption) => {
                const value = selectedOption ? [selectedOption.value] : []
                field.onChange(value)

                if (selectedOption?.value === "ADMIN") {
                  const allDirectoryIds = availableDirectories.map((dir) => dir.id)
                  setValue("projectFileIds", allDirectoryIds)
                } else {
                  setValue("projectFileIds", [])
                }
              }}
              isLoading={loading}
            />
          )}
        />
      </FormItem>

      <FormItem
        label="Assign Directory"
        invalid={Boolean(errors.projectFileIds)}
        errorMessage={errors.projectFileIds?.message}
        required={watchedRoles?.includes("USER")}
      >
        <Controller
          name="projectFileIds"
          control={control}
          rules={{
            validate: (value) => {
              if (watchedRoles?.includes("USER") && (!value || value.length === 0)) {
                return "Assign Directory is required for User role."
              }
              return true
            },
          }}
          render={({ field }) => {
            const options = availableDirectories.map((dir) => ({
              value: dir.id,
              label: dir.label,
            }))

            const isAdminSelected = watchedRoles?.includes("ADMIN")

            return (
              <Select
                isMulti
                placeholder={isAdminSelected ? "All directories assigned (Admin access)" : "Select Directory"}
                options={options}
                value={options.filter((option) => (field.value || []).includes(option.value))}
                onChange={(selected) => {
                  if (!isAdminSelected) {
                    const values = selected?.map((option) => option.value) || []
                    field.onChange(values)
                  }
                }}
                isDisabled={isAdminSelected}
                className={isAdminSelected ? "opacity-75" : ""}
                isLoading={loading}
                noOptionsMessage={() => (loading ? "Loading directories..." : "No directories available")}
              />
            )
          }}
        />
      </FormItem>

      {watchedRoles?.includes("ADMIN") && (
        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          <i className="ri-information-line mr-1"></i>
          Admin role has access to all directories automatically.
        </div>
      )}

      {/* Debug info - remove in production */}
      <div className="mt-2 text-xs text-gray-500">Debug: {availableDirectories.length} directories loaded</div>
    </Card>
  )
}

export default RolesSection


// "use client"

// import { useEffect, useState } from "react"
// import Card from "@/components/ui/Card"
// import Select from "@/components/ui/Select"
// import { FormItem } from "@/components/ui/Form"
// import { Controller, useWatch } from "react-hook-form"
// import type { FormSectionBaseProps } from "./types"
// import { apiGetFolders } from "@/services/FileService"
// import axios from "axios"

// type RolesSectionProps = FormSectionBaseProps & {
//   directories?: { id: number; label: string }[]
//   setValue: (name: string, value: unknown) => void
// }

// const roleOptions = [
//   { value: "USER", label: "User" },
//   { value: "ADMIN", label: "Admin" },
// ]

// const RolesSection = ({ control, errors, directories = [], setValue }: RolesSectionProps) => {
//   const [loading, setLoading] = useState(false)
//   const [availableDirectories, setAvailableDirectories] = useState<{ id: number; label: string }[]>(directories)

//   const watchedRoles = useWatch({
//     control,
//     name: "roles",
//   })

//   useEffect(() => {
//     const fetchAllDirectories = async () => {
//       if (availableDirectories.length === 0) {
//         setLoading(true)
//         try {
//           const response = await axios.get(
//             "http://192.168.0.28:8050/dms/project-files?sortBy=code&sortDir=asc&page=0&size=100",
//           )
//           console.log("Directory API Response:", response)

//           if (response?.data?.data?.content && Array.isArray(response.data.data.content)) {
//             const folderList = response.data.data.content
//               .filter((item: any) => item.fileType === "directory")
//               .map((item: any) => ({
//                 id: Number(item.id),
//                 label: item.name || "Unnamed Directory",
//               }))

//             console.log("Fetched directories:", folderList)
//             setAvailableDirectories(folderList)

//             if (watchedRoles?.includes("ADMIN")) {
//               const allDirectoryIds = folderList.map((dir) => dir.id)
//               setValue("projectFileIds", allDirectoryIds)
//             }
//           }
//         } catch (error) {
//           console.error("Failed to fetch directories:", error)

//           try {
//             const fallbackResponse = await apiGetFolders<any, any>({
//               sortBy: "code",
//               sortDir: "asc",
//               page: 0,
//               size: 100,
//             })

//             if (fallbackResponse?.data?.content && Array.isArray(fallbackResponse.data.content)) {
//               const folderList = fallbackResponse.data.content
//                 .filter((item: any) => item.fileType === "directory")
//                 .map((item: any) => ({
//                   id: Number(item.id),
//                   label: item.name || "Unnamed Directory",
//                 }))

//               console.log("Fallback directories:", folderList)
//               setAvailableDirectories(folderList)
//             }
//           } catch (fallbackError) {
//             console.error("Fallback fetch also failed:", fallbackError)
//           }
//         } finally {
//           setLoading(false)
//         }
//       }
//     }

//     fetchAllDirectories()
//   }, [availableDirectories.length, watchedRoles, setValue])

//   useEffect(() => {
//     console.log("Directories passed to RolesSection:", availableDirectories)
//     if (watchedRoles?.includes("ADMIN") && availableDirectories.length > 0) {
//       const allDirectoryIds = availableDirectories.map((dir) => dir.id)
//       setValue("projectFileIds", allDirectoryIds)
//     }
//   }, [watchedRoles, availableDirectories, setValue])

//   return (
//     <Card>
//       <h4 className="mb-6">Access Rights</h4>

//       <FormItem label="Select Role" invalid={Boolean(errors.roles)} errorMessage={errors.roles?.message} required>
//         <Controller
//           name="roles"
//           control={control}
//           render={({ field }) => (
//             <Select
//               options={roleOptions}
//               placeholder="Select Role"
//               value={roleOptions.find((option) => field.value?.includes(option.value)) || null}
//               onChange={(selectedOption) => {
//                 const value = selectedOption ? [selectedOption.value] : []
//                 field.onChange(value)

//                 if (selectedOption?.value === "ADMIN") {
//                   const allDirectoryIds = availableDirectories.map((dir) => dir.id)
//                   setValue("projectFileIds", allDirectoryIds)
//                 } else {
//                   setValue("projectFileIds", [])
//                 }
//               }}
//               isLoading={loading}
//             />
//           )}
//         />
//       </FormItem>

//       <FormItem
//         label="Assign Directory"
//         invalid={Boolean(errors.projectFileIds)}
//         errorMessage={errors.projectFileIds?.message}
//         required={watchedRoles?.includes("USER")}
//       >
//         <Controller
//           name="projectFileIds"
//           control={control}
//           rules={{
//             validate: (value) => {
//               if (watchedRoles?.includes("USER") && (!value || value.length === 0)) {
//                 return "Assign Directory is required for User role."
//               }
//               return true
//             },
//           }}
//           render={({ field }) => {
//             const options = availableDirectories.map((dir) => ({
//               value: dir.id,
//               label: dir.label,
//             }))

//             const isAdminSelected = watchedRoles?.includes("ADMIN")

//             return (
//               <Select
//                 isMulti
//                 placeholder={isAdminSelected ? "All directories assigned (Admin access)" : "Select Directory"}
//                 options={options}
//                 value={options.filter((option) => (field.value || []).includes(option.value))}
//                 onChange={(selected) => {
//                   if (!isAdminSelected) {
//                     const values = selected?.map((option) => option.value) || []
//                     field.onChange(values)
//                   }
//                 }}
//                 isDisabled={isAdminSelected}
//                 className={isAdminSelected ? "opacity-75" : ""}
//                 isLoading={loading}
//                 noOptionsMessage={() => (loading ? "Loading directories..." : "No directories available")}
//               />
//             )
//           }}
//         />
//       </FormItem>

//       {watchedRoles?.includes("ADMIN") && (
//         <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
//           <i className="ri-information-line mr-1"></i>
//           Admin role has access to all directories automatically.
//         </div>
//       )}

//       {/* Debug info - remove in production */}
//       <div className="mt-2 text-xs text-gray-500">Debug: {availableDirectories.length} directories loaded</div>
//     </Card>
//   )
// }

// export default RolesSection

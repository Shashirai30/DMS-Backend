"use client"

import { useEffect } from "react"
import { Form } from "@/components/ui/Form"
import Container from "@/components/shared/Container"
import BottomStickyBar from "@/components/template/BottomStickyBar"
import OverviewSection from "./OverviewSection"
import ProfileImageSection from "./ProfileImageSection"
import AccountSection from "./AccountSection"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { ZodType } from "zod"
import type { CommonProps } from "@/@types/common"
import type { CustomerFormSchema } from "./types"
import { useForm } from "react-hook-form"
import RolesSection from "./RolesSection"
import { useFileManagerStore } from "../../files/FolderManager/store/useFolderManagerStore"

type CustomerFormProps = {
  onFormSubmit: (values: CustomerFormSchema) => void
  defaultValues?: Partial<CustomerFormSchema>
  newCustomer?: boolean
} & CommonProps

const validationSchema: ZodType<CustomerFormSchema> = z
  .object({
    firstName: z.string().min(1, { message: "First name required" }),
    lastName: z.string().min(1, { message: "Last name required" }),
    empCode: z.string().min(1, { message: "Employee code required" }),
    email: z.string().min(1, { message: "Email required" }).email({ message: "Invalid email" }),
    phoneNumber: z.string().min(1, { message: "Phone number required" }),
    status: z.enum(["ACTIVE", "INACTIVE"]),
    image: z.string().optional(),
    roles: z.array(z.string()).min(1, { message: "At least one role is required" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    projectFileIds: z.array(z.number()),
  })
  .refine(
    (data) => {
      // Only require directories for USER role
      const isUser = data.roles?.includes("USER")
      const hasDirs = data.projectFileIds?.length > 0
      return !isUser || hasDirs
    },
    {
      message: "At least one directory is required for User role",
      path: ["projectFileIds"],
    },
  )

const CustomerForm = (props: CustomerFormProps) => {
  const { onFormSubmit, defaultValues = {}, newCustomer = false, children } = props

  // Get directories from store
  const directories = useFileManagerStore((state) => state.directories)

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    control,
  } = useForm<CustomerFormSchema>({
    defaultValues: {
      status: "ACTIVE",
      roles: [],
      image: "",
      projectFileIds: [],
      ...defaultValues,
    },
    resolver: zodResolver(validationSchema),
  })

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues)
    }
  }, [JSON.stringify(defaultValues), reset])

  const onSubmit = (values: CustomerFormSchema) => {
    const payload = {
      ...values,
      emailVerified: true,
    }
    onFormSubmit?.(payload)
  }

  // Convert directory IDs to numbers for the form
  const directoriesWithNumberIds = directories.map((dir) => ({
    id: Number(dir.id),
    label: dir.label,
  }))

  return (
    <Form
      className="flex w-full h-full"
      containerClassName="flex flex-col w-full justify-between"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Container>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="gap-4 flex flex-col flex-auto">
            <OverviewSection newCustomer={newCustomer} control={control} errors={errors} />
            <RolesSection
              newCustomer={newCustomer}
              control={control}
              errors={errors}
              directories={directoriesWithNumberIds}
              setValue={setValue}
            />
          </div>
          <div className="md:w-[370px] gap-4 flex flex-col">
            <ProfileImageSection newCustomer={newCustomer} control={control} errors={errors} />
            {!newCustomer && <AccountSection newCustomer={newCustomer} control={control} errors={errors} />}
          </div>
        </div>
      </Container>
      <BottomStickyBar>{children}</BottomStickyBar>
    </Form>
  )
}

export default CustomerForm


// "use client"

// import { useEffect, useState } from "react"
// import { Form } from "@/components/ui/Form"
// import Container from "@/components/shared/Container"
// import BottomStickyBar from "@/components/template/BottomStickyBar"
// import OverviewSection from "./OverviewSection"
// import ProfileImageSection from "./ProfileImageSection"
// import AccountSection from "./AccountSection"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { z } from "zod"
// import type { ZodType } from "zod"
// import type { CommonProps } from "@/@types/common"
// import type { CustomerFormSchema } from "./types"
// import { useForm } from "react-hook-form"
// import RolesSection from "./RolesSection"
// import { useFileManagerStore } from "../../files/FolderManager/store/useFolderManagerStore"
// import { apiGetFolders } from "@/services/FileService"

// type CustomerFormProps = {
//   onFormSubmit: (values: CustomerFormSchema) => void
//   defaultValues?: Partial<CustomerFormSchema>
//   newCustomer?: boolean
// } & CommonProps

// const validationSchema: ZodType<CustomerFormSchema> = z
//   .object({
//     firstName: z.string().min(1, { message: "First name required" }),
//     lastName: z.string().min(1, { message: "Last name required" }),
//     empCode: z.string().min(1, { message: "Employee code required" }),
//     email: z.string().min(1, { message: "Email required" }).email({ message: "Invalid email" }),
//     phoneNumber: z.string().min(1, { message: "Phone number required" }),
//     status: z.enum(["ACTIVE", "INACTIVE"]),
//     image: z.string().optional(),
//     roles: z.array(z.string()).min(1, { message: "At least one role is required" }),
//     password: z.string().min(8, { message: "Password must be at least 8 characters" }),
//     projectFileIds: z.array(z.number()),
//   })
//   .refine(
//     (data) => {
//       // Only require directories for USER role
//       const isUser = data.roles?.includes("USER")
//       const hasDirs = data.projectFileIds?.length > 0
//       return !isUser || hasDirs
//     },
//     {
//       message: "At least one directory is required for User role",
//       path: ["projectFileIds"],
//     },
//   )

// const CustomerForm = (props: CustomerFormProps) => {
//   const { onFormSubmit, defaultValues = {}, newCustomer = false, children } = props

//   // Get directories from store, but also fetch them if needed
//   const { directories, setDirectories } = useFileManagerStore()
//   const [localDirectories, setLocalDirectories] = useState<{ id: number; label: string }[]>([])

//   const {
//     handleSubmit,
//     reset,
//     setValue,
//     formState: { errors },
//     control,
//   } = useForm<CustomerFormSchema>({
//     defaultValues: {
//       status: "ACTIVE",
//       roles: [],
//       image: "",
//       projectFileIds: [],
//       ...defaultValues,
//     },
//     resolver: zodResolver(validationSchema),
//   })

//   // Fetch directories and update both local state and store
//   useEffect(() => {
//     const fetchDirectories = async () => {
//       if (directories.length === 0 && localDirectories.length === 0) {
//         try {
//           // Try the old format first (for backward compatibility)
//           const response = await apiGetFolders<{ data: any[] }, {}>({})
//           if (response?.data) {
//             const folderList = response.data
//               .filter((item: any) => item.fileType === "directory")
//               .map((item: any) => ({
//                 id: Number(item.id),
//                 label: item.name || "Unnamed Directory",
//               }))

//             setLocalDirectories(folderList)
//             // Also update the store
//             setDirectories(folderList.map((dir) => ({ id: dir.id.toString(), label: dir.label })))
//           }
//         } catch (error) {
//           console.error("Failed to fetch directories in CustomerForm:", error)
//         }
//       } else if (directories.length > 0) {
//         // Convert store directories to local format
//         const converted = directories.map((dir) => ({
//           id: Number(dir.id),
//           label: dir.label,
//         }))
//         setLocalDirectories(converted)
//       }
//     }

//     fetchDirectories()
//   }, [directories.length, localDirectories.length, setDirectories])

//   useEffect(() => {
//     if (defaultValues) {
//       reset(defaultValues)
//     }
//   }, [JSON.stringify(defaultValues), reset])

//   const onSubmit = (values: CustomerFormSchema) => {
//     const payload = {
//       ...values,
//       emailVerified: true,
//     }
//     onFormSubmit?.(payload)
//   }

//   return (
//     <Form
//       className="flex w-full h-full"
//       containerClassName="flex flex-col w-full justify-between"
//       onSubmit={handleSubmit(onSubmit)}
//     >
//       <Container>
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="gap-4 flex flex-col flex-auto">
//             <OverviewSection newCustomer={newCustomer} control={control} errors={errors} />
//             <RolesSection
//               newCustomer={newCustomer}
//               control={control}
//               errors={errors}
//               directories={localDirectories}
//               setValue={setValue}
//             />
//           </div>
//           <div className="md:w-[370px] gap-4 flex flex-col">
//             <ProfileImageSection newCustomer={newCustomer} control={control} errors={errors} />
//             {!newCustomer && <AccountSection newCustomer={newCustomer} control={control} errors={errors} />}
//           </div>
//         </div>
//       </Container>
//       <BottomStickyBar>{children}</BottomStickyBar>
//     </Form>
//   )
// }

// export default CustomerForm


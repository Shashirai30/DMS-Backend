
import ApiService from "./ApiService"

//<+++++++++++++++++++++++++++++++++Api Get Files for taemp ++++++++++++++++++++++++++++++++++++++++>

export async function apiGetFiles<T, U extends Record<string, unknown>>(params: U) {
  return ApiService.fetchDataWithAxios<T>({
    url: "/api/files",
    method: "get",
    params,
  })
}

//<+++++++++++++++++++++++++++++++++Api Gets Folder ++++++++++++++++++++++++++++++++++++++++>
export async function apiGetFolders<T, U extends Record<string, unknown>>(params: U) {
  // Apply default pagination values
  const baseParams = {
    page: 0,
    size: 10,
    ...params,
  };

  // Handle array parameters manually for proper serialization
  if (baseParams.ids && Array.isArray(baseParams.ids)) {
    const queryParams = baseParams.ids.map((id) => `ids=${id}`).join("&");
    const url = `/project-files?${queryParams}`;

    // Remove ids from params to avoid double serialization
    const { ids, ...otherParams } = baseParams;

    return ApiService.backendApiWithAxios<T>({
      url,
      method: "get",
      params: otherParams, // Includes pagination and other params
    });
  }

  return ApiService.backendApiWithAxios<T>({
    url: "/project-files",
    method: "get",
    params: baseParams, // Includes pagination params
  });
}
//<+++++++++++++++++++++++++++++++++Api Gets Files ++++++++++++++++++++++++++++++++++++++++>

export async function apiGetdoc<T, U extends Record<string, unknown>>(params: U) {
  return ApiService.backendApiWithAxios<T>({
    url: `/documents?`,
    method: "get",
    params: {
      ...params,
      folderId: params.id,
    },
  })
}

//<+++++++++++++++++++++++++++++++++Api Docments perview ++++++++++++++++++++++++++++++++++++++++>

export async function apiDocPreview<T, U extends Record<string, unknown>>(params: U) {
  return ApiService.backendApiWithAxios<T>({
    url: `/documents/download/${params.id}`,
    method: "get",
    params,
    responseType: "blob",
  })
}

//<+++++++++++++++++++++++++++++++++Api Create Folder ++++++++++++++++++++++++++++++++++++++++>

export async function apiCreateFolders<T, U extends Record<string, unknown>>(payload: U) {
  console.log("Payload to be sent to create folder : ", payload)

  return ApiService.backendApiWithAxios<T>({
    url: "/project-files", // API endpoint for creating folders
    method: "post",
    data: payload,
  })
}

//<+++++++++++++++++++++++++++++++++Api Update Category and other ++++++++++++++++++++++++++++++++++++++++>

export async function apiUpdateFolder<T, U extends Record<string, unknown>>(id: string, payload: U) {
  console.log("Sending:", { id, payload })
  return ApiService.backendApiWithAxios<T>({
    url: `/project-files?id=${id}`,
    method: "put",
    data: payload,
  })
}

//<+++++++++++++++++++++++++++++++++Api Delete Folder ++++++++++++++++++++++++++++++++++++++++>

export async function apiDeleteFolder<T>(folderId: string) {
  return ApiService.backendApiWithAxios<T>({
    url: `/project-files?id=${folderId}`, // API endpoint for deleting a folder
    method: "delete", // HTTP method
  })
}

//<+++++++++++++++++++++++++++++++++Api Delete Files ++++++++++++++++++++++++++++++++++++++++>

export async function apiDeleteFile<T>(fileId: string) {
  console.log("Deleting file with ID:", fileId) // Log the file ID being deleted
  return ApiService.backendApiWithAxios<T>({
    url: `/documents/${fileId}`,
    method: "delete",
  })
}

//<+++++++++++++++++++++++++++++++++ApiUploadFile ++++++++++++++++++++++++++++++++++++++++>
export async function apiUploadFile<T, U extends Record<string, unknown>>(file: File, documentDTO: U): Promise<T> {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("documentDTO", JSON.stringify(documentDTO))
  return ApiService.backendApiWithAxios<T>({
    url: "/documents/upload",
    method: "post",
    data: formData,
  })
}

//<+++++++++++++++++++++++++++++++++Api Rename Files ++++++++++++++++++++++++++++++++++++++++>

export async function apiRenameFile({
  id,
  newName,
  fileCategory,
}: {
  id: string
  newName: string
  fileCategory: string
}) {
  return ApiService.backendApiWithAxios<void>({
    url: `/documents/rename?documentId=${id}&newName=${encodeURIComponent(newName)}&fileCategory=${encodeURIComponent(fileCategory)}`,
    method: "put",
  })
}

// import ApiService from "./ApiService"

// //<+++++++++++++++++++++++++++++++++Api Get Files for taemp ++++++++++++++++++++++++++++++++++++++++>

// export async function apiGetFiles<T, U extends Record<string, unknown>>(params: U) {
//   return ApiService.fetchDataWithAxios<T>({
//     url: "/api/files",
//     method: "get",
//     params,
//   })
// }

// //<+++++++++++++++++++++++++++++++++Api Gets Folder ++++++++++++++++++++++++++++++++++++++++>

// export async function apiGetFolders<T, U extends Record<string, unknown>>(params: U) {
//   // Handle array parameters manually for proper serialization
//   let url = "/project-files"

//   if (params.ids && Array.isArray(params.ids)) {
//     const queryParams = params.ids.map((id) => `ids=${id}`).join("&")
//     url = `/project-files?${queryParams}`

//     // Remove ids from params to avoid double serialization
//     const { ids, ...otherParams } = params

//     return ApiService.backendApiWithAxios<T>({
//       url,
//       method: "get",
//       params: otherParams,
//     })
//   }

//   return ApiService.backendApiWithAxios<T>({
//     url: "/project-files",
//     method: "get",
//     params,
//   })
// }

// //<+++++++++++++++++++++++++++++++++Api Gets Files ++++++++++++++++++++++++++++++++++++++++>

// export async function apiGetdoc<T, U extends Record<string, unknown>>(params: U) {
//   return ApiService.backendApiWithAxios<T>({
//     url: `/documents?`,
//     method: "get",
//     params: {
//       ...params,
//       folderId: params.id,
//     },
//   })
// }

// //<+++++++++++++++++++++++++++++++++Api Docments perview ++++++++++++++++++++++++++++++++++++++++>

// export async function apiDocPreview<T, U extends Record<string, unknown>>(params: U) {
//   return ApiService.backendApiWithAxios<T>({
//     url: `/documents/download/${params.id}`,
//     method: "get",
//     params,
//     responseType: "blob",
//   })
// }

// //<+++++++++++++++++++++++++++++++++Api Create Folder ++++++++++++++++++++++++++++++++++++++++>

// export async function apiCreateFolders<T, U extends Record<string, unknown>>(payload: U) {
//   console.log("Payload to be sent to create folder : ", payload)

//   return ApiService.backendApiWithAxios<T>({
//     url: "/project-files", // API endpoint for creating folders
//     method: "post",
//     data: payload,
//   })
// }

// //<+++++++++++++++++++++++++++++++++Api Update Category and other ++++++++++++++++++++++++++++++++++++++++>

// export async function apiUpdateFolder<T, U extends Record<string, unknown>>(id: string, payload: U) {
//   console.log("Sending:", { id, payload })
//   return ApiService.backendApiWithAxios<T>({
//     url: `/project-files?id=${id}`,
//     method: "put",
//     data: payload,
//   })
// }

// //<+++++++++++++++++++++++++++++++++Api Delete Folder ++++++++++++++++++++++++++++++++++++++++>

// export async function apiDeleteFolder<T>(folderId: string) {
//   return ApiService.backendApiWithAxios<T>({
//     url: `/project-files?id=${folderId}`, // API endpoint for deleting a folder
//     method: "delete", // HTTP method
//   })
// }

// //<+++++++++++++++++++++++++++++++++Api Delete Files ++++++++++++++++++++++++++++++++++++++++>

// export async function apiDeleteFile<T>(fileId: string) {
//   console.log("Deleting file with ID:", fileId) // Log the file ID being deleted
//   return ApiService.backendApiWithAxios<T>({
//     url: `/documents/${fileId}`,
//     method: "delete",
//   })
// }

// //<+++++++++++++++++++++++++++++++++ApiUploadFile ++++++++++++++++++++++++++++++++++++++++>
// export async function apiUploadFile<T, U extends Record<string, unknown>>(file: File, documentDTO: U): Promise<T> {
//   const formData = new FormData()
//   formData.append("file", file)
//   formData.append("documentDTO", JSON.stringify(documentDTO))
//   return ApiService.backendApiWithAxios<T>({
//     url: "/documents/upload",
//     method: "post",
//     data: formData,
//   })
// }

// //<+++++++++++++++++++++++++++++++++Api Rename Files ++++++++++++++++++++++++++++++++++++++++>

// export async function apiRenameFile({
//   id,
//   newName,
//   fileCategory,
// }: {
//   id: string
//   newName: string
//   fileCategory: string
// }) {
//   return ApiService.backendApiWithAxios<void>({
//     url: `/documents/rename?documentId=${id}&newName=${encodeURIComponent(newName)}&fileCategory=${encodeURIComponent(fileCategory)}`,
//     method: "put",
//   })
// }

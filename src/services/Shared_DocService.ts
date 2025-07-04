import ApiService from "./ApiService";

export async function apiShareDoc({
    id,
    userName,
}: {
    id: string;
    userName: string;
}) {
     console.log("apiShareDoc", id, userName)
    return ApiService.backendApiWithAxios<void>({
        url: `/api/share?documentId=${id}&userName=${encodeURIComponent(userName)}`, 
        method: 'post',
    });
}
export async function apiSharedDocument<T, U extends Record<string, unknown>>(params: U) {
  
    return ApiService.backendApiWithAxios<T>({
      url: `/api/share/document?`,
      params: {
        userEmail: params.userEmail, 
      },
    });
  }
  export async function apiSharedDocPreview<T>(
shareId: string  ) {
    console.log("apiSharedDocPreview", shareId);
    return ApiService.backendApiWithAxios<T>({
      url: `/api/share/${shareId}`,
      method: 'get',
      responseType: 'blob',
    });
  }
  
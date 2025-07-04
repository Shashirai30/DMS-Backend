import ApiService from './ApiService'

export async function apiGetAnalyticDashboard<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/api/dashboard/analytic',
        method: 'get',
    })
}

export async function apiGetWebAnalyticData<T>(fileIds: string | number) {
    return ApiService.backendApiWithAxios<T>({
        url: `/api/categories/document-count?fileIds=${fileIds}`,
        method: 'get',
    })
}

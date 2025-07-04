import ApiService from './ApiService'

export async function apiGetMenuItem<T>() {
    const endpoint = '/menu-items/get';
    return ApiService.backendApiWithAxios<T>({
        url: endpoint,
        method: 'get',
    });
}

import ApiService from './ApiService'
import AxiosBaseBackend from './axios/AxiosBaseBackend';
import { CreateUserPayload } from './../views/concepts/customers/CustomerForm/types';

export async function apiGetCustomersList<T, U extends Record<string, unknown>>(
    params: U,
)  {
    return ApiService.backendApiWithAxios<T>({
        url: '/user/get-user',
        method: 'get',
        params,
    })
}

export async function apiGetCustomer<T, U extends Record<string, unknown>>({
    id,
    ...params
    }: U) {
        return ApiService.backendApiWithAxios<T>({
            url: `/user/get-user?id=${id}`,
            method: 'get',
            params,
        })
    }


export async function apiGetCustomerLog<T, U extends Record<string, unknown>>({
    ...params
}: U) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/customer/log`,
        method: 'get',
        params,
    })
}


export async function apiCreateUser<T>(data: CreateUserPayload): Promise<T> {
  const endpoint = '/public/create-user';
  
  return ApiService.backendApiWithAxios<T>({
    url: endpoint,
    method: 'post',
    data,
  });
}




export async function apiGetUserList<T, U extends Record<string, unknown>>(
    params: U,
) {  
 

    return ApiService.backendApiWithAxios<T>({
        url: '/user/get-user',
        method: 'get',
        params,
    })
}
export async function apiUpdateUser<T extends Record<string, unknown>>({
    id,
    values,
}: {
    id: string;
    values: T;
}){
    const baseURL = AxiosBaseBackend.defaults.baseURL;
    const endpoint = `/user/update?id=${id}`;
    const fullUrl = `${baseURL}${endpoint}`;

    console.log('API URL:', fullUrl);
    console.log('Request Data:',id, values);

    return ApiService.backendApiWithAxios<T>({
        url: fullUrl,
        method: 'put',
        data: values, // Use the 'values' parameter here
    });
}



// import ApiService from './ApiService'
// import AxiosBaseBackend from './axios/AxiosBaseBackend';
// import { CreateUserPayload } from './../views/concepts/customers/CustomerForm/types';

// export async function apiGetCustomersList<T, U extends Record<string, unknown>>(
//     params: U,
// )  {
//     return ApiService.backendApiWithAxios<T>({
//         url: '/user/get-user',
//         method: 'get',
//         params,
//     })
// }

// export async function apiGetCustomer<T, U extends Record<string, unknown>>({
//     id,
//     ...params
//     }: U) {
//         return ApiService.backendApiWithAxios<T>({
//             url: `/user/get-user?id=${id}`,
//             method: 'get',
//             params,
//         })
//     }


// export async function apiGetCustomerLog<T, U extends Record<string, unknown>>({
//     ...params
// }: U) {
//     return ApiService.fetchDataWithAxios<T>({
//         url: `/customer/log`,
//         method: 'get',
//         params,
//     })
// }


// export async function apiCreateUser<T>(data: CreateUserPayload): Promise<T> {
//   const endpoint = '/public/create-user';
  
//   return ApiService.backendApiWithAxios<T>({
//     url: endpoint,
//     method: 'post',
//     data,
//   });
// }




// export async function apiGetUserList<T, U extends Record<string, unknown>>(
//     params: U,
// ) {  
 

//     return ApiService.backendApiWithAxios<T>({
//         url: '/user/get-user',
//         method: 'get',
//         params,
//     })
// }
// export async function apiUpdateUser<T extends Record<string, unknown>>({
//     id,
//     values,
// }: {
//     id: string;
//     values: T;
// }){
//     const baseURL = AxiosBaseBackend.defaults.baseURL;
//     const endpoint = `/user/update?id=${id}`;
//     const fullUrl = `${baseURL}${endpoint}`;

//     console.log('API URL:', fullUrl);
//     console.log('Request Data:',id, values);

//     return ApiService.backendApiWithAxios<T>({
//         url: fullUrl,
//         method: 'put',
//         data: values, // Use the 'values' parameter here
//     });
// }




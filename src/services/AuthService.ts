import ApiService from './ApiService'
import endpointConfig from '@/configs/endpoint.config'

import type {
    SignInCredential,
    ForgotPassword,
    SignInResponse,
    ResetPassword,
} from '@/@types/auth'
import AxiosBaseBackend from './axios/AxiosBaseBackend';


export async function apiSignIn(data: SignInCredential) {
    const baseURL = AxiosBaseBackend.defaults.baseURL;
    const endpoint = endpointConfig.signIn;
    const fullUrl = `${baseURL}${endpoint}`;
    console.log('API FullURL:', fullUrl);
    return ApiService.backendApiWithAxios<SignInResponse>({
        url: endpointConfig.signIn,
        method: 'post',
        data,
    });
}



export async function apiSignOut() {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.signOut,
        method: 'post',
    })
}

export async function apiForgotPassword<T>(data: ForgotPassword) {
    return ApiService.fetchDataWithAxios<T>({
        url: endpointConfig.forgotPassword,
        method: 'post',
        data,
    })
}


export async function apiChangePassword(data: ResetPassword) {
    return ApiService.backendApiWithAxios<ResetPassword>({
        url: '/user/reset-password',
        method: 'put',
        data,
    })
}
export async function  apiUpdateProfile<T extends Record<string, unknown>>({
    values,
}: {
    values: T;
}){
    const baseURL = AxiosBaseBackend.defaults.baseURL;
    const endpoint = `/user/update`;
    const fullUrl = `${baseURL}${endpoint}`;


    return ApiService.backendApiWithAxios<T>({
        url: fullUrl,
        method: 'put',
        data: values, // Use the 'values' parameter here
    });
}

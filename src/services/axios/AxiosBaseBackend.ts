import axios from "axios"
import AxiosResponseIntrceptorErrorCallback from './AxiosResponseIntrceptorErrorCallback'
import AxiosRequestIntrceptorConfigCallback from './AxiosRequestIntrceptorConfigCallback'
import type { AxiosError } from 'axios'
import appConfig from "@/configs/app.config";


const AxiosBaseBackend = axios.create({
    timeout: 60000,
    baseURL: appConfig.baseUrl,
})
 
AxiosBaseBackend.interceptors.request.use(
    (config) => {
        
        return AxiosRequestIntrceptorConfigCallback(config)
    },
    (error) => {
        return Promise.reject(error)
    },
)

AxiosBaseBackend.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        AxiosResponseIntrceptorErrorCallback(error)
        return Promise.reject(error)
    },
    
)
// <========Add interceptors if needed (e.g., headers, error handling)=====>
// AxiosBaseBackend.interceptors.request.use(
//     (config) => {
//       // Add headers like Authorization here
//       return config;
//     },
//     (error) => Promise.reject(error),
//   );

export default AxiosBaseBackend

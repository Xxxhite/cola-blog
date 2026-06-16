import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'

// 定义接口返回数据的格式
interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
}

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    // 这里可以根据后端的业务逻辑处理错误码
    // 目前简单返回所有数据
    return res
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401: {
          // 未授权，清除 token 并跳转到登录页
          localStorage.removeItem('token')
          // window.location.href = '/login';
          break
        }
        case 403: {
          console.error('没有权限访问')
          break
        }
        case 404: {
          console.error('请求资源不存在')
          break
        }
        case 500: {
          console.error('服务器内部错误')
          break
        }
        default: {
          console.error('其他错误', error.response.status)
        }
      }
    }
    return Promise.reject(error)
  },
)

export default service

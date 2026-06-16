import axios from 'axios'

// 创建 axios 实例
const service = axios.create({
  // 基础路径，已经在 vite.config.mts 中配置了代理
  baseURL: '/api',
  // 请求超时时间
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response.data
  },
  (error) => {
    // 对响应错误做点什么
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，清除 token 并跳转登录页
          localStorage.removeItem('token')
          // window.location.href = '/login'
          break
        case 403:
          console.error('权限不足')
          break
        case 500:
          console.error('服务器错误')
          break
        default:
          console.error('请求失败:', error.message)
      }
    }
    return Promise.reject(error)
  }
)

export default service

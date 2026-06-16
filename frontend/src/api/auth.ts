import request from '@/utils/request'
import type {User} from './types'

export interface LoginResponse {
    user: User
    token: string
}

export const authApi = {
    /**
     * 登录
     */
    login(data: any) {
        return request.post<any, LoginResponse>('/auth/login', data)
    },

    /**
     * 注册
     */
    register(data: any) {
        return request.post<any, LoginResponse>('/auth/register', data)
    },

    /**
     * 获取当前登录用户信息
     */
    getCurrentUser() {
        return request.get<any, User>('/auth/me')
    },

    /**
     * 退出登录
     */
    logout() {
        localStorage.removeItem('token')
        return Promise.resolve()
    }
}

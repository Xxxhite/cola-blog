import request from '@/utils/request'
import type { User } from './types'

export const userApi = {
  /**
   * 获取所有用户
   */
  getAllUsers() {
    return request.get<any, User[]>('/users')
  },

  /**
   * 更新用户状态 (封禁/解封)
   */
  updateUserStatus(id: number, status: 'active' | 'banned') {
    return request.patch<any, any>(`/users/${id}/status`, { status })
  },

  /**
   * 更新用户角色
   */
  updateUserRole(id: number, role: 'admin' | 'user') {
    return request.patch<any, any>(`/users/${id}/role`, { role })
  },

  /**
   * 删除用户
   */
  deleteUser(id: number) {
    return request.delete<any, any>(`/users/${id}`)
  }
}

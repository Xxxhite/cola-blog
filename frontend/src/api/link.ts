import request from '@/utils/request'
import type {Link} from './types'

export const linkApi = {
    /**
     * 获取所有已审核的友情链接 (公开)
     */
    getApprovedLinks() {
        return request.get<any, Link[]>('/links')
    },

    /**
     * 获取所有友情链接 (仅限管理员)
     */
    getAllLinks() {
        return request.get<any, Link[]>('/links/all')
    },

    /**
     * 创建友情链接 (公开申请)
     */
    createLink(data: {
        name: string
        url: string
        logo?: string
        description?: string
    }) {
        return request.post<any, Link>('/links', data)
    },

    /**
     * 更新友情链接 (仅限管理员)
     */
    updateLink(id: number | string, data: Partial<Link>) {
        return request.patch<any, Link>(`/links/${id}`, data)
    },

    /**
     * 删除友情链接 (仅限管理员)
     */
    deleteLink(id: number | string) {
        return request.delete(`/links/${id}`)
    }
}

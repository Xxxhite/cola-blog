import request from '@/utils/request'
import type {Message, PaginatedResponse} from './types'

export const guestbookApi = {
    /**
     * 获取公开留言列表
     */
    getApprovedMessages(params?: { page?: number; limit?: number }) {
        return request.get<any, PaginatedResponse<Message>>('/guestbook', {params})
    },

    /**
     * 发表留言 (需登录)
     */
    createMessage(data: { content: string; userId: number }) {
        return request.post<any, Message>('/guestbook', data)
    },

    /**
     * 获取所有留言 (需管理员)
     */
    getAllMessages(params?: { page?: number; limit?: number }) {
        return request.get<any, PaginatedResponse<Message>>('/guestbook/all', {params})
    },

    /**
     * 审核通过留言 (需管理员)
     */
    approveMessage(id: number | string) {
        return request.patch<any, Message>(`/guestbook/${id}/approve`)
    },

    /**
     * 删除留言 (需管理员)
     */
    deleteMessage(id: number | string) {
        return request.delete(`/guestbook/${id}`)
    }
}

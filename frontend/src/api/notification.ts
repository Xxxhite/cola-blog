import request from '@/utils/request'
import type {Notification, PaginatedResponse} from './types'

export const notificationApi = {
    /**
     * 获取当前用户的通知列表
     */
    getNotifications(params?: { page?: number; limit?: number; isRead?: number | string }) {
        return request.get<any, PaginatedResponse<Notification>>('/notifications', {params})
    },

    /**
     * 获取未读通知数量
     */
    getUnreadCount() {
        return request.get<any, { count: number }>('/notifications/unread-count')
    },

    /**
     * 标记通知为已读
     */
    markAsRead(id: number | string) {
        return request.patch(`/notifications/${id}/read`)
    },

    /**
     * 全部标记为已读
     */
    markAllAsRead() {
        return request.patch('/notifications/read-all')
    },

    /**
     * 删除通知
     */
    deleteNotification(id: number | string) {
        return request.delete(`/notifications/${id}`)
    }
}

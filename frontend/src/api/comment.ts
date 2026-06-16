import request from '@/utils/request'
import type {Comment, PaginatedResponse} from './types'

export const commentApi = {
    /**
     * 获取指定文章的评论树
     */
    getCommentsByPostId(postId: number | string) {
        return request.get<any, Comment[]>(`/comments/post/${postId}`)
    },

    /**
     * 获取指定文章的评论总数
     */
    getCommentCountByPostId(postId: number | string) {
        return request.get<any, { count: number }>(`/comments/count/${postId}`)
    },

    /**
     * 发表评论 (需登录)
     */
    createComment(data: {
        content: string
        postId: number
        userId: number
        parentId?: number | null
    }) {
        return request.post<any, Comment>('/comments', data)
    },

    /**
     * 获取所有评论 (分页，管理后台用，需管理员)
     */
    getAllComments(params?: { page?: number; limit?: number }) {
        return request.get<any, PaginatedResponse<Comment>>('/comments', {params})
    },

    /**
     * 审核通过评论 (需管理员)
     */
    approveComment(id: number | string) {
        return request.patch<any, Comment>(`/comments/${id}/approve`)
    },

    /**
     * 删除评论 (需管理员)
     */
    deleteComment(id: number | string) {
        return request.delete(`/comments/${id}`)
    }
}

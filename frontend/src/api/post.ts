import request from '@/utils/request'
import type {Post, PaginatedResponse} from './types'

export interface PostQueryParams {
    page?: number | string
    limit?: number | string
    categoryId?: number | string
    tagId?: number | string
    status?: 'draft' | 'published' | 'archived'
    type?: 'post' | 'moment'
}

export const postApi = {
    /**
     * 获取文章列表
     */
    getPosts(params?: PostQueryParams) {
        return request.get<any, PaginatedResponse<Post>>('/posts', {params})
    },

    /**
     * 根据 ID 获取文章详情
     */
    getPostById(id: number | string) {
        return request.get<any, Post>(`/posts/${id}`)
    },

    /**
     * 根据 Slug 获取文章详情
     */
    getPostBySlug(slug: string) {
        return request.get<any, Post>(`/posts/slug/${slug}`)
    },

    /**
     * 增加阅读量
     */
    incrementViews(id: number | string) {
        return request.patch(`/posts/${id}/views`)
    },

    /**
     * 创建文章 (需要管理员权限)
     */
    createPost(data: Partial<Post>) {
        return request.post<any, Post>('/posts', data)
    },

    /**
     * 更新文章 (需要管理员权限)
     */
    updatePost(id: number | string, data: Partial<Post>) {
        return request.patch<any, Post>(`/posts/${id}`, data)
    },

    /**
     * 删除文章 (需要管理员权限)
     */
    deletePost(id: number | string) {
        return request.delete(`/posts/${id}`)
    }
}

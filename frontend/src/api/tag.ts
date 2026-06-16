import request from '@/utils/request'
import type {Tag} from './types'

export const tagApi = {
    /**
     * 获取所有标签
     */
    getAllTags() {
        return request.get<any, Tag[]>('/tags')
    },

    /**
     * 获取所有标签及其关联文章数量
     */
    getTagsWithCount() {
        return request.get<any, Tag[]>('/tags/with-count')
    },

    /**
     * 根据 ID 获取标签
     */
    getTagById(id: number | string) {
        return request.get<any, Tag>(`/tags/${id}`)
    },

    /**
     * 根据 Slug 获取标签
     */
    getTagBySlug(slug: string) {
        return request.get<any, Tag>(`/tags/slug/${slug}`)
    },

    /**
     * 创建标签 (需要管理员权限)
     */
    createTag(data: Partial<Tag>) {
        return request.post<any, Tag>('/tags', data)
    },

    /**
     * 更新标签 (需要管理员权限)
     */
    updateTag(id: number | string, data: Partial<Tag>) {
        return request.patch<any, Tag>(`/tags/${id}`, data)
    },

    /**
     * 删除标签 (需要管理员权限)
     */
    deleteTag(id: number | string) {
        return request.delete(`/tags/${id}`)
    }
}

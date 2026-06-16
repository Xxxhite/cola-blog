import request from '@/utils/request'
import type {Category} from './types'

export const categoryApi = {
    /**
     * 获取所有分类 (树形结构)
     */
    getCategoryTree() {
        return request.get<any, Category[]>('/categories/tree')
    },

    /**
     * 获取所有分类 (平铺列表)
     */
    getAllCategories() {
        return request.get<any, Category[]>('/categories')
    },

    /**
     * 根据 ID 获取分类
     */
    getCategoryById(id: number | string) {
        return request.get<any, Category>(`/categories/${id}`)
    },

    /**
     * 创建分类 (需要管理员权限)
     */
    createCategory(data: Partial<Category>) {
        return request.post<any, Category>('/categories', data)
    },

    /**
     * 更新分类 (需要管理员权限)
     */
    updateCategory(id: number | string, data: Partial<Category>) {
        return request.patch<any, Category>(`/categories/${id}`, data)
    },

    /**
     * 删除分类 (需要管理员权限)
     */
    deleteCategory(id: number | string) {
        return request.delete(`/categories/${id}`)
    }
}

import request from '@/utils/request'
import type {Post, PaginatedResponse} from './types'

export interface SearchParams {
    q?: string
    page?: number | string
    limit?: number | string
    categoryId?: number | string
    tagId?: number | string
}

export const searchApi = {
    /**
     * 搜索文章
     */
    search(params: SearchParams) {
        return request.get<any, PaginatedResponse<Post>>('/search', {params})
    }
}

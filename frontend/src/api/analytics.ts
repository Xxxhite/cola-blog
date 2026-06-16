import request from '@/utils/request'
import type {AnalyticsOverview, WeeklyTrend, Post} from './types'

export const analyticsApi = {
    /**
     * 获取管理后台仪表盘概览 (仅限管理员)
     */
    getOverview() {
        return request.get<any, AnalyticsOverview>('/analytics/overview')
    },

    /**
     * 获取热门文章 (公开)
     */
    getTrendingPosts(limit?: number | string) {
        return request.get<any, Post[]>('/analytics/trending', {params: {limit}})
    },

    /**
     * 获取最近 7 天趋势 (仅限管理员)
     */
    getWeeklyTrends() {
        return request.get<any, WeeklyTrend[]>('/analytics/trends')
    }
}

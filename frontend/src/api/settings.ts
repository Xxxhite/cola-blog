import request from '@/utils/request'

export const settingsApi = {
    /**
     * 获取博客基础配置 (公开)
     */
    getAllSettings() {
        return request.get<any, Record<string, string>>('/settings')
    },

    /**
     * 更新系统配置 (仅限管理员)
     */
    updateSettings(data: Record<string, string>) {
        return request.patch<any, { success: boolean }>('/settings', data)
    }
}

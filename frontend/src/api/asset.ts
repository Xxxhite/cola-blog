import request from '@/utils/request'

export const assetApi = {
    /**
     * 获取所有背景图片列表
     */
    getBackgrounds() {
        return request.get<any, string[]>('/assets/backgrounds')
    }
}

import request from '@/utils/request'

export const uploadApi = {
    /**
     * 上传图片 (仅管理员可用)
     */
    uploadImage(file: File, category?: string) {
        const formData = new FormData()
        formData.append('file', file)
        if (category) {
            formData.append('category', category)
        }
        return request.post<any, { url: string }>('/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }
}

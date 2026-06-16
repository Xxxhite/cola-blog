import {readdirSync} from "fs";
import {join} from "path";

export class AssetService {
    private readonly BG_DIR = "public/uploads/background_image";

    /**
     * 获取所有背景图片列表
     */
    async getBackgroundImages() {
        try {
            const files = readdirSync(this.BG_DIR);
            // 过滤图片文件
            const images = files.filter(file => 
                /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file)
            );
            // 返回完整 URL 路径
            return images.map(file => `/uploads/background_image/${file}`);
        } catch (error) {
            console.error("Failed to list background images:", error);
            return [];
        }
    }
}

export const assetService = new AssetService();

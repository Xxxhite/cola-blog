import {existsSync, mkdirSync} from "fs";
import {join, resolve} from "path";

export class UploadService {
    // 优先读取环境变量，默认使用项目根目录下的 public/uploads
    private readonly UPLOAD_DIR = resolve(process.env.UPLOAD_PATH || "public/uploads");

    constructor() {
        this.ensureUploadDir();
        console.log(`📁 Upload directory: ${this.UPLOAD_DIR}`);
    }

    /**
     * 确保上传目录存在
     */
    private ensureUploadDir() {
        if (!existsSync(this.UPLOAD_DIR)) {
            mkdirSync(this.UPLOAD_DIR, {recursive: true});
        }
    }

    /**
     * 保存图片文件
     * @param file 文件对象 (Bun File)
     * @returns 保存后的 URL 和文件名
     */
    async saveImage(file: File) {
        // 生成唯一文件名: 时间戳 + 随机数 + 原后缀
        const extension = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`;
        const filePath = join(this.UPLOAD_DIR, fileName);

        // 使用 Bun.write 快速写入文件
        await Bun.write(filePath, file);

        return {
            url: `/uploads/${fileName}`,
            name: fileName
        };
    }


    /**
     * 校验文件是否为图片
     */
    isImage(file: File): boolean {
        return file.type.startsWith("image/");
    }

    /**
     * 校验文件大小
     * @param file 文件对象
     * @param maxSizeMB 最大大小 (MB)
     */
    isValidSize(file: File, maxSizeMB: number = 5): boolean {
        const MAX_SIZE = maxSizeMB * 1024 * 1024;
        return file.size <= MAX_SIZE;
    }
}

export const uploadService = new UploadService();

import { Elysia, t } from "elysia";
import { authPlugin } from "../plugins/auth.plugin";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

// 确保上传目录存在
const UPLOAD_DIR = "public/uploads";
if (!existsSync(UPLOAD_DIR)) {
    mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const uploadController = new Elysia({ prefix: "/upload" })
    .use(authPlugin)
    /**
     * 上传图片
     */
    .post("/image", async ({ body: { file }, set, getCurrentUser }) => {
        // 权限检查：只有登录用户能上传
        const user = await getCurrentUser();
        if (!user) {
            set.status = 401;
            return { error: "Unauthorized" };
        }

        // 校验文件类型
        if (!file.type.startsWith("image/")) {
            set.status = 400;
            return { error: "Only image files are allowed" };
        }

        // 校验文件大小 (限制 5MB)
        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            set.status = 400;
            return { error: "File size exceeds 5MB limit" };
        }

        // 生成唯一文件名: 时间戳 + 随机数 + 原后缀
        const extension = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`;
        const filePath = join(UPLOAD_DIR, fileName);

        // 使用 Bun.write 快速写入文件
        await Bun.write(filePath, file);

        // 返回文件访问 URL
        return {
            url: `/uploads/${fileName}`,
            name: fileName
        };
    }, {
        body: t.Object({
            file: t.File()
        })
    });

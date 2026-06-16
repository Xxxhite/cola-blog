import {Elysia, t} from "elysia";
import {authPlugin} from "../plugins/auth.plugin";
import {uploadService} from "../services/upload.service";

export const uploadController = new Elysia({prefix: "/upload"})
    .use(authPlugin)
    /**
     * 上传图片 (仅管理员可用)
     */
    .guard({
        isAdmin: true
    }, (app) => app
        .post("/image", async ({body: {file}, set}) => {
            // 校验文件类型
            if (!uploadService.isImage(file)) {
                set.status = 400;
                return {error: "Only image files are allowed"};
            }

            // 校验文件大小 (限制 5MB)
            if (!uploadService.isValidSize(file, 5)) {
                set.status = 400;
                return {error: "File size exceeds 5MB limit"};
            }

            // 调用 Service 保存文件
            try {
                return await uploadService.saveImage(file);
            } catch (error) {
                set.status = 500;
                return {error: "Failed to upload file"};
            }
        }, {
            body: t.Object({
                file: t.File()
            })
        })
    );

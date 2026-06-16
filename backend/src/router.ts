import {Elysia} from "elysia";
import {categoryController} from "./controllers/category.controller.ts";
import {postController} from "./controllers/post.controller.ts";
import {tagController} from "./controllers/tag.controller.ts";
import {commentController} from "./controllers/comment.controller.ts";
import {authController} from "./controllers/auth.controller.ts";
import {uploadController} from "./controllers/upload.controller.ts";
import {searchController} from "./controllers/search.controller";
import {authPlugin} from "./plugins/auth.plugin";

export const apiRouter = new Elysia({prefix: "/api"})
    .use(authPlugin)
    .use(categoryController)
    .use(postController)
    .use(tagController)
    .use(commentController)
    .use(authController)
    .use(uploadController)
    .use(searchController)
    .onBeforeHandle(async ({request, getCurrentUser, set}) => {
        // 允许所有 GET 请求 (查看权限)
        if (request.method === "GET") return;

        // 排除注册和登录接口
        const url = new URL(request.url);
        if (url.pathname.endsWith("/auth/login") || url.pathname.endsWith("/auth/register")) return;

        // 其余所有 POST, PATCH, DELETE 等操作必须登录
        const user = await getCurrentUser();
        if (!user) {
            set.status = 401;
            return {error: "Unauthorized: Access restricted to logged-in users"};
        }
    });
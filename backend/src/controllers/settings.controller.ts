import {Elysia, t} from "elysia";
import {settingsService} from "../services/settings.service";
import {authPlugin} from "../plugins/auth.plugin";

export const settingsController = new Elysia({prefix: "/settings"})
    .use(authPlugin)
    /**
     * 获取博客基础配置 (公开接口)
     */
    .get("/", () => settingsService.getAllSettings())

    /**
     * 更新系统配置 (仅限管理员)
     */
    .patch("/", async ({body, set, getCurrentUser}) => {
        const user = await getCurrentUser();
        if (!user || user.role !== "admin") {
            set.status = 403;
            return {error: "Forbidden: Admin access required"};
        }
        return await settingsService.updateSettings(body);
    }, {
        body: t.Record(t.String(), t.String())
    });

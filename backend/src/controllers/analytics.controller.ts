import {Elysia, t} from "elysia";
import {analyticsService} from "../services/analytics.service";
import {authPlugin} from "../plugins/auth.plugin";

export const analyticsController = new Elysia({prefix: "/analytics"})
    .use(authPlugin)
    /**
     * 获取管理后台仪表盘概览 (仅限管理员)
     */
    .get("/overview", async ({set, getCurrentUser}) => {
        const user = await getCurrentUser();
        if (!user || user.role !== "admin") {
            set.status = 403;
            return {error: "Forbidden: Admin access required"};
        }
        return await analyticsService.getOverview();
    })

    /**
     * 获取热门文章 (公开)
     */
    .get("/trending", ({query}) => {
        return analyticsService.getTrendingPosts(query.limit ? Number(query.limit) : 10);
    }, {
        query: t.Object({
            limit: t.Optional(t.String())
        })
    })

    /**
     * 获取最近 7 天趋势 (仅限管理员)
     */
    .get("/trends", async ({set, getCurrentUser}) => {
        const user = await getCurrentUser();
        if (!user || user.role !== "admin") {
            set.status = 403;
            return {error: "Forbidden: Admin access required"};
        }
        return await analyticsService.getWeeklyTrends();
    });

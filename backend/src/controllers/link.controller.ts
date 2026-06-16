import {Elysia, t} from "elysia";
import {linkService} from "../services/link.service";
import {authPlugin} from "../plugins/auth.plugin";

export const linkController = new Elysia({prefix: "/links"})
    .use(authPlugin)
    /**
     * 获取所有已审核的友情链接 (公开)
     */
    .get("/", () => linkService.getApprovedLinks())

    /**
     * 获取所有友情链接 (仅限管理员)
     */
    .get("/all", async ({set, getCurrentUser}) => {
        const user = await getCurrentUser();
        if (!user || user.role !== "admin") {
            set.status = 403;
            return {error: "Forbidden: Admin access required"};
        }
        return await linkService.getAllLinks();
    })

    /**
     * 创建友情链接 (仅限管理员)
     */
    .post("/", async ({body, set, getCurrentUser}) => {
        const user = await getCurrentUser();
        if (!user || user.role !== "admin") {
            set.status = 403;
            return {error: "Forbidden: Admin access required"};
        }
        return await linkService.createLink(body);
    }, {
        body: t.Object({
            name: t.String(),
            url: t.String(),
            logo: t.Optional(t.String()),
            description: t.Optional(t.String()),
            sort: t.Optional(t.Number()),
            status: t.Optional(t.Enum({
                pending: "pending",
                approved: "approved",
                rejected: "rejected"
            }))
        })
    })

    /**
     * 更新友情链接 (仅限管理员)
     */
    .patch("/:id", async ({params: {id}, body, set, getCurrentUser}) => {
        const user = await getCurrentUser();
        if (!user || user.role !== "admin") {
            set.status = 403;
            return {error: "Forbidden: Admin access required"};
        }
        return await linkService.updateLink(Number(id), body);
    }, {
        params: t.Object({
            id: t.String()
        }),
        body: t.Object({
            name: t.Optional(t.String()),
            url: t.Optional(t.String()),
            logo: t.Optional(t.String()),
            description: t.Optional(t.String()),
            sort: t.Optional(t.Number()),
            status: t.Optional(t.Enum({
                pending: "pending",
                approved: "approved",
                rejected: "rejected"
            }))
        })
    })

    /**
     * 删除友情链接 (仅限管理员)
     */
    .delete("/:id", async ({params: {id}, set, getCurrentUser}) => {
        const user = await getCurrentUser();
        if (!user || user.role !== "admin") {
            set.status = 403;
            return {error: "Forbidden: Admin access required"};
        }
        await linkService.deleteLink(Number(id));
        return {success: true};
    }, {
        params: t.Object({
            id: t.String()
        })
    });

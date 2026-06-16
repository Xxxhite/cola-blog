import {Elysia, t} from "elysia";
import {tagService} from "../services/tag.service";

export const tagController = new Elysia({prefix: "/tags"})
    .use(authPlugin)
    /**
     * 获取所有标签
     */
    .get("/", () => tagService.getAllTags())

    /**
     * 获取所有标签及其关联文章数量
     */
    .get("/with-count", () => tagService.getTagsWithCount())

    /**
     * 根据 ID 获取标签
     */
    .get("/:id", ({params: {id}}) => tagService.getById(Number(id)), {
        params: t.Object({
            id: t.String()
        })
    })

    /**
     * 根据 Slug 获取标签
     */
    .get("/slug/:slug", ({params: {slug}}) => tagService.getBySlug(slug), {
        params: t.Object({
            slug: t.String()
        })
    })

    // --- 管理员专用接口 ---
    .guard({
        isAdmin: true
    }, (app) => app
        /**
         * 创建标签
         */
        .post("/", ({body}) => tagService.createTag(body), {
            body: t.Object({
                name: t.String(),
                slug: t.String()
            })
        })

        /**
         * 更新标签
         */
        .patch("/:id", ({params: {id}, body}) => tagService.updateTag(Number(id), body), {
            params: t.Object({
                id: t.String()
            }),
            body: t.Object({
                name: t.Optional(t.String()),
                slug: t.Optional(t.String())
            })
        })

        /**
         * 删除标签
         */
        .delete("/:id", async ({params: {id}, set}) => {
            try {
                await tagService.deleteTag(Number(id));
                return {success: true};
            } catch (error: any) {
                set.status = 400;
                return {error: error.message};
            }
        }, {
            params: t.Object({
                id: t.String()
            })
        })
    );

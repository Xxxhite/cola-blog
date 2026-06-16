import {Elysia, t} from "elysia";
import {categoryService} from "../services/category.service";
import {authPlugin} from "../plugins/auth.plugin";

export const categoryController = new Elysia({prefix: "/categories"})
    .use(authPlugin)
    /**
     * 获取所有分类 (树形结构)
     */
    .get("/tree", () => categoryService.getCategoryTree())

    /**
     * 获取所有分类 (平铺列表)
     */
    .get("/", () => categoryService.getAllCategories())

    /**
     * 根据 ID 获取分类
     */
    .get("/:id", ({params: {id}}) => categoryService.getById(Number(id)), {
        params: t.Object({
            id: t.String()
        })
    })

    // --- 管理员专用接口 ---
    .guard({
        isAdmin: true
    }, (app) => app
        /**
         * 创建分类
         */
        .post("/", ({body}) => categoryService.createCategory(body), {
            body: t.Object({
                name: t.String(),
                slug: t.String(),
                description: t.Optional(t.String()),
                parentId: t.Optional(t.Nullable(t.Number()))
            })
        })

        /**
         * 更新分类
         */
        .patch("/:id", ({params: {id}, body}) => categoryService.updateCategory(Number(id), body), {
            params: t.Object({
                id: t.String()
            }),
            body: t.Object({
                name: t.Optional(t.String()),
                slug: t.Optional(t.String()),
                description: t.Optional(t.String()),
                parentId: t.Optional(t.Nullable(t.Number()))
            })
        })

        /**
         * 删除分类
         */
        .delete("/:id", async ({params: {id}, set}) => {
            try {
                await categoryService.deleteCategory(Number(id));
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

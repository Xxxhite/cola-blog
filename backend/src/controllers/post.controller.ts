import { Elysia, t } from "elysia";
import { postService } from "../services/post.service";

export const postController = new Elysia({ prefix: "/posts" })
    /**
     * 获取文章列表 (分页与过滤)
     */
    .get("/", ({ query }) => {
        return postService.getPosts({
            page: query.page ? Number(query.page) : undefined,
            limit: query.limit ? Number(query.limit) : undefined,
            categoryId: query.categoryId ? Number(query.categoryId) : undefined,
            tagId: query.tagId ? Number(query.tagId) : undefined,
            status: query.status as any
        });
    }, {
        query: t.Object({
            page: t.Optional(t.String()),
            limit: t.Optional(t.String()),
            categoryId: t.Optional(t.String()),
            tagId: t.Optional(t.String()),
            status: t.Optional(t.Enum({
                draft: "draft",
                published: "published",
                archived: "archived"
            }))
        })
    })

    /**
     * 根据 ID 获取文章
     */
    .get("/:id", ({ params: { id } }) => postService.getPostById(Number(id)), {
        params: t.Object({
            id: t.String()
        })
    })

    /**
     * 根据 Slug 获取文章
     */
    .get("/slug/:slug", ({ params: { slug } }) => postService.getPostBySlug(slug), {
        params: t.Object({
            slug: t.String()
        })
    })

    /**
     * 创建文章
     */
    .post("/", ({ body }) => postService.createPost(body), {
        body: t.Object({
            title: t.String(),
            slug: t.String(),
            content: t.String(),
            cover: t.Optional(t.String()),
            status: t.Optional(t.Enum({
                draft: "draft",
                published: "published",
                archived: "archived"
            })),
            categoryId: t.Optional(t.Number()),
            authorId: t.Number(),
            tagIds: t.Optional(t.Array(t.Number()))
        })
    })

    /**
     * 更新文章
     */
    .patch("/:id", ({ params: { id }, body }) => postService.updatePost(Number(id), body), {
        params: t.Object({
            id: t.String()
        }),
        body: t.Object({
            title: t.Optional(t.String()),
            slug: t.Optional(t.String()),
            content: t.Optional(t.String()),
            cover: t.Optional(t.String()),
            status: t.Optional(t.Enum({
                draft: "draft",
                published: "published",
                archived: "archived"
            })),
            categoryId: t.Optional(t.Number()),
            authorId: t.Optional(t.Number()),
            tagIds: t.Optional(t.Array(t.Number()))
        })
    })

    /**
     * 删除文章
     */
    .delete("/:id", ({ params: { id } }) => postService.deletePost(Number(id)), {
        params: t.Object({
            id: t.String()
        })
    })

    /**
     * 增加文章阅读量
     */
    .patch("/:id/views", ({ params: { id } }) => postService.incrementViews(Number(id)), {
        params: t.Object({
            id: t.String()
        })
    });

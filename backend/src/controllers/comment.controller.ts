import {Elysia, t} from "elysia";
import {commentService} from "../services/comment.service";
import {authPlugin} from "../plugins/auth.plugin";

export const commentController = new Elysia({prefix: "/comments"})
    .use(authPlugin)
    /**
     * 获取指定文章的评论树
     */
    .get("/post/:postId", ({params: {postId}}) => commentService.getCommentsByPostId(Number(postId)), {
        params: t.Object({
            postId: t.String()
        })
    })

    /**
     * 获取指定文章的评论总数
     */
    .get("/count/:postId", ({params: {postId}}) => commentService.getCommentCountByPostId(Number(postId)), {
        params: t.Object({
            postId: t.String()
        })
    })

    // --- 认证用户接口 ---
    .guard({
        isAuth: true
    }, (app) => app
        /**
         * 发表评论
         */
        .post("/", ({body}) => commentService.createComment(body), {
            body: t.Object({
                content: t.String(),
                postId: t.Number(),
                userId: t.Number(),
                parentId: t.Optional(t.Nullable(t.Number())),
                status: t.Optional(t.Enum({
                    pending: "pending",
                    approved: "approved",
                    spam: "spam"
                }))
            })
        })
    )

    // --- 管理员专用接口 ---
    .guard({
        isAdmin: true
    }, (app) => app
        /**
         * 获取所有评论 (分页，管理后台用)
         */
        .get("/", ({query}) => {
            return commentService.getAllComments(
                query.page ? Number(query.page) : 1,
                query.limit ? Number(query.limit) : 20
            );
        }, {
            query: t.Object({
                page: t.Optional(t.String()),
                limit: t.Optional(t.String())
            })
        })

        /**
         * 审核通过评论
         */
        .patch("/:id/approve", ({params: {id}}) => commentService.approveComment(Number(id)), {
            params: t.Object({
                id: t.String()
            })
        })

        /**
         * 删除评论
         */
        .delete("/:id", ({params: {id}}) => commentService.deleteComment(Number(id)), {
            params: t.Object({
                id: t.String()
            })
        })
    );

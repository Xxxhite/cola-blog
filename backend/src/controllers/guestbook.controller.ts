import {Elysia, t} from "elysia";
import {guestbookService} from "../services/guestbook.service";
import {authPlugin} from "../plugins/auth.plugin";

export const guestbookController = new Elysia({prefix: "/guestbook"})
    .use(authPlugin)
    /**
     * 获取公开留言列表
     */
    .get("/", ({query}) => {
        return guestbookService.getApprovedMessages(
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
     * 发表留言 (需登录)
     */
    .guard({
        isAuth: true
    }, (app) => app
        .post("/", ({body, getCurrentUser}) => {
            return guestbookService.createMessage(body);
        }, {
            body: t.Object({
                content: t.String(),
                userId: t.Number()
            })
        })
    )

    /**
     * 管理接口 (需管理员)
     */
    .guard({
        isAdmin: true
    }, (app) => app
        .get("/all", ({query}) => {
            return guestbookService.getAllMessages(
                query.page ? Number(query.page) : 1,
                query.limit ? Number(query.limit) : 20
            );
        })
        .patch("/:id/approve", ({params: {id}}) => guestbookService.approveMessage(Number(id)), {
            params: t.Object({
                id: t.String()
            })
        })
        .delete("/:id", ({params: {id}}) => guestbookService.deleteMessage(Number(id)), {
            params: t.Object({
                id: t.String()
            })
        })
    );

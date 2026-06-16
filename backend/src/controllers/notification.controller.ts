import {Elysia, t} from "elysia";
import {notificationService} from "../services/notification.service";
import {authPlugin} from "../plugins/auth.plugin";

export const notificationController = new Elysia({prefix: "/notifications"})
    .use(authPlugin)
    /**
     * 获取当前用户的通知列表
     */
    .get("/", async ({getCurrentUser, query, set}) => {
        const user = await getCurrentUser();
        if (!user) {
            set.status = 401;
            return {error: "Unauthorized"};
        }

        return notificationService.getNotifications(user.id, {
            page: query.page ? Number(query.page) : undefined,
            limit: query.limit ? Number(query.limit) : undefined,
            isRead: query.isRead !== undefined ? Number(query.isRead) : undefined
        });
    }, {
        query: t.Object({
            page: t.Optional(t.String()),
            limit: t.Optional(t.String()),
            isRead: t.Optional(t.String()) // "0" or "1"
        })
    })

    /**
     * 获取未读通知数量
     */
    .get("/unread-count", async ({getCurrentUser, set}) => {
        const user = await getCurrentUser();
        if (!user) {
            set.status = 401;
            return {error: "Unauthorized"};
        }

        const count = await notificationService.getUnreadCount(user.id);
        return {count};
    })

    /**
     * 标记通知为已读
     */
    .patch("/:id/read", async ({getCurrentUser, params: {id}, set}) => {
        const user = await getCurrentUser();
        if (!user) {
            set.status = 401;
            return {error: "Unauthorized"};
        }

        return notificationService.markAsRead(Number(id), user.id);
    }, {
        params: t.Object({
            id: t.String()
        })
    })

    /**
     * 全部标记为已读
     */
    .patch("/read-all", async ({getCurrentUser, set}) => {
        const user = await getCurrentUser();
        if (!user) {
            set.status = 401;
            return {error: "Unauthorized"};
        }

        return notificationService.markAllAsRead(user.id);
    })

    /**
     * 删除通知
     */
    .delete("/:id", async ({getCurrentUser, params: {id}, set}) => {
        const user = await getCurrentUser();
        if (!user) {
            set.status = 401;
            return {error: "Unauthorized"};
        }

        return notificationService.deleteNotification(Number(id), user.id);
    }, {
        params: t.Object({
            id: t.String()
        })
    });

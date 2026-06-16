import {db} from "../db";
import {notifications} from "../db/schema";
import {eq, desc, and, count} from "drizzle-orm";

export type Notification = typeof notifications.$inferSelect;
export type NotificationInsert = typeof notifications.$inferInsert;

export class NotificationService {
    // TODO: 外部通知扩展
    // 1. 集成邮件服务 (如 Nodemailer)，支持 SMTP 配置
    // 2. 实现 sendEmail(to, subject, content) 基础方法
    // 3. 在 createNotification 中增加逻辑：根据用户偏好决定是否同步发送邮件提醒
    // 4. 为注册流程增加发送验证码邮件的功能

    /**
     * 获取用户的通知列表
     */
    async getNotifications(userId: number, options: {
        page?: number;
        limit?: number;
        isRead?: number;
    } = {}) {
        const {page = 1, limit = 20, isRead} = options;
        const offset = (page - 1) * limit;

        const whereClauses = [eq(notifications.userId, userId)];
        if (isRead !== undefined) {
            whereClauses.push(eq(notifications.isRead, isRead));
        }

        const where = and(...whereClauses);

        const data = await db.select()
            .from(notifications)
            .where(where)
            .orderBy(desc(notifications.createdAt))
            .limit(limit)
            .offset(offset);

        const totalResult = await db.select({count: count()}).from(notifications).where(where);
        const total = Number(totalResult[0].count);

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    /**
     * 获取未读通知数量
     */
    async getUnreadCount(userId: number) {
        const result = await db.select({count: count()})
            .from(notifications)
            .where(and(
                eq(notifications.userId, userId),
                eq(notifications.isRead, 0)
            ));
        return Number(result[0].count);
    }

    /**
     * 创建通知
     */
    async createNotification(data: NotificationInsert) {
        return await db.insert(notifications).values(data);
    }

    /**
     * 标记通知为已读
     */
    async markAsRead(id: number, userId: number) {
        return await db.update(notifications)
            .set({isRead: 1})
            .where(and(
                eq(notifications.id, id),
                eq(notifications.userId, userId)
            ));
    }

    /**
     * 全部标记为已读
     */
    async markAllAsRead(userId: number) {
        return await db.update(notifications)
            .set({isRead: 1})
            .where(eq(notifications.userId, userId));
    }

    /**
     * 删除通知
     */
    async deleteNotification(id: number, userId: number) {
        return await db.delete(notifications)
            .where(and(
                eq(notifications.id, id),
                eq(notifications.userId, userId)
            ));
    }
}

export const notificationService = new NotificationService();

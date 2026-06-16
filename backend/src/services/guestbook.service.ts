import {db} from "../db";
import {messages, users} from "../db/schema";
import {eq, desc, count} from "drizzle-orm";
import {AIModerator} from "../utils/ai-moderator";

export type Message = typeof messages.$inferSelect;
export type MessageInsert = typeof messages.$inferInsert;

export class GuestbookService {
    /**
     * 获取审核通过的留言列表
     */
    async getApprovedMessages(page = 1, limit = 20) {
        const offset = (page - 1) * limit;

        const data = await db.select({
            message: messages,
            user: {
                id: users.id,
                name: users.name,
                avatar: users.avatar
            }
        })
            .from(messages)
            .leftJoin(users, eq(messages.userId, users.id))
            .where(eq(messages.status, "approved"))
            .orderBy(desc(messages.createdAt))
            .limit(limit)
            .offset(offset);

        return data;
    }

    /**
     * 创建留言
     */
    async createMessage(data: MessageInsert) {
        const [result] = await db.insert(messages).values({
            ...data,
            status: "pending"
        });

        const messageId = result.insertId;

        // 异步 AI 审核
        await this.autoModerate(messageId, data.content);

        return messageId;
    }

    /**
     * AI 审核逻辑
     */
    private async autoModerate(id: number, content: string) {
        const aiResult = await AIModerator.moderate(content);
        
        if (aiResult === "approved") {
            await db.update(messages)
                .set({
                    status: "approved",
                    publishedAt: new Date()
                })
                .where(eq(messages.id, id));
        } else {
            await db.update(messages)
                .set({ status: aiResult })
                .where(eq(messages.id, id));
        }
    }

    /**
     * 管理后台：获取所有留言
     */
    async getAllMessages(page = 1, limit = 20) {
        const offset = (page - 1) * limit;

        const data = await db.select({
            message: messages,
            user: {
                id: users.id,
                name: users.name,
                avatar: users.avatar
            }
        })
            .from(messages)
            .leftJoin(users, eq(messages.userId, users.id))
            .orderBy(desc(messages.createdAt))
            .limit(limit)
            .offset(offset);

        const totalResult = await db.select({count: count()}).from(messages);

        return {
            data,
            total: Number(totalResult[0].count)
        };
    }

    /**
     * 审核留言
     */
    async approveMessage(id: number) {
        return await db.update(messages)
            .set({
                status: "approved",
                publishedAt: new Date()
            })
            .where(eq(messages.id, id));
    }

    /**
     * 删除留言
     */
    async deleteMessage(id: number) {
        return await db.delete(messages).where(eq(messages.id, id));
    }
}

export const guestbookService = new GuestbookService();

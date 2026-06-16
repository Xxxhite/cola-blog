import {db} from "../db";
import {links} from "../db/schema";
import {eq, desc, and} from "drizzle-orm";

export type Link = typeof links.$inferSelect;
export type LinkInsert = typeof links.$inferInsert;

export class LinkService {
    /**
     * 获取所有已审核的友情链接 (前台展示)
     */
    async getApprovedLinks() {
        return await db.select()
            .from(links)
            .where(eq(links.status, "approved"))
            .orderBy(desc(links.sort), desc(links.createdAt));
    }

    /**
     * 获取所有友情链接 (管理后台)
     */
    async getAllLinks() {
        return await db.select()
            .from(links)
            .orderBy(desc(links.createdAt));
    }

    /**
     * 创建友情链接
     */
    async createLink(data: LinkInsert) {
        const [result] = await db.insert(links).values(data);
        const newLink = await db.select().from(links).where(eq(links.id, result.insertId));
        return newLink[0];
    }

    /**
     * 更新友情链接
     */
    async updateLink(id: number, data: Partial<LinkInsert>) {
        await db.update(links).set(data).where(eq(links.id, id));
        const updated = await db.select().from(links).where(eq(links.id, id));
        return updated[0];
    }

    /**
     * 删除友情链接
     */
    async deleteLink(id: number) {
        return await db.delete(links).where(eq(links.id, id));
    }
}

export const linkService = new LinkService();

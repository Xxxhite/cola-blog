import {db} from "../db";
import {tags, postTags} from "../db/schema";
import {eq, count} from "drizzle-orm";

export type Tag = typeof tags.$inferSelect;
export type TagInsert = typeof tags.$inferInsert;

export class TagService {
    /**
     * 获取所有标签
     */
    async getAllTags() {
        return await db.select().from(tags);
    }

    /**
     * 获取所有标签及其关联的文章数量
     */
    async getTagsWithCount() {
        const result = await db.select({
            id: tags.id,
            name: tags.name,
            slug: tags.slug,
            postCount: count(postTags.postId)
        })
            .from(tags)
            .leftJoin(postTags, eq(tags.id, postTags.tagId))
            .groupBy(tags.id);

        return result.map(item => ({
            ...item,
            postCount: Number(item.postCount)
        }));
    }

    /**
     * 根据 ID 获取标签
     */
    async getById(id: number) {
        const result = await db.select().from(tags).where(eq(tags.id, id));
        return result[0] || null;
    }

    /**
     * 根据 Slug 获取标签
     */
    async getBySlug(slug: string) {
        const result = await db.select().from(tags).where(eq(tags.slug, slug));
        return result[0] || null;
    }

    /**
     * 创建标签
     */
    async createTag(data: TagInsert) {
        const [result] = await db.insert(tags).values(data);
        return await this.getById(result.insertId);
    }

    /**
     * 更新标签
     */
    async updateTag(id: number, data: Partial<TagInsert>) {
        await db.update(tags).set(data).where(eq(tags.id, id));
        return await this.getById(id);
    }

    /**
     * 删除标签
     */
    async deleteTag(id: number) {
        // 检查是否有文章关联
        const postRelation = await db.select({count: count()}).from(postTags).where(eq(postTags.tagId, id));
        if (Number(postRelation[0].count) > 0) {
            throw new Error("Cannot delete tag associated with posts");
        }

        return await db.delete(tags).where(eq(tags.id, id));
    }
}

export const tagService = new TagService();

import {db} from "../db";
import {posts, categories, users, postTags, tags} from "../db/schema";
import {eq, desc, and, count, sql, inArray} from "drizzle-orm";

export type Post = typeof posts.$inferSelect;
export type PostInsert = typeof posts.$inferInsert;

export class PostService {
    /**
     * 获取文章列表 (带分页和过滤)
     */
    async getPosts(options: {
        page?: number;
        limit?: number;
        categoryId?: number;
        status?: "draft" | "published" | "archived";
        tagId?: number;
    } = {}) {
        const {page = 1, limit = 10, categoryId, status, tagId} = options;
        const offset = (page - 1) * limit;

        const whereClauses = [];
        if (categoryId) whereClauses.push(eq(posts.categoryId, categoryId));
        if (status) whereClauses.push(eq(posts.status, status));

        // 如果有标签过滤，需要先查出关联的文章 ID
        if (tagId) {
            const postIdsWithTag = await db.select({postId: postTags.postId})
                .from(postTags)
                .where(eq(postTags.tagId, tagId));

            if (postIdsWithTag.length === 0) return {data: [], total: 0};
            whereClauses.push(inArray(posts.id, postIdsWithTag.map(p => p.postId)));
        }

        const where = and(...whereClauses);

        const data = await db.select({
            id: posts.id,
            title: posts.title,
            slug: posts.slug,
            cover: posts.cover,
            status: posts.status,
            views: posts.views,
            createdAt: posts.createdAt,
            publishedAt: posts.publishedAt,
            category: {
                id: categories.id,
                name: categories.name,
                slug: categories.slug
            },
            author: {
                id: users.id,
                name: users.name,
                avatar: users.avatar
            }
        })
            .from(posts)
            .leftJoin(categories, eq(posts.categoryId, categories.id))
            .leftJoin(users, eq(posts.authorId, users.id))
            .where(where)
            .orderBy(desc(posts.createdAt))
            .limit(limit)
            .offset(offset);

        const totalResult = await db.select({count: count()}).from(posts).where(where);
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
     * 根据 ID 获取文章详情
     */
    async getPostById(id: number) {
        const result = await db.select({
            post: posts,
            category: categories,
            author: {
                id: users.id,
                name: users.name,
                avatar: users.avatar,
                bio: users.bio
            }
        })
            .from(posts)
            .leftJoin(categories, eq(posts.categoryId, categories.id))
            .leftJoin(users, eq(posts.authorId, users.id))
            .where(eq(posts.id, id));

        if (result.length === 0) return null;

        // 获取标签
        const postTagsData = await db.select({
            id: tags.id,
            name: tags.name,
            slug: tags.slug
        })
            .from(postTags)
            .innerJoin(tags, eq(postTags.tagId, tags.id))
            .where(eq(postTags.postId, id));

        return {
            ...result[0].post,
            category: result[0].category,
            author: result[0].author,
            tags: postTagsData
        };
    }

    /**
     * 根据 Slug 获取文章详情 (通常用于前端展示)
     */
    async getPostBySlug(slug: string) {
        const result = await db.select({id: posts.id}).from(posts).where(eq(posts.slug, slug));
        if (result.length === 0) return null;
        return await this.getPostById(result[0].id);
    }

    /**
     * 创建文章
     */
    async createPost(data: PostInsert & { tagIds?: number[] }) {
        const {tagIds, ...postData} = data;

        // 如果是发布状态，设置发布时间
        if (postData.status === "published" && !postData.publishedAt) {
            postData.publishedAt = new Date();
        }

        const [result] = await db.insert(posts).values(postData);
        const postId = result.insertId;

        // 处理标签关联
        if (tagIds && tagIds.length > 0) {
            await db.insert(postTags).values(
                tagIds.map(tagId => ({postId, tagId}))
            );
        }

        return await this.getPostById(postId);
    }

    /**
     * 更新文章
     */
    async updatePost(id: number, data: Partial<PostInsert> & { tagIds?: number[] }) {
        const {tagIds, ...postData} = data;

        // 处理发布时间逻辑
        if (postData.status === "published") {
            const current = await db.select({publishedAt: posts.publishedAt}).from(posts).where(eq(posts.id, id));
            if (current[0] && !current[0].publishedAt) {
                postData.publishedAt = new Date();
            }
        }

        await db.update(posts).set(postData).where(eq(posts.id, id));

        // 更新标签 (先删后加)
        if (tagIds !== undefined) {
            await db.delete(postTags).where(eq(postTags.postId, id));
            if (tagIds.length > 0) {
                await db.insert(postTags).values(
                    tagIds.map(tagId => ({postId: id, tagId}))
                );
            }
        }

        return await this.getPostById(id);
    }

    /**
     * 删除文章
     */
    async deletePost(id: number) {
        // 先删除标签关联
        await db.delete(postTags).where(eq(postTags.postId, id));
        // 再删除文章
        return await db.delete(posts).where(eq(posts.id, id));
    }

    /**
     * 增加文章阅读量
     */
    async incrementViews(id: number) {
        return await db.update(posts)
            .set({views: sql.raw("views + 1")})
            .where(eq(posts.id, id));
    }
}

export const postService = new PostService();

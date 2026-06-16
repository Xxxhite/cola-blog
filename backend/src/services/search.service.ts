import {db} from "../db";
import {posts, categories, users, postTags} from "../db/schema";
import {eq, desc, and, count, or, like, inArray} from "drizzle-orm";

export class SearchService {
    /**
     * 搜索文章 (支持标题、内容关键字，以及分类、标签过滤)
     */
    async search(options: {
        keyword?: string;
        page?: number;
        limit?: number;
        categoryId?: number;
        tagId?: number;
    }) {
        const {keyword, page = 1, limit = 10, categoryId, tagId} = options;
        const offset = (page - 1) * limit;

        const whereClauses = [];

        // 搜索关键词 (标题 or 内容)
        if (keyword) {
            whereClauses.push(or(
                like(posts.title, `%${keyword}%`),
                like(posts.content, `%${keyword}%`)
            ));
        }

        // 仅搜索已发布的文章
        whereClauses.push(eq(posts.status, "published"));

        // 分类过滤
        if (categoryId) {
            whereClauses.push(eq(posts.categoryId, categoryId));
        }

        // 标签过滤
        if (tagId) {
            const postIdsWithTag = await db.select({postId: postTags.postId})
                .from(postTags)
                .where(eq(postTags.tagId, tagId));

            if (postIdsWithTag.length === 0) {
                return {
                    data: [],
                    total: 0,
                    page,
                    limit,
                    totalPages: 0
                };
            }
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
            .orderBy(desc(posts.publishedAt))
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
}

export const searchService = new SearchService();

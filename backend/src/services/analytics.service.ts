import {db} from "../db";
import {posts, comments, users, categories, tags} from "../db/schema";
import {eq, count, sql, desc, gte} from "drizzle-orm";

export class AnalyticsService {
    /**
     * 获取系统概览数据
     */
    async getOverview() {
        const [postCountResult] = await db.select({count: count()}).from(posts);
        const [commentCountResult] = await db.select({count: count()}).from(comments);
        const [userCountResult] = await db.select({count: count()}).from(users);
        const [categoryCountResult] = await db.select({count: count()}).from(categories);
        const [tagCountResult] = await db.select({count: count()}).from(tags);
        
        // Use coalesce to handle null from sum()
        const [viewCountResult] = await db.select({
            totalViews: sql<number>`COALESCE(sum(${posts.views}), 0)`
        }).from(posts);
        
        const [wordCountResult] = await db.select({
            totalWords: sql<number>`COALESCE(sum(${posts.wordCount}), 0)`
        }).from(posts);
        
        // 统计待审核的评论
        const [pendingCommentsResult] = await db.select({count: count()}).from(comments).where(eq(comments.status, "pending"));

        // 计算运行天数 (从第一个用户注册开始)
        const [earliestUser] = await db.select({createdAt: users.createdAt}).from(users).orderBy(sql`${users.createdAt}`).limit(1);
        let runningDays = 0;
        if (earliestUser && earliestUser.createdAt) {
            const diffTime = Math.abs(new Date().getTime() - new Date(earliestUser.createdAt).getTime());
            runningDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        return {
            totalPosts: Number(postCountResult.count),
            totalComments: Number(commentCountResult.count),
            totalUsers: Number(userCountResult.count),
            totalCategories: Number(categoryCountResult.count),
            totalTags: Number(tagCountResult.count),
            totalViews: Number(viewCountResult.totalViews || 0),
            totalWords: Number(wordCountResult.totalWords || 0),
            pendingComments: Number(pendingCommentsResult.count),
            runningDays
        };
    }

    /**
     * 获取热门文章 (按阅读量排序)
     */
    async getTrendingPosts(limit = 10) {
        return await db.select({
            id: posts.id,
            title: posts.title,
            slug: posts.slug,
            views: posts.views,
            publishedAt: posts.publishedAt
        })
            .from(posts)
            .where(eq(posts.status, "published"))
            .orderBy(desc(posts.views))
            .limit(limit);
    }

    /**
     * 获取最近 7 天的文章发布和评论趋势 (示意逻辑)
     */
    async getWeeklyTrends() {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // 统计每天的文章数
        const postTrends = await db.select({
            date: sql<string>`DATE(${posts.createdAt})`,
            count: count()
        })
            .from(posts)
            .where(gte(posts.createdAt, sevenDaysAgo))
            .groupBy(sql`DATE(${posts.createdAt})`);

        // 统计每天的评论数
        const commentTrends = await db.select({
            date: sql<string>`DATE(${comments.createdAt})`,
            count: count()
        })
            .from(comments)
            .where(gte(comments.createdAt, sevenDaysAgo))
            .groupBy(sql`DATE(${comments.createdAt})`);

        return {
            posts: postTrends,
            comments: commentTrends
        };
    }
}

export const analyticsService = new AnalyticsService();

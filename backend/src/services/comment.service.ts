import {db} from "../db";
import {comments, users} from "../db/schema";
import {eq, and, asc, desc, count} from "drizzle-orm";
import {AIModerator} from "../utils/ai-moderator";

export type Comment = typeof comments.$inferSelect;
export type CommentInsert = typeof comments.$inferInsert;

export interface CommentTreeItem extends Comment {
    user: {
        id: number;
        name: string;
        avatar: string | null;
    } | null;
    replies: CommentTreeItem[];
}

export class CommentService {
    /**
     * 获取指定文章的评论树
     */
    async getCommentsByPostId(postId: number) {
        // 获取该文章下所有审核通过的评论
        const allComments = await db.select({
            comment: comments,
            user: {
                id: users.id,
                name: users.name,
                avatar: users.avatar
            }
        })
            .from(comments)
            .leftJoin(users, eq(comments.userId, users.id))
            .where(and(
                eq(comments.postId, postId),
                eq(comments.status, "approved")
            ))
            .orderBy(asc(comments.createdAt));

        const commentMap = new Map<number, CommentTreeItem>();
        const roots: CommentTreeItem[] = [];

        // 第一遍：创建节点并关联用户信息
        allComments.forEach(({comment, user}) => {
            commentMap.set(comment.id, {
                ...comment,
                user: user?.id ? user as any : null,
                replies: []
            });
        });

        // 第二遍：构建树形结构
        allComments.forEach(({comment}) => {
            const item = commentMap.get(comment.id)!;
            if (comment.parentId && commentMap.has(comment.parentId)) {
                commentMap.get(comment.parentId)!.replies.push(item);
            } else {
                roots.push(item);
            }
        });

        return roots;
    }

    /**
     * 创建新评论
     */
    async createComment(data: CommentInsert) {
        // 默认状态为 pending (待审核)
        const [result] = await db.insert(comments).values({
            ...data,
            status: data.status || "pending"
        });

        const commentId = result.insertId;

        // 异步执行 AI 审核，不阻塞当前请求
        this.autoModerate(commentId, data.content);

        const newComment = await db.select().from(comments).where(eq(comments.id, commentId));
        return newComment[0];
    }

    /**
     * AI 自动审核逻辑
     */
    private async autoModerate(commentId: number, content: string) {
        const aiResult = await AIModerator.moderate(content);
        
        if (aiResult === "approved") {
            await this.approveComment(commentId);
        } else {
            // 如果是 spam 或 rejected，直接更新状态
            await db.update(comments)
                .set({ status: aiResult })
                .where(eq(comments.id, commentId));
        }
    }

    /**
     * 审核评论
     */
    async approveComment(id: number) {
        return await db.update(comments)
            .set({
                status: "approved",
                publishedAt: new Date()
            })
            .where(eq(comments.id, id));
    }

    /**
     * 删除评论
     */
    async deleteComment(id: number) {
        // 如果删除父评论，其子评论的处理逻辑可以根据业务决定
        // 这里采用简单的直接删除逻辑，或你可以选择先检查是否有子评论
        return await db.delete(comments).where(eq(comments.id, id));
    }

    /**
     * 获取文章评论总数
     */
    async getCommentCountByPostId(postId: number) {
        const result = await db.select({count: count()})
            .from(comments)
            .where(and(
                eq(comments.postId, postId),
                eq(comments.status, "approved")
            ));
        return Number(result[0].count);
    }

    /**
     * 管理后台使用：获取所有评论列表 (分页)
     */
    async getAllComments(page = 1, limit = 20) {
        const offset = (page - 1) * limit;

        const data = await db.select({
            comment: comments,
            user: {
                id: users.id,
                name: users.name,
                avatar: users.avatar
            }
        })
            .from(comments)
            .leftJoin(users, eq(comments.userId, users.id))
            .orderBy(desc(comments.createdAt))
            .limit(limit)
            .offset(offset);

        const totalResult = await db.select({count: count()}).from(comments);

        return {
            data,
            total: Number(totalResult[0].count)
        };
    }
}

export const commentService = new CommentService();

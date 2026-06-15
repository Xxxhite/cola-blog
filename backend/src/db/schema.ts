import {
    mysqlTable,
    varchar,
    timestamp,
    text,
    mysqlEnum,
    int,
    bigint,
    AnyMySqlColumn
} from "drizzle-orm/mysql-core";

/**
 * 用户表 (Users)
 * 存储系统的用户信息、权限及认证资料
 */
export const users = mysqlTable("users", {
    // 主键 ID，使用 bigint 保证与外键类型一致
    id: bigint("id", {mode: "number"}).primaryKey().autoincrement(),
    // 用户显示名称 (昵称)
    name: varchar("name", {length: 255}).notNull(),
    // 唯一邮箱地址，用于登录和通知
    email: varchar("email", {length: 255}).notNull().unique(),
    // 用户头像 URL 地址
    avatar: varchar("avatar", {length: 500}),

    // 用户权限角色: 
    // - 'admin': 管理员，拥有全站管理权限
    // - 'user': 普通用户，仅能评论或修改个人资料
    role: mysqlEnum("role", ["admin", "user"]).default("user").notNull(),

    // 账号状态: 
    // - 'active': 正常激活状态
    // - 'banned': 已封禁，无法登录或操作
    status: mysqlEnum("status", ["active", "banned"]).default("active").notNull(),

    // 个人简介 (Markdown 格式)
    bio: text("bio"),

    // 账号创建时间
    createdAt: timestamp("created_at").defaultNow(),
    // 最后一次修改资料的时间，更新时自动变更
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),

    // 加密后的密码哈希值 (使用 bcrypt 或 argon2 存储)
    password: varchar("password", {length: 255}).notNull(),
});

/**
 * 文章分类表 (Categories)
 * 采用树形结构支持多级嵌套分类
 */
export const categories = mysqlTable("categories", {
    // 分类 ID
    id: bigint("id", {mode: "number"}).primaryKey().autoincrement(),
    // 分类展示名称
    name: varchar("name", {length: 255}).notNull().unique(),
    // URL 别名 (Slug)，例如: "web-development"
    slug: varchar("slug", {length: 255}).notNull().unique(),
    // 分类描述
    description: varchar("description", {length: 500}),

    // 自关联父级 ID: 用于构建树形结构
    // 为 NULL 时表示顶级分类
    parentId: bigint("parent_id", {mode: "number"}).references((): AnyMySqlColumn => categories.id),

    // 祖先路径 (枚举路径): 存储如 "1,3,5"，方便快速查询某分类下的所有后代
    ancestor: varchar("ancestor", {length: 255}),

    // 当前分类在树中的层级深度 (0 为顶层)
    level: int("level").default(0).notNull(),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

/**
 * 文章表 (Posts)
 * 存储博客的核心内容 (Markdown 格式)
 */
export const posts = mysqlTable("posts", {
    // 文章主键 ID
    id: bigint("id", {mode: "number"}).primaryKey().autoincrement(),
    // URL 唯一标识，例如: "how-to-use-drizzle"
    slug: varchar("slug", {length: 255}).notNull().unique(),
    // 文章标题
    title: varchar("title", {length: 255}).notNull(),
    // Markdown 源码内容
    content: text("content").notNull(),
    // 文章封面图 URL
    cover: varchar("cover", {length: 500}),

    // 文章状态:
    // - 'draft': 草稿，仅作者可见
    // - 'published': 已发布，全站公开可见
    // - 'archived': 已归档，不出现在首页列表，但保留访问路径
    status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),

    // 累积浏览量
    views: int("views").default(0).notNull(),

    // 外键关联分类 ID: 多对一关系，每篇文章属于一个分类
    categoryId: bigint("category_id", {mode: "number"}).references(() => categories.id),

    // 外键关联作者 ID: 多对一关系，关联 users 表
    authorId: bigint("author_id", {mode: "number"}).references(() => users.id).notNull(),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),

    // 实际对外正式发布的时间
    publishedAt: timestamp("published_at"),
});

/**
 * 标签表 (Tags)
 */
export const tags = mysqlTable("tags", {
    id: bigint("id", {mode: "number"}).primaryKey().autoincrement(),
    // 标签名称，例如: "Vue"
    name: varchar("name", {length: 255}).notNull().unique(),
    // 标签 URL 别名，例如: "vue-js"
    slug: varchar("slug", {length: 255}).notNull().unique(),
});

/**
 * 文章与标签的中间表 (Post-Tag Relationship)
 * 维护 Posts 与 Tags 之间的多对多关系
 */
export const postTags = mysqlTable("post_tags", {
    // 关联文章 ID
    postId: bigint("post_id", {mode: "number"}).references(() => posts.id).notNull(),
    // 关联标签 ID
    tagId: bigint("tag_id", {mode: "number"}).references(() => tags.id).notNull(),
});

/**
 * 评论表 (Comments)
 * 支持对文章进行评论以及评论间的回复 (二级或树形结构)
 */
export const comments = mysqlTable("comments", {
    // 评论 ID
    id: bigint("id", {mode: "number"}).primaryKey().autoincrement(),
    // 评论正文 (Markdown 或纯文本)
    content: text("content").notNull(),

    // 关联文章 ID
    postId: bigint("post_id", {mode: "number"}).references(() => posts.id).notNull(),

    // 关联用户 ID: 
    // 要求有关联用户才能发表评论
    userId: bigint("user_id", {mode: "number"}).references(() => users.id).notNull(),

    // 自关联父评论 ID: 
    // 指向被回复的评论 ID。为 NULL 时表示直接对文章的评论
    parentId: bigint("parent_id", {mode: "number"}).references((): AnyMySqlColumn => comments.id),

    // 评论审核状态:
    // - 'pending': 待审核，不显示
    // - 'approved': 审核通过，对外展示
    // - 'spam': 垃圾评论，自动拦截或手动标记
    status: mysqlEnum("status", ["pending", "approved", "spam"]).default("pending").notNull(),

    createdAt: timestamp("created_at").defaultNow(),
    // 发布/审核通过时间
    publishedAt: timestamp("published_at"),
});

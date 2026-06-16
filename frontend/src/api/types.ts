/**
 * 核心实体类型定义
 */

export interface User {
    id: number
    name: string
    email: string
    avatar?: string
    role: 'admin' | 'user'
    status: 'active' | 'banned'
    bio?: string
    createdAt: string
    updatedAt: string
}

export interface Category {
    id: number
    name: string
    slug: string
    description?: string
    parentId?: number
    ancestor?: string
    level: number
    createdAt: string
    updatedAt: string
}

export interface Post {
    id: number
    slug: string
    title: string
    content: string
    cover?: string
    status: 'draft' | 'published' | 'archived'
    type: 'post' | 'moment'
    wordCount: number
    readingTime: number
    views: number
    categoryId?: number
    authorId: number
    createdAt: string
    updatedAt: string
    publishedAt?: string
    // 关联字段 (根据后端 Service 可能返回的数据)
    category?: Category
    author?: User
    tags?: Tag[]
}

export interface Tag {
    id: number
    name: string
    slug: string
    postCount?: number
}

export interface Comment {
    id: number
    content: string
    postId: number
    userId: number
    parentId?: number
    status: 'pending' | 'approved' | 'spam'
    createdAt: string
    publishedAt?: string
    user?: User
    replies?: Comment[]
}

export interface Link {
    id: number
    name: string
    url: string
    logo?: string
    description?: string
    sort: number
    status: 'pending' | 'approved' | 'rejected'
    createdAt: string
}

export interface Notification {
    id: number
    userId: number
    type: 'comment' | 'reply' | 'system'
    title: string
    content: string
    isRead: number
    targetId?: number
    targetType?: string
    createdAt: string
}

export interface Message {
    id: number
    content: string
    userId: number
    status: 'pending' | 'approved' | 'spam'
    createdAt: string
    publishedAt?: string
    user?: User
}

export interface AnalyticsOverview {
    posts: number
    comments: number
    users: number
    views: number
}

export interface WeeklyTrend {
    date: string
    posts: number
    comments: number
    views: number
}

export interface ApiResponse<T = any> {
    data: T
    error?: string
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    limit: number
    totalPages: number
}

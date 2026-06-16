import {db} from "../db";
import {users} from "../db/schema";
import {eq, desc} from "drizzle-orm";

export class UserService {
    /**
     * 获取所有用户
     */
    async getAllUsers() {
        return await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            avatar: users.avatar,
            role: users.role,
            status: users.status,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt
        }).from(users).orderBy(desc(users.createdAt));
    }

    /**
     * 更新用户状态 (封禁/解封)
     */
    async updateUserStatus(id: number, status: "active" | "banned") {
        return await db.update(users)
            .set({status, updatedAt: new Date()})
            .where(eq(users.id, id));
    }

    /**
     * 更新用户角色
     */
    async updateUserRole(id: number, role: "admin" | "user") {
        return await db.update(users)
            .set({role, updatedAt: new Date()})
            .where(eq(users.id, id));
    }

    /**
     * 删除用户
     */
    async deleteUser(id: number) {
        return await db.delete(users).where(eq(users.id, id));
    }
}

export const userService = new UserService();

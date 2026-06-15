import {db} from "../db";
import {users} from "../db/schema";
import {eq} from "drizzle-orm";

export type User = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;

export class AuthService {
    /**
     * 用户注册
     */
    async register(data: UserInsert) {
        // 检查邮箱是否已存在
        const existing = await db.select().from(users).where(eq(users.email, data.email));
        if (existing.length > 0) {
            throw new Error("Email already registered");
        }

        // 密码加密 (使用 Bun 内置的高性能加密)
        const hashedPassword = await Bun.password.hash(data.password);

        const [result] = await db.insert(users).values({
            ...data,
            password: hashedPassword,
            role: data.role || "user",
            status: "active"
        });

        return await this.getUserProfile(result.insertId);
    }

    /**
     * 用户登录验证
     */
    async login(email: string, password: string) {
        const result = await db.select().from(users).where(eq(users.email, email));
        const user = result[0];

        if (!user) {
            throw new Error("Invalid email or password");
        }

        // 验证密码
        const isPasswordValid = await Bun.password.verify(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }

        if (user.status === "banned") {
            throw new Error("Account has been banned");
        }

        // 返回脱敏后的用户信息
        const {password: _, ...profile} = user;
        return profile;
    }

    /**
     * 获取用户信息 (脱敏)
     */
    async getUserProfile(id: number) {
        const result = await db.select().from(users).where(eq(users.id, id));
        if (result.length === 0) return null;

        const {password, ...profile} = result[0];
        return profile;
    }
}

export const authService = new AuthService();

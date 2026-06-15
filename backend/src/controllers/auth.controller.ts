import {Elysia, t} from "elysia";
import {jwt} from "@elysiajs/jwt";
import {authService} from "../services/auth.service";

export const authController = new Elysia({prefix: "/auth"})
    .use(
        jwt({
            name: "jwt",
            secret: process.env.JWT_SECRET || "cola-blog-secret-key",
            exp: "7d"
        })
    )
    /**
     * 用户注册
     */
    .post("/register", async ({body, set}) => {
        try {
            return await authService.register(body);
        } catch (error: any) {
            set.status = 400;
            return {error: error.message};
        }
    }, {
        body: t.Object({
            name: t.String(),
            email: t.String(),
            password: t.String(),
            avatar: t.Optional(t.String()),
            bio: t.Optional(t.String())
        })
    })

    /**
     * 用户登录
     */
    .post("/login", async ({body, jwt, set}) => {
        try {
            const user = await authService.login(body.email, body.password);

            // 生成 Token
            const token = await jwt.sign({
                id: user.id,
                role: user.role
            });

            return {
                user,
                token
            };
        } catch (error: any) {
            set.status = 401;
            return {error: error.message};
        }
    }, {
        body: t.Object({
            email: t.String(),
            password: t.String()
        })
    })

    /**
     * 获取当前登录用户信息
     */
    .get("/me", async ({jwt, headers, set}) => {
        const authHeader = headers['authorization'];
        if (!authHeader?.startsWith('Bearer ')) {
            set.status = 401;
            return {error: "Unauthorized"};
        }

        const token = authHeader.split(' ')[1];
        const payload = await jwt.verify(token);

        if (!payload) {
            set.status = 401;
            return {error: "Invalid token"};
        }

        const user = await authService.getUserProfile(payload.id as number);
        if (!user) {
            set.status = 404;
            return {error: "User not found"};
        }

        return user;
    });

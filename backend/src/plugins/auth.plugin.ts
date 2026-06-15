import {Elysia} from "elysia";
import {jwt} from "@elysiajs/jwt";
import {authService} from "../services/auth.service";

/**
 * 认证插件
 */
export const authPlugin = new Elysia({name: 'auth'})
    .use(
        jwt({
            name: "jwt",
            secret: process.env.JWT_SECRET || "cola-blog-secret-key",
            exp: "7d"
        })
    )
    .derive({as: 'global'}, async ({jwt, headers}) => {
        const getCurrentUser = async () => {
            const authHeader = headers['authorization'];
            if (!authHeader?.startsWith('Bearer ')) {
                return null;
            }

            const token = authHeader.split(' ')[1];
            const payload = await jwt.verify(token);

            if (!payload || !payload.id) {
                return null;
            }

            return await authService.getUserProfile(payload.id as number);
        };

        return {
            getCurrentUser
        };
    })
    .macro(({onBeforeHandle}) => ({
        isAuth(enabled: boolean) {
            if (!enabled) return;

            onBeforeHandle(async ({getCurrentUser, set}: any) => {
                const user = await getCurrentUser();
                if (!user) {
                    set.status = 401;
                    return {error: "Unauthorized: Please login first"};
                }
            });
        },
        isAdmin(enabled: boolean) {
            if (!enabled) return;

            onBeforeHandle(async ({getCurrentUser, set}: any) => {
                const user = await getCurrentUser();
                if (!user || user.role !== "admin") {
                    set.status = 403;
                    return {error: "Forbidden: Admin access required"};
                }
            });
        }
    }));

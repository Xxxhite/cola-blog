import {Elysia, t} from "elysia";
import {userService} from "../services/user.service";
import {authPlugin} from "../plugins/auth.plugin";

export const userController = new Elysia({prefix: "/users"})
    .use(authPlugin)
    .guard({
        isAdmin: true
    }, (app) => app
        /**
         * 获取所有用户 (仅限管理员)
         */
        .get("/", async () => {
            return await userService.getAllUsers();
        })

        /**
         * 更新用户状态 (封禁/解封)
         */
        .patch("/:id/status", async ({params: {id}, body: {status}}) => {
            return await userService.updateUserStatus(Number(id), status);
        }, {
            body: t.Object({
                status: t.Union([t.Literal("active"), t.Literal("banned")])
            })
        })

        /**
         * 更新用户角色
         */
        .patch("/:id/role", async ({params: {id}, body: {role}}) => {
            return await userService.updateUserRole(Number(id), role);
        }, {
            body: t.Object({
                role: t.Union([t.Literal("admin"), t.Literal("user")])
            })
        })

        /**
         * 删除用户
         */
        .delete("/:id", async ({params: {id}}) => {
            return await userService.deleteUser(Number(id));
        })
    );

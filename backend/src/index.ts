import { Elysia } from "elysia";
import { cors } from '@elysiajs/cors'
import { staticPlugin } from '@elysiajs/static'
import { apiRouter } from "./router";

const app = new Elysia()
    .use(cors())
    .use(staticPlugin({
        assets: "public",
        prefix: ""
    }))
    .get("/", () => "Hello Elysia")
    .use(apiRouter)
    .listen(5199);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

import { Elysia } from "elysia";
import { cors } from '@elysiajs/cors'

const app = new Elysia()
    .use(cors())
    .get("/", () => "Hello Elysia")
    .listen(5199);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

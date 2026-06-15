import { Elysia } from "elysia";
import { cors } from '@elysiajs/cors'
import { categoryController } from "./controllers/category.controller";

const app = new Elysia()
    .use(cors())
    .get("/", () => "Hello Elysia")
    .use(categoryController)
    .listen(5199);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

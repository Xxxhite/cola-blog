import {Elysia} from "elysia";
import {categoryController} from "./category.controller";
import {postController} from "./post.controller";

export const apiRouter = new Elysia({prefix: "/api"})
    .use(categoryController)
    .use(postController);
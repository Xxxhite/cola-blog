import {Elysia} from "elysia";
import {categoryController} from "./controllers/category.controller.ts";
import {postController} from "./controllers/post.controller.ts";
import {tagController} from "./controllers/tag.controller.ts";
import {commentController} from "./controllers/comment.controller.ts";

export const apiRouter = new Elysia({prefix: "/api"})
    .use(categoryController)
    .use(postController)
    .use(tagController)
    .use(commentController);
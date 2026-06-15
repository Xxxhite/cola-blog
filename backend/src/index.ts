import {Elysia} from "elysia";
import {cors} from '@elysiajs/cors'
import {apiRouter} from "./controllers/routes";

const app = new Elysia()
    .use(cors())
    .get("/", () => "Hello Elysia")
    .use(apiRouter)
    .listen(5199);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

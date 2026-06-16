import {Elysia, t} from "elysia";
import {searchService} from "../services/search.service";

export const searchController = new Elysia({prefix: "/search"})
    /**
     * 搜索文章 (接收关键字、分页参数，返回文章结果)
     */
    .get("/", ({query}) => {
        return searchService.search({
            keyword: query.q,
            page: query.page ? Number(query.page) : undefined,
            limit: query.limit ? Number(query.limit) : undefined,
            categoryId: query.categoryId ? Number(query.categoryId) : undefined,
            tagId: query.tagId ? Number(query.tagId) : undefined
        });
    }, {
        query: t.Object({
            q: t.Optional(t.String()),
            page: t.Optional(t.String()),
            limit: t.Optional(t.String()),
            categoryId: t.Optional(t.String()),
            tagId: t.Optional(t.String())
        })
    });

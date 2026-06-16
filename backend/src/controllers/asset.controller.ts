import {Elysia} from "elysia";
import {assetService} from "../services/asset.service";

export const assetController = new Elysia({prefix: "/assets"})
    /**
     * 获取背景图片列表
     */
    .get("/backgrounds", async () => {
        return await assetService.getBackgroundImages();
    });

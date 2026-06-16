import {db} from "../db";
import {settings} from "../db/schema";
import {eq, inArray} from "drizzle-orm";

export class SettingsService {
    /**
     * 获取所有设置项
     */
    async getAllSettings() {
        const result = await db.select().from(settings);
        // 转换为对象格式 { key: value }
        return result.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>);
    }

    /**
     * 更新或创建设置项
     */
    async updateSettings(data: Record<string, string>) {
        for (const [key, value] of Object.entries(data)) {
            // 使用 MySQL 的 ON DUPLICATE KEY UPDATE 逻辑 (Drizzle insert.onDuplicateKeyUpdate)
            await db.insert(settings)
                .values({ key, value })
                .onDuplicateKeyUpdate({
                    set: { value }
                });
        }
        return await this.getAllSettings();
    }

    /**
     * 根据键获取单个设置
     */
    async getSettingByKey(key: string) {
        const result = await db.select().from(settings).where(eq(settings.key, key));
        return result[0]?.value || null;
    }
}

export const settingsService = new SettingsService();

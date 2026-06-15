import {db} from "../db";
import {categories, posts} from "../db/schema";
import {eq, sql, count, like, or} from "drizzle-orm";

export type Category = typeof categories.$inferSelect;
export type CategoryInsert = typeof categories.$inferInsert;

export type CategoryTreeItem = Category & {
    children: CategoryTreeItem[];
};

export class CategoryService {
    /**
     * 获取所有分类 (平铺列表)
     */
    async getAllCategories() {
        return await db.select().from(categories);
    }

    /**
     * 获取分类树形结构
     */
    async getCategoryTree(): Promise<CategoryTreeItem[]> {
        const allCategories = await this.getAllCategories();
        const categoryMap = new Map<number, CategoryTreeItem>();
        const roots: CategoryTreeItem[] = [];

        // 第一遍：创建节点映射
        allCategories.forEach(cat => {
            categoryMap.set(cat.id, {...cat, children: []});
        });

        // 第二遍：构建父子关系
        allCategories.forEach(cat => {
            const item = categoryMap.get(cat.id)!;
            if (cat.parentId && categoryMap.has(cat.parentId)) {
                categoryMap.get(cat.parentId)!.children.push(item);
            } else {
                roots.push(item);
            }
        });

        return roots;
    }

    /**
     * 根据 ID 获取单个分类
     */
    async getById(id: number) {
        const result = await db.select().from(categories).where(eq(categories.id, id));
        return result[0] || null;
    }

    /**
     * 根据 Slug 获取单个分类
     */
    async getBySlug(slug: string) {
        const result = await db.select().from(categories).where(eq(categories.slug, slug));
        return result[0] || null;
    }

    /**
     * 创建新分类
     */
    async createCategory(data: CategoryInsert) {
        let level = 0;
        let ancestor = "";

        // 如果指定了父级，计算 level 和 ancestor
        if (data.parentId) {
            const parent = await this.getById(data.parentId);
            if (parent) {
                level = parent.level + 1;
                ancestor = parent.ancestor ? `${parent.ancestor},${parent.id}` : `${parent.id}`;
            }
        }

        const [result] = await db.insert(categories).values({
            ...data,
            level,
            ancestor
        });

        return await this.getById(result.insertId);
    }

    /**
     * 更新分类
     */
    async updateCategory(id: number, data: Partial<CategoryInsert>) {
        const current = await this.getById(id);
        if (!current) throw new Error("Category not found");

        let updateData = {...data};

        // 如果父级发生了变化，重新计算 level 和 ancestor
        if (data.parentId !== undefined && data.parentId !== current.parentId) {
            if (data.parentId === null) {
                updateData.level = 0;
                updateData.ancestor = "";
            } else {
                if (data.parentId === id) throw new Error("Cannot set category as its own parent");
                
                const parent = await this.getById(data.parentId);
                if (parent) {
                    // 检查是否将父级设置成了自己的子孙（防止环）
                    if (parent.ancestor?.split(',').includes(id.toString())) {
                        throw new Error("Cannot set a descendant as parent");
                    }

                    updateData.level = parent.level + 1;
                    updateData.ancestor = parent.ancestor ? `${parent.ancestor},${parent.id}` : `${parent.id}`;
                }
            }
        }

        await db.update(categories).set(updateData).where(eq(categories.id, id));
        return await this.getById(id);
    }

    /**
     * 删除分类
     */
    async deleteCategory(id: number) {
        // 1. 检查是否有子分类
        const children = await db.select({ count: count() }).from(categories).where(eq(categories.parentId, id));
        if (Number(children[0].count) > 0) {
            throw new Error("Cannot delete category with children");
        }

        // 2. 检查是否有文章关联
        const postCount = await db.select({ count: count() }).from(posts).where(eq(posts.categoryId, id));
        if (Number(postCount[0].count) > 0) {
            throw new Error("Cannot delete category associated with posts");
        }

        return await db.delete(categories).where(eq(categories.id, id));
    }

    /**
     * 获取指定分类的所有子孙分类 ID
     */
    async getDescendantIds(id: number): Promise<number[]> {
        const descendants = await db.select({ id: categories.id })
            .from(categories)
            .where(
                or(
                    eq(categories.parentId, id),
                    like(categories.ancestor, `${id}`),
                    like(categories.ancestor, `%,${id}`),
                    like(categories.ancestor, `${id},%`),
                    like(categories.ancestor, `%,${id},%`)
                )
            );
        return descendants.map(d => d.id);
    }
}

export const categoryService = new CategoryService();
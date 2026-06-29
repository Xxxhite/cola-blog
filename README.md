# 🥤 可乐的个人空间 (Cola's Blog)

> 🤖 **Note:** 本 README 文档由 AI 协助生成。

这是一个基于 [Astro](https://astro.build/) 框架和 [Mizuki](https://github.com/mizuki-project/mizuki) 主题进行深度二次开发的个人博客项目。项目采用了 Monorepo 的结构，分为前端界面展示与规划中的后端服务。

## ✨ 特性 (Features)

*   **⚡️ 极致性能**：由 Astro 驱动的静态站点生成 (SSG)，配合子集字体动态压缩，首屏加载极快。
*   **📱 响应式与多语言**：完美适配移动端与桌面端，并提供简、繁、英、日四种语言的深度定制 i18n 支持。
*   **🎨 深度定制的 UI**：对原主题进行了视觉和交互上的打磨，包括侧边栏固定宽度调整、更具诗意的文案提示，以及贴合个人审美的交互动画。
*   **📚 多维度的内容记录**：支持 Markdown/MDX 撰写长文，并集成了独立的「日记 (Memos)」、「番剧」、「相册」及「时间轴」等特色页面。
*   **🔒 隐私保护**：针对特定的生活碎片提供页面级密码保护功能。（虽然你想看也有办法看到）

## 📂 目录结构 (Structure)

本仓库目前包含两大部分：

```text
cola-blog/
├── frontend/           # 博客前端应用 (Astro)
│   ├── src/content/    # 📝 你的所有 Markdown 文章和草稿存放地
│   ├── src/config/     # ⚙️ 博客的核心全局配置文件 (siteConfig.ts 等)
│   └── src/i18n/       # 🌐 多语言文案配置文件
└── backend/            # 后端服务代码 (🚧 WIP)
```

## 🚀 本地开发指南 (Local Development)

目前生产环境主要运行的是 `frontend` 前端部分。

### 1. 安装依赖

进入前端目录并使用 `pnpm` 安装依赖：
```bash
cd frontend
pnpm install
```

### 2. 启动本地预览

```bash
pnpm run dev
```
启动后可在浏览器访问 `http://localhost:4321` 进行实时预览，支持热更新。

### 3. 字体压缩 (重要 ❗️)

本项目开启了**字体子集优化**。每次新建文章或在配置中加入了新的中文字符后，如果你要在本地预览完整字体效果，请运行字体压缩命令：

```bash
pnpm run compress-fonts
```
*(注：如果代码推送至云端，CI/CD 在执行 `pnpm run build` 打包时会自动触发此扫描脚本，线上环境无需担心缺字。)*

## 🛠️ 关于后端服务 (Backend Integration)

> **Status: Work In Progress (🚧 建设中)**

仓库中的 `backend/` 目录为规划中的后端服务模块。
目前博客以纯静态生成 (SSG) 模式运行在前端架构上。该后端的引入是为了在未来支持更多的动态交互需求（例如自定义的数据源 API、访客统计、动态留言或个人的无头 CMS 管理等）。当前该模块处于建设状态，尚未正式接入前端的生产环境。

## 📜 鸣谢与版权 (License & Acknowledgments)

*   **框架支持**：[Astro](https://astro.build/)
*   **主题来源**：[Mizuki](https://github.com/matsuzaka-yuki/Mizuki)

**版权声明：**
本项目代码部分的修改遵循原主题的开源协议。

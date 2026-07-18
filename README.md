#  Yutachi 


```markdown
# 🌙 Yutachi Theme

> 一个基于 Astro 构建的极简、高性能、注重阅读体验的博客主题。

[![Astro](https://img.shields.io/badge/Astro-4.x-FF5D01?style=flat&logo=astro&logoColor=white)](https://astro.build/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

![Yutachi 预览图](./public/photo/cover.png) <!-- 这里放一张你博客最漂亮的全屏截图 -->

Yutachi 去除了繁杂的视觉干扰，将注意力完全还给文字本身。通过极致的性能优化与平滑的视图过渡，为读者提供如翻阅纸质书般的沉浸体验。

## ✨ 核心特性

- **🚀 极致性能**：基于 Astro 视图过渡（View Transitions），实现无缝的页面切换与折叠动画。
- **📝 多维写作**：内置 `文`（长篇）、`思`（碎片）、`记`（随笔）三个独立维度的归档过滤系统。
- ** Notion 整合**：支持本地 Markdown 与 Notion API 双源驱动，随心选择你的写作平台。
- **💬 无感评论**：深度定制的 Waline V3 评论区，无边框设计，完美融入页面背景。
- **🧭 智能阅读仪**：右侧悬浮动态大纲与滚动数轴，支持 Scroll Spy（阅读进度自动追踪）。
- **🎨 纯粹排版**：精心调优的 Serif（衬线）字体排版与毛玻璃（Glassmorphism） UI 细节。

## 📦 快速开始

### 1. 获取主题
你可以通过克隆仓库来开始你的项目：

```bash
git clone [https://github.com/你的用户名/Yutachi.git](https://github.com/你的用户名/Yutachi.git) my-blog
cd my-blog

```

### 2. 安装依赖

推荐使用 `pnpm` 进行依赖管理：

```bash
pnpm install

```

### 3. 本地启动

```bash
pnpm dev

```

打开浏览器访问 `http://localhost:4321`，即可看到你的本地环境。

## ⚙️ 配置指南

### 站点基础信息

打开 `src/data/homeData.json`（或相应的配置文件），修改你的个人信息：

```json
{
  "title": "Your Name",
  "description": "Your blog description",
  "author": "Your Name"
}

```

### 评论区 (Waline) 设置

本主题内置了高度定制的 Waline 评论。请在 `src/pages/blog/[...slug].astro` 中搜索 `serverURL`，并将其替换为你自己的 Waline 服务端地址：

```javascript
serverURL: '[https://你的-waline-服务端地址.com](https://你的-waline-服务端地址.com)'

```

### Notion API 接入 (可选)

如果需要使用 Notion 作为数据源：

1. 复制 `.env.example` 并重命名为 `.env`。
2. 填入你的 `NOTION_API_KEY` 和 `DATABASE_ID`。
3. 在相关页面取消关于 Notion API 的代码注释即可。

## 📂 目录结构说明

```text
├── public/            # 静态资源 (Favicon、全局图片)
├── src/               
│   ├── components/    # 核心 UI 组件 (大纲数轴、导航栏等)
│   ├── content/       # 本地 Markdown 文章存放处
│   ├── layouts/       # 页面基础布局
│   └── pages/         # 路由页面
└── astro.config.mjs   # Astro 核心配置文件

```

## ☁️ 部署

Yutachi 支持一键部署到 Vercel、Netlify 或 Zeabur。只需在部署平台关联你的 GitHub 仓库，框架预设选择 `Astro` 即可。

## 📄 开源协议

本项目基于 [MIT License](https://www.google.com/search?q=./LICENSE) 开源。欢迎 자유롭게 使用和修改。

## 灵感来源
https://innei.in/


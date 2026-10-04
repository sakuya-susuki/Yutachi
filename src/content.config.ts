// src/content.config.ts
// ── 内容集合定义 ───────────────────────────────────────────
//   使用 glob 加载器自动扫描 Markdown/MDX 文件。
//   字段使用 z.coerce.date() 宽容解析日期字符串，兼容多种格式。
//   新增内容类型：在此文件末尾追加新的 defineCollection 即可。
// ──────────────────────────────────────────────────────────

import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  // 递归扫描，排除以 _ 开头的草稿文件
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title:       z.string(),
    pubDate:     z.coerce.date(),
    category:    z.string().optional(),
    description: z.string().optional(),
    tags:        z.array(z.string()).optional(),
    pinned:      z.boolean().optional(),
    updatedDate: z.coerce.date().optional(),
    // 扩展字段示例（取消注释即可启用）：
    // cover:    z.string().url().optional(),  // 封面图 URL
    // draft:    z.boolean().default(false),   // 草稿标记
  }),
});

// 扩展区：在此添加新内容集合
// const notes = defineCollection({ ... });

export const collections = { blog };

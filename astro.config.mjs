// astro.config.mjs
// ── Astro 构建配置 ─────────────────────────────────────────
//   compress.*: 生产构建自动压缩 HTML/CSS/JS，减小传输体积。
//   inlineStylesheets: 小于 2 kB 的 CSS 内联进 HTML，减少请求数。
//   markdown.*: 数学公式渲染（remark-math + rehype-katex）。
// ──────────────────────────────────────────────────────────

import { defineConfig } from "astro/config";
import remarkMath  from "remark-math";
import rehypeKatex from "rehype-katex";

export default defineConfig({
  /* 构建优化 */
  build: {
    // 小于 2 kB 的 CSS 直接内联，省去额外的网络请求
    inlineStylesheets: "auto",
  },

  /* 压缩（仅生产构建生效） */
  compressHTML: true,

  /* Markdown 扩展 */
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
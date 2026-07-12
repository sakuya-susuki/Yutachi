import { defineConfig } from 'astro/config';
// 引入刚刚安装的插件
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  // ... 其他已有的配置 ...
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
});
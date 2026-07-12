// scripts/new-page.js
import fs from 'fs';
import path from 'path';

const pageName = process.argv[2];
if (!pageName) {
  console.error(' 请输入子页面英文名！例如: pnpm run new-page "about"');
  process.exit(1);
}

// 自动生成符合规范的英文文件名
const slug = pageName
  .toLowerCase()
  .replace(/[^a-z0-9]/g, '-')
  .replace(/-+/g, '-');

// 定义自动生成的 Astro 子页面模板（预先打包好 BaseLayout 布局与基础样式）
const template = `---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="${pageName} - Yutachi" description="这是自动生成的 ${pageName} 页面">
  <div class="scroll-container" style="max-width: 800px; margin: 0 auto; padding-top: 80px; padding-bottom: 100px;">
    
    <section class="column-header" style="margin-top: 50px;">
      <span class="sub-title" style="font-size: 0.75em; letter-spacing: 0.15em; color: var(--text-muted); font-weight: 600;">PAGE</span>
      <h1 class="serif-font" style="font-size: 2.2em; margin-top: 10px; font-weight: 400;">${pageName}</h1>
    </section>

    <div style="margin-top: 40px; color: var(--text-color); line-height: 1.8;">
      <p>在这里开始书写您的 ${pageName} 页面内容...</p>
    </div>

  </div>
</BaseLayout>
`;

const folderPath = path.join(process.cwd(), 'src', 'pages');
const filePath = path.join(folderPath, `${slug}.astro`);

if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath, { recursive: true });
}

if (fs.existsSync(filePath)) {
  console.error(` 页面文件已存在: src/pages/${slug}.astro`);
  process.exit(1);
}

fs.writeFileSync(filePath, template, 'utf-8');
console.log(`\n 成功创建子网页: src/pages/${slug}.astro\n`);
// scripts/new.js
import fs from 'fs';
import path from 'path';

const title = process.argv[2];
if (!title) {
  console.error(' 请输入文章标题！例如: pnpm run new "我的新文章"');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-')
  .replace(/-+/g, '-');

const date = new Date();
const dateStr = date.toISOString().split('T')[0];

const template = `---
title: "${title}"
pubDate: ${dateStr}
category: "文章"
description: "在这里写文章的简短描述..."
---

在这里开始书写您的内容...
`;

const folderPath = path.join(process.cwd(), 'src', 'content', 'blog');
const filePath = path.join(folderPath, `${slug}.md`);

if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath, { recursive: true });
}

if (fs.existsSync(filePath)) {
  console.error(` 文件已存在: src/content/blog/${slug}.md`);
  process.exit(1);
}

fs.writeFileSync(filePath, template, 'utf-8');
console.log(`\n 成功创建模板: src/content/blog/${slug}.md\n`);



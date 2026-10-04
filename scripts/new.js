// scripts/new.js
import fs from 'fs';
import path from 'path';

// 分类映射与白名单校验
const CATEGORY_MAP = {
  '文章': '文章',
  '文': '文章',
  '思考': '思考',
  '思': '思考',
  '随记': '随记',
  '记': '随记',
};

const title = process.argv[2];
const rawCategory = process.argv[3] || '文章';

if (!title) {
  console.error('\n❌ 请输入文章标题！');
  console.log('   使用示例: pnpm run new "我的新文章" [分类(可选，默认: 文章)]');
  console.log('   支持分类: 文章(文) / 思考(思) / 随记(记)\n');
  process.exit(1);
}

const category = CATEGORY_MAP[rawCategory];
if (!category) {
  console.error(`\n❌ 未知的分类名称: "${rawCategory}"`);
  console.log('   支持的分类为:');
  console.log('   - 文章 (或简写: 文)');
  console.log('   - 思考 (或简写: 思)');
  console.log('   - 随记 (或简写: 记)\n');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '');

const date = new Date();
const dateStr = date.toISOString().split('T')[0];

const template = `---
title: "${title}"
pubDate: ${dateStr}
category: "${category}"
description: "在这里写文章的简短描述..."
tags: []
---

在这里开始书写您的内容...
`;

const folderPath = path.join(process.cwd(), 'src', 'content', 'blog', category);
const filePath = path.join(folderPath, `${slug}.md`);

if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath, { recursive: true });
}

if (fs.existsSync(filePath)) {
  console.error(`\n❌ 文件已存在: src/content/blog/${category}/${slug}.md\n`);
  process.exit(1);
}

fs.writeFileSync(filePath, template, 'utf-8');
console.log(`\n✅ 成功创建文章模板: src/content/blog/${category}/${slug}.md\n`);

// src/lib/notion.js

// 环境变量可以直接放在文件顶部（最外层）或者函数内部
const TOKEN = import.meta.env.NOTION_TOKEN || process.env.NOTION_TOKEN;
const DATABASE_ID = import.meta.env.NOTION_DATABASE_ID || process.env.NOTION_DATABASE_ID;

export async function getPosts() {
  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({})
    });

    const data = await response.json();
    
    console.log("Notion API 返回的数据:", JSON.stringify(data, null, 2));

    // 修复方案：加上安全检查
    if (!data.results) {
      console.error("❌ Notion 返回数据格式异常，没有找到 results 字段");
      return []; // 返回空数组，防止程序崩溃
    }

    // 现在再执行 map，就安全了
    return data.results.map(page => ({
        id: page.id,
        // 这里记得加上你的逻辑...
    }));

  } catch (e) {
    console.error("Notion 获取失败:", e);
    return [];
  }
}
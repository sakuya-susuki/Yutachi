// src/lib/notion.js
export async function getPosts() {
  // --- 新增调试代码 ---
// src/lib/notion.js
// 如果使用 process.env 在 Node 环境下更稳妥，可以尝试这样：
const TOKEN = import.meta.env.NOTION_TOKEN || process.env.NOTION_TOKEN;
const DATABASE_ID = import.meta.env.NOTION_DATABASE_ID || process.env.NOTION_DATABASE_ID;

export async function getPosts() {
    // ... 保持原来的 fetch 逻辑
}
  // -------------------
  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${import.meta.env.NOTION_DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({}) // 暂时不传 filter，确保能拿到所有数据
    });

    const data = await response.json();

    // 调试代码：看看 Notion 到底给你返回了什么
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
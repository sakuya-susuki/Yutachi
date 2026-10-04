// src/lib/notion.js
// ── Notion 数据层 ────────────────────────────────────────────
//   封装全部对 Notion API 的访问，统一错误处理与类型映射。
//   上层代码（Astro 页面）只调用这里导出的函数，不直接 fetch。
//   扩展接口：在文件末尾的「扩展区」添加新函数即可。
// ────────────────────────────────────────────────────────────

import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

/* ── 环境变量（构建时与运行时均兼容） ── */
const TOKEN       = import.meta.env.NOTION_TOKEN       || process.env.NOTION_TOKEN;
const DATABASE_ID = import.meta.env.NOTION_DATABASE_ID || process.env.NOTION_DATABASE_ID;

/* ── 客户端单例（无 Token 时为 null，页面可安全降级） ── */
const notion = TOKEN ? new Client({ auth: TOKEN }) : null;
const n2m    = notion ? new NotionToMarkdown({ notionClient: notion }) : null;

/** 检查客户端是否已初始化，未初始化则打印警告并返回 false */
function isReady(label = "") {
  if (!notion || !DATABASE_ID) {
    console.warn(`[Notion] ${label} 跳过：环境变量 NOTION_TOKEN / NOTION_DATABASE_ID 未配置`);
    return false;
  }
  return true;
}

// ── 类型定义 ─────────────────────────────────────────────────

/**
 * 从 Notion Page 属性中提取纯文本，兼容 title / rich_text 两种类型。
 * @param {any} prop - Notion 属性对象
 * @returns {string}
 */
function extractText(prop) {
  if (!prop) return "";
  const items = prop.title || prop.rich_text || [];
  return items.map(t => t.plain_text).join("") || "";
}

// ── 核心接口 ─────────────────────────────────────────────────

/**
 * 获取数据库文章列表（支持分页、状态过滤、自定义字段映射）
 *
 * @param {object}  [opts]
 * @param {number}  [opts.limit=100]        - 最多返回的文章数（跨分页自动累积）
 * @param {string}  [opts.statusFilter]     - 仅返回特定发布状态的文章，如 "Published"
 * @param {boolean} [opts.sortDesc=true]    - 是否按创建时间降序排列
 * @returns {Promise<Array<{id, title, date, status}>>}
 */
export async function getPosts({ limit = 100, statusFilter = "", sortDesc = true } = {}) {
  if (!isReady("getPosts")) return [];

  try {
    const results = [];
    let cursor;              // 分页游标

    do {
      const body = {
        page_size: Math.min(limit - results.length, 100), // Notion 单次上限 100
        sorts: [{ timestamp: "created_time", direction: sortDesc ? "descending" : "ascending" }],
        ...(cursor           && { start_cursor: cursor }),
        ...(statusFilter     && { filter: { property: "Status", status: { equals: statusFilter } } }),
      };

      const resp = await fetch(
        `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
        {
          method: "POST",
          headers: {
            Authorization:  `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
            "Notion-Version": "2022-06-28",
          },
          body: JSON.stringify(body),
        }
      );

      if (!resp.ok) {
        console.error(`[Notion] getPosts HTTP ${resp.status}: ${resp.statusText}`);
        break;
      }

      const data = await resp.json();

      if (!Array.isArray(data.results)) {
        console.error("[Notion] getPosts 返回格式异常：缺少 results 字段");
        break;
      }

      // 字段映射：只提取必要字段，降低下游耦合
      for (const page of data.results) {
        results.push({
          id:     page.id,
          title:  extractText(page.properties?.Name) || extractText(page.properties?.Title) || "无标题",
          date:   page.created_time,
          status: page.properties?.Status?.status?.name || "",
        });
        if (results.length >= limit) break;
      }

      cursor = data.has_more ? data.next_cursor : null;
    } while (cursor && results.length < limit);

    return results;
  } catch (err) {
    console.error("[Notion] getPosts 异常:", err);
    return [];
  }
}

/**
 * 根据 pageId 获取文章全文（转为 Markdown 字符串）
 *
 * @param {string} pageId - Notion Page ID
 * @returns {Promise<string>} Markdown 正文，失败时返回空字符串
 */
export async function getPostContent(pageId) {
  if (!n2m) {
    console.warn("[Notion] getPostContent 跳过：客户端未初始化");
    return "";
  }
  try {
    const blocks = await n2m.pageToMarkdown(pageId);
    return n2m.toMarkdownString(blocks);
  } catch (err) {
    console.error("[Notion] getPostContent 异常:", err);
    return "";
  }
}

/**
 * 根据 pageId 获取页面的元数据（标题、封面、属性等），不含正文。
 * 适用于列表页仅需摘要信息的场景，避免请求完整 blocks。
 *
 * @param {string} pageId
 * @returns {Promise<object|null>}
 */
export async function getPageMeta(pageId) {
  if (!isReady("getPageMeta")) return null;
  try {
    const page = await notion.pages.retrieve({ page_id: pageId });
    return {
      id:     page.id,
      title:  extractText(page.properties?.Name) || extractText(page.properties?.Title) || "无标题",
      cover:  page.cover?.external?.url || page.cover?.file?.url || null,
      date:   page.created_time,
      edited: page.last_edited_time,
    };
  } catch (err) {
    console.error("[Notion] getPageMeta 异常:", err);
    return null;
  }
}

// ── 扩展区（在此添加新接口，命名格式：动词 + 名词）────────────
//
// export async function searchPosts(keyword) { ... }
// export async function getDatabase()        { ... }
// export async function createPage(data)     { ... }
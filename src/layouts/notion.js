import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

const notion = new Client({ auth: import.meta.env.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 });
const n2m = new NotionToMarkdown({ notionClient: notion });

// 获取文章具体内容的方法
export async function getPostContent(pageId) {
  const mdblocks = await n2m.pageToMarkdown(pageId);
  return n2m.toMarkdownString(mdblocks); // 这就直接转成 Markdown 字符串了
}
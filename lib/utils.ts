import type { ArticleMetadata } from "@/types";

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function formatNumber(n: number): string {
  return n.toLocaleString();
}

export function generateMarkdown(
  article: ArticleMetadata,
  content: string,
  type: "summary" | "qa",
  question?: string
): string {
  let md = `# ${article.title}\n\n`;
  if (article.author) md += `**Author:** ${article.author}\n`;
  if (article.date) md += `**Date:** ${article.date}\n`;
  if (article.url) md += `**URL:** ${article.url}\n`;
  md += `\n---\n\n`;
  if (type === "qa" && question) {
    md += `## Question\n\n${question}\n\n## Answer\n\n${content}\n`;
  } else {
    md += `## Summary\n\n${content}\n`;
  }
  return md;
}

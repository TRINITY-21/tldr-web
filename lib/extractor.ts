import { extract } from "@extractus/article-extractor";
import { stripHtml } from "./utils";
import type { ArticleMetadata } from "@/types";

export async function extractArticle(url: string): Promise<ArticleMetadata> {
  const article = await extract(url);

  if (!article || !article.content) {
    throw new Error("Could not extract article content from this URL.");
  }

  const cleanText = stripHtml(article.content);

  if (!cleanText.trim()) {
    throw new Error("Extracted content is empty.");
  }

  return {
    title: article.title || "Untitled",
    author: article.author || "",
    date: article.published || "",
    content: cleanText,
    wordCount: cleanText.split(/\s+/).length,
    url,
  };
}

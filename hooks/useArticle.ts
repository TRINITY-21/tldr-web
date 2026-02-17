"use client";
import { useState } from "react";
import type { ArticleMetadata } from "@/types";

export function useArticle() {
  const [article, setArticle] = useState<ArticleMetadata | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);

  const extractArticle = async (
    url: string
  ): Promise<ArticleMetadata | null> => {
    setIsExtracting(true);
    setExtractError(null);
    setArticle(null);

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Extraction failed");
      }

      setArticle(data);
      return data;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to extract article";
      setExtractError(msg);
      return null;
    } finally {
      setIsExtracting(false);
    }
  };

  const reset = () => {
    setArticle(null);
    setExtractError(null);
  };

  return { article, isExtracting, extractError, extractArticle, reset };
}

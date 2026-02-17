"use client";
import { useState } from "react";
import type { ArticleMetadata } from "@/types";
import { generateMarkdown } from "@/lib/utils";

interface SummaryCardProps {
  content: string;
  isStreaming: boolean;
  article: ArticleMetadata | null;
}

export default function SummaryCard({
  content,
  isStreaming,
  article,
}: SummaryCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!article) return;
    const md = generateMarkdown(article, content, "summary");
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${article.title.slice(0, 50).replace(/[^a-zA-Z0-9]/g, "-")}-summary.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass p-5 fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <span className="text-sm font-medium text-white/40 uppercase tracking-wider">
            Summary
          </span>
        </div>
        {content && !isStreaming && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="text-xs px-3 py-1 rounded-lg bg-white/[0.04] text-white/40 hover:text-white/70 hover:bg-white/[0.08] transition-all border border-white/[0.06]"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={handleDownload}
              className="text-xs px-3 py-1 rounded-lg bg-white/[0.04] text-white/40 hover:text-white/70 hover:bg-white/[0.08] transition-all border border-white/[0.06]"
            >
              Save .md
            </button>
          </div>
        )}
      </div>
      <div className="text-white/80 leading-relaxed whitespace-pre-wrap">
        {content || (
          <span className="text-white/30">Generating...</span>
        )}
        {isStreaming && <span className="cursor-blink" />}
      </div>
    </div>
  );
}

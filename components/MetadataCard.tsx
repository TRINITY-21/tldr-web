import type { ArticleMetadata } from "@/types";
import { formatNumber } from "@/lib/utils";

interface MetadataCardProps {
  article: ArticleMetadata;
}

export default function MetadataCard({ article }: MetadataCardProps) {
  return (
    <div className="glass p-5 fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">📄</span>
        <span className="text-sm font-medium text-white/40 uppercase tracking-wider">
          Article
        </span>
      </div>
      <h2 className="text-lg font-semibold text-white mb-2">
        {article.title}
      </h2>
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-white/40">
        {article.author && (
          <span>
            <span className="text-purple-400/60">Author</span>{" "}
            {article.author}
          </span>
        )}
        {article.date && (
          <span>
            <span className="text-purple-400/60">Date</span> {article.date}
          </span>
        )}
        <span>
          <span className="text-purple-400/60">Words</span>{" "}
          {formatNumber(article.wordCount)}
        </span>
      </div>
      {article.url && (
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-white/20 hover:text-white/40 transition-colors mt-2 block truncate"
        >
          {article.url}
        </a>
      )}
    </div>
  );
}

"use client";
import { useState } from "react";

interface AskInputProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
}

export default function AskInput({ onSubmit, isLoading }: AskInputProps) {
  const [question, setQuestion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && !isLoading) {
      onSubmit(question.trim());
    }
  };

  return (
    <div className="glass p-5 fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">❓</span>
        <span className="text-sm font-medium text-white/40 uppercase tracking-wider">
          Ask about this article
        </span>
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question..."
          className="flex-1 bg-white/[0.03] text-white placeholder-white/25 px-4 py-2.5 rounded-xl outline-none text-sm border border-white/[0.06] focus:border-purple-500/30 transition-all"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !question.trim()}
          className="px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #a855f7, #6366f1)",
          }}
        >
          {isLoading ? (
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            "Ask"
          )}
        </button>
      </form>
    </div>
  );
}

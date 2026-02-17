"use client";

import { useState, useCallback } from "react";
import { useCompletion } from "@ai-sdk/react";
import { useArticle } from "@/hooks/useArticle";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import UrlInput from "@/components/UrlInput";
import Options from "@/components/Options";
import MetadataCard from "@/components/MetadataCard";
import SummaryCard from "@/components/SummaryCard";
import AskInput from "@/components/AskInput";
import AnswerCard from "@/components/AnswerCard";
import LoadingShimmer from "@/components/LoadingShimmer";

export default function Home() {
  const { article, isExtracting, extractError, extractArticle } =
    useArticle();

  const [length, setLength] = useState<"brief" | "detailed">("brief");
  const [bullets, setBullets] = useState(false);
  const [lang, setLang] = useState("");
  const [lastQuestion, setLastQuestion] = useState("");

  // Summary streaming
  const {
    completion: summary,
    isLoading: isSummarizing,
    complete: triggerSummary,
  } = useCompletion({
    api: "/api/summarize",
  });

  // Ask streaming
  const {
    completion: answer,
    isLoading: isAnswering,
    complete: triggerAsk,
  } = useCompletion({
    api: "/api/summarize",
    id: "ask",
  });

  const handleSubmitUrl = useCallback(
    async (url: string) => {
      const extracted = await extractArticle(url);
      if (extracted) {
        await triggerSummary(extracted.content, {
          body: {
            text: extracted.content,
            mode: "summarize",
            length,
            bullets,
            lang: lang || undefined,
          },
        });
      }
    },
    [extractArticle, triggerSummary, length, bullets, lang]
  );

  const handleAsk = useCallback(
    async (question: string) => {
      if (!article) return;
      setLastQuestion(question);
      await triggerAsk(question, {
        body: {
          text: article.content,
          mode: "ask",
          question,
        },
      });
    },
    [article, triggerAsk]
  );

  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16 space-y-5">
        <Hero />
        <UrlInput
          onSubmit={handleSubmitUrl}
          isLoading={isExtracting || isSummarizing}
        />
        <Options
          length={length}
          onLengthChange={setLength}
          bullets={bullets}
          onBulletsChange={setBullets}
          lang={lang}
          onLangChange={setLang}
        />

        {extractError && (
          <div
            className="glass p-4 fade-in"
            style={{ borderColor: "rgba(239, 68, 68, 0.2)" }}
          >
            <span className="text-red-400 text-sm">{extractError}</span>
          </div>
        )}

        {isExtracting && <LoadingShimmer />}

        {article && <MetadataCard article={article} />}

        {(summary || isSummarizing) && (
          <SummaryCard
            content={summary}
            isStreaming={isSummarizing}
            article={article}
          />
        )}

        {article && !isExtracting && !isSummarizing && (
          <AskInput onSubmit={handleAsk} isLoading={isAnswering} />
        )}

        {(answer || isAnswering) && (
          <AnswerCard
            content={answer}
            isStreaming={isAnswering}
            article={article}
            question={lastQuestion}
          />
        )}
      </div>
    </main>
  );
}

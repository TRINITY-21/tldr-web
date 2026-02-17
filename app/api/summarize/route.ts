import { streamText } from "ai";
import { createGroq } from "@ai-sdk/groq";
import {
  buildSummarizePrompt,
  buildAskPrompt,
  MODEL,
  MODEL_FAST,
} from "@/lib/prompts";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY!,
});

function buildPrompts(
  mode: string,
  text: string,
  length: string,
  bullets: boolean,
  lang: string | undefined,
  question: string | undefined,
  fast: boolean
) {
  if (mode === "ask") {
    return buildAskPrompt(text, question!, fast);
  }
  return buildSummarizePrompt(
    text,
    (length || "brief") as "brief" | "detailed",
    bullets || false,
    lang,
    fast
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, mode, length, bullets, lang, question } = body;

    if (!text) {
      return new Response("Article text is required", { status: 400 });
    }

    if (mode === "ask" && !question) {
      return new Response("Question is required for ask mode", {
        status: 400,
      });
    }

    const { system, user, maxOutputTokens } = buildPrompts(
      mode,
      text,
      length,
      bullets,
      lang,
      question,
      false
    );

    try {
      const result = streamText({
        model: groq(MODEL),
        system,
        prompt: user,
        maxOutputTokens,
      });

      return result.toTextStreamResponse();
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : String(error);
      if (msg.includes("rate_limit") || msg.includes("Rate limit")) {
        // Fallback to fast model with tighter truncation
        const fallback = buildPrompts(
          mode,
          text,
          length,
          bullets,
          lang,
          question,
          true
        );

        const result = streamText({
          model: groq(MODEL_FAST),
          system: fallback.system,
          prompt: fallback.user,
          maxOutputTokens: fallback.maxOutputTokens,
        });

        return result.toTextStreamResponse();
      }
      throw error;
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Summarization failed";
    return new Response(message, { status: 500 });
  }
}

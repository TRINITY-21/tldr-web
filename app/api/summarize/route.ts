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

function isRateLimit(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  return (
    msg.includes("rate_limit") ||
    msg.includes("Rate limit") ||
    msg.includes("429")
  );
}

async function tryStreamWithFallback(
  system: string,
  user: string,
  maxOutputTokens: number,
  mode: string,
  text: string,
  length: string,
  bullets: boolean,
  lang: string | undefined,
  question: string | undefined
): Promise<Response> {
  const result = streamText({
    model: groq(MODEL),
    system,
    prompt: user,
    maxOutputTokens,
  });

  // Read the first chunk to detect rate limit errors before sending the response
  const iterator = result.textStream[Symbol.asyncIterator]();
  let firstChunk: IteratorResult<string>;

  try {
    firstChunk = await iterator.next();
  } catch (error) {
    if (isRateLimit(error)) {
      // Fallback to fast model
      const fallback = buildPrompts(
        mode,
        text,
        length,
        bullets,
        lang,
        question,
        true
      );
      const fallbackResult = streamText({
        model: groq(MODEL_FAST),
        system: fallback.system,
        prompt: fallback.user,
        maxOutputTokens: fallback.maxOutputTokens,
      });
      return fallbackResult.toTextStreamResponse();
    }
    throw error;
  }

  // First chunk succeeded — build a response stream starting with it
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      if (!firstChunk.done && firstChunk.value) {
        controller.enqueue(encoder.encode(firstChunk.value));
      }
      if (firstChunk.done) {
        controller.close();
        return;
      }
      try {
        while (true) {
          const { done, value } = await iterator.next();
          if (done) break;
          controller.enqueue(encoder.encode(value));
        }
        controller.close();
      } catch (e) {
        controller.error(e);
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
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

    return await tryStreamWithFallback(
      system,
      user,
      maxOutputTokens,
      mode,
      text,
      length,
      bullets,
      lang,
      question
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Summarization failed";
    return new Response(message, { status: 500 });
  }
}

import { streamText } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { buildSummarizePrompt, buildAskPrompt, MODEL } from "@/lib/prompts";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, mode, length, bullets, lang, question } = body;

    if (!text) {
      return new Response("Article text is required", { status: 400 });
    }

    let system: string;
    let user: string;
    let maxOutputTokens: number;

    if (mode === "ask") {
      if (!question) {
        return new Response("Question is required for ask mode", {
          status: 400,
        });
      }
      ({ system, user, maxOutputTokens } = buildAskPrompt(text, question));
    } else {
      ({ system, user, maxOutputTokens } = buildSummarizePrompt(
        text,
        length || "brief",
        bullets || false,
        lang
      ));
    }

    const result = streamText({
      model: groq(MODEL),
      system,
      prompt: user,
      maxOutputTokens,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Summarization failed";
    return new Response(message, { status: 500 });
  }
}

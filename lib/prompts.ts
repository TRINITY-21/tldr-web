export const MODEL = "llama-3.3-70b-versatile";
export const MODEL_FAST = "llama-3.1-8b-instant";
const MAX_CHARS = 30_000;
const MAX_CHARS_FAST = 14_000;

export function buildSummarizePrompt(
  text: string,
  length: "brief" | "detailed",
  bullets: boolean,
  lang?: string,
  fast?: boolean
): { system: string; user: string; maxOutputTokens: number } {
  const instructions: string[] = [];

  if (bullets) {
    instructions.push(
      "Extract the key points as a concise bullet list (5-8 bullets)."
    );
  } else if (length === "detailed") {
    instructions.push(
      "Provide a detailed summary (3-4 paragraphs) covering all main points."
    );
  } else {
    instructions.push("Provide a brief summary (2-3 sentences).");
  }

  if (lang) {
    instructions.push(`Write the summary in ${lang}.`);
  }

  const system =
    "You are a precise article summarizer. " +
    "Only use information from the provided text. " +
    "Do not add opinions or external knowledge. " +
    instructions.join(" ");

  const limit = fast ? MAX_CHARS_FAST : MAX_CHARS;
  const truncated = text.slice(0, limit);

  return {
    system,
    user: `Summarize the following article:\n\n${truncated}`,
    maxOutputTokens: length === "brief" ? 1024 : 2048,
  };
}

export function buildAskPrompt(
  text: string,
  question: string,
  fast?: boolean
): { system: string; user: string; maxOutputTokens: number } {
  const system =
    "You are a helpful assistant that answers questions based strictly on " +
    "the provided article text. If the answer is not in the text, say so. " +
    "Be concise and direct.";

  const limit = fast ? MAX_CHARS_FAST : MAX_CHARS;
  const truncated = text.slice(0, limit);

  return {
    system,
    user: `Article:\n\n${truncated}\n\n---\n\nQuestion: ${question}`,
    maxOutputTokens: 1024,
  };
}

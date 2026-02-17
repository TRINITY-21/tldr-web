export const MODEL = "llama-3.3-70b-versatile";
const MAX_CHARS = 30_000;

export function buildSummarizePrompt(
  text: string,
  length: "brief" | "detailed",
  bullets: boolean,
  lang?: string
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

  const truncated = text.slice(0, MAX_CHARS);

  return {
    system,
    user: `Summarize the following article:\n\n${truncated}`,
    maxOutputTokens: length === "brief" ? 1024 : 2048,
  };
}

export function buildAskPrompt(
  text: string,
  question: string
): { system: string; user: string; maxOutputTokens: number } {
  const system =
    "You are a helpful assistant that answers questions based strictly on " +
    "the provided article text. If the answer is not in the text, say so. " +
    "Be concise and direct.";

  const truncated = text.slice(0, MAX_CHARS);

  return {
    system,
    user: `Article:\n\n${truncated}\n\n---\n\nQuestion: ${question}`,
    maxOutputTokens: 1024,
  };
}

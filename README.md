# tldr-web

AI-powered article summarizer web app. Paste any URL and get an instant summary — streamed in real time with a dark glassmorphism UI.

Web companion to [tldr](https://github.com/TRINITY-21/tldr) (the CLI version).

## Features

- **Summarize any URL** — extracts article text and generates AI summaries
- **Brief or Detailed** — toggle between concise (2-3 sentences) and full (3-4 paragraphs) summaries
- **Bullet points** — extract key takeaways as a bullet list
- **Translate** — summarize in 9 languages (Spanish, French, German, Turkish, Arabic, Chinese, Japanese, Portuguese, Hindi)
- **Ask questions** — Q&A mode to ask anything about the article
- **Real-time streaming** — watch the AI response appear token by token
- **Copy & save** — clipboard copy or download as `.md`
- **Dark glassmorphism UI** — frosted glass cards, floating gradient orbs, glowing accents

## Tech Stack

- **Next.js 15** — App Router, TypeScript, Turbopack
- **Tailwind CSS 4** — handcrafted dark glassmorphism theme
- **Vercel AI SDK** — streaming with `useCompletion`
- **Groq** — Llama 3.3 70B (free tier)
- **@extractus/article-extractor** — article text extraction

## Setup

```bash
git clone https://github.com/TRINITY-21/tldr-web.git
cd tldr-web
npm install
```

Create `.env.local`:

```
GROQ_API_KEY=your_groq_api_key_here
```

Get a free API key at [console.groq.com](https://console.groq.com).

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000).

## Usage

1. Paste any article URL and click **Go**
2. Pick **Brief** or **Detailed**, toggle **Bullets**, choose a **Language**
3. The summary streams in real time
4. Click **Copy** or **Save .md** to export
5. Scroll down to **Ask** a question about the article

## Project Structure

```
app/
  layout.tsx          Root layout — Geist font, floating orbs, dark theme
  page.tsx            Main page — orchestrates state, streaming, all components
  globals.css         Tailwind + glassmorphism classes (glass, glow, orbs, shimmer)
  api/
    extract/route.ts  POST: URL → article metadata + clean text
    summarize/route.ts POST: text + options → streamed Groq response
components/
  Header.tsx          Glass nav bar with logo + GitHub link
  Hero.tsx            Title + subtitle
  UrlInput.tsx        Glowing URL input with gradient Go button
  Options.tsx         Brief/Detailed, Bullets, Language toggles
  MetadataCard.tsx    Article title, author, date, word count
  SummaryCard.tsx     Streaming summary with copy/download
  AskInput.tsx        Question input for Q&A mode
  AnswerCard.tsx      Streaming answer with copy/download
  LoadingShimmer.tsx  Skeleton loader
lib/
  extractor.ts        @extractus/article-extractor wrapper
  prompts.ts          System prompts + token limits for Groq
  utils.ts            stripHtml, formatNumber, generateMarkdown
hooks/
  useArticle.ts       Article extraction state hook
types/
  index.ts            ArticleMetadata interface
```

## License

MIT

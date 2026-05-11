# Generative UI Demo

Chapter 1 project from the **AI-Powered Software Engineer** learning path. Demonstrates two core streaming patterns from the Vercel AI SDK using Cerebras (Llama) as the inference provider.

## What's Inside

| Route | Pattern | Model |
|---|---|---|
| `/chat` | Text streaming — `streamText` + `useChat` | `llama3.1-8b` |
| `/assistant` | Generative UI — tool calls → React components | `llama-3.3-70b` |

## Stack

- **Next.js 15** (App Router)
- **Vercel AI SDK** `ai@4.3.19`
- **Cerebras** `@ai-sdk/cerebras@0.2.16` — free, fast (~2k tokens/sec)
- **Tailwind CSS**
- **Zod** for tool parameter schemas

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Create your env file
cp .env.local.example .env.local
```

Open `.env.local` and add your key — get one free at https://cloud.cerebras.ai/

```env
CEREBRAS_API_KEY=csk-...
```

```bash
# 3. Start the dev server
npm run dev
```

Open http://localhost:3000

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          ← streamText endpoint (Edge → Node)
│   │   └── assistant/route.ts     ← tool-augmented streamText endpoint
│   ├── chat/page.tsx
│   ├── assistant/page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── modules/
│   ├── chat/
│   │   └── components/
│   │       └── ChatWindow.tsx     ← useChat, streaming indicator
│   └── assistant/
│       └── components/
│           ├── AssistantWindow.tsx  ← toolInvocations → component renderer
│           ├── WeatherCard.tsx      ← rendered when get_weather tool fires
│           └── StockCard.tsx        ← rendered when get_stock tool fires
└── shared/
    └── components/
        └── NavBar.tsx
```

## How It Works

### Pattern 1 — Text Streaming (`/chat`)

```
POST /api/chat
  └── streamText() ──► toDataStreamResponse()  ← SSE wire format
        │
        ▼
  useChat() on client
  accumulates tokens into message.content
```

The server holds an HTTP connection open and pushes tokens as they are sampled. `useChat` manages message history, loading state, and errors.

### Pattern 2 — Generative UI (`/assistant`)

```
POST /api/assistant
  └── streamText({ tools })
        │
        ├── LLM decides to call get_weather({ city: "Tokyo" })
        │     └── execute() runs on server → returns mock data
        │           └── result streamed as toolInvocation object
        │
        ▼
  useChat() on client
  message.toolInvocations → mapped to <WeatherCard /> or <StockCard />
```

The LLM never returns JSX. It returns **structured data**. The client decides which component to render for each tool result — keeping the component tree fully in your control.

**Key states in `toolInvocations`:**

| `tool.state` | Meaning | UI |
|---|---|---|
| `'call'` | Tool called, executing | Pulsing skeleton card |
| `'result'` | Execution complete | WeatherCard / StockCard |

## Try These Prompts

**Text Streaming (`/chat`):**
- `"Explain embeddings in 3 sentences."`
- `"What is the difference between RAG and fine-tuning?"`

**Generative UI (`/assistant`):**
- `"What's the weather in Tokyo?"`
- `"Show me the NVDA stock price."`
- `"Weather in Paris and AAPL stock."` — triggers parallel tool calls

## Why `llama-3.3-70b` for the Assistant

Tool calling requires the model to emit structured function call JSON in a specific format. The 8B model tends to serialize tool calls as plain text instead, breaking the `toolInvocations` parsing. The 70B model has reliable function-calling support. The `/chat` route uses `llama3.1-8b` since it only needs text generation.

## Swapping Providers

All provider logic is isolated to the two route files. To switch:

```bash
# Anthropic
npm install @ai-sdk/anthropic
# replace: cerebras('llama-3.3-70b') → anthropic('claude-sonnet-4-6')
# env: ANTHROPIC_API_KEY=sk-ant-...

# OpenAI
npm install @ai-sdk/openai
# replace: cerebras('llama-3.3-70b') → openai('gpt-4o')
# env: OPENAI_API_KEY=sk-...
```

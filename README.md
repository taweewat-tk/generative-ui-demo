# Generative UI Demo

Chapter 1 project from the **AI-Powered Software Engineer** learning path. Demonstrates two core streaming patterns from the Vercel AI SDK using Cerebras (Llama) as the inference provider.

## What's Inside

| Route        | Pattern                                       | Model         |
| ------------ | --------------------------------------------- | ------------- |
| `/chat`      | Text streaming — `streamText` + `useChat`     | `llama3.1-8b` |
| `/assistant` | Generative UI — tool calls → React components | `llama3.1-8b` |

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
│   │   ├── chat/route.ts          ← streamText endpoint
│   │   └── assistant/route.ts     ← tool-augmented streamText endpoint
│   ├── chat/page.tsx
│   ├── assistant/page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── modules/
│   ├── chat/
│   │   └── components/
│   │       └── ChatWindow.tsx       ← useChat, streaming indicator
│   └── assistant/
│       └── components/
│           ├── AssistantWindow.tsx  ← m.parts → component renderer
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
  └── convertToCoreMessages(messages)   ← converts UI messages → CoreMessage[]
        └── streamText({ tools })
              │
              ├── LLM decides to call get_weather({ city: "Tokyo" })
              │     └── execute() runs on server → returns mock data
              │           └── result streamed back to client
              │
              ▼
  useChat() on client
  message.parts → mapped to <WeatherCard /> or <StockCard />
```

The LLM never returns JSX. It returns **structured data**. The client decides which component to render for each tool result — keeping the component tree fully in your control.

**Message parts in AI SDK v4:**

| `part.type`         | Meaning               | UI                                 |
| ------------------- | --------------------- | ---------------------------------- |
| `'text'`            | Text response         | Chat bubble                        |
| `'tool-invocation'` | Tool called or result | Skeleton → WeatherCard / StockCard |

**Tool invocation states (`part.toolInvocation.state`):**

| `state`    | Meaning                | UI                      |
| ---------- | ---------------------- | ----------------------- |
| `'call'`   | Tool called, executing | Pulsing skeleton card   |
| `'result'` | Execution complete     | WeatherCard / StockCard |

> **AI SDK v4 note:** `message.toolInvocations` is deprecated. Use `message.parts` and branch on `part.type === 'tool-invocation'` instead. On the server, always pass messages through `convertToCoreMessages()` before `streamText` — the client now sends messages with a `parts` field that must be converted to `CoreMessage[]` first.

## Try These Prompts

**Text Streaming (`/chat`):**

- `"Explain embeddings in 3 sentences."`
- `"What is the difference between RAG and fine-tuning?"`

**Generative UI (`/assistant`):**

- `"What's the weather in Tokyo?"`
- `"Show me the NVDA stock price."`
- `"Weather in Paris and AAPL stock."` — triggers parallel tool calls

## Why `llama3.1-8b` for the Assistant

Tool calling requires the model to emit structured function call JSON. The 8B model can struggle with reliable function-calling; if tool cards don't appear, swap to the 70B model (`llama-3.3-70b`) in `src/app/api/assistant/route.ts`.

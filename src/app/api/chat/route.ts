// Pattern 1: plain text streaming.
// streamText() generates tokens → toDataStreamResponse() serializes them into the
// Vercel AI SDK wire format (NOT raw SSE — it includes metadata frames useChat expects).

import { streamText } from 'ai';
import { cerebras } from '@ai-sdk/cerebras';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: cerebras('llama3.1-8b'),
      system: 'You are a concise AI engineering tutor. Answer in plain text, no markdown.',
      messages,
      onFinish({ usage }) {
        console.log(
          `[chat] tokens — prompt: ${usage.promptTokens}, completion: ${usage.completionTokens}`,
        );
      },
    });

    return result.toDataStreamResponse({
      getErrorMessage: (err) => {
        const message = err instanceof Error ? err.message : String(err);
        console.error('[chat] stream error:', message);
        return message;
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[chat] setup error:', message);
    return new Response(message, { status: 500 });
  }
}

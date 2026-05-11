// Pattern 2: tool-augmented streaming — the foundation of Generative UI.
//
// The LLM decides whether to respond with text or invoke a tool.
// Tool `execute()` runs server-side; its result is streamed back as a
// structured `toolInvocation` object that the client maps to a React component.
//
// Note: tool results here are MOCKED. In production, replace execute() bodies
// with real API calls (e.g., OpenWeatherMap, Polygon.io).

import { streamText, tool, convertToCoreMessages } from 'ai';
import { cerebras } from '@ai-sdk/cerebras';
import { z } from 'zod';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: cerebras('llama3.1-8b'),
      system:
        'You are a helpful assistant. When the user asks about weather or stocks, always use the appropriate tool. Do not make up data — use the tools.',
      messages: convertToCoreMessages(messages),
      tools: {
        get_weather: tool({
          description: 'Get the current weather for a city.',
          parameters: z.object({
            city: z.string().describe('City name, e.g. "Tokyo"'),
            unit: z.enum(['celsius', 'fahrenheit']).default('celsius'),
          }),
          execute: async ({ city, unit }) => {
            // MOCK — replace with a real weather API call
            const mock: Record<
              string,
              { temp: number; condition: string; humidity: number; wind: number }
            > = {
              default: { temp: 22, condition: 'Partly Cloudy', humidity: 60, wind: 14 },
              tokyo: { temp: 18, condition: 'Sunny', humidity: 55, wind: 8 },
              paris: { temp: 14, condition: 'Rainy', humidity: 80, wind: 22 },
              london: { temp: 11, condition: 'Overcast', humidity: 85, wind: 18 },
              'new york': { temp: 25, condition: 'Clear', humidity: 45, wind: 12 },
            };
            const data = mock[city.toLowerCase()] ?? mock.default;
            const temp = unit === 'fahrenheit' ? Math.round((data.temp * 9) / 5 + 32) : data.temp;
            return {
              city,
              temp,
              unit,
              condition: data.condition,
              humidity: data.humidity,
              wind: data.wind,
            };
          },
        }),

        get_stock: tool({
          description: 'Get the current stock price and daily change for a ticker symbol.',
          parameters: z.object({
            symbol: z.string().describe('Stock ticker, e.g. "AAPL"'),
          }),
          execute: async ({ symbol }) => {
            // MOCK — replace with a real market data API call (e.g., Polygon.io)
            const mock: Record<
              string,
              { price: number; change: number; changePercent: number; name: string }
            > = {
              AAPL: { price: 213.49, change: 2.31, changePercent: 1.09, name: 'Apple Inc.' },
              NVDA: { price: 875.4, change: -12.6, changePercent: -1.42, name: 'NVIDIA Corp.' },
              MSFT: { price: 420.21, change: 5.07, changePercent: 1.22, name: 'Microsoft Corp.' },
              TSLA: { price: 178.8, change: -3.2, changePercent: -1.76, name: 'Tesla Inc.' },
            };
            const data = mock[symbol.toUpperCase()] ?? {
              price: 100.0,
              change: 0.5,
              changePercent: 0.5,
              name: symbol.toUpperCase(),
            };
            return { symbol: symbol.toUpperCase(), ...data };
          },
        }),
      },
      // Allow the model to call multiple tools in one turn (e.g., weather + stock together)
      maxSteps: 3,
    });

    return result.toDataStreamResponse({
      getErrorMessage: (err) => {
        const message = err instanceof Error ? err.message : String(err);
        console.error('[assistant] stream error:', message);
        return message;
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[assistant] setup error:', message);
    return new Response(message, { status: 500 });
  }
}

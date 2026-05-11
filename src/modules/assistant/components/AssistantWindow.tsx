'use client';

// This is the Generative UI pattern in AI SDK v4.
//
// Key insight: the LLM doesn't return JSX — it returns structured tool call results.
// The CLIENT decides which React component to render for each tool result.
// This keeps the server stateless and the component tree in your control.

import { useChat } from 'ai/react';
import { useEffect, useRef } from 'react';
import WeatherCard from './WeatherCard';
import StockCard from './StockCard';

export default function AssistantWindow() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/assistant',
  });

  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-[640px] rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <p className="text-center text-sm text-[var(--muted)] mt-20">
            Ask about weather or stocks to see Generative UI in action.
          </p>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'user' ? (
              <div className="max-w-[80%] rounded-lg px-4 py-2.5 text-sm bg-purple-700 text-white">
                {m.content}
              </div>
            ) : (
              <div className="max-w-full space-y-3">
                {m.parts?.map((part, i) => {
                  if (part.type === 'text') {
                    return (
                      <div
                        key={i}
                        className="rounded-lg px-4 py-2.5 text-sm bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] leading-relaxed"
                      >
                        {part.text}
                      </div>
                    );
                  }

                  if (part.type === 'tool-invocation') {
                    const tool = part.toolInvocation;
                    if (tool.state === 'call') {
                      return (
                        <div
                          key={tool.toolCallId}
                          className="w-64 h-32 rounded-xl border border-[var(--border)] bg-[var(--bg)] animate-pulse flex items-center justify-center"
                        >
                          <p className="text-xs text-[var(--muted)] font-mono">
                            {tool.toolName}({JSON.stringify(tool.args)})
                          </p>
                        </div>
                      );
                    }

                    if (tool.state === 'result') {
                      if (tool.toolName === 'get_weather') {
                        return <WeatherCard key={tool.toolCallId} data={tool.result} />;
                      }
                      if (tool.toolName === 'get_stock') {
                        return <StockCard key={tool.toolCallId} data={tool.result} />;
                      }
                    }
                  }
                })}

                {/* Streaming indicator for the last assistant message */}
                {!m.parts?.length && isLoading && (
                  <div className="rounded-lg px-4 py-2.5 bg-[var(--bg)] border border-[var(--border)] inline-flex gap-1">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {error && (
          <p className="text-center text-sm text-red-400">
            Error: {error.message}. Check your CEREBRAS_API_KEY in .env.local.
          </p>
        )}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-[var(--border)] p-3 flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder='Try: "Weather in Tokyo" or "NVDA stock price"'
          disabled={isLoading}
          className="flex-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:border-purple-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 bg-purple-700 hover:bg-purple-600 disabled:opacity-40 rounded-lg text-sm font-medium text-white transition-colors"
        >
          {isLoading ? 'Thinking…' : 'Send'}
        </button>
      </form>
    </div>
  );
}

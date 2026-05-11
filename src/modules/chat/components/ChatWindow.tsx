'use client';

import { useChat } from 'ai/react';
import { useEffect, useRef } from 'react';

export default function ChatWindow() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
  });

  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-[600px] rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      {/* Message list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <p className="text-center text-sm text-[var(--muted)] mt-20">
            Send a message to start streaming.
          </p>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-purple-700 text-white'
                  : 'bg-[var(--bg)] border border-[var(--border)] text-[var(--text)]'
              }`}
            >
              {/* Streaming indicator: last assistant message with no content yet */}
              {m.role === 'assistant' && !m.content && isLoading ? (
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </span>
              ) : (
                m.content
              )}
            </div>
          </div>
        ))}

        {error && (
          <p className="text-center text-sm text-red-400">
            Error: {error.message}. Check your GOOGLE_GENERATIVE_AI_API_KEY in .env.local.
          </p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-[var(--border)] p-3 flex gap-2"
      >
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask anything…"
          disabled={isLoading}
          className="flex-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:border-purple-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 bg-purple-700 hover:bg-purple-600 disabled:opacity-40 rounded-lg text-sm font-medium text-white transition-colors"
        >
          {isLoading ? 'Streaming…' : 'Send'}
        </button>
      </form>
    </div>
  );
}

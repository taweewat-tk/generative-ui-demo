import ChatWindow from '@/modules/chat/components/ChatWindow';

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-1">
          Pattern 1
        </p>
        <h1 className="text-2xl font-bold text-white">Text Streaming</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          <code className="font-mono text-purple-400">streamText()</code> on the server →{' '}
          <code className="font-mono text-purple-400">toDataStreamResponse()</code> over SSE →{' '}
          <code className="font-mono text-purple-400">useChat()</code> accumulates tokens in state.
          Try: <em>"Explain embeddings in 3 sentences."</em>
        </p>
      </div>
      <ChatWindow />
    </div>
  );
}

import AssistantWindow from '@/modules/assistant/components/AssistantWindow';

export default function AssistantPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-1">
          Pattern 2
        </p>
        <h1 className="text-2xl font-bold text-white">Generative UI</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          The LLM decides mid-stream to invoke a tool. The server executes it and streams back
          structured data. The client maps each{' '}
          <code className="font-mono text-purple-400">toolInvocation</code> to a React component.
        </p>
        <ul className="mt-2 text-sm text-[var(--muted)] list-disc list-inside space-y-1">
          <li>
            Try: <em>"What&apos;s the weather in Tokyo?"</em>
          </li>
          <li>
            Try: <em>"Show me the NVDA stock price."</em>
          </li>
          <li>
            Try: <em>"Weather in Paris and AAPL stock."</em> (parallel tool calls)
          </li>
        </ul>
      </div>
      <AssistantWindow />
    </div>
  );
}

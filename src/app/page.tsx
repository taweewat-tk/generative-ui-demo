import Link from 'next/link';

const demos = [
  {
    href: '/chat',
    title: 'Text Streaming',
    badge: 'streamText + useChat',
    description:
      'Plain token-by-token streaming. The server holds an SSE connection open and pushes each token as it is sampled. The client accumulates tokens in React state via useChat.',
    concept: 'SSE → ReadableStream → useChat',
  },
  {
    href: '/assistant',
    title: 'Generative UI',
    badge: 'Tool Calls + Component Rendering',
    description:
      'The LLM decides mid-stream to call a tool (e.g. get_weather). The server executes the tool and streams back structured data. The client maps tool results to React components.',
    concept: 'Tool calling → toolInvocations → JSX',
  },
];

export default function HomePage() {
  return (
    <div className="space-y-10 pt-8">
      <div>
        <p className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-2">
          Chapter 1 — Generative UI & Vercel AI SDK
        </p>
        <h1 className="text-3xl font-bold text-white">Streaming Patterns Demo</h1>
        <p className="mt-3 text-[var(--muted)] max-w-xl">
          Two live demos showing how tokens travel from an LLM to the browser — from raw text
          streaming up to component-level Generative UI.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {demos.map((d) => (
          <Link
            key={d.href}
            href={d.href}
            className="block rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 hover:border-purple-600 transition-colors group"
          >
            <span className="inline-block text-xs font-mono bg-purple-950 text-purple-300 px-2 py-0.5 rounded mb-3">
              {d.badge}
            </span>
            <h2 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
              {d.title}
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">{d.description}</p>
            <p className="mt-4 text-xs font-mono text-purple-500">{d.concept} →</p>
          </Link>
        ))}
      </div>

      <div className="rounded-lg border border-yellow-900 bg-yellow-950/30 p-4 text-sm text-yellow-300">
        <strong>Setup:</strong> copy <code className="font-mono">.env.local.example</code> →{' '}
        <code className="font-mono">.env.local</code> and add your{' '}
        <code className="font-mono">OPENAI_API_KEY</code> before running the demos.
      </div>
    </div>
  );
}

import Link from 'next/link';

const links = [
  { href: '/', label: 'Home' },
  { href: '/chat', label: 'Text Streaming' },
  { href: '/assistant', label: 'Generative UI' },
];

export default function NavBar() {
  return (
    <nav className="border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="container mx-auto px-4 max-w-4xl flex items-center gap-6 h-12">
        <span className="text-xs font-mono text-purple-400 font-semibold tracking-tight">
          Ch.1 Demo
        </span>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="text-sm text-[var(--muted)] hover:text-white transition-colors"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

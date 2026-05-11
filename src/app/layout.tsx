import type { Metadata } from 'next';
import './globals.css';
import NavBar from '@/shared/components/NavBar';

export const metadata: Metadata = {
  title: 'Generative UI Demo',
  description: 'Chapter 1 — Vercel AI SDK streaming patterns',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">{children}</main>
      </body>
    </html>
  );
}

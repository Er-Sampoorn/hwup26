import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/navbar';

export const metadata: Metadata = {
  title: 'FranchiseGuard AI — Multimodal Franchise Compliance Intelligence Platform',
  description: 'Enterprise AI continuous compliance intelligence for franchise networks. Powered natively by RocketRide declarative .pipe pipelines. Zero false accusations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-background text-slate-100 antialiased flex flex-col selection:bg-amber-500 selection:text-slate-950">
        <Navbar />
        <main className="flex-1 pb-16">{children}</main>
        <footer className="border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-6 text-xs text-slate-400">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></div>
              <span>
                <strong>FranchiseGuard AI</strong> • Problem Statement #18: Franchise Standards Auditor
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-slate-400 font-mono text-[11px]">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
                RocketRide .pipe Multi-Agent Engine Active
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">Zero False Accusation SLA ($\ge 90\%$ Conf)</span>
              <span>•</span>
              <span className="text-slate-500">National Innovation Showcase 2026</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

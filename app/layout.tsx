import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/navbar';

export const metadata: Metadata = {
  title: 'BidForge AI — Evidence-Backed RFP Automation Platform',
  description: 'Production-ready AI RFP & Tender automation powered by RocketRide orchestration engine.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-slate-100 antialiased flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border/60 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
          <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div>
              © 2026 BidForge AI Platform. Core AI Engine powered by <strong className="text-cyan-400 font-mono">RocketRide .pipe Orchestration</strong>.
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span> RocketRide Active</span>
              <span>•</span>
              <span>Zero Hallucination Guarantee</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

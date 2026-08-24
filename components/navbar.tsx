'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Cpu, Database, FolderGit2, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  const handleSeedDemo = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/demo/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.projectId) {
        setSeedSuccess(true);
        setTimeout(() => {
          router.push(`/projects/${data.projectId}`);
          router.refresh();
        }, 800);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-background">
                <ShieldCheck className="h-5 w-5 text-blue-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                BidForge <span className="text-blue-400">AI</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                RFP & Tender Automation
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-300">
            <Link href="/dashboard" className="hover:text-white transition-colors flex items-center gap-1.5">
              <FolderGit2 className="h-4 w-4 text-blue-400" />
              Projects
            </Link>
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-semibold text-slate-300">
              <Cpu className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
              <span>Engine: <strong className="text-cyan-300 font-mono">RocketRide AI</strong></span>
            </div>
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSeedDemo}
            disabled={seeding || seedSuccess}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50"
          >
            {seedSuccess ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                Demo Loaded!
              </>
            ) : seeding ? (
              <>
                <Sparkles className="h-3.5 w-3.5 animate-spin text-cyan-300" />
                Seeding 100+ Reqs...
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                Load Demo Dataset
              </>
            )}
          </button>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </header>
  );
}

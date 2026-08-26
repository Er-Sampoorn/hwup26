'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ShieldCheck, Cpu, Building2, Sparkles, CheckCircle2, AlertOctagon, Layers, ArrowRight, UserCheck } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  const handleSeedDemo = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/demo/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.heroLocationId) {
        setSeedSuccess(true);
        setTimeout(() => {
          router.push(`/locations/${data.heroLocationId}`);
          router.refresh();
        }, 600);
      }
    } catch (err) {
      console.error('Failed to seed demo database:', err);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 via-rose-600 to-indigo-600 p-0.5 shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                <ShieldCheck className="h-5 w-5 text-amber-400 group-hover:rotate-6 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-white">
                  FranchiseGuard <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400 bg-clip-text text-transparent">AI</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  PS#18
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                Enterprise Compliance Intelligence
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-300">
            <Link
              href="/dashboard"
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                pathname === '/dashboard' ? 'bg-slate-800/90 text-amber-400 border border-slate-700' : 'hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <Building2 className="h-3.5 w-3.5 text-amber-400" />
              Locations Command
            </Link>

            <Link
              href="/#architecture"
              className="px-3 py-1.5 rounded-lg hover:bg-slate-800/50 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Layers className="h-3.5 w-3.5 text-cyan-400" />
              RocketRide .pipe Engine
            </Link>

            <Link
              href="/#hero-showcase"
              className="px-3 py-1.5 rounded-lg hover:bg-slate-800/50 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <AlertOctagon className="h-3.5 w-3.5 text-rose-400" />
              Hero Case (LOC-042)
            </Link>
          </nav>
        </div>

        {/* Live Engine Status & Action Controls */}
        <div className="flex items-center gap-3">
          {/* RocketRide Engine Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 shadow-sm shadow-cyan-500/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>RocketRide <strong className="text-white">Active (10 Agents)</strong></span>
          </div>

          {/* 1-Click Demo Dataset Seeder */}
          <button
            onClick={handleSeedDemo}
            disabled={seeding || seedSuccess}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 shadow-md shadow-amber-500/25 transition-all disabled:opacity-50 group"
          >
            {seedSuccess ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                <span>Dataset Ready! Navigating...</span>
              </>
            ) : seeding ? (
              <>
                <Sparkles className="h-3.5 w-3.5 animate-spin text-amber-300" />
                <span>Seeding 50 Stores...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
                <span>🚀 Instant Pitch Demo</span>
              </>
            )}
          </button>

          {/* Quick Sign In / User Profile */}
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-colors shadow-sm"
          >
            <UserCheck className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden md:inline">Ops Portal</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

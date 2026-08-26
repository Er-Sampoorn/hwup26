'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  ShieldCheck, Cpu, Building2, Sparkles, CheckCircle2, AlertOctagon,
  Layers, ArrowRight, UserCheck, Activity
} from 'lucide-react';

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
        }, 500);
      }
    } catch (err) {
      console.error('Failed to seed demo database:', err);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-2xl transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* LEFT: Logo & Brand Lockup */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3.5 group shrink-0">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#070b18]">
                <ShieldCheck className="h-6 w-6 text-amber-400 group-hover:rotate-6 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white leading-none">
                  FranchiseGuard <span className="text-gradient-gold">AI</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  PS#18
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-[0.18em] font-bold text-slate-400 mt-1">
                Compliance Intelligence
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 text-xs font-bold text-slate-300 border-l border-slate-800/80 pl-6">
            <Link
              href="/dashboard"
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
                pathname === '/dashboard'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'hover:bg-slate-900 hover:text-white text-slate-300'
              }`}
            >
              <Building2 className="h-4 w-4 text-amber-400" />
              <span>Locations Command</span>
            </Link>

            <Link
              href="/#architecture"
              className="px-3.5 py-2 rounded-xl hover:bg-slate-900 hover:text-white transition-all flex items-center gap-2 text-slate-300"
            >
              <Layers className="h-4 w-4 text-cyan-400" />
              <span>RocketRide .pipe Engine</span>
            </Link>

            <Link
              href="/#hero-showcase"
              className="px-3.5 py-2 rounded-xl hover:bg-slate-900 hover:text-white transition-all flex items-center gap-2 text-slate-300"
            >
              <AlertOctagon className="h-4 w-4 text-rose-400" />
              <span>Hero Case (LOC-042)</span>
            </Link>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-xs font-semibold text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Staging: <strong className="text-emerald-200 font-mono">staging.rocketride.ai</strong></span>
            </div>
          </nav>
        </div>

        {/* RIGHT: Live Engine Status & CTA Buttons */}
        <div className="flex items-center gap-3.5">
          {/* RocketRide Engine Pill */}
          <div className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-sm shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span className="whitespace-nowrap">
              RocketRide Engine <strong className="text-white">Active</strong>
            </span>
          </div>

          {/* 1-Click Instant Demo Button */}
          <button
            onClick={handleSeedDemo}
            disabled={seeding || seedSuccess}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold text-slate-950 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50 group shrink-0"
          >
            {seedSuccess ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-slate-950" />
                <span>Dataset Ready! Navigating...</span>
              </>
            ) : seeding ? (
              <>
                <Sparkles className="h-4 w-4 animate-spin text-slate-950" />
                <span>Seeding 50 Stores...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-slate-950 group-hover:rotate-12 transition-transform" />
                <span>Instant Pitch Demo</span>
              </>
            )}
          </button>

          {/* Ops Portal Sign In */}
          <Link
            href="/login"
            className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-colors shadow-sm shrink-0"
          >
            <UserCheck className="h-4 w-4 text-slate-400" />
            <span className="hidden sm:inline">Ops Portal</span>
          </Link>
        </div>

      </div>
    </header>
  );
}

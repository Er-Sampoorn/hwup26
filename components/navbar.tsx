'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  ShieldCheck, Search, Building2, Sparkles, CheckCircle2, AlertOctagon,
  Layers, UserCheck, Heart, ShoppingBag, SlidersHorizontal
} from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-cyber-borderLight transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        
        {/* LEFT: Cyber-Style Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white group-hover:scale-105 transition-transform">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black tracking-tight text-black">
              FranchiseGuard
            </span>
            <span className="text-[10px] font-mono font-black uppercase px-1.5 py-0.5 rounded bg-black text-white">
              AI
            </span>
          </div>
        </Link>

        {/* CENTER: Cyber Search Input Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-cyber-grayText" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 50 franchise stores, violations, standards (CLEAN-001)..."
              className="w-full bg-[#F5F5F7] hover:bg-[#EBEBEB] focus:bg-white text-xs text-cyber-darkText placeholder:text-cyber-grayText pl-10 pr-4 py-2.5 rounded-xl border border-transparent focus:border-black focus:outline-none transition-all"
            />
          </div>
        </form>

        {/* NAV LINKS (Cyber Desktop Navigation) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-[#656565]">
          <Link
            href="/dashboard"
            className={`transition-colors hover:text-black ${
              pathname === '/dashboard' ? 'text-black font-bold' : ''
            }`}
          >
            Locations Command
          </Link>
          <Link
            href="/#architecture"
            className="transition-colors hover:text-black"
          >
            RocketRide .pipe
          </Link>
          <Link
            href="/#hero-showcase"
            className="transition-colors hover:text-black text-rose-600 font-bold flex items-center gap-1"
          >
            <AlertOctagon className="h-3.5 w-3.5" />
            <span>Hero Case LOC-042</span>
          </Link>
        </nav>

        {/* RIGHT: Actions & Quick Pitch Controls */}
        <div className="flex items-center gap-3">
          {/* RocketRide Engine Active Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F5F5F7] border border-[#EBEBEB] text-xs font-medium text-black">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-semibold">RocketRide Engine</span>
          </div>

          {/* 1-Click Instant Pitch Demo Button */}
          <button
            onClick={handleSeedDemo}
            disabled={seeding || seedSuccess}
            className="cyber-btn-black text-xs py-2.5 px-4 rounded-xl disabled:opacity-50 group shrink-0"
          >
            {seedSuccess ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Ready!</span>
              </>
            ) : seeding ? (
              <>
                <Sparkles className="h-4 w-4 animate-spin text-amber-400" />
                <span>Seeding...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                <span>Instant Demo</span>
              </>
            )}
          </button>

          {/* Ops Portal Link */}
          <Link
            href="/login"
            className="flex items-center justify-center h-10 w-10 rounded-xl bg-[#F5F5F7] hover:bg-[#EBEBEB] text-black transition-colors"
            title="Ops Portal"
          >
            <UserCheck className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </header>
  );
}

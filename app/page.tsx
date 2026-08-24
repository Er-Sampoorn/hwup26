'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Cpu, ArrowRight, CheckCircle2, Layers, AlertTriangle, Sparkles, Building2, Search, Eye, AlertOctagon, TrendingUp, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-slate-100 selection:bg-amber-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.15),rgba(255,255,255,0))]"></div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-400 mb-8">
            <Cpu className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span>Problem Statement #18 — <strong>RocketRide Multimodal AI Engine</strong></span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-tight">
            AI-powered continuous compliance intelligence for <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400 bg-clip-text text-transparent">every franchise location</span>.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            FranchiseGuard AI continuously audits franchise locations using photos, videos, inspection reports, and customer feedback feeds, detects violations, scores location risk, recommends corrective actions, and routes formal cure notices to human managers.
          </p>

          {/* Core Principle Alert */}
          <div className="mt-8 mx-auto max-w-2xl p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/40 text-left flex items-start gap-3 shadow-xl">
            <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white">Strict Principle: NO EVIDENCE = NO VIOLATION CLAIM</h4>
              <p className="text-xs text-slate-300 mt-1">
                Every detected compliance violation includes verifiable visual/document evidence, standard mapping, AI confidence rating, and human review approval for formal default packages. Zero false accusations.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap justify-center items-center gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-4 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 shadow-xl shadow-amber-500/25 transition-all flex items-center gap-2 group"
            >
              <span>Launch Franchise Dashboard</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/login"
              className="px-8 py-4 text-sm font-bold text-slate-200 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all"
            >
              Sign In to Ops Portal
            </Link>
          </div>
        </div>
      </section>

      {/* RocketRide Multimodal Architecture Diagram */}
      <section className="py-20 bg-slate-950/60 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white">RocketRide Multimodal AI Architecture</h2>
            <p className="text-slate-400 mt-3 text-sm">
              FranchiseGuard AI uses declarative <code className="text-cyan-400 font-mono">.pipe</code> files to execute multi-agent compliance audits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <Eye className="h-6 w-6 text-amber-400 mb-4" />
              <h3 className="text-base font-bold text-white">1. Multimodal Ingestion</h3>
              <p className="text-xs text-slate-400 mt-2">
                Ingests store photos, video walkthrough keyframes, inspection PDFs, and review feeds.
              </p>
              <span className="text-[10px] font-mono text-cyan-400 mt-4 block">media_ingestion.pipe</span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <Search className="h-6 w-6 text-cyan-400 mb-4" />
              <h3 className="text-base font-bold text-white">2. Standards Matching</h3>
              <p className="text-xs text-slate-400 mt-2">
                Maps visual & text detections against brand standards (Cleanliness, Food Safety, Branding).
              </p>
              <span className="text-[10px] font-mono text-cyan-400 mt-4 block">violation_detection.pipe</span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <AlertOctagon className="h-6 w-6 text-rose-400 mb-4" />
              <h3 className="text-base font-bold text-white">3. Risk & Recurrence</h3>
              <p className="text-xs text-slate-400 mt-2">
                Calculates transparent 0-100 risk score and flags repeated failures across past audits.
              </p>
              <span className="text-[10px] font-mono text-cyan-400 mt-4 block">risk_scoring.pipe</span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <ShieldCheck className="h-6 w-6 text-emerald-400 mb-4" />
              <h3 className="text-base font-bold text-white">4. Human Gate & Action</h3>
              <p className="text-xs text-slate-400 mt-2">
                Routes high-risk cure notices to ops managers for approval and verifies before/after remediation uploads.
              </p>
              <span className="text-[10px] font-mono text-cyan-400 mt-4 block">human_review.pipe</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

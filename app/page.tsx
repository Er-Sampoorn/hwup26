'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Cpu, ArrowRight, CheckCircle2, Layers, AlertTriangle, Sparkles, FileText, Search, Database, Lock, TrendingUp, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))]"></div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-semibold text-blue-400 mb-8">
            <Cpu className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span>Powered by <strong>RocketRide AI Orchestration Engine</strong></span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-tight">
            Evidence-backed RFP automation for <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">high-volume proposal teams</span>.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            BidForge AI ingests tenders and supporting documents, extracts requirements, delegates work across 8 specialist AI agents, validates answers against evidence, and routes high-risk items to human reviewers.
          </p>

          {/* Critical Guarantee Alert */}
          <div className="mt-8 mx-auto max-w-2xl p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/40 text-left flex items-start gap-3 shadow-xl">
            <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white">Strict Product Principle: NO EVIDENCE = NO FACTUAL CLAIM</h4>
              <p className="text-xs text-slate-300 mt-1">
                If the system cannot find sufficient evidence in your company knowledge base, it explicitly states: <em className="text-amber-300 font-mono">"Insufficient evidence — human review required"</em>. Zero hallucinations guarantee.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap justify-center items-center gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-4 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-xl shadow-blue-500/25 transition-all flex items-center gap-2 group"
            >
              <span>Launch Enterprise App</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/login"
              className="px-8 py-4 text-sm font-bold text-slate-200 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all"
            >
              Sign In to Workspace
            </Link>
          </div>
        </div>
      </section>

      {/* RocketRide Architecture Diagram Section */}
      <section className="py-20 bg-slate-950/60 border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white">RocketRide Core AI Pipeline Architecture</h2>
            <p className="text-slate-400 mt-3 text-sm">
              BidForge AI uses declarative <code className="text-cyan-400 font-mono">.pipe</code> files in RocketRide format to execute multi-agent orchestration.
            </p>
          </div>

          {/* Diagram Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">1. Ingestion & Parse</h3>
              <p className="text-xs text-slate-400 mt-2">
                Ingests PDF, DOCX, XLSX, and CSV documents. Semantic text chunking and section extraction.
              </p>
              <span className="text-[10px] font-mono text-cyan-400 mt-4 block">ingestion.pipe</span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-4">
                <Search className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">2. Evidence & Router</h3>
              <p className="text-xs text-slate-400 mt-2">
                Hybrid vector & keyword search ranks evidence. Routes questions to Technical, Commercial, or Compliance agents.
              </p>
              <span className="text-[10px] font-mono text-cyan-400 mt-4 block">evidence.pipe & agents.pipe</span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">3. Validation & Gate</h3>
              <p className="text-xs text-slate-400 mt-2">
                Inspects factuality, checks contradictions, calculates 0-100 confidence score, and routes low-confidence items.
              </p>
              <span className="text-[10px] font-mono text-cyan-400 mt-4 block">validation.pipe</span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-4">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">4. Final Package</h3>
              <p className="text-xs text-slate-400 mt-2">
                Generates DOCX proposals, PDF summaries, Excel compliance matrices, and structured JSON output.
              </p>
              <span className="text-[10px] font-mono text-cyan-400 mt-4 block">finalization.pipe</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <Lock className="h-6 w-6 text-amber-400 mb-3" />
              <h3 className="text-lg font-bold text-white">8 Specialist AI Agents</h3>
              <p className="text-xs text-slate-400 mt-2">
                Requirement Analyst, Evidence Researcher, Compliance Specialist, Technical Specialist, Commercial Specialist, Response Writer, Validator, Quality Controller.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <Users className="h-6 w-6 text-blue-400 mb-3" />
              <h3 className="text-lg font-bold text-white">Human Review Inbox</h3>
              <p className="text-xs text-slate-400 mt-2">
                High-risk legal, pricing, security guarantees, or low-confidence questions automatically route to proposal managers for one-click approval.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <TrendingUp className="h-6 w-6 text-emerald-400 mb-3" />
              <h3 className="text-lg font-bold text-white">Observability & Cost Tracking</h3>
              <p className="text-xs text-slate-400 mt-2">
                Real-time execution visualizer showing RocketRide run IDs, token counts, cost per requirement, agent trace logs, and execution duration.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

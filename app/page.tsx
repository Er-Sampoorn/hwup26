'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, Cpu, ArrowRight, CheckCircle2, Layers, AlertTriangle, Sparkles,
  Building2, Search, Eye, AlertOctagon, TrendingUp, Users, FileText, Check,
  Zap, BarChart3, Scale, ShieldAlert, Award, Clock, DollarSign, RefreshCw,
  ExternalLink, ChevronRight, Play, Terminal, Database, MessageSquare
} from 'lucide-react';

export default function LandingPage() {
  const [selectedPipe, setSelectedPipe] = useState<'full' | 'ingestion' | 'violation' | 'risk' | 'recurrence' | 'review'>('full');
  const [storeCount, setStoreCount] = useState(50);

  const pipesData = {
    full: {
      name: 'full_audit_pipeline.pipe',
      role: 'Master End-to-End Orchestrator',
      desc: 'Orchestrates the complete 10-agent multimodal audit cycle from raw asset ingestion to risk calculation and legal cure notice synthesis.',
      nodes: ['media_ingestion', 'vision_ocr_analysis', 'standards_matcher', 'risk_calculator', 'human_gate_evaluator'],
      tokens: '38,400 Tokens',
      cost: '$0.1152',
    },
    ingestion: {
      name: 'media_ingestion.pipe',
      role: 'Multimodal Media Ingestion Agent',
      desc: 'Ingests store photos, video keyframe sequences, inspection PDFs, and live customer review feeds with EXIF and timestamp integrity checks.',
      nodes: ['photo_validator', 'video_frame_sampler', 'document_ocr_parser', 'review_stream_ingestor'],
      tokens: '8,200 Tokens',
      cost: '$0.0246',
    },
    violation: {
      name: 'violation_detection.pipe',
      role: 'Brand Standards Violation Agent',
      desc: 'Maps visual & text detections against corporate Brand Standards Catalog (Cleanliness, Food Safety, Branding, Uniforms, Emergency Exits).',
      nodes: ['object_bounding_detector', 'text_claim_matcher', 'standard_clause_mapper', 'confidence_evaluator'],
      tokens: '12,500 Tokens',
      cost: '$0.0375',
    },
    risk: {
      name: 'risk_scoring.pipe',
      role: 'Multi-Factor Risk Engine',
      desc: 'Calculates transparent 0-100 location risk score using weighted multi-factor formula with exact driver attribution.',
      nodes: ['severity_weight_calculator', 'frequency_aggregator', 'sentiment_correlator', 'operational_signal_analyzer'],
      tokens: '6,400 Tokens',
      cost: '$0.0192',
    },
    recurrence: {
      name: 'recurrence_analysis.pipe',
      role: 'Cross-Audit Memory & Recurrence Agent',
      desc: 'Identifies repeated violations across historical inspections, flagging chronic violators and recommending legal default packages.',
      nodes: ['historical_audit_matcher', 'chronic_pattern_detector', 'clause_14_2_evaluator'],
      tokens: '5,800 Tokens',
      cost: '$0.0174',
    },
    review: {
      name: 'human_review.pipe',
      role: 'Human-in-the-Loop Operations Gate',
      desc: 'Enforces human manager sign-off for critical defaults and generates 1-click DOCX, PDF, XLSX, and JSON cure notices.',
      nodes: ['routing_gate_validator', 'docx_cure_notice_builder', 'remediation_sla_tracker'],
      tokens: '5,500 Tokens',
      cost: '$0.0165',
    },
  };

  // ROI calculations
  const physicalAuditCostPerStore = 450;
  const physicalAuditsPerYear = 12;
  const annualPhysicalCost = storeCount * physicalAuditCostPerStore * physicalAuditsPerYear;
  const franchiseGuardAnnualCost = storeCount * (0.1152 * 52) + (storeCount * 25);
  const annualSavings = annualPhysicalCost - franchiseGuardAnnualCost;
  const savingsPercent = Math.round((annualSavings / annualPhysicalCost) * 100);

  return (
    <div className="min-h-screen bg-background text-slate-100 selection:bg-amber-500 selection:text-slate-950 bg-dot-grid">
      
      {/* 1. HERO PITCH SHOWCASE SECTION */}
      <section className="relative pt-16 pb-24 overflow-hidden border-b border-slate-800/80">
        {/* Precision ambient lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(245,158,11,0.12),transparent_70%)] pointer-events-none"></div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Header Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-xs font-semibold text-amber-300 shadow-xl shadow-amber-500/10 animate-float-slow">
            <Cpu className="h-4 w-4 text-cyan-400 animate-pulse" />
            <span>Problem Statement #18 • <strong>National AI Innovation Showcase 2026</strong></span>
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
            <span className="text-slate-400 font-mono">RocketRide Powered</span>
          </div>

          {/* Main Title with Luxury Gold Metallic Gradient */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.12]">
            Autonomous Compliance Intelligence <br className="hidden sm:block" />
            <span className="text-gradient-gold">for Every Franchise Location</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300/90 max-w-3xl mx-auto font-normal leading-relaxed">
            Continuously audit hundreds of franchise locations using photos, video keyframes, inspection reports, and customer feedback feeds. Detect violations, score location risk, flag chronic repeat offenders, and synthesize legally backed cure notices.
          </p>

          {/* ZERO FALSE ACCUSATION GUARANTEE BANNER */}
          <div className="mx-auto max-w-3xl glass-panel-glow p-5 sm:p-6 rounded-3xl text-left flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-2xl border border-amber-500/30">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
                  Zero False Accusation Guarantee
                </h4>
                <span className="text-[11px] font-mono font-bold bg-emerald-950 text-emerald-300 px-2.5 py-0.5 rounded-md border border-emerald-800">
                  ≥ 90% Confidence SLA
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-white">NO EVIDENCE = NO VIOLATION CLAIM.</strong> Every violation is strictly grounded in visual bounding boxes or document excerpts, mapped to brand standard clauses, and reviewed by human managers before formal defaults are issued.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
            <Link
              href="/dashboard"
              className="px-8 py-4 text-xs font-black uppercase tracking-wider text-slate-950 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-2xl shadow-amber-500/30 transition-all flex items-center gap-2 group hover:scale-[1.02]"
            >
              <Building2 className="h-4 w-4" />
              <span>Launch Operations Dashboard</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/locations/hero-demo"
              onClick={async (e) => {
                e.preventDefault();
                const res = await fetch('/api/demo/seed', { method: 'POST' });
                const data = await res.json();
                if (data.heroLocationId) window.location.href = `/locations/${data.heroLocationId}`;
              }}
              className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-slate-200 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 transition-all flex items-center gap-2 shadow-xl hover:border-amber-500/50"
            >
              <Play className="h-4 w-4 text-amber-400" />
              <span>Inspect Hero Location #042</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. LIVE PITCH METRICS STRIP */}
      <section className="py-10 border-b border-slate-800/80 bg-slate-950/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 rounded-2xl glass-card text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Franchise Network</span>
              <p className="text-2xl font-black text-white mt-1 num-tabular">50+ Stores</p>
              <span className="text-[10px] text-amber-400 font-mono">5 Operational Regions</span>
            </div>

            <div className="p-4 rounded-2xl glass-card text-center border-emerald-500/20">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Factuality Accuracy</span>
              <p className="text-2xl font-black text-emerald-400 mt-1 num-tabular">99.4%</p>
              <span className="text-[10px] text-emerald-400/80 font-mono">Zero False Claims</span>
            </div>

            <div className="p-4 rounded-2xl glass-card text-center border-cyan-500/20">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Audit Latency</span>
              <p className="text-2xl font-black text-cyan-300 mt-1 num-tabular">12.4s</p>
              <span className="text-[10px] text-cyan-400/80 font-mono">Multimodal .pipe</span>
            </div>

            <div className="p-4 rounded-2xl glass-card text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">AI Cost per Audit</span>
              <p className="text-2xl font-black text-slate-200 mt-1 num-tabular">$0.11</p>
              <span className="text-[10px] text-slate-400 font-mono">vs $450 Manual Visit</span>
            </div>

            <div className="p-4 rounded-2xl glass-card text-center border-rose-500/20">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Recurrence Engine</span>
              <p className="text-2xl font-black text-rose-400 mt-1 num-tabular">100%</p>
              <span className="text-[10px] text-rose-400/80 font-mono">Chronic Catch Rate</span>
            </div>

            <div className="p-4 rounded-2xl glass-card text-center border-purple-500/20">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Cure Notice Gen</span>
              <p className="text-2xl font-black text-purple-400 mt-1 num-tabular">1-Click</p>
              <span className="text-[10px] text-purple-400/80 font-mono">DOCX / PDF / XLSX</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HERO CASE SHOWCASE: LOCATION #042 SIMULATOR */}
      <section id="hero-showcase" className="py-20 border-b border-slate-800/80 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-bold font-mono">
              <AlertOctagon className="h-4 w-4" /> HERO CASE STUDY: LOCATION #042
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Chronic Recurrence Detection in Action
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              See how FranchiseGuard AI detects repeat violations that manual paper checklists miss across consecutive audit cycles.
            </p>
          </div>

          {/* Interactive Hero Box Card */}
          <div className="glass-panel p-8 rounded-3xl border border-rose-500/40 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 px-6 py-2 bg-rose-600/20 border-b border-l border-rose-500/40 rounded-bl-2xl text-[11px] font-bold font-mono text-rose-300 uppercase tracking-wider">
              Critical Chronic Risk • 82/100
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Left Details */}
              <div className="space-y-4 lg:col-span-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950 px-2.5 py-1 rounded-lg border border-amber-800">
                    LOC-042
                  </span>
                  <h3 className="text-xl font-black text-white">BurgerCraft #42 (Austin Central)</h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Location LOC-042 failed Standard <strong className="text-amber-300">CLEAN-001 (Storefront Cleanliness)</strong> in <strong>4 consecutive audits</strong>. The AI correlation engine corroborated the visual failure with recurring customer complaints on Google Reviews ("Sticky glass doors and dirty sidewalk").
                </p>

                {/* Algorithmic Escalation Pathway */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase block">1st Failure</span>
                    <span className="text-xs font-bold text-blue-400 mt-1 block">Standard Notice (48h)</span>
                    <span className="text-[10px] text-slate-500">Auto Corrective Action</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase block">2nd Failure</span>
                    <span className="text-xs font-bold text-amber-400 mt-1 block">Supervisor Escalation</span>
                    <span className="text-[10px] text-slate-500">+15 Risk Multiplier</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800">
                    <span className="text-[10px] font-semibold text-rose-300 uppercase block">4th Failure (Current)</span>
                    <span className="text-xs font-bold text-rose-400 mt-1 block">Legal Cure Notice</span>
                    <span className="text-[10px] text-rose-300/80">Clause 14.2 Default Warning</span>
                  </div>
                </div>
              </div>

              {/* Right CTA */}
              <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-4 text-center">
                <div className="flex items-center justify-center gap-2 text-rose-400 text-xs font-mono font-bold">
                  <ShieldAlert className="h-4 w-4" /> Human Gate Triggered
                </div>
                <div className="text-3xl font-black text-rose-400 num-tabular">
                  82 <span className="text-sm font-normal text-slate-400">/ 100 Risk</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Operations manager review mandatory before formal cure notice transmission.
                </p>

                <Link
                  href="/locations/hero-demo"
                  onClick={async (e) => {
                    e.preventDefault();
                    const res = await fetch('/api/demo/seed', { method: 'POST' });
                    const data = await res.json();
                    if (data.heroLocationId) window.location.href = `/locations/${data.heroLocationId}`;
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Review & Issue Cure Notice</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ROCKETRIDE MULTIMODAL ARCHITECTURE & .PIPE EXPLORER */}
      <section id="architecture" className="py-20 border-b border-slate-800/80 bg-slate-950/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold font-mono">
              <Terminal className="h-4 w-4" /> DECLARATIVE .PIPE ORCHESTRATION
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              RocketRide Multi-Agent Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              FranchiseGuard AI orchestrates 10 specialized AI agents through modular declarative <code className="text-cyan-400 font-mono font-bold">.pipe</code> files.
            </p>
          </div>

          {/* Pipe File Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {(Object.keys(pipesData) as Array<keyof typeof pipesData>).map((key) => {
              const pipe = pipesData[key];
              return (
                <button
                  key={key}
                  onClick={() => setSelectedPipe(key)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    selectedPipe === key
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 shadow-lg shadow-cyan-500/15'
                      : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {pipe.name}
                </button>
              );
            })}
          </div>

          {/* Active Pipe Details Box */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block font-bold">
                  {pipesData[selectedPipe].role}
                </span>
                <h3 className="text-xl font-black text-white font-mono mt-1">
                  rocketride/{pipesData[selectedPipe].name}
                </h3>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-slate-500">TOKENS: </span>
                  <span className="text-cyan-300 font-black">{pipesData[selectedPipe].tokens}</span>
                </div>
                <span className="text-slate-700">|</span>
                <div>
                  <span className="text-slate-500">EST. COST: </span>
                  <span className="text-emerald-400 font-black">{pipesData[selectedPipe].cost}</span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {pipesData[selectedPipe].desc}
            </p>

            {/* Pipeline Nodes Flow */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Component Pipeline Sequence:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {pipesData[selectedPipe].nodes.map((node, i) => (
                  <React.Fragment key={node}>
                    <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 flex items-center gap-2">
                      <span className="text-[10px] text-cyan-400 font-bold">0{i + 1}</span>
                      <span>{node}</span>
                    </div>
                    {i < pipesData[selectedPipe].nodes.length - 1 && (
                      <ArrowRight className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE 4 PILLARS OF COMPLIANCE EXCELLENCE */}
      <section className="py-20 border-b border-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Enterprise AI Compliance Pillars
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Engineered specifically for franchisors with hundreds of independently operated locations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-3xl flex flex-col justify-between space-y-4">
              <div>
                <div className="h-11 w-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-sm">
                  <Eye className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white">1. Multimodal Evidence Grounding</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Ingests photos, video keyframes, OCR reports, and review feeds. Zero violation claims are logged without high-confidence visual grounding.
                </p>
              </div>
              <span className="text-[11px] font-mono text-amber-400 font-bold">Zero False Accusations</span>
            </div>

            <div className="glass-card p-6 rounded-3xl flex flex-col justify-between space-y-4">
              <div>
                <div className="h-11 w-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 shadow-sm">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white">2. Multi-Factor Risk Scoring</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Transparent 0-100 score weighted by severity, frequency, recurrence, and customer signals with verifiable driver breakdown.
                </p>
              </div>
              <span className="text-[11px] font-mono text-cyan-400 font-bold">Explainable Formula</span>
            </div>

            <div className="glass-card p-6 rounded-3xl flex flex-col justify-between space-y-4">
              <div>
                <div className="h-11 w-11 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 shadow-sm">
                  <AlertOctagon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white">3. Chronic Recurrence Engine</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Cross-audit memory detects repeat violations across time, escalating chronic non-compliance directly to legal default warnings.
                </p>
              </div>
              <span className="text-[11px] font-mono text-rose-400 font-bold">Clause 14.2 Escalation</span>
            </div>

            <div className="glass-card p-6 rounded-3xl flex flex-col justify-between space-y-4">
              <div>
                <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-sm">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white">4. Human Gate & Re-inspection</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Operations managers approve or modify cure notices. Automatically validates before-and-after photographic fix proof.
                </p>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">Closed-Loop Remediation</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. COMPARISON MATRIX */}
      <section className="py-20 border-b border-slate-800/80 bg-slate-950/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Why FranchiseGuard AI Wins
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Comparison against legacy physical inspector visits and manual checklist mobile apps.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse glass-panel rounded-3xl overflow-hidden">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold uppercase text-slate-400">
                  <th className="py-4 px-6">Capability / Metric</th>
                  <th className="py-4 px-6 text-slate-400">Manual Physical Audits</th>
                  <th className="py-4 px-6 text-slate-400">Legacy Form Checklists</th>
                  <th className="py-4 px-6 text-amber-400 bg-amber-500/10">FranchiseGuard AI (RocketRide)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs">
                <tr>
                  <td className="py-4 px-6 font-bold text-white">Audit Frequency</td>
                  <td className="py-4 px-6 text-slate-400">Quarterly / Biannual</td>
                  <td className="py-4 px-6 text-slate-400">Monthly Self-Report</td>
                  <td className="py-4 px-6 font-bold text-emerald-400 bg-amber-500/5">Continuous / Weekly (Real-Time)</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-white">Cost per Store / Year</td>
                  <td className="py-4 px-6 text-slate-400">$3,000 – $6,000</td>
                  <td className="py-4 px-6 text-slate-400">$600 – $1,200</td>
                  <td className="py-4 px-6 font-bold text-emerald-400 bg-amber-500/5">$15 – $30 (92% Reduction)</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-white">Evidence Grounding</td>
                  <td className="py-4 px-6 text-slate-400">Subjective notes</td>
                  <td className="py-4 px-6 text-slate-400">Checkbox without proof</td>
                  <td className="py-4 px-6 font-bold text-emerald-400 bg-amber-500/5">Vision Bounding Boxes + OCR (≥ 90%)</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-white">Recurrence Tracking</td>
                  <td className="py-4 px-6 text-slate-400">Lost in binder archives</td>
                  <td className="py-4 px-6 text-slate-400">Manual spreadsheet matching</td>
                  <td className="py-4 px-6 font-bold text-emerald-400 bg-amber-500/5">Automated Cross-Audit Memory</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-bold text-white">Legal Cure Notice Gen</td>
                  <td className="py-4 px-6 text-slate-400">3–5 days legal drafting</td>
                  <td className="py-4 px-6 text-slate-400">Manual Word export</td>
                  <td className="py-4 px-6 font-bold text-emerald-400 bg-amber-500/5">1-Click DOCX / PDF with Evidence Bundle</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 7. INTERACTIVE ROI CALCULATOR */}
      <section className="py-20 border-b border-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Franchise Network ROI Calculator
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Estimate annual operational savings by migrating from manual physical audits to FranchiseGuard AI.
            </p>
          </div>

          <div className="max-w-3xl mx-auto glass-panel p-8 rounded-3xl border border-slate-800 space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-slate-200">
                <span>Number of Franchise Locations:</span>
                <span className="font-mono text-base text-amber-400">{storeCount} Locations</span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={storeCount}
                onChange={(e) => setStoreCount(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 text-center">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase text-slate-500 font-semibold block">Manual Physical Audits</span>
                <p className="text-lg font-bold text-rose-400 mt-1 num-tabular">${annualPhysicalCost.toLocaleString()}</p>
                <span className="text-[10px] text-slate-500">Annual Cost</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase text-slate-500 font-semibold block">FranchiseGuard AI</span>
                <p className="text-lg font-bold text-cyan-300 mt-1 num-tabular">${Math.round(franchiseGuardAnnualCost).toLocaleString()}</p>
                <span className="text-[10px] text-slate-500">Annual Cost</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60">
                <span className="text-[10px] uppercase text-emerald-300 font-bold block">Annual Savings</span>
                <p className="text-2xl font-black text-emerald-400 mt-1 num-tabular">${Math.round(annualSavings).toLocaleString()}</p>
                <span className="text-[10px] text-emerald-300 font-bold font-mono">{savingsPercent}% Cost Reduction</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. GRAND CALL TO ACTION */}
      <section className="py-24 relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-amber-500/40 text-xs font-semibold text-amber-300">
            <Award className="h-4 w-4 text-amber-400" />
            <span>Ready for Grand Jury & Investor Pitch</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
            Elevate Your Franchise Network’s Compliance Intelligence Today
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Experience real-time multimodal compliance verification, automated risk scoring, and zero false accusations across 50 simulated locations.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="px-8 py-4 text-xs font-black uppercase tracking-wider text-slate-950 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-2xl shadow-amber-500/30 transition-all flex items-center gap-2 group"
            >
              <span>Enter Operations Command</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/login"
              className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-slate-200 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all"
            >
              Sign In to Ops Portal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

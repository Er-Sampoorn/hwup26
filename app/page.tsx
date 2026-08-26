'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, Cpu, ArrowRight, CheckCircle2, Layers, AlertTriangle, Sparkles,
  Building2, Search, Eye, AlertOctagon, TrendingUp, Users, FileText, Check,
  Zap, BarChart3, Scale, ShieldAlert, Award, Clock, DollarSign, RefreshCw,
  ExternalLink, ChevronRight, Play, Terminal, Database, MessageSquare,
  Thermometer, Sparkle, Flame, UtensilsCrossed, Store
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

  const categories = [
    { code: 'CLEAN-001', name: 'Cleanliness', icon: Sparkles, standard: 'Storefront Cleanliness' },
    { code: 'FOOD-002', name: 'Food Safety', icon: Thermometer, standard: 'Temperature Control' },
    { code: 'BRAND-014', name: 'Branding', icon: Store, standard: 'Exterior Signage' },
    { code: 'UNIFORM-003', name: 'Uniforms', icon: UtensilsCrossed, standard: 'Staff Hygiene' },
    { code: 'SAFETY-005', name: 'Safety Exits', icon: AlertTriangle, standard: 'Emergency Corridors' },
    { code: 'EQUIP-008', name: 'Equipment', icon: Flame, standard: 'Deep Fryer & Hoods' },
  ];

  const featuredStores = [
    {
      id: 'hero',
      code: 'LOC-042',
      name: 'BurgerCraft #42 (Austin)',
      region: 'Central',
      riskScore: 82,
      riskCategory: 'CRITICAL',
      complianceScore: 62,
      violations: 4,
      isHero: true,
      tag: 'CHRONIC 4X VIOLATION',
    },
    {
      id: 'loc-007',
      code: 'LOC-007',
      name: 'BurgerCraft #7 (Dallas)',
      region: 'Central',
      riskScore: 64,
      riskCategory: 'HIGH',
      complianceScore: 75,
      violations: 2,
      isHero: false,
      tag: 'ACTION REQUIRED',
    },
    {
      id: 'loc-014',
      code: 'LOC-014',
      name: 'BurgerCraft #14 (Miami)',
      region: 'South East',
      riskScore: 58,
      riskCategory: 'MEDIUM',
      complianceScore: 82,
      violations: 1,
      isHero: false,
      tag: 'RE-INSPECTION DUE',
    },
    {
      id: 'loc-001',
      code: 'LOC-001',
      name: 'BurgerCraft #1 (Boston)',
      region: 'North East',
      riskScore: 18,
      riskCategory: 'LOW',
      complianceScore: 98,
      violations: 0,
      isHero: false,
      tag: 'CERTIFIED COMPLIANT',
    },
  ];

  // ROI calculations
  const physicalAuditCostPerStore = 450;
  const physicalAuditsPerYear = 12;
  const annualPhysicalCost = storeCount * physicalAuditCostPerStore * physicalAuditsPerYear;
  const franchiseGuardAnnualCost = storeCount * (0.1152 * 52) + (storeCount * 25);
  const annualSavings = annualPhysicalCost - franchiseGuardAnnualCost;
  const savingsPercent = Math.round((annualSavings / annualPhysicalCost) * 100);

  return (
    <div className="min-h-screen bg-white text-cyber-darkText">
      
      {/* 1. CYBER HERO BANNER SECTION (Dark Velvet #211C24 Container) */}
      <section className="bg-cyber-banner text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-cyber-borderDark overflow-hidden relative">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Cyber Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold tracking-wide">
                <Cpu className="h-3.5 w-3.5 text-cyan-400" />
                <span>Problem Statement #18 • <strong>National AI Innovation Showcase 2026</strong></span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                Autonomous Compliance Intelligence for Every Franchise Location
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Continuous multimodal compliance auditing using photos, video keyframes, inspection reports, and customer feedback. Powered natively by RocketRide .pipe pipelines with zero false accusations.
              </p>

              {/* Zero False Accusation SLA Pill */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 max-w-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="text-xs">
                  <div className="flex items-center gap-2">
                    <strong className="text-white uppercase font-bold">Zero False Accusation Guarantee</strong>
                    <span className="bg-emerald-500/30 text-emerald-300 font-mono font-bold px-2 py-0.5 rounded text-[10px]">
                      ≥ 90% SLA
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] mt-0.5">
                    Every violation is grounded in visual bounding boxes and corporate brand clauses.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/dashboard"
                  className="cyber-btn-white text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl font-bold"
                >
                  <Building2 className="h-4 w-4" />
                  <span>Launch Operations Command</span>
                </Link>

                <Link
                  href="/locations/hero-demo"
                  onClick={async (e) => {
                    e.preventDefault();
                    const res = await fetch('/api/demo/seed', { method: 'POST' });
                    const data = await res.json();
                    if (data.heroLocationId) window.location.href = `/locations/${data.heroLocationId}`;
                  }}
                  className="cyber-btn-outline-white text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl font-bold"
                >
                  <Play className="h-4 w-4 text-amber-400" />
                  <span>Inspect Hero LOC-042</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Cyber Visual Telemetry Box */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-3xl bg-[#141414] border border-[#2E2E2E] shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-rose-500 animate-pulse"></div>
                    <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                      Live Telemetry: LOC-042
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                    CRITICAL RISK 82/100
                  </span>
                </div>

                {/* Score & Gauge */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-black/60 border border-white/5 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Risk Score</span>
                    <span className="text-3xl font-black text-rose-400 num-tabular">82</span>
                    <span className="text-[10px] text-slate-500 block">/ 100 Multi-Factor</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/60 border border-white/5 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Recurrence</span>
                    <span className="text-3xl font-black text-amber-400 num-tabular">4x</span>
                    <span className="text-[10px] text-slate-500 block">CLEAN-001 Storefront</span>
                  </div>
                </div>

                {/* Agent Pipeline Stream */}
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-2 text-cyan-300">
                      <Cpu className="h-3.5 w-3.5" /> RocketRide .pipe
                    </span>
                    <span className="text-emerald-400 text-[11px]">10 AGENTS COMPLETED</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-slate-300">
                    <span>Audit Time / Cost:</span>
                    <span className="text-white font-bold">12.4s / $0.115</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CYBER 4-TILE MODULAR PROMO GRID */}
      <section className="py-12 border-b border-cyber-borderLight bg-[#FAFAFA]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Tile 1 */}
            <div className="cyber-card p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                  <Eye className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-black">Multimodal Grounding</h3>
                <p className="text-xs text-cyber-grayText leading-relaxed">
                  Vision bounding boxes & OCR excerpts mapped directly to corporate brand clauses. Zero false claims without proof.
                </p>
              </div>
              <span className="text-[11px] font-mono font-bold text-black">≥ 90% Confidence SLA</span>
            </div>

            {/* Tile 2 */}
            <div className="cyber-card p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-black">Multi-Factor Risk Scoring</h3>
                <p className="text-xs text-cyber-grayText leading-relaxed">
                  Transparent 0-100 location risk formula factoring severity, recurrence, customer reviews, and operational signals.
                </p>
              </div>
              <span className="text-[11px] font-mono font-bold text-black">100% Explainable</span>
            </div>

            {/* Tile 3 */}
            <div className="cyber-card p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                  <AlertOctagon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-black">Chronic Recurrence Engine</h3>
                <p className="text-xs text-cyber-grayText leading-relaxed">
                  Cross-audit memory detects chronic repeated violations and escalates directly to Clause 14.2 default warning.
                </p>
              </div>
              <span className="text-[11px] font-mono font-bold text-black">Hero Case LOC-042</span>
            </div>

            {/* Tile 4 */}
            <div className="cyber-card p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-black">1-Click Cure Notice Generator</h3>
                <p className="text-xs text-cyber-grayText leading-relaxed">
                  Generate professional DOCX, PDF, XLSX, and JSON legal cure notices bundled with photographic proof.
                </p>
              </div>
              <span className="text-[11px] font-mono font-bold text-black">Multi-Format Exports</span>
            </div>

          </div>
        </div>
      </section>

      {/* 3. CYBER CATEGORY BROWSER BAR (Browse by Standards) */}
      <section className="py-16 border-b border-cyber-borderLight">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-black">
                Browse Brand Standards Categories
              </h2>
              <p className="text-xs text-cyber-grayText mt-1">
                Corporate brand compliance rules evaluated by the RocketRide vision and OCR pipeline.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="text-xs font-bold text-black hover:underline flex items-center gap-1"
            >
              <span>View all 50 franchise locations</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.code}
                  className="cyber-card p-5 text-center flex flex-col items-center justify-center gap-3 cursor-pointer group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0F0F0] text-black group-hover:bg-black group-hover:text-white transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-black">{cat.name}</h4>
                    <span className="text-[10px] font-mono text-cyber-grayText">{cat.code}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. FEATURED STORES CATALOG (Cyber Product Card System) */}
      <section className="py-16 border-b border-cyber-borderLight bg-[#FAFAFA]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase font-bold tracking-wider text-cyber-grayText block">
                Network Intelligence Showcase
              </span>
              <h2 className="text-2xl font-black tracking-tight text-black mt-1">
                Active Franchise Locations
              </h2>
            </div>
            <Link
              href="/dashboard"
              className="cyber-btn-white text-xs py-2 px-4 rounded-xl"
            >
              <span>Explore All 50 Stores</span>
            </Link>
          </div>

          {/* 4-Card Grid (Cyber Product Card Style) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredStores.map((store) => (
              <div
                key={store.code}
                className={`cyber-card p-5 flex flex-col justify-between space-y-4 relative ${
                  store.isHero ? 'border-rose-400 bg-rose-50/20' : ''
                }`}
              >
                {/* Top Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`cyber-badge ${
                      store.riskCategory === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-700'
                        : store.riskCategory === 'HIGH'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {store.tag}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-cyber-grayText">
                    {store.region}
                  </span>
                </div>

                {/* Visual Preview Box */}
                <div className="h-36 rounded-2xl bg-white border border-cyber-borderLight flex flex-col items-center justify-center p-4 text-center">
                  <Building2 className={`h-10 w-10 ${store.isHero ? 'text-rose-500' : 'text-slate-400'} mb-2`} />
                  <span className="text-2xl font-black text-black num-tabular">
                    {store.complianceScore}%
                  </span>
                  <span className="text-[10px] text-cyber-grayText uppercase font-semibold">
                    Compliance Score
                  </span>
                </div>

                {/* Details */}
                <div>
                  <span className="text-[10px] font-mono font-bold text-cyber-grayText">{store.code}</span>
                  <h3 className="text-sm font-bold text-black truncate">{store.name}</h3>
                  <div className="flex items-center justify-between text-xs text-cyber-grayText mt-2 pt-2 border-t border-cyber-borderLight">
                    <span>Risk Score:</span>
                    <strong className={`font-mono ${store.isHero ? 'text-rose-600' : 'text-black'}`}>
                      {store.riskScore}/100
                    </strong>
                  </div>
                </div>

                {/* Bottom Cyber Black Action Button */}
                <Link
                  href={store.isHero ? '/locations/hero-demo' : `/dashboard?q=${store.code}`}
                  onClick={async (e) => {
                    if (store.isHero) {
                      e.preventDefault();
                      const res = await fetch('/api/demo/seed', { method: 'POST' });
                      const data = await res.json();
                      if (data.heroLocationId) window.location.href = `/locations/${data.heroLocationId}`;
                    }
                  }}
                  className="cyber-btn-black text-xs py-2.5 w-full rounded-xl"
                >
                  <span>{store.isHero ? 'Inspect Hero Notice' : 'View Store Profile'}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CYBER FULL-WIDTH DARK BANNER (RocketRide Architecture) */}
      <section id="architecture" className="bg-black text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-cyber-borderDark">
        <div className="mx-auto max-w-7xl space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cyan-400 text-xs font-mono font-bold">
              <Terminal className="h-3.5 w-3.5" /> DECLARATIVE .PIPE ENGINE
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              RocketRide Multi-Agent Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              FranchiseGuard AI orchestrates 10 specialized AI agents through modular declarative .pipe files.
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
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    selectedPipe === key
                      ? 'bg-white text-black shadow-lg'
                      : 'bg-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {pipe.name}
                </button>
              );
            })}
          </div>

          {/* Active Pipe Info Box */}
          <div className="p-8 rounded-3xl bg-[#141414] border border-[#2E2E2E] space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block font-bold">
                  {pipesData[selectedPipe].role}
                </span>
                <h3 className="text-xl font-black text-white font-mono mt-1">
                  rocketride/{pipesData[selectedPipe].name}
                </h3>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono bg-black px-4 py-2 rounded-xl border border-white/10">
                <div>
                  <span className="text-slate-500">TOKENS: </span>
                  <span className="text-cyan-300 font-bold">{pipesData[selectedPipe].tokens}</span>
                </div>
                <span className="text-slate-700">|</span>
                <div>
                  <span className="text-slate-500">COST: </span>
                  <span className="text-emerald-400 font-bold">{pipesData[selectedPipe].cost}</span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {pipesData[selectedPipe].desc}
            </p>

            {/* Nodes Sequence */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {pipesData[selectedPipe].nodes.map((node, i) => (
                <React.Fragment key={node}>
                  <div className="px-3 py-1.5 rounded-lg bg-black border border-white/10 text-xs font-mono text-slate-200 flex items-center gap-2">
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

          {/* ROI Calculator */}
          <div className="p-8 rounded-3xl bg-[#141414] border border-[#2E2E2E] space-y-6">
            <div className="flex justify-between items-center text-xs font-bold text-slate-200">
              <span>Franchise Network Scale:</span>
              <span className="font-mono text-base text-amber-400">{storeCount} Locations</span>
            </div>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={storeCount}
              onChange={(e) => setStoreCount(parseInt(e.target.value))}
              className="w-full h-2 bg-black rounded-lg appearance-none cursor-pointer accent-white"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-center">
              <div className="p-4 rounded-2xl bg-black border border-white/10">
                <span className="text-[10px] uppercase text-slate-500 font-semibold block">Manual Physical Audits</span>
                <p className="text-lg font-bold text-rose-400 mt-1 num-tabular">${annualPhysicalCost.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-2xl bg-black border border-white/10">
                <span className="text-[10px] uppercase text-slate-500 font-semibold block">FranchiseGuard AI</span>
                <p className="text-lg font-bold text-cyan-300 mt-1 num-tabular">${Math.round(franchiseGuardAnnualCost).toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800">
                <span className="text-[10px] uppercase text-emerald-300 font-bold block">Annual Savings</span>
                <p className="text-2xl font-black text-emerald-400 mt-1 num-tabular">${Math.round(annualSavings).toLocaleString()}</p>
                <span className="text-[10px] text-emerald-300 font-bold font-mono">{savingsPercent}% Reduction</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CYBER MINIMALIST BLACK FOOTER */}
      <footer className="bg-black text-slate-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-cyber-borderDark">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black font-black text-xs">
              FG
            </div>
            <div>
              <span className="text-white font-bold text-sm block">FranchiseGuard AI</span>
              <span className="text-[11px] text-slate-500">Problem Statement #18 • National AI Innovation Showcase 2026</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs">
            <Link href="/dashboard" className="hover:text-white transition-colors">Locations Command</Link>
            <Link href="/#architecture" className="hover:text-white transition-colors">RocketRide .pipe</Link>
            <Link href="/#hero-showcase" className="hover:text-white transition-colors">Hero LOC-042</Link>
            <span className="text-emerald-400 font-semibold">Zero False Accusation SLA (≥ 90%)</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

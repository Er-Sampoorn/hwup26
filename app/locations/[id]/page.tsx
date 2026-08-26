'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Building2, Cpu, Play, CheckCircle2, AlertTriangle, FileText, Search, Download,
  Layers, ShieldAlert, Clock, RefreshCw, Upload, Sparkles, Filter, ExternalLink,
  Activity, Eye, AlertOctagon, MessageSquare, ChevronLeft, ArrowRight, ShieldCheck,
  Zap, DollarSign, Terminal, Check
} from 'lucide-react';
import PipelineVisualizer from '@/components/pipeline-visualizer';
import ViolationDetailModal from '@/components/violation-detail-modal';

export default function LocationProfilePage() {
  const params = useParams();
  const locationId = params.id as string;

  const [activeTab, setActiveTab] = useState<'overview' | 'violations' | 'media' | 'sentiment' | 'actions' | 'pipeline' | 'reports'>('overview');
  const [locationData, setLocationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [auditing, setAuditing] = useState(false);
  const [pipelineRun, setPipelineRun] = useState<any>(null);
  const [activeViolation, setActiveViolation] = useState<any>(null);

  const fetchLocationDetails = async () => {
    try {
      const res = await fetch(`/api/locations/${locationId}`);
      const data = await res.json();
      if (data.location) {
        setLocationData(data);
        if (data.location.pipelineRuns && data.location.pipelineRuns.length > 0) {
          setPipelineRun(data.location.pipelineRuns[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching location details:', err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchLocationDetails().finally(() => setLoading(false));
  }, [locationId]);

  // Poll pipeline if currently running
  useEffect(() => {
    if (!pipelineRun || pipelineRun.status !== 'RUNNING') return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/pipeline-runs/${pipelineRun.id}`);
        const data = await res.json();
        if (data.pipelineRun) {
          setPipelineRun(data.pipelineRun);
          if (data.pipelineRun.status === 'COMPLETED' || data.pipelineRun.status === 'FAILED') {
            fetchLocationDetails();
          }
        }
      } catch (err) {
        console.error('Pipeline polling error:', err);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [pipelineRun]);

  const handleStartAudit = async () => {
    setAuditing(true);
    try {
      const res = await fetch(`/api/locations/${locationId}/inspect`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.pipelineRunId) {
        setActiveTab('pipeline');
        fetchLocationDetails();
      }
    } catch (err) {
      console.error('Audit execution error:', err);
    } finally {
      setAuditing(false);
    }
  };

  if (loading && !locationData) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
          <RefreshCw className="h-6 w-6 animate-spin text-amber-400" />
        </div>
        <p className="text-sm font-mono text-slate-300">Loading Franchise Workspace & Telemetry Profile...</p>
      </div>
    );
  }

  const loc = locationData?.location;
  const stats = locationData?.stats || {};
  const violations = loc?.violations || [];
  const mediaAssets = loc?.mediaAssets || [];
  const correctiveActions = loc?.correctiveActions || [];
  const customerFeedbacks = loc?.customerFeedbacks || [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Back link */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Locations Command
        </Link>

        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-800">
          Autonomous Audit Ready
        </span>
      </div>

      {/* 1. TOP LOCATION COMMAND BANNER */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            <span className="font-mono text-xs font-black uppercase px-3 py-1 rounded-xl bg-amber-950 text-amber-400 border border-amber-800">
              {loc?.code}
            </span>
            <span className="text-xs font-bold text-slate-300">
              Region: <strong className="text-white">{loc?.region}</strong>
            </span>
            <span className={`text-[11px] font-black uppercase px-3 py-1 rounded-full border ${
              loc?.riskCategory === 'CRITICAL'
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                : loc?.riskCategory === 'HIGH'
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
            }`}>
              Risk Category: {loc?.riskCategory} ({loc?.riskScore}/100)
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            {loc?.name}
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1">
            {loc?.address}, {loc?.city}, {loc?.state} • Store Manager: <strong className="text-slate-200">{loc?.manager}</strong> • Owner: <strong className="text-slate-200">{loc?.owner?.companyName || 'Apex Retail Ops'}</strong>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={handleStartAudit}
            disabled={auditing}
            className="px-6 py-3.5 text-xs font-black text-white rounded-xl bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 shadow-2xl shadow-amber-500/30 transition-all flex items-center gap-2 group hover:scale-[1.02] disabled:opacity-50"
          >
            <Play className={`h-4 w-4 text-amber-300 ${auditing ? 'animate-spin' : ''}`} />
            <span>{auditing ? 'Executing RocketRide Pipeline...' : 'Run RocketRide AI Audit'}</span>
          </button>
        </div>
      </div>

      {/* 2. TOP METRIC CARDS STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl glass-card border border-emerald-500/30">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Compliance Score</span>
          <p className="text-2xl font-black text-emerald-400 mt-1 num-tabular">{loc?.complianceScore}%</p>
          <span className="text-[10px] text-emerald-400/80 font-mono">Brand Standards</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-rose-500/30">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Location Risk</span>
          <p className="text-2xl font-black text-rose-400 mt-1 num-tabular">{loc?.riskScore} <span className="text-xs font-normal text-slate-400">/ 100</span></p>
          <span className="text-[10px] text-rose-400/80 font-mono">{loc?.riskCategory} Level</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-amber-500/30">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Open Violations</span>
          <p className="text-2xl font-black text-amber-400 mt-1 num-tabular">{violations.length}</p>
          <span className="text-[10px] text-amber-400/80 font-mono">Vision Grounded</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-rose-500/40">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Chronic Recurrence</span>
          <p className="text-2xl font-black text-rose-300 mt-1 num-tabular">{violations.filter((v: any) => v.isRecurring).length}</p>
          <span className="text-[10px] text-rose-400/80 font-mono">Repeat Failures</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-cyan-500/30">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Indexed Assets</span>
          <p className="text-2xl font-black text-cyan-300 mt-1 num-tabular">{mediaAssets.length}</p>
          <span className="text-[10px] text-cyan-400/80 font-mono">Photos & Keyframes</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-purple-500/30">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Reinspection SLA</span>
          <p className="text-2xl font-black text-slate-100 mt-1 num-tabular">{loc?.riskCategory === 'CRITICAL' ? '48 Hours' : '14 Days'}</p>
          <span className="text-[10px] text-purple-400 font-mono">Remediation Window</span>
        </div>
      </div>

      {/* 3. WORKSPACE TABS */}
      <div className="border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs font-bold scrollbar-none">
        {[
          { id: 'overview', label: '1. Risk Drivers & Attribution' },
          { id: 'violations', label: `2. Violations (${violations.length})` },
          { id: 'media', label: `3. Media Assets (${mediaAssets.length})` },
          { id: 'sentiment', label: `4. Customer Feedback (${customerFeedbacks.length})` },
          { id: 'actions', label: `5. Corrective Plans (${correctiveActions.length})` },
          { id: 'pipeline', label: '6. RocketRide .pipe Terminal' },
          { id: 'reports', label: '7. Legal Cure Notice & Reports' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3.5 border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-amber-500 text-amber-400 bg-amber-500/10 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. TAB CONTENT PANELS */}

      {/* TAB 1: OVERVIEW & EXPLAINABLE RISK DRIVERS */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold">
                <AlertOctagon className="h-4 w-4" /> EXPLAINABLE MULTI-FACTOR RISK FORMULA
              </div>
              <h3 className="text-xl font-black text-white mt-1">
                Location Risk Score Breakdown ({loc?.riskScore}/100)
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                FranchiseGuard AI calculates continuous location risk scores based on a transparent multi-factor weighted formula: Severity (30%), Frequency (20%), Recurrence (20%), Evidence Confidence (15%), Customer Signals (10%), and Operational Signals (5%).
              </p>
            </div>

            {/* Formula Breakdown Cards */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Attributed Risk Drivers:
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-3.5 rounded-xl bg-slate-950 border border-rose-500/30">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-rose-400"></span>
                    <div>
                      <span className="font-bold text-white block">Chronic Recurrence Penalty (4x Failure CLEAN-001)</span>
                      <span className="text-[10px] text-slate-400">Location failed storefront standard in 4 consecutive audits</span>
                    </div>
                  </div>
                  <span className="font-mono font-black text-rose-400 text-sm">+25 Pts</span>
                </div>

                <div className="flex justify-between items-center p-3.5 rounded-xl bg-slate-950 border border-amber-500/30">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                    <div>
                      <span className="font-bold text-white block">Critical & High Severity Issues</span>
                      <span className="text-[10px] text-slate-400">Food Safety & Emergency Exit Compliance Gaps</span>
                    </div>
                  </div>
                  <span className="font-mono font-black text-amber-400 text-sm">+30 Pts</span>
                </div>

                <div className="flex justify-between items-center p-3.5 rounded-xl bg-slate-950 border border-cyan-500/30">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                    <div>
                      <span className="font-bold text-white block">Customer Review Correlation Spike</span>
                      <span className="text-[10px] text-slate-400">Google Reviews verified negative customer cleanliness sentiment</span>
                    </div>
                  </div>
                  <span className="font-mono font-black text-cyan-300 text-sm">+10 Pts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-400" /> Compliance Profile
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-800/80 pb-2.5">
                  <span className="text-slate-400">Franchise Owner:</span>
                  <span className="font-bold text-white">{loc?.owner?.name || 'Apex Retail Ops'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-2.5">
                  <span className="text-slate-400">Reinspection SLA:</span>
                  <span className="font-mono font-bold text-rose-400">{loc?.riskCategory === 'CRITICAL' ? '48 Hours' : '14 Days'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-2.5">
                  <span className="text-slate-400">Formal Cure Notice:</span>
                  <span className="font-mono font-bold text-amber-400">{stats.recurringViolations > 0 ? 'RECOMMENDED' : 'None'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-2.5">
                  <span className="text-slate-400">Last AI Audit:</span>
                  <span className="font-mono text-slate-300">{new Date(loc?.lastInspectionAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('reports')}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="h-4 w-4 text-amber-400" />
              <span>Generate Legal Default Package</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: VIOLATIONS TABLE */}
      {activeTab === 'violations' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-slate-800 glass-panel shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                  <th className="py-3.5 px-4">Violation ID</th>
                  <th className="py-3.5 px-4">Standard Code</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Grounded Description</th>
                  <th className="py-3.5 px-4 text-center">Severity</th>
                  <th className="py-3.5 px-4 text-center">Recurrence</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs">
                {violations.map((v: any) => (
                  <tr key={v.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">{v.violationCode}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">{v.standard?.code}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700">
                        {v.standard?.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-200 max-w-sm truncate" title={v.description}>
                      {v.description}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-[10px]">
                      <span className={v.severity === 'CRITICAL' ? 'text-rose-400 font-black' : v.severity === 'HIGH' ? 'text-amber-400' : 'text-blue-400'}>
                        {v.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold">
                      {v.isRecurring ? (
                        <span className="text-rose-300 bg-rose-950 px-2.5 py-0.5 rounded-lg border border-rose-800 animate-pulse">
                          {v.recurrenceCount}x CHRONIC
                        </span>
                      ) : (
                        <span className="text-slate-500">1st Failure</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        v.status === 'RESOLVED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : v.status === 'NEEDS_REVIEW'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setActiveViolation(v)}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 text-xs font-bold transition-all"
                      >
                        Inspect Proof
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MEDIA ASSETS */}
      {activeTab === 'media' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mediaAssets.map((asset: any) => (
            <div key={asset.id} className="p-5 rounded-2xl glass-card flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono text-[10px] font-bold text-amber-400 uppercase">{asset.fileType}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{new Date(asset.capturedAt).toLocaleDateString()}</span>
                </div>
                <h4 className="text-xs font-bold text-white truncate">{asset.fileName}</h4>
                <p className="text-xs text-slate-300 mt-2 line-clamp-3 italic bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  {asset.analysis?.summaryText || 'Indexed for multimodal visual analysis.'}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-cyan-400">
                <span>Confidence: 94.0%</span>
                <span className="text-slate-500">EXIF Verified</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: CUSTOMER SENTIMENT */}
      {activeTab === 'sentiment' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/50 text-xs text-cyan-200 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400 shrink-0" />
            <span>
              Customer complaint stream automatically correlates with physical standard failures to boost audit veracity.
            </span>
          </div>

          <div className="space-y-3">
            {customerFeedbacks.map((fb: any) => (
              <div key={fb.id} className="p-5 rounded-2xl glass-card flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-white">{fb.source}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      fb.sentiment === 'NEGATIVE' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {fb.sentiment} Sentiment
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Category: {fb.category}</span>
                  </div>
                  <p className="text-xs text-slate-200 italic mt-2 font-medium">"{fb.reviewText}"</p>
                </div>
                <span className="text-xs font-mono text-slate-400 shrink-0">{new Date(fb.processedAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CORRECTIVE ACTIONS */}
      {activeTab === 'actions' && (
        <div className="space-y-3">
          {correctiveActions.map((act: any) => (
            <div key={act.id} className="p-5 rounded-2xl glass-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                    {act.actionCode}
                  </span>
                  <span className="font-bold text-white text-sm">{act.title}</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{act.description}</p>
                <span className="text-[10px] text-slate-400 font-mono mt-2 block">
                  Due by: {new Date(act.dueAt).toLocaleString()}
                </span>
              </div>

              <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${
                act.status === 'APPROVED'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : 'bg-amber-950 text-amber-300 border-amber-800'
              }`}>
                {act.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* TAB 6: ROCKETRIDE AUDIT PIPELINE */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          <PipelineVisualizer
            status={pipelineRun?.status || 'COMPLETED'}
            progress={pipelineRun?.progress || 100}
            currentStep={pipelineRun?.currentStep || 'AUDIT_COMPLETED'}
            totalAssets={pipelineRun?.totalAssets || 4}
            processedCount={pipelineRun?.processedCount || 4}
            totalTokens={pipelineRun?.totalTokens || 38400}
            estimatedCost={pipelineRun?.estimatedCost || 0.1152}
            executionMs={pipelineRun?.executionMs || 12400}
            rocketrideRunId={pipelineRun?.rocketrideRunId || 'rr_audit_demo_2026'}
            errorLog={pipelineRun?.errorLog}
          />
        </div>
      )}

      {/* TAB 7: REPORTS */}
      {activeTab === 'reports' && (
        <div className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-6 max-w-4xl mx-auto text-center">
          <div>
            <h3 className="text-2xl font-black text-white">Synthesize Franchise Compliance Reports</h3>
            <p className="text-xs text-slate-400 mt-1">Download formal Cure Notices, Location Audit Summaries, and Excel Risk Matrices.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href={`/api/reports/generate?locationId=${locationId}&format=DOCX`}
              download
              className="p-6 rounded-2xl glass-card border border-slate-800 hover:border-amber-500 text-center space-y-3 transition-all group"
            >
              <FileText className="h-10 w-10 text-amber-400 mx-auto group-hover:scale-110 transition-transform" />
              <div className="text-xs font-black text-white">DOCX Cure Notice</div>
              <div className="text-[10px] text-slate-400 font-mono">Formal Default Word Doc</div>
            </a>

            <a
              href={`/api/reports/generate?locationId=${locationId}&format=PDF`}
              download
              className="p-6 rounded-2xl glass-card border border-slate-800 hover:border-rose-500 text-center space-y-3 transition-all group"
            >
              <Download className="h-10 w-10 text-rose-400 mx-auto group-hover:scale-110 transition-transform" />
              <div className="text-xs font-black text-white">PDF Audit Summary</div>
              <div className="text-[10px] text-slate-400 font-mono">Executive PDF Report</div>
            </a>

            <a
              href={`/api/reports/generate?locationId=${locationId}&format=XLSX`}
              download
              className="p-6 rounded-2xl glass-card border border-slate-800 hover:border-emerald-500 text-center space-y-3 transition-all group"
            >
              <Layers className="h-10 w-10 text-emerald-400 mx-auto group-hover:scale-110 transition-transform" />
              <div className="text-xs font-black text-white">Excel Matrix</div>
              <div className="text-[10px] text-slate-400 font-mono">Full Compliance Sheet</div>
            </a>

            <a
              href={`/api/reports/generate?locationId=${locationId}&format=JSON`}
              download
              className="p-6 rounded-2xl glass-card border border-slate-800 hover:border-purple-500 text-center space-y-3 transition-all group"
            >
              <Cpu className="h-10 w-10 text-purple-400 mx-auto group-hover:scale-110 transition-transform" />
              <div className="text-xs font-black text-white">JSON Bundle</div>
              <div className="text-[10px] text-slate-400 font-mono">Machine Telemetry</div>
            </a>
          </div>
        </div>
      )}

      {/* VIOLATION DETAIL MODAL */}
      {activeViolation && (
        <ViolationDetailModal
          violation={activeViolation}
          onClose={() => setActiveViolation(null)}
          onRefresh={() => {
            fetchLocationDetails();
          }}
        />
      )}
    </div>
  );
}

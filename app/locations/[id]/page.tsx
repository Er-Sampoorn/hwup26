'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Building2, Cpu, Play, CheckCircle2, AlertTriangle, FileText, Search, Download,
  Layers, ShieldAlert, Clock, RefreshCw, Upload, Sparkles, Filter, ExternalLink, Activity, Eye, AlertOctagon, MessageSquare
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
      console.error(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchLocationDetails().finally(() => setLoading(false));
  }, [locationId]);

  // Poll pipeline if running
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
        console.error(err);
      }
    }, 2000);

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
      console.error(err);
    } finally {
      setAuditing(false);
    }
  };

  if (loading && !locationData) {
    return (
      <div className="p-16 text-center text-slate-400 font-mono text-xs flex items-center justify-center gap-2">
        <RefreshCw className="h-4 w-4 animate-spin text-amber-400" /> Loading Location Workspace Profile...
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
      {/* Top Location Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
              {loc?.code}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Region: <strong className="text-slate-200">{loc?.region}</strong>
            </span>
            <span className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
              loc?.riskCategory === 'CRITICAL'
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                : loc?.riskCategory === 'HIGH'
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
            }`}>
              Risk Level: {loc?.riskCategory} ({loc?.riskScore}/100)
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-white mt-2 flex items-center gap-2">
            {loc?.name}
          </h1>
          <p className="text-xs text-slate-400 font-medium">{loc?.address}, {loc?.city}, {loc?.state} • Manager: <strong className="text-slate-200">{loc?.manager}</strong></p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleStartAudit}
            disabled={auditing}
            className="px-5 py-2 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
          >
            <Play className={`h-4 w-4 text-amber-300 ${auditing ? 'animate-spin' : ''}`} />
            <span>{auditing ? 'Auditing Multimodal Media...' : 'Run RocketRide Audit Pipeline'}</span>
          </button>
        </div>
      </div>

      {/* Top Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-semibold uppercase text-slate-400">Compliance Score</span>
          <p className="text-xl font-extrabold text-emerald-400 mt-1">{loc?.complianceScore}%</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-semibold uppercase text-slate-400">Location Risk Score</span>
          <p className="text-xl font-extrabold text-rose-400 mt-1">{loc?.riskScore} / 100</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-semibold uppercase text-slate-400">Open Violations</span>
          <p className="text-xl font-extrabold text-amber-400 mt-1">{stats.openViolations || 3}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-semibold uppercase text-slate-400">Recurring Failures</span>
          <p className="text-xl font-extrabold text-rose-300 mt-1">{stats.recurringViolations || 1}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-semibold uppercase text-slate-400">Indexed Assets</span>
          <p className="text-xl font-extrabold text-cyan-300 mt-1">{mediaAssets.length || 4} Files</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-semibold uppercase text-slate-400">Reinspection Due</span>
          <p className="text-xl font-extrabold text-slate-200 mt-1">{loc?.riskCategory === 'CRITICAL' ? '48 Hours' : '14 Days'}</p>
        </div>
      </div>

      {/* Navigation Workspace Tabs */}
      <div className="border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'overview', label: 'Overview & Risk Drivers' },
          { id: 'violations', label: `Violations (${violations.length})` },
          { id: 'media', label: `Media Assets (${mediaAssets.length})` },
          { id: 'sentiment', label: `Customer Feedback (${customerFeedbacks.length})` },
          { id: 'actions', label: `Corrective Actions (${correctiveActions.length})` },
          { id: 'pipeline', label: 'RocketRide Audit Pipeline' },
          { id: 'reports', label: 'Cure Notice & Reports' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 border-b-2 font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-amber-500 text-amber-400 bg-amber-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT AREAS */}

      {/* TAB 1: OVERVIEW & RISK DRIVERS */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertOctagon className="h-5 w-5 text-rose-400" /> Location Risk Score Breakdown
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              FranchiseGuard AI calculates continuous location risk scores based on a transparent multi-factor weighted formula: Severity (30%), Frequency (20%), Recurrence (20%), Evidence Confidence (15%), Customer Signals (10%), and Operational Signals (5%).
            </p>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-200">Active Risk Score Drivers</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-rose-300 font-semibold">⚠️ 4-Time Recurring Violation (CLEAN-001)</span>
                  <span className="font-mono font-bold text-rose-400">+25 Risk Points</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-amber-300 font-semibold">⚠️ Critical Emergency Exit & Food Safety Severity</span>
                  <span className="font-mono font-bold text-amber-400">+30 Risk Points</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-cyan-300 font-semibold">💬 Negative Customer Complaint Correlation</span>
                  <span className="font-mono font-bold text-cyan-400">+10 Risk Points</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-400" /> Compliance Status
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Franchise Owner:</span>
                <span className="font-medium text-slate-200">{loc?.owner?.name || 'Apex Retail Ops'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Reinspection Interval:</span>
                <span className="font-mono font-bold text-rose-400">{loc?.riskCategory === 'CRITICAL' ? '48 Hours' : '14 Days'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Formal Default Warning:</span>
                <span className="font-mono font-bold text-amber-300">{stats.recurringViolations > 0 ? 'RECOMMENDED' : 'None'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VIOLATIONS TABLE */}
      {activeTab === 'violations' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/90 shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                  <th className="py-3 px-4">Violation ID</th>
                  <th className="py-3 px-4">Standard Code</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-center">Severity</th>
                  <th className="py-3 px-4 text-center">Recurrence</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs">
                {violations.map((v: any) => (
                  <tr key={v.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">{v.violationCode}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-200">{v.standard?.code}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700">
                        {v.standard?.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-200 max-w-sm truncate" title={v.description}>
                      {v.description}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-[10px]">
                      <span className={v.severity === 'CRITICAL' ? 'text-rose-400' : v.severity === 'HIGH' ? 'text-amber-400' : 'text-blue-400'}>
                        {v.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold">
                      {v.isRecurring ? (
                        <span className="text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800">
                          {v.recurrenceCount}x RECURRENCE
                        </span>
                      ) : (
                        <span className="text-slate-500">1st Failure</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        v.status === 'RESOLVED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : v.status === 'NEEDS_REVIEW'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setActiveViolation(v)}
                        className="px-3 py-1 rounded-lg bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 text-xs font-bold transition-all"
                      >
                        Inspect
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
            <div key={asset.id} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono text-[10px] font-bold text-amber-400 uppercase">{asset.fileType}</span>
                  <span className="text-[10px] text-slate-500">{new Date(asset.capturedAt).toLocaleDateString()}</span>
                </div>
                <h4 className="text-xs font-bold text-white truncate">{asset.fileName}</h4>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 italic">{asset.analysis?.summaryText || 'Media asset indexed for vision inspection.'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: CUSTOMER SENTIMENT */}
      {activeTab === 'sentiment' && (
        <div className="space-y-3">
          {customerFeedbacks.map((fb: any) => (
            <div key={fb.id} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-white">{fb.source}</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-400">
                    {fb.sentiment}
                  </span>
                </div>
                <p className="text-xs text-slate-200 italic mt-1 font-medium">"{fb.reviewText}"</p>
              </div>
              <span className="text-xs font-mono text-slate-400">{new Date(fb.processedAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: CORRECTIVE ACTIONS */}
      {activeTab === 'actions' && (
        <div className="space-y-3">
          {correctiveActions.map((act: any) => (
            <div key={act.id} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono font-bold text-amber-400">{act.actionCode}</span>
                  <span className="font-bold text-white">{act.title}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{act.description}</p>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded border border-emerald-800">
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
        <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 max-w-3xl mx-auto text-center">
          <div>
            <h3 className="text-xl font-extrabold text-white">Generate Franchise Compliance Reports</h3>
            <p className="text-xs text-slate-400 mt-1">Download formal Cure Notices, Location Audit Summaries, and Risk Matrices.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href={`/api/reports/generate?locationId=${locationId}&format=DOCX`}
              download
              className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500 text-center space-y-2 transition-all group"
            >
              <FileText className="h-8 w-8 text-amber-400 mx-auto group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">DOCX Cure Notice</div>
              <div className="text-[10px] text-slate-500 font-mono">Word Report</div>
            </a>

            <a
              href={`/api/reports/generate?locationId=${locationId}&format=PDF`}
              download
              className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500 text-center space-y-2 transition-all group"
            >
              <Download className="h-8 w-8 text-rose-400 mx-auto group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">PDF Audit Summary</div>
              <div className="text-[10px] text-slate-500 font-mono">Adobe PDF</div>
            </a>

            <a
              href={`/api/reports/generate?locationId=${locationId}&format=XLSX`}
              download
              className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-center space-y-2 transition-all group"
            >
              <Layers className="h-8 w-8 text-emerald-400 mx-auto group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">Excel Matrix</div>
              <div className="text-[10px] text-slate-500 font-mono">XLSX Sheet</div>
            </a>

            <a
              href={`/api/reports/generate?locationId=${locationId}&format=JSON`}
              download
              className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500 text-center space-y-2 transition-all group"
            >
              <Cpu className="h-8 w-8 text-purple-400 mx-auto group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">JSON Bundle</div>
              <div className="text-[10px] text-slate-500 font-mono">Machine Readable</div>
            </a>
          </div>
        </div>
      )}

      {/* VIOLATION DETAIL MODAL DRAWER */}
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

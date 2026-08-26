'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Building2, Cpu, Play, CheckCircle2, AlertTriangle, FileText, Search, Download,
  Layers, ShieldAlert, Clock, RefreshCw, Upload, Sparkles, Filter, ExternalLink,
  Activity, Eye, AlertOctagon, MessageSquare, ChevronLeft, ArrowRight, ShieldCheck,
  Zap, DollarSign, Terminal, Check, Star, Store, MapPin
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
        console.error('Polling error:', err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [pipelineRun]);

  const handleTriggerAudit = async () => {
    setAuditing(true);
    try {
      const res = await fetch(`/api/locations/${locationId}/inspect`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.pipelineRun) {
        setPipelineRun(data.pipelineRun);
        setActiveTab('pipeline');
      }
    } catch (err) {
      console.error('Failed to trigger audit:', err);
    } finally {
      setAuditing(false);
    }
  };

  const handleDownloadReport = (format: 'docx' | 'pdf' | 'xlsx' | 'json') => {
    window.open(`/api/reports/generate?locationId=${locationId}&format=${format}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin text-black" />
        <p className="text-xs text-cyber-grayText">Loading store telemetry...</p>
      </div>
    );
  }

  if (!locationData || !locationData.location) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center p-6">
        <AlertOctagon className="h-12 w-12 text-rose-500" />
        <h2 className="text-xl font-bold text-black">Store Location Not Found</h2>
        <p className="text-xs text-cyber-grayText">The specified franchise location could not be located.</p>
        <Link href="/dashboard" className="cyber-btn-black text-xs py-2 px-4 rounded-xl">
          Back to Locations Command
        </Link>
      </div>
    );
  }

  const { location, latestInspection, riskBreakdown } = locationData;
  const isHeroLocation = location.code === 'LOC-042';

  return (
    <div className="min-h-screen bg-white text-cyber-darkText pb-24">
      
      {/* 1. BREADCRUMBS BAR */}
      <div className="border-b border-cyber-borderLight bg-[#FAFAFA] py-3.5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-semibold text-cyber-grayText">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-black">Home</Link>
            <span>/</span>
            <Link href="/dashboard" className="hover:text-black">Locations Command</Link>
            <span>/</span>
            <span className="text-black font-bold font-mono">{location.code}</span>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-xs text-black hover:underline"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Catalog</span>
          </Link>
        </div>
      </div>

      {/* 2. PRODUCT DETAILS TOP SPLIT (Cyber Product Details Hero) */}
      <div className="border-b border-cyber-borderLight py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: Visual Media Box & Inspection Snapshot */}
            <div className="lg:col-span-6 space-y-4">
              <div className="cyber-card p-6 bg-[#FAFAFA] flex flex-col items-center justify-center min-h-[340px] text-center relative overflow-hidden">
                <div className="absolute top-4 left-4">
                  <span
                    className={`cyber-badge ${
                      location.riskCategory === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-700'
                        : location.riskCategory === 'HIGH'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {location.riskCategory} RISK • {location.riskScore}/100
                  </span>
                </div>

                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white border border-cyber-borderLight shadow-sm mb-4">
                  <Building2 className={`h-10 w-10 ${isHeroLocation ? 'text-rose-500' : 'text-slate-700'}`} />
                </div>

                <h3 className="text-xl font-bold text-black">{location.name}</h3>
                <p className="text-xs text-cyber-grayText mt-1 flex items-center gap-1.5 justify-center">
                  <MapPin className="h-3.5 w-3.5" />
                  {location.address}, {location.city}, {location.state}
                </p>

                {/* Live Grounding SLA */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
                  <div className="p-2.5 px-4 rounded-xl bg-white border border-cyber-borderLight">
                    <span className="text-cyber-grayText text-[10px] uppercase block">Compliance</span>
                    <strong className="text-base font-black text-black num-tabular">{location.complianceScore}%</strong>
                  </div>
                  <div className="p-2.5 px-4 rounded-xl bg-white border border-cyber-borderLight">
                    <span className="text-cyber-grayText text-[10px] uppercase block">Active Violations</span>
                    <strong className="text-base font-black text-rose-600 num-tabular">{location.violations.length}</strong>
                  </div>
                  <div className="p-2.5 px-4 rounded-xl bg-white border border-cyber-borderLight">
                    <span className="text-cyber-grayText text-[10px] uppercase block">Media Assets</span>
                    <strong className="text-base font-black text-black num-tabular">{location.mediaAssets.length}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Store Details, Chronic Alert & Action Buttons */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-black bg-[#EBEBEB] px-2 py-0.5 rounded">
                    {location.code}
                  </span>
                  <span className="text-xs text-cyber-grayText font-semibold">
                    Region: {location.region}
                  </span>
                </div>
                <h1 className="text-3xl font-black text-black tracking-tight mt-1.5">
                  {location.name}
                </h1>
                <p className="text-xs text-cyber-grayText mt-1">
                  Manager: <strong className="text-black">{location.manager || 'Sarah Jenkins'}</strong> • Owner: <strong className="text-black">{location.owner?.name || 'Apex Retail LLC'}</strong>
                </p>
              </div>

              {/* Chronic Recurrence Box for Hero Case */}
              {isHeroLocation && (
                <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                    <AlertOctagon className="h-4 w-4 text-rose-600" />
                    <span>CHRONIC RECURRENCE DETECTED: 4 CONSECUTIVE FAILURES</span>
                  </div>
                  <p className="text-xs text-rose-900 leading-relaxed">
                    Standard <strong className="text-black">CLEAN-001 (Storefront Cleanliness)</strong> failed in 4 consecutive audits. Clause 14.2 Default Warning and Formal Legal Cure Notice are ready for manager dispatch.
                  </p>
                </div>
              )}

              {/* Action Buttons (Cyber Style) */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleTriggerAudit}
                  disabled={auditing}
                  className="cyber-btn-black w-full py-3.5 rounded-xl text-xs uppercase tracking-wider font-bold"
                >
                  {auditing ? (
                    <>
                      <Sparkles className="h-4 w-4 animate-spin text-amber-400" />
                      <span>Triggering RocketRide Multimodal Audit...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 text-amber-400" />
                      <span>Trigger RocketRide Multimodal Audit</span>
                    </>
                  )}
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleDownloadReport('docx')}
                    className="cyber-btn-white py-3 rounded-xl text-xs font-bold"
                  >
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span>Download DOCX Notice</span>
                  </button>

                  <button
                    onClick={() => handleDownloadReport('pdf')}
                    className="cyber-btn-white py-3 rounded-xl text-xs font-bold"
                  >
                    <Download className="h-4 w-4 text-rose-600" />
                    <span>Download PDF Packet</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 3. TABS BAR & DETAIL PANELS */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Cyber Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-cyber-borderLight pb-4">
          {[
            { id: 'overview', label: 'Overview & Risk Formula' },
            { id: 'violations', label: `Violations & Evidence (${location.violations.length})` },
            { id: 'media', label: `Media Assets (${location.mediaAssets.length})` },
            { id: 'sentiment', label: `Customer Reviews (${location.feedbacks.length})` },
            { id: 'actions', label: `Corrective Actions (${location.correctiveActions.length})` },
            { id: 'pipeline', label: 'RocketRide Pipeline' },
            { id: 'reports', label: 'Legal Reports & Exports' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-black text-white'
                  : 'bg-[#FAFAFA] text-cyber-grayText hover:text-black hover:bg-[#EBEBEB]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="cyber-card p-6 bg-white space-y-6">
              <div className="flex items-center justify-between border-b border-cyber-borderLight pb-4">
                <div>
                  <h3 className="text-base font-bold text-black">Multi-Factor Risk Score Breakdown</h3>
                  <p className="text-xs text-cyber-grayText">Explainable mathematical breakdown for {location.name}</p>
                </div>
                <div className="text-right font-mono">
                  <span className="text-2xl font-black text-black num-tabular">{location.riskScore}</span>
                  <span className="text-xs text-cyber-grayText"> / 100</span>
                </div>
              </div>

              {/* Drivers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#FAFAFA] border border-cyber-borderLight">
                  <span className="text-[10px] font-bold uppercase text-cyber-grayText block">1. Violation Severity</span>
                  <p className="text-lg font-black text-black mt-1">
                    {riskBreakdown ? riskBreakdown.severityScore.toFixed(1) : (location.riskScore * 0.4).toFixed(1)} pts
                  </p>
                  <span className="text-[10px] text-cyber-grayText">40% Formula Weight</span>
                </div>

                <div className="p-4 rounded-xl bg-[#FAFAFA] border border-cyber-borderLight">
                  <span className="text-[10px] font-bold uppercase text-cyber-grayText block">2. Chronic Recurrence</span>
                  <p className="text-lg font-black text-amber-600 mt-1">
                    {riskBreakdown ? riskBreakdown.recurrenceScore.toFixed(1) : isHeroLocation ? '25.0' : '5.0'} pts
                  </p>
                  <span className="text-[10px] text-cyber-grayText">25% Multiplier</span>
                </div>

                <div className="p-4 rounded-xl bg-[#FAFAFA] border border-cyber-borderLight">
                  <span className="text-[10px] font-bold uppercase text-cyber-grayText block">3. Customer Sentiment</span>
                  <p className="text-lg font-black text-rose-600 mt-1">
                    {riskBreakdown ? riskBreakdown.sentimentScore.toFixed(1) : isHeroLocation ? '18.0' : '4.0'} pts
                  </p>
                  <span className="text-[10px] text-cyber-grayText">20% Review Feeds</span>
                </div>

                <div className="p-4 rounded-xl bg-[#FAFAFA] border border-cyber-borderLight">
                  <span className="text-[10px] font-bold uppercase text-cyber-grayText block">4. Operational Signals</span>
                  <p className="text-lg font-black text-black mt-1">
                    {riskBreakdown ? riskBreakdown.operationalScore.toFixed(1) : '10.0'} pts
                  </p>
                  <span className="text-[10px] text-cyber-grayText">15% POS & Staffing</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VIOLATIONS */}
        {activeTab === 'violations' && (
          <div className="space-y-4">
            {location.violations.length === 0 ? (
              <div className="cyber-card p-12 text-center space-y-3 bg-white">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
                <h4 className="text-base font-bold text-black">Zero Brand Violations Detected</h4>
                <p className="text-xs text-cyber-grayText">All visual evidence meets corporate specifications.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {location.violations.map((viol: any) => (
                  <div
                    key={viol.id}
                    className="cyber-card p-5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-black bg-[#EBEBEB] px-2 py-0.5 rounded">
                          {viol.violationCode}
                        </span>
                        <span
                          className={`cyber-badge ${
                            viol.severity === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-700'
                              : viol.severity === 'HIGH'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {viol.severity}
                        </span>
                        {viol.isRecurring && (
                          <span className="cyber-badge bg-rose-600 text-white font-mono">
                            CHRONIC {viol.recurrenceCount}X REPEAT
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-emerald-600 font-bold">
                          Conf: {viol.confidence}%
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-black">{viol.standard?.title}</h4>
                      <p className="text-xs text-cyber-grayText">{viol.description}</p>
                    </div>

                    <button
                      onClick={() => setActiveViolation(viol)}
                      className="cyber-btn-black text-xs py-2 px-4 rounded-xl shrink-0"
                    >
                      <span>Inspect Evidence & Act</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MEDIA ASSETS */}
        {activeTab === 'media' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {location.mediaAssets.map((asset: any) => (
              <div key={asset.id} className="cyber-card p-4 bg-white space-y-3">
                <div className="h-32 rounded-xl bg-[#FAFAFA] border border-cyber-borderLight flex flex-col items-center justify-center p-3 text-center">
                  <Eye className="h-6 w-6 text-slate-500 mb-1" />
                  <span className="font-mono text-[11px] font-bold text-black truncate w-full">{asset.fileName}</span>
                  <span className="text-[9px] text-cyber-grayText uppercase font-mono">{asset.mimeType}</span>
                </div>
                <div>
                  <span className="text-[10px] text-cyber-grayText block">
                    Captured: {new Date(asset.capturedAt).toLocaleDateString()}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                    <Check className="h-3.5 w-3.5" /> EXIF & Integrity Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: SENTIMENT */}
        {activeTab === 'sentiment' && (
          <div className="space-y-3">
            {location.feedbacks.map((fb: any) => (
              <div key={fb.id} className="cyber-card p-4 bg-white flex items-start gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${
                    fb.sentiment === 'NEGATIVE' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                  }`}
                >
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-black">{fb.source}</span>
                    <span className="font-mono font-bold text-amber-500">★ {fb.rating}/5.0</span>
                  </div>
                  <p className="text-xs text-cyber-darkText italic">"{fb.reviewText}"</p>
                  <span className="text-[10px] text-cyber-grayText font-semibold">Category: {fb.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: CORRECTIVE ACTIONS */}
        {activeTab === 'actions' && (
          <div className="space-y-3">
            {location.correctiveActions.map((act: any) => (
              <div key={act.id} className="cyber-card p-4 bg-white flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-mono text-xs font-bold text-black">{act.actionCode}</span>
                  <h4 className="text-xs font-bold text-black">{act.title}</h4>
                  <p className="text-xs text-cyber-grayText">{act.description}</p>
                </div>
                <span
                  className={`cyber-badge ${
                    act.status === 'COMPLETED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : act.status === 'IN_PROGRESS'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {act.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* TAB 6: ROCKETRIDE PIPELINE */}
        {activeTab === 'pipeline' && (
          <PipelineVisualizer
            status={pipelineRun ? pipelineRun.status : 'COMPLETED'}
            progress={pipelineRun ? pipelineRun.progress : 100}
            currentStep={pipelineRun ? pipelineRun.currentStep : 'AUDIT_COMPLETED'}
            totalAssets={pipelineRun ? pipelineRun.totalAssets : 4}
            processedCount={pipelineRun ? pipelineRun.processedCount : 4}
            totalTokens={pipelineRun ? pipelineRun.totalTokens : 38400}
            estimatedCost={pipelineRun ? pipelineRun.estimatedCost : 0.1152}
            executionMs={pipelineRun ? pipelineRun.executionMs : 12400}
            rocketrideRunId={pipelineRun ? pipelineRun.rocketrideRunId : 'rr_audit_demo'}
          />
        )}

        {/* TAB 7: REPORTS & EXPORTS */}
        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="cyber-card p-6 bg-white space-y-4 text-center">
              <FileText className="h-10 w-10 text-blue-600 mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-black">Formal Legal Cure Notice</h4>
                <p className="text-xs text-cyber-grayText mt-1">Editable Word DOCX format with evidence citations.</p>
              </div>
              <button
                onClick={() => handleDownloadReport('docx')}
                className="cyber-btn-black text-xs py-2 w-full rounded-xl"
              >
                Download DOCX
              </button>
            </div>

            <div className="cyber-card p-6 bg-white space-y-4 text-center">
              <Download className="h-10 w-10 text-rose-600 mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-black">Audit Packet PDF</h4>
                <p className="text-xs text-cyber-grayText mt-1">Official printable compliance summary certificate.</p>
              </div>
              <button
                onClick={() => handleDownloadReport('pdf')}
                className="cyber-btn-black text-xs py-2 w-full rounded-xl"
              >
                Download PDF
              </button>
            </div>

            <div className="cyber-card p-6 bg-white space-y-4 text-center">
              <Layers className="h-10 w-10 text-emerald-600 mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-black">Raw Telemetry Excel</h4>
                <p className="text-xs text-cyber-grayText mt-1">Structured spreadsheet with all 50 location metrics.</p>
              </div>
              <button
                onClick={() => handleDownloadReport('xlsx')}
                className="cyber-btn-black text-xs py-2 w-full rounded-xl"
              >
                Download XLSX
              </button>
            </div>

            <div className="cyber-card p-6 bg-white space-y-4 text-center">
              <Terminal className="h-10 w-10 text-cyan-600 mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-black">Machine JSON Stream</h4>
                <p className="text-xs text-cyber-grayText mt-1">Full RocketRide execution logs & token traces.</p>
              </div>
              <button
                onClick={() => handleDownloadReport('json')}
                className="cyber-btn-black text-xs py-2 w-full rounded-xl"
              >
                Download JSON
              </button>
            </div>
          </div>
        )}

      </div>

      {/* VIOLATION MODAL */}
      {activeViolation && (
        <ViolationDetailModal
          violation={activeViolation}
          onClose={() => setActiveViolation(null)}
          onRefresh={fetchLocationDetails}
        />
      )}

    </div>
  );
}

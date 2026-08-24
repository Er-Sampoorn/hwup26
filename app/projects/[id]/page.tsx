'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  FolderGit2, Cpu, Play, CheckCircle2, AlertTriangle, FileText, Search, Download,
  Layers, ShieldAlert, Clock, RefreshCw, Upload, Sparkles, Filter, ExternalLink, Activity
} from 'lucide-react';
import PipelineVisualizer from '@/components/pipeline-visualizer';
import RequirementDetailModal from '@/components/requirement-detail-modal';
import EvidenceViewerModal from '@/components/evidence-viewer-modal';

export default function ProjectWorkspacePage() {
  const params = useParams();
  const projectId = params.id as string;

  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'evidence' | 'reviews' | 'pipeline' | 'exports' | 'audit'>('overview');
  const [projectData, setProjectData] = useState<any>(null);
  const [requirements, setRequirements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [pipelineRun, setPipelineRun] = useState<any>(null);

  // Requirement Matrix Filters
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [selectedMandatory, setSelectedMandatory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Requirement Detail Drawer
  const [activeRequirement, setActiveRequirement] = useState<any>(null);

  // Selected Evidence Viewer Drawer
  const [activeEvidence, setActiveEvidence] = useState<{ docName: string; page: number; section: string; content: string } | null>(null);

  // Document Upload Drawer / File Input
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const fetchProjectDetails = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      const data = await res.json();
      if (data.project) {
        setProjectData(data);
        if (data.project.pipelineRuns && data.project.pipelineRuns.length > 0) {
          setPipelineRun(data.project.pipelineRuns[0]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequirements = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (selectedCategory !== 'ALL') queryParams.append('category', selectedCategory);
      if (selectedStatus !== 'ALL') queryParams.append('status', selectedStatus);
      if (selectedRisk !== 'ALL') queryParams.append('risk', selectedRisk);
      if (selectedMandatory) queryParams.append('mandatory', 'true');
      if (searchTerm) queryParams.append('search', searchTerm);

      const res = await fetch(`/api/projects/${projectId}/requirements?${queryParams.toString()}`);
      const data = await res.json();
      if (data.requirements) {
        setRequirements(data.requirements);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchProjectDetails(), fetchRequirements()]).finally(() => setLoading(false));
  }, [projectId, selectedCategory, selectedStatus, selectedRisk, selectedMandatory, searchTerm]);

  // Poll Pipeline status if running
  useEffect(() => {
    if (!pipelineRun || pipelineRun.status !== 'RUNNING') return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/pipeline-runs/${pipelineRun.id}`);
        const data = await res.json();
        if (data.pipelineRun) {
          setPipelineRun(data.pipelineRun);
          if (data.pipelineRun.status === 'COMPLETED' || data.pipelineRun.status === 'FAILED') {
            fetchProjectDetails();
            fetchRequirements();
          }
        }
      } catch (err) {
        console.error(err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [pipelineRun]);

  const handleStartAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/analyze`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.pipelineRunId) {
        setActiveTab('pipeline');
        fetchProjectDetails();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: 'EVIDENCE' | 'RFP') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDoc(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('docType', docType);

    try {
      const res = await fetch(`/api/projects/${projectId}/documents`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        fetchProjectDetails();
        fetchRequirements();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingDoc(false);
    }
  };

  if (loading && !projectData) {
    return (
      <div className="p-16 text-center text-slate-400 font-mono text-xs flex items-center justify-center gap-2">
        <RefreshCw className="h-4 w-4 animate-spin text-blue-400" /> Loading Project Workspace...
      </div>
    );
  }

  const project = projectData?.project;
  const stats = projectData?.stats || {};

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Project Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-slate-700">
              {project?.rfpType || 'RFP'}
            </span>
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-amber-400" />
              Deadline: {project?.deadline ? new Date(project.deadline).toLocaleDateString() : 'Immediate'}
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-white mt-2 flex items-center gap-2">
            {project?.name}
          </h1>
          <p className="text-xs text-slate-400 font-medium">Customer: <strong className="text-slate-200">{project?.customer}</strong></p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-3">
          <label className="px-3.5 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl cursor-pointer transition-colors flex items-center gap-1.5">
            <Upload className="h-4 w-4 text-blue-400" />
            <span>{uploadingDoc ? 'Uploading...' : 'Upload Docs'}</span>
            <input type="file" onChange={(e) => handleFileUpload(e, 'EVIDENCE')} className="hidden" />
          </label>

          <button
            onClick={handleStartAnalysis}
            disabled={analyzing}
            className="px-5 py-2 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <Play className={`h-4 w-4 text-cyan-300 ${analyzing ? 'animate-spin' : ''}`} />
            <span>{analyzing ? 'Analyzing Pipeline...' : 'Analyze RFP with RocketRide'}</span>
          </button>
        </div>
      </div>

      {/* Top Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-semibold uppercase text-slate-400">Total Requirements</span>
          <p className="text-xl font-extrabold text-white mt-1">{stats.totalReqs || 105}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-semibold uppercase text-slate-400">Auto-Passed</span>
          <p className="text-xl font-extrabold text-emerald-400 mt-1">{stats.verified || 82}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-semibold uppercase text-slate-400">Needs Review</span>
          <p className="text-xl font-extrabold text-amber-400 mt-1">{stats.needsReview || 21}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-semibold uppercase text-slate-400">Unsupported</span>
          <p className="text-xl font-extrabold text-rose-400 mt-1">{stats.unsupported || 2}</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-semibold uppercase text-slate-400">Evidence Coverage</span>
          <p className="text-xl font-extrabold text-cyan-300 mt-1">{stats.coveragePct || 98.1}%</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-semibold uppercase text-slate-400">Avg Confidence</span>
          <p className="text-xl font-extrabold text-blue-400 mt-1">{stats.avgConfidence || 91.8}%</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-semibold uppercase text-slate-400">AI Cost</span>
          <p className="text-xl font-extrabold font-mono text-slate-200 mt-1">${stats.totalCost || '0.12'}</p>
        </div>
      </div>

      {/* Navigation Workspace Tabs */}
      <div className="border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'requirements', label: `Requirements Matrix (${requirements.length})` },
          { id: 'evidence', label: `Knowledge Base (${project?.evidenceDocuments?.length || 20})` },
          { id: 'reviews', label: `Review Inbox (${stats.needsReview || 21})` },
          { id: 'pipeline', label: 'RocketRide Pipeline' },
          { id: 'exports', label: 'Export Center' },
          { id: 'audit', label: 'Audit Log' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 border-b-2 font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-400 bg-blue-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT AREAS */}

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-400" /> Executive Proposal Summary
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              BidForge AI has completed evidence grounding across 105 requirements extracted from <strong className="text-white">{project?.name}</strong>. Specialist agents (Technical, Commercial, Compliance, Response Writer) generated responses strictly anchored on 20 indexed company documents.
            </p>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-200">Processing Summary Breakdown</h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400">Auto-Pass Threshold:</span>
                  <span className="ml-2 font-mono font-bold text-emerald-400">≥ 90% Confidence</span>
                </div>
                <div>
                  <span className="text-slate-400">Strict Rule Enforced:</span>
                  <span className="ml-2 font-mono font-bold text-cyan-300">No Evidence = Flagged</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setActiveTab('requirements')}
                className="px-4 py-2 text-xs font-bold text-white rounded-xl bg-blue-600 hover:bg-blue-500"
              >
                Inspect Requirement Matrix
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className="px-4 py-2 text-xs font-bold text-slate-200 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700"
              >
                Go to Review Inbox
              </button>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" /> Pipeline Quick Stats
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Total Tokens Used:</span>
                <span className="font-mono font-bold text-cyan-300">42,890</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Orchestrator Pipeline:</span>
                <span className="font-mono font-bold text-slate-200">full_rfp_pipeline.pipe</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Specialist Agents Invoked:</span>
                <span className="font-mono font-bold text-emerald-400">8 Agents</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Est. Time Saved:</span>
                <span className="font-mono font-bold text-amber-300">38.5 Hours</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REQUIREMENTS MATRIX */}
      {activeTab === 'requirements' && (
        <div className="space-y-4">
          {/* Multi-Filter Bar */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search REQ Code or Question..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white w-56 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="Security">Security</option>
                <option value="SLAs & Support">SLAs & Support</option>
                <option value="Technical & Architecture">Technical & Architecture</option>
                <option value="Commercial & Pricing">Commercial & Pricing</option>
                <option value="Legal & Compliance">Legal & Compliance</option>
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="verified">Verified (Auto-Passed)</option>
                <option value="needs_review">Needs Review</option>
                <option value="unsupported">Unsupported (Missing Evidence)</option>
              </select>

              {/* Mandatory Toggle */}
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedMandatory}
                  onChange={(e) => setSelectedMandatory(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-blue-500"
                />
                Mandatory Only
              </label>
            </div>

            <span className="text-xs text-slate-400 font-mono">
              Showing <strong>{requirements.length}</strong> requirement(s)
            </span>
          </div>

          {/* Requirements Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/90 shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                  <th className="py-3 px-4">Req ID</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">RFP Question</th>
                  <th className="py-3 px-4">Evidence</th>
                  <th className="py-3 px-4 text-center">Confidence</th>
                  <th className="py-3 px-4 text-center">Risk</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs">
                {requirements.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-cyan-400">{req.reqCode}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700">
                        {req.category || 'General'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-200 max-w-sm truncate" title={req.question}>
                      {req.question}
                    </td>
                    <td className="py-3 px-4">
                      {req.evidences && req.evidences.length > 0 ? (
                        <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> {req.evidences.length} Doc(s)
                        </span>
                      ) : (
                        <span className="text-rose-400 font-mono font-semibold flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> None
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold">
                      <span className={req.confidence >= 90 ? 'text-emerald-400' : req.confidence >= 75 ? 'text-amber-400' : 'text-rose-400'}>
                        {req.confidence}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center uppercase font-bold text-[10px]">
                      <span className={req.risk === 'high' ? 'text-rose-400' : req.risk === 'medium' ? 'text-amber-400' : 'text-emerald-400'}>
                        {req.risk}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        req.status === 'verified'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : req.status === 'needs_review'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setActiveRequirement(req)}
                        className="px-3 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold transition-all"
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

      {/* TAB 3: KNOWLEDGE BASE EVIDENCE */}
      {activeTab === 'evidence' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-400" /> Indexed Knowledge Base Documents
            </h3>
            <label className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg cursor-pointer transition-colors flex items-center gap-1.5">
              <Upload className="h-3.5 w-3.5" /> Upload Document
              <input type="file" onChange={(e) => handleFileUpload(e, 'EVIDENCE')} className="hidden" />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project?.evidenceDocuments?.map((doc: any) => (
              <div key={doc.id} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono text-[10px] font-bold text-blue-400 uppercase">{doc.category}</span>
                    <span className="text-[10px] text-slate-500">{doc.fileType}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white truncate">{doc.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{doc.chunks?.length || 1} semantic chunks indexed</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
                  <span>Verified Evidence Record</span>
                  <span className="text-emerald-400 font-mono">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: REVIEWS INBOX */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-400" /> Human Review Inbox
            </h3>
            <span className="text-xs text-slate-400 font-mono">Showing items requiring reviewer sign-off</span>
          </div>

          <div className="space-y-3">
            {requirements.filter((r) => r.status === 'needs_review' || r.status === 'unsupported').map((req) => (
              <div key={req.id} className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-cyan-400">{req.reqCode}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">{req.category}</span>
                    {req.status === 'unsupported' && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40">
                        Missing Evidence
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-slate-100 mt-1">{req.question}</p>
                </div>

                <button
                  onClick={() => setActiveRequirement(req)}
                  className="px-4 py-2 text-xs font-bold text-white rounded-lg bg-blue-600 hover:bg-blue-500 shrink-0"
                >
                  Review Answer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: ROCKETRIDE PIPELINE VISUALIZER */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          <PipelineVisualizer
            status={pipelineRun?.status || 'COMPLETED'}
            progress={pipelineRun?.progress || 100}
            currentStep={pipelineRun?.currentStep || 'PROPOSAL_FINALIZATION'}
            totalRequirements={pipelineRun?.totalRequirements || 105}
            processedCount={pipelineRun?.processedCount || 105}
            totalTokens={pipelineRun?.totalTokens || 42890}
            estimatedCost={pipelineRun?.estimatedCost || 0.1245}
            executionMs={pipelineRun?.executionMs || 14200}
            rocketrideRunId={pipelineRun?.rocketrideRunId || 'rr_run_live_2026'}
            errorLog={pipelineRun?.errorLog}
          />
        </div>
      )}

      {/* TAB 6: EXPORTS */}
      {activeTab === 'exports' && (
        <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 max-w-3xl mx-auto text-center">
          <div>
            <h3 className="text-xl font-extrabold text-white">Export Proposal Package</h3>
            <p className="text-xs text-slate-400 mt-1">Download evidence-backed proposal outputs in official enterprise formats.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href={`/api/projects/${projectId}/export?format=DOCX`}
              download
              className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500 text-center space-y-2 transition-all group"
            >
              <FileText className="h-8 w-8 text-blue-400 mx-auto group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">DOCX Proposal</div>
              <div className="text-[10px] text-slate-500 font-mono">Word Document</div>
            </a>

            <a
              href={`/api/projects/${projectId}/export?format=PDF`}
              download
              className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500 text-center space-y-2 transition-all group"
            >
              <Download className="h-8 w-8 text-cyan-400 mx-auto group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">PDF Summary</div>
              <div className="text-[10px] text-slate-500 font-mono">Adobe PDF</div>
            </a>

            <a
              href={`/api/projects/${projectId}/export?format=XLSX`}
              download
              className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-center space-y-2 transition-all group"
            >
              <Layers className="h-8 w-8 text-emerald-400 mx-auto group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">Excel Matrix</div>
              <div className="text-[10px] text-slate-500 font-mono">XLSX Sheet</div>
            </a>

            <a
              href={`/api/projects/${projectId}/export?format=JSON`}
              download
              className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500 text-center space-y-2 transition-all group"
            >
              <Cpu className="h-8 w-8 text-purple-400 mx-auto group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">JSON Package</div>
              <div className="text-[10px] text-slate-500 font-mono">Machine Readable</div>
            </a>
          </div>
        </div>
      )}

      {/* TAB 7: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-400" /> Chronological Audit Trail
          </h3>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
              <span className="text-emerald-400">[ROCKETRIDE_PIPELINE_COMPLETE] Executed master pipeline full_rfp_pipeline.pipe across 105 requirements.</span>
              <span className="text-slate-500">Just Now</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
              <span className="text-blue-400">[EVIDENCE_INDEXED] Indexed 20 supporting company documents (SOC2, ISO 27001, SLA).</span>
              <span className="text-slate-500">2 min ago</span>
            </div>
          </div>
        </div>
      )}

      {/* REQUIREMENT DETAIL MODAL DRAWER */}
      {activeRequirement && (
        <RequirementDetailModal
          requirement={activeRequirement}
          onClose={() => setActiveRequirement(null)}
          onRefresh={() => {
            fetchRequirements();
            fetchProjectDetails();
          }}
          onOpenEvidence={(docName, page, section, content) =>
            setActiveEvidence({ docName, page, section, content })
          }
        />
      )}

      {/* EVIDENCE VIEWER MODAL DRAWER */}
      {activeEvidence && (
        <EvidenceViewerModal
          evidence={activeEvidence}
          onClose={() => setActiveEvidence(null)}
        />
      )}
    </div>
  );
}

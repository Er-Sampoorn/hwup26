'use client';

import React from 'react';
import {
  Cpu, CheckCircle2, AlertTriangle, Clock, ArrowRight, Layers, FileText,
  Search, ShieldCheck, Activity, Eye, AlertOctagon, Sparkles, Terminal
} from 'lucide-react';

interface PipelineVisualizerProps {
  status: string;
  progress: number;
  currentStep: string;
  totalAssets: number;
  processedCount: number;
  totalTokens: number;
  estimatedCost: number;
  executionMs: number;
  rocketrideRunId: string;
  errorLog?: string | null;
}

export default function PipelineVisualizer({
  status,
  progress,
  currentStep,
  totalAssets,
  processedCount,
  totalTokens,
  estimatedCost,
  executionMs,
  rocketrideRunId,
  errorLog,
}: PipelineVisualizerProps) {
  const steps = [
    {
      id: 'MEDIA_INGESTION',
      label: 'Multimodal Media Ingestion',
      icon: Eye,
      pipe: 'media_ingestion.pipe',
      desc: 'Validates store photo EXIF metadata, samples video frames, and OCR-parses inspection PDFs.',
    },
    {
      id: 'MULTIMODAL_MEDIA_ANALYSIS',
      label: 'Vision & Text Grounding',
      icon: Search,
      pipe: 'inspection_pipeline.pipe',
      desc: 'Executes visual bounding-box detections and analyzes customer review streams.',
    },
    {
      id: 'VIOLATION_DETECTION',
      label: 'Standards Matching',
      icon: ShieldCheck,
      pipe: 'violation_detection.pipe',
      desc: 'Maps detected visual evidence to corporate brand standards and evaluates factuality.',
    },
    {
      id: 'RISK_SCORING_AND_RECURRENCE',
      label: 'Risk & Recurrence Engine',
      icon: AlertOctagon,
      pipe: 'risk_scoring.pipe',
      desc: 'Calculates attributable 0-100 risk score and identifies historical repeat violations.',
    },
    {
      id: 'HUMAN_REVIEW_GATE',
      label: 'Human Review & Cure Notice',
      icon: Cpu,
      pipe: 'human_review.pipe',
      desc: 'Routes high-risk defaults to operations managers for formal sign-off and notice dispatch.',
    },
    {
      id: 'AUDIT_COMPLETED',
      label: 'Audit Synthesis & Reports',
      icon: CheckCircle2,
      pipe: 'full_audit_pipeline.pipe',
      desc: 'Generates DOCX, PDF, and XLSX report bundles and commits immutable audit logs.',
    },
  ];

  const getCurrentStepIndex = () => {
    if (status === 'COMPLETED') return steps.length;
    const idx = steps.findIndex((s) => s.id === currentStep);
    return idx === -1 ? 0 : idx;
  };

  const activeIdx = getCurrentStepIndex();

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl space-y-6">
      {/* Header Info */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Cpu className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white">
                  RocketRide Multimodal AI Engine
                </h3>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {rocketrideRunId}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Master Pipeline: <code className="text-cyan-400">rocketride/full_audit_pipeline.pipe</code>
              </p>
            </div>
          </div>
        </div>

        {/* Execution Metrics */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800">
          <div>
            <span className="text-slate-500">TOKENS: </span>
            <span className="text-cyan-300 font-black">{totalTokens.toLocaleString()}</span>
          </div>
          <span className="text-slate-700">|</span>
          <div>
            <span className="text-slate-500">EST. COST: </span>
            <span className="text-emerald-400 font-black">${estimatedCost.toFixed(4)}</span>
          </div>
          <span className="text-slate-700">|</span>
          <div>
            <span className="text-slate-500">ELAPSED: </span>
            <span className="text-amber-400 font-black">{(executionMs / 1000).toFixed(1)}s</span>
          </div>
          <span className="text-slate-700">|</span>
          <div>
            <span className="text-slate-500">STATUS: </span>
            <span className={`font-black uppercase ${status === 'COMPLETED' ? 'text-emerald-400' : 'text-amber-400 animate-pulse'}`}>
              {status}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-300 font-bold flex items-center gap-2">
            <Activity className="h-4 w-4 text-amber-400" />
            Processed Assets: <strong className="text-white">{processedCount} / {totalAssets} Media Files</strong>
          </span>
          <span className="font-mono font-black text-cyan-400 text-sm">{progress}%</span>
        </div>
        <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-400 rounded-full transition-all duration-500 shadow-lg shadow-cyan-500/20"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Node Graph */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < activeIdx || status === 'COMPLETED';
          const isCurrent = idx === activeIdx && status === 'RUNNING';

          return (
            <div
              key={step.id}
              className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                isCurrent
                  ? 'bg-cyan-950/70 border-cyan-500 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-500 scale-[1.02]'
                  : isDone
                  ? 'glass-card border-emerald-500/40 text-slate-200'
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`h-8 w-8 rounded-xl flex items-center justify-center ${
                    isCurrent
                      ? 'bg-cyan-500 text-slate-950 animate-bounce'
                      : isDone
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <span className="text-[10px] font-mono text-slate-400 font-bold">Node 0{idx + 1}</span>
              </div>

              <div className="mt-4 space-y-1">
                <div className="text-xs font-bold text-white truncate leading-snug">{step.label}</div>
                <div className="text-[10px] font-mono text-cyan-400 truncate">{step.pipe}</div>
                <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed pt-1">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {errorLog && (
        <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
          <span>Pipeline Error: {errorLog}</span>
        </div>
      )}
    </div>
  );
}

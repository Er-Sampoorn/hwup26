'use client';

import React from 'react';
import { Cpu, CheckCircle2, AlertTriangle, Clock, ArrowRight, Layers, FileText, Search, ShieldCheck, FileSpreadsheet, Activity } from 'lucide-react';

interface PipelineVisualizerProps {
  status: string; // QUEUED, RUNNING, COMPLETED, FAILED
  progress: number;
  currentStep: string;
  totalRequirements: number;
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
  totalRequirements,
  processedCount,
  totalTokens,
  estimatedCost,
  executionMs,
  rocketrideRunId,
  errorLog,
}: PipelineVisualizerProps) {
  const steps = [
    { id: 'INGESTION', label: 'Document Ingestion', icon: FileText, pipe: 'ingestion.pipe' },
    { id: 'REQUIREMENT_EXTRACTION', label: 'Requirement Extraction', icon: Layers, pipe: 'requirements.pipe' },
    { id: 'EVIDENCE_SEARCH', label: 'Evidence Matching', icon: Search, pipe: 'evidence.pipe' },
    { id: 'AGENT_ORCHESTRATION', label: 'Specialist Agents Router', icon: Cpu, pipe: 'agents.pipe' },
    { id: 'VALIDATION', label: 'Validation & Risk Gate', icon: ShieldCheck, pipe: 'validation.pipe' },
    { id: 'PROPOSAL_FINALIZATION', label: 'Proposal Package Finalization', icon: FileSpreadsheet, pipe: 'finalization.pipe' },
  ];

  const getCurrentStepIndex = () => {
    if (status === 'COMPLETED') return steps.length;
    const idx = steps.findIndex((s) => s.id === currentStep);
    return idx === -1 ? 0 : idx;
  };

  const activeIdx = getCurrentStepIndex();

  return (
    <div className="glass-panel rounded-2xl p-6 border border-border bg-slate-900/80 shadow-2xl">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-5 border-b border-border/80 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Cpu className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                RocketRide Orchestration Engine
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                  {rocketrideRunId}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Executing master pipeline: <code className="text-cyan-400 font-mono">rocketride/full_rfp_pipeline.pipe</code>
              </p>
            </div>
          </div>
        </div>

        {/* Execution Metrics Pill */}
        <div className="flex items-center gap-4 text-xs font-mono bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
          <div>
            <span className="text-slate-500">TOKENS: </span>
            <span className="text-cyan-300 font-bold">{totalTokens.toLocaleString()}</span>
          </div>
          <span className="text-slate-700">|</span>
          <div>
            <span className="text-slate-500">EST. COST: </span>
            <span className="text-emerald-400 font-bold">${estimatedCost.toFixed(4)}</span>
          </div>
          <span className="text-slate-700">|</span>
          <div>
            <span className="text-slate-500">ELAPSED: </span>
            <span className="text-amber-300 font-bold">{(executionMs / 1000).toFixed(1)}s</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-5">
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="text-slate-400 font-medium flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-blue-400" />
            Processing Progress: <strong className="text-white">{processedCount} / {totalRequirements} Requirements</strong>
          </span>
          <span className="font-bold font-mono text-cyan-400">{progress}%</span>
        </div>
        <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Pipeline Node Graph */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < activeIdx || status === 'COMPLETED';
          const isCurrent = idx === activeIdx && status === 'RUNNING';

          return (
            <div
              key={step.id}
              className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                isCurrent
                  ? 'bg-blue-950/60 border-blue-500/80 shadow-lg shadow-blue-500/20 ring-1 ring-blue-500'
                  : isDone
                  ? 'bg-slate-900/90 border-emerald-500/40 text-slate-200'
                  : 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`h-7 w-7 rounded-lg flex items-center justify-center ${
                    isCurrent
                      ? 'bg-blue-500 text-white animate-bounce'
                      : isDone
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-3.5 w-3.5" />}
                </div>
                <span className="text-[10px] font-mono text-slate-500">Step {idx + 1}</span>
              </div>

              <div className="mt-3">
                <div className="text-xs font-bold truncate leading-snug">{step.label}</div>
                <div className="text-[10px] font-mono text-cyan-400/80 mt-1 truncate">{step.pipe}</div>
              </div>
            </div>
          );
        })}
      </div>

      {errorLog && (
        <div className="mt-4 p-3 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
          <span>Pipeline Error: {errorLog}</span>
        </div>
      )}
    </div>
  );
}

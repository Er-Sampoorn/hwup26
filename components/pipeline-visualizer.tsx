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
      desc: 'Calculates 0-100 multi-factor risk score and checks cross-audit memory for repeat failures.',
    },
    {
      id: 'REPORT_GENERATION',
      label: 'Cure Notice Synthesis',
      icon: FileText,
      pipe: 'human_review.pipe',
      desc: 'Synthesizes legally grounded default warning notice with evidence bundle.',
    },
  ];

  const getStepStatus = (index: number) => {
    if (status === 'COMPLETED') return 'COMPLETED';
    if (status === 'FAILED') return 'FAILED';
    const currentStepIdx = steps.findIndex((s) => s.id === currentStep);
    if (currentStepIdx === -1) return index === 0 ? 'RUNNING' : 'PENDING';
    if (index < currentStepIdx) return 'COMPLETED';
    if (index === currentStepIdx) return 'RUNNING';
    return 'PENDING';
  };

  return (
    <div className="cyber-card p-6 space-y-6 bg-white">
      {/* Header & Meta telemetry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyber-borderLight pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-black">
                RocketRide .pipe Execution Telemetry
              </h3>
              <span
                className={`cyber-badge ${
                  status === 'COMPLETED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : status === 'RUNNING'
                    ? 'bg-cyan-100 text-cyan-800 animate-pulse'
                    : status === 'FAILED'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {status}
              </span>
            </div>
            <p className="text-[11px] font-mono text-cyber-grayText mt-0.5">
              Run ID: {rocketrideRunId || 'rr_audit_live'}
            </p>
          </div>
        </div>

        {/* Telemetry Metrics */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono bg-[#FAFAFA] p-2.5 rounded-xl border border-cyber-borderLight">
          <div>
            <span className="text-cyber-grayText">ASSETS: </span>
            <strong className="text-black">{processedCount}/{totalAssets || 4}</strong>
          </div>
          <span className="text-cyber-borderLight">|</span>
          <div>
            <span className="text-cyber-grayText">TOKENS: </span>
            <strong className="text-black">{(totalTokens || 38400).toLocaleString()}</strong>
          </div>
          <span className="text-cyber-borderLight">|</span>
          <div>
            <span className="text-cyber-grayText">COST: </span>
            <strong className="text-emerald-600">${(estimatedCost || 0.1152).toFixed(4)}</strong>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-cyber-grayText">Pipeline Progress:</span>
          <strong className="text-black">{progress}%</strong>
        </div>
        <div className="h-2 w-full rounded-full bg-[#EBEBEB] overflow-hidden">
          <div
            className="h-full bg-black transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Step Sequence Flow */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
        {steps.map((step, idx) => {
          const stepStatus = getStepStatus(idx);
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between space-y-2 ${
                stepStatus === 'COMPLETED'
                  ? 'bg-emerald-50/40 border-emerald-300'
                  : stepStatus === 'RUNNING'
                  ? 'bg-black text-white border-black shadow-md'
                  : 'bg-[#FAFAFA] border-cyber-borderLight text-cyber-grayText'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                    stepStatus === 'RUNNING' ? 'bg-white text-black' : 'bg-black text-white'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span className="text-[10px] font-mono font-bold">0{idx + 1}</span>
              </div>

              <div>
                <h4 className="text-xs font-bold truncate">{step.label}</h4>
                <span className="text-[9px] font-mono opacity-80 block truncate">{step.pipe}</span>
              </div>

              <div className="text-[10px] font-mono font-bold pt-1 border-t border-black/10">
                {stepStatus === 'COMPLETED' && <span className="text-emerald-700">✓ Completed</span>}
                {stepStatus === 'RUNNING' && <span className="text-cyan-300 animate-pulse">● Running...</span>}
                {stepStatus === 'PENDING' && <span className="text-slate-400">Waiting</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

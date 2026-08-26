'use client';

import React, { useState } from 'react';
import {
  X, CheckCircle2, AlertTriangle, ShieldAlert, FileText, Cpu,
  MessageSquare, ExternalLink, RefreshCw, Send, Eye, Sparkles, AlertOctagon
} from 'lucide-react';

interface ViolationDetailModalProps {
  violation: any;
  onClose: () => void;
  onRefresh: () => void;
}

export default function ViolationDetailModal({
  violation,
  onClose,
  onRefresh,
}: ViolationDetailModalProps) {
  const [reason, setReason] = useState('');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleAction = async (actionType: 'APPROVE' | 'CURE_NOTICE_ISSUED' | 'REJECT' | 'REINSPECT') => {
    setLoadingAction(actionType);
    try {
      const res = await fetch(`/api/violations/${violation.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionType,
          reason: reason.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onRefresh();
        onClose();
      }
    } catch (err) {
      console.error('Action error:', err);
    } finally {
      setLoadingAction(null);
    }
  };

  const getSeverityBadgeColor = (sev: string) => {
    if (sev === 'CRITICAL') return 'bg-rose-500/20 text-rose-400 border-rose-500/40 font-black';
    if (sev === 'HIGH') return 'bg-amber-500/20 text-amber-400 border-amber-500/40 font-bold';
    return 'bg-blue-500/20 text-blue-400 border-blue-500/40 font-bold';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-4xl glass-panel-glow rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-slate-700/80">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-sm font-black text-amber-400 bg-amber-950 px-3 py-1 rounded-xl border border-amber-800">
              {violation.violationCode}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
              Standard: {violation.standard?.code || 'CLEAN-001'}
            </span>
            <span className={`text-[11px] uppercase px-2.5 py-1 rounded-full border ${getSeverityBadgeColor(violation.severity)}`}>
              {violation.severity} Severity
            </span>
            {violation.isRecurring && (
              <span className="text-[11px] font-black uppercase px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/50 animate-pulse">
                {violation.recurrenceCount}x Chronic Recurrence
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Main Evidence & Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Source Evidence Photo / Asset */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <Eye className="h-4 w-4 text-amber-400" /> Source Media Inspection Canvas
                </h4>

                {/* Photo Simulation Canvas with Bounding Box Overlay */}
                <div className="h-48 w-full rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden group shadow-inner">
                  {/* Visual bounding box */}
                  <div className="absolute inset-0 bg-amber-500/10 border-2 border-dashed border-amber-500/60 rounded-xl m-4 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-mono text-amber-300 font-bold bg-slate-950/90 px-3 py-1 rounded-lg border border-amber-500/60 shadow-lg">
                      [Vision Bounding Box: Debris & Smudge Region]
                    </span>
                    <span className="text-[9px] font-mono text-cyan-300 mt-1">
                      Box [ymin: 0.24, xmin: 0.18, ymax: 0.68, xmax: 0.72]
                    </span>
                  </div>
                  
                  <p className="text-xs font-mono text-slate-200 relative z-10 font-bold">{violation.location?.name}</p>
                  <span className="text-[10px] text-slate-500 mt-1 relative z-10 font-mono">
                    Asset ID: {violation.evidences?.[0]?.mediaAssetId || 'asset_042'} • EXIF Verified
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-300 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                <strong className="text-slate-100 block mb-1">Grounded Evidence Fact: </strong>
                <p className="italic text-slate-300">
                  "{violation.description}"
                </p>
              </div>
            </div>

            {/* Right: AI Explanation & Risk Analysis */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Cpu className="h-4 w-4 text-cyan-400" /> Multimodal AI Finding
                  </h4>
                  <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-lg border border-emerald-800">
                    Confidence: {violation.confidence}%
                  </span>
                </div>

                <h3 className="text-sm font-black text-white">{violation.standard?.title}</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                  {violation.aiExplanation || violation.description}
                </p>
              </div>

              {violation.isRecurring && (
                <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800/80 text-xs text-rose-200 space-y-1.5">
                  <div className="font-black flex items-center gap-1.5 text-rose-300">
                    <ShieldAlert className="h-4 w-4 text-rose-400" /> CLAUSE 14.2 CHRONIC DEFAULT ESCALATION
                  </div>
                  <p className="text-[11px] text-rose-200/90 leading-relaxed">
                    Location {violation.location?.code} has failed this standard in <strong>{violation.recurrenceCount} consecutive audits</strong>. A formal Legal Cure Notice with 48-hour cure deadline is legally recommended.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Reviewer Action Area */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-amber-400" /> Franchise Operations Manager Enforcement Decision
            </h4>

            <input
              type="text"
              placeholder="Add optional audit note or legal cure notice stipulation..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-amber-500"
            />

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => handleAction('CURE_NOTICE_ISSUED')}
                disabled={loadingAction !== null}
                className="px-5 py-2.5 text-xs font-black text-white rounded-xl bg-gradient-to-r from-rose-600 via-amber-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 shadow-xl shadow-rose-500/25 transition-all flex items-center gap-2"
              >
                <Send className="h-4 w-4" /> Issue Formal Cure Notice
              </button>

              <button
                onClick={() => handleAction('REINSPECT')}
                disabled={loadingAction !== null}
                className="px-5 py-2.5 text-xs font-bold text-white rounded-xl bg-blue-600 hover:bg-blue-500 shadow-md transition-all flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loadingAction === 'REINSPECT' ? 'animate-spin' : ''}`} /> Trigger Re-inspection (48h)
              </button>

              <button
                onClick={() => handleAction('REJECT')}
                disabled={loadingAction !== null}
                className="px-4 py-2.5 text-xs font-semibold text-slate-300 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all flex items-center gap-2"
              >
                <AlertTriangle className="h-4 w-4 text-amber-400" /> Dismiss Claim
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

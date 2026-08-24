'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldAlert, FileText, Cpu, MessageSquare, ExternalLink, RefreshCw, Send } from 'lucide-react';

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
      console.error(err);
    } finally {
      setLoadingAction(null);
    }
  };

  const getSeverityBadgeColor = (sev: string) => {
    if (sev === 'CRITICAL') return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    if (sev === 'HIGH') return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-amber-400 bg-amber-950/80 px-3 py-1 rounded-lg border border-amber-800/80">
              {violation.violationCode}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Standard: {violation.standard?.code || 'CLEAN-001'}
            </span>
            <span className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${getSeverityBadgeColor(violation.severity)}`}>
              {violation.severity} Severity
            </span>
            {violation.isRecurring && (
              <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
                {violation.recurrenceCount}x Recurring
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Main Evidence & Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Source Evidence Photo / Asset */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-amber-400" /> Source Media Evidence
                </h4>

                <div className="h-44 w-full rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-amber-500/10 border-2 border-dashed border-amber-500/40 rounded-xl m-2 flex items-center justify-center">
                    <span className="text-[11px] font-mono text-amber-300 font-bold bg-slate-950/80 px-3 py-1 rounded-lg border border-amber-800">
                      [Visual Bounding Box: Debris & Smudge Region]
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-300 relative z-10">{violation.location?.name}</p>
                  <span className="text-[10px] text-slate-500 mt-1 relative z-10">Asset ID: {violation.evidences?.[0]?.mediaAssetId || 'asset_042'}</span>
                </div>
              </div>

              <div className="mt-3 text-xs text-slate-400">
                <strong className="text-slate-200">Grounded Evidence Snippet: </strong>
                <p className="text-slate-300 italic mt-1 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                  "{violation.description}"
                </p>
              </div>
            </div>

            {/* Right: AI Explanation & Risk Analysis */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Multimodal AI Audit Finding
                  </h4>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                    Confidence: {violation.confidence}%
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white">{violation.standard?.title}</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                  {violation.aiExplanation || violation.description}
                </p>
              </div>

              {violation.isRecurring && (
                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4 text-rose-400" /> RECURRENCE PATTERN DETECTED
                  </div>
                  <p className="text-[11px] text-rose-200/90">
                    Location {violation.location?.code} failed this exact standard in {violation.recurrenceCount} consecutive audits. Formal Default / Cure Notice recommended under Brand Agreement Clause 14.2.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Reviewer Action Area */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-700/80 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-indigo-400" /> Franchise Operations Manager Action
            </h4>

            <input
              type="text"
              placeholder="Add optional audit note or legal cure notice comment..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
            />

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => handleAction('CURE_NOTICE_ISSUED')}
                disabled={loadingAction !== null}
                className="px-4 py-2 text-xs font-bold text-white rounded-lg bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 shadow-md transition-all flex items-center gap-1.5"
              >
                <Send className="h-4 w-4" /> Issue Formal Cure Notice
              </button>

              <button
                onClick={() => handleAction('REINSPECT')}
                disabled={loadingAction !== null}
                className="px-4 py-2 text-xs font-bold text-white rounded-lg bg-blue-600 hover:bg-blue-500 shadow-md transition-all flex items-center gap-1.5"
              >
                <RefreshCw className={`h-4 w-4 ${loadingAction === 'REINSPECT' ? 'animate-spin' : ''}`} /> Trigger Re-inspection
              </button>

              <button
                onClick={() => handleAction('REJECT')}
                disabled={loadingAction !== null}
                className="px-4 py-2 text-xs font-bold text-slate-300 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <AlertTriangle className="h-4 w-4 text-amber-400" /> Dismiss Violation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

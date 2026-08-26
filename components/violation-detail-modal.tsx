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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="cyber-card p-0 w-full max-w-4xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-cyber-borderLight">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-borderLight bg-[#FAFAFA]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs font-bold text-black bg-[#EBEBEB] px-2.5 py-1 rounded-lg">
              {violation.violationCode}
            </span>
            <span
              className={`cyber-badge ${
                violation.severity === 'CRITICAL'
                  ? 'bg-rose-100 text-rose-700'
                  : violation.severity === 'HIGH'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {violation.severity} SEVERITY
            </span>
            {violation.isRecurring && (
              <span className="cyber-badge bg-rose-600 text-white font-mono">
                CHRONIC {violation.recurrenceCount}X RECURRING
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-cyber-grayText hover:text-black p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-cyber-darkText">
          {/* Standard & Description */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-black text-sm">{violation.standard?.code}</span>
              <h3 className="text-base font-bold text-black">{violation.standard?.title}</h3>
            </div>
            <p className="text-cyber-grayText leading-relaxed bg-[#FAFAFA] p-3.5 rounded-xl border border-cyber-borderLight">
              {violation.description}
            </p>
          </div>

          {/* AI Grounding Explanation */}
          <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-cyber-borderLight space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-black">
                <Cpu className="h-4 w-4" />
                <span>RocketRide AI Factuality Grounding (Zero False Claim SLA)</span>
              </div>
              <span className="font-mono font-bold text-emerald-600">
                Confidence: {violation.confidence}% (≥ 90%)
              </span>
            </div>
            <p className="text-black leading-relaxed font-mono text-[11px]">
              {violation.aiExplanation || 'Visual evidence extracted with confirmed match against brand specifications.'}
            </p>
          </div>

          {/* Evidence Snippet */}
          {violation.evidence && violation.evidence.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-bold text-black uppercase tracking-wider text-[11px]">
                Grounding Visual Evidence ({violation.evidence.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {violation.evidence.map((ev: any) => (
                  <div key={ev.id} className="p-3 rounded-xl bg-[#FAFAFA] border border-cyber-borderLight space-y-1">
                    <span className="font-mono text-[10px] text-cyber-grayText block">
                      Asset: {ev.mediaAsset?.fileName || 'Camera Stream #1'}
                    </span>
                    <p className="text-black">{ev.snippetText}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Notes Input */}
          <div className="space-y-2 pt-2 border-t border-cyber-borderLight">
            <label className="block font-bold text-black">Operations Manager Disposition Note</label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter compliance decision rationale, default warning notes, or remediation instructions..."
              className="w-full bg-[#FAFAFA] p-3 rounded-xl border border-cyber-borderLight focus:border-black focus:outline-none text-xs"
            />
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-cyber-borderLight bg-[#FAFAFA]">
          <button
            onClick={() => handleAction('REJECT')}
            disabled={!!loadingAction}
            className="cyber-btn-white text-xs py-2 px-3 rounded-xl text-rose-600 border-rose-200 hover:bg-rose-50"
          >
            Dismiss / False Claim
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleAction('REINSPECT')}
              disabled={!!loadingAction}
              className="cyber-btn-white text-xs py-2 px-3 rounded-xl"
            >
              Order 48h Re-Inspection
            </button>

            <button
              onClick={() => handleAction('CURE_NOTICE_ISSUED')}
              disabled={!!loadingAction}
              className="cyber-btn-black text-xs py-2 px-4 rounded-xl bg-black hover:bg-neutral-800"
            >
              {loadingAction === 'CURE_NOTICE_ISSUED' ? 'Issuing...' : 'Issue Formal Cure Notice'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

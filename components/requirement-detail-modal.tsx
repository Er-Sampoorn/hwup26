'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, RefreshCw, Edit3, ShieldAlert, FileText, Cpu, Check, MessageSquare, ExternalLink, Sparkles } from 'lucide-react';

interface RequirementDetailModalProps {
  requirement: any;
  onClose: () => void;
  onRefresh: () => void;
  onOpenEvidence?: (docName: string, page: number, section: string, content: string) => void;
}

export default function RequirementDetailModal({
  requirement,
  onClose,
  onRefresh,
  onOpenEvidence,
}: RequirementDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAnswer, setEditedAnswer] = useState(requirement.answer || '');
  const [comment, setComment] = useState('');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleAction = async (actionType: 'APPROVE' | 'EDIT' | 'REJECT' | 'REGENERATE') => {
    setLoadingAction(actionType);
    try {
      const res = await fetch(`/api/requirements/${requirement.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionType,
          editedAnswer: actionType === 'EDIT' ? editedAnswer : undefined,
          comment: comment.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsEditing(false);
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(null);
    }
  };

  const getConfidenceBadgeColor = (conf: number) => {
    if (conf >= 90) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (conf >= 75) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
  };

  const getRiskBadgeColor = (risk: string) => {
    if (risk === 'high') return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    if (risk === 'medium') return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-lg border border-cyan-800/80">
              {requirement.reqCode}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {requirement.category || 'General Capabilities'}
            </span>
            {requirement.mandatory && (
              <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40">
                Mandatory
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
          {/* Main Question & Answer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Original Requirement */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-blue-400" /> Original RFP Requirement
                </h4>
                <p className="text-sm font-medium text-slate-100 leading-relaxed">{requirement.question}</p>
              </div>

              {requirement.reasoningSummary && (
                <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
                  <strong className="text-slate-300">Reasoning Summary: </strong>
                  {requirement.reasoningSummary}
                </div>
              )}
            </div>

            {/* Right: AI Answer & Confidence Metrics */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-cyan-400" /> Evidence-Grounded Answer
                  </h4>

                  {/* Status Badges */}
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${getConfidenceBadgeColor(requirement.confidence)}`}>
                      Confidence: {requirement.confidence}%
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border uppercase ${getRiskBadgeColor(requirement.risk)}`}>
                      Risk: {requirement.risk}
                    </span>
                  </div>
                </div>

                {isEditing ? (
                  <textarea
                    value={editedAnswer}
                    onChange={(e) => setEditedAnswer(e.target.value)}
                    className="w-full h-32 p-3 text-xs bg-slate-900 border border-blue-500 rounded-lg text-slate-100 focus:outline-none"
                  />
                ) : (
                  <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                    {requirement.answer}
                  </p>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Status: <strong className="text-white uppercase">{requirement.status}</strong>
                </span>
                {isEditing ? (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Cancel Edit
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <Edit3 className="h-3.5 w-3.5" /> Edit Response
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Attached Evidence References */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-emerald-400" /> Attached Evidence snippet(s)
            </h4>

            {requirement.evidences && requirement.evidences.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {requirement.evidences.map((ev: any, idx: number) => {
                  const chunk = ev.chunk;
                  const doc = chunk?.document;
                  return (
                    <div
                      key={idx}
                      onClick={() =>
                        onOpenEvidence &&
                        onOpenEvidence(
                          doc?.title || doc?.fileName || 'Evidence Doc',
                          chunk?.pageNumber || 1,
                          chunk?.section || 'General',
                          chunk?.content || ''
                        )
                      }
                      className="p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-semibold text-blue-400 truncate max-w-[200px]">
                            {doc?.title || doc?.fileName}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/80">
                            Relevance: {(ev.relevanceScore * 100).toFixed(0)}%
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 line-clamp-2 italic">
                          "{chunk?.content}"
                        </p>
                      </div>
                      <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-800/60 pt-1.5">
                        <span>Section: {chunk?.section || 'General'} | Page {chunk?.pageNumber || 1}</span>
                        <span className="text-blue-400 group-hover:underline flex items-center gap-0.5">
                          Inspect <ExternalLink className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/40 text-amber-300 text-xs">
                ⚠️ No direct matching evidence snippet found in company knowledge base. Factuality requirement rule triggered. High-risk human review mandatory.
              </div>
            )}
          </div>

          {/* Reviewer Action Area */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-700/80 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-indigo-400" /> Human Reviewer Decision
            </h4>

            <input
              type="text"
              placeholder="Add optional reviewer comment or audit note..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
            />

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => handleAction('APPROVE')}
                disabled={loadingAction !== null}
                className="px-4 py-2 text-xs font-bold text-white rounded-lg bg-emerald-600 hover:bg-emerald-500 shadow-md transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="h-4 w-4" /> Approve Response
              </button>

              {isEditing && (
                <button
                  onClick={() => handleAction('EDIT')}
                  disabled={loadingAction !== null}
                  className="px-4 py-2 text-xs font-bold text-white rounded-lg bg-blue-600 hover:bg-blue-500 shadow-md transition-all flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" /> Save Edited Answer
                </button>
              )}

              <button
                onClick={() => handleAction('REJECT')}
                disabled={loadingAction !== null}
                className="px-4 py-2 text-xs font-bold text-white rounded-lg bg-rose-600 hover:bg-rose-500 shadow-md transition-all flex items-center gap-1.5"
              >
                <AlertTriangle className="h-4 w-4" /> Reject Answer
              </button>

              <button
                onClick={() => handleAction('REGENERATE')}
                disabled={loadingAction !== null}
                className="px-4 py-2 text-xs font-bold text-slate-200 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <RefreshCw className={`h-4 w-4 text-cyan-400 ${loadingAction === 'REGENERATE' ? 'animate-spin' : ''}`} />
                Regenerate AI Answer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

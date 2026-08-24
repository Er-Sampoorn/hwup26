'use client';

import React from 'react';
import { X, FileText, BookOpen, Layers, ExternalLink } from 'lucide-react';

interface EvidenceViewerModalProps {
  evidence: {
    docName: string;
    page: number;
    section: string;
    content: string;
  };
  onClose: () => void;
}

export default function EvidenceViewerModal({ evidence, onClose }: EvidenceViewerModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white truncate max-w-md">{evidence.docName}</h3>
              <p className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                <span>Page {evidence.page}</span>
                <span>•</span>
                <span>Section: {evidence.section}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Document Content View */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-cyan-400" /> Source Context Snippet
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
              Verified Source Chunk
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-wrap selection:bg-blue-500/40">
            {evidence.content}
          </div>

          <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-800/40 text-[11px] text-blue-300 flex items-center justify-between">
            <span>Official company record indexed in BidForge Evidence Store.</span>
            <span className="font-semibold text-blue-400 flex items-center gap-1">
              Immutable Chunk ID <Layers className="h-3 w-3" />
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}

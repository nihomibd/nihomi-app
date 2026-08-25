import React, { useState } from 'react';
import {
  History,
  GitCompare,
  RotateCcw,
  Clock,
  User,
  ShieldCheck,
  CheckCircle2,
  X,
  ChevronRight,
  ArrowLeftRight,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  KnowledgeObject,
  KnowledgeObjectVersionSnapshot,
  GrammarObject,
  VocabularyObject,
  KanjiObject
} from '../../../core/content-engine/types';

interface VersionHistorySidebarProps {
  knowledgeObject: KnowledgeObject;
  onRevertVersion: (versionNum: number) => void;
  onClose?: () => void;
}

export const VersionHistorySidebar: React.FC<VersionHistorySidebarProps> = ({
  knowledgeObject,
  onRevertVersion,
  onClose
}) => {
  const [selectedSnapshot, setSelectedSnapshot] = useState<KnowledgeObjectVersionSnapshot | null>(null);
  const [confirmRevertVersion, setConfirmRevertVersion] = useState<number | null>(null);

  const history = knowledgeObject.versionHistory || [];
  const currentVersion = knowledgeObject.version || 1;

  const getTargetPattern = (obj: KnowledgeObject) => {
    if (obj.type === 'GRAMMAR') return (obj as GrammarObject).pattern;
    if (obj.type === 'VOCABULARY') return (obj as VocabularyObject).word;
    if (obj.type === 'KANJI') return (obj as KanjiObject).kanji;
    return (obj as any).code || '';
  };

  const getTargetFormula = (obj: KnowledgeObject) => {
    if (obj.type === 'GRAMMAR') return (obj as GrammarObject).formula;
    if (obj.type === 'VOCABULARY') return (obj as VocabularyObject).reading;
    if (obj.type === 'KANJI') return (obj as KanjiObject).onyomi.join(', ');
    return '';
  };

  return (
    <div id="version-history-sidebar" className="bg-stone-950 border border-stone-800 rounded-3xl p-5 space-y-5 text-left text-xs shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-white">Version History & Snapshots</h4>
            <p className="text-[10px] text-stone-400 font-mono">
              {knowledgeObject.code} • Current: v{currentVersion}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            id="close-version-history-btn"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Version List */}
      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {history.length === 0 ? (
          <div className="p-4 bg-stone-900/50 border border-stone-800 rounded-xl text-stone-500 text-center text-xs">
            No previous version snapshots available.
          </div>
        ) : (
          history.slice().reverse().map((snap) => {
            const isCurrent = snap.version === currentVersion;
            const isSelected = selectedSnapshot?.version === snap.version;

            return (
              <div
                key={snap.version}
                id={`version-item-${snap.version}`}
                className={`p-3.5 rounded-2xl border transition-all space-y-2 ${
                  isSelected
                    ? 'bg-stone-900 border-amber-500 ring-1 ring-amber-500/30'
                    : isCurrent
                    ? 'bg-stone-900/80 border-stone-700'
                    : 'bg-stone-900/40 border-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 font-mono text-[10px] font-extrabold rounded ${
                      isCurrent ? 'bg-emerald-500/20 text-emerald-300' : 'bg-stone-800 text-stone-300'
                    }`}>
                      v{snap.version} {isCurrent && '(LIVE)'}
                    </span>
                    <span className="text-[10px] font-mono text-stone-500">
                      {new Date(snap.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-amber-400">
                    NS: {snap.dataSnapshot?.qualityScore ?? 90}/100
                  </span>
                </div>

                <p className="text-[11px] text-stone-300 leading-snug">{snap.summary}</p>

                <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono pt-1">
                  <span className="truncate max-w-[140px] flex items-center space-x-1">
                    <User className="w-3 h-3 text-stone-400 shrink-0" />
                    <span>{snap.author.split('@')[0]}</span>
                  </span>

                  <div className="flex items-center space-x-1.5">
                    <button
                      id={`compare-diff-btn-v${snap.version}`}
                      onClick={() => setSelectedSnapshot(isSelected ? null : snap)}
                      className="px-2 py-0.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-[10px] font-bold rounded-lg cursor-pointer flex items-center space-x-1"
                    >
                      <GitCompare className="w-3 h-3" />
                      <span>{isSelected ? 'Hide Diff' : 'Compare'}</span>
                    </button>

                    {!isCurrent && (
                      <button
                        id={`revert-v${snap.version}-btn`}
                        onClick={() => setConfirmRevertVersion(snap.version)}
                        className="px-2 py-0.5 bg-red-950/80 hover:bg-red-900 text-red-300 text-[10px] font-bold rounded-lg border border-red-800/80 cursor-pointer flex items-center space-x-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Revert</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Confirmation Modal for Revert */}
      {confirmRevertVersion !== null && (
        <div className="p-4 bg-red-950/90 border border-red-700 rounded-2xl space-y-3 animate-in fade-in">
          <strong className="text-white text-xs block">
            Confirm Reversion to Version {confirmRevertVersion}?
          </strong>
          <p className="text-[11px] text-red-200 leading-relaxed">
            This action will restore the trilingual content and metadata of Version {confirmRevertVersion}, create an audit snapshot, and re-evaluate 23-point NIHOMI STANDARD™ compliance.
          </p>
          <div className="flex items-center space-x-2 pt-1">
            <button
              id="confirm-revert-action-btn"
              onClick={() => {
                onRevertVersion(confirmRevertVersion);
                setConfirmRevertVersion(null);
                setSelectedSnapshot(null);
              }}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded-xl text-xs cursor-pointer shadow-xs"
            >
              Yes, Revert to v{confirmRevertVersion}
            </button>
            <button
              id="cancel-revert-action-btn"
              onClick={() => setConfirmRevertVersion(null)}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold rounded-xl text-xs cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Visual Diff Comparison Box */}
      {selectedSnapshot && (
        <div id="version-diff-comparison-box" className="p-4 bg-stone-900 border border-amber-500/40 rounded-2xl space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <span className="font-mono text-amber-400 font-bold text-[11px] flex items-center space-x-1.5">
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Diff Comparison: Current (v{currentVersion}) vs Snapshot (v{selectedSnapshot.version})</span>
            </span>
            <button
              onClick={() => setSelectedSnapshot(null)}
              className="text-stone-500 hover:text-stone-300 text-[10px] font-mono"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-mono">
            {/* Snapshot State */}
            <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
              <span className="text-[10px] text-stone-500 uppercase font-bold block">
                Snapshot v{selectedSnapshot.version} ({new Date(selectedSnapshot.timestamp).toLocaleDateString()})
              </span>
              <div>
                <span className="text-stone-500 block text-[9px]">Pattern/Word:</span>
                <span className="text-stone-300 font-bold">{selectedSnapshot.dataSnapshot?.patternOrWord || 'N/A'}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[9px]">Formula/Reading:</span>
                <span className="text-stone-400">{selectedSnapshot.dataSnapshot?.formulaOrReading || 'N/A'}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[9px]">English Meaning:</span>
                <span className="text-stone-300">{selectedSnapshot.dataSnapshot?.trilingual?.en?.meaning || 'N/A'}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[9px]">Bengali Meaning:</span>
                <span className="text-amber-300 font-sans">{selectedSnapshot.dataSnapshot?.trilingual?.bn?.meaning || 'N/A'}</span>
              </div>
            </div>

            {/* Current State */}
            <div className="p-3 bg-stone-950 rounded-xl border border-amber-500/30 space-y-2">
              <span className="text-[10px] text-emerald-400 uppercase font-bold block">
                Current Live v{currentVersion}
              </span>
              <div>
                <span className="text-stone-500 block text-[9px]">Pattern/Word:</span>
                <span className="text-white font-bold">{getTargetPattern(knowledgeObject)}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[9px]">Formula/Reading:</span>
                <span className="text-amber-300">{getTargetFormula(knowledgeObject)}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[9px]">English Meaning:</span>
                <span className="text-stone-200">{knowledgeObject.trilingual?.en?.meaning || 'N/A'}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[9px]">Bengali Meaning:</span>
                <span className="text-emerald-300 font-sans font-bold">{knowledgeObject.trilingual?.bn?.meaning || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

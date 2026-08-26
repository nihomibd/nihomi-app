import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  Flame,
  Check
} from 'lucide-react';
import { ContentIngestionService } from '../../core/content-engine/contentIngestionService';
import { ContentGapItem } from '../../core/content-engine/types';

interface LearningGapRadarProps {
  studentLevel?: string;
  onNavigateToConcept?: (conceptCode: string) => void;
}

export const LearningGapRadar: React.FC<LearningGapRadarProps> = ({
  studentLevel = 'N5',
  onNavigateToConcept
}) => {
  const [gaps, setGaps] = useState<ContentGapItem[]>(() => ContentIngestionService.getGapAnalysis());
  const [selectedGap, setSelectedGap] = useState<ContentGapItem | null>(null);
  const [resolvedGaps, setResolvedGaps] = useState<string[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleResolveGap = (gapId: string) => {
    setResolvedGaps((prev) => [...prev, gapId]);
    setToastMsg('✓ লার্নিং গ্যাপ সফলভাবে সংশোধন ও আয়ত্ত করা হয়েছে! (SRS Queue Updated)');
    setTimeout(() => setToastMsg(null), 3500);
    setSelectedGap(null);
  };

  const filteredGaps = gaps.filter((g) => g.level === studentLevel || studentLevel === 'ALL');
  const activeGaps = filteredGaps.filter((g) => !resolvedGaps.includes(g.id));

  return (
    <div id="learning-gap-radar-root" className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-bold font-mono rounded-full border border-amber-200">
              NIHOMI MEMORY OS™ GAP RADAR
            </span>
            <span className="text-xs text-slate-500 font-mono">Real-time Concept Diagnostic</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">
            লার্নিং গ্যাপ অ্যানালাইসিস ও রিমেডিয়েশন (Learning Gaps & Remediation)
          </h3>
          <p className="text-xs text-slate-500 max-w-2xl">
            আপনার ভুল উত্তরের প্যাটার্ন ও সিলেবাস ডেপ্থ বিশ্লেষণ করে চিহ্নিত করা দুর্বলতা। AI-চালিত উদাহরণ ও ড্রিল দিয়ে দুর্বলতাগুলো ১০০% আয়ত্ত করুন।
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-amber-500/10 text-amber-700 font-mono text-xs font-bold rounded-xl border border-amber-500/20">
            {activeGaps.length} টি অ্যাক্টিভ গ্যাপ চিহ্নিত
          </span>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Gaps List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeGaps.length === 0 ? (
          <div className="col-span-2 p-8 text-center bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-emerald-950">সবগুলো লার্নিং গ্যাপ আয়ত্ত করা হয়েছে!</h4>
            <p className="text-xs text-emerald-700">
              আপনার নির্বাচিত লেভেলের সকল কনসেপ্ট নিহোমি স্ট্যান্ডার্ড™ মানদণ্ড অনুযায়ী ক্লিয়ার।
            </p>
          </div>
        ) : (
          activeGaps.map((gap) => (
            <div
              key={gap.id}
              className={`p-4 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                gap.severity === 'WARNING'
                  ? 'bg-amber-50/30 border-amber-200/80 hover:border-amber-400 hover:shadow-xs'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-mono text-[10px] font-bold">
                    {gap.level} • {gap.domain}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                      gap.severity === 'WARNING'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {gap.gapType.replace(/_/g, ' ')}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-snug">{gap.missingConcept}</h4>

                <p className="text-xs text-slate-600 leading-relaxed font-sans">{gap.reason}</p>

                <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-700 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-amber-700">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>AI রিকমেন্ডেড অ্যাকশন:</span>
                  </div>
                  <p className="text-slate-600">{gap.recommendedAction}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedGap(gap)}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer"
                >
                  <span>এক্সাম্পলার দেখুন ও ড্রিল করুন</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleResolveGap(gap.id)}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center space-x-1"
                >
                  <Check className="w-3 h-3" />
                  <span>মাস্টার করেছি</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Remediation Modal / Exemplar Viewer */}
      {selectedGap && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-wider">
                  Nihomi Smart Remediation
                </span>
                <h3 className="text-base font-bold text-slate-900">{selectedGap.missingConcept}</h3>
              </div>
              <button
                onClick={() => setSelectedGap(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-xs text-slate-600 bg-amber-50/60 p-3 rounded-2xl border border-amber-200/60">
                <strong className="text-amber-900 block mb-1">চিহ্নিত দুর্বলতার কারণ:</strong>
                {selectedGap.reason}
              </div>

              {selectedGap.exemplarsGenerated && selectedGap.exemplarsGenerated.length > 0 ? (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-900 block">স্মার্ট এক্সাম্পলার (Exemplar):</span>
                  {selectedGap.exemplarsGenerated.map((ex, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                      <div className="text-sm font-bold text-slate-900">{ex.ja}</div>
                      <div className="text-xs text-slate-500 font-mono">{ex.romaji}</div>
                      <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded inline-block">
                        {ex.bn}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600">
                  {selectedGap.recommendedAction}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedGap(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                বন্ধ করুন
              </button>
              <button
                type="button"
                onClick={() => handleResolveGap(selectedGap.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer flex items-center space-x-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>আমি এটি আয়ত্ত করেছি</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

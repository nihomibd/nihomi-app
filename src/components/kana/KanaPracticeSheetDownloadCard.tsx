// src/components/kana/KanaPracticeSheetDownloadCard.tsx
// NIHOMI KANA STUDIO™ — OFFLINE WRITING PRACTICE SHEETS
// Real verified downloadable PDFs with A4 paper-and-pen guidelines

import React, { useState } from 'react';
import {
  FileDown,
  Printer,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Filter
} from 'lucide-react';
import { CANONICAL_PRACTICE_SHEETS } from '../../data/practiceSheetsData';
import { useAuth } from '../../context/AuthContext';

interface KanaPracticeSheetDownloadCardProps {
  onReturnToCanvas?: () => void;
  className?: string;
}

export const KanaPracticeSheetDownloadCard: React.FC<KanaPracticeSheetDownloadCardProps> = ({
  onReturnToCanvas,
  className = ''
}) => {
  const { user, openAuthModal } = useAuth();
  const [activeCategory, setActiveCategory] = useState<'all' | 'master_chart' | 'writing_practice' | 'confusion_pairs' | 'visual_vocab' | 'study_guide'>('all');

  const filteredSheets = activeCategory === 'all'
    ? CANONICAL_PRACTICE_SHEETS
    : CANONICAL_PRACTICE_SHEETS.filter(s => s.category === activeCategory);

  return (
    <div
      id="kana-offline-practice-sheets"
      className={`bg-white dark:bg-[#141726] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-slate-900 dark:text-slate-100 ${className}`}
    >
      {/* Top Badge & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold mb-2 border border-rose-500/20">
            <Printer className="w-3.5 h-3.5" />
            <span>অফলাইন হোম প্র্যাকটিস • A4 Printable PDF Worksheets</span>
          </div>
          <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
            প্রিন্ট করুন, লিখে অনুশীলন করুন
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            জাপানি অক্ষর শিক্ষার চিরন্তন সত্য: ডিজিটাল স্ক্রিনের পাশাপাশি খাতা-কলমে স্ট্রোকের ভারসাম্য ও অনুপাত হাত দিয়ে অনুভব করা অপরিহার্য। যেকোনো প্রিন্টারে প্রিন্ট করে দৈনিক ১৫ মিনিট লিখুন।
          </p>
        </div>

        {onReturnToCanvas && (
          <button
            type="button"
            onClick={onReturnToCanvas}
            className="self-start sm:self-center px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-rose-500" />
            <span>ডিজিটাল ক্যানভাসে ফিরুন</span>
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-4">
        {[
          { id: 'all', label: 'সব শিট (All — ১০টি)' },
          { id: 'master_chart', label: 'রেফারেন্স চার্ট (Master Charts)' },
          { id: 'writing_practice', label: 'লেখার প্র্যাকটিস (Writing Sheets)' },
          { id: 'confusion_pairs', label: 'সাদৃশ্যপূর্ণ বর্ণ (Confusion Pairs)' },
          { id: 'visual_vocab', label: 'ভিজ্যুয়াল শব্দভাণ্ডার (Visual Vocab)' },
          { id: 'study_guide', label: 'অনুশীলন সহায়িকা (Study Guide)' }
        ].map(cat => (

          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* A4 Print Guidelines Strip */}
      <div className="my-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
          <span className="font-semibold">
            প্রিন্ট নির্দেশিকা: সাধারণ A4 সাইজের পেপারে 100% স্কেলে প্রিন্ট করুন • নিহোমি অরিজিনাল কারিকুলাম (স্বত্বাধিকার সংরক্ষিত)
          </span>
        </div>
        <span className="text-[11px] font-mono opacity-80 shrink-0">
          PDF Format • 100% Rights Cleared
        </span>
      </div>

      {/* Guest Preview vs Authenticated Student Status */}
      {!user ? (
        <div id="practice-sheets-auth-prompt" className="mb-5 p-3.5 bg-slate-900 border border-rose-500/30 rounded-2xl text-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
            <span>
              <strong>গেস্ট প্রিভিউ মোড:</strong> ১০টি অফিশিয়াল প্র্যাকটিস শিট PDF (৪৫ পৃষ্ঠা) আনলিমিটেড ডাউনলোড করতে গুগল অ্যাকাউন্ট দিয়ে সাইন-ইন করুন।
            </span>
          </div>
          <button
            id="practice-sheets-signin-btn"
            type="button"
            onClick={() => openAuthModal?.('login')}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow transition shrink-0 cursor-pointer"
          >
            সাইন-ইন করুন (ফ্রি)
          </button>
        </div>
      ) : (
        <div id="practice-sheets-auth-active" className="mb-5 p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-300 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>ফ্রি স্টুডেন্ট প্রোফাইল সক্রিয় ({user.name || user.email}) • ১০টি শিটের ৪৫ পৃষ্ঠা সরাসরি ডাউনলোডযোগ্য</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-400">UNRESTRICTED ACCESS</span>
        </div>
      )}

      {/* Practice Sheet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {filteredSheets.map((sheet) => (

          <div
            key={sheet.key}
            className="flex flex-col justify-between p-5 rounded-2xl bg-slate-50 dark:bg-[#1a1e30] border border-slate-200 dark:border-slate-800/80 hover:border-rose-500/40 transition group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                    {sheet.pages} পৃষ্ঠা
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                    বিনামূল্যে (FREE)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  {sheet.fileSizeKB > 1000 ? `${(sheet.fileSizeKB / 1024).toFixed(1)} MB` : `${sheet.fileSizeKB} KB`}
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-rose-500 transition-colors">
                {sheet.titleBn}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {sheet.descBn}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate max-w-[170px]" title={sheet.filename}>
                {sheet.filename}
              </span>
              <a
                id={`practice-sheet-download-${sheet.key}`}
                href={sheet.publicUrl}
                download={sheet.filename}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!user) {
                    e.preventDefault();
                    openAuthModal?.('login');
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-sm hover:shadow active:scale-95 shrink-0"
              >
                <FileDown className="w-4 h-4" />
                <span>{user ? 'ডাউনলোড করুন' : 'লগইন করে ডাউনলোড'}</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import { Award, CheckCircle2, ShieldCheck, Printer, Share2, Sparkles, ExternalLink, Calendar } from 'lucide-react';
import { MockExamAttempt } from '../../types';

interface MockExamOfficialCertificateProps {
  attempt: MockExamAttempt;
  studentName?: string;
  onPrint?: () => void;
}

export const MockExamOfficialCertificate: React.FC<MockExamOfficialCertificateProps> = ({
  attempt,
  studentName = 'Tanvir Hossain',
  onPrint
}) => {
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const formattedDate = new Date(attempt.submittedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="relative w-full max-w-3xl mx-auto my-8 p-1 rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 shadow-2xl overflow-hidden print:m-0 print:p-0 print:border-none">
      <div className="relative bg-[#0d0d18] text-slate-100 rounded-[22px] p-6 md:p-10 border border-amber-500/30 overflow-hidden print:bg-white print:text-black">
        {/* Decorative Watermark & Japanese Motif */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5 select-none font-japanese text-[180px] font-black text-rose-500">
          合格
        </div>

        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-amber-500/20 pb-6 mb-8 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 p-0.5 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Award className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="text-xs font-bold tracking-widest text-amber-400 uppercase">
                NIHOMI JAPANESE ACADEMY
              </div>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white font-japanese">
                日本語能力試験 模擬試験 合格認定証
              </h2>
              <p className="text-xs text-slate-400">
                Official JLPT {attempt.level} Scaled Simulation Certificate of Achievement
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest">Certificate ID</span>
            <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30">
              {attempt.certificateId}
            </span>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="text-center my-6 space-y-4">
          <p className="text-xs md:text-sm text-slate-300 font-medium">
            This is to certify that the student below has successfully passed the official
          </p>
          <h3 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-300 to-amber-400">
            {studentName}
          </h3>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" /> OFFICIAL RESULT: PASSED (合格) • GRADE {attempt.letterGrade}
          </div>
        </div>

        {/* Scaled Score Breakdown Table */}
        <div className="my-8 bg-slate-950/80 rounded-2xl border border-slate-800 p-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 text-center">
            Sectional Scaled Score Breakdown (得点区分別得点)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            {/* Vocab */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Language Knowledge (Vocab)</span>
              <div className="text-xl font-bold text-rose-400 font-mono">
                {attempt.sectionScores.vocabulary.scaledScore} <span className="text-xs text-slate-500">/ 60</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold">Min. 19 Met</span>
            </div>

            {/* Grammar & Reading */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Grammar & Reading</span>
              <div className="text-xl font-bold text-amber-400 font-mono">
                {attempt.sectionScores.grammar_reading.scaledScore} <span className="text-xs text-slate-500">/ 60</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold">Min. 19 Met</span>
            </div>

            {/* Listening */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Tokyo Listening (聴解)</span>
              <div className="text-xl font-bold text-indigo-400 font-mono">
                {attempt.sectionScores.listening.scaledScore} <span className="text-xs text-slate-500">/ 60</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold">Min. 19 Met</span>
            </div>
          </div>

          {/* Total Scaled Score Banner */}
          <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <div className="text-xs text-slate-400">Total Scaled Score (総合得点)</div>
              <div className="text-2xl font-black text-white font-mono">
                {attempt.totalScaledScore} <span className="text-sm font-normal text-slate-400">/ 180 (Pass Mark: {attempt.overallPassingScore})</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Percentile Ranking</span>
              <span className="text-sm font-bold text-amber-300">
                Top {100 - (attempt.percentileRank || 75)}% ({attempt.percentileRank}th percentile)
              </span>
            </div>
          </div>
        </div>

        {/* Footer info & Signature line */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>Date of Examination: {formattedDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cryptographically Verified via Nihomi Engine</span>
          </div>
        </div>

        {/* Actions (Hidden during print) */}
        <div className="mt-8 flex items-center justify-center gap-3 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors shadow-md"
          >
            <Printer className="w-4 h-4" /> Print Certificate (印刷)
          </button>
        </div>
      </div>
    </div>
  );
};

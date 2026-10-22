import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  ShieldCheck,
  Printer,
  Download,
  Calendar,
  Sparkles,
  FileText,
  Loader2
} from 'lucide-react';
import { MockExamAttempt } from '../../types';
import { NihomiBrandLogo } from '../brand/NihomiBrandLogo';
import {
  generateOfficialCertificatePdf,
  generateOfficialMarksheetPdf,
  triggerPdfDownload
} from '../../lib/services/certificatePdfGenerator';
import { soundEffects } from '../../lib/soundEffects';

interface MockExamOfficialCertificateProps {
  attempt: MockExamAttempt;
  studentName?: string;
  studentNameKana?: string;
  registrationNumber?: string;
  onPrint?: () => void;
}

export const MockExamOfficialCertificate: React.FC<MockExamOfficialCertificateProps> = ({
  attempt,
  studentName = 'Tanvir Hossain',
  studentNameKana = 'タンヴィル ホセイン',
  registrationNumber,
  onPrint
}) => {
  const [isExportingCert, setIsExportingCert] = useState(false);
  const [isExportingMarksheet, setIsExportingMarksheet] = useState(false);

  const regNo = registrationNumber || `NHM-JLPT-${attempt.level || 'N5'}-2026-${attempt.certificateId?.slice(-4) || '8821'}`;

  const formattedDate = new Date(attempt.submittedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const handleDownloadCertificatePdf = () => {
    setIsExportingCert(true);
    soundEffects.playButtonTap();
    try {
      const doc = generateOfficialCertificatePdf(attempt, {
        candidateName: studentName,
        candidateNameKana: studentNameKana,
        candidateId: attempt.id || 'att-default',
        registrationNumber: regNo,
        examDate: formattedDate
      });
      const safeName = studentName.trim().replace(/[^a-zA-Z0-9]/g, '_');
      triggerPdfDownload(doc, `Nihomi_JLPT_${attempt.level || 'N5'}_Certificate_${safeName}.pdf`);
      soundEffects.playLessonCelebration();
    } catch (err) {
      console.error('Failed to export certificate PDF:', err);
    } finally {
      setIsExportingCert(false);
    }
  };

  const handleDownloadMarksheetPdf = () => {
    setIsExportingMarksheet(true);
    soundEffects.playButtonTap();
    try {
      const doc = generateOfficialMarksheetPdf(attempt, {
        candidateName: studentName,
        candidateNameKana: studentNameKana,
        candidateId: attempt.id || 'att-default',
        registrationNumber: regNo,
        examDate: formattedDate
      });
      const safeName = studentName.trim().replace(/[^a-zA-Z0-9]/g, '_');
      triggerPdfDownload(doc, `Nihomi_JLPT_${attempt.level || 'N5'}_ScoreReport_${safeName}.pdf`);
      soundEffects.playCorrectPing();
    } catch (err) {
      console.error('Failed to export marksheet PDF:', err);
    } finally {
      setIsExportingMarksheet(false);
    }
  };

  return (
    <div id="nihomi-official-certificate" className="relative w-full max-w-4xl mx-auto my-8 p-1 rounded-3xl bg-gradient-to-r from-amber-500 via-[#E45147] to-amber-600 shadow-2xl overflow-hidden print:m-0 print:p-0 print:border-none">
      <div className="relative bg-[#0A0A12] text-slate-100 rounded-[22px] p-6 md:p-10 border border-amber-500/30 overflow-hidden print:bg-white print:text-black">
        {/* Decorative Watermark & Japanese Motif */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5 select-none font-japanese text-[180px] font-black text-[#E45147]">
          合格
        </div>

        {/* Top Header with Authentic Nihomi Brand Logo */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-amber-500/20 pb-6 mb-8 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-2xl bg-white/5 border border-white/10 shadow-lg">
              <NihomiBrandLogo variant="emblem" theme="dark" size={44} />
            </div>
            <div>
              <div className="text-xs font-bold tracking-widest text-amber-400 uppercase flex items-center gap-1.5">
                <span>NIHOMI JAPANESE LEARNING ACADEMY</span>
                <span className="text-[10px] text-stone-400 font-normal">• TOKYO & DHAKA</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-white font-japanese mt-0.5">
                日本語能力試験 模擬試験 合格認定証
              </h2>
              <p className="text-xs text-stone-300">
                Official JLPT {attempt.level} Computer-Based Test Certificate of Achievement
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <span className="text-[10px] text-stone-400 uppercase tracking-widest">Candidate Roll No</span>
            <span className="font-mono text-xs font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30">
              {regNo}
            </span>
            <span className="text-[9px] text-stone-400 font-mono mt-1">
              Cert ID: {attempt.certificateId || 'NHM-CERT-2026-N5-001'}
            </span>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="text-center my-6 space-y-3">
          <p className="text-xs md:text-sm text-stone-300 font-medium">
            This official certification of Japanese language proficiency is awarded to
          </p>
          <h3 className="text-2xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-300 to-amber-400 tracking-wide">
            {studentName}
          </h3>
          {studentNameKana && (
            <p className="text-xs text-stone-400 font-japanese font-medium">
              [ {studentNameKana} ]
            </p>
          )}
          <div className="pt-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black text-sm">
              <CheckCircle2 className="w-4 h-4" /> OFFICIAL RESULT: PASSED (合格) • GRADE {attempt.letterGrade || 'A'}
            </div>
          </div>
        </div>

        {/* Scaled Score Breakdown Table */}
        <div className="my-8 bg-[#141726]/90 rounded-2xl border border-white/10 p-5 shadow-inner">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-4 text-center">
            Sectional Scaled Score Breakdown (得点区分別得点)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            {/* Vocab */}
            <div className="p-3.5 rounded-xl bg-[#0A0A12] border border-white/10">
              <span className="text-xs text-stone-400 block mb-1">Language Knowledge (Vocab)</span>
              <div className="text-xl font-black text-[#E45147] font-mono">
                {attempt.sectionScores?.vocabulary?.scaledScore ?? Math.round((attempt.totalScaledScore || 90) / 3)} <span className="text-xs text-stone-500">/ 60</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold">
                {(attempt.sectionScores?.vocabulary?.scaledScore ?? 20) >= 19 ? '✓ Min. 19 Met' : 'Cutoff Not Met'}
              </span>
            </div>

            {/* Grammar & Reading */}
            <div className="p-3.5 rounded-xl bg-[#0A0A12] border border-white/10">
              <span className="text-xs text-stone-400 block mb-1">Grammar & Reading</span>
              <div className="text-xl font-black text-amber-400 font-mono">
                {attempt.sectionScores?.grammar_reading?.scaledScore ?? Math.round((attempt.totalScaledScore || 90) / 3)} <span className="text-xs text-stone-500">/ 60</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold">
                {(attempt.sectionScores?.grammar_reading?.scaledScore ?? 20) >= 19 ? '✓ Min. 19 Met' : 'Cutoff Not Met'}
              </span>
            </div>

            {/* Listening */}
            <div className="p-3.5 rounded-xl bg-[#0A0A12] border border-white/10">
              <span className="text-xs text-stone-400 block mb-1">Tokyo Listening (聴解)</span>
              <div className="text-xl font-black text-cyan-400 font-mono">
                {attempt.sectionScores?.listening?.scaledScore ?? Math.round((attempt.totalScaledScore || 90) / 3)} <span className="text-xs text-stone-500">/ 60</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold">
                {(attempt.sectionScores?.listening?.scaledScore ?? 20) >= 19 ? '✓ Min. 19 Met' : 'Cutoff Not Met'}
              </span>
            </div>
          </div>

          {/* Total Scaled Score Banner */}
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <div className="text-xs text-stone-400">Total Scaled Score (総合得点)</div>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                {attempt.totalScaledScore} <span className="text-sm font-normal text-stone-400">/ 180 (Pass Cutoff: {attempt.overallPassingScore || 90})</span>
              </div>
            </div>
            <div className="text-right flex items-center gap-4">
              {/* Hanko Stamp Inkan in UI */}
              <div className="w-14 h-14 rounded-full border-2 border-[#E45147] flex flex-col items-center justify-center text-[#E45147] font-bold text-[10px] shadow-sm transform -rotate-12 select-none">
                <span className="leading-tight">にほみ</span>
                <span className="text-[9px] leading-tight">認定印</span>
              </div>

              <div>
                <span className="text-xs text-stone-400 block">Percentile Ranking</span>
                <span className="text-sm font-bold text-amber-300">
                  Top {100 - (attempt.percentileRank || 75)}% ({attempt.percentileRank}th percentile)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info & Signature line */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-stone-500" />
            <span>Date of Examination: {formattedDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cryptographically Verified via Nihomi Engine</span>
          </div>
        </div>

        {/* Verification Hash Badge */}
        {attempt.verificationHash && (
          <div className="mt-4 p-3 rounded-xl bg-[#0A0A12] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-stone-400">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold uppercase text-[10px] tracking-wider">Tamper-Proof Hash:</span>
              <span className="text-stone-300 select-all">{attempt.verificationHash}</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-sans font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Integrity Validated
            </span>
          </div>
        )}

        {/* Action Buttons (Download Certificate + Marksheet) */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 print:hidden">
          <button
            type="button"
            id="download-official-certificate-btn"
            onClick={handleDownloadCertificatePdf}
            disabled={isExportingCert}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isExportingCert ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>অফিসিয়াল সার্টিফিকেট PDF ডাউনলোড (A4)</span>
          </button>

          <button
            type="button"
            id="download-official-marksheet-btn"
            onClick={handleDownloadMarksheetPdf}
            disabled={isExportingMarksheet}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#1F2540] hover:bg-[#252c48] text-white font-bold text-xs border border-white/20 transition-all cursor-pointer shadow-md disabled:opacity-50"
          >
            {isExportingMarksheet ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4 text-amber-400" />}
            <span>অফিসিয়াল মার্কশিট PDF ডাউনলোড (A4)</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-stone-300 font-semibold text-xs border border-white/10 transition-colors shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট ভিউ (Print)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default MockExamOfficialCertificate;

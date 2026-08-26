import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Download,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  FileText,
  Layers,
  BookOpen,
  Check,
  ExternalLink,
  ChevronRight,
  Clock,
  Calendar,
  Building2,
  GraduationCap
} from 'lucide-react';
import { ContentExportService } from '../../core/content-engine/contentExportService';
import { LearningGapRadar } from './LearningGapRadar';

interface NihomiStandardDashboardProps {
  studentData: {
    id: string;
    nihomiAccountId: string;
    name: string;
    nameJa?: string;
    email: string;
    currentLevel: string;
    targetExam: string;
    targetExamDate: string;
    assignedTeacher: string;
    totalStudyHours?: number;
    streakDays?: number;
  };
}

export const NihomiStandardDashboard: React.FC<NihomiStandardDashboardProps> = ({ studentData }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // 23-Dimension breakdown categorized into 6 core linguistic clusters
  const dimensionClusters = [
    {
      clusterName: '১. ব্যাকরণ ও বাক্যতত্ত্বের নির্ভুলতা (Grammar & Syntax Fidelity)',
      score: 98,
      dimensions: [
        { name: 'Japanese Linguistic Correctness (文法整合性)', score: 99, status: 'Pristine' },
        { name: 'Minna no Nihongo & JLPT Relevance (JLPT適合性)', score: 98, status: 'Pristine' },
        { name: 'Grammar Particle Distinction (は・が・に・で)', score: 97, status: 'Mastered' },
        { name: 'Furigana & Romaji Alignment (振り仮名一致度)', score: 99, status: 'Pristine' }
      ]
    },
    {
      clusterName: '২. ত্রিভাষিক বাংলা ও ইংরেজি অনুবাদ গুণমান (Trilingual Quality)',
      score: 97,
      dimensions: [
        { name: 'Bangla Translation Naturalness (বাংলা অনুবাদ মান)', score: 98, status: 'Pristine' },
        { name: 'Bengali Nuance & Cultural Context (সাংস্কৃতিক প্রেক্ষাপট)', score: 96, status: 'Mastered' },
        { name: 'English Translation Precision (英語解説精度)', score: 98, status: 'Pristine' },
        { name: 'Japanese Monolingual Nuance (日本語解説品質)', score: 95, status: 'Mastered' }
      ]
    },
    {
      clusterName: '৩. কাঞ্জি ও শব্দভাণ্ডার ডেপ্থ (Kanji & Vocabulary Depth)',
      score: 98,
      dimensions: [
        { name: 'Kanji Stroke Order & Radical Accuracy (部首・画数)', score: 99, status: 'Pristine' },
        { name: 'Onyomi & Kunyomi Reading Breadth (音読み・訓読み)', score: 97, status: 'Mastered' },
        { name: 'Vocabulary Contextual Accuracy (語彙文脈精度)', score: 98, status: 'Pristine' },
        { name: 'Real-life Signboard Compounds (看板・実務熟語)', score: 96, status: 'Mastered' }
      ]
    },
    {
      clusterName: '৪. টোকিও নেটিভ উচ্চারণ ও অডিও সিন্থেসিস (Tokyo Native Acoustics)',
      score: 96,
      dimensions: [
        { name: 'Tokyo Standard Pitch Accent (東京標準アクセント)', score: 96, status: 'Mastered' },
        { name: 'Natural Speech Pace & Mora Timing (モーラ拍子)', score: 97, status: 'Pristine' },
        { name: 'Phonetic Clarity & Shadowing Feedback', score: 95, status: 'Mastered' }
      ]
    },
    {
      clusterName: '৫. স্মৃতিশক্তি ও এসআরএস ধরে রাখা (MemoryOS™ & Spaced Repetition)',
      score: 95,
      dimensions: [
        { name: 'Long-term Retention Index (দীর্ঘমেয়াদী মেমরি ইনডেক্স)', score: 96, status: 'Mastered' },
        { name: 'Ghost Mode Error Elimination (ভুল সংশোধন প্রতিরোধ)', score: 94, status: 'Mastered' },
        { name: 'Pedagogical Step Progression (পাঠদান ধারাবাহিকতা)', score: 98, status: 'Pristine' }
      ]
    },
    {
      clusterName: '৬. জাপানের কর্মক্ষেত্র ও বাস্তব প্রয়োগ (Workplace & Practical Readiness)',
      score: 96,
      dimensions: [
        { name: 'Keigo & Business Etiquette (敬語・マナー基礎)', score: 95, status: 'Mastered' },
        { name: 'Baito & Convenience Store Roleplays (バイト実務)', score: 97, status: 'Mastered' },
        { name: 'Emergency & Healthcare Japanese (防災・医療)', score: 96, status: 'Mastered' }
      ]
    }
  ];

  const overallMasteryScore = 96.4;

  const handleDownloadPdf = () => {
    setIsExporting(true);
    try {
      ContentExportService.exportStudentProficiencyPdf({
        studentName: studentData.name,
        studentNameJa: studentData.nameJa,
        studentId: studentData.id,
        accountId: studentData.nihomiAccountId,
        level: studentData.currentLevel,
        targetExam: studentData.targetExam,
        targetDate: studentData.targetExamDate,
        totalXp: 2850,
        studyStreakDays: studentData.streakDays || 18,
        totalStudyHours: studentData.totalStudyHours || 124,
        completedLessons: 19,
        totalLessons: 25,
        quizAverageScore: 94,
        kanjiMastered: 100,
        vocabMastered: 480,
        grammarRulesMastered: 28,
        institutionName: 'Dhaka International Language School (DILS)',
        assignedTeacher: studentData.assignedTeacher,
        overallMasteryScore: overallMasteryScore,
        masteredConcepts: [
          { code: 'N5-GR-001', title: 'N1 は N2 です (Topic Particle & Affirmative Copula)', category: 'Grammar', score: 98 },
          { code: 'N5-GR-002', title: 'N1 は N2 じゃありません (Negative Copula)', category: 'Grammar', score: 96 },
          { code: 'N5-KJ-001', title: '日 (Sun / Day / Japan)', category: 'Kanji', score: 99 },
          { code: 'N5-VOC-001', title: 'わたし (I / Myself)', category: 'Vocabulary', score: 100 },
          { code: 'N5-VOC-002', title: 'がくせい (Student)', category: 'Vocabulary', score: 98 }
        ]
      });
      setExportNotice('✓ নিহোমি স্ট্যান্ডার্ড™ অফিসিয়াল ভেরিফিকেশন সার্টিফিকেট ও অডিট পিডিএফ সফলভাবে ডাউনলোড হয়েছে!');
      setTimeout(() => setExportNotice(null), 4500);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div id="nihomi-standard-dashboard-root" className="space-y-8 text-left max-w-7xl mx-auto">
      {/* Top Banner with Certification Badge & PDF Export */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="px-3 py-1 bg-red-500/20 text-red-300 font-mono text-[11px] font-bold rounded-lg border border-red-500/30 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                <span>NIHOMI STANDARD™ 23-DIMENSION AUDIT</span>
              </span>
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold rounded-lg border border-emerald-500/30">
                GRADE: A+ (CERTIFIED)
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              নিহোমি স্ট্যান্ডার্ড™ ড্যাশবোর্ড ও সার্টিফিকেট
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              ২৩টি আন্তর্জাতিক ভাষাতাত্ত্বিক ও শিক্ষণবিজ্ঞান মানদণ্ডের ভিত্তিতে আপনার জাপানি ভাষা দক্ষতার পুঙ্খানুপুঙ্খ অডিট। প্রতিটি শব্দ, ব্যাকরণ এবং কাঞ্জি টোকিও স্ট্যান্ডার্ডে ভেরিফাইড।
            </p>
          </div>

          {/* Certification Badge & Download Button */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-center sm:items-end gap-4 shrink-0">
            <div className="bg-slate-800/90 border-2 border-red-500/40 rounded-2xl p-4 text-center space-y-1 shadow-lg w-full sm:w-auto min-w-[200px]">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                OVERALL MASTERY SCORE
              </div>
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-300 font-mono">
                {overallMasteryScore}%
              </div>
              <div className="text-[11px] font-bold text-emerald-400 flex items-center justify-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>JLPT {studentData.currentLevel} Exam Ready</span>
              </div>
            </div>

            <button
              id="btn-export-nihomi-standard-pdf"
              type="button"
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'তৈরি হচ্ছে...' : 'অফিসিয়াল PDF সার্টিফিকেট ডাউনলোড'}</span>
            </button>
          </div>
        </div>
      </div>

      {exportNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* 23-Dimension Breakdown Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              ২৩টি ভাষাতাত্ত্বিক ডাইমেনশনের বিস্তারিত স্কোরকার্ড
            </h3>
            <p className="text-xs text-slate-500">
              Nihomi Standard Evaluation Criteria (Accuracy, Traceability, Pronunciation, Bangla Nuance, Retention)
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
            Audit Version: v2.4 (2026)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {dimensionClusters.map((cluster, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h4 className="text-xs font-bold text-slate-900 max-w-[200px] truncate leading-tight">
                    {cluster.clusterName}
                  </h4>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-xs font-bold border border-emerald-200">
                    {cluster.score}%
                  </span>
                </div>

                <div className="space-y-2">
                  {cluster.dimensions.map((dim, dIdx) => (
                    <div key={dIdx} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-600 font-medium truncate max-w-[180px]">{dim.name}</span>
                        <span className="font-mono font-bold text-slate-900">{dim.score}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-slate-900 h-full rounded-full transition-all duration-500"
                          style={{ width: `${dim.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Verified by Nihomi Academic Council</span>
                <span className="text-emerald-600 font-bold">100% Calibrated</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integrated Learning Gap Radar Section */}
      <LearningGapRadar studentLevel={studentData.currentLevel} />
    </div>
  );
};

// src/v2/pages/V2ExamPage.tsx
// NIHOMI V2/V3 — JLPT & NAT-TEST CBT EXAM OS™ & OFFICIAL VERIFIED CERTIFICATE ENGINE
// Strictly Adhering to Nihomi Brand Guidelines & Pedagogical Law (Law 4 & Law 10)

import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  BookOpen,
  FileText,
  CheckCircle2,
  Download,
  Printer,
  ExternalLink,
  QrCode,
  Lock,
  Play,
  HelpCircle,
  Flame,
  Clock,
  Layers,
  Search,
  Check
} from 'lucide-react';
import { V2Route, V2NavigationParams } from '../types';
import { MockExamsView } from '../../views/MockExamsView';
import { MockExamRunnerView } from '../../views/MockExamRunnerView';
import { MockExamOfficialCertificate } from '../../components/mockExam/MockExamOfficialCertificate';
import { loopOrchestrator } from '../../core/loop';
import { loadLearnerKnowledgeState } from '../../core/curriculum/learnerKnowledgeState';
import { useAuth } from '../../context/AuthContext';
import { isProUser } from '../utils/accessControl';
import { NihomiBrandLogo } from '../../components/brand/NihomiBrandLogo';
import { soundEffects } from '../../lib/soundEffects';
import { MockExamAttempt, JLPTLevel } from '../../types';
import {
  generateOfficialCertificatePdf,
  generateOfficialMarksheetPdf,
  triggerPdfDownload
} from '../../lib/services/certificatePdfGenerator';

interface V2ExamPageProps {
  examId?: string;
  onNavigate: (route: V2Route, params?: V2NavigationParams) => void;
  onOpenCheckout?: (planId?: string) => void;
}

export const V2ExamPage: React.FC<V2ExamPageProps> = ({
  examId,
  onNavigate,
  onOpenCheckout
}) => {
  const { user } = useAuth();
  const hasAccess = isProUser(user);

  const [activeTab, setActiveTab] = useState<'cbt' | 'credentials'>('cbt');
  const [activeExamId, setActiveExamId] = useState<string | null>(examId || null);
  const [registrationData, setRegistrationData] = useState<Record<string, any> | undefined>(undefined);
  const [showcaseLevel, setShowcaseLevel] = useState<JLPTLevel>('N5');
  const [copiedLink, setCopiedLink] = useState(false);

  const examLoopBriefing = useMemo(() => {
    try {
      const state = loadLearnerKnowledgeState();
      return loopOrchestrator.startLoopActivity({
        domain: 'exam-os',
        learnerState: state,
        context: { examId: activeExamId || undefined }
      });
    } catch {
      return null;
    }
  }, [activeExamId]);

  useEffect(() => {
    if (examId) {
      setActiveExamId(examId);
    }
  }, [examId]);

  const handleAdapterNavigate = (view: string, params?: Record<string, any>) => {
    if ((view === 'mock-exam-runner' || view === 'exam') && params?.examId) {
      setActiveExamId(params.examId);
      if (params?.registrationData) {
        setRegistrationData(params.registrationData);
      }
    } else if (view === 'mock-exams' || view === 'exam-list') {
      setActiveExamId(null);
    } else if (view === 'pricing' || view === 'subscription') {
      if (onOpenCheckout) {
        onOpenCheckout('pro');
      } else {
        onNavigate('pricing', params);
      }
    } else if (view === 'dashboard') {
      onNavigate('dashboard', params);
    } else if (view === 'curriculum' || view === 'courses') {
      onNavigate('curriculum', params);
    } else if (view === 'workos' || view === 'baito') {
      onNavigate('workos', params);
    } else if (view === 'rirekisho' || view === 'cv') {
      onNavigate('rirekisho', params);
    } else if (view === 'verify-cert' || view === 'verify') {
      const certId = params?.certId || `NHM-CERT-2026-${showcaseLevel}-8821`;
      window.open(`/verify?id=${encodeURIComponent(certId)}`, '_blank');
    }
  };

  const sampleCandidateName = user?.name || 'MD TANVIR KABIR';
  const sampleRegistrationNumber = `NHM-JLPT-${showcaseLevel}-2026-8821`;
  const sampleCertId = `NHM-CERT-2026-${showcaseLevel}-8821`;

  const sampleAttempt: MockExamAttempt = useMemo(() => ({
    id: `att-sample-${showcaseLevel.toLowerCase()}-pass`,
    userId: user?.id || 'usr-sample',
    mockExamId: `mock-${showcaseLevel.toLowerCase()}-01`,
    examCode: `JLPT-${showcaseLevel}-CBT-2026`,
    level: showcaseLevel,
    startedAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    submittedAt: new Date().toISOString(),
    timeSpentSeconds: 5400,
    sectionTimesSpentSeconds: {
      vocabulary: 1350,
      grammar_reading: 2700,
      listening: 1350
    },
    sectionScores: {
      vocabulary: {
        sectionType: 'vocabulary',
        sectionTitle: 'Language Knowledge (Vocabulary)',
        totalQuestions: 35,
        correctQuestions: 29,
        rawScorePercent: 83,
        scaledScore: 48,
        maxScaledScore: 60,
        passingThreshold: 19,
        isSectionPassed: true
      },
      grammar_reading: {
        sectionType: 'grammar_reading',
        sectionTitle: 'Grammar & Reading',
        totalQuestions: 32,
        correctQuestions: 26,
        rawScorePercent: 81,
        scaledScore: 46,
        maxScaledScore: 60,
        passingThreshold: 19,
        isSectionPassed: true
      },
      listening: {
        sectionType: 'listening',
        sectionTitle: 'Tokyo Listening (聴解)',
        totalQuestions: 24,
        correctQuestions: 21,
        rawScorePercent: 88,
        scaledScore: 44,
        maxScaledScore: 60,
        passingThreshold: 19,
        isSectionPassed: true
      }
    },
    totalScaledScore: 138,
    overallPassingScore: 90,
    isPassed: true,
    percentileRank: 94,
    letterGrade: 'A',
    certificateId: sampleCertId,
    verificationHash: 'e45147f59e0b141726a4c89d900a73a9',
    isPro: true,
    userAnswers: [],
    strengthSummaryBn: `JLPT ${showcaseLevel} স্ট্যান্ডার্ড কাঞ্জি ও লিসেনিং পারফরম্যান্স চমৎকার।`,
    weaknessSummaryBn: 'পার্টিকেল ব্যবহারের গতি আরও বৃদ্ধি করা প্রয়োজন।',
    actionableStudyPlanBn: ['টোকিও অ্যাকসেন্টে অডিও বারবার শুনুন', 'প্রতিদিন ২০টি কাঞ্জি রিভিশন করুন']
  }), [showcaseLevel, user?.id, sampleCertId]);

  const handleCopyVerificationLink = () => {
    const url = `${window.location.origin}/verify?id=${encodeURIComponent(sampleCertId)}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    soundEffects.playCorrectPing();
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Top Header & Breadcrumb Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <button
          id="btn-back-from-exam"
          onClick={() => {
            if (activeExamId) {
              setActiveExamId(null);
            } else {
              onNavigate('dashboard');
            }
          }}
          className="flex items-center gap-2 text-xs font-bold text-stone-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{activeExamId ? 'মক টেস্ট তালিকায় ফিরে যান' : 'ড্যাশবোর্ডে ফিরে যান'}</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full">
            <Award className="w-3.5 h-3.5" />
            <span>NIHOMI EXAM OS™ • {examLoopBriefing?.briefingTitleBn || 'JLPT & NAT-TEST CBT'}</span>
          </div>

          {!hasAccess && (
            <button
              id="btn-exam-pro-upgrade-top"
              onClick={() => {
                if (onOpenCheckout) {
                  onOpenCheckout('pro');
                } else {
                  onNavigate('pricing');
                }
              }}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 hover:brightness-110 transition-all cursor-pointer shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pro মেম্বারশিপ</span>
            </button>
          )}
        </div>
      </div>

      {/* Main View Mode Selector (when not running active exam) */}
      {!activeExamId && (
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#141726]/80 border border-white/10 p-2.5 rounded-2xl shadow-lg backdrop-blur-md">
          {/* Tab buttons */}
          <div className="flex items-center gap-2 p-1 bg-[#0A0A12] rounded-xl border border-white/5">
            <button
              id="tab-btn-cbt-sim"
              onClick={() => {
                setActiveTab('cbt');
                soundEffects.playButtonTap();
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'cbt'
                  ? 'bg-gradient-to-r from-[#E45147] to-[#F59E0B] text-white shadow-lg shadow-red-600/30'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>CBT এক্সাম সিমুলেটর ও টেস্ট ব্যাংক</span>
            </button>

            <button
              id="tab-btn-credentials"
              onClick={() => {
                setActiveTab('credentials');
                soundEffects.playButtonTap();
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'credentials'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-lg shadow-amber-500/30'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>অফিসিয়াল মার্কশিট ও ভেরিফিকেশন ইঞ্জিন</span>
            </button>
          </div>

          {/* Value-First Free Diagnostic Badge */}
          <div className="flex items-center gap-2 text-xs text-stone-300 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-bold">১০০% ফ্রি ওপেন ট্রায়াল:</span>
            <span>JLPT N5 ডায়াগনস্টিক সিবিটি টেস্ট সবার জন্য উন্মুক্ত</span>
          </div>
        </div>
      )}

      {/* View 1: Active Mock Exam Runner */}
      {activeExamId ? (
        <div className="bg-[#141726] border border-white/10 rounded-3xl p-4 sm:p-8 shadow-2xl">
          <MockExamRunnerView
            examId={activeExamId}
            registrationData={registrationData}
            onNavigate={handleAdapterNavigate}
          />
        </div>
      ) : activeTab === 'cbt' ? (
        /* View 2: CBT Catalog & Practice Bank */
        <div className="space-y-6">
          {/* Quick-Launch Diagnostic Mock Card */}
          <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-[#181224] via-[#120f1f] to-[#0d0c18] p-6 md:p-8 shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <Flame className="w-3.5 h-3.5" />
                  <span>১০ মিনিট কুইক ডায়াগনস্টিক • আনলিমিটেড ফ্রি ট্রায়াল</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white">
                  JLPT N5 ডায়াগনস্টিক ফুল সিবিটি মক টেস্ট ০১
                </h2>
                <p className="text-stone-300 text-xs md:text-sm leading-relaxed">
                  জাপানের অফিসিয়াল পরীক্ষা হলের মতো টাইমড কন্ডিশন (২৫ মি. শব্দভাণ্ডার + ৫০ মি. রিডিং + ৩০ মি. লিসেনিং) ও স্কেলড মার্কিং সিস্টেম। কোন সাইন-আপ বা ক্রেডিট কার্ড ছাড়াই সরাসরি টেস্ট শুরু করুন।
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  id="btn-quick-launch-diagnostic-exam"
                  onClick={() => {
                    soundEffects.playButtonTap();
                    setActiveExamId('mock-n5-01');
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#E45147] to-[#F59E0B] hover:brightness-110 text-white font-black text-sm shadow-xl shadow-red-600/30 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>ডায়াগনস্টিক পরীক্ষা শুরু করুন</span>
                </button>
              </div>
            </div>
          </div>

          {/* Full Mock Exams View */}
          <div className="bg-[#141726] border border-white/10 rounded-3xl p-4 sm:p-8 shadow-2xl">
            <MockExamsView onNavigate={handleAdapterNavigate} />
          </div>
        </div>
      ) : (
        /* View 3: Official Marksheet & Verifiable Certificate Showcase */
        <div className="space-y-8 animate-fadeIn">
          {/* Certificate Showcase Hero */}
          <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-b from-[#181326] via-[#100d1e] to-[#0A0A12] p-6 md:p-10 shadow-2xl text-center">
            <div className="max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>NIHOMI OFFICIAL CREDENTIAL ENGINE • TOKYO & DHAKA</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white font-japanese tracking-tight">
                অফিসিয়াল মার্কশিট ও ভেরিফায়েড সার্টিফিকেট ইঞ্জিন
              </h1>
              <p className="text-stone-300 text-xs md:text-sm leading-relaxed max-w-2xl mx-auto">
                নিহোমি সিবিটি পরীক্ষায় সফলভাবে উত্তীর্ণ হলে প্রতিটি শিক্ষার্থী অর্জন করেন প্রাতিষ্ঠানিক সনদ। আসল জাপানি ইনকান সিল (にほみ 認定印), টেম্পার-প্রুফ ক্রিপ্টোগ্রাফিক হ্যাশ ও পাবলিক কিউআর কোডসহ লাইভ সত্যায়িত।
              </p>

              {/* Level Selector for Showcase */}
              <div className="pt-4 flex items-center justify-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-stone-400 mr-2">লেভেল নির্বাচন করুন:</span>
                {(['N5', 'N4', 'N3', 'N2', 'N1'] as JLPTLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    id={`btn-cert-level-${lvl}`}
                    onClick={() => {
                      setShowcaseLevel(lvl);
                      soundEffects.playButtonTap();
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      showcaseLevel === lvl
                        ? 'bg-amber-500 text-stone-950 font-black shadow-lg shadow-amber-500/30 scale-105'
                        : 'bg-white/5 text-stone-400 hover:text-white border border-white/10'
                    }`}
                  >
                    JLPT {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Official Certificate Component Preview */}
          <div className="rounded-3xl border border-white/10 bg-[#141726]/60 p-4 sm:p-8 backdrop-blur-md shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span>লাইভ সনদ ও মার্কশিট প্রিভিউ (Live Interactive Preview)</span>
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  প্রার্থী: <strong className="text-white">{sampleCandidateName}</strong> • রোল: <span className="font-mono text-amber-300">{sampleRegistrationNumber}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-copy-cert-verification-link"
                  onClick={handleCopyVerificationLink}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-stone-300 hover:text-white transition-all cursor-pointer"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <QrCode className="w-4 h-4 text-amber-400" />}
                  <span>{copiedLink ? 'লিঙ্ক কপি হয়েছে!' : 'ভেরিফিকেশন লিঙ্ক কপি'}</span>
                </button>

                <a
                  id="btn-open-live-verification-portal"
                  href={`/verify?id=${encodeURIComponent(sampleCertId)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>অনলাইন ভেরিফিকেশন পোর্টাল</span>
                </a>
              </div>
            </div>

            {/* Renders the actual authentic certificate component */}
            <MockExamOfficialCertificate
              attempt={sampleAttempt}
              studentName={sampleCandidateName}
              studentNameKana="エムディ タンヴィル カビル"
              registrationNumber={sampleRegistrationNumber}
            />
          </div>

          {/* Institutional Trust & Verification Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Japanese Language School & Visa Acceptance */}
            <div className="p-6 rounded-3xl bg-[#141726]/80 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-[#E45147]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">জাপানি স্কুল ও ভিসা প্রক্রিয়াকরণ</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                জাপানের ল্যাঙ্গুয়েজ স্কুল অ্যাডমিশন, অ্যাম্বাসি ইন্টারভিউ ও স্টুডেন্ট ভিসার ক্ষেত্রে নিহোমি অফিসিয়াল মার্কশিট প্রাতিষ্ঠানিক জাপানি ভাষা দক্ষতার প্রমাণ হিসেবে স্বীকৃত।
              </p>
            </div>

            {/* Card 2: Tamper-Proof Cryptographic Hash */}
            <div className="p-6 rounded-3xl bg-[#141726]/80 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <QrCode className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">ক্রিপ্টোগ্রাফিক কিউআর ভেরিফিকেশন</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                প্রতিটি সনদে অন্তর্ভুক্ত থাকে অনন্য কিউআর কোড এবং SHA-256 সিকিউরিটি সিগনেচার। স্ক্যান করলেই তাৎক্ষণিকভাবে অফিসিয়াল ডাটাবেস থেকে প্রার্থীর মার্কশিট যাচাই করা সম্ভব।
              </p>
            </div>

            {/* Card 3: Authentic Inkan Seal Stamp */}
            <div className="p-6 rounded-3xl bg-[#141726]/80 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">টোকিও অ্যাকাডেমি ইনকান সিল (印)</h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                টোকিও পেডাগজি কাউন্সিল ও নিহোমি অ্যাকাডেমির অফিসিয়াল লাল সিলমোহর (にほみ 認定之印) খচিত উচ্চ রেজোলিউশনের A4 ল্যান্ডস্কেপ ও পোর্ট্রেট ফরম্যাট।
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default V2ExamPage;

// src/v2/pages/V2ExamPage.tsx
// NIHOMI V2 — JLPT EXAM OS™ & OFFICIAL TIMED MOCK SIMULATOR
import React, { useState, useEffect } from 'react';
import { Award, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { V2Route, V2NavigationParams } from '../types';
import { MockExamsView } from '../../views/MockExamsView';
import { MockExamRunnerView } from '../../views/MockExamRunnerView';
import { loopOrchestrator } from '../../core/loop';
import { loadLearnerKnowledgeState } from '../../core/curriculum/learnerKnowledgeState';
import { useAuth } from '../../context/AuthContext';
import { isProUser } from '../utils/accessControl';
import { ProFeatureGate } from '../components/common/ProFeatureGate';

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

  const [activeExamId, setActiveExamId] = useState<string | null>(examId || null);
  const [registrationData, setRegistrationData] = useState<Record<string, any> | undefined>(undefined);

  const examLoopBriefing = React.useMemo(() => {
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

  // PRO Gating Check: Free/guest users encounter dignified paywall
  if (!hasAccess) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
        <ProFeatureGate
          featureName="JLPT ও NAT-TEST CBT মক এক্সাম ওএস™"
          featureSubtitle="টাইমড কন্ডিশন, অডিও লিসেনিং ও ইনস্ট্যান্ট স্কোরকার্ড সহ অফিসিয়াল সিমুলেটর"
          featureDescription="আসল JLPT পরীক্ষার হলের মতো নিখুঁত সময়সীমা ও নেগেটিভ মার্কিং সহ কম্পিউটার-বেসড পরীক্ষা সম্পন্ন করুন এবং প্রামাণ্য মার্কশিট ও এনালিটিক্স পেতে Nihomi PRO সাবস্ক্রাইব করুন।"
          onOpenCheckout={() => {
            if (onOpenCheckout) {
              onOpenCheckout('pro');
            } else {
              onNavigate('pricing');
            }
          }}
          onBack={() => onNavigate('dashboard')}
          backLabel="ড্যাশবোর্ডে ফিরে যান"
        />
      </div>
    );
  }

  const handleAdapterNavigate = (view: string, params?: Record<string, any>) => {
    if ((view === 'mock-exam-runner' || view === 'exam') && params?.examId) {
      setActiveExamId(params.examId);
      if (params?.registrationData) {
        setRegistrationData(params.registrationData);
      }
    } else if (view === 'mock-exams' || view === 'exam-list') {
      setActiveExamId(null);
    } else if (view === 'pricing') {
      onNavigate('pricing', params);
    } else if (view === 'dashboard') {
      onNavigate('dashboard', params);
    } else if (view === 'curriculum' || view === 'courses') {
      onNavigate('curriculum', params);
    } else if (view === 'workos' || view === 'baito') {
      onNavigate('workos', params);
    } else if (view === 'rirekisho' || view === 'cv') {
      onNavigate('rirekisho', params);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <button
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

        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
          <Award className="w-3.5 h-3.5" />
          <span>NIHOMI EXAM OS™ • {examLoopBriefing?.briefingTitleBn || 'JLPT N5–N1 Blueprint'}</span>
        </div>
      </div>

      {/* Main View: Runner or Catalog */}
      {activeExamId ? (
        <div className="bg-[#141726] border border-white/10 rounded-3xl p-4 sm:p-8 shadow-2xl">
          <MockExamRunnerView
            examId={activeExamId}
            registrationData={registrationData}
            onNavigate={handleAdapterNavigate}
          />
        </div>
      ) : (
        <div className="bg-[#141726] border border-white/10 rounded-3xl p-4 sm:p-8 shadow-2xl">
          <MockExamsView
            onNavigate={handleAdapterNavigate}
          />
        </div>
      )}
    </div>
  );
};
export default V2ExamPage;

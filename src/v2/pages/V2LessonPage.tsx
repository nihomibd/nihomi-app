// src/v2/pages/V2LessonPage.tsx
// NIHOMI V2 — INTERACTIVE GRAMMAR LOOP & PEDAGOGICAL GATE
import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  ArrowLeft,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers
} from 'lucide-react';
import { V2Route, V2NavigationParams } from '../types';
import { InteractiveGrammarLoop } from '../../components/learning/InteractiveGrammarLoop';
import { ZenLearningCanvas } from '../../components/learning/ZenLearningCanvas';
import { VowelWordFormationCanvas } from '../../components/learning/VowelWordFormationCanvas';
import { loadLearnerKnowledgeState } from '../../core/curriculum/learnerKnowledgeState';
import { isGrammarEligible, getNextBestMission } from '../../core/curriculum/journeyEngine';
import { useAuth } from '../../context/AuthContext';
import { isProUser, isLessonFreeTier } from '../utils/accessControl';
import { ProFeatureGate } from '../components/common/ProFeatureGate';

interface V2LessonPageProps {
  lessonId?: string;
  params?: V2NavigationParams;
  onNavigate: (route: V2Route, params?: V2NavigationParams) => void;
  onOpenCheckout?: (planId?: string) => void;
}

export const V2LessonPage: React.FC<V2LessonPageProps> = ({
  lessonId = 'n5-l01',
  params,
  onNavigate,
  onOpenCheckout
}) => {
  const { user } = useAuth();
  const [knowledgeState, setKnowledgeState] = useState(loadLearnerKnowledgeState());

  useEffect(() => {
    const handleUpdate = () => setKnowledgeState(loadLearnerKnowledgeState());
    window.addEventListener('nihomi:knowledge-state-updated', handleUpdate);
    window.addEventListener('nihomi:memory-updated', handleUpdate);
    return () => {
      window.removeEventListener('nihomi:knowledge-state-updated', handleUpdate);
      window.removeEventListener('nihomi:memory-updated', handleUpdate);
    };
  }, []);

  const normalizedId = (lessonId || '').toLowerCase().trim();
  const hashQuery = typeof window !== 'undefined' ? new URLSearchParams(window.location.hash.split('?')[1] || '') : new URLSearchParams();
  const targetChar = params?.char || hashQuery.get('char');
  const targetQuiz = params?.quiz || hashQuery.get('quiz');

  const isKanaLesson =
    Boolean(targetChar) ||
    Boolean(targetQuiz) ||
    normalizedId === 'kana-a' ||
    normalizedId === 'vowel-mastery-gate' ||
    (normalizedId.includes('kana') && !normalizedId.includes('grammar'));

  const isWordFormationLesson =
    normalizedId === 'n5-l2-words' ||
    normalizedId === 'lesson-02-words';

  // 1. Early Hiragana Foundation: Render Tactile Zen Learning Canvas
  if (isKanaLesson && !isWordFormationLesson) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fadeIn">
        <ZenLearningCanvas
          initialChar={targetChar || 'あ'}
          onBack={() => onNavigate('curriculum')}
          onNextLesson={(target) => {
            if (target?.lessonId) {
              onNavigate('lesson', { lessonId: target.lessonId });
              return;
            }
            const currentKState = loadLearnerKnowledgeState();
            const nextMission = getNextBestMission(currentKState);
            if (nextMission.viewRoute === 'lesson') {
              onNavigate('lesson', nextMission.viewParams || { lessonId: 'n5-l2-words' });
            } else if (nextMission.viewRoute === 'kana') {
              onNavigate('kana', nextMission.viewParams);
            } else {
              onNavigate('journey');
            }
          }}
        />
      </div>
    );
  }

  // 2. Word Formation Lab (Lesson 02 Words)
  if (isWordFormationLesson) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fadeIn">
        <VowelWordFormationCanvas
          onBack={() => onNavigate('lesson', { lessonId: 'n5-l1' })}
          onNextLesson={() => {
            const currentKState = loadLearnerKnowledgeState();
            const nextMission = getNextBestMission(currentKState);
            onNavigate('journey');
          }}
        />
      </div>
    );
  }

  // 3. Commercial Gating: Chapters 1-5 free; Chapter 6+ Pro subscription
  const isFree = isLessonFreeTier(lessonId);
  const isPro = isProUser(user);

  if (!isFree && !isPro) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
        <ProFeatureGate
          featureName={`JLPT ${lessonId.toUpperCase()} সম্পূর্ণ পাঠ্যক্রম`}
          featureSubtitle="অ্যাডভান্সড ব্যাকরণ, রিয়েল-লাইফ কনভারসেশন ও কুইজ"
          featureDescription="N5 অধ্যায় ১–৫ সম্পূর্ণ বিনামূল্যে সবার জন্য উন্মুক্ত। পরবর্তী অধ্যায় ৬ থেকে ২৫ এবং N4–N1 লেভেলে প্রবেশ করতে Nihomi PRO সাবস্ক্রাইব করুন।"
          onOpenCheckout={() => {
            if (onOpenCheckout) {
              onOpenCheckout('pro');
            } else {
              onNavigate('pricing');
            }
          }}
          onBack={() => onNavigate('curriculum')}
          backLabel="কারিকুলামে ফিরে যান"
        />
      </div>
    );
  }

  // 4. Grammar Prerequisite Lattice Guard
  const grammarEligibility = isGrammarEligible(knowledgeState);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Top Breadcrumb & Return to Curriculum */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <button
          onClick={() => onNavigate('curriculum')}
          className="flex items-center gap-2 text-xs font-bold text-stone-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>কারিকুলামে ফিরে যান</span>
        </button>

        <span className="text-xs font-mono text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
          LESSON: {lessonId.toUpperCase()}
        </span>
      </div>

      {/* Prerequisite Gate Check */}
      {!grammarEligibility.eligible ? (
        <div className="bg-[#141726] border-2 border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>শিক্ষণ ল্যাটিস সুরক্ষা গেট (Pedagogical Lattice Guard)</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              ব্যাকরণে প্রবেশের আগে বর্ণমালা মাস্টারি প্রয়োজন
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
              Nihomi-র প্রামাণ্য নীতি অনুযায়ী, কোনো শিক্ষার্থীকে না-শেখা বর্ণ বা শব্দ দিয়ে বিভ্রান্ত করা হয় না।
              জাপানি ব্যাকরণ ও পূর্ণাঙ্গ বাক্য বোঝার জন্য মৌলিক হিরাগানা ও কাতাকানা পড়া এবং প্রথম কিছু শব্দ চেনা আবশ্যক।
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>অসম্পূর্ণ পূর্বশর্তসমূহ:</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-stone-300">
              {grammarEligibility.missingPrerequisites.map((req, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('journey')}
              className="btn-haptic inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E45147] hover:bg-[#c93b32] text-white font-black text-xs shadow-lg shadow-red-600/30 transition cursor-pointer"
            >
              <span>জার্নিতে বর্ণমালা শেষ করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('kana')}
              className="btn-haptic inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 transition cursor-pointer"
            >
              <span>হিরাগানা ক্যানভাস খুলুন</span>
            </button>
          </div>
        </div>
      ) : (
        /* Eligible: Render Interactive Grammar Loop */
        <InteractiveGrammarLoop
          lessonId={lessonId}
          onComplete={() => onNavigate('curriculum')}
        />
      )}
    </div>
  );
};
export default V2LessonPage;

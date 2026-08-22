import React from 'react';
import { BookOpen, CheckCircle2, Award, ArrowRight, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

interface LearningOverviewViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const LearningOverviewView: React.FC<LearningOverviewViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  return (
    <div id="nihomi-curriculum-view" className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Bento Header */}
        <div className="text-center space-y-4 bg-white border border-stone-200 rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
            <span>Curriculum Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-stone-900 tracking-tight">
            The Nihomi Learning Roadmap (N5 &rarr; N3)
          </h1>
          <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Our modular curriculum is structured according to the official Japanese Language Proficiency Test (JLPT) benchmarks, coupled with practical real-life Japanese for workplace integration.
          </p>
        </div>

        {/* Level Tiers */}
        <div className="space-y-6">
          {/* N5 */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-red-50 text-red-700 border border-red-200">
                  JLPT N5 &bull; Beginner Foundations
                </span>
                <h2 className="text-xl font-bold text-stone-900 font-serif mt-2">
                  Building Your Sentence Core & Essential Japanese
                </h2>
              </div>
              <button
                onClick={() => onNavigate(user ? 'courses' : 'auth', { mode: 'register', level: 'N5' })}
                className="self-start sm:self-auto px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-all shadow-sm flex items-center space-x-1.5"
              >
                <span>Study N5</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                <p className="font-bold text-stone-900 text-sm">Grammar Core</p>
                <p className="text-stone-600 leading-relaxed">Sentence formulas: 〜は〜です, question marker か, particles を, に, で, へ, verb conjugations (ます/ません/ました), and the foundational て-form.</p>
              </div>
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                <p className="font-bold text-stone-900 text-sm">Vocabulary & Kanji</p>
                <p className="text-stone-600 leading-relaxed">~600 core daily life vocabulary words, numbers, time, family, food, transit, and 100 essential Kanji characters with On'yomi & Kun'yomi.</p>
              </div>
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                <p className="font-bold text-stone-900 text-sm">Conversational Output</p>
                <p className="text-stone-600 leading-relaxed">Self-introductions, asking directions, ordering in restaurants, shopping, and everyday polite transactions in Tokyo.</p>
              </div>
            </div>
          </div>

          {/* N4 */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-red-50 text-red-700 border border-red-200">
                  JLPT N4 &bull; Elementary Mastery
                </span>
                <h2 className="text-xl font-bold text-stone-900 font-serif mt-2">
                  Agile Expressions, Favors & Complex Verbs
                </h2>
              </div>
              <button
                onClick={() => onNavigate(user ? 'courses' : 'auth', { mode: 'register', level: 'N4' })}
                className="self-start sm:self-auto px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-all shadow-sm flex items-center space-x-1.5"
              >
                <span>Study N4</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                <p className="font-bold text-stone-900 text-sm">Complex Conjugations</p>
                <p className="text-stone-600 leading-relaxed">Potential form (可能形), conditionals (たら/ば/なら), giving & receiving favors (あげる/もらう/くれる), and volitional intentions (〜よう).</p>
              </div>
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                <p className="font-bold text-stone-900 text-sm">Vocabulary & Kanji</p>
                <p className="text-stone-600 leading-relaxed">~1,500 vocabulary words and 300 Kanji. Read notices, instructions, menus, and compound conversational passages.</p>
              </div>
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                <p className="font-bold text-stone-900 text-sm">Practical Independence</p>
                <p className="text-stone-600 leading-relaxed">Handle doctor appointments, travel bookings, workplace requests, and basic problem solving in Japanese.</p>
              </div>
            </div>
          </div>

          {/* N3 */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-red-50 text-red-700 border border-red-200">
                  JLPT N3 &bull; Intermediate Fluency
                </span>
                <h2 className="text-xl font-bold text-stone-900 font-serif mt-2">
                  The Intermediate Bridge to Natural Fluency & Nuance
                </h2>
              </div>
              <button
                onClick={() => onNavigate(user ? 'courses' : 'auth', { mode: 'register', level: 'N3' })}
                className="self-start sm:self-auto px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-all shadow-sm flex items-center space-x-1.5"
              >
                <span>Study N3</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                <p className="font-bold text-stone-900 text-sm">Nuance & Hearsay</p>
                <p className="text-stone-600 leading-relaxed">Master subtle distinctions: 〜ようだ (conjecture), 〜らしい (hearsay), 〜そうだ (visual impression), 〜わけがない, and 〜に違いない.</p>
              </div>
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                <p className="font-bold text-stone-900 text-sm">Workplace Foundations</p>
                <p className="text-stone-600 leading-relaxed">650+ Kanji, 3,750+ vocabulary words. Read news summaries, office memos, technical requirements, and business letters.</p>
              </div>
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                <p className="font-bold text-stone-900 text-sm">Conversational Agility</p>
                <p className="text-stone-600 leading-relaxed">Express opinions, participate in meetings, understand indirect polite refusals, and speak at near-native speed.</p>
              </div>
            </div>
          </div>

          {/* Future N2 / N1 Note */}
          <div className="bg-stone-100 border border-stone-200 rounded-2xl p-6 text-center space-y-1.5">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Future Expansion Architecture</p>
            <p className="text-sm font-bold text-stone-800">JLPT N2 & N1 Curriculum</p>
            <p className="text-xs text-stone-500 max-w-xl mx-auto">
              Nihomi's database schema and curriculum engine are built to support seamless expansion into N2 (Upper Intermediate) and N1 (Advanced Native Fluency) without system refactoring.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

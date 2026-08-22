import React, { useState, useEffect } from 'react';
import { apiRequest } from '../lib/api.js';
import { speakJapanese } from '../lib/tts.js';
import { WorkJapaneseItem } from '../types.js';
import {
  Briefcase,
  Volume2,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Layers,
  HelpCircle,
  Check,
  X,
  MessageSquare,
  Globe,
  Building,
  Lightbulb
} from 'lucide-react';
import { SentenceDnaModal } from '../components/SentenceDnaModal.js';

interface WorkDetailViewProps {
  id?: string;
  itemId?: string;
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const WorkDetailView: React.FC<WorkDetailViewProps> = ({ id, itemId, onNavigate }) => {
  const rawId = id || itemId || 'work-keigo-1';
  const activeId = rawId === 'work-k1' ? 'work-keigo-1' : rawId;
  const [item, setItem] = useState<WorkJapaneseItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'phrases' | 'dialogue' | 'culture' | 'exercises'>('phrases');

  // Sentence DNA Modal
  const [dnaSentence, setDnaSentence] = useState<string | null>(null);

  // Exercise state
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<string, string>>({});
  const [exerciseFeedback, setExerciseFeedback] = useState<Record<string, { isCorrect: boolean; show: boolean }>>({});

  useEffect(() => {
    async function loadDetail() {
      setIsLoading(true);
      try {
        const res = await apiRequest<{ item: WorkJapaneseItem }>(`/api/work-japanese/${activeId}`);
        setItem(res.item);
      } catch (err) {
        console.error('Failed to load Work Japanese item:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDetail();
  }, [activeId]);

  const checkAnswer = (exerciseId: string, userAns: string, correctAns: string) => {
    const isCorrect = userAns.trim().toLowerCase() === correctAns.trim().toLowerCase();
    setExerciseFeedback((prev) => ({
      ...prev,
      [exerciseId]: { isCorrect, show: true }
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] flex items-center justify-center p-8">
        <div className="text-center space-y-3 bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-stone-600">Loading Work Scenario...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] flex flex-col items-center justify-center p-8 space-y-4">
        <p className="text-sm font-bold text-stone-700">Work Japanese module not found.</p>
        <button
          onClick={() => onNavigate('work')}
          className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs"
        >
          Back to Work Hub
        </button>
      </div>
    );
  }

  return (
    <div id="nihomi-work-detail-view" className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] py-8 px-4 sm:px-6 lg:px-8">
      {/* Sentence DNA Trigger */}
      {dnaSentence && (
        <SentenceDnaModal
          isOpen={!!dnaSentence}
          onClose={() => setDnaSentence(null)}
          initialSentence={dnaSentence}
        />
      )}

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('work')}
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-red-600 transition-colors bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Work Japanese</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200">
              Level: {item.level}
            </span>
          </div>
        </div>

        {/* Header Card */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider">
            <Briefcase className="w-4 h-4" />
            <span>{item.category.toUpperCase()} &bull; JLPT {item.level}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">{item.title}</h1>
          <p className="text-sm font-serif text-red-600">{item.titleJa}</p>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-3xl">{item.scenario || item.description}</p>
        </div>

        {/* Bengali Cultural Context Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-red-50 to-amber-50 border border-red-200 text-xs space-y-2">
          <div className="flex items-center gap-2 text-red-700 font-bold uppercase tracking-wider">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>জাপানি কর্মক্ষেত্রের শিষ্টাচার ও বাস্তব টিপস (Workplace Manners)</span>
          </div>
          <p className="text-stone-700 leading-relaxed">
            জাপানি কোম্পানিতে সরাসরি &apos;না&apos; বলাকে অভদ্রতা মনে করা হয়। এর পরিবর্তে &apos;Shochi shimashita&apos; বা &apos;Kashikomarimashita&apos; দিয়ে শুরু করে বিনয়ের সাথে বক্তব্য উপস্থাপন করতে হয়।
          </p>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-stone-200/60 p-1.5 rounded-2xl border border-stone-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('phrases')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'phrases' ? 'bg-white text-red-700 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Key Phrases ({item.keyPhrases?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('dialogue')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'dialogue' ? 'bg-white text-red-700 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Dialogue Flow</span>
          </button>
          <button
            onClick={() => setActiveTab('culture')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'culture' ? 'bg-white text-red-700 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Culture & Manners</span>
          </button>
          <button
            onClick={() => setActiveTab('exercises')}
            className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'exercises' ? 'bg-white text-red-700 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Roleplay Quiz</span>
          </button>
        </div>

        {/* Phrases Content */}
        {activeTab === 'phrases' && (
          <div className="space-y-4">
            {item.keyPhrases?.map((phrase, idx) => (
              <div key={idx} className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div
                    onClick={() => setDnaSentence(phrase.japanese)}
                    className="cursor-pointer space-y-1"
                    title="Click for Sentence DNA™"
                  >
                    <p className="text-xl font-bold font-serif text-stone-900 hover:text-red-600">{phrase.japanese}</p>
                    {phrase.furigana && <p className="text-xs text-stone-400 font-mono">{phrase.furigana}</p>}
                    <p className="text-sm font-bold text-stone-800">{phrase.english}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-[10px] font-bold">
                      {phrase.politeLevel}
                    </span>
                    <button
                      type="button"
                      onClick={() => setDnaSentence(phrase.japanese)}
                      className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold hover:bg-blue-100 cursor-pointer"
                    >
                      DNA™
                    </button>
                    <button
                      onClick={() => speakJapanese(phrase.japanese)}
                      className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-600 hover:text-red-600 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {phrase.usageContext && (
                  <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <strong>Context:</strong> {phrase.usageContext}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Dialogue Tab */}
        {activeTab === 'dialogue' && (
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-stone-900 font-serif">Simulated Office Conversation</h3>
            <div className="space-y-3">
              {item.dialogue?.map((d, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-700">{d.speaker} {d.role ? `(${d.role})` : ''}</span>
                    <button
                      onClick={() => speakJapanese(d.japanese)}
                      className="p-1 rounded text-stone-400 hover:text-red-600 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p
                    onClick={() => setDnaSentence(d.japanese)}
                    className="text-sm font-serif font-bold text-stone-900 hover:text-red-600 cursor-pointer"
                    title="Click for Sentence DNA™"
                  >
                    {d.japanese}
                  </p>
                  <p className="text-xs text-stone-600">{d.english}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Culture Tab */}
        {activeTab === 'culture' && (
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-stone-900 font-serif">Business Etiquette & Hou-Ren-So (報連相)</h3>
            <div className="space-y-2">
              {item.culturalTips && item.culturalTips.length > 0 ? (
                item.culturalTips.map((tip, tIdx) => (
                  <div key={tIdx} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-700 leading-relaxed flex items-start gap-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>{tip}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">{item.description}</p>
              )}
            </div>
          </div>
        )}

        {/* Exercises Tab */}
        {activeTab === 'exercises' && (
          <div className="space-y-4">
            {item.exercises?.map((ex, idx) => {
              const feedback = exerciseFeedback[ex.id];
              return (
                <div key={ex.id || idx} className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-3">
                  <span className="text-xs font-bold text-red-600">Quiz #{idx + 1}</span>
                  <p className="text-sm font-bold text-stone-900">{ex.instruction || ex.questionJa}</p>
                  {ex.questionJa && ex.instruction && (
                    <p className="text-xs text-stone-600 font-serif">{ex.questionJa}</p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {ex.options?.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => checkAnswer(ex.id, opt, ex.correctAnswer)}
                        className="p-3 rounded-xl border text-xs font-semibold text-left transition-all bg-stone-50 border-stone-200 hover:border-stone-400 text-stone-800 cursor-pointer"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {feedback?.show && (
                    <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                      feedback.isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {feedback.isCorrect ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-rose-600" />}
                      <span>{feedback.isCorrect ? 'Correct! Excellent business phrasing.' : `Incorrect. Recommended: ${ex.correctAnswer}`}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

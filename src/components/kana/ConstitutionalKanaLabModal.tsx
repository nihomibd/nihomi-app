// src/components/kana/ConstitutionalKanaLabModal.tsx
// NIHOMI CONSTITUTIONAL KANA LAB™
// Section 7 Constitution: SEE → HEAR → CONNECT SOUND + SYMBOL → RECOGNIZE → RECALL → INTERACT → TEST → APPLY
// Never rely only on tapping a grid. Multi-evidence mastery tracking.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  RotateCcw,
  Award,
  Zap,
  Eye,
  Headphones,
  Brain,
  PenTool,
  Check,
  ShieldCheck
} from 'lucide-react';
import { KanaCharacter, HIRAGANA_SEION, KATAKANA_SEION } from '../../data/kanaData';
import { speakJapanese } from '../../lib/tts';
import { soundEffects } from '../../lib/soundEffects';
import {
  evaluateSkillMastery,
  SkillEvidenceRecord,
  SkillMasteryRecord
} from '../../core/learning/learningConstitution';
import {
  loadLearnerKnowledgeState,
  saveLearnerKnowledgeState
} from '../../core/curriculum/learnerKnowledgeState';
import { trackNihomiEvent } from '../../utils/analytics';
import { KanaDrawingCanvas } from './KanaDrawingCanvas';

export type KanaStage =
  | 'see_hear'
  | 'sound_symbol'
  | 'visual_recognition'
  | 'audio_recognition'
  | 'recall'
  | 'interact_draw'
  | 'apply_word'
  | 'mastery_complete';

interface ConstitutionalKanaLabModalProps {
  isOpen: boolean;
  kana: KanaCharacter;
  onClose: () => void;
  onComplete?: (char: string) => void;
  onNextKana?: () => void;
}

export const ConstitutionalKanaLabModal: React.FC<ConstitutionalKanaLabModalProps> = ({
  isOpen,
  kana,
  onClose,
  onComplete,
  onNextKana
}) => {
  const [currentStage, setCurrentStage] = useState<KanaStage>('see_hear');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; messageBn: string } | null>(null);
  const [evidences, setEvidences] = useState<SkillEvidenceRecord[]>([]);
  const [xpAwarded, setXpAwarded] = useState(0);

  // Play audio on stage enter
  useEffect(() => {
    if (!isOpen) return;
    if (currentStage === 'see_hear' || currentStage === 'sound_symbol' || currentStage === 'audio_recognition') {
      speakJapanese(kana.char, { rate: 0.85 });
    }
    setSelectedOption(null);
    setFeedback(null);
  }, [isOpen, kana.char, currentStage]);

  if (!isOpen) return null;

  // Smart distractors for visual and audio checks
  const getDistractors = () => {
    const pool = kana.type === 'hiragana' ? HIRAGANA_SEION : KATAKANA_SEION;
    const others = pool.filter(k => k.char !== kana.char);
    // Shuffle and pick 3
    const shuffled = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
    const all = [kana, ...shuffled].sort(() => 0.5 - Math.random());
    return all;
  };

  const handleOptionSelect = (selectedChar: string, evidenceType: SkillEvidenceRecord['type']) => {
    if (feedback) return;
    setSelectedOption(selectedChar);
    const isCorrect = selectedChar === kana.char;

    const newEvidence: SkillEvidenceRecord = {
      type: evidenceType,
      success: isCorrect,
      timestamp: new Date().toISOString(),
      context: `kana_lab_${kana.char}`
    };

    setEvidences(prev => [...prev, newEvidence]);

    if (isCorrect) {
      soundEffects.playCorrect();
      setFeedback({
        isCorrect: true,
        messageBn: 'দারুণ! একদম নির্ভুল উত্তর।'
      });
      setXpAwarded(prev => prev + 15);
    } else {
      soundEffects.playIncorrectSoft();
      setFeedback({
        isCorrect: false,
        messageBn: `একটু খেয়াল করুন। '${kana.char}' এর উচ্চারণ '${kana.romaji}' (${kana.banglaPhonetic})। আবার চেষ্টা করি!`
      });
    }
  };

  const handleNextStage = () => {
    setFeedback(null);
    setSelectedOption(null);

    switch (currentStage) {
      case 'see_hear':
        setCurrentStage('sound_symbol');
        break;
      case 'sound_symbol':
        setCurrentStage('visual_recognition');
        break;
      case 'visual_recognition':
        setCurrentStage('audio_recognition');
        break;
      case 'audio_recognition':
        setCurrentStage('recall');
        break;
      case 'recall':
        setCurrentStage('interact_draw');
        break;
      case 'interact_draw':
        setCurrentStage('apply_word');
        break;
      case 'apply_word':
        // Finalize mastery
        finalizeMastery();
        setCurrentStage('mastery_complete');
        break;
      case 'mastery_complete':
        if (onComplete) onComplete(kana.char);
        if (onNextKana) onNextKana();
        else onClose();
        break;
    }
  };

  const finalizeMastery = () => {
    const state = loadLearnerKnowledgeState();
    
    // Add character to known list if not present
    if (kana.type === 'hiragana') {
      if (!state.knownHiragana.includes(kana.char)) {
        state.knownHiragana.push(kana.char);
      }
    } else {
      if (!state.knownKatakana.includes(kana.char)) {
        state.knownKatakana.push(kana.char);
      }
    }

    // Add skill
    const skillKey = `kana_${kana.char}_mastered`;
    if (!state.masteredSkills.includes(skillKey)) {
      state.masteredSkills.push(skillKey);
    }

    state.totalXp += (xpAwarded + 25);
    saveLearnerKnowledgeState(state);

    trackNihomiEvent('skill_mastery_changed', {
      skillId: kana.char,
      status: 'MASTERED',
      xp: state.totalXp
    } as any);
  };

  const STAGES_LIST: { id: KanaStage; label: string }[] = [
    { id: 'see_hear', label: '১. দেখা ও শোনা' },
    { id: 'sound_symbol', label: '২. ধ্বনি সংযোগ' },
    { id: 'visual_recognition', label: '৩. বর্ণ চেনা' },
    { id: 'audio_recognition', label: '৪. শুনে চেনা' },
    { id: 'recall', label: '৫. স্মৃতি রিকল' },
    { id: 'interact_draw', label: '৬. আঁকা ও অনুশীলন' },
    { id: 'apply_word', label: '৭. শব্দে প্রয়োগ' },
    { id: 'mastery_complete', label: '৮. পার্মানেন্ট মাস্টারি' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#0d0d18] border border-white/10 rounded-3xl shadow-2xl p-5 sm:p-7 text-white space-y-6 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono tracking-widest text-red-400 font-bold">
                Constitutional Kana Engine™
              </div>
              <h2 className="text-lg font-black text-white">
                {kana.type === 'hiragana' ? 'হিরাগানা' : 'কাতাকানা'} ক্যানভাস: {kana.char} ({kana.romaji})
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar (8 Stages) */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-stone-400 font-mono">
            <span>ধাপ {STAGES_LIST.findIndex(s => s.id === currentStage) + 1} / 8</span>
            <span className="text-amber-400 font-bold">+{xpAwarded} XP অর্জিত</span>
          </div>
          <div className="grid grid-cols-8 gap-1">
            {STAGES_LIST.map((stage, idx) => {
              const currentIdx = STAGES_LIST.findIndex(s => s.id === currentStage);
              const isPast = idx < currentIdx;
              const isCurrent = idx === currentIdx;
              return (
                <div
                  key={stage.id}
                  className={`h-1.5 rounded-full transition-all ${
                    isPast
                      ? 'bg-emerald-500'
                      : isCurrent
                      ? 'bg-gradient-to-r from-red-500 to-amber-400 animate-pulse'
                      : 'bg-white/10'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Dynamic Stage Content */}
        <AnimatePresence mode="wait">
          {/* STAGE 1: SEE & HEAR */}
          {currentStage === 'see_hear' && (
            <motion.div
              key="see_hear"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5 text-center"
            >
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 inline-block mx-auto text-xs text-stone-300">
                <span className="text-red-400 font-bold">১ম ধাপ:</span> বড় অক্ষরে বর্ণটি দেখুন এবং নেটিভ সাউন্ড শুনুন।
              </div>

              <div className="relative p-8 rounded-3xl bg-gradient-to-b from-[#17162b] to-[#0a0a14] border border-white/10 flex flex-col items-center justify-center">
                <span className="text-7xl sm:text-8xl font-black font-japanese text-white drop-shadow-[0_0_25px_rgba(239,68,68,0.35)]">
                  {kana.char}
                </span>

                <div className="mt-4 flex items-center gap-3">
                  <span className="text-xl font-black text-amber-400 font-mono">{kana.romaji}</span>
                  <span className="text-stone-400">•</span>
                  <span className="text-base text-stone-300 font-medium">{kana.banglaPhonetic}</span>
                </div>

                <button
                  type="button"
                  onClick={() => speakJapanese(kana.char, { rate: 0.85 })}
                  className="mt-4 px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 text-xs font-bold flex items-center gap-2 cursor-pointer transition active:scale-95"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>পুনরায় শুনুন (Play Audio)</span>
                </button>
              </div>

              {kana.mnemonicBn && (
                <div className="p-4 rounded-2xl bg-[#121124] border border-white/5 text-left text-xs space-y-1">
                  <div className="text-amber-400 font-bold flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5" />
                    <span>স্মরণ রাখার কৌশল (Mnemonic):</span>
                  </div>
                  <p className="text-stone-300">{kana.mnemonicBn}</p>
                </div>
              )}

              <button
                type="button"
                onClick={handleNextStage}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
              >
                <span>পরের ধাপ: সাউন্ড কানেকশন →</span>
              </button>
            </motion.div>
          )}

          {/* STAGE 2: SOUND + SYMBOL CONNECTION */}
          {currentStage === 'sound_symbol' && (
            <motion.div
              key="sound_symbol"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5 text-center"
            >
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 inline-block mx-auto text-xs text-stone-300">
                <span className="text-amber-400 font-bold">২য় ধাপ:</span> ধ্বনির সাথে প্রতীকের সংযোগ অনুধাবন করুন।
              </div>

              <div className="p-6 rounded-3xl bg-[#131226] border border-white/10 space-y-4">
                <div className="text-xs text-stone-400">উচ্চারণ ও স্ট্রোক সংখ্যা:</div>
                <div className="flex items-center justify-center gap-6">
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                    <div className="text-3xl font-black text-white font-japanese">{kana.char}</div>
                    <div className="text-[10px] text-stone-400 mt-1">প্রতীক</div>
                  </div>
                  <div className="text-2xl text-stone-500">↔</div>
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                    <div className="text-2xl font-black text-amber-400 font-mono">{kana.romaji}</div>
                    <div className="text-[10px] text-stone-400 mt-1">রোমাজি</div>
                  </div>
                  <div className="text-2xl text-stone-500">↔</div>
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                    <div className="text-2xl font-black text-rose-400">{kana.strokes}টি</div>
                    <div className="text-[10px] text-stone-400 mt-1">স্ট্রোক</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => speakJapanese(kana.char, { rate: 0.85 })}
                  className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  <Headphones className="w-4 h-4 text-emerald-400" />
                  <span>নেটিভ স্পিকারের মুখে শুনুন</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleNextStage}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
              >
                <span>পরের ধাপ: বর্ণ চেনার পরীক্ষা →</span>
              </button>
            </motion.div>
          )}

          {/* STAGE 3: VISUAL RECOGNITION */}
          {currentStage === 'visual_recognition' && (
            <motion.div
              key="visual_recognition"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5"
            >
              <div className="text-center space-y-1">
                <div className="text-xs text-red-400 font-bold uppercase tracking-wider">Visual Recognition</div>
                <h3 className="text-base font-bold text-white">
                  নিচের কোন অক্ষরটি <span className="text-amber-400 font-mono font-black text-lg">'{kana.romaji}'</span> ({kana.banglaPhonetic})?
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {getDistractors().map((distractor) => {
                  const isSelected = selectedOption === distractor.char;
                  const isTarget = distractor.char === kana.char;
                  let btnColor = 'bg-[#15142a] border-white/10 hover:border-white/20';

                  if (feedback) {
                    if (isTarget) btnColor = 'bg-emerald-950/80 border-emerald-500 text-emerald-300';
                    else if (isSelected && !isTarget) btnColor = 'bg-red-950/80 border-red-500 text-red-300';
                  }

                  return (
                    <button
                      key={distractor.char}
                      type="button"
                      disabled={feedback !== null}
                      onClick={() => handleOptionSelect(distractor.char, 'recognition')}
                      className={`p-6 rounded-2xl border text-4xl font-black font-japanese text-center transition-all cursor-pointer ${btnColor}`}
                    >
                      {distractor.char}
                    </button>
                  );
                })}
              </div>

              {feedback && (
                <div className={`p-4 rounded-2xl text-xs flex items-center justify-between ${
                  feedback.isCorrect ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300' : 'bg-red-950/60 border border-red-500/30 text-red-300'
                }`}>
                  <div className="flex items-center gap-2">
                    {feedback.isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
                    <span>{feedback.messageBn}</span>
                  </div>
                  {feedback.isCorrect && (
                    <button
                      type="button"
                      onClick={handleNextStage}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer hover:bg-emerald-500 transition"
                    >
                      পরবর্তী ধাপ →
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* STAGE 4: AUDIO RECOGNITION */}
          {currentStage === 'audio_recognition' && (
            <motion.div
              key="audio_recognition"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5"
            >
              <div className="text-center space-y-2">
                <div className="text-xs text-blue-400 font-bold uppercase tracking-wider">Audio Recognition</div>
                <h3 className="text-base font-bold text-white">
                  সাউন্ড শুনে সঠিক জাপানি বর্ণটি নির্বাচন করুন:
                </h3>
                <button
                  type="button"
                  onClick={() => speakJapanese(kana.char, { rate: 0.85 })}
                  className="mx-auto px-5 py-2.5 rounded-2xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 font-bold text-xs flex items-center gap-2 cursor-pointer transition active:scale-95"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>সাউন্ডটি আবার শুনুন</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {getDistractors().map((distractor) => {
                  const isSelected = selectedOption === distractor.char;
                  const isTarget = distractor.char === kana.char;
                  let btnColor = 'bg-[#15142a] border-white/10 hover:border-white/20';

                  if (feedback) {
                    if (isTarget) btnColor = 'bg-emerald-950/80 border-emerald-500 text-emerald-300';
                    else if (isSelected && !isTarget) btnColor = 'bg-red-950/80 border-red-500 text-red-300';
                  }

                  return (
                    <button
                      key={distractor.char}
                      type="button"
                      disabled={feedback !== null}
                      onClick={() => handleOptionSelect(distractor.char, 'listening')}
                      className={`p-6 rounded-2xl border text-4xl font-black font-japanese text-center transition-all cursor-pointer ${btnColor}`}
                    >
                      {distractor.char}
                    </button>
                  );
                })}
              </div>

              {feedback && (
                <div className={`p-4 rounded-2xl text-xs flex items-center justify-between ${
                  feedback.isCorrect ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300' : 'bg-red-950/60 border border-red-500/30 text-red-300'
                }`}>
                  <div className="flex items-center gap-2">
                    {feedback.isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
                    <span>{feedback.messageBn}</span>
                  </div>
                  {feedback.isCorrect && (
                    <button
                      type="button"
                      onClick={handleNextStage}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer hover:bg-emerald-500 transition"
                    >
                      পরবর্তী ধাপ →
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* STAGE 5: RECALL */}
          {currentStage === 'recall' && (
            <motion.div
              key="recall"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5"
            >
              <div className="text-center space-y-1">
                <div className="text-xs text-purple-400 font-bold uppercase tracking-wider">Memory Recall</div>
                <h3 className="text-base font-bold text-white">
                  স্মৃতি থেকে বলুন: <span className="text-amber-400 font-mono font-black text-xl">'{kana.romaji}'</span> এর প্রতীক কোনটি?
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {getDistractors().map((distractor) => {
                  const isSelected = selectedOption === distractor.char;
                  const isTarget = distractor.char === kana.char;
                  let btnColor = 'bg-[#15142a] border-white/10 hover:border-white/20';

                  if (feedback) {
                    if (isTarget) btnColor = 'bg-emerald-950/80 border-emerald-500 text-emerald-300';
                    else if (isSelected && !isTarget) btnColor = 'bg-red-950/80 border-red-500 text-red-300';
                  }

                  return (
                    <button
                      key={distractor.char}
                      type="button"
                      disabled={feedback !== null}
                      onClick={() => handleOptionSelect(distractor.char, 'recall')}
                      className={`p-6 rounded-2xl border text-4xl font-black font-japanese text-center transition-all cursor-pointer ${btnColor}`}
                    >
                      {distractor.char}
                    </button>
                  );
                })}
              </div>

              {feedback && (
                <div className={`p-4 rounded-2xl text-xs flex items-center justify-between ${
                  feedback.isCorrect ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300' : 'bg-red-950/60 border border-red-500/30 text-red-300'
                }`}>
                  <div className="flex items-center gap-2">
                    {feedback.isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
                    <span>{feedback.messageBn}</span>
                  </div>
                  {feedback.isCorrect && (
                    <button
                      type="button"
                      onClick={handleNextStage}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-pointer hover:bg-emerald-500 transition"
                    >
                      পরবর্তী ধাপ →
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* STAGE 6: INTERACT & WRITE */}
          {currentStage === 'interact_draw' && (
            <motion.div
              key="interact_draw"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4 text-center"
            >
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 inline-block mx-auto text-xs text-stone-300">
                <span className="text-emerald-400 font-bold">৬ষ্ঠ ধাপ:</span> ক্যানভাসে স্ট্রোক অর্ডার অনুসরণ করে লিখুন।
              </div>

              <div className="w-full max-w-sm mx-auto">
                <KanaDrawingCanvas
                  kana={kana}
                  onNextCharacter={handleNextStage}
                  autoAdvance={false}
                />
              </div>

              <button
                type="button"
                onClick={handleNextStage}
                className="w-full py-3 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <span>অঙ্কন সম্পন্ন হয়েছে — শব্দে প্রয়োগে যান →</span>
              </button>
            </motion.div>
          )}

          {/* STAGE 7: APPLY TO REAL WORD */}
          {currentStage === 'apply_word' && (
            <motion.div
              key="apply_word"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-5 text-center"
            >
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 inline-block mx-auto text-xs text-stone-300">
                <span className="text-rose-400 font-bold">৭ম ধাপ:</span> বাস্তব শব্দে এই বর্ণের ব্যবহার দেখুন।
              </div>

              <div className="p-6 rounded-3xl bg-[#141228] border border-white/10 space-y-4">
                <div className="text-xs text-stone-400">এই বর্ণ দিয়ে প্রথম আনলক হওয়া শব্দ:</div>

                {kana.exampleVocab && kana.exampleVocab.length > 0 ? (
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                    <div className="text-3xl font-black font-japanese text-amber-300">
                      {kana.exampleVocab[0].word}
                    </div>
                    <div className="text-xs font-mono text-stone-400">
                      [{kana.exampleVocab[0].reading}]
                    </div>
                    <div className="text-sm font-bold text-white">
                      {kana.exampleVocab[0].meaningBn}
                    </div>
                    <button
                      type="button"
                      onClick={() => speakJapanese(kana.exampleVocab[0].word, { rate: 0.85 })}
                      className="mx-auto mt-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold flex items-center gap-1.5 cursor-pointer text-stone-300"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>শব্দটি শুনুন</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-sm font-bold text-stone-300">
                    {kana.char} হলো জাপানি ভাষার মৌলিক উচ্চারণ ভিত্তি।
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleNextStage}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
              >
                <Award className="w-4 h-4" />
                <span>মাস্টারি স্বীকৃতি ও রিওয়ার্ড নিন 🎉</span>
              </button>
            </motion.div>
          )}

          {/* STAGE 8: MASTERY COMPLETE */}
          {currentStage === 'mastery_complete' && (
            <motion.div
              key="mastery_complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-5 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-white">
                  অভিনন্দন! '{kana.char}' সফলভাবে মাস্টার্ড 🎉
                </h3>
                <p className="text-xs text-stone-300">
                  বহুমাত্রিক প্রমাণের ভিত্তিতে এই বর্ণটি তোমার মেমরিতে স্থায়ীভাবে যুক্ত হয়েছে।
                </p>
              </div>

              {/* Multi-evidence status */}
              <div className="p-4 rounded-2xl bg-[#111024] border border-white/10 text-left text-xs space-y-2">
                <div className="text-[11px] font-mono uppercase text-stone-400 font-bold border-b border-white/5 pb-1">
                  Constitutional Mastery Evidence
                </div>
                <div className="grid grid-cols-2 gap-2 text-stone-300">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Visual Recognition: PASS</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Audio Recognition: PASS</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Memory Recall: PASS</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Stroke Interaction: PASS</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextStage}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
              >
                <span>পরের বর্ণ শিখতে এগিয়ে যাই →</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Play,
  CheckCircle2,
  Sparkles,
  Volume2,
  ArrowRight,
  Flame,
  Award,
  ChevronRight,
  Layers,
  FileText
} from 'lucide-react';
import { Course } from '../../types/nihomi';
import { speakJapanese } from '../../lib/tts';

interface LessonPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  onOpenFullLesson?: (lessonId: string) => void;
}

export const LessonPlayerModal: React.FC<LessonPlayerModalProps> = ({
  isOpen,
  onClose,
  course,
  onOpenFullLesson
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  if (!isOpen) return null;

  const mockCurriculum = [
    {
      id: 'l-1',
      title: `${course.title} • Module 1: Foundations & Script`,
      titleJa: '基礎概念と必須スクリプト',
      description: 'Core concepts, stroke patterns, and audio immersion breakdown.',
      samplePhrase: 'はじめまして。よろしくおねがいします。',
      romaji: 'Hajimemashite. Yoroshiku onegaishimasu.',
      english: 'Nice to meet you. Please treat me favorably.'
    },
    {
      id: 'l-2',
      title: `${course.title} • Module 2: Key Sentence Patterns`,
      titleJa: '文型活用と実践ドリル',
      description: 'Sentence structures, topic markers, and real-time pronunciation checking.',
      samplePhrase: 'これは 日本語の きょうかしょ です。',
      romaji: 'Kore wa nihongo no kyoukasho desu.',
      english: 'This is a Japanese textbook.'
    },
    {
      id: 'l-3',
      title: `${course.title} • Module 3: Active Conversational Application`,
      titleJa: '会話応用とロールプレイ',
      description: 'Interactive dialogue simulation and spaced repetition reinforcement.',
      samplePhrase: '東京で べんきょうしたいです。',
      romaji: 'Toukyou de benkyoushitai desu.',
      english: 'I want to study in Tokyo.'
    }
  ];

  const currentModule = mockCurriculum[activeStep] || mockCurriculum[0];

  const handleAudio = (text: string) => {
    setIsPlayingAudio(true);
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        
        // Pick high-quality Japanese voice if available
        const voices = window.speechSynthesis.getVoices();
        const jaVoice = voices.find(
          (v) => v.lang === 'ja-JP' || v.lang === 'ja_JP' || v.name.toLowerCase().includes('japanese') || v.name.toLowerCase().includes('kyoko') || v.name.toLowerCase().includes('otoya')
        );
        if (jaVoice) {
          utterance.voice = jaVoice;
        }

        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
      } else {
        speakJapanese(text);
        setTimeout(() => setIsPlayingAudio(false), 2000);
      }
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      speakJapanese(text);
      setTimeout(() => setIsPlayingAudio(false), 2000);
    }
  };

  return (
    <div
      id="lesson-player-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="lesson-player-dialog"
        className="bg-white dark:bg-stone-900 sepia:bg-[#fbf0d9] border border-slate-200 dark:border-stone-800 sepia:border-[#d9cbaf] rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-stone-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-rose-950/60 border border-red-200 dark:border-rose-800 text-red-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 bg-stone-900 dark:bg-stone-800 text-white text-[10px] font-bold rounded-md font-mono">
                  JLPT {course.level}
                </span>
                <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  {course.category}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {course.title}
              </h3>
            </div>
          </div>
          <button
            id="btn-close-lesson-player"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Lesson Preview Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-stone-50 to-stone-100/60 dark:from-stone-800/80 dark:to-stone-900 sepia:from-[#f5e9d2] sepia:to-[#ebdcc3] border border-stone-200 dark:border-stone-700 sepia:border-[#d9cbaf] space-y-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-red-600 dark:text-rose-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{course.currentLessonTitle || currentModule.title}</span>
            </div>
            <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 font-japanese">
              {currentModule.titleJa}
            </span>
          </div>

          <div className="bg-white dark:bg-stone-800/90 sepia:bg-[#fff9ed] p-4 rounded-xl border border-stone-200/80 dark:border-stone-700 sepia:border-[#d9cbaf] space-y-2">
            <div className="text-lg font-bold text-stone-900 dark:text-white font-japanese">
              {currentModule.samplePhrase}
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 font-mono">
              {currentModule.romaji}
            </div>
            <div className="text-xs text-stone-700 dark:text-stone-300 font-medium">
              {currentModule.english}
            </div>

            <div className="pt-2 flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleAudio(currentModule.samplePhrase)}
                className="inline-flex items-center space-x-1.5 px-3 py-1 bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-200 text-xs font-semibold rounded-lg transition-colors"
              >
                <Volume2 className={`w-3.5 h-3.5 text-red-600 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
                <span>Listen Audio</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modules List */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Curriculum Sequence ({course.completedLessons}/{course.totalLessons} completed)
          </h4>
          <div className="space-y-1.5">
            {mockCurriculum.map((mod, idx) => (
              <button
                key={mod.id}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between text-xs cursor-pointer ${
                  activeStep === idx
                    ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                    : 'bg-stone-50 hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700/80 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    activeStep === idx ? 'bg-red-500 text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                  }`}>
                    {idx + 1}
                  </div>
                  <span className="font-semibold truncate">{mod.title}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            ))}
          </div>
        </div>

        {/* Modal Action CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-stone-800">
          <div className="text-xs text-stone-500 dark:text-stone-400">
            {course.progressPercent}% mastered
          </div>
          <button
            id="btn-launch-full-lesson-view"
            type="button"
            onClick={() => {
              onClose();
              if (onOpenFullLesson) {
                onOpenFullLesson('n5-l1');
              }
            }}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <span>Open Full Interactive Lesson Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

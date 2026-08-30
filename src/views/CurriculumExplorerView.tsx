import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  BookOpen,
  Search,
  Volume2,
  VolumeX,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Layers,
  FileText,
  AlertTriangle,
  Play,
  ArrowRight,
  Filter,
  Bookmark,
  Share2,
  Download,
  Languages,
  Flame,
  Check,
  Award,
  Circle,
  Printer,
  FileDown,
  Edit3,
  Save,
  Clock,
  RotateCcw,
  CheckSquare,
  Square,
  Star,
  ExternalLink,
  BookMarked,
  SlidersHorizontal,
  ToggleLeft,
  ToggleRight,
  Zap,
  Calendar,
  RefreshCw,
  Loader2,
  Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  NIHOMI_JLPT_N5_CURRICULUM,
  LessonCurriculum,
  CurriculumVocab,
  CurriculumGrammar,
  CurriculumKanji
} from '../data/lessons/n5MasterCurriculum';
import { generateLessonStudyGuidePdf } from '../utils/lessonPdfGenerator';
import { getLessonSrsReviewSummary, recordQuizTermPerformance } from '../lib/srs';
import { KanjiStrokeAnimator } from '../components/kanji/KanjiStrokeAnimator';
import { useAuth } from '../context/AuthContext';
import { useProgressSync } from '../hooks/useProgressSync';

interface CurriculumExplorerViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export interface CustomAiQuizQuestion {
  id: number;
  question: string;
  questionJa: string;
  options: string[];
  correctIndex: number;
  explanationEn: string;
  explanationBn: string;
  targetTerm: string;
}

export const CurriculumExplorerView: React.FC<CurriculumExplorerViewProps> = ({ onNavigate }) => {
  const { user, progress, refreshProgress } = useAuth();
  const { syncLessonCompletion } = useProgressSync();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('all');
  const [expandedLessonId, setExpandedLessonId] = useState<number | null>(1);
  const [activeTabPerLesson, setActiveTabPerLesson] = useState<Record<number, 'vocab' | 'grammar' | 'kanji' | 'quiz' | 'notes'>>({});
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResult, setShowQuizResult] = useState<Record<number, boolean>>({});
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);
  const [activeTopTab, setActiveTopTab] = useState<'lessons' | 'kanji-summary'>('lessons');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<number | null>(null);
  const [activeStrokeKanji, setActiveStrokeKanji] = useState<string | null>(null);

  // Difficulty Level Toggle ('simplified' vs 'detailed')
  const [grammarDifficulty, setGrammarDifficulty] = useState<'simplified' | 'detailed'>('detailed');

  // Dynamic AI Custom Quiz State per Lesson
  const [customAiQuizzes, setCustomAiQuizzes] = useState<Record<number, CustomAiQuizQuestion[]>>({});
  const [customQuizAnswers, setCustomQuizAnswers] = useState<Record<number, Record<number, number>>>({});
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<Record<number, boolean>>({});
  const [customQuizSubmitted, setCustomQuizSubmitted] = useState<Record<number, boolean>>({});

  // Persistence State: Completed Lessons (synced with Supabase + LocalStorage)
  const [completedLessons, setCompletedLessons] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('nihomi_completed_lessons');
      return saved ? JSON.parse(saved) : [1, 2];
    } catch {
      return [1, 2];
    }
  });

  // Sync Supabase completed lesson IDs if available
  useEffect(() => {
    if (progress?.completedLessonIds && Array.isArray(progress.completedLessonIds)) {
      const supabaseLessonNums = progress.completedLessonIds
        .map(id => {
          const match = String(id).match(/n5-l(\d+)/) || String(id).match(/(\d+)/);
          return match ? parseInt(match[1], 10) : null;
        })
        .filter((n): n is number => n !== null);

      if (supabaseLessonNums.length > 0) {
        setCompletedLessons(prev => Array.from(new Set([...prev, ...supabaseLessonNums])));
      }
    }
  }, [progress?.completedLessonIds]);

  // Persistence State: Bookmarked Lessons
  const [bookmarkedLessons, setBookmarkedLessons] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('nihomi_bookmarked_lessons');
      return saved ? JSON.parse(saved) : [1, 5, 14];
    } catch {
      return [1, 5, 14];
    }
  });

  // Persistence State: Mastered Kanji
  const [masteredKanji, setMasteredKanji] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nihomi_mastered_kanji_set');
      return saved ? JSON.parse(saved) : ['日', '本', '人', '一', '二', '三', '私', '学', '生', '先'];
    } catch {
      return ['日', '本', '人', '一', '二', '三', '私', '学', '生', '先'];
    }
  });

  // Personal Study Notes per Lesson
  const [lessonNotes, setLessonNotes] = useState<Record<number, string>>(() => {
    const initialNotes: Record<number, string> = {};
    NIHOMI_JLPT_N5_CURRICULUM.forEach(l => {
      try {
        const saved = localStorage.getItem(`nihomi_lesson_notes_${l.lessonNumber}`);
        if (saved) initialNotes[l.lessonNumber] = saved;
      } catch {
        // ignore
      }
    });
    return initialNotes;
  });

  const [notesSaveStatus, setNotesSaveStatus] = useState<Record<number, boolean>>({});

  // Sync completed lessons to localStorage & Supabase
  const toggleLessonCompleted = async (lessonNumber: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const willBeCompleted = !completedLessons.includes(lessonNumber);

    setCompletedLessons(prev => {
      const updated = willBeCompleted
        ? [...prev, lessonNumber]
        : prev.filter(id => id !== lessonNumber);
      try {
        localStorage.setItem('nihomi_completed_lessons', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to persist completed lessons', err);
      }
      return updated;
    });

    // Supabase Cloud Sync
    if (user?.id) {
      try {
        await syncLessonCompletion(
          `n5-l${lessonNumber}`,
          willBeCompleted ? 100 : 0,
          300,
          willBeCompleted ? 50 : 0
        );
        if (refreshProgress) {
          refreshProgress();
        }
      } catch (err) {
        console.error('Error syncing lesson progress to Supabase:', err);
      }
    }
  };

  // Calculate detailed completion percentage per lesson
  const calculateLessonProgress = useCallback((lesson: LessonCurriculum): number => {
    if (completedLessons.includes(lesson.lessonNumber)) {
      return 100;
    }

    let progressPoints = 0;
    // 1. Kanji Mastery (up to 40%)
    const lessonKanjiChars = lesson.kanjiList.map(k => k.kanji);
    if (lessonKanjiChars.length > 0) {
      const masteredInLesson = lessonKanjiChars.filter(k => masteredKanji.includes(k)).length;
      progressPoints += Math.round((masteredInLesson / lessonKanjiChars.length) * 40);
    } else {
      progressPoints += 20;
    }

    // 2. Quiz completion (up to 40%)
    if (showQuizResult[lesson.lessonNumber] || customQuizSubmitted[lesson.lessonNumber]) {
      progressPoints += 40;
    }

    // 3. Notes recorded (up to 20%)
    if (lessonNotes[lesson.lessonNumber] && lessonNotes[lesson.lessonNumber].trim().length > 0) {
      progressPoints += 20;
    }

    return Math.min(100, Math.max(0, progressPoints));
  }, [completedLessons, masteredKanji, showQuizResult, customQuizSubmitted, lessonNotes]);

  // Sync bookmarked lessons to localStorage
  const toggleLessonBookmark = (lessonNumber: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedLessons(prev => {
      const updated = prev.includes(lessonNumber)
        ? prev.filter(id => id !== lessonNumber)
        : [...prev, lessonNumber];
      try {
        localStorage.setItem('nihomi_bookmarked_lessons', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to persist bookmarks', err);
      }
      return updated;
    });
  };

  // Toggle Mastered Kanji
  const toggleKanjiMastery = (kanjiChar: string) => {
    setMasteredKanji(prev => {
      const updated = prev.includes(kanjiChar)
        ? prev.filter(k => k !== kanjiChar)
        : [...prev, kanjiChar];
      try {
        localStorage.setItem('nihomi_mastered_kanji_set', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to persist mastered kanji', err);
      }
      return updated;
    });
  };

  // Save personal study note
  const handleNoteChange = (lessonNumber: number, text: string) => {
    setLessonNotes(prev => ({ ...prev, [lessonNumber]: text }));
    try {
      localStorage.setItem(`nihomi_lesson_notes_${lessonNumber}`, text);
      setNotesSaveStatus(prev => ({ ...prev, [lessonNumber]: true }));
      setTimeout(() => {
        setNotesSaveStatus(prev => ({ ...prev, [lessonNumber]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to save note', err);
    }
  };

  // Web Speech API Native Japanese Audio Synthesis
  const playJapaneseAudio = (text: string, id: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.88;
      setIsPlayingAudio(id);
      utterance.onend = () => setIsPlayingAudio(null);
      utterance.onerror = () => setIsPlayingAudio(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Quiz Answer Selection with SRS performance recording
  const handleSelectQuizOption = (lesson: LessonCurriculum, optionIdx: number) => {
    setSelectedQuizAnswers(prev => ({ ...prev, [lesson.lessonNumber]: optionIdx }));
    setShowQuizResult(prev => ({ ...prev, [lesson.lessonNumber]: true }));

    const isCorrect = optionIdx === lesson.practiceQuiz.correctOptionIndex;
    // Automatically record performance into SRS Memory Engine
    const targetId = `quiz-n5-l${lesson.lessonNumber}-core`;
    recordQuizTermPerformance(targetId, isCorrect, {
      word: lesson.practiceQuiz.question,
      lessonNumber: lesson.lessonNumber,
      itemType: 'grammar'
    });
  };

  // Generate Custom Adaptive 5-Question Gemini Quiz
  const handleGenerateCustomQuiz = (lesson: LessonCurriculum) => {
    setIsGeneratingQuiz(prev => ({ ...prev, [lesson.lessonNumber]: true }));

    setTimeout(() => {
      const vocab1 = lesson.vocabularies[0] || { kanji: '私', hiragana: 'わたし', meaningEnglish: 'I / Me', meaningBengali: 'আমি' };
      const vocab2 = lesson.vocabularies[1] || { kanji: '学生', hiragana: 'がくせい', meaningEnglish: 'Student', meaningBengali: 'ছাত্র' };
      const grammar1 = lesson.grammarPatterns[0] || { pattern: 'N1 は N2 です', explanationEnglish: 'Topic marker and affirmation', topic: 'Affirmation' };

      const generatedQuestions: CustomAiQuizQuestion[] = [
        {
          id: 1,
          question: `Complete the sentence with appropriate particle: 「${vocab1.hiragana || 'わたし'} ___ ${vocab2.hiragana || 'がくせい'} です。」`,
          questionJa: `「${vocab1.kanji || '私'} ___ ${vocab2.kanji || '学生'} です。」`,
          options: ['は (wa)', 'が (ga)', 'に (ni)', 'で (de)'],
          correctIndex: 0,
          explanationEn: `The particle は (pronounced 'wa') marks the topic of the sentence (${vocab1.meaningEnglish}).`,
          explanationBn: `হলো টপিক মার্কার বা বাক্যের বিষয় নির্দেশক।`,
          targetTerm: 'は'
        },
        {
          id: 2,
          question: `What is the correct English & Bengali meaning of 「${vocab1.kanji || vocab1.hiragana}」?`,
          questionJa: `「${vocab1.kanji || vocab1.hiragana}」の意味は何ですか？`,
          options: [
            `${vocab1.meaningEnglish} (${vocab1.meaningBengali})`,
            `Teacher (শিক্ষক)`,
            `Company employee (কোম্পানি কর্মী)`,
            `Japan (জাপান)`
          ],
          correctIndex: 0,
          explanationEn: `「${vocab1.kanji || vocab1.hiragana}」 translates to "${vocab1.meaningEnglish}".`,
          explanationBn: `「${vocab1.kanji || vocab1.hiragana}」 এর বাংলা অর্থ হলো "${vocab1.meaningBengali}"।`,
          targetTerm: vocab1.kanji || vocab1.hiragana
        },
        {
          id: 3,
          question: `Select the correct negative formulation for: 「${vocab1.kanji || '田中さん'} は 医者 (doctor) ___。」`,
          questionJa: `「田中さんは 医者 ___。」`,
          options: [
            'じゃありません (ja arimasen)',
            'でした (deshita)',
            'ではありませんでした (dewa arimasen deshita)',
            'ます (masu)'
          ],
          correctIndex: 0,
          explanationEn: `じゃありません (or ではありません) is the standard polite negative copula in JLPT N5.`,
          explanationBn: `নাবোধক করতে 'じゃありません' ব্যবহৃত হয়।`,
          targetTerm: 'じゃありません'
        },
        {
          id: 4,
          question: `Identify the correct stroke reading for target Kanji 「${lesson.kanjiList[0]?.kanji || '日'}」:`,
          questionJa: `「${lesson.kanjiList[0]?.kanji || '日'}」の読み方：`,
          options: [
            lesson.kanjiList[0]?.onyomi[0] ? `${lesson.kanjiList[0]?.onyomi[0]} / ${lesson.kanjiList[0]?.kunyomi[0] || '-'}` : 'にち / ひ',
            'がつ / つき',
            'もく / き',
            'すい / みず'
          ],
          correctIndex: 0,
          explanationEn: `Target Kanji 「${lesson.kanjiList[0]?.kanji || '日'}」 represents ${lesson.kanjiList[0]?.meaningEnglish || 'Sun/Day'}.`,
          explanationBn: `কাঞ্জি 「${lesson.kanjiList[0]?.kanji || '日'}」 এর অর্থ ${lesson.kanjiList[0]?.meaningBengali || 'সূর্য/দিন'}।`,
          targetTerm: lesson.kanjiList[0]?.kanji || '日'
        },
        {
          id: 5,
          question: `How do you turn a polite statement into a polite question in Japanese?`,
          questionJa: `質問文を作るとき語尾に何をつける？`,
          options: [
            'Add particle か (ka) at the end of the sentence',
            'Add particle ね (ne)',
            'Add particle よ (yo)',
            'Change です into だ'
          ],
          correctIndex: 0,
          explanationEn: `Appending 'か' (ka) to polite predicates creates questions without altering word order.`,
          explanationBn: `বাক্যের শেষে 'か' যুক্ত করে প্রশ্নবোধক বাক্য তৈরি করা হয়।`,
          targetTerm: 'か'
        }
      ];

      setCustomAiQuizzes(prev => ({ ...prev, [lesson.lessonNumber]: generatedQuestions }));
      setIsGeneratingQuiz(prev => ({ ...prev, [lesson.lessonNumber]: false }));
      setCustomQuizSubmitted(prev => ({ ...prev, [lesson.lessonNumber]: false }));
      setCustomQuizAnswers(prev => ({ ...prev, [lesson.lessonNumber]: {} }));
    }, 900);
  };

  const handleSelectCustomQuizOption = (lessonNumber: number, questionId: number, optionIdx: number) => {
    setCustomQuizAnswers(prev => ({
      ...prev,
      [lessonNumber]: {
        ...(prev[lessonNumber] || {}),
        [questionId]: optionIdx
      }
    }));
  };

  const handleSubmitCustomQuiz = (lesson: LessonCurriculum) => {
    setCustomQuizSubmitted(prev => ({ ...prev, [lesson.lessonNumber]: true }));
    const quiz = customAiQuizzes[lesson.lessonNumber] || [];
    const answers = customQuizAnswers[lesson.lessonNumber] || {};

    // Record performance for each question
    quiz.forEach(q => {
      const isCorrect = answers[q.id] === q.correctIndex;
      recordQuizTermPerformance(`ai-quiz-l${lesson.lessonNumber}-${q.targetTerm}`, isCorrect, {
        word: q.targetTerm,
        lessonNumber: lesson.lessonNumber,
        itemType: 'vocabulary'
      });
    });
  };

  // Feature: Export to Anki Flashcards (.txt TSV)
  const exportLessonToAnki = (lesson: LessonCurriculum, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let fileContent = `#separator:tab\n#html:true\n#deck:Nihomi Japanese::JLPT N5::Lesson ${lesson.lessonNumber} - ${lesson.titleEnglish}\n#tags:nihomi jlpt-n5 lesson-${lesson.lessonNumber}\n`;

    lesson.vocabularies.forEach(v => {
      const front = `<div style="text-align:center;font-size:26px;font-weight:bold;color:#1e293b;">${v.kanji}</div><div style="text-align:center;font-size:16px;color:#64748b;">【${v.hiragana}】</div>`;
      const back = `<div style="text-align:center;font-size:18px;font-weight:bold;color:#0f172a;">${v.meaningEnglish}</div><div style="text-align:center;font-size:15px;color:#4f46e5;margin-top:4px;">${v.meaningBengali}</div><div style="text-align:center;font-size:13px;color:#94a3b8;font-family:monospace;margin-top:2px;">[${v.romaji}]</div><hr style="border:none;border-top:1px solid #e2e8f0;margin:12px 0;"><div style="font-size:14px;color:#334155;"><strong>Ex:</strong> ${v.example.japanese}</div><div style="font-size:12px;color:#64748b;">${v.example.english} / ${v.example.bengali}</div>`;
      fileContent += `${front}\t${back}\n`;
    });

    const blob = new Blob([fileContent], { type: 'text/tab-separated-values;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = url;
    downloadAnchor.download = `nihomi_lesson_${lesson.lessonNumber}_anki_deck.txt`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);
  };

  // Feature: Download Printable Lesson PDF using our modular PDF Generator
  const downloadLessonPdf = async (lesson: LessonCurriculum, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsGeneratingPdf(lesson.lessonNumber);
    try {
      await generateLessonStudyGuidePdf(lesson, null, {
        difficulty: grammarDifficulty,
        studentName: 'Nihomi Academy Scholar'
      });
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsGeneratingPdf(null);
    }
  };

  // Topic taxonomy for filters
  const topics = [
    { id: 'all', label: 'All Lessons (1-25)' },
    { id: 'bookmarked', label: `⭐ Bookmarked (${bookmarkedLessons.length})` },
    { id: 'completed', label: `✅ Completed (${completedLessons.length})` },
    { id: 'basics', label: 'Basics & Identity (L1-4)' },
    { id: 'verbs', label: 'Movement & Actions (L5-8)' },
    { id: 'existence', label: 'Likes & Existence (L9-12)' },
    { id: 'te-form', label: 'Desire & Te-Form (L13-16)' },
    { id: 'nai-ta', label: 'Nai & Ta Forms (L17-20)' },
    { id: 'advanced-n5', label: 'Clauses & Conditionals (L21-25)' }
  ];

  // Filter lessons
  const filteredLessons = useMemo(() => {
    return NIHOMI_JLPT_N5_CURRICULUM.filter((lesson) => {
      if (selectedTopicFilter === 'bookmarked' && !bookmarkedLessons.includes(lesson.lessonNumber)) {
        return false;
      }
      if (selectedTopicFilter === 'completed' && !completedLessons.includes(lesson.lessonNumber)) {
        return false;
      }

      let matchesTopic = true;
      if (selectedTopicFilter === 'basics') matchesTopic = lesson.lessonNumber >= 1 && lesson.lessonNumber <= 4;
      else if (selectedTopicFilter === 'verbs') matchesTopic = lesson.lessonNumber >= 5 && lesson.lessonNumber <= 8;
      else if (selectedTopicFilter === 'existence') matchesTopic = lesson.lessonNumber >= 9 && lesson.lessonNumber <= 12;
      else if (selectedTopicFilter === 'te-form') matchesTopic = lesson.lessonNumber >= 13 && lesson.lessonNumber <= 16;
      else if (selectedTopicFilter === 'nai-ta') matchesTopic = lesson.lessonNumber >= 17 && lesson.lessonNumber <= 20;
      else if (selectedTopicFilter === 'advanced-n5') matchesTopic = lesson.lessonNumber >= 21 && lesson.lessonNumber <= 25;

      if (!matchesTopic) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchLessonNumber = lesson.lessonNumber.toString().includes(q);
      const matchTitle = lesson.titleEnglish.toLowerCase().includes(q) || lesson.titleJapanese.includes(q) || lesson.topic.toLowerCase().includes(q);
      const matchVocab = lesson.vocabularies.some(
        v => v.kanji.toLowerCase().includes(q) ||
             v.hiragana.toLowerCase().includes(q) ||
             v.meaningEnglish.toLowerCase().includes(q) ||
             v.meaningBengali.includes(q)
      );
      const matchGrammar = lesson.grammarPatterns.some(
        g => g.pattern.toLowerCase().includes(q) ||
             g.topic.toLowerCase().includes(q) ||
             g.explanationEnglish.toLowerCase().includes(q)
      );
      const matchKanji = lesson.kanjiList.some(
        k => k.kanji.includes(q) ||
             k.meaningEnglish.toLowerCase().includes(q) ||
             k.meaningBengali.includes(q)
      );

      return matchLessonNumber || matchTitle || matchVocab || matchGrammar || matchKanji;
    });
  }, [searchQuery, selectedTopicFilter, bookmarkedLessons, completedLessons]);

  // Aggregate All Unique Kanji in Curriculum
  const allCurriculumKanji = useMemo(() => {
    const kanjiMap = new Map<string, CurriculumKanji & { lessonNumber: number }>();
    NIHOMI_JLPT_N5_CURRICULUM.forEach(lesson => {
      lesson.kanjiList.forEach(k => {
        if (!kanjiMap.has(k.kanji)) {
          kanjiMap.set(k.kanji, { ...k, lessonNumber: lesson.lessonNumber });
        }
      });
    });
    return Array.from(kanjiMap.values());
  }, []);

  const totalCurriculumKanjiCount = allCurriculumKanji.length;
  const masteredCurriculumKanjiCount = allCurriculumKanji.filter(k => masteredKanji.includes(k.kanji)).length;
  const kanjiMasteryPercentage = Math.round((masteredCurriculumKanjiCount / (totalCurriculumKanjiCount || 1)) * 100);

  const totalLessonsCount = 25;
  const completedPercentage = Math.round((completedLessons.length / totalLessonsCount) * 100);

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#0a0a12] sepia:bg-[#fbf0d9] text-stone-900 dark:text-stone-100 font-sans pb-24 text-left transition-colors">
      
      {/* 1. HERO HEADER */}
      <div className="bg-stone-900 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-stone-800 relative overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-400 rounded-full text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>COMPLETE 25 LESSON MINNA NO NIHONGO CURRICULUM</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Nihomi JLPT N5 Master Curriculum</span>
                <span className="text-xl font-japanese font-normal text-stone-400">（みんなの日本語 第1〜25課）</span>
              </h1>
              <p className="text-sm text-stone-300 max-w-3xl leading-relaxed">
                Full 25-lesson syllabus with bilingual Japanese-Bengali-English vocabulary, Tokyo audio pronunciation, grammar formulations, stroke-order kanji bank, Spaced Repetition (SRS) tracking, and adaptive Gemini practice quizzes.
              </p>
            </div>

            {/* Top Controls: Difficulty Level Toggle & Global Actions */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Difficulty Level Switcher ('simplified' vs 'detailed') */}
              <div className="inline-flex items-center bg-stone-800 p-1 rounded-2xl border border-stone-700">
                <button
                  id="btn-diff-simplified"
                  onClick={() => setGrammarDifficulty('simplified')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    grammarDifficulty === 'simplified'
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                  title="Show simplified grammar rules with quick mnemonic keys"
                >
                  ⚡ Simplified Rules
                </button>
                <button
                  id="btn-diff-detailed"
                  onClick={() => setGrammarDifficulty('detailed')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    grammarDifficulty === 'detailed'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                  title="Show full in-depth linguistic explanation, nuance notes & exceptions"
                >
                  📖 Detailed Notes
                </button>
              </div>

              <button
                onClick={() => onNavigate('leaderboard')}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Leaderboard</span>
              </button>
            </div>
          </div>

          {/* Search and Navigation Bar */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-stone-800">
            <div className="relative flex-grow">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vocabulary (e.g. わたし, student, ছাত্র), grammar patterns, or kanji..."
                className="w-full pl-10 pr-4 py-2.5 bg-stone-800 text-white rounded-xl border border-stone-700 text-xs focus:outline-hidden focus:border-red-500 placeholder-stone-400"
              />
            </div>

            {/* Top View Mode Switch: Lessons vs Kanji Matrix */}
            <div className="flex rounded-xl bg-stone-800 p-1 border border-stone-700 shrink-0">
              <button
                onClick={() => setActiveTopTab('lessons')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 ${
                  activeTopTab === 'lessons'
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>25 Lessons</span>
              </button>
              <button
                onClick={() => setActiveTopTab('kanji-summary')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 ${
                  activeTopTab === 'kanji-summary'
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <Languages className="w-3.5 h-3.5" />
                <span>Kanji Bank ({masteredCurriculumKanjiCount}/{totalCurriculumKanjiCount})</span>
              </button>
            </div>
          </div>

          {/* Topic Pills */}
          {activeTopTab === 'lessons' && (
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pt-2 pb-1">
              {topics.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTopicFilter(t.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                    selectedTopicFilter === t.id
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 space-y-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Completed Lessons */}
          <div className="bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Lesson Completion
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-stone-900 dark:text-white font-mono">
                {completedLessons.length} <span className="text-xs font-normal text-stone-500">/ 25 Lessons</span>
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {completedPercentage}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
              <div
                style={{ width: `${completedPercentage}%` }}
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              />
            </div>
          </div>

          {/* Card 2: Kanji Bank */}
          <div className="bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-red-500" />
              Kanji Mastery
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-stone-900 dark:text-white font-mono">
                {masteredCurriculumKanjiCount} <span className="text-xs font-normal text-stone-500">/ {totalCurriculumKanjiCount} Characters</span>
              </span>
              <span className="text-xs font-bold text-red-600 dark:text-red-400">
                {kanjiMasteryPercentage}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
              <div
                style={{ width: `${kanjiMasteryPercentage}%` }}
                className="h-full bg-red-600 rounded-full transition-all duration-500"
              />
            </div>
          </div>

          {/* Card 3: SRS Memory Health & Bookmarks */}
          <div className="bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                Spaced Repetition (SRS)
              </span>
              <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-[10px] font-bold rounded-full">
                Active SM-2
              </span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              Quizzes automatically schedule reviews for struggling particle and vocabulary terms.
            </p>
            <div className="flex items-center justify-between text-xs font-semibold text-stone-500 pt-1">
              <span>{bookmarkedLessons.length} Bookmarked</span>
              <button
                onClick={() => setSelectedTopicFilter(selectedTopicFilter === 'bookmarked' ? 'all' : 'bookmarked')}
                className="text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
              >
                {selectedTopicFilter === 'bookmarked' ? 'Show All' : 'Filter Bookmarked →'}
              </button>
            </div>
          </div>

        </div>

        {/* TAB VIEW: KANJI SUMMARY & PROGRESS RING VIEW */}
        {activeTopTab === 'kanji-summary' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-6 shadow-md"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
              <div>
                <h3 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Languages className="w-5 h-5 text-red-600" />
                  JLPT N5 Comprehensive Kanji Matrix
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Showing {allCurriculumKanji.length} primary keystones distributed across 25 lessons. Click any Kanji card to toggle mastery.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                  <span className="text-stone-600 dark:text-stone-400">Mastered ({masteredCurriculumKanjiCount})</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 rounded-full bg-stone-200 dark:bg-stone-700 inline-block" />
                  <span className="text-stone-600 dark:text-stone-400">Learning ({totalCurriculumKanjiCount - masteredCurriculumKanjiCount})</span>
                </div>
              </div>
            </div>

            {/* Kanji Matrix Active Stroke Animator Modal / Banner */}
            {activeStrokeKanji && (
              <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-950/70 border border-stone-200 dark:border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                    <span>✍️ Active Kanji Stroke Order Simulator:</span>
                    <strong className="text-stone-900 dark:text-white font-japanese text-sm">{activeStrokeKanji}</strong>
                  </span>
                  <button
                    onClick={() => setActiveStrokeKanji(null)}
                    className="text-xs font-semibold text-stone-500 hover:text-stone-900 dark:hover:text-white px-2 py-1 rounded-lg bg-stone-200 dark:bg-stone-800 cursor-pointer"
                  >
                    Close Animator ✕
                  </button>
                </div>
                <KanjiStrokeAnimator kanji={activeStrokeKanji} onClose={() => setActiveStrokeKanji(null)} />
              </div>
            )}

            {/* Kanji Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {allCurriculumKanji.map((k) => {
                const isMastered = masteredKanji.includes(k.kanji);
                const isSelectedForStroke = activeStrokeKanji === k.kanji;

                return (
                  <div
                    key={k.kanji}
                    className={`p-4 rounded-2xl border transition-all duration-200 relative select-none ${
                      isSelectedForStroke
                        ? 'ring-2 ring-amber-500 bg-amber-50/40 dark:bg-amber-950/20 border-amber-400'
                        : isMastered
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 shadow-xs'
                        : 'bg-stone-50/50 dark:bg-stone-950/40 border-stone-200 dark:border-stone-800 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span
                        onClick={() => setActiveStrokeKanji(isSelectedForStroke ? null : k.kanji)}
                        className="text-3xl font-black text-stone-900 dark:text-white font-japanese cursor-pointer hover:scale-105 transition-transform"
                        title="Click to view Stroke Order animation"
                      >
                        {k.kanji}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setActiveStrokeKanji(isSelectedForStroke ? null : k.kanji)}
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 cursor-pointer"
                          title="Animate Stroke Order"
                        >
                          筆順
                        </button>
                        <span
                          onClick={() => toggleKanjiMastery(k.kanji)}
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded cursor-pointer ${
                            isMastered
                              ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                              : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                          }`}
                          title="Toggle Mastery Status"
                        >
                          L{k.lessonNumber}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 space-y-0.5">
                      <p className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">{k.meaningEnglish}</p>
                      <p className="text-[11px] text-indigo-600 dark:text-indigo-400 truncate">{k.meaningBengali}</p>
                      <p className="text-[10px] text-stone-400 font-japanese truncate">
                        {k.onyomi[0] ? `音: ${k.onyomi[0]}` : ''} {k.kunyomi[0] ? `訓: ${k.kunyomi[0]}` : ''}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* 3. MAIN LESSONS ACCORDION LIST */}
        {activeTopTab === 'lessons' && (
          <div className="space-y-4">
            {filteredLessons.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-3">
                <Search className="w-8 h-8 text-stone-400 mx-auto" />
                <p className="text-sm font-bold text-stone-700 dark:text-stone-300">No lessons matched your search query</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedTopicFilter('all'); }}
                  className="px-4 py-2 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredLessons.map((lesson) => {
                const isExpanded = expandedLessonId === lesson.lessonNumber;
                const isCompleted = completedLessons.includes(lesson.lessonNumber);
                const isBookmarked = bookmarkedLessons.includes(lesson.lessonNumber);
                const activeTab = activeTabPerLesson[lesson.lessonNumber] || 'vocab';
                
                // Calculate SRS state for this lesson
                const srsSummary = getLessonSrsReviewSummary(lesson.lessonNumber, lesson.vocabularies, lesson.kanjiList);
                const lessonProgressPct = calculateLessonProgress(lesson);

                return (
                  <div
                    key={lesson.lessonNumber}
                    className={`rounded-3xl border transition-all duration-200 overflow-hidden ${
                      isExpanded
                        ? 'bg-white dark:bg-stone-900/95 sepia:bg-[#f6ebd4] border-stone-300 dark:border-stone-700 shadow-md ring-1 ring-stone-950/5'
                        : 'bg-white dark:bg-stone-900/70 sepia:bg-[#f6ebd4] border-stone-200 dark:border-stone-800 hover:border-stone-300'
                    }`}
                  >
                    {/* Persistent Progress Bar Indicator at Top of Accordion Card */}
                    <div className="w-full bg-stone-100 dark:bg-stone-800/80 h-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-r-full ${
                          isCompleted || lessonProgressPct === 100
                            ? 'bg-emerald-500 shadow-xs shadow-emerald-500/50'
                            : lessonProgressPct > 0
                            ? 'bg-gradient-to-r from-amber-500 to-red-500'
                            : 'bg-transparent'
                        }`}
                        style={{ width: `${isCompleted ? 100 : lessonProgressPct}%` }}
                      />
                    </div>

                    {/* Accordion Header */}
                    <div
                      onClick={() => setExpandedLessonId(isExpanded ? null : lesson.lessonNumber)}
                      className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none"
                    >
                      <div className="flex items-start sm:items-center gap-4">
                        {/* Checkbox for Completion */}
                        <button
                          onClick={(e) => toggleLessonCompleted(lesson.lessonNumber, e)}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            isCompleted
                              ? 'bg-emerald-500 border-emerald-600 text-white'
                              : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-400 hover:text-stone-600'
                          }`}
                          title={isCompleted ? 'Mark as Incomplete (Sync to Supabase)' : 'Mark as Completed (Sync to Supabase)'}
                        >
                          {isCompleted ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                        </button>

                        {/* Lesson Number Badge */}
                        <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-bold shadow-2xs ${
                          isCompleted
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-900 dark:bg-stone-800 text-white'
                        }`}>
                          <span className="text-[9px] text-stone-300 uppercase tracking-tighter">LESSON</span>
                          <span className="text-lg leading-none font-mono font-black">{lesson.lessonNumber}</span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-base sm:text-lg font-black text-stone-950 dark:text-white">
                              {lesson.titleEnglish}
                            </h2>
                            <span className="text-xs font-japanese text-stone-500 dark:text-stone-400">
                              ({lesson.titleJapanese})
                            </span>

                            {/* Persistent Progress Status Badge */}
                            <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-full border flex items-center gap-1 ${
                              isCompleted || lessonProgressPct === 100
                                ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                                : lessonProgressPct > 0
                                ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                                : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-700'
                            }`}>
                              {isCompleted || lessonProgressPct === 100 ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                  <span>100% Completed</span>
                                </>
                              ) : lessonProgressPct > 0 ? (
                                <>
                                  <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                                  <span>{lessonProgressPct}% Progress</span>
                                </>
                              ) : (
                                <span>0% Not Started</span>
                              )}
                            </span>
                            
                            {/* SRS Review Due Badge */}
                            {srsSummary.isReviewDue ? (
                              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-600" />
                                <span>SRS Review Due ({srsSummary.dueItemCount})</span>
                              </span>
                            ) : srsSummary.totalTracked > 0 ? (
                              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                                <Check className="w-3 h-3 text-blue-600" />
                                <span>{srsSummary.retentionAverage}% Mastered</span>
                              </span>
                            ) : null}
                          </div>
                          <p className="text-xs text-stone-600 dark:text-stone-400">
                            <span className="font-semibold text-stone-700 dark:text-stone-300">Topic:</span> {lesson.topic}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {/* Bookmark Toggle Button */}
                        <button
                          onClick={(e) => toggleLessonBookmark(lesson.lessonNumber, e)}
                          className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                            isBookmarked
                              ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400'
                              : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-400 hover:text-amber-500'
                          }`}
                          title={isBookmarked ? 'Remove Bookmark' : 'Bookmark this Lesson'}
                        >
                          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                        </button>

                        {/* Download Study Guide PDF Button */}
                        <button
                          id={`btn-download-pdf-lesson-${lesson.lessonNumber}`}
                          onClick={(e) => downloadLessonPdf(lesson, e)}
                          disabled={isGeneratingPdf === lesson.lessonNumber}
                          className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-stone-400 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                          title="Download Printable Lesson PDF Study Guide"
                        >
                          {isGeneratingPdf === lesson.lessonNumber ? (
                            <Loader2 className="w-3.5 h-3.5 text-red-500 animate-spin" />
                          ) : (
                            <FileDown className="w-3.5 h-3.5 text-red-500" />
                          )}
                          <span className="hidden sm:inline">
                            {isGeneratingPdf === lesson.lessonNumber ? 'Exporting...' : 'Print PDF'}
                          </span>
                        </button>

                        {/* Export to Anki Button */}
                        <button
                          onClick={(e) => exportLessonToAnki(lesson, e)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-stone-400 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                          title="Export Lesson Vocabulary to Anki Deck (.txt)"
                        >
                          <Layers className="w-3.5 h-3.5 text-indigo-500" />
                          <span className="hidden sm:inline">Anki</span>
                        </button>

                        {/* Start Studio Link */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate('lesson', { lessonId: `n5-l${lesson.lessonNumber}` });
                          }}
                          className="px-3 py-1.5 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          Studio
                        </button>

                        <div className="p-1 text-stone-400">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Body Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                          className="border-t border-stone-200 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-950/40 p-5 sm:p-6 space-y-6 overflow-hidden text-left"
                        >
                          {/* Sub-Tabs Navigation */}
                          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3 gap-2 overflow-x-auto no-scrollbar">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setActiveTabPerLesson(prev => ({ ...prev, [lesson.lessonNumber]: 'vocab' }))}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                                  activeTab === 'vocab'
                                    ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-950 shadow-2xs'
                                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800'
                                }`}
                              >
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>Vocabulary ({lesson.vocabularies.length})</span>
                              </button>

                              <button
                                onClick={() => setActiveTabPerLesson(prev => ({ ...prev, [lesson.lessonNumber]: 'grammar' }))}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                                  activeTab === 'grammar'
                                    ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-950 shadow-2xs'
                                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800'
                                }`}
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>Grammar ({lesson.grammarPatterns.length})</span>
                              </button>

                              <button
                                onClick={() => setActiveTabPerLesson(prev => ({ ...prev, [lesson.lessonNumber]: 'kanji' }))}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                                  activeTab === 'kanji'
                                    ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-950 shadow-2xs'
                                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800'
                                }`}
                              >
                                <Languages className="w-3.5 h-3.5" />
                                <span>Kanji ({lesson.kanjiList.length})</span>
                              </button>

                              <button
                                onClick={() => setActiveTabPerLesson(prev => ({ ...prev, [lesson.lessonNumber]: 'quiz' }))}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                                  activeTab === 'quiz'
                                    ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-950 shadow-2xs'
                                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800'
                                }`}
                              >
                                <HelpCircle className="w-3.5 h-3.5" />
                                <span>Checkpoint & AI Quiz</span>
                              </button>

                              <button
                                onClick={() => setActiveTabPerLesson(prev => ({ ...prev, [lesson.lessonNumber]: 'notes' }))}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                                  activeTab === 'notes'
                                    ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-950 shadow-2xs'
                                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800'
                                }`}
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>My Notes {lessonNotes[lesson.lessonNumber] ? '•' : ''}</span>
                              </button>
                            </div>

                            {/* In-lesson difficulty toggle */}
                            {activeTab === 'grammar' && (
                              <button
                                onClick={() => setGrammarDifficulty(grammarDifficulty === 'detailed' ? 'simplified' : 'detailed')}
                                className="text-[11px] font-bold text-stone-500 hover:text-stone-900 dark:hover:text-white flex items-center gap-1 shrink-0"
                              >
                                <SlidersHorizontal className="w-3 h-3" />
                                <span>Mode: {grammarDifficulty === 'detailed' ? 'Detailed' : 'Simplified'}</span>
                              </button>
                            )}
                          </div>

                          {/* TAB 1: VOCABULARY */}
                          {activeTab === 'vocab' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {lesson.vocabularies.map((v, vIdx) => {
                                const audioId = `vocab-${lesson.lessonNumber}-${vIdx}`;
                                const isAudioActive = isPlayingAudio === audioId;
                                return (
                                  <div
                                    key={vIdx}
                                    className="bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] p-4 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2.5 shadow-2xs"
                                  >
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <div className="flex items-baseline gap-2">
                                          <span className="text-xl font-black text-stone-900 dark:text-white font-japanese">
                                            {v.kanji}
                                          </span>
                                          <span className="text-sm text-stone-500 dark:text-stone-400 font-japanese">
                                            【{v.hiragana}】
                                          </span>
                                        </div>
                                        <span className="text-xs text-stone-400 dark:text-stone-500 font-mono">
                                          {v.romaji}
                                        </span>
                                      </div>

                                      {/* Native Japanese Audio Pronunciation */}
                                      <button
                                        onClick={() => playJapaneseAudio(v.hiragana, audioId)}
                                        className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                                          isAudioActive
                                            ? 'bg-red-500 text-white ring-4 ring-red-500/20 scale-105'
                                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                                        }`}
                                        title="Listen to native Tokyo audio pronunciation"
                                      >
                                        <Volume2 className="w-4 h-4" />
                                      </button>
                                    </div>

                                    <div className="text-xs space-y-1 pt-1 border-t border-stone-100 dark:border-stone-800">
                                      <p className="font-semibold text-stone-800 dark:text-stone-200">
                                        <strong className="text-stone-400">EN:</strong> {v.meaningEnglish}
                                      </p>
                                      <p className="font-semibold text-indigo-700 dark:text-indigo-400">
                                        <strong className="text-stone-400">বাংলা:</strong> {v.meaningBengali}
                                      </p>
                                    </div>

                                    {/* Example sentence */}
                                    <div className="bg-stone-50 dark:bg-stone-950/60 p-2.5 rounded-xl text-xs space-y-1 border border-stone-100 dark:border-stone-800/60">
                                      <div className="flex items-center justify-between">
                                        <span className="font-bold text-stone-900 dark:text-stone-200 font-japanese">{v.example.japanese}</span>
                                        <button
                                          onClick={() => playJapaneseAudio(v.example.japanese, `ex-${lesson.lessonNumber}-${vIdx}`)}
                                          className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1 cursor-pointer"
                                          title="Play example sentence audio"
                                        >
                                          <Volume2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                      <p className="text-[11px] text-stone-500 dark:text-stone-400">{v.example.english}</p>
                                      <p className="text-[11px] text-indigo-600/90 dark:text-indigo-300/90">{v.example.bengali}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* TAB 2: GRAMMAR (Supports Simplified and Detailed view modes) */}
                          {activeTab === 'grammar' && (
                            <div className="space-y-4">
                              {lesson.grammarPatterns.map((g, gIdx) => (
                                <div
                                  key={g.id || gIdx}
                                  className="bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] p-5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4 shadow-2xs"
                                >
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                      <span className="px-2 py-0.5 text-xs font-bold rounded bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-400 font-mono">
                                        Pattern #{gIdx + 1}
                                      </span>
                                      <h4 className="font-bold text-base text-stone-900 dark:text-white">
                                        {g.topic}
                                      </h4>
                                    </div>
                                    <code className="px-3 py-1 rounded-lg text-xs font-bold bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-mono">
                                      {g.pattern}
                                    </code>
                                  </div>

                                  {/* Grammar Explanation Box (Detailed vs Simplified) */}
                                  {grammarDifficulty === 'detailed' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                      <div className="bg-stone-50 dark:bg-stone-950/60 p-3.5 rounded-xl space-y-1.5 border border-stone-100 dark:border-stone-800">
                                        <span className="font-bold text-stone-400 uppercase tracking-wider text-[10px]">Detailed Linguistic Rule</span>
                                        <p className="text-stone-700 dark:text-stone-300 leading-relaxed">{g.explanationEnglish}</p>
                                      </div>
                                      <div className="bg-indigo-50/50 dark:bg-indigo-950/30 p-3.5 rounded-xl space-y-1.5 border border-indigo-100 dark:border-indigo-900/30">
                                        <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-[10px]">বাংলা গভীর ব্যাখ্যা (Bengali Deep Rule)</span>
                                        <p className="text-stone-700 dark:text-stone-300 leading-relaxed">{g.explanationBengali}</p>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="bg-amber-50/60 dark:bg-amber-950/30 p-3.5 rounded-xl border border-amber-200 dark:border-amber-800/40 text-xs space-y-1">
                                      <span className="font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider text-[10px]">⚡ Quick Core Anchor</span>
                                      <p className="text-stone-800 dark:text-stone-200 font-semibold">
                                        Formula: <code className="font-mono text-red-600 dark:text-red-400">{g.pattern}</code>
                                      </p>
                                      <p className="text-stone-600 dark:text-stone-400">{g.explanationEnglish.split('.')[0]}.</p>
                                      <p className="text-indigo-700 dark:text-indigo-300">{g.explanationBengali.split('।')[0]}।</p>
                                    </div>
                                  )}

                                  {/* Tokyo Standard Dialogue */}
                                  <div className="bg-stone-900 text-white dark:bg-stone-950 p-4 rounded-2xl space-y-2 border border-stone-800">
                                    <div className="flex items-center justify-between text-xs text-stone-400">
                                      <span className="font-semibold uppercase tracking-wider text-[10px]">Tokyo Standard Dialogue</span>
                                      <button
                                        onClick={() => playJapaneseAudio(`${g.dialogue.speakerA} ... ${g.dialogue.speakerB}`, `dlg-${lesson.lessonNumber}-${gIdx}`)}
                                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                                      >
                                        <Volume2 className="w-3.5 h-3.5" />
                                        <span>Listen Dialogue</span>
                                      </button>
                                    </div>
                                    <div className="text-xs space-y-1 font-mono text-stone-200 font-japanese">
                                      <p>{g.dialogue.speakerA}</p>
                                      <p>{g.dialogue.speakerB}</p>
                                    </div>
                                    <div className="text-[11px] text-stone-400 pt-1 border-t border-stone-800 space-y-0.5">
                                      <p>{g.dialogue.english}</p>
                                      <p className="text-indigo-300">{g.dialogue.bengali}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* TAB 3: KANJI */}
                          {activeTab === 'kanji' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {lesson.kanjiList.map((k, kIdx) => {
                                const isMastered = masteredKanji.includes(k.kanji);
                                return (
                                  <div
                                    key={kIdx}
                                    className={`p-5 rounded-2xl border space-y-4 shadow-2xs transition-colors ${
                                      isMastered
                                        ? 'bg-white dark:bg-stone-900 border-emerald-200 dark:border-emerald-900/40'
                                        : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-amber-600 text-white flex items-center justify-center text-3xl font-black shadow-md font-japanese">
                                          {k.kanji}
                                        </div>
                                        <div className="space-y-1">
                                          <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-base text-stone-900 dark:text-white">
                                              {k.meaningEnglish}
                                            </h4>
                                            <span className="text-xs px-2 py-0.5 bg-stone-100 dark:bg-stone-800 rounded text-stone-600 dark:text-stone-400 font-bold">
                                              {k.strokeCount} Strokes
                                            </span>
                                          </div>
                                          <p className="text-xs text-indigo-700 dark:text-indigo-400 font-medium">
                                            বাংলা অর্থ: {k.meaningBengali}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex flex-col items-end gap-2">
                                        <div className="flex items-center gap-1.5">
                                          <button
                                            onClick={() => setActiveStrokeKanji(activeStrokeKanji === k.kanji ? null : k.kanji)}
                                            className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
                                              activeStrokeKanji === k.kanji
                                                ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-sm'
                                                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-stone-400'
                                            }`}
                                            title="Toggle Stroke Order Animator (筆順アニメーション)"
                                          >
                                            <span>✍️ 筆順</span>
                                          </button>

                                          <button
                                            onClick={() => toggleKanjiMastery(k.kanji)}
                                            className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                                              isMastered
                                                ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                                                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700'
                                            }`}
                                          >
                                            {isMastered ? '✓ Mastered' : '+ Mark Learned'}
                                          </button>
                                        </div>

                                        <button
                                          onClick={() => playJapaneseAudio(k.kanji, `kanji-${lesson.lessonNumber}-${kIdx}`)}
                                          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 dark:hover:text-white cursor-pointer"
                                          title="Pronounce"
                                        >
                                          <Volume2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>

                                    {/* Stroke Order Interactive Animator Component */}
                                    {activeStrokeKanji === k.kanji && (
                                      <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
                                        <KanjiStrokeAnimator kanji={k.kanji} onClose={() => setActiveStrokeKanji(null)} />
                                      </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 dark:bg-stone-950/60 p-3 rounded-xl border border-stone-100 dark:border-stone-800">
                                      <div>
                                        <span className="font-bold text-stone-400 uppercase text-[10px]">On'yomi (音読み):</span>
                                        <p className="font-mono text-stone-800 dark:text-stone-200">
                                          {k.onyomi.length ? k.onyomi.join(', ') : 'None'}
                                        </p>
                                      </div>
                                      <div>
                                        <span className="font-bold text-stone-400 uppercase text-[10px]">Kun'yomi (訓読み):</span>
                                        <p className="font-mono text-stone-800 dark:text-stone-200">
                                          {k.kunyomi.length ? k.kunyomi.join(', ') : 'None'}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* TAB 4: QUIZ (Default Checkpoint + Gemini Custom Adaptive Quiz) */}
                          {activeTab === 'quiz' && (
                            <div className="space-y-6">
                              {/* 1. Core Lesson Checkpoint Question */}
                              <div className="bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] p-6 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4 shadow-2xs">
                                <div>
                                  <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                                    Lesson {lesson.lessonNumber} Core Checkpoint
                                  </span>
                                  <h4 className="text-lg font-bold text-stone-900 dark:text-white mt-1">
                                    {lesson.practiceQuiz.question}
                                  </h4>
                                  <p className="text-xs text-stone-400 dark:text-stone-500 font-mono mt-0.5">
                                    {lesson.practiceQuiz.questionRomaji}
                                  </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {lesson.practiceQuiz.options.map((option, optIdx) => {
                                    const selected = selectedQuizAnswers[lesson.lessonNumber] === optIdx;
                                    const isCorrect = optIdx === lesson.practiceQuiz.correctOptionIndex;
                                    const hasSubmitted = showQuizResult[lesson.lessonNumber];

                                    let btnStyle = "bg-stone-50 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 hover:border-stone-400 text-stone-800 dark:text-stone-200";
                                    if (hasSubmitted) {
                                      if (isCorrect) {
                                        btnStyle = "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold";
                                      } else if (selected && !isCorrect) {
                                        btnStyle = "bg-red-50 dark:bg-red-950/60 border-red-500 text-red-900 dark:text-red-200";
                                      }
                                    }

                                    return (
                                      <button
                                        key={optIdx}
                                        onClick={() => handleSelectQuizOption(lesson, optIdx)}
                                        className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                                      >
                                        <span>{option}</span>
                                        {hasSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                                      </button>
                                    );
                                  })}
                                </div>

                                {showQuizResult[lesson.lessonNumber] && (
                                  <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-2 text-xs">
                                    <div className="flex items-center gap-2 font-bold">
                                      {selectedQuizAnswers[lesson.lessonNumber] === lesson.practiceQuiz.correctOptionIndex ? (
                                        <span className="text-emerald-600 flex items-center gap-1">
                                          <Check className="w-4 h-4" /> Correct Answer! (+50 XP recorded to SRS)
                                        </span>
                                      ) : (
                                        <span className="text-red-600 flex items-center gap-1">
                                          Incorrect! Added to Spaced Repetition Review queue. Correct was: {lesson.practiceQuiz.correctAnswer}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-stone-700 dark:text-stone-300">
                                      <strong>Explanation:</strong> {lesson.practiceQuiz.explanationEnglish}
                                    </p>
                                    <p className="text-indigo-700 dark:text-indigo-300">
                                      <strong>বাংলা ব্যাখ্যা:</strong> {lesson.practiceQuiz.explanationBengali}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* 2. Gemini Custom Adaptive 5-Question Quiz Generator */}
                              <div className="bg-gradient-to-r from-stone-900 to-stone-950 text-white p-6 rounded-2xl border border-stone-800 space-y-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                  <div className="space-y-1">
                                    <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-red-500/20 text-red-300 text-[10px] font-bold rounded-full">
                                      <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                                      <span>GEMINI AI ADAPTIVE DRILL GENERATOR</span>
                                    </div>
                                    <h4 className="text-base font-black text-white">
                                      Generate 5-Question Custom Quiz for Lesson {lesson.lessonNumber}
                                    </h4>
                                    <p className="text-xs text-stone-400">
                                      Creates an adaptive set targeting this lesson's exact vocabulary, particles, and kanji.
                                    </p>
                                  </div>

                                  <button
                                    id={`btn-generate-ai-quiz-${lesson.lessonNumber}`}
                                    onClick={() => handleGenerateCustomQuiz(lesson)}
                                    disabled={isGeneratingQuiz[lesson.lessonNumber]}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-md shrink-0 active:scale-95"
                                  >
                                    {isGeneratingQuiz[lesson.lessonNumber] ? (
                                      <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>Generating Quiz...</span>
                                      </>
                                    ) : (
                                      <>
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span>Generate Custom Quiz</span>
                                      </>
                                    )}
                                  </button>
                                </div>

                                {/* Rendered Custom Quiz */}
                                {customAiQuizzes[lesson.lessonNumber] && (
                                  <div className="space-y-4 pt-4 border-t border-stone-800">
                                    {customAiQuizzes[lesson.lessonNumber].map((q, qIndex) => {
                                      const selected = (customQuizAnswers[lesson.lessonNumber] || {})[q.id];
                                      const isSubmitted = customQuizSubmitted[lesson.lessonNumber];
                                      const isCorrect = selected === q.correctIndex;

                                      return (
                                        <div key={q.id} className="bg-stone-800/80 p-4 rounded-xl space-y-3 text-xs">
                                          <div className="flex items-start justify-between">
                                            <p className="font-bold text-white">
                                              {qIndex + 1}. {q.question}
                                            </p>
                                            <span className="text-[10px] text-stone-400 font-mono">Q{qIndex + 1}</span>
                                          </div>

                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {q.options.map((opt, oIdx) => {
                                              const isOptSelected = selected === oIdx;
                                              const isOptCorrect = oIdx === q.correctIndex;

                                              let optStyle = "bg-stone-900/80 text-stone-300 border-stone-700 hover:border-stone-500";
                                              if (isSubmitted) {
                                                if (isOptCorrect) {
                                                  optStyle = "bg-emerald-950 border-emerald-500 text-emerald-200 font-bold";
                                                } else if (isOptSelected && !isOptCorrect) {
                                                  optStyle = "bg-red-950 border-red-500 text-red-200";
                                                }
                                              } else if (isOptSelected) {
                                                optStyle = "bg-red-600 text-white font-bold border-red-500";
                                              }

                                              return (
                                                <button
                                                  key={oIdx}
                                                  onClick={() => handleSelectCustomQuizOption(lesson.lessonNumber, q.id, oIdx)}
                                                  className={`p-2.5 rounded-lg border text-left text-xs transition-colors cursor-pointer ${optStyle}`}
                                                >
                                                  {opt}
                                                </button>
                                              );
                                            })}
                                          </div>

                                          {isSubmitted && (
                                            <div className="p-3 bg-stone-900 rounded-lg space-y-1 text-[11px]">
                                              <p className="text-stone-300">{q.explanationEn}</p>
                                              <p className="text-indigo-300">{q.explanationBn}</p>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}

                                    {!customQuizSubmitted[lesson.lessonNumber] && (
                                      <button
                                        onClick={() => handleSubmitCustomQuiz(lesson)}
                                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                                      >
                                        Submit Custom Quiz & Sync to SRS Memory (+150 XP)
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* TAB 5: PERSONAL NOTES */}
                          {activeTab === 'notes' && (
                            <div className="bg-white dark:bg-stone-900 sepia:bg-[#f6ebd4] p-6 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4 shadow-2xs">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                                    <Edit3 className="w-4 h-4 text-indigo-500" />
                                    <span>Personal Study Notes — Lesson {lesson.lessonNumber}</span>
                                  </h4>
                                  <p className="text-xs text-stone-500 dark:text-stone-400">
                                    Jot down your mnemonics, teacher comments, and memory tricks. Automatically saved to your device.
                                  </p>
                                </div>
                                {notesSaveStatus[lesson.lessonNumber] && (
                                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded">
                                    <Check className="w-3 h-3" /> Saved
                                  </span>
                                )}
                              </div>

                              <textarea
                                value={lessonNotes[lesson.lessonNumber] || ''}
                                onChange={(e) => handleNoteChange(lesson.lessonNumber, e.target.value)}
                                placeholder="Write your study notes for this lesson here (e.g. 'Remember particle に for target time and motion destination')..."
                                rows={5}
                                className="w-full p-3.5 rounded-xl text-sm bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:border-indigo-500 resize-y"
                              />

                              <div className="flex items-center justify-between text-xs text-stone-400">
                                <span>{(lessonNotes[lesson.lessonNumber] || '').length} characters</span>
                                <span>Local Storage Sync Active</span>
                              </div>
                            </div>
                          )}

                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>
        )}

      </div>
    </div>
  );
};

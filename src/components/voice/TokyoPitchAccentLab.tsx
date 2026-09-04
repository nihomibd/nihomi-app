import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  Square,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Award,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Radio,
  HelpCircle,
  ChevronRight,
  TrendingUp,
  X,
  Music,
  Layers,
  FileText,
  Copy,
  Check,
  Brain,
  Clock,
  Flame,
  ArrowRight,
  RefreshCw,
  Sliders,
  AlertTriangle
} from 'lucide-react';
import {
  TokyoPitchAccentAssessment,
  PitchAccentPattern,
  MoraEvaluation,
  PhrasalPitchPreview,
  AccentSrsCard,
  AccentSrsSummary,
  SenseiDiagnosticReport
} from '../../types';
import {
  fetchTokyoPitchPresets,
  evaluateTokyoPitchAccent,
  fetchPhrasalPreview,
  fetchDueAccentReviews,
  submitAccentSrsReview,
  fetchSenseiDiagnosticReport
} from '../../lib/voiceApi';
import {
  playTokyoPitchMelody,
  playNativeTokyoSpeech,
  BrowserPitchTracker
} from '../../lib/pitchAccentAudio';
import { TokyoPitchDojo } from './TokyoPitchDojo';
import { TokyoSentenceShadowingStudio } from './TokyoSentenceShadowingStudio';
import { useAuth } from '../../context/AuthContext';

export interface TokyoPitchAccentLabProps {
  isOpen: boolean;
  onClose: () => void;
  initialPresetId?: string;
  onAssessmentCompleted?: (assessment: TokyoPitchAccentAssessment) => void;
}

export const TokyoPitchAccentLab: React.FC<TokyoPitchAccentLabProps> = ({
  isOpen,
  onClose,
  initialPresetId,
  onAssessmentCompleted
}) => {
  const { user, token } = useAuth();

  // Navigation State
  const [activeTab, setActiveTab] = useState<'drill' | 'sandhi' | 'shadowing' | 'srs' | 'sensei'>('drill');

  // Single Drill State
  const [presets, setPresets] = useState<any[]>([]);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<
    'all' | 'minimal_pair' | 'n5_essential' | 'n4_conversation'
  >('all');
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [micVolume, setMicVolume] = useState<number>(0);
  const [isPlayingMelody, setIsPlayingMelody] = useState(false);
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);
  const [speechRate, setSpeechRate] = useState<0.75 | 1.0>(1.0);
  const [assessment, setAssessment] = useState<TokyoPitchAccentAssessment | null>(null);
  const [xpAwardBanner, setXpAwardBanner] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDojoOpen, setIsDojoOpen] = useState(false);

  // Phrasal Particle Sandhi State
  const [selectedParticle, setSelectedParticle] = useState<string>('が');
  const [phrasalPreview, setPhrasalPreview] = useState<PhrasalPitchPreview | null>(null);
  const [isLoadingPhrasal, setIsLoadingPhrasal] = useState(false);
  const [isPlayingPhrasalMelody, setIsPlayingPhrasalMelody] = useState(false);

  // Accent SRS Queue State
  const [srsDueCards, setSrsDueCards] = useState<AccentSrsCard[]>([]);
  const [srsSummary, setSrsSummary] = useState<AccentSrsSummary | null>(null);
  const [isLoadingSrs, setIsLoadingSrs] = useState(false);
  const [activeSrsCard, setActiveSrsCard] = useState<AccentSrsCard | null>(null);
  const [srsReviewFeedback, setSrsReviewFeedback] = useState<string | null>(null);

  // Sensei Diagnostic Report State
  const [diagnosticReport, setDiagnosticReport] = useState<SenseiDiagnosticReport | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Audio & Pitch Tracking Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const pitchTrackerRef = useRef<BrowserPitchTracker | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const liveTranscriptRef = useRef<string>('');
  const recordedAudioRef = useRef<string | null>(null);
  const recordStartTimeRef = useRef<number>(0);

  // Load Presets on Mount
  useEffect(() => {
    let isMounted = true;
    async function loadPresets() {
      const list = await fetchTokyoPitchPresets();
      if (isMounted && list.length > 0) {
        setPresets(list);
        if (initialPresetId) {
          const idx = list.findIndex((p: any) => p.id === initialPresetId);
          if (idx !== -1) setSelectedPresetIndex(idx);
        }
      }
    }
    loadPresets();
    return () => {
      isMounted = false;
    };
  }, [initialPresetId]);

  const currentPreset = presets[selectedPresetIndex] || null;

  // Filtered preset list
  const filteredPresets = presets.filter((p) => {
    if (activeCategoryFilter === 'all') return true;
    return p.category === activeCategoryFilter;
  });

  // Handle Preset Switching
  const handleSelectPreset = (preset: any) => {
    const originalIndex = presets.findIndex((p) => p.id === preset.id);
    if (originalIndex !== -1) {
      setSelectedPresetIndex(originalIndex);
      setAssessment(null);
      setXpAwardBanner(null);
      setErrorMessage(null);
    }
  };

  // Load Phrasal Sandhi Preview whenever Preset or Particle changes
  const loadPhrasalSandhi = useCallback(
    async (particleToUse?: string) => {
      if (!currentPreset) return;
      const particle = particleToUse || selectedParticle;
      setIsLoadingPhrasal(true);
      try {
        const preview = await fetchPhrasalPreview(
          {
            word: currentPreset.kanji,
            readingKana: currentPreset.readingKana,
            romaji: currentPreset.romaji,
            pattern: currentPreset.pattern,
            downstepMora: currentPreset.downstepMora,
            particle,
            meaningEn: currentPreset.meaningEn,
            meaningBn: currentPreset.meaningBn
          },
          token || undefined
        );
        setPhrasalPreview(preview);
      } catch (err) {
        console.warn('Error loading phrasal sandhi:', err);
      } finally {
        setIsLoadingPhrasal(false);
      }
    },
    [currentPreset, selectedParticle, token]
  );

  useEffect(() => {
    if (activeTab === 'sandhi' && currentPreset) {
      loadPhrasalSandhi();
    }
  }, [activeTab, currentPreset, selectedParticle, loadPhrasalSandhi]);

  // Load SRS Queue
  const loadSrsQueue = useCallback(async () => {
    setIsLoadingSrs(true);
    try {
      const res = await fetchDueAccentReviews(token || undefined, 20);
      setSrsDueCards(res.dueCards);
      setSrsSummary(res.summary);
      if (res.dueCards.length > 0 && !activeSrsCard) {
        setActiveSrsCard(res.dueCards[0]);
      }
    } catch (err) {
      console.warn('Error loading SRS queue:', err);
    } finally {
      setIsLoadingSrs(false);
    }
  }, [token, activeSrsCard]);

  useEffect(() => {
    if (activeTab === 'srs') {
      loadSrsQueue();
    }
  }, [activeTab, loadSrsQueue]);

  // Load Sensei Report
  const loadSenseiReport = useCallback(async () => {
    setIsLoadingReport(true);
    try {
      const report = await fetchSenseiDiagnosticReport(token || undefined, 30);
      setDiagnosticReport(report);
    } catch (err) {
      console.warn('Error loading Sensei diagnostic report:', err);
    } finally {
      setIsLoadingReport(false);
    }
  }, [token]);

  useEffect(() => {
    if (activeTab === 'sensei') {
      loadSenseiReport();
    }
  }, [activeTab, loadSenseiReport]);

  // Play Pitch Melody Synthesizer
  const handlePlayPitchMelody = async () => {
    if (!currentPreset || isPlayingMelody) return;
    setIsPlayingMelody(true);
    await playTokyoPitchMelody(currentPreset.targetPitches, currentPreset.morae, speechRate);
    setTimeout(() => {
      setIsPlayingMelody(false);
    }, (currentPreset.morae.length * 200) / speechRate + 200);
  };

  // Play Phrasal Melody Synthesizer
  const handlePlayPhrasalMelody = async () => {
    if (!phrasalPreview || isPlayingPhrasalMelody) return;
    setIsPlayingPhrasalMelody(true);
    await playTokyoPitchMelody(phrasalPreview.targetPitches, phrasalPreview.morae, speechRate);
    setTimeout(() => {
      setIsPlayingPhrasalMelody(false);
    }, (phrasalPreview.morae.length * 200) / speechRate + 200);
  };

  // Play Native Tokyo Speech
  const handlePlayNativeSpeech = () => {
    if (!currentPreset || isPlayingSpeech) return;
    setIsPlayingSpeech(true);
    playNativeTokyoSpeech(
      currentPreset.readingKana || currentPreset.kanji,
      speechRate,
      undefined,
      () => setIsPlayingSpeech(false)
    );
  };

  // Handle Recording Lifecycle
  const startRecording = async () => {
    try {
      setErrorMessage(null);
      setAssessment(null);
      setXpAwardBanner(null);
      audioChunksRef.current = [];
      liveTranscriptRef.current = '';

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 44100,
          echoCancellation: true,
          noiseSuppression: false
        }
      });

      // Browser Pitch Tracker
      const tracker = new BrowserPitchTracker();
      await tracker.start(stream, (freq, confidence) => {
        if (confidence > 0.65 && freq > 70 && freq < 600) {
          const normVol = Math.min(100, Math.max(0, (freq - 80) / 3));
          setMicVolume(normVol);
        } else {
          setMicVolume(0);
        }
      });
      pitchTrackerRef.current = tracker;

      // Web Speech Recognition
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition();
          rec.lang = 'ja-JP';
          rec.continuous = false;
          rec.interimResults = true;
          rec.onresult = (e: any) => {
            const transcript = Array.from(e.results)
              .map((r: any) => r[0].transcript)
              .join('');
            liveTranscriptRef.current = transcript;
          };
          rec.start();
          speechRecognitionRef.current = rec;
        } catch {
          // Benign fallback if already started
        }
      }

      // MediaRecorder for Audio Blob
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Data = (reader.result as string)?.split(',')[1];
          recordedAudioRef.current = base64Data;
          const points = pitchTrackerRef.current ? pitchTrackerRef.current.getPitchTrajectory() : [];
          const duration = Math.max(500, Date.now() - recordStartTimeRef.current);
          await runEvaluation(points, duration, base64Data);
        };
      };

      mediaRecorderRef.current = mediaRecorder;
      recordStartTimeRef.current = Date.now();
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err: any) {
      console.error('[Pitch Lab] Microphone access error:', err);
      setErrorMessage('Microphone access was denied or is unavailable.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
    }
    if (pitchTrackerRef.current) {
      pitchTrackerRef.current.stop();
    }
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {}
    }
    setIsRecording(false);
    setMicVolume(0);
  };

  // Run Real Evaluation
  const runEvaluation = async (pitchPoints: number[], durationMs: number, audioBase64?: string) => {
    if (!currentPreset) return;
    setIsEvaluating(true);

    try {
      const response = await evaluateTokyoPitchAccent(
        {
          targetPhrase: currentPreset.kanji || currentPreset.readingKana,
          targetRomaji: currentPreset.romaji,
          targetMeaning: currentPreset.meaningEn,
          targetPattern: currentPreset.pattern,
          targetDownstepMora: currentPreset.downstepMora,
          spokenTranscript: liveTranscriptRef.current,
          pitchF0Points: pitchPoints,
          audioDurationMs: durationMs,
          audioBase64,
          audioMimeType: 'audio/webm'
        },
        token || undefined
      );

      if (response.success && response.assessment) {
        setAssessment(response.assessment);
        if (response.xpAwarded) {
          setXpAwardBanner(response.xpAwarded);
        }
        if (onAssessmentCompleted) {
          onAssessmentCompleted(response.assessment);
        }

        // If currently in SRS mode and an active card exists, submit review automatically
        if (activeSrsCard) {
          await submitAccentSrsReview(
            {
              cardId: activeSrsCard.id,
              drillId: activeSrsCard.drillId,
              assessment: response.assessment
            },
            token || undefined
          );
          setSrsReviewFeedback(
            `রিভিউ সংরক্ষিত হয়েছে! পরবর্তী রিভিশন: ${response.assessment.overallScore >= 75 ? 'সফল (Interval Increased)' : 'পুনরাবৃত্তি (Lapsed)'}`
          );
          loadSrsQueue();
        }
      }
    } catch (err: any) {
      console.error('[Pitch Lab] Evaluation error:', err);
      setErrorMessage('Failed to evaluate pitch accent. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Submit Manual SRS Review Grade
  const handleManualSrsGrade = async (grade: 1 | 2 | 3 | 4) => {
    if (!activeSrsCard) return;
    const gradeLabels = { 1: 'Again (পুনরাবৃত্তি)', 2: 'Hard (কঠিন)', 3: 'Good (ভালো)', 4: 'Easy (সহজ)' };
    try {
      const res = await submitAccentSrsReview(
        {
          cardId: activeSrsCard.id,
          drillId: activeSrsCard.drillId,
          userGrade: grade,
          assessment: {
            targetPhrase: activeSrsCard.targetPhrase,
            overallScore: grade === 4 ? 95 : grade === 3 ? 82 : grade === 2 ? 65 : 45,
            patternMatch: grade >= 3
          }
        },
        token || undefined
      );
      setSrsReviewFeedback(`গ্রেড ${gradeLabels[grade]} রেকর্ড করা হয়েছে! কার্ড স্টেবিলিটি: ${res.card.stabilityDays.toFixed(1)} দিন।`);
      loadSrsQueue();
    } catch (err) {
      console.warn('Error recording SRS grade:', err);
    }
  };

  // Copy Sensei Report Summary
  const handleCopyReport = () => {
    if (!diagnosticReport) return;
    const text = `${diagnosticReport.institutionalTeacherSummaryBn}\n\n${diagnosticReport.institutionalTeacherSummaryEn}`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div
        id="tokyo-pitch-accent-lab"
        className="w-full max-w-5xl bg-[#0a0a12] border border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[94vh]"
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-stone-800/80 flex items-center justify-between bg-[#0f101c]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-red-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-white tracking-wide">
                  Tokyo Pitch-Accent Evaluator & Phonetics Lab
                </h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  東京式アクセント
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Acoustic sandhi concatenation, FSRS spaced repetition & autonomous sensei audit
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="btn-open-pitch-dojo-modal"
              type="button"
              onClick={() => setIsDojoOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-red-500/20 hover:from-amber-500/30 hover:to-red-500/30 text-amber-400 border border-amber-500/40 text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>পিচ ডোজো রানার (Dojo Runner)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feature Navigation Bar */}
        <div className="px-6 py-2 border-b border-stone-800/60 bg-[#0c0d18] flex items-center space-x-2 overflow-x-auto text-xs font-medium">
          <button
            id="tab-btn-single-drill"
            onClick={() => setActiveTab('drill')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'drill'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>একক শব্দ মূল্যায়ন (Single Word)</span>
          </button>

          <button
            id="tab-btn-particle-sandhi"
            onClick={() => setActiveTab('sandhi')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'sandhi'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>পার্টিকেল সংযোগ ল্যাব (Particle Sandhi)</span>
            <span className="text-[10px] font-mono px-1 rounded bg-amber-500/30 text-amber-200">
              助詞結合
            </span>
          </button>

          <button
            id="tab-btn-sentence-shadowing"
            onClick={() => setActiveTab('shadowing')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'shadowing'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>পূর্ণাঙ্গ বাক্য শ্যাডোয়িং (Shadowing Studio)</span>
            <span className="text-[10px] font-mono px-1 rounded bg-amber-500/30 text-amber-200">
              PROSODY
            </span>
          </button>

          <button
            id="tab-btn-accent-srs"
            onClick={() => setActiveTab('srs')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'srs'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>স্পেসড রিপিটেশন রিভিশন (Accent SRS)</span>
            {srsSummary && srsSummary.totalDue > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-500/30 text-red-300 font-mono font-bold text-[10px]">
                {srsSummary.totalDue}
              </span>
            )}
          </button>

          <button
            id="tab-btn-sensei-audit"
            onClick={() => setActiveTab('sensei')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'sensei'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>সেনসেই অডিট রিপোর্ট (Sensei Audit)</span>
            <span className="text-[10px] font-mono px-1 rounded bg-emerald-500/20 text-emerald-300">
              30-Day
            </span>
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* ========================================================================= */}
          {/* TAB 1: SINGLE WORD EVALUATION                                             */}
          {/* ========================================================================= */}
          {activeTab === 'drill' && (
            <div className="space-y-6">
              {/* Category Filter Chips */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
                <span className="text-stone-500 font-mono text-[11px] pr-1">Category:</span>
                {[
                  { id: 'all', label: 'All Patterns' },
                  { id: 'minimal_pair', label: 'Classic Minimal Pairs (はし, あめ, etc.)' },
                  { id: 'n5_essential', label: 'JLPT N5 Core Vocabulary' },
                  { id: 'n4_conversation', label: 'Tokyo Daily Expressions' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategoryFilter(cat.id as any)}
                    className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                      activeCategoryFilter === cat.id
                        ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                        : 'bg-stone-900/80 text-stone-400 border border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Preset Selector Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-36 overflow-y-auto p-1 bg-stone-950/60 rounded-2xl border border-stone-900">
                {filteredPresets.map((p) => {
                  const isSelected = currentPreset?.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSelectPreset(p)}
                      className={`p-2.5 rounded-xl text-left transition-all border ${
                        isSelected
                          ? 'bg-amber-950/30 border-amber-500 text-white shadow-sm'
                          : 'bg-stone-900/40 border-stone-800/60 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm tracking-wide">{p.kanji}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-800 text-amber-300">
                          {p.patternNameJa.split(' ')[0]}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-400 font-mono">{p.readingKana}</div>
                      <div className="text-[10px] text-stone-500 truncate">{p.meaningEn}</div>
                    </button>
                  );
                })}
              </div>

              {/* Current Target Focus Card */}
              {currentPreset && (
                <div className="p-6 bg-gradient-to-b from-[#121324] to-[#0c0d18] border border-stone-800 rounded-3xl space-y-6 shadow-inner">
                  {/* Header Info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <h2 className="text-3xl font-black text-white tracking-wider">
                          {currentPreset.kanji}
                        </h2>
                        <span className="text-lg font-mono text-stone-400">
                          ({currentPreset.readingKana} / {currentPreset.romaji})
                        </span>
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {currentPreset.patternNameJa}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-stone-300">
                        <span className="text-white font-medium">{currentPreset.meaningEn}</span>
                        <span className="text-stone-600">•</span>
                        <span className="text-amber-400/90 font-bengali font-medium">
                          {currentPreset.meaningBn}
                        </span>
                      </div>
                    </div>

                    {/* Auditory Model Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSpeechRate(speechRate === 1.0 ? 0.75 : 1.0)}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-mono bg-stone-900 border border-stone-800 text-stone-300 hover:text-white"
                      >
                        {speechRate}x Speed
                      </button>

                      <button
                        id="btn-play-pitch-melody"
                        onClick={handlePlayPitchMelody}
                        disabled={isPlayingMelody}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 flex items-center space-x-1.5 transition-colors"
                      >
                        <Music className="w-3.5 h-3.5" />
                        <span>{isPlayingMelody ? 'Playing...' : 'Pitch Melody'}</span>
                      </button>

                      <button
                        id="btn-play-native-speech"
                        onClick={handlePlayNativeSpeech}
                        disabled={isPlayingSpeech}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 flex items-center space-x-1.5 transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{isPlayingSpeech ? 'Speaking...' : 'Native Audio'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Visual Tokyo Pitch Stepper Chart */}
                  <div className="p-4 bg-stone-950/80 rounded-2xl border border-stone-900/80 space-y-3">
                    <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
                      <span>Mora Step Matrix (High / Low)</span>
                      <span>{currentPreset.contextNote}</span>
                    </div>

                    <div className="flex items-center justify-center space-x-3 sm:space-x-6 py-4 overflow-x-auto">
                      {currentPreset.morae.map((mora: string, idx: number) => {
                        const targetP = currentPreset.targetPitches[idx];
                        const isDownstepMora =
                          currentPreset.downstepMora > 0 &&
                          (currentPreset.downstepMora === 1
                            ? idx === 0
                            : idx === currentPreset.downstepMora - 1);

                        return (
                          <div key={idx} className="flex flex-col items-center space-y-2">
                            <span
                              className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                                targetP === 'H'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              }`}
                            >
                              {targetP === 'H' ? 'HIGH (高)' : 'LOW (低)'}
                            </span>

                            <div
                              className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border transition-all ${
                                targetP === 'H'
                                  ? 'bg-gradient-to-b from-amber-500/20 to-amber-950/40 border-amber-500/50 shadow-lg shadow-amber-500/10'
                                  : 'bg-stone-900/60 border-stone-800 text-stone-400'
                              }`}
                            >
                              <span className="text-xl font-black text-white">{mora}</span>
                              <span className="text-[10px] font-mono text-stone-400">#{idx + 1}</span>
                            </div>

                            {isDownstepMora && (
                              <span className="text-[10px] font-bold font-mono text-red-400 flex items-center space-x-0.5">
                                <span>🔻 Drop</span>
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recording & Evaluation Action Center */}
                  <div className="flex flex-col items-center justify-center space-y-3 pt-2">
                    <div className="flex items-center space-x-4">
                      {!isRecording ? (
                        <button
                          id="btn-start-recording-pitch"
                          onClick={startRecording}
                          disabled={isEvaluating}
                          className="px-8 py-3.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-lg shadow-red-600/30 flex items-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
                        >
                          <Mic className="w-5 h-5" />
                          <span>উচ্চারণ রেকর্ড করুন (Record Now)</span>
                        </button>
                      ) : (
                        <button
                          id="btn-stop-recording-pitch"
                          onClick={stopRecording}
                          className="px-8 py-3.5 rounded-2xl font-bold text-sm bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/40 flex items-center space-x-2 animate-pulse transition-all active:scale-95"
                        >
                          <Square className="w-5 h-5" />
                          <span>রেকর্ডিং থামান ও মূল্যায়ন করুন (Stop)</span>
                        </button>
                      )}
                    </div>

                    {isRecording && (
                      <div className="flex items-center space-x-2 text-xs text-amber-400 font-mono">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        <span>Speaking now... Mic Level: {Math.round(micVolume)}%</span>
                      </div>
                    )}

                    {isEvaluating && (
                      <div className="text-xs text-stone-400 font-mono animate-pulse">
                        Analyzing Tokyo F0 Pitch Contour with Nihomi Acoustic Engine...
                      </div>
                    )}

                    {errorMessage && (
                      <div className="text-xs text-red-400 font-medium flex items-center space-x-1.5">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errorMessage}</span>
                      </div>
                    )}
                  </div>

                  {/* Real-time Pitch Assessment Results */}
                  {assessment && (
                    <div
                      id="pitch-assessment-results"
                      className="p-5 bg-stone-950/90 border border-stone-800 rounded-2xl space-y-4 animate-in fade-in duration-300"
                    >
                      <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                        <div className="flex items-center space-x-2">
                          <Award className="w-5 h-5 text-amber-400" />
                          <span className="font-bold text-sm text-white">
                            Tokyo Accent Evaluation Score
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl font-black text-amber-400">
                            {assessment.overallScore}/100
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              assessment.passed
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}
                          >
                            {assessment.passed ? 'PASSED (উত্তীর্ণ)' : 'RETRY (অনুশীলন করুন)'}
                          </span>
                        </div>
                      </div>

                      {/* Mora by Mora Breakdown */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {assessment.moraBreakdown.map((m: MoraEvaluation, i: number) => (
                          <div
                            key={i}
                            className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1 ${
                              m.isMatch
                                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                                : 'bg-red-950/20 border-red-500/30 text-red-300'
                            }`}
                          >
                            <span className="text-lg font-black text-white">{m.mora}</span>
                            <div className="text-[10px] font-mono flex items-center space-x-1">
                              <span>Target: {m.targetPitch}</span>
                              <span>•</span>
                              <span>You: {m.detectedPitch}</span>
                            </div>
                            <span className="text-[10px] font-mono opacity-80">
                              {m.estimatedHz} Hz
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Bengali Sensei Feedback */}
                      <div className="p-3 bg-stone-900/60 rounded-xl space-y-2">
                        <div className="text-xs text-amber-400 font-bengali leading-relaxed">
                          {assessment.feedbackBn}
                        </div>

                        {assessment.coachingTips.length > 0 && (
                          <div className="pt-2 border-t border-stone-800/80 space-y-1">
                            <span className="text-[11px] font-mono text-stone-400">
                              Sensei Coaching Tips:
                            </span>
                            <ul className="list-disc list-inside text-xs text-stone-400 space-y-0.5">
                              {assessment.coachingTips.map((tip, i) => (
                                <li key={i}>{tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: PHRASAL PARTICLE SANDHI LAB (助詞結合)                             */}
          {/* ========================================================================= */}
          {activeTab === 'sandhi' && (
            <div className="space-y-6">
              {/* Particle Sandhi Explainer Banner */}
              <div className="p-4 bg-gradient-to-r from-amber-950/30 via-stone-900 to-stone-950 border border-amber-500/20 rounded-2xl flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-white text-sm">
                    পার্টিকেল সংযোগ পিচ রুল (Syntactic Particle Sandhi Rules)
                  </h4>
                  <p className="text-stone-300 leading-relaxed font-bengali">
                    জাপানি ভাষায় শব্দের সাথে যখন ব্যাকরণগত পার্টিকেল (が, は, を, ইত্যাদি) যুক্ত হয়,
                    তখন শব্দের অ্যাকসেন্ট প্যাটার্ন অনুযায়ী সম্পূর্ণ বাক্যাংশের সুর নির্ধারিত হয়। বিশেষ করে
                    尾高 (Odaka) ও 平板 (Heiban) একা শুনতে একই রকম লাগলেও, পার্টিকেল যুক্ত হওয়ামাত্রই Odaka-তে
                    সুর খাড়াভাবে নিচে নেমে যায় (Drop) এবং Heiban-এ সুর উঁচু ও সমতল (High) থাকে।
                  </p>
                </div>
              </div>

              {/* Word & Particle Selector Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Select Base Word */}
                <div className="p-4 bg-stone-950/70 border border-stone-900 rounded-2xl space-y-3">
                  <span className="text-xs font-mono text-stone-400">১. মূল শব্দ নির্বাচন করুন (Base Word):</span>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {presets.slice(0, 10).map((p) => {
                      const isSelected = currentPreset?.id === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => handleSelectPreset(p)}
                          className={`p-2 rounded-xl text-left border text-xs transition-all ${
                            isSelected
                              ? 'bg-amber-950/40 border-amber-500 text-white font-bold'
                              : 'bg-stone-900/50 border-stone-800 text-stone-300 hover:border-stone-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{p.kanji}</span>
                            <span className="text-[10px] font-mono text-amber-300">
                              {p.patternNameJa.split(' ')[0]}
                            </span>
                          </div>
                          <div className="text-[10px] text-stone-500">{p.meaningBn}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Select Particle */}
                <div className="p-4 bg-stone-950/70 border border-stone-900 rounded-2xl space-y-3">
                  <span className="text-xs font-mono text-stone-400">২. পার্টিকেল নির্বাচন করুন (Particle):</span>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { char: 'が', name: 'Subject (কর্তা)' },
                      { char: 'は', name: 'Topic (প্রসঙ্গ)' },
                      { char: 'を', name: 'Object (কর্ম)' },
                      { char: 'に', name: 'Target (দিক/সময়)' },
                      { char: 'で', name: 'Location (মাধ্যম)' },
                      { char: 'の', name: 'Genitive (এর)' },
                      { char: 'から', name: 'Source (হতে)' },
                      { char: 'まで', name: 'Limit (পর্যন্ত)' }
                    ].map((part) => {
                      const isSelected = selectedParticle === part.char;
                      return (
                        <button
                          key={part.char}
                          onClick={() => {
                            setSelectedParticle(part.char);
                            loadPhrasalSandhi(part.char);
                          }}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            isSelected
                              ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200 font-bold shadow-md shadow-cyan-950/30'
                              : 'bg-stone-900/50 border-stone-800 text-stone-400 hover:border-stone-700'
                          }`}
                        >
                          <span className="text-base font-black block">{part.char}</span>
                          <span className="text-[9px] text-stone-500 truncate block">{part.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Dynamic Phrasal Preview Display */}
              {isLoadingPhrasal ? (
                <div className="p-8 text-center text-xs text-stone-500 font-mono animate-pulse">
                  Computing unified syntactic pitch contour for word + particle...
                </div>
              ) : phrasalPreview ? (
                <div className="p-6 bg-gradient-to-b from-[#121324] to-[#0c0d18] border border-stone-800 rounded-3xl space-y-6">
                  {/* Title & Compound Presentation */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl font-black text-white tracking-wide">
                          {phrasalPreview.phraseKanji}
                        </span>
                        <span className="text-lg font-mono text-stone-400">
                          ({phrasalPreview.phraseKana})
                        </span>
                        <span className="px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          {phrasalPreview.pattern.toUpperCase()} + {phrasalPreview.particle}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400">
                        {phrasalPreview.particleFunctionEn} • {phrasalPreview.particleMeaningBn}
                      </p>
                    </div>

                    <button
                      id="btn-play-phrasal-melody"
                      onClick={handlePlayPhrasalMelody}
                      disabled={isPlayingPhrasalMelody}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 flex items-center space-x-2 transition-all shadow-sm active:scale-95"
                    >
                      <Music className="w-4 h-4" />
                      <span>{isPlayingPhrasalMelody ? 'Playing...' : 'বাক্যাংশের সুর শুনুন (Play Contour)'}</span>
                    </button>
                  </div>

                  {/* Visual Mora Contour Matrix */}
                  <div className="p-5 bg-stone-950/80 rounded-2xl border border-stone-900 space-y-4">
                    <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
                      <span>Phrasal Pitch Steps ({phrasalPreview.totalMoraCount} Morae Total)</span>
                      {phrasalPreview.hasDownstepAtParticleBoundary && (
                        <span className="text-red-400 font-bold flex items-center space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>বাউন্ডারি ড্রপ (Boundary Drop Detected)</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-center space-x-2 sm:space-x-4 py-4 overflow-x-auto">
                      {phrasalPreview.morae.map((mora, idx) => {
                        const pitch = phrasalPreview.targetPitches[idx];
                        const isParticleMora = idx >= phrasalPreview.wordMoraCount;
                        const isDropPoint =
                          phrasalPreview.downstepMora > 0 &&
                          (phrasalPreview.downstepMora === 1
                            ? idx === 0
                            : idx === phrasalPreview.downstepMora - 1);

                        return (
                          <div key={idx} className="flex flex-col items-center space-y-2">
                            <span
                              className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                                pitch === 'H'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-blue-500/20 text-blue-300'
                              }`}
                            >
                              {pitch}
                            </span>

                            <div
                              className={`w-12 h-14 rounded-xl flex flex-col items-center justify-center border transition-all ${
                                isParticleMora
                                  ? pitch === 'H'
                                    ? 'bg-cyan-950/40 border-cyan-400/60 text-cyan-200'
                                    : 'bg-cyan-950/20 border-cyan-800/40 text-cyan-400'
                                  : pitch === 'H'
                                  ? 'bg-amber-950/40 border-amber-500/60 text-amber-200'
                                  : 'bg-stone-900/60 border-stone-800 text-stone-400'
                              }`}
                            >
                              <span className="text-base font-black">{mora}</span>
                              <span className="text-[9px] font-mono text-stone-500">
                                {isParticleMora ? 'Part' : `#${idx + 1}`}
                              </span>
                            </div>

                            {isDropPoint && (
                              <span className="text-[9px] font-mono font-bold text-red-400">
                                🔻 Drop
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sandhi Explanation in Bengali */}
                  <div className="p-4 bg-stone-900/70 border border-stone-800 rounded-2xl space-y-2 font-bengali">
                    <h5 className="text-xs font-bold text-amber-300">
                      স্যান্ডি ও ফনেটিক্স বিশ্লেষণ:
                    </h5>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      {phrasalPreview.downstepExplanationBn}
                    </p>
                    <div className="text-xs text-amber-400/90 font-medium pt-1 border-t border-stone-800">
                      💡 টিপস: {phrasalPreview.contrastTipBn}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: FULL-SENTENCE PROSODY & SHADOWING STUDIO                             */}
          {/* ========================================================================= */}
          {activeTab === 'shadowing' && (
            <div className="-m-6">
              <TokyoSentenceShadowingStudio
                isOpen={true}
                onAssessmentCompleted={() => {
                  loadSenseiReport();
                }}
              />
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: ACOUSTIC SPACED REPETITION (SRS) QUEUE                             */}
          {/* ========================================================================= */}
          {activeTab === 'srs' && (
            <div className="space-y-6">
              {/* SRS Summary Metrics */}
              {srsSummary && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-1">
                    <span className="text-[11px] font-mono text-stone-400 block">Due for Review</span>
                    <span className="text-2xl font-black text-amber-400">{srsSummary.totalDue}</span>
                    <span className="text-[10px] text-stone-500 block">Cards scheduled today</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-1">
                    <span className="text-[11px] font-mono text-stone-400 block">High Acoustic Risk</span>
                    <span className="text-2xl font-black text-red-400">
                      {srsSummary.highAcousticRiskCount}
                    </span>
                    <span className="text-[10px] text-stone-500 block">Dynamic stress transfer</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-1">
                    <span className="text-[11px] font-mono text-stone-400 block">Odaka (尾高) Due</span>
                    <span className="text-2xl font-black text-orange-400">{srsSummary.odakaDue}</span>
                    <span className="text-[10px] text-stone-500 block">Particle boundary cards</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-1">
                    <span className="text-[11px] font-mono text-stone-400 block">Next 24h Queue</span>
                    <span className="text-2xl font-black text-cyan-400">
                      {srsSummary.upcomingNext24h}
                    </span>
                    <span className="text-[10px] text-stone-500 block">Upcoming FSRS reviews</span>
                  </div>
                </div>
              )}

              {/* Active Card Drill & Grading Console */}
              {activeSrsCard && (
                <div className="p-6 bg-gradient-to-b from-[#121324] to-[#0c0d18] border border-amber-500/30 rounded-3xl space-y-5">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl font-black text-white">{activeSrsCard.targetPhrase}</span>
                      <span className="text-sm font-mono text-stone-400">
                        ({activeSrsCard.readingKana})
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 uppercase">
                        {activeSrsCard.pattern}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-800 text-stone-300">
                        Stage: {activeSrsCard.stage}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-stone-400">
                      Stability: {activeSrsCard.stabilityDays.toFixed(1)}d • Difficulty: {(activeSrsCard.difficulty * 100).toFixed(0)}%
                    </div>
                  </div>

                  <p className="text-xs text-amber-400/90 font-bengali">
                    অর্থ: {activeSrsCard.meaningBn} • টোকিও অ্যাকসেন্ট কার্নেল সুরক্ষিত রাখতে সঠিক পিচ বজায় রাখুন।
                  </p>

                  {/* Manual Quick-Grade Selection Buttons */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-mono text-stone-400">
                      প্র্যাকটিস সম্পন্ন করার পর ফলাফল নির্ধারণ করুন (SRS Performance Grade):
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        onClick={() => handleManualSrsGrade(1)}
                        className="p-2.5 rounded-xl bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 text-red-300 font-bold text-xs transition-all active:scale-95 text-left"
                      >
                        <div>1. Again (পুনরাবৃত্তি)</div>
                        <span className="text-[10px] font-normal text-stone-400">সুরের ভুল বা অতিরিক্ত জোর</span>
                      </button>

                      <button
                        onClick={() => handleManualSrsGrade(2)}
                        className="p-2.5 rounded-xl bg-orange-950/30 hover:bg-orange-900/40 border border-orange-500/30 text-orange-300 font-bold text-xs transition-all active:scale-95 text-left"
                      >
                        <div>2. Hard (কঠিন)</div>
                        <span className="text-[10px] font-normal text-stone-400">দোদুল্যমান পিচ বা বিলম্ব</span>
                      </button>

                      <button
                        onClick={() => handleManualSrsGrade(3)}
                        className="p-2.5 rounded-xl bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 font-bold text-xs transition-all active:scale-95 text-left"
                      >
                        <div>3. Good (ভালো)</div>
                        <span className="text-[10px] font-normal text-stone-400">সঠিক টোকিও পিচ ধাপ</span>
                      </button>

                      <button
                        onClick={() => handleManualSrsGrade(4)}
                        className="p-2.5 rounded-xl bg-cyan-950/30 hover:bg-cyan-900/40 border border-cyan-500/30 text-cyan-300 font-bold text-xs transition-all active:scale-95 text-left"
                      >
                        <div>4. Easy (সহজ)</div>
                        <span className="text-[10px] font-normal text-stone-400">সাবলীল ও নিখুঁত মোরা ছন্দ</span>
                      </button>
                    </div>
                  </div>

                  {srsReviewFeedback && (
                    <div className="text-xs text-emerald-400 font-medium font-bengali p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl">
                      {srsReviewFeedback}
                    </div>
                  )}
                </div>
              )}

              {/* Due Cards List */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono text-stone-400 uppercase tracking-wider">
                  Upcoming Due Accent Cards
                </h4>
                {isLoadingSrs ? (
                  <div className="p-6 text-center text-xs text-stone-500 font-mono animate-pulse">
                    Loading SRS retention queue...
                  </div>
                ) : srsDueCards.length === 0 ? (
                  <div className="p-6 text-center text-xs text-stone-500 bg-stone-950/60 rounded-2xl border border-stone-900">
                    বর্তমানে কোনো রিভিশন কার্ড বাকি নেই! আপনার অ্যাকসেন্ট রিটেনশন চমৎকার অবস্থায় রয়েছে।
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {srsDueCards.map((card) => {
                      const isSelected = activeSrsCard?.id === card.id;
                      return (
                        <div
                          key={card.id}
                          onClick={() => setActiveSrsCard(card)}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-amber-950/30 border-amber-500 shadow-sm'
                              : 'bg-stone-900/40 border-stone-800 hover:border-stone-700'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-sm text-white">{card.targetPhrase}</span>
                              <span className="text-xs font-mono text-stone-400">
                                {card.readingKana}
                              </span>
                              {card.acousticRiskLevel === 'high' && (
                                <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 text-[9px] font-mono font-bold">
                                  High Risk
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-stone-400 truncate">{card.meaningBn}</div>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-mono font-bold text-amber-400 block">
                              {card.retentionRate}% R
                            </span>
                            <span className="text-[10px] font-mono text-stone-500">
                              {card.pattern}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: AUTONOMOUS SENSEI DIAGNOSTIC AUDIT                                 */}
          {/* ========================================================================= */}
          {activeTab === 'sensei' && (
            <div className="space-y-6">
              {isLoadingReport ? (
                <div className="p-12 text-center text-xs text-stone-500 font-mono animate-pulse">
                  Aggregating 30-day voice assessments & generating Sensei audit telemetry...
                </div>
              ) : diagnosticReport ? (
                <div className="space-y-6">
                  {/* Readiness Grade Card */}
                  <div className="p-6 bg-gradient-to-r from-[#17182e] via-[#0f101c] to-[#0a0a12] border border-amber-500/30 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                    <div className="space-y-2 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start space-x-2">
                        <span className="text-xs uppercase font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                          Tokyo Resonance Readiness Index
                        </span>
                        <span className="text-xs text-stone-400 font-mono">
                          {diagnosticReport.evaluationsAnalyzed} Evaluations Evaluated
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-white">
                        {diagnosticReport.readinessGradeTitleBn}
                      </h3>
                      <p className="text-xs text-stone-300 max-w-xl font-bengali">
                        বিগত ৩০ দিনে আপনার সামগ্রিক স্বরভঙ্গি, মোরা সময়কাল এবং বাংলা স্ট্রেস ট্রান্সফার
                        বিশ্লেষণ করে জাপানি কর্মক্ষেত্র ও ইন্টারভিউয়ের জন্য এই যোগ্যতা মূল্যায়ন করা হয়েছে।
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center w-28 h-28 rounded-3xl bg-gradient-to-br from-amber-500/20 to-red-500/20 border-2 border-amber-500/50 shadow-lg shadow-amber-500/20 shrink-0">
                      <span className="text-4xl font-black text-amber-400">
                        {diagnosticReport.readinessGrade}
                      </span>
                      <span className="text-xs font-mono font-bold text-stone-300">
                        {diagnosticReport.readinessScore}/100
                      </span>
                    </div>
                  </div>

                  {/* Core Telemetry Indicators */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-1">
                      <span className="text-[11px] font-mono text-stone-400 block">Mora Consistency</span>
                      <span className="text-2xl font-black text-emerald-400">
                        {diagnosticReport.moraConsistencyIndex}%
                      </span>
                      <span className="text-[10px] text-stone-500 block">ছন্দের ধারাবাহিকতা</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-1">
                      <span className="text-[11px] font-mono text-stone-400 block">Dynamic Stress Rate</span>
                      <span className="text-2xl font-black text-red-400">
                        {diagnosticReport.chronicInterferenceMetrics.dynamicStressTransferRate}%
                      </span>
                      <span className="text-[10px] text-stone-500 block">ভলিউম স্পাইক ত্রুটি</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-1">
                      <span className="text-[11px] font-mono text-stone-400 block">Mora Flattening</span>
                      <span className="text-2xl font-black text-orange-400">
                        {diagnosticReport.chronicInterferenceMetrics.moraFlatteningRate}%
                      </span>
                      <span className="text-[10px] text-stone-500 block">হেইবান সুর সমতলকরণ</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-1">
                      <span className="text-[11px] font-mono text-stone-400 block">Pitch-Intensity Decoupling</span>
                      <span className="text-2xl font-black text-cyan-400">
                        {diagnosticReport.pitchVsIntensityCorrelation > 0.4 ? 'Coupled' : 'Decoupled'}
                      </span>
                      <span className="text-[10px] text-stone-500 block">
                        r = {diagnosticReport.pitchVsIntensityCorrelation}
                      </span>
                    </div>
                  </div>

                  {/* Pattern Mastery Breakdown */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono text-stone-400 uppercase tracking-wider">
                      ৪টি টোকিও পিচ প্যাটার্ন দক্ষতা (Pattern Mastery)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(['heiban', 'atamadaka', 'nakadaka', 'odaka'] as PitchAccentPattern[]).map((pat) => {
                        const m = diagnosticReport.patternMastery[pat];
                        return (
                          <div
                            key={pat}
                            className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-sm text-white uppercase font-mono">
                                {pat} (
                                {pat === 'heiban'
                                  ? '平板 ⓪'
                                  : pat === 'atamadaka'
                                  ? '頭高 ①'
                                  : pat === 'nakadaka'
                                  ? '中高 ②+'
                                  : '尾高 N'}
                                )
                              </span>
                              <span className="text-xs font-mono font-bold text-amber-400">
                                {m.accuracyRate}% Accuracy
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-400 font-bengali leading-relaxed">
                              {m.primaryStumblingBlockBn}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* High-Risk Interference Areas & Corrective Actions */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono text-stone-400 uppercase tracking-wider">
                      নিউরোমাসকুলার কারেকশন নির্দেশনা (Actionable Clinical Phonetics)
                    </h4>
                    <div className="space-y-3">
                      {diagnosticReport.highRiskInterferenceAreas.map((area, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-stone-900/70 border border-stone-800 space-y-2 font-bengali"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-amber-300">{area.area}</span>
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                                area.riskLevel === 'critical'
                                  ? 'bg-red-500/20 text-red-300'
                                  : 'bg-amber-500/20 text-amber-300'
                              }`}
                            >
                              {area.riskLevel.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-stone-300 leading-relaxed">
                            {area.detectedAcousticSymptomBn}
                          </p>
                          <div className="text-xs text-emerald-400 font-medium pt-1">
                            সংশোধন পদ্ধতি: {area.neuromuscularCorrectionActionBn}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Institutional Teacher Summary & Copy Action */}
                  <div className="p-5 bg-stone-950/80 border border-stone-800 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-stone-400 uppercase tracking-wide">
                        Institutional Sensei Summary (শিক্ষক ও অডিট রিপোর্ট)
                      </span>
                      <button
                        onClick={handleCopyReport}
                        className="px-3 py-1.5 rounded-xl text-xs font-mono bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center space-x-1.5 transition-colors"
                      >
                        {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedSummary ? 'Copied!' : 'Copy Summary'}</span>
                      </button>
                    </div>

                    <pre className="text-xs text-stone-300 whitespace-pre-wrap font-bengali leading-relaxed bg-stone-900/50 p-4 rounded-xl border border-stone-800/80">
                      {diagnosticReport.institutionalTeacherSummaryBn}
                    </pre>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-4 border-t border-stone-800 flex items-center justify-between bg-[#0c0d18]">
          <span className="text-xs text-stone-500 font-mono">
            Nihomi VoiceOS™ • Standard Tokyo Dialect (東京方言) Acoustic Model
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold transition-colors"
          >
            Close Lab
          </button>
        </div>
      </div>

      {/* Interactive Tokyo Pitch Dojo Modal */}
      <TokyoPitchDojo isOpen={isDojoOpen} onClose={() => setIsDojoOpen(false)} />
    </div>
  );
};

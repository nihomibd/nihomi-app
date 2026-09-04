import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  Square,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  Award,
  CheckCircle2,
  XCircle,
  AlertCircle,
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
  ArrowRight,
  RefreshCw,
  Sliders,
  AlertTriangle,
  Flame,
  VolumeX,
  ExternalLink,
  ShieldCheck,
  Download,
  Share2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  SentenceProsodyModel,
  AccentualPhrase,
  ShadowingEvaluationResult,
  SpeakingReadinessCertificate,
  SentenceProsodyAnalysisInput
} from '../../types';
import {
  fetchSentencePresets,
  analyzeSentenceProsody,
  evaluateSentenceShadowing,
  fetchSpeakingCertificate
} from '../../lib/voiceApi';
import {
  playNativeTokyoSpeech,
  playSentenceProsodyMelody,
  BrowserPitchTracker
} from '../../lib/pitchAccentAudio';

interface TokyoSentenceShadowingStudioProps {
  isOpen?: boolean;
  onClose?: () => void;
  onAssessmentCompleted?: (result: ShadowingEvaluationResult) => void;
}

export const TokyoSentenceShadowingStudio: React.FC<TokyoSentenceShadowingStudioProps> = ({
  isOpen = true,
  onClose,
  onAssessmentCompleted
}) => {
  const { user, token } = useAuth();

  // Presets & Active Sentence
  const [sentences, setSentences] = useState<SentenceProsodyModel[]>([]);
  const [selectedSentenceIndex, setSelectedSentenceIndex] = useState<number>(0);
  const [activeCategory, setActiveCategory] = useState<
    'all' | 'daily' | 'baito_interview' | 'keigo_business'
  >('all');
  const [isLoadingPresets, setIsLoadingPresets] = useState(true);

  // Custom Sentence Input
  const [customInputText, setCustomInputText] = useState('');
  const [isAnalyzingCustom, setIsAnalyzingCustom] = useState(false);
  const [isCustomDrawerOpen, setIsCustomDrawerOpen] = useState(false);

  // Playback & Tracking State
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);
  const [isPlayingMelody, setIsPlayingMelody] = useState(false);
  const [speechRate, setSpeechRate] = useState<0.8 | 1.0>(1.0);
  const [karaokeProgressMs, setKaraokeProgressMs] = useState<number>(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [micVolume, setMicVolume] = useState<number>(0);
  const [liveF0Points, setLiveF0Points] = useState<number[]>([]);
  const [evaluationResult, setEvaluationResult] = useState<ShadowingEvaluationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Certificate Modal State
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certificate, setCertificate] = useState<SpeakingReadinessCertificate | null>(null);
  const [isLoadingCert, setIsLoadingCert] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  // Audio Refs
  const pitchTrackerRef = useRef<BrowserPitchTracker | null>(null);
  const liveF0BufferRef = useRef<number[]>([]);
  const recordingStartTimeRef = useRef<number>(0);
  const karaokeAnimFrameRef = useRef<number | null>(null);

  // Load Presets on Mount
  useEffect(() => {
    let isMounted = true;
    async function loadPresets() {
      setIsLoadingPresets(true);
      try {
        const list = await fetchSentencePresets();
        if (isMounted && list.length > 0) {
          setSentences(list);
          setSelectedSentenceIndex(0);
        }
      } catch (err) {
        console.warn('Error fetching sentence presets:', err);
      } finally {
        if (isMounted) setIsLoadingPresets(false);
      }
    }
    loadPresets();
    return () => {
      isMounted = false;
      if (karaokeAnimFrameRef.current) cancelAnimationFrame(karaokeAnimFrameRef.current);
    };
  }, []);

  const currentSentence = sentences[selectedSentenceIndex] || null;

  // Filtered Sentences
  const filteredSentences = sentences.filter((s) => {
    if (activeCategory === 'all') return true;
    return s.category === activeCategory;
  });

  // Switch Sentence
  const handleSelectSentence = (sentence: SentenceProsodyModel) => {
    const idx = sentences.findIndex((s) => s.id === sentence.id);
    if (idx !== -1) {
      setSelectedSentenceIndex(idx);
      setEvaluationResult(null);
      setLiveF0Points([]);
      setKaraokeProgressMs(0);
      setErrorMessage(null);
    }
  };

  // Custom Sentence Submission
  const handleAnalyzeCustomSentence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInputText.trim() || isAnalyzingCustom) return;

    setIsAnalyzingCustom(true);
    setErrorMessage(null);
    try {
      const model = await analyzeSentenceProsody(
        { sentenceText: customInputText.trim() },
        token || undefined
      );
      setSentences((prev) => [model, ...prev]);
      setSelectedSentenceIndex(0);
      setIsCustomDrawerOpen(false);
      setCustomInputText('');
      setEvaluationResult(null);
      setLiveF0Points([]);
    } catch (err: any) {
      setErrorMessage(err.message || 'বাক্য বিশ্লেষণ ব্যর্থ হয়েছে।');
    } finally {
      setIsAnalyzingCustom(false);
    }
  };

  // Play Native Speech Audio with Karaoke Sync
  const handlePlayNativeSpeech = () => {
    if (!currentSentence || isPlayingSpeech) return;
    setIsPlayingSpeech(true);
    setKaraokeProgressMs(0);

    const startTime = Date.now();
    const duration = currentSentence.totalDurationMs / speechRate;

    const tick = () => {
      const elapsed = (Date.now() - startTime) * speechRate;
      setKaraokeProgressMs(elapsed);
      if (elapsed < currentSentence.totalDurationMs) {
        karaokeAnimFrameRef.current = requestAnimationFrame(tick);
      } else {
        setKaraokeProgressMs(currentSentence.totalDurationMs);
      }
    };
    karaokeAnimFrameRef.current = requestAnimationFrame(tick);

    playNativeTokyoSpeech(
      currentSentence.readingKana || currentSentence.sentenceText,
      speechRate,
      () => {},
      () => {
        setIsPlayingSpeech(false);
        if (karaokeAnimFrameRef.current) cancelAnimationFrame(karaokeAnimFrameRef.current);
      }
    );
  };

  // Play Melody Synthesizer with Karaoke Sync
  const handlePlayMelody = async () => {
    if (!currentSentence || isPlayingMelody) return;
    setIsPlayingMelody(true);
    setKaraokeProgressMs(0);

    const startTime = Date.now();
    const tick = () => {
      const elapsed = (Date.now() - startTime) * speechRate;
      setKaraokeProgressMs(elapsed);
      if (elapsed < currentSentence.totalDurationMs) {
        karaokeAnimFrameRef.current = requestAnimationFrame(tick);
      } else {
        setKaraokeProgressMs(currentSentence.totalDurationMs);
      }
    };
    karaokeAnimFrameRef.current = requestAnimationFrame(tick);

    await playSentenceProsodyMelody(
      currentSentence.targetF0Contour,
      speechRate,
      () => {
        setIsPlayingMelody(false);
        if (karaokeAnimFrameRef.current) cancelAnimationFrame(karaokeAnimFrameRef.current);
      }
    );
  };

  // Start Real-Time Microphone Shadowing Recording
  const handleStartShadowing = async () => {
    if (!currentSentence || isRecording || isEvaluating) return;
    setErrorMessage(null);
    setLiveF0Points([]);
    liveF0BufferRef.current = [];
    setEvaluationResult(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });

      const tracker = new BrowserPitchTracker();
      pitchTrackerRef.current = tracker;

      await tracker.start(stream, (f0, vol) => {
        setMicVolume(vol);
        if (f0 > 70 && f0 < 500) {
          liveF0BufferRef.current.push(f0);
          setLiveF0Points((prev) => [...prev, f0]);
        }
      });

      recordingStartTimeRef.current = Date.now();
      setIsRecording(true);
      setKaraokeProgressMs(0);

      // Play model speech simultaneously if in shadowing mode
      playNativeTokyoSpeech(
        currentSentence.readingKana || currentSentence.sentenceText,
        speechRate
      );

      const tick = () => {
        const elapsed = (Date.now() - recordingStartTimeRef.current) * speechRate;
        setKaraokeProgressMs(elapsed);
        if (elapsed < currentSentence.totalDurationMs + 800) {
          karaokeAnimFrameRef.current = requestAnimationFrame(tick);
        }
      };
      karaokeAnimFrameRef.current = requestAnimationFrame(tick);
    } catch (err: any) {
      console.error('Microphone recording error:', err);
      setErrorMessage('মাইক্রোফোন অ্যাক্সেস করতে সমস্যা হয়েছে। ব্রাউজার পারমিশন পরীক্ষা করুন।');
    }
  };

  // Stop Recording & Evaluate
  const handleStopShadowing = async () => {
    if (!isRecording || !currentSentence) return;
    setIsRecording(false);
    setIsEvaluating(true);

    if (karaokeAnimFrameRef.current) {
      cancelAnimationFrame(karaokeAnimFrameRef.current);
    }

    if (pitchTrackerRef.current) {
      pitchTrackerRef.current.stop();
      pitchTrackerRef.current = null;
    }

    const durationMs = Date.now() - recordingStartTimeRef.current;
    const userF0Trajectory = liveF0BufferRef.current;

    try {
      const result = await evaluateSentenceShadowing(
        {
          sentenceId: currentSentence.id,
          sentenceText: currentSentence.sentenceText,
          userF0Trajectory,
          audioDurationMs: durationMs
        },
        token || undefined
      );

      setEvaluationResult(result);
      if (onAssessmentCompleted) {
        onAssessmentCompleted(result);
      }
    } catch (err: any) {
      console.error('Error evaluating sentence shadowing:', err);
      setErrorMessage(err.message || 'শ্যাডোয়িং মূল্যায়ন সম্পন্ন করা যায়নি।');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Open Institutional Speaking Certificate
  const handleOpenCertificate = async () => {
    setIsCertModalOpen(true);
    setIsLoadingCert(true);
    try {
      const cert = await fetchSpeakingCertificate(token || undefined, user?.name);
      setCertificate(cert);
    } catch (err) {
      console.warn('Error loading speaking certificate:', err);
    } finally {
      setIsLoadingCert(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a12] text-stone-100 font-sans">
      {/* Studio Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-[#0d0e1a]">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/30 to-red-500/20 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-500/10">
            <Mic className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-stone-100 tracking-tight">
                টোকিও পূর্ণাঙ্গ বাক্য শ্যাডোয়িং স্টুডিও
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30">
                DTW Prosody V2
              </span>
            </div>
            <p className="text-xs text-stone-400">
              এ্যাকসেন্টুয়াল ফ্রেজ বাউন্ডারি (AP Reset) ও রিয়েল-টাইম ডুয়াল-ট্র্যাক পিচ ট্র্যাকিং
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Institutional Certificate Button */}
          <button
            id="btn-open-speaking-cert"
            onClick={handleOpenCertificate}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>স্পিকিং রেডিনেস সার্টিফিকেট</span>
          </button>

          {/* Close modal if provided */}
          {onClose && (
            <button
              id="btn-close-shadowing-studio"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Body Grid */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Category Filter Pills & Custom Input Action */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 overflow-x-auto text-xs">
            {[
              { id: 'all', labelBn: 'সকল বাক্য (All)' },
              { id: 'daily', labelBn: 'দৈনন্দিন কথোপকথন (N5/N4)' },
              { id: 'baito_interview', labelBn: 'বাইতো ইন্টারভিউ (アルバイト面接)' },
              { id: 'keigo_business', labelBn: 'বিজনেস কেইগো (ビジネス敬語)' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl transition-all font-medium ${
                  activeCategory === cat.id
                    ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50 font-bold'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/80 border border-transparent'
                }`}
              >
                {cat.labelBn}
              </button>
            ))}
          </div>

          <button
            id="btn-open-custom-sentence"
            onClick={() => setIsCustomDrawerOpen(!isCustomDrawerOpen)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs transition-all font-medium"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>কাস্টম জাপানি বাক্য ইনপুট</span>
          </button>
        </div>

        {/* Custom Sentence Analysis Drawer */}
        {isCustomDrawerOpen && (
          <form
            onSubmit={handleAnalyzeCustomSentence}
            className="p-4 rounded-2xl bg-stone-950/80 border border-amber-500/30 space-y-3 animate-in fade-in slide-in-from-top-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>যেকোনো জাপানি বাক্য পেস্ট করুন (এআই প্রোসোডি ও বাউন্ডারি বিভাজন)</span>
              </span>
              <button
                type="button"
                onClick={() => setIsCustomDrawerOpen(false)}
                className="text-stone-400 hover:text-stone-200 text-xs"
              >
                বাতিল
              </button>
            </div>
            <div className="flex gap-2">
              <input
                id="input-custom-japanese-sentence"
                type="text"
                value={customInputText}
                onChange={(e) => setCustomInputText(e.target.value)}
                placeholder="যেমন: 来週、友達と一緒に京都へ旅行に行きます。"
                className="flex-1 px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500/50"
              />
              <button
                id="btn-submit-custom-sentence"
                type="submit"
                disabled={isAnalyzingCustom || !customInputText.trim()}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all disabled:opacity-50"
              >
                {isAnalyzingCustom ? 'বিশ্লেষণ হচ্ছে...' : 'বিশ্লেষণ করুন'}
              </button>
            </div>
          </form>
        )}

        {/* Sentence Selection Carousel Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          {filteredSentences.map((sent) => {
            const isSelected = currentSentence?.id === sent.id;
            return (
              <button
                key={sent.id}
                onClick={() => handleSelectSentence(sent)}
                className={`flex-shrink-0 px-3 py-2 rounded-xl text-left transition-all border ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/60 text-amber-200 shadow-sm'
                    : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-900'
                }`}
              >
                <div className="flex items-center space-x-1.5 mb-0.5">
                  <span className="font-mono text-[9px] px-1 rounded bg-stone-800 text-amber-400 font-bold">
                    {sent.jlptLevel}
                  </span>
                  {sent.isQuestion && (
                    <span className="font-mono text-[9px] px-1 rounded bg-blue-500/20 text-blue-300 font-bold">
                      BPM ?
                    </span>
                  )}
                </div>
                <div className="font-bold text-xs truncate max-w-[200px]">
                  {sent.sentenceText}
                </div>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* ACTIVE SENTENCE KARAOKE DISPLAY & PROSODY BOUNDARIES                      */}
        {/* ========================================================================= */}
        {currentSentence && (
          <div className="p-6 rounded-3xl bg-stone-950/90 border border-stone-800/80 space-y-6 relative overflow-hidden shadow-2xl">
            {/* Top Meta Info */}
            <div className="flex items-center justify-between border-b border-stone-800/60 pb-3 text-xs">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono font-bold text-[11px] border border-amber-500/30">
                  {currentSentence.jlptLevel}
                </span>
                <span className="text-stone-400 font-medium">
                  {currentSentence.category === 'baito_interview'
                    ? 'বাইতো ইন্টারভিউ'
                    : currentSentence.category === 'keigo_business'
                    ? 'বিজনেস কেইগো'
                    : 'দৈনন্দিন জাপানি'}
                </span>
                {currentSentence.isQuestion && (
                  <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold">
                    প্রশ্নবোধক বাউন্ডারি পিচ (BPM Rise)
                  </span>
                )}
              </div>

              {/* Speech Rate Control */}
              <div className="flex items-center space-x-1.5">
                <span className="text-stone-500 text-[11px]">গতি (Tempo):</span>
                <button
                  onClick={() => setSpeechRate(0.8)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
                    speechRate === 0.8
                      ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                      : 'text-stone-500 hover:text-stone-300'
                  }`}
                >
                  0.8x ধীর
                </button>
                <button
                  onClick={() => setSpeechRate(1.0)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
                    speechRate === 1.0
                      ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                      : 'text-stone-500 hover:text-stone-300'
                  }`}
                >
                  1.0x স্বাভাবিক
                </button>
              </div>
            </div>

            {/* Accentual Phrase Karaoke Visualizer */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-baseline gap-4 text-left">
                {currentSentence.accentualPhrases.map((ap) => {
                  return (
                    <div
                      key={ap.id}
                      className="p-3 rounded-2xl bg-[#0e0f1d] border border-stone-800/90 relative group hover:border-amber-500/40 transition-all shadow-md"
                    >
                      {/* AP Indicator Tag */}
                      <div className="flex items-center justify-between space-x-2 mb-1.5 text-[10px]">
                        <span className="font-mono text-stone-400 font-bold flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"></span>
                          <span>AP {ap.phraseIndex}</span>
                        </span>
                        <span className="text-stone-500 font-mono">
                          {ap.pattern.toUpperCase()}
                        </span>
                        {ap.boundaryPitchMovement === 'rise' && (
                          <span className="text-blue-400 font-bold flex items-center">
                            ↗ BPM
                          </span>
                        )}
                      </div>

                      {/* Morae with Dynamic Karaoke Highlighting */}
                      <div className="flex items-center space-x-1 text-2xl font-bold">
                        {ap.moraTimingsMs.map((m, mIdx) => {
                          const isHigh = m.targetPitch === 'H';
                          const isCurrent =
                            karaokeProgressMs >= m.startMs && karaokeProgressMs <= m.endMs;
                          const isPast = karaokeProgressMs > m.endMs;

                          return (
                            <span
                              key={mIdx}
                              className={`relative px-1 py-0.5 rounded transition-all duration-100 ${
                                isCurrent
                                  ? 'bg-amber-400 text-stone-950 scale-110 shadow-lg shadow-amber-500/30 z-10'
                                  : isPast
                                  ? 'text-stone-100'
                                  : 'text-stone-400'
                              }`}
                            >
                              <ruby>
                                {m.mora}
                                <rt
                                  className={`text-[10px] font-mono font-bold block ${
                                    isHigh ? 'text-amber-400' : 'text-blue-400'
                                  }`}
                                >
                                  {m.targetPitch}
                                </rt>
                              </ruby>
                            </span>
                          );
                        })}
                      </div>

                      {/* Romaji under AP */}
                      <div className="text-[11px] font-mono text-stone-500 mt-1">
                        {ap.romaji}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sentence Meanings */}
              <div className="pt-2">
                <div className="text-sm font-semibold text-amber-300">
                  বাংলা: {currentSentence.meaningBn}
                </div>
                <div className="text-xs text-stone-400">
                  English: {currentSentence.meaningEn}
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* DUAL-TRACK PITCH CANVAS (GOLDEN TARGET VS. LIVE RECORDED LEARNER)         */}
            {/* ========================================================================= */}
            <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-3 h-0.5 bg-amber-400 rounded-full"></div>
                    <span className="text-amber-300 font-mono text-[11px] font-bold">
                      টোকিও রেফারেন্স সুর (Model Declination & AP Resets)
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-3 h-1 bg-cyan-400 rounded-full shadow-sm shadow-cyan-400/50"></div>
                    <span className="text-cyan-300 font-mono text-[11px] font-bold">
                      আপনার লাইভ মাইক্রোফোন পিচ (Live F0)
                    </span>
                  </div>
                </div>

                {isRecording && (
                  <div className="flex items-center space-x-2 text-red-400 animate-pulse font-mono text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span>রেকর্ডিং ও অটোকোরিলেশন ট্র্যাকিং চলছে...</span>
                    {/* Volume Meter */}
                    <div className="w-16 h-1.5 bg-stone-800 rounded-full overflow-hidden ml-1">
                      <div
                        className="h-full bg-red-500 transition-all duration-75"
                        style={{ width: `${Math.min(100, micVolume * 250)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Pitch Visualizer SVG Stage */}
              <div className="w-full h-44 bg-[#090a14] rounded-xl relative border border-stone-800/80 overflow-hidden">
                <DualTrackPitchSvg
                  targetContour={currentSentence.targetF0Contour}
                  userF0={liveF0Points}
                  totalDurationMs={currentSentence.totalDurationMs}
                  karaokeProgressMs={karaokeProgressMs}
                  accentualPhrases={currentSentence.accentualPhrases}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono px-1">
                <span>0 ms (শুরু)</span>
                <span>অ্যাকসেন্টুয়াল ফ্রেজ বাউন্ডারি রিকভারি (Declination Line Reset)</span>
                <span>{currentSentence.totalDurationMs} ms (সমাপ্তি)</span>
              </div>
            </div>

            {/* Audio Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center space-x-2">
                {/* Play Speech */}
                <button
                  id="btn-play-sentence-speech"
                  onClick={handlePlayNativeSpeech}
                  disabled={isPlayingSpeech || isRecording}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 text-xs font-bold transition-all disabled:opacity-50"
                >
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span>{isPlayingSpeech ? 'শুনছেন...' : 'নেটিভ উচ্চারণ শুনুন'}</span>
                </button>

                {/* Play Melody Synth */}
                <button
                  id="btn-play-sentence-melody"
                  onClick={handlePlayMelody}
                  disabled={isPlayingMelody || isRecording}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 text-xs font-bold transition-all disabled:opacity-50"
                >
                  <Music className="w-4 h-4 text-amber-400" />
                  <span>{isPlayingMelody ? 'মেলোডি বাজছে...' : 'পিচ সুর সিন্থেসাইজার'}</span>
                </button>
              </div>

              {/* Recording Action Button */}
              <div className="flex items-center space-x-2">
                {!isRecording ? (
                  <button
                    id="btn-start-shadowing"
                    onClick={handleStartShadowing}
                    disabled={isEvaluating}
                    className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold shadow-lg shadow-red-600/20 transition-all disabled:opacity-50"
                  >
                    <Mic className="w-4 h-4" />
                    <span>একত্রে শ্যাডোয়িং রেকর্ড করুন</span>
                  </button>
                ) : (
                  <button
                    id="btn-stop-shadowing"
                    onClick={handleStopShadowing}
                    className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-all animate-pulse"
                  >
                    <Square className="w-4 h-4" />
                    <span>রেকর্ডিং থামান ও মূল্যায়ন দেখুন</span>
                  </button>
                )}
              </div>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* EVALUATION RESULT & DIAGNOSTICS SECTION                                   */}
        {/* ========================================================================= */}
        {evaluationResult && (
          <div className="p-6 rounded-3xl bg-stone-950/90 border border-amber-500/40 space-y-6 shadow-2xl animate-in fade-in slide-in-from-bottom-3">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800/80 pb-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg border ${
                    evaluationResult.isPassed
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-lg shadow-amber-500/10'
                  }`}
                >
                  {evaluationResult.overallScore}%
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-stone-100">
                      শ্যাডোয়িং মূল্যায়ন ফলাফল (Prosody Evaluation)
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                        evaluationResult.isPassed
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {evaluationResult.isPassed ? 'টোকিও স্ট্যান্ডার্ড উত্তীর্ণ' : 'অনুশীলন প্রয়োজন'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400">{evaluationResult.feedbackBn}</p>
                </div>
              </div>

              {/* Retest button */}
              <button
                id="btn-retry-shadowing"
                onClick={handleStartShadowing}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 text-xs font-bold transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>পুনরায় চেষ্টা করুন</span>
              </button>
            </div>

            {/* Score Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* DTW Pitch Contour */}
              <div className="p-4 rounded-2xl bg-[#0d0e1a] border border-stone-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-400">DTW পিচ কনট্যুর সুর</span>
                  <span className="font-mono font-bold text-amber-400">
                    {evaluationResult.pitchContourScore}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400"
                    style={{ width: `${evaluationResult.pitchContourScore}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-stone-500">
                  টোকিও নেটিভ সুরের সামগ্রিক ওঠানামা ও রূপরেখা
                </p>
              </div>

              {/* Rhythm & Isochrony */}
              <div className="p-4 rounded-2xl bg-[#0d0e1a] border border-stone-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-400">মোরা সমকালীন ছন্দ</span>
                  <span className="font-mono font-bold text-cyan-400">
                    {evaluationResult.rhythmIsochronyScore}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400"
                    style={{ width: `${evaluationResult.rhythmIsochronyScore}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-stone-500">
                  প্রতিটি মোরার স্বাভাবিক ও সমদৈর্ঘ্য সময়ানুবর্তিতা
                </p>
              </div>

              {/* AP Boundary Reset Accuracy */}
              <div className="p-4 rounded-2xl bg-[#0d0e1a] border border-stone-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-400">বাউন্ডারি রিকভারি রিসেট</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {evaluationResult.boundaryResetAccuracyScore}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400"
                    style={{ width: `${evaluationResult.boundaryResetAccuracyScore}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-stone-500">
                  নতুন ফ্রেজে পিচ পুনরুদ্ধার বনাম ক্যাটাথেসিস ফ্ল্যাটলাইন
                </p>
              </div>
            </div>

            {/* Accentual Phrase Boundary Reset Audit Breakdown */}
            {evaluationResult.detectedApResets.length > 0 && (
              <div className="p-4 rounded-2xl bg-[#0c0d18] border border-stone-800 space-y-3">
                <h4 className="text-xs font-bold text-stone-300 flex items-center space-x-2">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>বাক্যাংশ সংযোগস্থল অডিট (Phrase Boundary Analysis):</span>
                </h4>
                <div className="space-y-2">
                  {evaluationResult.detectedApResets.map((apReset, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-stone-900/60 border border-stone-800/80 flex items-start space-x-3 text-xs"
                    >
                      {apReset.detectedReset ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-stone-200">{apReset.feedbackBn}</div>
                        <div className="text-[11px] font-mono text-stone-500 mt-0.5">
                          সুরের তারতম্য (F0 Delta): {apReset.deltaF0 > 0 ? `+${apReset.deltaF0}` : apReset.deltaF0} Hz
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Coaching Tips for Bengali Speakers */}
            {evaluationResult.coachingTipsBn.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-xs">
                <span className="font-bold text-amber-300 flex items-center space-x-1.5">
                  <Brain className="w-4 h-4" />
                  <span>সেনসেই বায়োমেকানিকাল কোচিং টিপস (Bengali Acoustic Remedies):</span>
                </span>
                <ul className="space-y-1.5 pl-4 list-disc text-stone-300">
                  {evaluationResult.coachingTipsBn.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* INSTITUTIONAL SPEAKING READINESS CERTIFICATE MODAL                         */}
      {/* ========================================================================= */}
      {isCertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-[#0c0d18] border border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setIsCertModalOpen(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-100 p-1.5 rounded-lg bg-stone-900 border border-stone-800"
            >
              <X className="w-5 h-5" />
            </button>

            {isLoadingCert || !certificate ? (
              <div className="py-16 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                <p className="text-xs text-stone-400">
                  সার্টিফিকেট তথ্য প্রস্তুত ও ভেরিফিকেশন কোড জেনারেট হচ্ছে...
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Official Seal Banner */}
                <div className="text-center space-y-2 border-b border-stone-800 pb-5">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/20 text-stone-950 font-bold text-xl">
                    印
                  </div>
                  <h3 className="text-lg font-bold text-stone-100 tracking-tight">
                    টোকিও জাপানি স্পিকিং ও পিচ অ্যাকসেন্ট প্রাতিষ্ঠানিক সনদ
                  </h3>
                  <p className="text-xs text-amber-300 font-mono">
                    TOKYO FLUENCY & PROSODIC READINESS DIPLOMA
                  </p>
                  <p className="text-xs text-stone-400">
                    নিহোমি কমার্শিয়াল জাপানিজ একাডেমি • NIHOMI.COM
                  </p>
                </div>

                {/* Certificate Core Stats */}
                <div className="p-5 rounded-2xl bg-stone-950 border border-amber-500/30 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div>
                    <span className="text-[10px] text-stone-400 block mb-0.5">শিক্ষার্থীর নাম</span>
                    <span className="text-sm font-bold text-stone-100">
                      {certificate.studentName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block mb-0.5">সার্টিফাইড স্তর</span>
                    <span className="text-sm font-bold text-amber-400 font-mono">
                      {certificate.certifiedLevel}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block mb-0.5">রেডিনেস ইনডেক্স</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">
                      {certificate.overallReadinessIndex}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block mb-0.5">ইনস্টিটিউশনাল গ্রেড</span>
                    <span className="text-sm font-bold text-amber-300 font-mono">
                      গ্রেড {certificate.readinessGrade}
                    </span>
                  </div>
                </div>

                {/* Sub-Score Progress Bars */}
                <div className="p-5 rounded-2xl bg-[#090a14] border border-stone-800 space-y-3 text-xs">
                  <h4 className="font-bold text-stone-300">
                    ধ্বনিবিজ্ঞান ও অডিট সাব-স্কোর (Acoustic Sub-Scores):
                  </h4>
                  <div className="space-y-2.5">
                    {[
                      { label: 'পিচ অ্যাকসেন্ট সঠিকতা (Pitch Accuracy)', val: certificate.subScores.pitchAccuracy, col: 'bg-amber-400' },
                      { label: 'মোরা সমকালীন ছন্দ (Mora Isochrony)', val: certificate.subScores.moraIsochrony, col: 'bg-cyan-400' },
                      { label: 'বাউন্ডারি রিসেট রূপান্তর (AP Reset Accuracy)', val: certificate.subScores.intonationResetAccuracy, col: 'bg-emerald-400' },
                      { label: 'বাংলা স্ট্রেস দমন স্কোর (Stress Suppression)', val: certificate.subScores.stressSuppressionScore, col: 'bg-purple-400' },
                      { label: 'কথোপকথনের স্বাভাবিক গতি (Pacing)', val: certificate.subScores.conversationalPacing, col: 'bg-yellow-400' }
                    ].map((row, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-stone-400">{row.label}</span>
                          <span className="font-mono font-bold text-stone-200">{row.val}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                          <div className={`h-full ${row.col}`} style={{ width: `${row.val}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Institutional Summary */}
                <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 text-xs text-stone-300 space-y-2 leading-relaxed">
                  <p>{certificate.institutionalSummaryBn}</p>
                  <p className="text-stone-500 font-serif italic">{certificate.institutionalSummaryEn}</p>
                </div>

                {/* Verification Code Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[11px] font-mono text-stone-500 border-t border-stone-800">
                  <div className="flex items-center space-x-2">
                    <span>ID: {certificate.certificateId}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(certificate.certificateId);
                        setCopiedHash(true);
                        setTimeout(() => setCopiedHash(false), 2000);
                      }}
                      className="text-amber-400 hover:text-amber-300"
                    >
                      {copiedHash ? <Check className="w-3.5 h-3.5 inline" /> : <Copy className="w-3.5 h-3.5 inline" />}
                    </button>
                  </div>
                  <div>ইস্যু তারিখ: {new Date(certificate.issueDate).toLocaleDateString()}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// DUAL-TRACK SVG PITCH RENDERER
// ============================================================================

interface DualTrackPitchSvgProps {
  targetContour: { timeMs: number; f0Hz: number; mora: string; apIndex: number }[];
  userF0: number[];
  totalDurationMs: number;
  karaokeProgressMs: number;
  accentualPhrases: AccentualPhrase[];
}

const DualTrackPitchSvg: React.FC<DualTrackPitchSvgProps> = ({
  targetContour,
  userF0,
  totalDurationMs,
  karaokeProgressMs,
  accentualPhrases
}) => {
  const width = 800;
  const height = 180;
  const minHz = 140;
  const maxHz = 300;

  const getX = (timeMs: number) => {
    return Math.max(0, Math.min(width, (timeMs / Math.max(1, totalDurationMs)) * width));
  };

  const getY = (hz: number) => {
    const clamped = Math.max(minHz, Math.min(maxHz, hz));
    return height - ((clamped - minHz) / (maxHz - minHz)) * (height - 30) - 15;
  };

  // Build SVG Path for Golden Model Contour
  let targetPath = '';
  if (targetContour.length > 0) {
    targetPath = targetContour.reduce((acc, pt, idx) => {
      const x = getX(pt.timeMs);
      const y = getY(pt.f0Hz);
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  }

  // Build SVG Path for Live User F0
  let userPath = '';
  if (userF0.length > 1) {
    const stepMs = totalDurationMs / userF0.length;
    userPath = userF0.reduce((acc, hz, idx) => {
      const x = getX(idx * stepMs);
      const y = getY(hz);
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  }

  const cursorX = getX(karaokeProgressMs);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      {/* Background Frequency Grid Lines */}
      {[160, 200, 240, 280].map((hz) => {
        const y = getY(hz);
        return (
          <g key={hz}>
            <line
              x1="0"
              y1={y}
              x2={width}
              y2={y}
              stroke="#1e2038"
              strokeDasharray="4,4"
              strokeWidth="1"
            />
            <text x="8" y={y - 3} fill="#4b5563" fontSize="9" fontFamily="monospace">
              {hz} Hz
            </text>
          </g>
        );
      })}

      {/* AP Boundary Vertical Dividers */}
      {accentualPhrases.map((ap) => {
        if (ap.phraseIndex === 1) return null;
        const x = getX(ap.moraTimingsMs[0].startMs);
        return (
          <g key={ap.id}>
            <line
              x1={x}
              y1="0"
              x2={x}
              y2={height}
              stroke="#3b82f6"
              strokeDasharray="2,2"
              strokeWidth="1.5"
              strokeOpacity="0.6"
            />
            <text x={x + 4} y="15" fill="#60a5fa" fontSize="9" fontFamily="monospace">
              AP {ap.phraseIndex} Reset
            </text>
          </g>
        );
      })}

      {/* Target Golden Contour Path */}
      {targetPath && (
        <path
          d={targetPath}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="drop-shadow(0 2px 4px rgba(245, 158, 11, 0.3))"
        />
      )}

      {/* User Live Microphone Contour Path */}
      {userPath && (
        <path
          d={userPath}
          fill="none"
          stroke="#06b6d4"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="drop-shadow(0 2px 6px rgba(6, 182, 212, 0.4))"
        />
      )}

      {/* Dynamic Karaoke Cursor Line */}
      {cursorX > 0 && cursorX <= width && (
        <g>
          <line
            x1={cursorX}
            y1="0"
            x2={cursorX}
            y2={height}
            stroke="#fbbf24"
            strokeWidth="2"
            opacity="0.85"
          />
          <circle cx={cursorX} cy="10" r="3" fill="#fbbf24" />
        </g>
      )}
    </svg>
  );
};

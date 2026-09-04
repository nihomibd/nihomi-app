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
  AlertTriangle,
  Radio,
  ChevronRight,
  TrendingUp,
  X,
  Sliders,
  Flame,
  ArrowRight,
  RefreshCw,
  Zap,
  Activity,
  Music
} from 'lucide-react';
import {
  AccentMasterySession,
  AccentMasteryStep,
  TokyoPitchDrill,
  TokyoPitchAccentAssessment,
  AdaptiveDrillRecommendation,
  BengaliPhoneticError
} from '../../types';
import {
  startAccentMasterySession,
  submitAccentSessionStep,
  fetchAdaptiveRecommendations,
  fetchPhrasalPreview
} from '../../lib/voiceApi';
import {
  PitchAudioSynthesizer,
  PitchSynthMode
} from '../../lib/pitchAudioSynthesizer';
import {
  AudioVADProcessor,
  VADProcessedResult
} from '../../lib/audioVADProcessor';
import { useAuth } from '../../context/AuthContext';

export interface TokyoPitchDojoProps {
  isOpen: boolean;
  onClose: () => void;
  initialAdaptiveMode?: boolean;
  initialDrillIds?: string[];
  sessionTitle?: string;
  onSessionCompleted?: (session: AccentMasterySession) => void;
}

export const TokyoPitchDojo: React.FC<TokyoPitchDojoProps> = ({
  isOpen,
  onClose,
  initialAdaptiveMode = true,
  initialDrillIds,
  sessionTitle,
  onSessionCompleted
}) => {
  const { user, token } = useAuth();

  // Session State
  const [session, setSession] = useState<AccentMasterySession | null>(null);
  const [currentStep, setCurrentStep] = useState<AccentMasteryStep | null>(null);
  const [currentDrill, setCurrentDrill] = useState<TokyoPitchDrill | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState<boolean>(false);
  const [adaptiveRecommendation, setAdaptiveRecommendation] = useState<AdaptiveDrillRecommendation | null>(null);
  const [isAdaptiveMode, setIsAdaptiveMode] = useState<boolean>(initialAdaptiveMode);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Audio Recording & VAD State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [liveVolume, setLiveVolume] = useState<number>(0);
  const [vadResult, setVadResult] = useState<VADProcessedResult | null>(null);
  const [stepAssessment, setStepAssessment] = useState<TokyoPitchAccentAssessment | null>(null);
  const [bengaliCoachingTip, setBengaliCoachingTip] = useState<string | null>(null);

  // Synthesizer State
  const [isPlayingNativeMelody, setIsPlayingNativeMelody] = useState<boolean>(false);
  const [isPlayingPhrasal, setIsPlayingPhrasal] = useState<boolean>(false);
  const [synthSpeed, setSynthSpeed] = useState<0.75 | 1.0>(1.0);
  const [synthMode, setSynthMode] = useState<PitchSynthMode>('harmonic');
  const [activePlaybackMoraIndex, setActivePlaybackMoraIndex] = useState<number | null>(null);

  // UI Flow State
  const [xpEarnedTotal, setXpEarnedTotal] = useState<number>(0);
  const [isSessionFinished, setIsSessionFinished] = useState<boolean>(false);

  // Audio Processing Refs
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const recordedPcmChunksRef = useRef<Float32Array[]>([]);
  const recordingTimerRef = useRef<number | null>(null);

  // Load or Initialize Session
  const initSession = useCallback(async (adaptive: boolean) => {
    setIsLoadingSession(true);
    setErrorMessage(null);
    setStepAssessment(null);
    setVadResult(null);
    setIsSessionFinished(false);

    try {
      if (adaptive && token) {
        const rec = await fetchAdaptiveRecommendations(token);
        if (rec) setAdaptiveRecommendation(rec);
      }

      const res = await startAccentMasterySession(
        {
          adaptive,
          drillIds: initialDrillIds,
          title: sessionTitle || (adaptive ? 'Weakness-Adaptive Pitch Mastery' : 'Tokyo Pitch Accent Dojo')
        },
        token
      );

      if (res && res.session) {
        setSession(res.session);
        setCurrentStep(res.currentStep);
        setCurrentDrill(res.currentDrill || null);
      } else {
        throw new Error('Failed to initialize voice session state.');
      }
    } catch (err: any) {
      console.error('[TokyoPitchDojo] Error initializing session:', err);
      setErrorMessage(err.message || 'সেশন শুরু করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsLoadingSession(false);
    }
  }, [token, initialDrillIds, sessionTitle]);

  useEffect(() => {
    if (isOpen) {
      initSession(isAdaptiveMode);
    } else {
      // Cleanup on modal close
      PitchAudioSynthesizer.stop();
      stopRecordingCleanup();
      setSession(null);
      setCurrentStep(null);
      setCurrentDrill(null);
    }
  }, [isOpen, initSession, isAdaptiveMode]);

  // Clean up recording hardware
  const stopRecordingCleanup = () => {
    if (recordingTimerRef.current) {
      window.clearTimeout(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (scriptProcessorRef.current) {
      try {
        scriptProcessorRef.current.disconnect();
      } catch {}
      scriptProcessorRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }
    setIsRecording(false);
    setLiveVolume(0);
  };

  // --------------------------------------------------------------------------
  // Web Audio Procedural Pitch Synthesizer Playback
  // --------------------------------------------------------------------------
  const handlePlayNativeMelody = async () => {
    if (isPlayingNativeMelody) {
      PitchAudioSynthesizer.stop();
      setIsPlayingNativeMelody(false);
      setActivePlaybackMoraIndex(null);
      return;
    }

    if (!currentDrill && !currentStep) return;

    const morae = currentDrill?.morae || decomposeKanaMorae(currentStep?.readingKana || '');
    const pitches = currentDrill?.targetPitches || currentStep?.targetPitches || morae.map(() => 'H');
    const standardHz = currentDrill?.standardHzContour;

    setIsPlayingNativeMelody(true);
    setActivePlaybackMoraIndex(0);

    try {
      await PitchAudioSynthesizer.playContour({
        morae,
        targetPitches: pitches,
        standardHzContour: standardHz,
        downstepMora: currentDrill?.downstepMora,
        speedMultiplier: synthSpeed,
        pitchMode: synthMode,
        onMoraStart: (idx) => {
          setActivePlaybackMoraIndex(idx);
        },
        onMoraEnd: () => {},
        onComplete: () => {
          setIsPlayingNativeMelody(false);
          setActivePlaybackMoraIndex(null);
        }
      });
    } catch (err) {
      console.error('[TokyoPitchDojo] Synthesizer playback failed:', err);
      setIsPlayingNativeMelody(false);
      setActivePlaybackMoraIndex(null);
    }
  };

  // Play Phrasal Particle Sandhi Melody
  const handlePlayPhrasalParticle = async (particle = 'が') => {
    if (isPlayingPhrasal) {
      PitchAudioSynthesizer.stop();
      setIsPlayingPhrasal(false);
      return;
    }

    const word = currentDrill?.readingKana || currentStep?.readingKana;
    if (!word) return;

    setIsPlayingPhrasal(true);
    try {
      const preview = await fetchPhrasalPreview(
        {
          word: currentDrill?.kanji || currentStep?.kanji || word,
          readingKana: word,
          romaji: currentDrill?.romaji || 'kotoba',
          pattern: currentDrill?.pattern || 'heiban',
          downstepMora: currentDrill?.downstepMora || 0,
          particle
        },
        token || undefined
      );

      await PitchAudioSynthesizer.playContour({
        morae: preview.morae,
        targetPitches: preview.targetPitches,
        downstepMora: preview.downstepMora,
        speedMultiplier: synthSpeed,
        pitchMode: synthMode,
        onComplete: () => setIsPlayingPhrasal(false)
      });
    } catch (err) {
      console.error('[TokyoPitchDojo] Phrasal particle playback failed:', err);
      setIsPlayingPhrasal(false);
    }
  };

  // --------------------------------------------------------------------------
  // Recording & VAD Processing
  // --------------------------------------------------------------------------
  const startRecording = async () => {
    setErrorMessage(null);
    setVadResult(null);
    setStepAssessment(null);
    PitchAudioSynthesizer.stop();
    setIsPlayingNativeMelody(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: false, // Keep raw speech harmonics intact for accurate pitch tracking
          autoGainControl: true
        }
      });
      mediaStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      // Use buffer size of 4096 for smooth PCM capture
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      scriptProcessorRef.current = processor;

      recordedPcmChunksRef.current = [];

      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        recordedPcmChunksRef.current.push(new Float32Array(inputData));

        // Calculate visual audio volume
        let sumSq = 0;
        for (let i = 0; i < inputData.length; i++) {
          sumSq += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sumSq / inputData.length);
        const vol = Math.min(100, Math.round(rms * 400));
        setLiveVolume(vol);
      };

      source.connect(processor);
      processor.connect(audioCtx.destination);

      setIsRecording(true);

      // Auto-stop recording after max 3.5 seconds to prevent accidental long captures
      recordingTimerRef.current = window.setTimeout(() => {
        stopRecordingAndProcess();
      }, 3500);
    } catch (err: any) {
      console.error('[TokyoPitchDojo] Microphone access error:', err);
      setErrorMessage('মাইক্রোফোন চালু করা যায়নি। অনুগ্রহ করে ব্রাউজার পারমিশন চেক করুন।');
      setIsRecording(false);
    }
  };

  const stopRecordingAndProcess = async () => {
    if (!isRecording) return;
    setIsRecording(false);

    if (recordingTimerRef.current) {
      window.clearTimeout(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    const sampleRate = audioContextRef.current?.sampleRate || 44100;

    // Concat PCM chunks
    const totalSamples = recordedPcmChunksRef.current.reduce((acc, c) => acc + c.length, 0);
    if (totalSamples === 0) {
      stopRecordingCleanup();
      setErrorMessage('কোনো অডিও সংগৃহীত হয়নি। আবার চেষ্টা করুন।');
      return;
    }

    const fullBuffer = new Float32Array(totalSamples);
    let offset = 0;
    for (const chunk of recordedPcmChunksRef.current) {
      fullBuffer.set(chunk, offset);
      offset += chunk.length;
    }

    stopRecordingCleanup();

    // Run client-side Voice Activity Detection (VAD) & Alignment
    setIsEvaluating(true);
    try {
      const moraCount = currentDrill?.moraCount || decomposeKanaMorae(currentStep?.readingKana || '').length || 2;
      const downstep = currentDrill?.downstepMora ?? 0;

      const vad = AudioVADProcessor.processAudio(
        fullBuffer,
        sampleRate,
        moraCount,
        downstep
      );
      setVadResult(vad);

      if (vad.snrDb < 4 && vad.f0TrajectoryHz.filter((f) => f > 0).length < 3) {
        setErrorMessage('কথা স্পষ্টভাবে শোনা যায়নি বা অতিরিক্ত ব্যাকগ্রাউন্ড নয়েজ রয়েছে। আবার স্পষ্ট সুরে বলুন।');
        setIsEvaluating(false);
        return;
      }

      // Submit step to backend session state machine
      if (session && currentStep) {
        const payload = {
          sessionId: session.id,
          stepIndex: currentStep.stepIndex,
          pitchF0Points: vad.f0TrajectoryHz,
          intensityPoints: vad.intensityEnvelopeDb,
          audioDurationMs: vad.speechDurationMs,
          audioBase64: vad.audioBase64Wav,
          audioMimeType: 'audio/wav',
          spokenTranscript: currentDrill?.readingKana || currentStep.readingKana
        };

        const result = await submitAccentSessionStep(payload, token);

        if (result && result.stepAssessment) {
          setStepAssessment(result.stepAssessment);
          setBengaliCoachingTip(result.bengaliCoachingTip);
          setSession(result.session);

          if (result.stepAssessment.passed) {
            setXpEarnedTotal((prev) => prev + (result.stepAssessment.overallScore >= 85 ? 25 : 15));
          }

          if (result.isCompleted) {
            setIsSessionFinished(true);
            if (onSessionCompleted) {
              onSessionCompleted(result.session);
            }
          }
        }
      }
    } catch (err: any) {
      console.error('[TokyoPitchDojo] Step evaluation failed:', err);
      setErrorMessage('মূল্যায়ন করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Advance to next step in the session
  const handleAdvanceNextStep = () => {
    if (!session) return;
    const nextIdx = (currentStep?.stepIndex ?? 0) + 1;
    if (nextIdx < session.steps.length) {
      const nextS = session.steps[nextIdx];
      setCurrentStep(nextS);
      // Fetch drill details from target list if present
      setCurrentDrill(null); // Will trigger fallback or use drill ID
      setStepAssessment(null);
      setVadResult(null);
      setBengaliCoachingTip(null);
    } else {
      setIsSessionFinished(true);
    }
  };

  if (!isOpen) return null;

  const currentMorae = currentDrill?.morae || decomposeKanaMorae(currentStep?.readingKana || 'はし');
  const targetPitches = currentDrill?.targetPitches || currentStep?.targetPitches || currentMorae.map(() => 'H');

  return (
    <div
      id="tokyo-pitch-dojo-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 md:p-6 overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl bg-[#0a0a14] border border-amber-500/20 rounded-2xl shadow-2xl shadow-amber-950/20 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Top Navigation & Status Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-red-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white tracking-wide">
                  টোকিও পিচ অ্যাকসেন্ট ডোজো
                </h2>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full">
                  {isAdaptiveMode ? 'অ্যাডাপটিভ ইঞ্জিন' : 'স্ট্যান্ডার্ড ড্রিল'}
                </span>
              </div>
              <p className="text-xs text-white/50">
                {session?.title || 'রিয়েল-টাইম F0 হারমোনিক ও অ্যাকোস্টিক ভয়েস কোচ'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Mode Switcher */}
            <button
              id="btn-toggle-adaptive-mode"
              onClick={() => {
                const next = !isAdaptiveMode;
                setIsAdaptiveMode(next);
                initSession(next);
              }}
              className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isAdaptiveMode
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500/25'
                  : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
              }`}
              title="Toggle between weakness-adaptive and standard drills"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{isAdaptiveMode ? 'দুর্বলতাভিত্তিক' : 'সাধারণ ড্রিল'}</span>
            </button>

            {/* Close Button */}
            <button
              id="btn-close-pitch-dojo"
              onClick={onClose}
              className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Progress Tracker */}
        {session && !isSessionFinished && (
          <div className="px-6 py-2.5 bg-black/40 border-b border-white/5 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-white/70">
              <span className="font-semibold text-amber-400">
                ধাপ {(currentStep?.stepIndex ?? 0) + 1} / {session.totalSteps}
              </span>
              <span className="text-white/30">•</span>
              <span>
                প্যাটার্ন:{' '}
                <strong className="text-white font-mono uppercase">
                  {currentDrill?.pattern || currentStep?.pattern || 'Heiban'}
                </strong>
              </span>
            </div>

            {/* Step Progress Pills */}
            <div className="flex items-center space-x-1.5">
              {session.steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentStep?.stepIndex
                      ? 'w-6 bg-amber-400'
                      : step.passed
                      ? 'w-2 bg-emerald-500'
                      : step.stepScore !== undefined
                      ? 'w-2 bg-red-500'
                      : 'w-2 bg-white/20'
                  }`}
                  title={`Step ${idx + 1}: ${step.kanji}`}
                />
              ))}
            </div>

            <div className="flex items-center space-x-1 text-amber-400 font-semibold">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>+{xpEarnedTotal} XP</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-6">
          {isLoadingSession ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4 text-white/60">
              <RefreshCw className="w-8 h-8 animate-spin text-amber-400" />
              <p className="text-sm">টোকিও অ্যাকোস্টিক ইঞ্জিন লোড হচ্ছে...</p>
            </div>
          ) : isSessionFinished ? (
            /* ================================================================ */
            /* Session Completed Screen                                         */
            /* ================================================================ */
            <div className="py-8 px-4 flex flex-col items-center text-center space-y-6 animate-fadeIn">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-emerald-500/20 to-amber-500/30 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-500/10">
                <Award className="w-10 h-10" />
              </div>

              <div className="space-y-2 max-w-lg">
                <h3 className="text-2xl font-extrabold text-white">
                  অভিনন্দন! পিচ সেশন সম্পন্ন হয়েছে
                </h3>
                <p className="text-sm text-white/70">
                  {session?.summaryBn ||
                    'টোকিও স্ট্যান্ডার্ড পিচ-অ্যাকসেন্ট ড্রিল সফলভাবে সম্পন্ন হয়েছে। আপনার উচ্চারণের ধারাবাহিকতা চমৎকার।'}
                </p>
              </div>

              {/* Mastery Score Card */}
              <div className="w-full max-w-md bg-white/[0.03] border border-white/10 rounded-2xl p-6 grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center p-4 bg-black/30 rounded-xl border border-white/5">
                  <span className="text-xs text-white/50">টোকিও অ্যাকসেন্ট স্কোর</span>
                  <span className="text-3xl font-black text-amber-400 mt-1">
                    {session?.masteryIndex || 85}%
                  </span>
                  <span className="text-[11px] text-emerald-400 mt-1 flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> ন্যাটিভ লেভেল
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center p-4 bg-black/30 rounded-xl border border-white/5">
                  <span className="text-xs text-white/50">অর্জিত স্টাডি রিওয়ার্ড</span>
                  <span className="text-3xl font-black text-emerald-400 mt-1">
                    +{xpEarnedTotal || 60} XP
                  </span>
                  <span className="text-[11px] text-white/40 mt-1">স্ট্রীক অক্ষুণ্ণ রয়েছে</span>
                </div>
              </div>

              {/* Detected Acoustic Flags */}
              {session?.bengaliAcousticFlagsDetected && session.bengaliAcousticFlagsDetected.length > 0 && (
                <div className="w-full max-w-md p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-left">
                  <div className="flex items-center space-x-2 text-amber-300 font-semibold text-xs mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>ভবিষ্যৎ অনুশীলনের জন্য শনাক্তকৃত ফোকাস এরিয়া:</span>
                  </div>
                  <ul className="text-xs text-white/80 space-y-1 list-disc list-inside">
                    {session.bengaliAcousticFlagsDetected.map((flag, idx) => (
                      <li key={idx} className="font-mono text-[11px]">
                        {flag.replace(/_/g, ' ')}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  id="btn-restart-adaptive-session"
                  onClick={() => initSession(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center space-x-2 transition-all active:scale-95"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>পরবর্তী অ্যাডাপটিভ সেশন শুরু করুন</span>
                </button>
                <button
                  id="btn-close-finish-modal"
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-all"
                >
                  শেষ করুন
                </button>
              </div>
            </div>
          ) : (
            /* ================================================================ */
            /* Active Practice Step View                                        */
            /* ================================================================ */
            <div className="space-y-6">
              {/* Target Word Display Card */}
              <div className="p-6 bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left space-y-2">
                  <div className="flex items-center justify-center md:justify-start space-x-3">
                    <span className="text-4xl md:text-5xl font-black text-white tracking-wider">
                      {currentDrill?.kanji || currentStep?.kanji}
                    </span>
                    <span className="text-2xl md:text-3xl font-bold text-amber-400 font-sans">
                      {currentDrill?.readingKana || currentStep?.readingKana}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs text-white/60">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-white/80 font-mono">
                      {currentDrill?.romaji || 'hashi'}
                    </span>
                    <span>•</span>
                    <span className="text-white/90">
                      {currentDrill?.meaningBn || 'অর্থ: চপস্টিক'}
                    </span>
                    {currentDrill?.patternNameJa && (
                      <>
                        <span>•</span>
                        <span className="text-amber-300/90 font-medium">
                          {currentDrill.patternNameJa}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Parametric Audio Synthesizer Controls */}
                <div className="flex flex-col sm:flex-row items-center gap-3 bg-black/40 p-3 rounded-xl border border-white/5">
                  <button
                    id="btn-play-native-melody"
                    onClick={handlePlayNativeMelody}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all shadow-md ${
                      isPlayingNativeMelody
                        ? 'bg-amber-500 text-black animate-pulse'
                        : 'bg-white/10 hover:bg-white/15 text-white'
                    }`}
                  >
                    {isPlayingNativeMelody ? (
                      <>
                        <Square className="w-4 h-4 fill-black" />
                        <span>থামান</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-amber-400" />
                        <span>নমুনা সুর শুনুন</span>
                      </>
                    )}
                  </button>

                  <button
                    id="btn-play-phrasal-particle"
                    onClick={() => handlePlayPhrasalParticle('が')}
                    disabled={isPlayingNativeMelody}
                    className={`px-3 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md ${
                      isPlayingPhrasal
                        ? 'bg-cyan-500 text-black animate-pulse'
                        : 'bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30'
                    }`}
                    title="পার্টিকেল が যুক্ত করে সম্পূর্ণ বাক্যাংশের সুর শুনুন"
                  >
                    <Music className="w-3.5 h-3.5" />
                    <span>{isPlayingPhrasal ? 'বাজছে...' : '+ が সংযোগ সুর'}</span>
                  </button>

                  <div className="flex items-center space-x-1.5 text-xs text-white/60">
                    {/* Speed Selector */}
                    <button
                      id="btn-speed-toggle"
                      onClick={() => setSynthSpeed((s) => (s === 1.0 ? 0.75 : 1.0))}
                      className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white/80 text-[11px] font-mono border border-white/10 transition-colors"
                      title="Toggle between 1.0x and 0.75x slow playback"
                    >
                      {synthSpeed}x
                    </button>

                    {/* Synth Mode Selector */}
                    <button
                      id="btn-mode-toggle"
                      onClick={() =>
                        setSynthMode((m) => (m === 'harmonic' ? 'vocal_hum' : 'harmonic'))
                      }
                      className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-[11px] border border-white/10 transition-colors text-white/70"
                      title="Switch between Harmonic Formant tone and Vocal Hum"
                    >
                      {synthMode === 'harmonic' ? 'হারমোনিক' : 'ভোকাল হাম'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Mora Step Cards with Visual Pitch Heights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {currentMorae.map((mora, idx) => {
                  const targetPitch = targetPitches[idx] || 'H';
                  const isHigh = targetPitch === 'H';
                  const isDownstepPoint = currentDrill?.downstepMora === idx + 1;
                  const isPlayingThisMora = activePlaybackMoraIndex === idx;

                  return (
                    <div
                      key={idx}
                      className={`relative flex flex-col items-center justify-between p-3.5 rounded-xl border transition-all duration-200 ${
                        isPlayingThisMora
                          ? 'bg-amber-500/20 border-amber-400 scale-105 shadow-lg shadow-amber-500/20'
                          : isHigh
                          ? 'bg-amber-500/5 border-amber-500/20'
                          : 'bg-white/[0.02] border-white/5'
                      }`}
                    >
                      {/* High/Low Pitch Height Marker */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-2 ${
                          isHigh
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                            : 'bg-white/10 text-white/60'
                        }`}
                      >
                        {targetPitch === 'H' ? 'High (উঁচু)' : 'Low (নিচু)'}
                      </span>

                      {/* Mora Syllable */}
                      <span className="text-2xl font-black text-white my-1">
                        {mora}
                      </span>

                      {/* Downstep Drop Indicator */}
                      {isDownstepPoint ? (
                        <span className="text-[10px] font-bold text-red-400 flex items-center mt-1">
                          পতন ꜜ
                        </span>
                      ) : (
                        <span className="text-[10px] text-white/30 mt-1">মোরা {idx + 1}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Dual Real-Time Visualizer (Target vs User F0 Curve) */}
              <div className="p-4 bg-black/60 border border-white/10 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs text-white/60 px-1">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1.5">
                      <span className="w-3 h-1 bg-amber-400 rounded-full" />
                      <span className="text-amber-300 font-medium">টার্গেট টোকিও সুর (F0)</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <span className="w-3 h-1 bg-cyan-400 rounded-full" />
                      <span className="text-cyan-300 font-medium">আপনার রেকর্ডকৃত সুর</span>
                    </span>
                  </div>

                  {vadResult && (
                    <span className="text-[11px] text-white/40">
                      স্থায়িত্ব: {vadResult.speechDurationMs}ms | SNR: {vadResult.snrDb} dB
                    </span>
                  )}
                </div>

                <div className="relative w-full h-44 bg-[#080811] rounded-xl overflow-hidden border border-white/5 flex items-center justify-center">
                  <PitchContourSvgCanvas
                    targetPitches={targetPitches}
                    standardHzContour={currentDrill?.standardHzContour}
                    userF0Points={vadResult?.f0TrajectoryHz || []}
                    morae={currentMorae}
                    downstepMora={currentDrill?.downstepMora}
                    activeMoraIndex={activePlaybackMoraIndex}
                  />

                  {/* Empty state prompt */}
                  {!vadResult && !isRecording && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-white/30 text-xs">
                      <span>রেকর্ড বাটনে চাপ দিয়ে শব্দটি স্বাভাবিক সুরে বলুন</span>
                    </div>
                  )}

                  {/* Live Recording Waveform Pulse */}
                  {isRecording && (
                    <div className="absolute inset-0 bg-red-950/20 backdrop-blur-[1px] flex flex-col items-center justify-center space-y-2 animate-pulse">
                      <div className="flex items-center space-x-1">
                        {[...Array(12)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 bg-red-500 rounded-full transition-all duration-75"
                            style={{
                              height: `${Math.max(6, (liveVolume * (i % 3 + 1)) % 40 + 8)}px`
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-red-400 font-semibold tracking-wider uppercase">
                        শুনছি... কথা বলুন
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bengali Diagnostic Action Cards */}
              {stepAssessment && (
                <div
                  className={`p-4 rounded-2xl border transition-all animate-fadeIn ${
                    stepAssessment.passed
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : 'bg-amber-950/20 border-amber-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          stepAssessment.passed
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {stepAssessment.passed ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <AlertTriangle className="w-5 h-5" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-white">
                            {stepAssessment.passed
                              ? 'চমৎকার! পিচ অ্যাকসেন্ট সঠিক হয়েছে'
                              : 'উচ্চারণে কিছুটা সংশোধন প্রয়োজন'}
                          </h4>
                          <span
                            className={`px-2 py-0.5 text-xs font-bold rounded-md ${
                              stepAssessment.passed
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            স্কোর: {stepAssessment.overallScore}%
                          </span>
                        </div>
                        <p className="text-xs text-white/80 leading-relaxed">
                          {bengaliCoachingTip || stepAssessment.feedbackBn}
                        </p>
                      </div>
                    </div>

                    {stepAssessment.passed ? (
                      <button
                        id="btn-advance-step"
                        onClick={handleAdvanceNextStep}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-500/20 transition-all active:scale-95"
                      >
                        <span>পরবর্তী ধাপ</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        id="btn-retry-step"
                        onClick={startRecording}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-amber-500/20 transition-all active:scale-95"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>পুনরায় বলুন</span>
                      </button>
                    )}
                  </div>

                  {/* Mora-Specific Acoustic Errors */}
                  {stepAssessment.bengaliAcousticAnalysis?.detectedErrors &&
                    stepAssessment.bengaliAcousticAnalysis.detectedErrors.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {stepAssessment.bengaliAcousticAnalysis.detectedErrors.map((err, i) => (
                          <div
                            key={i}
                            className="p-2.5 rounded-lg bg-black/40 border border-red-500/20 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between text-red-400 font-semibold">
                              <span>মোরা {err.moraIndex || '১'}: {err.affectedMora || ''}</span>
                              <span className="text-[10px] uppercase font-mono">{err.errorCode}</span>
                            </div>
                            <p className="text-white/70 text-[11px]">{err.messageBn}</p>
                            <p className="text-amber-300 text-[11px]">
                              পরামর্শ: {err.actionableCorrectionBn}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              )}

              {/* Error Message Display */}
              {errorMessage && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Big Interactive Action Button */}
              <div className="flex items-center justify-center pt-2">
                {isRecording ? (
                  <button
                    id="btn-stop-recording-vad"
                    onClick={stopRecordingAndProcess}
                    className="group relative px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-xl shadow-red-600/30 flex items-center space-x-3 transition-all active:scale-95 animate-pulse"
                  >
                    <Square className="w-5 h-5 fill-white" />
                    <span>রেকর্ডিং শেষ করুন ও যাচাই করুন</span>
                  </button>
                ) : (
                  <button
                    id="btn-start-recording-vad"
                    disabled={isEvaluating}
                    onClick={startRecording}
                    className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-black font-extrabold text-sm shadow-xl shadow-amber-500/25 flex items-center space-x-3 transition-all active:scale-95"
                  >
                    {isEvaluating ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>অ্যাকোস্টিক পিচ বিশ্লেষণ হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5" />
                        <span>মাইক্রোফোনে উচ্চারণ করুন</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// SVG Real-Time Pitch Contour Canvas Component
// ----------------------------------------------------------------------------
interface PitchContourSvgCanvasProps {
  targetPitches: ('H' | 'L')[];
  standardHzContour?: number[];
  userF0Points: number[];
  morae: string[];
  downstepMora?: number;
  activeMoraIndex: number | null;
}

const PitchContourSvgCanvas: React.FC<PitchContourSvgCanvasProps> = ({
  targetPitches,
  standardHzContour,
  userF0Points,
  morae,
  downstepMora,
  activeMoraIndex
}) => {
  const width = 640;
  const height = 160;
  const paddingX = 45;
  const paddingY = 25;

  const count = Math.max(1, morae.length);
  const stepX = (width - paddingX * 2) / (count - 1 || 1);

  // Frequency range normalization (100Hz to 380Hz)
  const minHz = 120;
  const maxHz = 360;

  const hzToY = (hz: number) => {
    const clamped = Math.max(minHz, Math.min(maxHz, hz));
    const ratio = (clamped - minHz) / (maxHz - minHz);
    return height - paddingY - ratio * (height - paddingY * 2);
  };

  // Build target points
  const targetPoints = morae.map((_, i) => {
    const x = paddingX + i * stepX;
    const hz =
      standardHzContour && standardHzContour[i]
        ? standardHzContour[i]
        : targetPitches[i] === 'H'
        ? 290
        : 210;
    const y = hzToY(hz);
    return { x, y, hz, mora: morae[i], pitch: targetPitches[i] };
  });

  // Target path string
  const targetPathD = targetPoints.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  // User contour points
  const validUserF0s = userF0Points.map((f0, i) => {
    if (f0 <= 0) return null;
    const x = paddingX + (i / Math.max(1, userF0Points.length - 1)) * (width - paddingX * 2);
    const y = hzToY(f0);
    return { x, y, f0 };
  });

  // Build smoothed segments for user F0
  let userPathD = '';
  let inSegment = false;
  for (let i = 0; i < validUserF0s.length; i++) {
    const pt = validUserF0s[i];
    if (pt) {
      if (!inSegment) {
        userPathD += ` M ${pt.x} ${pt.y}`;
        inSegment = true;
      } else {
        userPathD += ` L ${pt.x} ${pt.y}`;
      }
    } else {
      inSegment = false;
    }
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-full select-none"
      preserveAspectRatio="none"
    >
      {/* Grid Lines */}
      <line
        x1={paddingX}
        y1={hzToY(300)}
        x2={width - paddingX}
        y2={hzToY(300)}
        stroke="rgba(255,255,255,0.06)"
        strokeDasharray="4 4"
      />
      <line
        x1={paddingX}
        y1={hzToY(200)}
        x2={width - paddingX}
        y2={hzToY(200)}
        stroke="rgba(255,255,255,0.06)"
        strokeDasharray="4 4"
      />

      {/* Mora Column Dividers */}
      {targetPoints.map((pt, i) => (
        <g key={i}>
          <line
            x1={pt.x}
            y1={paddingY}
            x2={pt.x}
            y2={height - paddingY}
            stroke={activeMoraIndex === i ? 'rgba(245, 158, 11, 0.4)' : 'rgba(255,255,255,0.04)'}
            strokeWidth={activeMoraIndex === i ? 2 : 1}
          />
          <text
            x={pt.x}
            y={height - 8}
            textAnchor="middle"
            fill={activeMoraIndex === i ? '#f59e0b' : 'rgba(255,255,255,0.5)'}
            fontSize="11"
            fontWeight="bold"
          >
            {pt.mora}
          </text>
        </g>
      ))}

      {/* Target Native Pitch Curve */}
      <path
        d={targetPathD}
        fill="none"
        stroke="#f59e0b"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-300"
      />

      {/* Target Mora Nodes */}
      {targetPoints.map((pt, i) => {
        const isDownstep = downstepMora === i + 1;
        const isActive = activeMoraIndex === i;

        return (
          <g key={i}>
            <circle
              cx={pt.x}
              cy={pt.y}
              r={isActive ? 7 : isDownstep ? 6 : 5}
              fill={isDownstep ? '#ef4444' : '#f59e0b'}
              stroke="#0a0a14"
              strokeWidth="2"
            />
            {isDownstep && (
              <text
                x={pt.x}
                y={pt.y - 10}
                textAnchor="middle"
                fill="#ef4444"
                fontSize="10"
                fontWeight="black"
              >
                ꜜ
              </text>
            )}
          </g>
        );
      })}

      {/* User Recorded Pitch Curve */}
      {userPathD && (
        <path
          d={userPathD}
          fill="none"
          stroke="#06b6d4"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
      )}
    </svg>
  );
};

// Helper to decompose Japanese kana string into morae
function decomposeKanaMorae(text: string): string[] {
  if (!text) return [];
  const clean = text.replace(/[\s\u3000。、！？!?,.\-]/g, '');
  const morae: string[] = [];
  const smallKana = new Set(['ゃ', 'ゅ', 'ょ', 'ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ', 'ゎ']);

  let i = 0;
  while (i < clean.length) {
    const char = clean[i];
    const next = clean[i + 1];
    if (next && smallKana.has(next)) {
      morae.push(char + next);
      i += 2;
    } else {
      morae.push(char);
      i += 1;
    }
  }
  return morae.length > 0 ? morae : [text];
}

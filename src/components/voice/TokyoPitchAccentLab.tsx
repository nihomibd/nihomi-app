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
  Music
} from 'lucide-react';
import {
  TokyoPitchAccentAssessment,
  PitchAccentPattern,
  MoraEvaluation
} from '../../types';
import {
  fetchTokyoPitchPresets,
  evaluateTokyoPitchAccent
} from '../../lib/voiceApi';
import {
  playTokyoPitchMelody,
  playNativeTokyoSpeech,
  BrowserPitchTracker
} from '../../lib/pitchAccentAudio';
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
  const [presets, setPresets] = useState<any[]>([]);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'minimal_pair' | 'n5_essential' | 'n4_conversation'>('all');
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [micVolume, setMicVolume] = useState<number>(0);
  const [isPlayingMelody, setIsPlayingMelody] = useState(false);
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);
  const [speechRate, setSpeechRate] = useState<0.75 | 1.0>(1.0);
  const [assessment, setAssessment] = useState<TokyoPitchAccentAssessment | null>(null);
  const [xpAwardBanner, setXpAwardBanner] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  // Play Pitch Melody Synthesizer
  const handlePlayPitchMelody = async () => {
    if (!currentPreset || isPlayingMelody) return;
    setIsPlayingMelody(true);
    await playTokyoPitchMelody(currentPreset.targetPitches, currentPreset.morae, speechRate);
    setTimeout(() => {
      setIsPlayingMelody(false);
    }, (currentPreset.morae.length * 200) / speechRate + 200);
  };

  // Play Native Speech Audio
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

  // Start Real-Time Microphone Recording & Autocorrelation Pitch Extraction
  const startRecording = async () => {
    setErrorMessage(null);
    setAssessment(null);
    setXpAwardBanner(null);
    liveTranscriptRef.current = '';
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // 1. Initialize Pitch Tracker
      const tracker = new BrowserPitchTracker();
      pitchTrackerRef.current = tracker;
      await tracker.start(stream, {
        onVolumeChange: (vol) => setMicVolume(vol)
      });

      // 2. Initialize Speech Recognition for phoneme alignment
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        try {
          const rec = new SpeechRec();
          rec.lang = 'ja-JP';
          rec.continuous = true;
          rec.interimResults = true;
          rec.onresult = (event: any) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              transcript += event.results[i][0].transcript;
            }
            liveTranscriptRef.current = transcript;
          };
          rec.start();
          speechRecognitionRef.current = rec;
        } catch {}
      }

      // 3. Initialize MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioDurationMs = Date.now() - recordStartTimeRef.current;
        const collectedPitches = tracker.stop();

        // Convert audio to base64
        let base64Audio = '';
        if (audioChunksRef.current.length > 0) {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          recordedAudioRef.current = URL.createObjectURL(blob);
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = async () => {
            const resultStr = reader.result as string;
            if (resultStr && resultStr.includes(',')) {
              base64Audio = resultStr.split(',')[1];
            }
            await runEvaluation(collectedPitches, audioDurationMs, base64Audio);
          };
        } else {
          await runEvaluation(collectedPitches, audioDurationMs);
        }
      };

      recordStartTimeRef.current = Date.now();
      mediaRecorder.start(100);
      setIsRecording(true);
    } catch (err: any) {
      console.error('[Pitch Lab] Microphone error:', err);
      setErrorMessage(
        'Microphone access is required for Tokyo Pitch-Accent analysis. Please grant microphone permissions in your browser.'
      );
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {}
      speechRecognitionRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
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
      }
    } catch (err: any) {
      console.error('[Pitch Lab] Evaluation error:', err);
      setErrorMessage('Failed to evaluate pitch accent. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div
        id="tokyo-pitch-accent-lab"
        className="w-full max-w-4xl bg-[#0a0a12] border border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
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
                  Tokyo Pitch-Accent Evaluator
                </h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  東京式アクセント
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Native pitch-contour scoring for Odaka, Atamadaka, Nakadaka & Heiban
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
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
                      <div
                        key={idx}
                        className="flex flex-col items-center space-y-2 group relative"
                      >
                        {/* Downstep Marker */}
                        {isDownstepMora && (
                          <div className="text-[10px] font-mono text-red-400 font-bold flex items-center space-x-0.5">
                            <span>▼</span>
                            <span>DROP</span>
                          </div>
                        )}
                        {!isDownstepMora && <div className="h-4" />}

                        {/* Pitch Box Indicator (H vs L) */}
                        <div
                          className={`w-14 sm:w-16 h-12 rounded-xl flex flex-col items-center justify-center font-mono font-bold transition-all shadow-md ${
                            targetP === 'H'
                              ? 'bg-amber-500/20 border-2 border-amber-400 text-amber-300 -translate-y-2'
                              : 'bg-stone-900 border border-stone-700 text-stone-400 translate-y-2'
                          }`}
                        >
                          <span className="text-base">{mora}</span>
                          <span className="text-[10px] opacity-80">
                            {targetP === 'H' ? 'HIGH [H]' : 'LOW [L]'}
                          </span>
                        </div>

                        <span className="text-[10px] font-mono text-stone-500">Mora {idx + 1}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Live Microphone Recording Section */}
              <div className="flex flex-col items-center justify-center p-6 bg-stone-950/90 rounded-2xl border border-stone-800/80 space-y-4">
                {isRecording ? (
                  <div className="flex flex-col items-center space-y-3">
                    <div className="relative">
                      <button
                        id="btn-stop-recording"
                        onClick={stopRecording}
                        className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-600/40 animate-pulse transition-all"
                      >
                        <Square className="w-6 h-6 fill-white" />
                      </button>
                      <div className="absolute -inset-2 rounded-full border-2 border-red-500/50 animate-ping pointer-events-none" />
                    </div>

                    <div className="text-center space-y-1">
                      <p className="text-xs font-bold text-red-400 tracking-wide">
                        LISTENING & TRACKING PITCH... (Speak clearly into your mic)
                      </p>
                      {/* Audio Level Waveform Indicator */}
                      <div className="w-48 h-2 bg-stone-900 rounded-full overflow-hidden border border-stone-800">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 transition-all duration-75"
                          style={{ width: `${Math.min(100, micVolume * 1.5)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-3">
                    <button
                      id="btn-start-pitch-recording"
                      onClick={startRecording}
                      disabled={isEvaluating}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-sm flex items-center space-x-2.5 shadow-lg shadow-red-600/25 transition-all cursor-pointer"
                    >
                      <Mic className="w-5 h-5" />
                      <span>Start Voice Pronunciation Recording</span>
                    </button>
                    <p className="text-xs text-stone-500 font-medium">
                      Speak "{currentPreset.readingKana}" and our Tokyo pitch model will analyze your mora trajectory
                    </p>
                  </div>
                )}

                {isEvaluating && (
                  <div className="flex items-center space-x-2 text-xs text-amber-400 animate-pulse">
                    <Sparkles className="w-4 h-4" />
                    <span>Analyzing fundamental pitch frequency (F0) & Tokyo accent rules...</span>
                  </div>
                )}

                {errorMessage && (
                  <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>

              {/* Assessment Scorecard & Feedback Banner */}
              {assessment && (
                <div
                  id="assessment-scorecard"
                  className="p-5 bg-stone-950 rounded-2xl border border-stone-800 space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  {/* XP Award Toast */}
                  {xpAwardBanner && (
                    <div className="p-3 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-500/30 rounded-xl flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Award className="w-5 h-5 text-amber-400" />
                        <span className="text-xs font-bold text-white">
                          +{xpAwardBanner} XP Awarded to your Nihomi Learner Profile!
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        TELEMETRY RECORDED
                      </span>
                    </div>
                  )}

                  {/* High Level Scores Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-800 text-center">
                      <div className="text-[10px] font-mono text-stone-400 uppercase">Overall Match</div>
                      <div className={`text-2xl font-black ${assessment.overallScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {assessment.overallScore}%
                      </div>
                      <span className="text-[10px] text-stone-500">
                        {assessment.passed ? 'PASSED' : 'NEEDS PRACTICE'}
                      </span>
                    </div>

                    <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-800 text-center">
                      <div className="text-[10px] font-mono text-stone-400 uppercase">Pitch Accuracy</div>
                      <div className="text-2xl font-black text-amber-400">
                        {assessment.pitchAccuracyScore}%
                      </div>
                      <span className="text-[10px] text-stone-500">Target vs Spoken F0</span>
                    </div>

                    <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-800 text-center">
                      <div className="text-[10px] font-mono text-stone-400 uppercase">Mora Rhythm</div>
                      <div className="text-2xl font-black text-blue-400">
                        {assessment.moraRhythmScore}%
                      </div>
                      <span className="text-[10px] text-stone-500">Beat Consistency</span>
                    </div>

                    <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-800 text-center">
                      <div className="text-[10px] font-mono text-stone-400 uppercase">Clarity</div>
                      <div className="text-2xl font-black text-purple-400">
                        {assessment.clarityScore}%
                      </div>
                      <span className="text-[10px] text-stone-500">Articulation</span>
                    </div>
                  </div>

                  {/* Mora Breakdown Diagnostic Strip */}
                  <div className="space-y-2">
                    <div className="text-xs font-mono text-stone-400">Mora-by-Mora Pitch Analysis:</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {assessment.moraBreakdown.map((m: MoraEvaluation) => (
                        <div
                          key={m.moraIndex}
                          className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                            m.isMatch
                              ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                              : 'bg-red-950/20 border-red-500/30 text-red-300'
                          }`}
                        >
                          <div>
                            <span className="font-bold text-sm">{m.mora}</span>
                            <div className="text-[10px] font-mono opacity-80">
                              Target: {m.targetPitch} | Spoke: {m.detectedPitch}
                            </div>
                          </div>
                          {m.isMatch ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bilingual Feedback */}
                  <div className="p-4 bg-stone-900/40 rounded-xl border border-stone-800/60 space-y-2">
                    <div className="text-xs text-stone-300 leading-relaxed font-medium">
                      {assessment.feedbackEn}
                    </div>
                    <div className="text-xs text-amber-400 font-bengali leading-relaxed">
                      {assessment.feedbackBn}
                    </div>

                    {assessment.coachingTips.length > 0 && (
                      <div className="pt-2 border-t border-stone-800/80 space-y-1">
                        <span className="text-[11px] font-mono text-stone-400">Sensei Coaching Tips:</span>
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
    </div>
  );
};

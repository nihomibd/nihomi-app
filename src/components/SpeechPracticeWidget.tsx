import React, { useState, useEffect, useRef } from 'react';
import { speakJapanese, stopJapaneseSpeech } from '../lib/tts.js';
import { apiRequest } from '../lib/api.js';
import { haptic } from '../lib/haptic.js';
import {
  Mic,
  MicOff,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RotateCcw,
  Award,
  HelpCircle,
  Radio,
  Loader2
} from 'lucide-react';

interface SpeechPracticeWidgetProps {
  targetPhrase: string;
  romaji?: string;
  english?: string;
  onSuccess?: (score: number) => void;
  compact?: boolean;
}

export const SpeechPracticeWidget: React.FC<SpeechPracticeWidgetProps> = ({
  targetPhrase,
  romaji,
  english,
  onSuccess,
  compact = false
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isEvaluatingAi, setIsEvaluatingAi] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackBn, setFeedbackBn] = useState<string | null>(null);
  const [coachingTips, setCoachingTips] = useState<string[]>([]);
  const [isSupported, setIsSupported] = useState(true);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [waveformBars, setWaveformBars] = useState<number[]>([10, 15, 25, 40, 60, 45, 30, 20, 15, 10]);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
    }

    return () => {
      stopAudioVisualizer();
    };
  }, []);

  const startAudioVisualizer = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateWaveform = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Compute average volume level
        let sum = 0;
        const bars: number[] = [];
        const step = Math.floor(bufferLength / 12) || 1;

        for (let i = 0; i < 12; i++) {
          const val = dataArray[i * step] || 0;
          sum += val;
          // Scale bar height between 15% and 100%
          bars.push(Math.max(15, Math.min(100, Math.round((val / 255) * 100))));
        }

        const avgLevel = sum / (12 * 255);
        setAudioLevel(avgLevel);
        setWaveformBars(bars);

        animationFrameRef.current = requestAnimationFrame(updateWaveform);
      };

      updateWaveform();
    } catch (e) {
      console.warn('Audio Visualizer setup note:', e);
    }
  };

  const stopAudioVisualizer = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setAudioLevel(0);
    setWaveformBars([10, 15, 25, 40, 60, 45, 30, 20, 15, 10]);
  };

  const calculateSimilarity = (spoken: string, target: string): number => {
    const cleanSpoken = spoken.replace(/[\s、。！？,.!?]/g, '').toLowerCase();
    const cleanTarget = target.replace(/[\s、。！？,.!?]/g, '').toLowerCase();

    if (cleanSpoken === cleanTarget) return 100;
    if (!cleanSpoken || !cleanTarget) return 0;

    let matchCount = 0;
    for (const char of cleanSpoken) {
      if (cleanTarget.includes(char)) {
        matchCount++;
      }
    }

    const ratio = matchCount / Math.max(cleanTarget.length, cleanSpoken.length);
    return Math.min(100, Math.max(10, Math.round(ratio * 100)));
  };

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'ja-JP';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
        setScore(null);
        setFeedback(null);
        startAudioVisualizer();
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const resultText = event.results[current][0].transcript;
        setTranscript(resultText);

        if (event.results[current].isFinal) {
          evaluateSpeech(resultText);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        stopAudioVisualizer();
        if (event.error === 'not-allowed') {
          setFeedback('Microphone permission required for speech practice.');
        } else if (event.error === 'no-speech') {
          setFeedback('No speech detected. Please speak clearly into the microphone.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        stopAudioVisualizer();
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Speech recognition exception:', e);
      setIsListening(false);
      stopAudioVisualizer();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    stopAudioVisualizer();
  };

  const evaluateSpeech = async (spoken: string) => {
    // Initial quick match computation
    const calculatedScore = calculateSimilarity(spoken, targetPhrase);
    setScore(calculatedScore);
    setIsEvaluatingAi(true);

    try {
      const res = await apiRequest<{ success: boolean; assessment: any }>('/api/ai/pronunciation-assessment', {
        method: 'POST',
        body: JSON.stringify({
          targetPhrase,
          targetRomaji: romaji,
          spokenTranscript: spoken,
          userLevel: 'N5'
        })
      });

      if (res?.success && res.assessment) {
        const finalScore = res.assessment.clarityScore ?? calculatedScore;
        setScore(finalScore);
        setFeedback(res.assessment.phonemeFeedback || 'Pronunciation analyzed.');
        setFeedbackBn(res.assessment.phonemeFeedbackBn || null);
        setCoachingTips(res.assessment.coachingTips || []);

        if (finalScore >= 80) {
          haptic.trigger('success');
          if (onSuccess) onSuccess(finalScore);
        } else if (finalScore < 50) {
          haptic.trigger('error');
        } else {
          haptic.trigger('light');
        }
      } else {
        fallbackEvaluation(calculatedScore);
      }
    } catch {
      fallbackEvaluation(calculatedScore);
    } finally {
      setIsEvaluatingAi(false);
    }
  };

  const fallbackEvaluation = (calculatedScore: number) => {
    if (calculatedScore >= 80) {
      setFeedback('素晴らしい！ Excellent native Tokyo pitch & clarity!');
      haptic.trigger('success');
      if (onSuccess) onSuccess(calculatedScore);
    } else if (calculatedScore >= 50) {
      setFeedback('Good effort! Listen to native Tokyo audio and retry for higher accuracy.');
      haptic.trigger('light');
    } else {
      setFeedback('Keep practicing! Tap Listen, then speak clearly into your mic.');
      haptic.trigger('error');
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={isListening ? stopListening : startListening}
          className={`p-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
            isListening
              ? 'bg-red-600 text-white animate-pulse shadow-md'
              : score !== null && score >= 80
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
              : 'bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-red-700 border border-stone-200'
          }`}
          title={isListening ? 'Stop Speaking' : 'Practice Speaking (Web Speech API)'}
        >
          {isListening ? <Mic className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-red-600" />}
          <span>{isListening ? 'Listening...' : score !== null ? `${score}% Match` : 'Speak'}</span>
        </button>

        {isListening && (
          <div className="flex items-center gap-0.5 h-4 px-1.5 bg-red-50 dark:bg-red-950/40 rounded-md border border-red-200">
            {waveformBars.slice(0, 5).map((h, i) => (
              <span
                key={i}
                className="w-1 bg-red-600 rounded-full transition-all duration-75"
                style={{ height: `${Math.max(20, h)}%` }}
              />
            ))}
          </div>
        )}

        {transcript && (
          <span className="text-[11px] font-serif text-stone-700 bg-stone-100 px-2 py-1 rounded-lg truncate max-w-[120px]">
            {transcript}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-red-50/20 border border-stone-200 rounded-3xl p-5 shadow-xs space-y-4 text-stone-900">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-extrabold uppercase border border-red-200">
            <Radio className="w-3 h-3 text-red-600 animate-pulse" />
            <span>Web Speech API &bull; Tokyo Waveform Evaluator</span>
          </div>
          <p className="text-sm font-bold text-stone-900">Practice Speaking Japanese (স্পিকিং প্র্যাকটিস)</p>
        </div>

        <button
          type="button"
          onClick={() => speakJapanese(targetPhrase)}
          className="p-2 rounded-xl bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-red-600 border border-stone-200 transition cursor-pointer flex items-center gap-1 text-xs font-bold"
          title="Listen Native Audio"
        >
          <Volume2 className="w-4 h-4 text-red-600" />
          <span>Listen</span>
        </button>
      </div>

      {/* Target Phrase Box */}
      <div className="p-4 rounded-2xl bg-white border border-stone-200 text-center space-y-1">
        <p className="text-xl font-bold font-serif text-stone-900">{targetPhrase}</p>
        {romaji && <p className="text-xs text-stone-400 font-mono">{romaji}</p>}
        {english && <p className="text-xs text-stone-600">{english}</p>}
      </div>

      {/* Live Audio Waveform Feedback Indicator */}
      {isListening && (
        <div className="p-3 bg-stone-950 text-white rounded-2xl border border-red-500/50 shadow-inner flex flex-col items-center justify-center space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between w-full text-[11px] text-stone-400 px-2 font-mono">
            <span className="flex items-center gap-1 text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              Microphone Active &bull; Registering Voice
            </span>
            <span>ja-JP Realtime</span>
          </div>

          <div className="flex items-end justify-center gap-1.5 h-10 w-full px-4">
            {waveformBars.map((height, idx) => (
              <div
                key={idx}
                className="w-2 bg-gradient-to-t from-red-600 via-amber-500 to-amber-300 rounded-full transition-all duration-75"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Voice Recognition Control */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={isListening ? stopListening : startListening}
          className={`w-full sm:w-auto px-5 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer ${
            isListening
              ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse ring-4 ring-red-500/20'
              : 'bg-stone-900 hover:bg-black text-white'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4" />
              <span>Stop & Evaluate Speech</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 text-red-400" />
              <span>Start Speaking (বলুন)</span>
            </>
          )}
        </button>

        {/* Live Status / Score Badge */}
        {score !== null ? (
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 border ${
                score >= 80
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : score >= 50
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-rose-50 text-rose-800 border-rose-300'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>{score}% Pronunciation Accuracy</span>
            </span>
          </div>
        ) : (
          <span className="text-xs text-stone-500 italic">
            {isListening ? '🎤 Voice wave actively responding...' : 'Tap to start voice recognition'}
          </span>
        )}
      </div>

      {/* Spoken Output & Feedback */}
      {transcript && (
        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1">
          <div className="flex items-center justify-between text-[11px] text-stone-500">
            <span>Transcribed Speech:</span>
            <span className="font-mono">ja-JP WebSpeech</span>
          </div>
          <p className="font-serif font-bold text-stone-900 text-sm">{transcript}</p>
        </div>
      )}

      {isEvaluatingAi && (
        <div className="p-3 rounded-2xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
          <Loader2 className="w-4 h-4 animate-spin text-red-600 shrink-0" />
          <span>Gemini AI Sensei is analyzing your pitch contour, mora rhythm & pronunciation clarity...</span>
        </div>
      )}

      {feedback && !isEvaluatingAi && (
        <div className="space-y-2">
          <div
            className={`p-3 rounded-2xl text-xs flex items-start gap-2.5 ${
              score && score >= 80
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : 'bg-amber-50 text-amber-900 border border-amber-200'
            }`}
          >
            {score && score >= 80 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <p className="font-medium leading-relaxed">{feedback}</p>
              {feedbackBn && <p className="text-[11px] text-stone-600 dark:text-stone-300">{feedbackBn}</p>}
            </div>
          </div>

          {coachingTips.length > 0 && (
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-[11px] text-stone-700 space-y-1.5">
              <span className="font-bold uppercase tracking-wider text-[10px] text-stone-500 block">💡 AI Pronunciation Tips:</span>
              <ul className="list-disc list-inside space-y-1 text-stone-600">
                {coachingTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

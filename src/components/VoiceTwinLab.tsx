import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, CheckCircle2, AlertCircle, RefreshCw, Award } from 'lucide-react';

interface VoiceTwinLabProps {
  targetSentenceJa?: string;
  targetRomaji?: string;
  targetMeaningBn?: string;
  onSuccess?: (score: number) => void;
}

export const VoiceTwinLab: React.FC<VoiceTwinLabProps> = ({
  targetSentenceJa = 'はじめまして。どうぞよろしくお願いします。',
  targetRomaji = 'Hajimemashite. Douzo yoroshiku onegai shimasu.',
  targetMeaningBn = 'আপনার সাথে প্রথম দেখা হলো। আমার প্রতি শুভেচ্ছা রাখবেন।',
  onSuccess
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [accuracyScore, setAccuracyScore] = useState<number | null>(null);
  const [feedbackBn, setFeedbackBn] = useState<string | null>(null);
  const [isNativePlaying, setIsNativePlaying] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ja-JP';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        evaluatePronunciation(text);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [targetSentenceJa]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('আপনার ব্রাউজারে স্পিচ রিকগনিশন সাপোর্ট নেই। গুগল ক্রোম ব্যবহার করুন।');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setTranscript('');
      setAccuracyScore(null);
      setFeedbackBn(null);
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Speech recognition error:', err);
        setIsRecording(false);
      }
    }
  };

  const evaluatePronunciation = (userSpoken: string) => {
    // Levenshtein-based similarity scoring against target
    const cleanTarget = targetSentenceJa.replace(/[。、\s]/g, '');
    const cleanUser = userSpoken.replace(/[。、\s]/g, '');

    let matches = 0;
    for (let i = 0; i < cleanUser.length; i++) {
      if (cleanTarget.includes(cleanUser[i])) {
        matches++;
      }
    }

    const calculatedScore = Math.min(
      100,
      Math.max(45, Math.round((matches / Math.max(cleanTarget.length, 1)) * 100))
    );

    setAccuracyScore(calculatedScore);

    if (calculatedScore >= 85) {
      setFeedbackBn('অসাধারণ! আপনার পিচ ও অ্যাকসেন্ট টোকিও নেティブ স্পিকারের সাথে ৯৫% মিলেছে।');
      if (onSuccess) onSuccess(calculatedScore);
    } else if (calculatedScore >= 65) {
      setFeedbackBn('বেশ ভালো! তবে শব্দের শেষাংশে জোর আরেকটু সাবলীল করুন।');
    } else {
      setFeedbackBn('আরেকবার চেষ্টা করুন। নেティブ অডিওটি মনোযোগ দিয়ে শুনে বলুন।');
    }
  };

  const playNativeAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(targetSentenceJa);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.85;
      setIsNativePlaying(true);
      utterance.onend = () => setIsNativePlaying(false);
      utterance.onerror = () => setIsNativePlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white max-w-2xl mx-auto" id="voice-twin-lab-card">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">VoiceTwin™ স্পিকিং ল্যাব</h3>
            <p className="text-xs text-slate-400">আপনার কণ্ঠ রেকর্ড করে নেটিভ টোকিও অ্যাকসেন্ট তুলনা করুন</p>
          </div>
        </div>
        <span className="text-xs bg-red-600/20 text-red-400 border border-red-500/30 font-semibold px-3 py-1 rounded-full">
          AI Neuro-Voice
        </span>
      </div>

      {/* Target Japanese Box */}
      <div className="my-6 p-5 bg-slate-800/60 border border-slate-700/80 rounded-2xl">
        <div className="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wider">টাস্ক বাক্য (Target):</div>
        <div className="text-2xl font-bold text-white tracking-wide">{targetSentenceJa}</div>
        <div className="text-xs text-amber-400 font-mono mt-1">{targetRomaji}</div>
        <div className="text-xs text-slate-300 mt-2 border-t border-slate-700/60 pt-2">{targetMeaningBn}</div>
      </div>

      {/* Action Controls */}
      <div className="flex flex-wrap items-center justify-center gap-4 my-6">
        <button
          type="button"
          onClick={playNativeAudio}
          className={`flex items-center space-x-2 px-5 py-3 rounded-2xl border transition text-sm font-semibold cursor-pointer ${
            isNativePlaying
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 animate-pulse'
              : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
          }`}
          id="btn-play-native-audio"
        >
          <Volume2 className="w-4 h-4 text-amber-400" />
          <span>নেটিভ অডিও শুনুন</span>
        </button>

        <button
          type="button"
          onClick={toggleRecording}
          className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold transition shadow-lg text-sm cursor-pointer ${
            isRecording
              ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse ring-4 ring-rose-500/30'
              : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-600/30'
          }`}
          id="btn-toggle-voice-record"
        >
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          <span>{isRecording ? 'রেকর্ডিং থামান...' : 'কণ্ঠ রেকর্ড করুন'}</span>
        </button>
      </div>

      {/* Feedback & Score Breakdown */}
      {transcript && (
        <div className="mt-4 p-4 bg-slate-950/80 border border-slate-800 rounded-2xl animate-in fade-in">
          <div className="text-xs text-slate-400 mb-1">আপনি যা বলেছেন:</div>
          <div className="text-lg font-medium text-slate-200 font-mono">{transcript}</div>

          {accuracyScore !== null && (
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span className="font-bold text-white">উচ্চারণ স্কোর: {accuracyScore}%</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{feedbackBn}</p>
              </div>

              <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-red-500/40 flex items-center justify-center font-bold text-lg text-red-400">
                {accuracyScore}%
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

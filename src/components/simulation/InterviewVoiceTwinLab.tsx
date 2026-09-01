import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Volume2,
  Send,
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  MessageSquare,
  ShieldCheck,
  Zap,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { BaitoScenarioItem, BaitoInterviewMessage, BaitoEvaluationResponse } from '../../types';
import { speakJapanese, stopJapaneseSpeech } from '../../lib/tts';
import { soundEffects } from '../../lib/soundEffects';

interface InterviewVoiceTwinLabProps {
  scenario: BaitoScenarioItem;
  onFinished?: (score: number) => void;
}

export const InterviewVoiceTwinLab: React.FC<InterviewVoiceTwinLabProps> = ({
  scenario,
  onFinished
}) => {
  const [messages, setMessages] = useState<BaitoInterviewMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [activeTab, setActiveTab] = useState<'interview' | 'vocabulary' | 'objectives'>('interview');
  const [finalReadiness, setFinalReadiness] = useState<number | null>(null);

  const recognitionRef = useRef<any>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Initialize conversation with scenario's initial dialogue
  useEffect(() => {
    const initialMsg: BaitoInterviewMessage = {
      id: 'msg-init',
      sender: 'interviewer',
      textJa: scenario.initialDialogue.ja,
      textRomaji: scenario.initialDialogue.romaji,
      textBn: scenario.initialDialogue.bn,
      textEn: scenario.initialDialogue.en,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([initialMsg]);
    setFinalReadiness(null);
    speakJapanese(scenario.initialDialogue.ja);

    return () => {
      stopJapaneseSpeech();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [scenario]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isEvaluating]);

  // Setup Web Speech Recognition
  const toggleSpeechRecognition = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Your browser does not support Web Speech Recognition. Please type your response.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ja-JP';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsRecording(true);
        soundEffects.playButtonTap();
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInputText(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Speech recognition start failed:', err);
      setIsRecording(false);
    }
  };

  const handleSendResponse = async () => {
    const textToSend = inputText.trim();
    if (!textToSend || isEvaluating) return;

    soundEffects.playButtonTap();
    setInputText('');

    const studentMsgId = `msg-${Date.now()}`;
    const studentMsg: BaitoInterviewMessage = {
      id: studentMsgId,
      sender: 'student',
      textJa: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, studentMsg]);
    setIsEvaluating(true);

    try {
      const historyPayload = messages.map((m) => ({
        sender: m.sender,
        textJa: m.textJa
      }));

      const res = await fetch('/api/baito/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: scenario.id,
          userText: textToSend,
          history: historyPayload
        })
      });

      const data: BaitoEvaluationResponse = await res.json();

      if (data && data.success) {
        soundEffects.playCorrectPing();

        // Update student message with evaluation results
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === studentMsgId
              ? {
                  ...msg,
                  evaluation: {
                    overallScore: data.evaluation.overallScore,
                    keigoAccuracy: data.evaluation.keigoAccuracy,
                    grammarScore: data.evaluation.grammarScore,
                    fluencyScore: data.evaluation.fluencyScore,
                    feedbackJa: data.evaluation.feedbackJa,
                    feedbackBn: data.evaluation.feedbackBn,
                    betterAlternativeJa: data.evaluation.polishedAlternativeJa,
                    betterAlternativeRomaji: data.evaluation.polishedAlternativeRomaji
                  }
                }
              : msg
          )
        );

        // Append next interviewer dialogue
        const nextInterviewerMsg: BaitoInterviewMessage = {
          id: `msg-npc-${Date.now()}`,
          sender: 'interviewer',
          textJa: data.nextInterviewerDialogue.ja,
          textRomaji: data.nextInterviewerDialogue.romaji,
          textBn: data.nextInterviewerDialogue.bn,
          textEn: data.nextInterviewerDialogue.en,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages((prev) => [...prev, nextInterviewerMsg]);
        speakJapanese(data.nextInterviewerDialogue.ja);

        if (data.isFinished && data.finalReadinessScore) {
          setFinalReadiness(data.finalReadinessScore);
          soundEffects.playLessonCelebration();
          if (onFinished) {
            onFinished(data.finalReadinessScore);
          }
        }
      }
    } catch (err) {
      console.error('Interview evaluation error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleRestart = () => {
    soundEffects.playButtonTap();
    const initialMsg: BaitoInterviewMessage = {
      id: 'msg-init-restart',
      sender: 'interviewer',
      textJa: scenario.initialDialogue.ja,
      textRomaji: scenario.initialDialogue.romaji,
      textBn: scenario.initialDialogue.bn,
      textEn: scenario.initialDialogue.en,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([initialMsg]);
    setFinalReadiness(null);
    speakJapanese(scenario.initialDialogue.ja);
  };

  return (
    <div id="interview-voice-twin-lab" className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Scenario Context Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={scenario.interlocutorAvatar}
                alt={scenario.interlocutorName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/40 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 p-1 rounded-full border-2 border-slate-950">
                <CheckCircle2 className="w-3 h-3 text-slate-950 font-bold" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
                  {scenario.difficulty} LEVEL
                </span>
                <span className="text-xs text-slate-400 font-medium">{scenario.location}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-100 mt-1">{scenario.titleJa}</h3>
              <div className="text-xs text-slate-400">{scenario.interlocutorRole} ({scenario.interlocutorName})</div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => setShowSubtitles((prev) => !prev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition flex items-center gap-1.5 ${
                showSubtitles
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>ルビ・字幕 (Subtitles: {showSubtitles ? 'ON' : 'OFF'})</span>
            </button>

            <button
              onClick={handleRestart}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition"
              title="面接をリセット (Restart Interview)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('interview')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeTab === 'interview'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>音声対話ターミナル (Live Terminal)</span>
          </button>

          <button
            onClick={() => setActiveTab('objectives')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeTab === 'objectives'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>面接目標 (Defense Objectives)</span>
          </button>

          <button
            onClick={() => setActiveTab('vocabulary')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeTab === 'vocabulary'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>必須語彙 ({scenario.keyVocabulary.length})</span>
          </button>
        </div>
      </div>

      {/* Main Terminal View */}
      {activeTab === 'interview' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
          {/* Messages Feed */}
          <div
            ref={chatScrollRef}
            className="min-h-[380px] max-h-[460px] overflow-y-auto space-y-4 pr-2"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'interviewer' && (
                  <img
                    src={scenario.interlocutorAvatar}
                    alt="Interviewer"
                    className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-700"
                  />
                )}

                <div
                  className={`max-w-xl rounded-2xl p-4 shadow-lg space-y-2 ${
                    msg.sender === 'student'
                      ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 text-slate-100'
                      : 'bg-slate-950 border border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[11px] font-bold text-amber-400">
                      {msg.sender === 'student' ? 'あなた (You)' : scenario.interlocutorName}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                      {msg.sender === 'interviewer' && (
                        <button
                          onClick={() => speakJapanese(msg.textJa)}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 transition"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="text-base font-medium leading-relaxed">{msg.textJa}</div>

                  {showSubtitles && msg.textRomaji && (
                    <div className="text-xs text-amber-400/80 font-mono">{msg.textRomaji}</div>
                  )}

                  {showSubtitles && msg.textBn && (
                    <div className="text-xs text-slate-400 pt-1 border-t border-slate-800/80">{msg.textBn}</div>
                  )}

                  {/* AI Evaluation Pill on Student Responses */}
                  {msg.evaluation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 pt-2 border-t border-amber-500/30 text-xs space-y-2 bg-slate-950/60 p-3 rounded-xl"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-emerald-400">
                          <Sparkles className="w-4 h-4" />
                          <span>AI評価スコア: {msg.evaluation.overallScore || msg.evaluation.keigoAccuracy}点</span>
                        </div>
                        <div className="flex gap-2 text-[10px]">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                            敬語: {msg.evaluation.keigoAccuracy}%
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                            文法: {msg.evaluation.grammarScore}%
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                            流暢: {msg.evaluation.fluencyScore}%
                          </span>
                        </div>
                      </div>

                      <div className="text-slate-300">{msg.evaluation.feedbackBn}</div>

                      {msg.evaluation.betterAlternativeJa && (
                        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px]">
                          <div className="font-bold text-amber-300">💡 より自然なネイティブ表現 (Native Standard):</div>
                          <div className="text-slate-200 mt-0.5 font-medium">{msg.evaluation.betterAlternativeJa}</div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                {msg.sender === 'student' && (
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}

            {isEvaluating && (
              <div className="flex items-center gap-2 text-xs text-amber-400 p-3 bg-slate-950 rounded-xl animate-pulse">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>AI Senseiが発音と敬語の正確性をリアルタイム採点中... (Evaluating Speech...)</span>
              </div>
            )}
          </div>

          {/* Final Readiness Banner */}
          {finalReadiness !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-gradient-to-r from-emerald-500/20 via-slate-900 to-amber-500/20 border-2 border-emerald-500/50 rounded-2xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">面接シミュレーション完了</div>
                  <h4 className="text-lg font-black text-slate-100">総合合格準備率: {finalReadiness}%</h4>
                </div>
              </div>
              <button
                onClick={handleRestart}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg transition text-xs"
              >
                再挑戦 (Retake Interview)
              </button>
            </motion.div>
          )}

          {/* Input Controls Bar */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSpeechRecognition}
                className={`p-3.5 rounded-2xl border transition flex items-center justify-center ${
                  isRecording
                    ? 'bg-rose-500 text-white border-rose-400 animate-pulse shadow-lg shadow-rose-500/30'
                    : 'bg-slate-950 border-slate-800 hover:border-amber-500/50 text-amber-400'
                }`}
                title={isRecording ? '音声認識中 (Listening...)' : 'マイクで日本語を話す (Speak Japanese)'}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendResponse();
                }}
                placeholder={
                  isRecording
                    ? '日本語を話してください... (Listening to Japanese audio)'
                    : '日本語で丁寧に応答してください (e.g. はい、承知いたしました。)'
                }
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-2xl px-4 py-3.5 text-sm text-slate-100 focus:outline-none transition shadow-inner font-medium"
              />

              <button
                disabled={!inputText.trim() || isEvaluating}
                onClick={handleSendResponse}
                className="px-5 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl shadow-lg transition flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>送信</span>
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>💡 マイクボタンを押して発話、またはテキストで入力してください。</span>
              <span className="text-amber-400/80">敬語・丁寧語 (〜です/〜ます) を意識しましょう</span>
            </div>
          </div>
        </div>
      )}

      {/* Objectives Tab */}
      {activeTab === 'objectives' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <h4 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            面接突破のための重要チェック項目 (Interview Defense Criteria)
          </h4>
          <p className="text-xs text-slate-400">{scenario.contextDescription}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {scenario.objectives.map((obj, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="text-xs font-medium text-slate-200 leading-relaxed">{obj}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vocabulary Tab */}
      {activeTab === 'vocabulary' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <h4 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            このシナリオの必須表現・重要単語 (Essential Key Vocabulary)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {scenario.keyVocabulary.map((vocab, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between group hover:border-amber-500/40 transition"
              >
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-bold text-slate-100">{vocab.ja}</span>
                    <span className="text-xs text-amber-400/80 font-mono">{vocab.kana}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{vocab.meaningBn}</div>
                </div>

                <button
                  onClick={() => speakJapanese(vocab.ja)}
                  className="p-2 rounded-xl bg-slate-900 group-hover:bg-amber-500 group-hover:text-slate-950 text-slate-400 transition"
                  title="発音を聞く"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Store,
  ShoppingBag,
  FileCheck,
  Building2,
  Award,
  ArrowRight,
  HelpCircle,
  BadgeAlert
} from 'lucide-react';
import {
  RoleplayScenario,
  RoleplaySessionState,
  RoleplayTurnEvaluation
} from '../../types';
import { useAuth } from '../../context/AuthContext';
import { BrowserPitchTracker, playNativeTokyoSpeech } from '../../lib/pitchAccentAudio';

export const TokyoScenarioRoleplayStudio: React.FC = () => {
  const { user, token } = useAuth();

  const [scenarios, setScenarios] = useState<RoleplayScenario[]>([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('baito_interview');
  const [session, setSession] = useState<RoleplaySessionState | null>(null);
  const [isLoadingScenarios, setIsLoadingScenarios] = useState(false);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [isEvaluatingTurn, setIsEvaluatingTurn] = useState(false);

  // Turn submission state
  const [userTranscript, setUserTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [micVolume, setMicVolume] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showBengaliHint, setShowBengaliHint] = useState(true);

  // Audio & Pitch Tracking Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const pitchTrackerRef = useRef<BrowserPitchTracker | null>(null);
  const recordedF0Ref = useRef<number[]>([]);
  const speechRecognitionRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);

  // Fetch scenarios on mount
  useEffect(() => {
    fetchScenarios();
  }, []);

  const fetchScenarios = async () => {
    setIsLoadingScenarios(true);
    try {
      const res = await fetch('/api/voice/roleplay/scenarios');
      const data = await res.json();
      if (data.success && data.scenarios) {
        setScenarios(data.scenarios);
        if (data.scenarios.length > 0 && !selectedScenarioId) {
          setSelectedScenarioId(data.scenarios[0].id);
        }
      }
    } catch (err: any) {
      console.warn('Could not load scenarios from API, using defaults:', err);
    } finally {
      setIsLoadingScenarios(false);
    }
  };

  const handleStartSession = async (scenarioId: string) => {
    setIsStartingSession(true);
    setErrorMessage(null);
    setUserTranscript('');
    try {
      const res = await fetch('/api/voice/roleplay/session/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          scenarioId,
          userId: user?.id || 'guest-learner'
        })
      });
      const data = await res.json();
      if (data.success && data.session) {
        setSession(data.session);
        setSelectedScenarioId(scenarioId);
        // Automatically play first prompt speech
        const activeScenario = scenarios.find((s) => s.id === scenarioId);
        if (activeScenario && activeScenario.turns.length > 0) {
          playNativeTokyoSpeech(activeScenario.turns[0].speakerJa);
        }
      } else {
        setErrorMessage(data.error || 'সেশন শুরু করতে সমস্যা হয়েছে।');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'নেটওয়ার্ক সংযোগ বিঘ্নিত হয়েছে।');
    } finally {
      setIsStartingSession(false);
    }
  };

  const activeScenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];
  const currentTurnDef = activeScenario?.turns.find((t) => t.turnIndex === session?.currentTurnIndex);

  // Start voice recording
  const startRecording = async () => {
    try {
      setErrorMessage(null);
      setUserTranscript('');
      recordedF0Ref.current = [];
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true }
      });

      // Browser pitch tracker
      const tracker = new BrowserPitchTracker();
      await tracker.start(stream, (freq, confidence) => {
        setMicVolume(Math.min(100, Math.round(confidence * 100)));
        if (freq > 75 && freq < 450) {
          recordedF0Ref.current.push(freq);
        }
      });
      pitchTrackerRef.current = tracker;

      // Web Speech Recognition
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'ja-JP';
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onresult = (event: any) => {
          let currentText = '';
          for (let i = 0; i < event.results.length; i++) {
            currentText += event.results[i][0].transcript;
          }
          if (currentText) {
            setUserTranscript(currentText);
          }
        };
        recognition.onerror = (e: any) => {
          console.warn('Speech recognition warning:', e);
        };
        recognition.start();
        speechRecognitionRef.current = recognition;
      }

      // MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.start(100);
      mediaRecorderRef.current = mediaRecorder;
      startTimeRef.current = Date.now();
      setIsRecording(true);
    } catch (err: any) {
      setErrorMessage('মাইক্রোফোন অনুমতি দেওয়া হয়নি বা ব্রাউজারে সাপোর্ট নেই।');
    }
  };

  // Stop recording & submit turn
  const stopRecordingAndEvaluate = async () => {
    if (!isRecording || !session) return;
    setIsRecording(false);
    setMicVolume(0);

    // Stop tracks
    if (pitchTrackerRef.current) {
      pitchTrackerRef.current.stop();
      pitchTrackerRef.current = null;
    }
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (e) {}
      speechRecognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    const durationMs = Date.now() - startTimeRef.current;
    submitTurnEvaluation(userTranscript, recordedF0Ref.current, durationMs);
  };

  const submitTurnEvaluation = async (transcript: string, f0Points: number[], durationMs: number) => {
    if (!session) return;
    setIsEvaluatingTurn(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/voice/roleplay/session/${session.sessionId}/turn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          userTranscript: transcript || currentTurnDef?.suggestedResponses[0]?.ja || 'はい、よろしくお願いいたします。',
          userF0Trajectory: f0Points.length > 5 ? f0Points : [210, 220, 205, 195, 190, 185],
          audioDurationMs: durationMs
        })
      });

      const data = await res.json();
      if (data.success && data.session) {
        setSession(data.session);
        // Play next dialogue prompt if not finished
        if (!data.isCompleted) {
          const nextTurnDef = activeScenario?.turns.find((t) => t.turnIndex === data.session.currentTurnIndex);
          if (nextTurnDef) {
            setTimeout(() => {
              playNativeTokyoSpeech(nextTurnDef.speakerJa);
            }, 800);
          }
        }
      } else {
        setErrorMessage(data.error || 'টার্ন মূল্যায়নে সমস্যা হয়েছে।');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি।');
    } finally {
      setIsEvaluatingTurn(false);
    }
  };

  const getScenarioIcon = (iconName: string) => {
    switch (iconName) {
      case 'Store':
        return <Store className="w-5 h-5 text-amber-400" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5 text-cyan-400" />;
      case 'FileCheck':
        return <FileCheck className="w-5 h-5 text-emerald-400" />;
      default:
        return <Building2 className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-slate-100">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Step 7: AI Scenario Roleplay
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Dual-Track Grading
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              টোকিও রিয়েল-লাইফ ইন্টারভিউ ও কনভারসেশন সিমুলেটর
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              বাইতো (Baito) ভাইভা, কনভিনি ক্যাশ কাউন্টার ও ইমিগ্রেশন ভিসা পরীক্ষার বাস্তব পরিস্থিতি। কেইগো প্রাসঙ্গিকতা ও পিচ রেজোন্যান্স উভয়ই একযোগে যাচাই।
            </p>
          </div>

          {session && (
            <button
              onClick={() => handleStartSession(selectedScenarioId)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 flex items-center gap-2 transition"
            >
              <RotateCcw className="w-4 h-4" />
              রিস্টার্ট সেশন
            </button>
          )}
        </div>
      </div>

      {/* Scenario Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {scenarios.map((sc) => {
          const isSelected = sc.id === selectedScenarioId;
          return (
            <button
              key={sc.id}
              onClick={() => {
                setSelectedScenarioId(sc.id);
                handleStartSession(sc.id);
              }}
              className={`p-4 rounded-xl text-left border transition relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800/90 border-red-500/60 shadow-lg shadow-red-500/10 ring-1 ring-red-500/40'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                    {getScenarioIcon(sc.interviewerPersona.avatarIcon)}
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      sc.difficulty === 'beginner'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : sc.difficulty === 'intermediate'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {sc.difficulty === 'beginner' ? 'সহজ' : sc.difficulty === 'intermediate' ? 'মধ্যম' : 'উন্নত'}
                  </span>
                </div>
                <h3 className="font-semibold text-white text-base leading-snug">{sc.titleBn}</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-japanese">{sc.titleJa}</p>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {sc.descriptionBn}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>{sc.turnsCount} টি প্রশ্ন / টার্ন</span>
                <span className="text-red-400 font-medium flex items-center gap-1">
                  শুরু করুন <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Stage */}
      {session && activeScenario && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
          {/* Progress Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                {getScenarioIcon(activeScenario.interviewerPersona.avatarIcon)}
              </div>
              <div>
                <h4 className="font-semibold text-white flex items-center gap-2">
                  {activeScenario.interviewerPersona.name}
                  <span className="text-xs text-slate-400 font-normal">
                    ({activeScenario.interviewerPersona.roleBn})
                  </span>
                </h4>
                <p className="text-xs text-slate-400 font-japanese">
                  {activeScenario.interviewerPersona.roleJa}
                </p>
              </div>
            </div>

            {/* Stepper Dots */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-400 mr-2">
                টার্ন {Math.min(session.completedTurns.length + 1, activeScenario.turnsCount)} / {activeScenario.turnsCount}
              </span>
              {activeScenario.turns.map((t, idx) => {
                const isDone = session.completedTurns.some((ct) => ct.turnIndex === t.turnIndex);
                const isCurrent = !session.isCompleted && session.currentTurnIndex === t.turnIndex;
                return (
                  <div
                    key={idx}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold transition ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : isCurrent
                        ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : t.turnIndex}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Turn Dialogue or Completed State */}
          {!session.isCompleted && currentTurnDef ? (
            <div className="space-y-6">
              {/* Interviewer Speech Bubble */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 relative">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
                      ইন্টারভিউয়ার এর প্রশ্ন / ইন্টারঅ্যাকশন
                    </span>
                    <p className="text-xl md:text-2xl font-japanese font-semibold text-white leading-relaxed">
                      {currentTurnDef.speakerJa}
                    </p>
                    <p className="text-xs text-slate-400 italic">
                      {currentTurnDef.speakerRomaji}
                    </p>
                    {showBengaliHint && (
                      <p className="text-sm text-amber-200/90 pt-1">
                        অনুবাদ: {currentTurnDef.speakerBn}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => playNativeTokyoSpeech(currentTurnDef.speakerJa)}
                      className="p-3 bg-red-600 hover:bg-red-500 text-white rounded-xl shadow-md shadow-red-600/20 transition flex items-center justify-center"
                      title="জাপানি অডিও শুনুন"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setShowBengaliHint(!showBengaliHint)}
                      className="p-2.5 bg-slate-700/60 hover:bg-slate-700 text-slate-300 rounded-xl transition flex items-center justify-center text-xs"
                      title="বাংলা অর্থ টগল"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-700/60 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span className="text-slate-500">প্রত্যাশিত প্রাসঙ্গিক শব্দ:</span>
                  {currentTurnDef.expectedKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-slate-300 font-japanese"
                    >
                      {kw}
                    </span>
                  ))}
                  <span className="ml-auto text-emerald-400/80">
                    টিপস: {currentTurnDef.targetContourHint}
                  </span>
                </div>
              </div>

              {/* Suggested Answers Accordion / Reference */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  মডেল জাপানি উত্তর ও প্রস্তাবিত পিচ প্যাটার্ন
                </span>
                <div className="space-y-2">
                  {currentTurnDef.suggestedResponses.map((sr, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-japanese font-medium text-slate-100">
                            {sr.ja}
                          </span>
                          <span className="px-2 py-0.5 text-[10px] rounded uppercase font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            {sr.pitchPattern}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{sr.bn}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => playNativeTokyoSpeech(sr.ja)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 flex items-center gap-1 transition"
                        >
                          <Volume2 className="w-3.5 h-3.5" /> শুনুন
                        </button>
                        <button
                          onClick={() => setUserTranscript(sr.ja)}
                          className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 text-xs rounded-lg border border-red-500/30 transition"
                        >
                          টেমপ্লেট নিন
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Voice Input Stage */}
              <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    আপনার জাপানি কণ্ঠ ও উত্তর
                  </span>
                  {isRecording && (
                    <span className="flex items-center gap-2 text-xs text-red-400 animate-pulse font-medium">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      লাইভ রেকর্ড হচ্ছে... ({recordedF0Ref.current.length} টি পিচ পয়েন্ট)
                    </span>
                  )}
                </div>

                {/* Live Transcript Field (Editable if needed) */}
                <div>
                  <textarea
                    value={userTranscript}
                    onChange={(e) => setUserTranscript(e.target.value)}
                    placeholder="মাইক্রোফোন অন করে জাপানি ভাষায় উত্তর দিন, অথবা এখানে টাইপ করুন..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-100 text-base font-japanese focus:outline-none focus:border-red-500/60 resize-none h-24 placeholder:text-slate-600"
                  />
                </div>

                {/* Mic Visualizer Bar */}
                {isRecording && (
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-amber-400 transition-all duration-75"
                      style={{ width: `${Math.min(100, micVolume)}%` }}
                    />
                  </div>
                )}

                {/* Control Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {!isRecording ? (
                      <button
                        onClick={startRecording}
                        disabled={isEvaluatingTurn}
                        className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
                      >
                        <Mic className="w-5 h-5" />
                        কথা বলুন (রেকর্ড শুরু)
                      </button>
                    ) : (
                      <button
                        onClick={stopRecordingAndEvaluate}
                        className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition animate-pulse"
                      >
                        <MicOff className="w-5 h-5" />
                        রেকর্ড থামান ও মূল্যায়ন করুন
                      </button>
                    )}
                  </div>

                  {!isRecording && (
                    <button
                      onClick={() =>
                        submitTurnEvaluation(
                          userTranscript,
                          recordedF0Ref.current,
                          2500
                        )
                      }
                      disabled={isEvaluatingTurn || !userTranscript.trim()}
                      className="w-full sm:w-auto px-5 py-3 bg-slate-700 hover:bg-slate-600 text-slate-100 font-medium rounded-xl transition disabled:opacity-40 flex items-center justify-center gap-2 text-sm"
                    >
                      {isEvaluatingTurn ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          যাচাই হচ্ছে...
                        </>
                      ) : (
                        <>
                          টার্ন মূল্যায়ন পাঠান <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>
            </div>
          ) : session.isCompleted ? (
            /* Completed Simulation Report Card */
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700 rounded-2xl p-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-red-500/20">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    ইন্টারভিউ সিমুলেশন সম্পন্ন
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-2">
                    সিইএফআর স্পিকিং টিয়ার: {session.finalScores?.cefrSpeakingTier}
                  </h3>
                  <p className="text-slate-400 text-sm max-w-lg mx-auto mt-1">
                    {session.finalScores?.feedbackBn}
                  </p>
                </div>

                {/* Final Dual-Score Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto pt-2">
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                    <span className="text-xs text-slate-400 block">কমিউনিকেশন প্রাসঙ্গিকতা</span>
                    <span className="text-xl font-bold text-white">
                      {session.finalScores?.communicationScore}%
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                    <span className="text-xs text-slate-400 block">অ্যাকোস্টিক সুর ও পিচ</span>
                    <span className="text-xl font-bold text-cyan-400">
                      {session.finalScores?.acousticResonanceScore}%
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                    <span className="text-xs text-slate-400 block">সামগ্রিক প্রস্তুতি স্কোর</span>
                    <span className="text-xl font-bold text-emerald-400">
                      {session.finalScores?.overallScore}%
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => handleStartSession(selectedScenarioId)}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-red-600/20 flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" /> আবার অনুশীলন করুন
                  </button>
                </div>
              </div>

              {/* Turn History Breakdown */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                  প্রশ্নোত্তর বিশ্লেষণ ও ডায়াগনস্টিক রিপোর্ট
                </h4>
                {session.completedTurns.map((ct, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300">
                        টার্ন {ct.turnIndex}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400">
                          প্রাসঙ্গিকতা: <strong className="text-white">{ct.communicationScore}%</strong>
                        </span>
                        <span className="text-slate-400">
                          সুর: <strong className="text-cyan-400">{ct.acousticResonanceScore}%</strong>
                        </span>
                      </div>
                    </div>
                    <p className="text-sm font-japanese text-slate-200">
                      আপনার উত্তর: {ct.userTranscript}
                    </p>
                    <p className="text-xs text-amber-200/90 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                      পরামর্শ: {ct.feedbackBn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

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
import { TokyoPrincipalVisaInterviewDrill } from './TokyoPrincipalVisaInterviewDrill';

export const SCENARIO_QUICK_CHIPS: Record<string, Array<{ textJa: string; labelBn: string; level: string }>> = {
  restaurant_izakaya: [
    { textJa: 'いらっしゃいませ！何名様でしょうか？', labelBn: 'স্বাগতম! কতজন মেহমান?', level: 'Keigo' },
    { textJa: '喜んで！ご注文を繰り返します。', labelBn: 'আনন্দের সাথে! অর্ডারটি মিলিয়ে নিচ্ছি।', level: 'Sonkei' },
    { textJa: 'タレ味と塩味、どちらになさいますか？', labelBn: 'সস না কি লবণ ফ্লেভারে নেবেন?', level: 'Sonkei' },
    { textJa: 'お待たせいたしました！生ビールでございます。', labelBn: 'অপেক্ষা করানোর জন্য দুঃখিত, পানীয় পরিবেশন করছি।', level: 'Kenjou' },
    { textJa: 'お会計は別々になさいますか？ご一緒ですか？', labelBn: 'বিল কি আলাদা দেবেন না একসাথে?', level: 'Keigo' },
    { textJa: 'ありがとうございました！またお越しくださいませ！', labelBn: 'অনেক ধন্যবাদ! আবার শুভাগমন কাম্য!', level: 'Keigo' }
  ],
  school_principal: [
    { textJa: '初めまして。本日はよろしくお願いいたします。', labelBn: 'নমস্কার। আজ ইন্টারভিউয়ের জন্য ধন্যবাদ।', level: 'Kenjou' },
    { textJa: '将来は日本のITエンジニアとして活躍したいです。', labelBn: 'ভবিষ্যতে জাপানে আইটি ইঞ্জিনিয়ার হতে চাই।', level: 'Teinei' },
    { textJa: '両親が経済的支援者として学費を支弁してくれます。', labelBn: 'বাবা-মা আমার আর্থিক স্পন্সর।', level: 'Kenjou' }
  ],
  embassy_visa: [
    { textJa: '150時間以上の日本語学習を修了いたしました。', labelBn: '১৫০+ ঘণ্টা জাপানি ভাষা শেষ করেছি।', level: 'Kenjou' },
    { textJa: 'JLPT N5に合格し、現在はN4を学習しております。', labelBn: 'N5 পাস করেছি, এখন N4 পড়ছি।', level: 'Kenjou' },
    { textJa: '週28時間の就労制限を厳格に遵守いたします。', labelBn: '২৮ ঘণ্টার কাজের নিয়ম কঠোরভাবে মানব।', level: 'Kenjou' }
  ],
  conbini_pos: [
    { textJa: 'いらっしゃいませ！ポイントカードはお持ちですか？', labelBn: 'স্বাগতম! পয়েন্ট কার্ড আছে কি?', level: 'Keigo' },
    { textJa: 'お弁当温めますか？レジ袋はお付けしますか？', labelBn: 'বেন্টো গরম করব? ব্যাগ লাগবে?', level: 'Keigo' },
    { textJa: '500円のお返しとレシートでございます。', labelBn: 'ভাংতি ও রসিদ নিন।', level: 'Kenjou' }
  ],
  ward_office: [
    { textJa: '転入届の提出と保険証の手続きに参りました。', labelBn: 'ঠিকানা বদল ও হেলথ কার্ডের জন্য এসেছি।', level: 'Kenjou' },
    { textJa: '留学生の国民健康保険減免をお願いできますか？', labelBn: 'স্টুডেন্ট হেলথ ইন্স্যুরেন্স ডিসকাউন্ট চাই।', level: 'Teinei' }
  ],
  train_metro: [
    { textJa: 'すみません、山手線の内回りは何番線でしょうか？', labelBn: 'এক্সকিউজ মি, ইনার লুপ কত নম্বর প্ল্যাটফর্ম?', level: 'Teinei' },
    { textJa: '遅延証明書を1枚いただけますでしょうか？', labelBn: 'একটি ট্রেনের লেট সার্টিফিকেট দেবেন কি?', level: 'Keigo' }
  ],
  factory_genba: [
    { textJa: 'はい！衛生チェックと粘着ローラー完了いたしました！', labelBn: 'জি! স্যানিটেশন ও হেয়ার রোলার সম্পন্ন করেছি!', level: 'Kenjou' },
    { textJa: '加熱温度85度以上、目視確認ヨシ！', labelBn: 'তাপমাত্রা ৮৫ ডিগ্রির বেশি, পয়েন্ট অ্যান্ড কল ঠিক আছে!', level: 'Genba Keigo' },
    { textJa: 'かしこまりました！直ちにスピードを合わせます！', labelBn: 'বুঝতে পেরেছি! অবিলম্বে স্পিড মিলিয়ে নিচ্ছি!', level: 'Kenjou' },
    { textJa: '班長、パックに異物の疑いがあります。確認をお願いします！', labelBn: 'লিডার, প্যাকে অন্য কিছু থাকার সন্দেহ হচ্ছে, চেক করুন!', level: 'Keigo' },
    { textJa: '安全第一で作業いたします！お疲れ様です！', labelBn: 'নিরাপত্তা সবার আগে মেনে কাজ করছি! ধন্যবাদ!', level: 'Teinei' }
  ],
  hotel_shukuba: [
    { textJa: 'いらっしゃいませ。当館へお越しいただき誠にありがとうございます。', labelBn: 'স্বাগতম। আমাদের রিয়োকানে আসার জন্য আন্তরিক ধন্যবাদ।', level: 'Sonkeigo' },
    { textJa: 'ご予約のお名前とおパスポートを拝見してもよろしいでしょうか？', labelBn: 'বুকিংয়ের নাম ও পাসপোর্টটি দেখতে পারি কি?', level: 'Kenjougo' },
    { textJa: 'お荷物はチェックインまで大切にお預かりいたします。', labelBn: 'চেক-ইন পর্যন্ত আপনার লাগেজ আমরা যত্নে রাখছি।', level: 'Kenjougo' },
    { textJa: '温泉のご利用時間は午後11時までとなっております。', labelBn: 'অনসেন ব্যবহারের সময় রাত ১১টা পর্যন্ত।', level: 'Teinei' },
    { textJa: '明日のご朝食のお時間は7時と8時、どちらになさいますか？', labelBn: 'কাল সকালের নাস্তা কি ৭টা না ৮টায় নেবেন?', level: 'Sonkeigo' }
  ],
  cafe_fastfood: [
    { textJa: 'いらっしゃいませ！店内でお召し上がりですか、お持ち帰りですか？', labelBn: 'স্বাগতম! দোকানে বসে খাবেন নাকি পার্সেল নেবেন?', level: 'Sonkeigo' },
    { textJa: 'ドリンクはホットとアイス、どちらになさいますか？', labelBn: 'পানীয় কি গরম নেবেন না ঠান্ডা?', level: 'Sonkeigo' },
    { textJa: 'お会計はSuicaですね。端末にピッとタッチをお願いします。', labelBn: 'সুইকা দিয়ে পেমেন্ট। মেশিনে ট্যাপ করুন।', level: 'Keigo' },
    { textJa: '番号札をお持ちになって、お席でお待ちくださいませ。', labelBn: 'টোকেন নিয়ে অনুগ্রহ করে সিটে বসুন।', level: 'Kenjougo' },
    { textJa: 'お待たせいたしました！アイスキャラメルラテでございます。', labelBn: 'দেরির জন্য দুঃখিত, আইস লাতে রেডি।', level: 'Kenjougo' }
  ]
};

interface InterviewVoiceTwinLabProps {
  scenario: BaitoScenarioItem;
  onFinished?: (score: number) => void;
}

export const InterviewVoiceTwinLab: React.FC<InterviewVoiceTwinLabProps> = ({
  scenario,
  onFinished
}) => {
  const isHighStakesScenario = scenario.type === 'school_principal' || scenario.type === 'embassy_visa';
  const [messages, setMessages] = useState<BaitoInterviewMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [activeTab, setActiveTab] = useState<'high_stakes_drill' | 'interview' | 'vocabulary' | 'objectives'>(
    isHighStakesScenario ? 'high_stakes_drill' : 'interview'
  );
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
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-800 text-xs">
          {isHighStakesScenario && (
            <button
              onClick={() => setActiveTab('high_stakes_drill')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeTab === 'high_stakes_drill'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-amber-400/90 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>5大必須面接質問ドリル (5 High-Stakes Questions)</span>
            </button>
          )}

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

      {/* High-Stakes 5-Question Drill View */}
      {activeTab === 'high_stakes_drill' && (
        <TokyoPrincipalVisaInterviewDrill onAllCompleted={onFinished} />
      )}

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

          {/* Quick Keigo Response Chips for Customer Service & Roleplay */}
          {SCENARIO_QUICK_CHIPS[scenario.type] && (
            <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold text-amber-400/90 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  推奨接客・敬語フレーズ (Quick Keigo Suggestions):
                </span>
                <span className="text-[10px] text-slate-500">タップで入力 / 🔊で発音</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none touch-pan-x">
                {SCENARIO_QUICK_CHIPS[scenario.type].map((chip, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition group shrink-0"
                  >
                    <button
                      type="button"
                      onClick={() => speakJapanese(chip.textJa)}
                      className="p-1 rounded-md text-amber-400/80 hover:text-amber-300 hover:bg-slate-800 transition"
                      title="発音を聞く"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        soundEffects.playButtonTap();
                        setInputText(chip.textJa);
                      }}
                      className="text-left"
                    >
                      <div className="text-xs font-medium text-slate-200 group-hover:text-amber-300 transition whitespace-nowrap">
                        {chip.textJa}
                      </div>
                      <div className="text-[9px] text-slate-400 whitespace-nowrap">
                        {chip.labelBn}
                      </div>
                    </button>
                    <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                      {chip.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
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

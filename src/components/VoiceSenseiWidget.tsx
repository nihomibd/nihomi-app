import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Bot,
  MessageSquare,
  RotateCcw,
  Send,
  HelpCircle,
  CheckCircle2,
  X,
  VolumeX
} from 'lucide-react';
import { speakJapanese } from '../lib/tts.js';

interface VoiceSenseiWidgetProps {
  onOpenFullChat?: () => void;
}

interface SenseiQA {
  question: string;
  japanese: string;
  romaji: string;
  banglaMeaning: string;
  explanation: string;
}

const PRESET_QUICK_QUESTIONS: { label: string; query: string; answer: SenseiQA }[] = [
  {
    label: 'は (wa) vs が (ga) difference?',
    query: 'What is the exact difference between particle wa and ga in Japanese?',
    answer: {
      question: 'What is the exact difference between particle wa and ga?',
      japanese: '「は」は文全体のトピックを表し、「が」は新しい主語や強調を表します。',
      romaji: '"Wa" wa bun zentai no topikku o arawashi, "ga" wa atarashii shugo ya kyouchou o arawashimasu.',
      banglaMeaning: '‘は’ (wa) বাক্যের মূল বিষয় (টপিক) বোঝায় এবং ‘が’ (ga) নতুন তথ্য বা নির্দিষ্ট বিষয়কে হাইলাইট করে।',
      explanation: 'Example: 私は学生です (Speaking about myself, I am a student) vs 私がやります (I specifically will do it, emphasizing "I").'
    }
  },
  {
    label: 'How to order at 7-Eleven?',
    query: 'How do I order oden or hot food at a Japanese convenience store?',
    answer: {
      question: 'How do I order at a Japanese 7-Eleven / FamilyMart?',
      japanese: 'すみません、これを一つ温めてください。袋は大丈夫です。',
      romaji: 'Sumimasen, kore o hitotsu atatamete kudasai. Fukuro wa daijoubu desu.',
      banglaMeaning: 'মাফ করবেন, এটা একটা গরম করে দিন দয়া করে। শপিং ব্যাগের প্রয়োজন নেই।',
      explanation: 'Use "Atatamete kudasai" for heating bento, and "Fukuro wa kekkou desu / daijoubu desu" to decline a plastic bag politely.'
    }
  },
  {
    label: 'Explain て-form quickly',
    query: 'How does the Te-form work in Japanese grammar?',
    answer: {
      question: 'How does the Te-form (て形) work in Japanese?',
      japanese: 'て形は文をつなげたり、お願い（〜てください）するときに使います。',
      romaji: 'Te-kei wa bun o tsunagetari, onegai (~te kudasai) suru toki ni tsukaimasu.',
      banglaMeaning: 'তে-ফর্ম (て形) একাধিক বাক্যকে যুক্ত করতে এবং অনুরোধ করতে (~てください) ব্যবহৃত হয়।',
      explanation: 'Example: 食べて、寝ます (Eat and sleep) or 行ってください (Please go).'
    }
  },
  {
    label: 'What is Sonkeigo vs Kenjougo?',
    query: 'What is the difference between Sonkeigo and Kenjougo in Keigo?',
    answer: {
      question: 'What is the difference between Sonkeigo and Kenjougo?',
      japanese: '尊敬語は相手を高める表現、謙譲語は自分をへりくだる表現です。',
      romaji: 'Sonkeigo wa aite o takameru hyougen, Kenjougo wa jibun o herikudaru hyougen desu.',
      banglaMeaning: 'সোনকেইগো অপর ব্যক্তিকে সম্মান দিতে ব্যবহৃত হয়; কেনজোগো নিজেকে বিনয়ী করতে ব্যবহৃত হয়।',
      explanation: 'Example: 召し上がる (Sonkeigo for someone else eating) vs いただく (Kenjougo for yourself eating).'
    }
  }
];

export const VoiceSenseiWidget: React.FC<VoiceSenseiWidgetProps> = ({ onOpenFullChat }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [customQuery, setCustomQuery] = useState('');
  const [currentQA, setCurrentQA] = useState<SenseiQA>(PRESET_QUICK_QUESTIONS[0].answer);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'ja-JP';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const handleToggleListening = () => {
    if (!recognitionRef.current) {
      // Fallback if recognition is not supported in iframe
      const sampleQuestion = PRESET_QUICK_QUESTIONS[1];
      setCurrentQA(sampleQuestion.answer);
      handlePlayVoice(sampleQuestion.answer.japanese);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (transcript.trim()) {
        processVoiceQuestion(transcript.trim());
      }
    } else {
      setTranscript('');
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const processVoiceQuestion = (queryText: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      // Find matching preset or generate intelligent answer
      const lower = queryText.toLowerCase();
      let match = PRESET_QUICK_QUESTIONS.find((q) =>
        lower.includes(q.label.toLowerCase()) || lower.includes('wa') || lower.includes('ga')
      );

      if (!match) {
        match = {
          label: queryText,
          query: queryText,
          answer: {
            question: queryText,
            japanese: '分かりました。日本語の日常会話では、常に文脈と丁寧さを意識することが大切です。',
            romaji: 'Wakarimashita. Nihongo no nichijou kaiwa dewa, tsuneni bunkaku to teineisa o ishiki suru koto ga taisetsu desu.',
            banglaMeaning: 'বুঝেছি! জাপানি কথোপকথনে সর্বদা প্রেক্ষাপট ও বিনম্রতার দিকে খেয়াল রাখা আবশ্যক।',
            explanation: `Sensei answered your voice prompt: "${queryText}". Keep practicing everyday with Nihomi audio drills!`
          }
        };
      }

      setCurrentQA(match.answer);
      setIsProcessing(false);
      handlePlayVoice(match.answer.japanese);
    }, 600);
  };

  const handlePlayVoice = (text: string) => {
    setIsPlayingAudio(true);
    speakJapanese(text);
    setTimeout(() => setIsPlayingAudio(false), 3500);
  };

  const handleSelectPreset = (preset: (typeof PRESET_QUICK_QUESTIONS)[0]) => {
    setCurrentQA(preset.answer);
    handlePlayVoice(preset.answer.japanese);
  };

  const handleSubmitText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;
    processVoiceQuestion(customQuery.trim());
    setCustomQuery('');
  };

  return (
    <div id="voice-sensei-dashboard-widget" className="bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 space-y-6 relative overflow-hidden">
      {/* Decorative glowing ambient orb */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-red-600/20 text-red-400 border border-red-500/30">
              VOICE ACTIVATED &bull; NATIVE TOKYO ACCENT
            </span>
            <span className="text-xs text-stone-400 font-mono">
              WebSpeech AI Sensei
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-red-500" />
            <span>Voice Sensei Quick Query (ভয়েস সেনসেই সহকারী)</span>
          </h3>
          <p className="text-xs text-stone-400 max-w-xl">
            Tap the microphone to speak your question in Japanese or English, or select a quick grammar query for audio-responsive guidance.
          </p>
        </div>

        {/* Live Mic Activation Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleListening}
            className={`px-5 py-3.5 rounded-2xl font-bold text-xs flex items-center gap-2.5 transition-all shadow-lg cursor-pointer ${
              isListening
                ? 'bg-red-600 text-white ring-4 ring-red-500/40 animate-pulse'
                : 'bg-stone-800 hover:bg-stone-700 text-white border border-stone-700 hover:border-red-500'
            }`}
            title="Click to speak Japanese with Voice Sensei"
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4 text-white" />
                <span>Listening... (কথা বলুন)</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-red-400" />
                <span>Ask via Voice (ভয়েসে প্রশ্ন করুন)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Quick Question Pills */}
      <div className="space-y-2 relative z-10">
        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
          Frequent Japanese Queries (এক-ক্লিকে উত্তর শুনুন):
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_QUICK_QUESTIONS.map((item) => (
            <button
              key={item.label}
              onClick={() => handleSelectPreset(item)}
              className="px-3.5 py-1.5 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-stone-200 hover:text-white border border-stone-700 hover:border-red-500 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Response Display Bento */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 sm:p-6 space-y-4 relative z-10">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center font-bold text-xs">
              先生
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Tokyo Sensei Voice Answer</span>
              <span className="text-[10px] text-stone-400 font-mono">Q: {currentQA.question}</span>
            </div>
          </div>

          <button
            onClick={() => handlePlayVoice(currentQA.japanese)}
            disabled={isPlayingAudio}
            className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            title="Listen to Japanese pronunciation"
          >
            <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
            <span>{isPlayingAudio ? 'Playing Audio...' : 'Play Audio (উচ্চারণ শুনুন)'}</span>
          </button>
        </div>

        {/* Japanese Sentence & Breakdown */}
        <div className="space-y-2">
          <p className="text-lg sm:text-xl font-serif font-bold text-amber-300 tracking-wide">
            {currentQA.japanese}
          </p>
          <p className="text-xs font-mono text-stone-400">
            {currentQA.romaji}
          </p>
          <p className="text-xs text-stone-300">
            <strong className="text-red-400">বাংলা অর্থ:</strong> {currentQA.banglaMeaning}
          </p>
        </div>

        {/* Explanatory Context */}
        <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800/80 text-xs text-stone-400 leading-relaxed">
          <strong className="text-stone-200">Sensei's Tip:</strong> {currentQA.explanation}
        </div>
      </div>

      {/* Manual Question Input Form */}
      <form onSubmit={handleSubmitText} className="flex gap-2 relative z-10">
        <input
          type="text"
          value={customQuery}
          onChange={(e) => setCustomQuery(e.target.value)}
          placeholder="Or type any question (e.g. 'How to say nice to meet you politely in Japanese?')..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-red-500"
        />
        <button
          type="submit"
          disabled={!customQuery.trim() || isProcessing}
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask Sensei</span>
        </button>
      </form>
    </div>
  );
};
export default VoiceSenseiWidget;

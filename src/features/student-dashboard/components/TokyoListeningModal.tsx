import React, { useEffect, useState } from 'react';
import { CheckCircle2, Headphones, X } from 'lucide-react';
import { TokyoListeningAudioPlayer } from '../../../components/mockExam/TokyoListeningAudioPlayer';

interface TokyoListeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => Promise<void>;
}

const AUDIO_SCRIPT = {
  narratorText: 'コンビニでの会話を聞いてください。',
  audioPrompt: '質問に答えてください。',
  questionAudioPromptJa: '質問に答えてください。',
  dialogue: [
    { speaker: '店員（女性）', textJa: 'いらっしゃいませ。温めますか。', romaji: 'Irasshaimase. Atatamemasu ka?', bangla: 'স্বাগতম। খাবারটি গরম করে দেব?' },
    { speaker: 'お客さん（男性）', textJa: 'はい、おにぎりを一つお願いします。それから、袋もください。', romaji: 'Hai, onigiri o hitotsu onegai shimasu. Sorekara, fukuro mo kudasai.', bangla: 'হ্যাঁ, একটি অনিগিরি দিন। আর একটি ব্যাগও দিন।' },
    { speaker: '店員（女性）', textJa: 'かしこまりました。ポイントカードはお持ちですか。', romaji: 'Kashikomarimashita. Pointo kaado wa omochi desu ka?', bangla: 'বুঝেছি। আপনার কি পয়েন্ট কার্ড আছে?' },
    { speaker: 'お客さん（男性）', textJa: 'はい、お願いします。全部でいくらですか。', romaji: 'Hai, onegai shimasu. Zenbu de ikura desu ka?', bangla: 'হ্যাঁ, অনুগ্রহ করে ব্যবহার করুন। সব মিলিয়ে কত?' },
    { speaker: '店員（女性）', textJa: '全部で五百八十円です。ありがとうございました。', romaji: 'Zenbu de gohyaku hachijuu en desu. Arigatou gozaimashita.', bangla: 'সব মিলিয়ে ৫৮০ ইয়েন। ধন্যবাদ।' },
  ],
};

const QUESTIONS = [
  { prompt: '客は何を買いましたか。', bangla: 'ক্রেতা কী কিনেছেন?', options: ['おにぎり', 'パン', '新聞'], answer: 0 },
  { prompt: '全部でいくらですか。', bangla: 'মোট দাম কত?', options: ['380円', '580円', '800円'], answer: 1 },
];

export const TokyoListeningModal: React.FC<TokyoListeningModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [questionIndex, setQuestionIndex] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setQuestionIndex(null);
    setSelectedAnswer(null);
    setCompleted(false);
    setIsSaving(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const question = questionIndex === null ? null : QUESTIONS[questionIndex];
  const handleAnswer = (answer: number) => setSelectedAnswer(answer);
  const handleNext = () => {
    if (questionIndex === null || selectedAnswer === null) return;
    if (questionIndex === QUESTIONS.length - 1) setCompleted(true);
    else {
      setQuestionIndex(questionIndex + 1);
      setSelectedAnswer(null);
    }
  };
  const finish = async () => {
    setIsSaving(true);
    await onComplete();
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/70 p-0 sm:items-center sm:p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-[#fffdf8] shadow-2xl sm:rounded-3xl" role="dialog" aria-modal="true" aria-labelledby="listening-modal-title">
        <header className="flex items-center justify-between border-b border-stone-200 bg-stone-900 px-5 py-4 text-white">
          <div className="flex items-center gap-3"><Headphones className="text-rose-300" size={22} aria-hidden="true" /><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-rose-300">聴解 • Listening</p><h2 id="listening-modal-title" className="text-base font-bold">Convenience Store Dialogue</h2></div></div>
          <button type="button" aria-label="Listening modal বন্ধ করুন" onClick={onClose} className="rounded-full p-2 text-stone-300 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-400"><X size={20} aria-hidden="true" /></button>
        </header>
        <div className="px-4 py-4 sm:px-6">
          <p className="mb-3 text-sm font-medium leading-relaxed text-stone-700">প্রায় ২ মিনিটের native Japanese convenience-store dialogue শুনুন। Script খুলে প্রতিটি লাইনের Kana, Romaji ও বাংলা অর্থ দেখুন।</p>
          <TokyoListeningAudioPlayer audioScript={AUDIO_SCRIPT} onFinishedAudio={() => setQuestionIndex(0)} />
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
            <div className="border-b border-stone-200 px-4 py-3"><h3 className="text-sm font-bold text-stone-900">Dialogue script</h3><p className="text-xs text-stone-500">Audio চলার সঙ্গে active line হাইলাইট হবে</p></div>
            <div className="divide-y divide-stone-100">
              {AUDIO_SCRIPT.dialogue.map((line) => <div key={line.textJa} className="p-3"><p className="text-base font-bold text-stone-950" lang="ja">{line.textJa}</p><p className="text-xs italic text-stone-500">{line.romaji}</p><p className="mt-1 text-xs text-stone-700">{line.bangla}</p></div>)}
            </div>
          </div>
          {question === null && !completed && <button type="button" onClick={() => setQuestionIndex(0)} className="mt-4 w-full rounded-xl bg-rose-600 px-4 py-3 text-sm font-bold text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500">Comprehension checks শুরু করুন</button>}
          {question && !completed && <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4"><div className="flex justify-between text-xs font-bold text-amber-800"><span>Comprehension check</span><span>{questionIndex! + 1} / {QUESTIONS.length}</span></div><p className="mt-3 text-lg font-bold text-stone-950" lang="ja">{question.prompt}</p><p className="mt-1 text-xs text-stone-700">{question.bangla}</p><div className="mt-3 grid grid-cols-3 gap-2">{question.options.map((option, index) => <button key={option} type="button" onClick={() => handleAnswer(index)} className={`rounded-xl border px-2 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 ${selectedAnswer === index ? 'border-amber-600 bg-amber-200' : 'border-amber-200 bg-white hover:bg-amber-100'}`}>{option}</button>)}</div>{selectedAnswer !== null && <p className={`mt-3 flex items-center gap-2 text-xs font-bold ${selectedAnswer === question.answer ? 'text-emerald-700' : 'text-rose-700'}`} role="status" aria-live="polite">{selectedAnswer === question.answer ? <CheckCircle2 size={16} aria-hidden="true" /> : '●'}{selectedAnswer === question.answer ? 'সঠিক!' : `সঠিক উত্তর: ${question.options[question.answer]}`}</p>}<button type="button" disabled={selectedAnswer === null} onClick={handleNext} className="mt-3 w-full rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-stone-950 disabled:bg-stone-200 disabled:text-stone-400">{questionIndex === QUESTIONS.length - 1 ? 'ফলাফল দেখুন' : 'পরের প্রশ্ন'}</button></div>}
          {completed && <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center"><CheckCircle2 className="mx-auto text-emerald-600" size={30} aria-hidden="true" /><h3 className="mt-2 text-lg font-bold text-stone-950">Listening task ready to complete</h3><p className="mt-1 text-xs text-stone-700">আপনার comprehension checks শেষ হয়েছে।</p><button type="button" disabled={isSaving} onClick={finish} className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-60">{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'Complete Listening (+30 XP, +5 Coins)'}</button></div>}
        </div>
      </section>
    </div>
  );
};

export default TokyoListeningModal;

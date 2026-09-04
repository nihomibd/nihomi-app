import React, { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, ChevronRight, Volume2, X } from 'lucide-react';
import { speakJapanese } from '../../../lib/tts';

interface Lesson12PlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => Promise<void>;
}

const EXAMPLES = [
  { japanese: 'わたしは学生です。', romaji: 'Watashi wa gakusei desu.', bangla: 'আমি একজন ছাত্র। এখানে は সাধারণ topic “আমি” নির্দেশ করে।' },
  { japanese: '田中さんが来ました。', romaji: 'Tanaka-san ga kimashita.', bangla: 'তানাকা এসেছেন। এখানে が নতুন বা নির্দিষ্ট subject-কে জোর দেয়।' },
  { japanese: 'これは私の本です。', romaji: 'Kore wa watashi no hon desu.', bangla: 'এটি আমার বই। これは বাক্যের topic, আর 私の বইটির মালিকানা বোঝায়।' },
];

const CHECKPOINTS = [
  { prompt: 'わたし ___ 日本人です。', bangla: 'নিজের সাধারণ পরিচয় দিতে কোন particle?', options: ['は', 'が', 'に'], answer: 'は' },
  { prompt: 'だれ ___ 来ましたか。', bangla: 'কে এসেছে? নির্দিষ্ট subject-এর particle কোনটি?', options: ['は', 'が', 'で'], answer: 'が' },
];

export const Lesson12PlayerModal: React.FC<Lesson12PlayerModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [checkpointIndex, setCheckpointIndex] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setCheckpointIndex(null);
    setSelectedAnswer(null);
    setIsCompleting(false);
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

  const checkpoint = checkpointIndex === null ? null : CHECKPOINTS[checkpointIndex];
  const handleCheckpointAnswer = (answer: string) => setSelectedAnswer(answer);
  const handleComplete = async () => {
    setIsCompleting(true);
    await onComplete();
    setIsCompleting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/70 p-0 sm:items-center sm:p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-[#fffdf8] shadow-2xl sm:rounded-3xl" role="dialog" aria-modal="true" aria-labelledby="lesson-12-title">
        <header className="flex items-center justify-between border-b border-stone-200 bg-stone-900 px-5 py-4 text-white sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-600"><BookOpen size={21} aria-hidden="true" /></div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-rose-300">JLPT N5 • Lesson 12</p>
              <h2 id="lesson-12-title" className="text-base font-bold">Particles は / が</h2>
            </div>
          </div>
          <button type="button" aria-label="লেসন বন্ধ করুন" onClick={onClose} className="rounded-full p-2 text-stone-300 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-400"><X size={20} aria-hidden="true" /></button>
        </header>

        <div className="overflow-y-auto px-5 py-5 sm:px-7">
          <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-rose-700">Essential Particles</p>
            <h3 className="mt-1 text-xl font-bold text-stone-950">は (Topic) বনাম が (Subject)</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-700">は কথোপকথনের বিষয় বা known topic স্থাপন করে। が নতুন তথ্য, নির্দিষ্ট subject, বা “কে/কী” প্রশ্নের উত্তরকে জোর দেয়।</p>
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex gap-3 rounded-xl border border-stone-200 bg-white p-3"><span className="rounded-lg bg-stone-900 px-2 py-1 text-sm font-bold text-white">は</span><p className="text-xs leading-relaxed text-stone-700"><strong>Topic:</strong> আমরা যে বিষয় নিয়ে কথা বলছি। উদাহরণ: わたしは学生です。</p></div>
            <div className="flex gap-3 rounded-xl border border-stone-200 bg-white p-3"><span className="rounded-lg bg-rose-600 px-2 py-1 text-sm font-bold text-white">が</span><p className="text-xs leading-relaxed text-stone-700"><strong>Subject:</strong> নতুন, নির্দিষ্ট, বা focus করা কর্তা। উদাহরণ: 田中さんが来ました。</p></div>
          </div>

          <h3 className="mt-6 text-sm font-bold text-stone-900">Bilingual examples <span className="font-medium text-stone-500">| উদাহরণ</span></h3>
          <div className="mt-3 space-y-3">
            {EXAMPLES.map((example) => (
              <article key={example.japanese} className="rounded-xl border border-stone-200 bg-white p-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-lg font-bold text-stone-950" lang="ja">{example.japanese}</p>
                  <button type="button" aria-label={`${example.japanese} শুনুন`} onClick={() => speakJapanese(example.japanese)} className="shrink-0 rounded-full p-2 text-rose-600 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-500"><Volume2 size={18} aria-hidden="true" /></button>
                </div>
                <p className="text-xs italic text-stone-500">{example.romaji}</p>
                <p className="mt-1 text-xs leading-relaxed text-stone-700">{example.bangla}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center justify-between gap-3"><h3 className="text-sm font-bold text-amber-900">Mini checkpoint checks</h3><span className="text-[11px] font-bold text-amber-700">2 questions</span></div>
            {checkpoint === null ? (
              <button type="button" onClick={() => setCheckpointIndex(0)} className="mt-3 w-full rounded-xl bg-amber-500 px-4 py-3 text-sm font-bold text-stone-950 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500">চেকপয়েন্ট শুরু করুন</button>
            ) : (
              <div className="mt-3">
                <p className="text-lg font-bold text-stone-950" lang="ja">{checkpoint.prompt}</p>
                <p className="mt-1 text-xs font-medium text-stone-600">{checkpoint.bangla}</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {checkpoint.options.map((option) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrect = option === checkpoint.answer;
                    const style = selectedAnswer === null ? 'border-amber-300 bg-white hover:bg-amber-100' : isCorrect ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : isSelected ? 'border-rose-500 bg-rose-50 text-rose-800' : 'border-stone-200 bg-stone-50 text-stone-400';
                    return <button key={option} type="button" disabled={selectedAnswer !== null} onClick={() => handleCheckpointAnswer(option)} className={`rounded-xl border px-3 py-3 text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 ${style}`} lang="ja">{option}</button>;
                  })}
                </div>
                {selectedAnswer !== null && <div className="mt-3 flex items-center gap-2 text-xs font-bold text-stone-700" role="status" aria-live="polite">{selectedAnswer === checkpoint.answer ? <CheckCircle2 className="text-emerald-600" size={17} aria-hidden="true" /> : <span className="text-rose-600">●</span>}{selectedAnswer === checkpoint.answer ? 'সঠিক! নিয়মটি বুঝেছেন।' : `সঠিক উত্তর: ${checkpoint.answer}`}</div>}
                {selectedAnswer !== null && (checkpointIndex ?? 0) < CHECKPOINTS.length - 1 && <button type="button" onClick={() => { setCheckpointIndex((current) => (current ?? 0) + 1); setSelectedAnswer(null); }} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500">পরের check <ChevronRight size={15} aria-hidden="true" /></button>}
              </div>
            )}
          </div>

          <button type="button" onClick={handleComplete} disabled={isCompleting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3.5 text-sm font-bold text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:cursor-wait disabled:opacity-60">{isCompleting ? 'সংরক্ষণ হচ্ছে...' : 'Mark Lesson as Complete (+50 XP, +10 Coins)'}</button>
        </div>
      </section>
    </div>
  );
};

export default Lesson12PlayerModal;

import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Globe,
  Award
} from 'lucide-react';
import { speakJapanese } from '../lib/tts.js';

export const NhkMethodologyCard: React.FC = () => {
  const [activeSkit, setActiveSkit] = useState(0);

  const skits = [
    {
      situation: 'Lesson 1: Classroom & Office Greeting (教室・職場の挨拶)',
      japanese: 'おはようございます。今日もよろしくお願いします。',
      furigana: 'おはようございます。きょうもよろしくおねがいします。',
      banglaPronunciation: 'ওহাইও গোজাইমাসু। কিয়ো মো ইয়োরোশিকু ওনেগাই শিমাসু।',
      banglaMeaning: 'শুভ সকাল। আজকেও আপনার সার্বিক সহযোগিতা ও নির্দেশনা কামনা করছি।',
      englishMeaning: 'Good morning. I look forward to working/learning with you today as well.',
      particles: [
        { particle: 'も (mo)', color: 'bg-amber-100 text-amber-800 border-amber-300', explanation: 'Also / As well (আজকেও)' },
        { particle: 'お〜します (o...shimasu)', color: 'bg-purple-100 text-purple-800 border-purple-300', explanation: 'Humble Kenjougo prefix & suffix for deep respect' }
      ],
      culturalTip: 'In Japanese classroom & office etiquette (Ojigi 礼), bowing at a 15–30 degree angle while saying this greeting builds immediate trust.'
    },
    {
      situation: 'Lesson 2: Asking for Directions at Tokyo Station (駅での道案内)',
      japanese: 'すみません、東京駅の改札口はどこですか？',
      furigana: 'すみません、とうきょうえきのかいさつぐちはどこですか？',
      banglaPronunciation: 'সুমিমাসেন, তোকিও একি নো কাইসাতসুগুচি ওয়া দোকো দেসু কা?',
      banglaMeaning: 'মাফ করবেন, টোকিও স্টেশনের টিকেট গেটটি কোন দিকে?',
      englishMeaning: 'Excuse me, where is the ticket gate for Tokyo Station?',
      particles: [
        { particle: 'の (no)', color: 'bg-blue-100 text-blue-800 border-blue-300', explanation: 'Possessive connector (টোকিও স্টেশনের)' },
        { particle: 'は (wa)', color: 'bg-rose-100 text-rose-800 border-rose-300', explanation: 'Topic marker (গেটটির কথা বলতে গেলে...)' },
        { particle: 'か (ka)', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', explanation: 'Polite question marker at the end' }
      ],
      culturalTip: 'Always preface your request with "すみません (Sumimasen)" before approaching station staff in Japan.'
    }
  ];

  const current = skits[activeSkit];

  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NHK World Easy Japanese Methodology &bull; কালার-কোডেড ব্যাকরণ</span>
          </div>
          <h3 className="text-xl font-bold font-serif text-stone-900 mt-1">
            {current.situation}
          </h3>
        </div>

        {/* Switcher */}
        <div className="flex gap-2">
          {skits.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveSkit(idx)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeSkit === idx
                  ? 'bg-rose-600 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Skit {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Japanese Dialogue Box */}
      <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <ruby className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 leading-relaxed">
              {current.japanese}
            </ruby>
            <p className="text-xs text-rose-600 font-serif">{current.furigana}</p>
          </div>
          <button
            type="button"
            onClick={() => speakJapanese(current.japanese)}
            className="p-3 rounded-2xl bg-white border border-stone-200 hover:border-rose-300 text-stone-700 hover:text-rose-600 shadow-sm transition-colors shrink-0 cursor-pointer"
            title="Listen to native audio pronunciation"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Pronunciation & Meaning Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-white border border-stone-200 space-y-0.5">
            <span className="text-[10px] font-bold text-stone-400 uppercase">বাংলা উচ্চারণ:</span>
            <p className="font-bold text-stone-900 font-sans">{current.banglaPronunciation}</p>
          </div>
          <div className="p-3 rounded-xl bg-white border border-stone-200 space-y-0.5">
            <span className="text-[10px] font-bold text-emerald-600 uppercase">বাংলা অর্থ:</span>
            <p className="font-semibold text-stone-900 font-sans">{current.banglaMeaning}</p>
          </div>
        </div>

        {/* NHK Color-Coded Particle Breakdown */}
        <div className="space-y-2 pt-2 border-t border-stone-200/80">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
            NHK কালার-কোডেড পার্টিকেল ও ব্যাকরণ ব্যাখ্যা:
          </span>
          <div className="flex flex-wrap gap-2">
            {current.particles.map((p, idx) => (
              <div
                key={idx}
                className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${p.color}`}
              >
                <strong className="font-serif text-sm">{p.particle}</strong>
                <span>&bull; {p.explanation}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cultural Etiquette Tip */}
        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
          <strong>🇯🇵 জাপানিজ কালচারাল এটিকেট:</strong> {current.culturalTip}
        </div>
      </div>
    </div>
  );
};

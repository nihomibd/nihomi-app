import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  Volume2,
  Sparkles,
  Award,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Play,
  RotateCcw,
  Zap
} from 'lucide-react';
import { speakJapanese } from '../../lib/tts';
import { soundEffects } from '../../lib/soundEffects';

interface PitchPair {
  id: string;
  wordJa: string;
  wordKana: string;
  meaningBn: string;
  meaningEn: string;
  pitchType: '頭高 (Atamadaka ①)' | '平板 (Heiban ⓪)' | '中高 (Nakadaka ②)' | '尾高 (Odaka ③)';
  pitchPattern: ('H' | 'L')[];
  contrastingPair?: {
    wordJa: string;
    wordKana: string;
    meaningBn: string;
    meaningEn: string;
    pitchType: string;
    pitchPattern: ('H' | 'L')[];
  };
}

const PITCH_BANK: PitchPair[] = [
  {
    id: 'pitch-1',
    wordJa: '雨',
    wordKana: 'あめ (A-me)',
    meaningBn: 'বৃষ্টি (Rain)',
    meaningEn: 'Rain',
    pitchType: '頭高 (Atamadaka ①)',
    pitchPattern: ['H', 'L'],
    contrastingPair: {
      wordJa: '飴',
      wordKana: 'あめ (A-me)',
      meaningBn: 'মিছরি / ক্যান্ডি (Candy)',
      meaningEn: 'Candy',
      pitchType: '平板 (Heiban ⓪)',
      pitchPattern: ['L', 'H']
    }
  },
  {
    id: 'pitch-2',
    wordJa: '箸',
    wordKana: 'はし (Ha-shi)',
    meaningBn: 'চপস্টিক (Chopsticks)',
    meaningEn: 'Chopsticks',
    pitchType: '頭高 (Atamadaka ①)',
    pitchPattern: ['H', 'L'],
    contrastingPair: {
      wordJa: '橋',
      wordKana: 'はし (Ha-shi)',
      meaningBn: 'সেতু / ব্রিজ (Bridge)',
      meaningEn: 'Bridge',
      pitchType: '尾高 (Odaka ③)',
      pitchPattern: ['L', 'H']
    }
  },
  {
    id: 'pitch-3',
    wordJa: '柿',
    wordKana: 'かき (Ka-ki)',
    meaningBn: 'পার্সিমন ফল (Persimmon)',
    meaningEn: 'Persimmon fruit',
    pitchType: '尾高 (Odaka ③)',
    pitchPattern: ['L', 'H'],
    contrastingPair: {
      wordJa: '牡蠣',
      wordKana: 'かき (Ka-ki)',
      meaningBn: 'ঝিনুক / ওয়েস্টার (Oyster)',
      meaningEn: 'Oyster',
      pitchType: '頭高 (Atamadaka ①)',
      pitchPattern: ['H', 'L']
    }
  },
  {
    id: 'pitch-4',
    wordJa: '日本',
    wordKana: 'にほん (Ni-ho-n)',
    meaningBn: 'জাপান (Japan)',
    meaningEn: 'Japan',
    pitchType: '中高 (Nakadaka ②)',
    pitchPattern: ['L', 'H', 'L']
  }
];

export const VoiceTwinPitchLab: React.FC = () => {
  const [selectedPair, setSelectedPair] = useState<PitchPair>(PITCH_BANK[0]);
  const [activeSide, setActiveSide] = useState<'primary' | 'contrast'>('primary');

  const handlePlayPitchTones = (pattern: ('H' | 'L')[]) => {
    soundEffects.playPitchTones(pattern);
  };

  const handlePlaySpeech = (word: string) => {
    speakJapanese(word, { rate: 0.85 });
  };

  return (
    <div id="voice-twin-pitch-lab" className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30">
              東京標準語アクセント (Tokyo Standard Pitch Engine)
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-100 mt-1 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            声の双子™ 高低アクセント波形ラボ (Voice Twin Pitch Accent Lab)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            日本語の高低アクセント（Pitch Accent）を聴覚シンセサイザーと周波数波形で完全マスター
          </p>
        </div>
      </div>

      {/* Selectable Words Carousel */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PITCH_BANK.map((pair) => {
          const isSelected = selectedPair.id === pair.id;
          return (
            <button
              key={pair.id}
              onClick={() => {
                soundEffects.playButtonTap();
                setSelectedPair(pair);
                setActiveSide('primary');
              }}
              className={`p-4 rounded-2xl border text-left transition ${
                isSelected
                  ? 'bg-gradient-to-br from-cyan-500/20 to-slate-900 border-cyan-500/50 shadow-lg'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="text-xl font-black text-slate-100">{pair.wordJa}</div>
              <div className="text-xs text-cyan-400 font-mono mt-0.5">{pair.wordKana}</div>
              <div className="text-[11px] text-slate-400 mt-1">{pair.meaningBn}</div>
            </button>
          );
        })}
      </div>

      {/* Pitch Accent Interactive Visualizer Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Primary Word Pitch */}
          <div
            className={`p-5 rounded-2xl border transition ${
              activeSide === 'primary'
                ? 'bg-slate-950 border-cyan-500/50 ring-1 ring-cyan-500/30'
                : 'bg-slate-950/60 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold">
                {selectedPair.pitchType}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setActiveSide('primary');
                    handlePlayPitchTones(selectedPair.pitchPattern);
                  }}
                  className="p-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 transition"
                  title="音階トーンを聞く (Listen to Pitch Tone)"
                >
                  <Activity className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setActiveSide('primary');
                    handlePlaySpeech(selectedPair.wordJa);
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                  title="ネイティブ音声を聞く (Native Audio)"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-3xl font-black text-slate-100">{selectedPair.wordJa}</h3>
              <div className="text-sm text-cyan-400 font-mono">{selectedPair.wordKana}</div>
              <div className="text-xs text-slate-400 mt-1">{selectedPair.meaningBn} ({selectedPair.meaningEn})</div>
            </div>

            {/* Visual Pitch Graph Nodes */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              <div className="text-xs font-bold text-slate-400 mb-3">アクセント波形 (Pitch Contour Curve)</div>
              <div className="flex items-center justify-center gap-6 h-24 bg-slate-900 rounded-xl p-4">
                {selectedPair.pitchPattern.map((tone, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400">{idx === 0 ? '1拍目' : '2拍目'}</span>
                    <motion.div
                      animate={{ y: tone === 'H' ? -12 : 12 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-lg ${
                        tone === 'H'
                          ? 'bg-cyan-500 text-slate-950 shadow-cyan-500/40'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {tone === 'H' ? '高 (H)' : '低 (L)'}
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Contrasting Minimal Pair */}
          {selectedPair.contrastingPair && (
            <div
              className={`p-5 rounded-2xl border transition ${
                activeSide === 'contrast'
                  ? 'bg-slate-950 border-amber-500/50 ring-1 ring-amber-500/30'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-mono text-xs font-bold">
                  {selectedPair.contrastingPair.pitchType}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setActiveSide('contrast');
                      handlePlayPitchTones(selectedPair.contrastingPair!.pitchPattern);
                    }}
                    className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition"
                    title="音階トーンを聞く"
                  >
                    <Activity className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setActiveSide('contrast');
                      handlePlaySpeech(selectedPair.contrastingPair!.wordJa);
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                    title="ネイティブ音声を聞く"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-3xl font-black text-slate-100">{selectedPair.contrastingPair.wordJa}</h3>
                <div className="text-sm text-amber-400 font-mono">{selectedPair.contrastingPair.wordKana}</div>
                <div className="text-xs text-slate-400 mt-1">
                  {selectedPair.contrastingPair.meaningBn} ({selectedPair.contrastingPair.meaningEn})
                </div>
              </div>

              {/* Visual Pitch Graph Nodes */}
              <div className="mt-6 pt-4 border-t border-slate-800">
                <div className="text-xs font-bold text-slate-400 mb-3">対比アクセント波形 (Contrasting Curve)</div>
                <div className="flex items-center justify-center gap-6 h-24 bg-slate-900 rounded-xl p-4">
                  {selectedPair.contrastingPair.pitchPattern.map((tone, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400">{idx === 0 ? '1拍目' : '2拍目'}</span>
                      <motion.div
                        animate={{ y: tone === 'H' ? -12 : 12 }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-lg ${
                          tone === 'H'
                            ? 'bg-amber-500 text-slate-950 shadow-amber-500/40'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {tone === 'H' ? '高 (H)' : '低 (L)'}
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

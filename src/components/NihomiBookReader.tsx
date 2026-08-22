import React, { useState, useEffect } from 'react';
import { 
  BookOpen, ChevronLeft, ChevronRight, Volume2, Download, 
  Search, ZoomIn, ZoomOut, Sparkles, CheckCircle2, Bookmark
} from 'lucide-react';

interface VocabEntry {
  romaji: string;
  kana: string;
  kanji: string;
  bangla: string;
  lesson: number;
}

interface GrammarEntry {
  pattern: string;
  romaji: string;
  banglaMeaning: string;
  explanation: string;
  exampleJa: string;
  exampleEn: string;
  exampleBn: string;
  lesson: number;
}

interface NihomiBookReaderProps {
  initialLesson?: number;
  bookType?: 'vocabulary' | 'grammar' | 'kanji';
  onClose?: () => void;
}

export const NihomiBookReader: React.FC<NihomiBookReaderProps> = ({
  initialLesson = 1,
  bookType = 'vocabulary',
  onClose
}) => {
  const [currentLesson, setCurrentLesson] = useState<number>(initialLesson);
  const [pageSide, setPageSide] = useState<'left' | 'right'>('left');
  const [searchTerm, setSearchTerm] = useState('');
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [bookmarkedPages, setBookmarkedPages] = useState<number[]>([]);
  const [speakingWord, setSpeakingWord] = useState<string | null>(null);

  // Web Audio API Synthesized Paper Page-Turn Sound (Zero External Assets Required!)
  const playPageFlipSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const bufferSize = ctx.sampleRate * 0.12; // 120ms paper swoosh
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }
      
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1400;
      filter.Q.value = 1.2;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch (e) {
      console.log('Audio Context unavailable or waiting for user gesture.');
    }
  };

  const handleNextPage = () => {
    playPageFlipSound();
    if (currentLesson < 25) {
      setCurrentLesson(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    playPageFlipSound();
    if (currentLesson > 1) {
      setCurrentLesson(prev => prev - 1);
    }
  };

  const playSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.85;
      setSpeakingWord(text);
      utterance.onend = () => setSpeakingWord(null);
      utterance.onerror = () => setSpeakingWord(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Sample Minna no Nihongo Lesson Vocabulary from uploaded sources
  const sampleVocabulary: Record<number, VocabEntry[]> = {
    1: [
      { romaji: 'watashi', kana: 'わたし', kanji: '私', bangla: 'আমি', lesson: 1 },
      { romaji: 'watashitachi', kana: 'わたしたち', kanji: '私達', bangla: 'আমরা', lesson: 1 },
      { romaji: 'anata', kana: 'あなた', kanji: '貴方', bangla: 'আপনি / তুমি', lesson: 1 },
      { romaji: 'ano hito (ano kata)', kana: 'あのひと (あのかた)', kanji: 'あの人 (あの方)', bangla: 'ঐ ব্যক্তি (সম্মানসূচক)', lesson: 1 },
      { romaji: 'minasan', kana: 'みなさん', kanji: '皆さん', bangla: 'আপনারা সকলে / সুধীবৃন্দ', lesson: 1 },
      { romaji: '~san', kana: '~さん', kanji: '〜様', bangla: 'জনাব / বেগম (নামের শেষে)', lesson: 1 },
      { romaji: 'sensei', kana: 'せんせい', kanji: '先生', bangla: 'শিক্ষক / ওস্তাদ', lesson: 1 },
      { romaji: 'gakusei', kana: 'がくせい', kanji: '学生', bangla: 'ছাত্র / ছাত্রী', lesson: 1 },
      { romaji: 'kaishain', kana: 'かいしゃいん', kanji: '会社員', bangla: 'কোম্পানি চাকুরিজীবী', lesson: 1 },
      { romaji: 'ginkouin', kana: 'ぎんこういん', kanji: '銀行員', bangla: 'ব্যাংক কর্মকর্তা', lesson: 1 },
      { romaji: 'isha', kana: 'いしゃ', kanji: '医者', bangla: 'ডাক্তার / চিকিৎসক', lesson: 1 },
      { romaji: 'daigaku', kana: 'だいがく', kanji: '大学', bangla: 'বিশ্ববিদ্যালয়', lesson: 1 },
      { romaji: 'nihon', kana: 'にほん', kanji: '日本', bangla: 'জাপান', lesson: 1 },
      { romaji: 'hajimemashite', kana: 'はじめまして', kanji: '初めまして', bangla: 'আপনার সাথে প্রথম দেখা হলো (পরিচিতি)', lesson: 1 },
      { romaji: 'douzo yoroshiku [onegai shimasu]', kana: 'どうぞ よろしく [おねがいします]', kanji: 'どうぞ宜しく[お願いします]', bangla: 'আপনার শুভকামনা আশা করছি (পরিচিতি সমাপ্তি)', lesson: 1 }
    ],
    2: [
      { romaji: 'kore', kana: 'これ', kanji: '此れ', bangla: 'এটা (আমার কাছের বস্তু)', lesson: 2 },
      { romaji: 'sore', kana: 'それ', kanji: '其れ', bangla: 'ওটা (আপনার কাছের বস্তু)', lesson: 2 },
      { romaji: 'are', kana: 'あれ', kanji: 'あれ', bangla: 'ঐটা (উভয়ের দূরের বস্তু)', lesson: 2 },
      { romaji: 'kono~', kana: 'この~', kanji: 'この~', bangla: 'এই ~ (বস্তু বা প্রাণী)', lesson: 2 },
      { romaji: 'sono~', kana: 'その~', kanji: 'その~', bangla: 'ওই ~ (বস্তু বা প্রাণী)', lesson: 2 },
      { romaji: 'ano~', kana: 'あの~', kanji: 'あの~', bangla: 'ঐ ~ (দূরের বস্তু বা প্রাণী)', lesson: 2 },
      { romaji: 'hon', kana: 'ほん', kanji: '本', bangla: 'বই', lesson: 2 },
      { romaji: 'jisho', kana: 'じしょ', kanji: '辞書', bangla: 'অভিধান / ডিকশনারি', lesson: 2 },
      { romaji: 'shinbun', kana: 'しんぶん', kanji: '新聞', bangla: 'সংবাদপত্র / খবরের কাগজ', lesson: 2 },
      { romaji: 'tokei', kana: 'とけい', kanji: '時計', bangla: 'ঘড়ি', lesson: 2 },
      { romaji: 'kasa', kana: 'かさ', kanji: '傘', bangla: 'ছাতা', lesson: 2 },
      { romaji: 'kaban', kana: 'かばん', kanji: '鞄', bangla: 'ব্যাগ / ব্রিফকেস', lesson: 2 },
      { romaji: 'kuruma', kana: 'くるま', kanji: '車 / 自動車', bangla: 'গাড়ি / মোটরযান', lesson: 2 },
      { romaji: 'nihongo', kana: 'にほんご', kanji: '日本語', bangla: 'জাপানি ভাষা', lesson: 2 },
      { romaji: 'nan / nani', kana: 'なん / なに', kanji: '何', bangla: 'কী?', lesson: 2 }
    ]
  };

  const vocabList = sampleVocabulary[currentLesson] || sampleVocabulary[1] || [];
  const filteredVocab = vocabList.filter(v => 
    v.romaji.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.kana.includes(searchTerm) ||
    v.kanji.includes(searchTerm) ||
    v.bangla.includes(searchTerm)
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white max-w-5xl mx-auto">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              みんなの日本語 N5 বাংলা ই-বুক
              <span className="text-xs bg-red-600 text-white font-semibold px-2.5 py-0.5 rounded-full">
                Interactive FlipBook
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Minna no Nihongo Lesson {currentLesson} of 25 • খাঁটি বই পড়ার অনুভূতি
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="শব্দ খুঁজুন (বাংলা / রোমাজি)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-800/80 border border-slate-700 text-xs text-white rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-red-500 w-44 sm:w-56"
            />
          </div>

          <button
            onClick={() => setFontSize(f => f === 'normal' ? 'large' : 'normal')}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition cursor-pointer"
            title="ফন্ট সাইজ পরিবর্তন"
          >
            {fontSize === 'normal' ? <ZoomIn className="w-4 h-4" /> : <ZoomOut className="w-4 h-4" />}
          </button>

          <a
            href="/downloads/N5_Vocabulary_Bangla.pdf"
            download="N5_Vocabulary_Bangla.pdf"
            className="flex items-center space-x-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-lg shadow-red-600/20 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>PDF ডাউনলোড</span>
          </a>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Realistic Book Open Spine View */}
      <div className="my-6 relative perspective-1000">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-[#fdfbf7] text-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-amber-200/80 min-h-[520px]">
          
          {/* Left Page */}
          <div className="p-8 border-b md:border-b-0 md:border-r border-amber-200/70 relative bg-gradient-to-r from-[#f7f3eb] via-[#fdfbf7] to-[#faf6ed]">
            <div className="flex justify-between items-center pb-4 border-b border-amber-300/40 text-amber-900/60 text-xs font-semibold">
              <span>MINNA NO NIHONGO — SHOKYU I</span>
              <span>পাঠ - {currentLesson} (Lesson {currentLesson})</span>
            </div>

            <div className="my-4">
              <h3 className="text-xl font-bold text-red-950 flex items-center justify-between">
                <span>মেইন ভোকাবুলারি ব্যাংক (語彙)</span>
                <span className="text-xs text-amber-800/80 font-normal bg-amber-100 px-2.5 py-1 rounded-lg">
                  পৃষ্ঠা {currentLesson * 2 - 1}
                </span>
              </h3>
              <p className="text-xs text-amber-900/70 mt-0.5">
                স্পিকারে ক্লিক করে খাঁটি টোকিও উচ্চারণ শুনুন
              </p>
            </div>

            {/* Word List Table */}
            <div className="space-y-2.5 overflow-y-auto max-h-[360px] pr-1.5 custom-scrollbar">
              {filteredVocab.slice(0, 8).map((word, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-amber-100/60 transition group border border-transparent hover:border-amber-200"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold text-slate-950 ${fontSize === 'large' ? 'text-lg' : 'text-base'}`}>
                        {word.kana}
                      </span>
                      {word.kanji && word.kanji !== word.kana && (
                        <span className="text-xs bg-red-100/80 text-red-800 font-semibold px-2 py-0.5 rounded">
                          {word.kanji}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-amber-900/60 font-mono">
                      {word.romaji}
                    </div>
                  </div>

                  <div className="text-right flex items-center space-x-3">
                    <span className="font-semibold text-slate-800 text-sm">
                      {word.bangla}
                    </span>
                    <button
                      onClick={() => playSpeech(word.kana)}
                      className={`p-1.5 rounded-lg transition cursor-pointer ${
                        speakingWord === word.kana 
                          ? 'bg-red-600 text-white animate-pulse' 
                          : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                      }`}
                      title="উচ্চারণ শুনুন"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Left Page Footer */}
            <div className="absolute bottom-4 left-8 text-[11px] text-amber-900/40 font-mono">
              NIHOMI AI BOOK ENGINE • L{currentLesson}-P1
            </div>
          </div>

          {/* Right Page */}
          <div className="p-8 relative bg-gradient-to-l from-[#f7f3eb] via-[#fdfbf7] to-[#faf6ed]">
            <div className="flex justify-between items-center pb-4 border-b border-amber-300/40 text-amber-900/60 text-xs font-semibold">
              <span>লেসন {currentLesson} ব্যাকরণ ও প্রয়োগ</span>
              <span className="text-xs text-amber-800/80 font-normal bg-amber-100 px-2.5 py-1 rounded-lg">
                পৃষ্ঠা {currentLesson * 2}
              </span>
            </div>

            <div className="my-4">
              <h3 className="text-lg font-bold text-red-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-red-600" />
                <span>বাক্য গঠন ও কথোপকথন (文型・会話)</span>
              </h3>
            </div>

            {/* Grammar & Dialogue Notes */}
            <div className="space-y-3.5 overflow-y-auto max-h-[360px] pr-1.5 custom-scrollbar text-sm">
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5">
                <div className="font-bold text-red-950 mb-1">
                  নিয়ম ১: N₁ は N₂ です (আমি / ইনি N₂ হন)
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>は (Wa)</strong> হলো টপিক মার্কার পার্টিকেল। এটি বাক্যের মূল বিষয়ের পরে বসে। 
                  <strong>です (Desu)</strong> দ্বারা বাক্যটি বিনম্রভাবে সমাপ্ত করা হয়।
                </p>
                <div className="mt-2 text-xs bg-white/90 p-2 rounded-lg border border-amber-100 text-slate-800 font-medium">
                  • わたしは マイク・ミラーです。(আমি মাইক মিলার।)
                </div>
              </div>

              <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5">
                <div className="font-bold text-red-950 mb-1">
                  নিয়ম ২: N₁ は N₂ じゃありません (না-বোধক)
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong>じゃありません (Ja arimasen)</strong> হলো です-এর সাধারণ নেগেটিভ রূপ।
                </p>
                <div className="mt-2 text-xs bg-white/90 p-2 rounded-lg border border-amber-100 text-slate-800 font-medium">
                  • サントスさんは 学生じゃ ありません。(সান্তোস সাহেব ছাত্র নন।)
                </div>
              </div>

              {/* Extra Dialogue Bite */}
              <div className="bg-rose-50/60 border border-rose-200/60 rounded-xl p-3">
                <div className="text-xs font-bold text-rose-900 mb-1">
                  🗣️ পরিচিতির সময় ব্যবহৃত বাক্য:
                </div>
                <div className="text-xs text-slate-700">
                  はじめまして。どうぞ よろしく お願いします。
                  <br />
                  <span className="text-slate-500 italic">(হাজিমেমাশিতে। দোজো ইয়োরোশিকু ওনেগাই শিমাসু।)</span>
                </div>
              </div>
            </div>

            {/* Right Page Footer */}
            <div className="absolute bottom-4 right-8 text-[11px] text-amber-900/40 font-mono">
              NIHOMI AI BOOK ENGINE • L{currentLesson}-P2
            </div>
          </div>
        </div>
      </div>

      {/* Pagination Footer Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <button
          onClick={handlePrevPage}
          disabled={currentLesson === 1}
          className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 rounded-2xl transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>পূর্ববর্তী পাঠ (Lesson {currentLesson > 1 ? currentLesson - 1 : 1})</span>
        </button>

        {/* Quick Lesson Picker */}
        <div className="flex items-center space-x-1.5 overflow-x-auto max-w-md py-1">
          {Array.from({ length: 25 }, (_, i) => i + 1).map(num => (
            <button
              key={num}
              onClick={() => {
                playPageFlipSound();
                setCurrentLesson(num);
              }}
              className={`w-8 h-8 rounded-xl text-xs font-bold transition flex items-center justify-center shrink-0 cursor-pointer ${
                currentLesson === num 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 ring-2 ring-red-400' 
                  : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        <button
          onClick={handleNextPage}
          disabled={currentLesson === 25}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:hover:bg-red-600 text-white text-sm font-semibold px-5 py-2.5 rounded-2xl transition shadow-lg shadow-red-600/20 cursor-pointer"
        >
          <span>পরবর্তী পাঠ (Lesson {currentLesson < 25 ? currentLesson + 1 : 25})</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

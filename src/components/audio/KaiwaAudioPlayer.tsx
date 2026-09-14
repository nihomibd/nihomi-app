import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Repeat,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Languages,
  Sparkles,
} from 'lucide-react';
import { DialogueLine } from '../../data/listeningLabData';
import { speakJapanese, stopJapaneseSpeech } from '../../lib/tts';

interface KaiwaAudioPlayerProps {
  dialogue: DialogueLine[];
  lessonNumber: number;
  lessonTitleJa: string;
  lessonTitleBn: string;
  onComplete?: () => void;
}

export const KaiwaAudioPlayer: React.FC<KaiwaAudioPlayerProps> = ({
  dialogue,
  lessonNumber,
  lessonTitleJa,
  lessonTitleBn,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isLoopingCurrentLine, setIsLoopingCurrentLine] = useState<boolean>(false);

  // Transcript visibility toggles
  const [showFurigana, setShowFurigana] = useState<boolean>(true);
  const [showRomaji, setShowRomaji] = useState<boolean>(true);
  const [showBengali, setShowBengali] = useState<boolean>(true);

  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const isPlayingRef = useRef<boolean>(isPlaying);
  isPlayingRef.current = isPlaying;

  const isLoopingRef = useRef<boolean>(isLoopingCurrentLine);
  isLoopingRef.current = isLoopingCurrentLine;

  const currentIndexRef = useRef<number>(currentIndex);
  currentIndexRef.current = currentIndex;

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      stopJapaneseSpeech();
    };
  }, []);

  // When dialogue changes (e.g. user selects a different lesson), reset
  useEffect(() => {
    stopJapaneseSpeech();
    setIsPlaying(false);
    setCurrentIndex(0);
    setIsLoopingCurrentLine(false);
  }, [lessonNumber, dialogue]);

  // Auto-scroll active line into view smoothly
  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentIndex]);

  const playLineAtIndex = useCallback(
    (index: number) => {
      if (index < 0 || index >= dialogue.length) {
        setIsPlaying(false);
        if (index >= dialogue.length && onComplete) {
          onComplete();
        }
        return;
      }

      setCurrentIndex(index);
      setIsPlaying(true);

      const line = dialogue[index];
      // Distinguish pitch between Speaker A and Speaker B
      const pitch = line.speakerRole === 'A' ? 1.08 : line.speakerRole === 'B' ? 0.95 : 1.0;

      speakJapanese(line.textJa, {
        rate: playbackSpeed,
        pitch,
        onEnd: () => {
          if (!isPlayingRef.current) return;

          if (isLoopingRef.current) {
            // Repeat the same line after a short natural pause
            setTimeout(() => {
              if (isPlayingRef.current && isLoopingRef.current) {
                playLineAtIndex(currentIndexRef.current);
              }
            }, 600);
          } else {
            // Proceed to next line
            if (currentIndexRef.current + 1 < dialogue.length) {
              setTimeout(() => {
                if (isPlayingRef.current) {
                  playLineAtIndex(currentIndexRef.current + 1);
                }
              }, 600);
            } else {
              setIsPlaying(false);
              if (onComplete) {
                onComplete();
              }
            }
          }
        },
        onError: () => {
          setIsPlaying(false);
        },
      });
    },
    [dialogue, playbackSpeed, onComplete]
  );

  const handlePlayPause = () => {
    if (isPlaying) {
      stopJapaneseSpeech();
      setIsPlaying(false);
    } else {
      playLineAtIndex(currentIndex);
    }
  };

  const handleRestart = () => {
    stopJapaneseSpeech();
    playLineAtIndex(0);
  };

  const handleNextLine = () => {
    stopJapaneseSpeech();
    if (currentIndex + 1 < dialogue.length) {
      playLineAtIndex(currentIndex + 1);
    }
  };

  const handlePrevLine = () => {
    stopJapaneseSpeech();
    if (currentIndex > 0) {
      playLineAtIndex(currentIndex - 1);
    }
  };

  const handleLineClick = (idx: number) => {
    stopJapaneseSpeech();
    playLineAtIndex(idx);
  };

  const currentLine = dialogue[currentIndex];

  return (
    <div className="w-full bg-[#12121e] border border-stone-800/80 rounded-2xl p-4 sm:p-6 shadow-xl text-stone-100 flex flex-col gap-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 font-bold text-sm">
            第{lessonNumber}課
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white font-japanese tracking-wide">
                {lessonTitleJa}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                会話 Kaiwa
              </span>
            </div>
            <p className="text-xs text-stone-400 font-medium">{lessonTitleBn}</p>
          </div>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1 bg-stone-900/80 border border-stone-800 p-1 rounded-xl">
          {[0.75, 1.0, 1.25].map((speed) => (
            <button
              key={speed}
              onClick={() => {
                setPlaybackSpeed(speed);
                if (isPlaying) {
                  stopJapaneseSpeech();
                  setTimeout(() => playLineAtIndex(currentIndex), 100);
                }
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                playbackSpeed === speed
                  ? 'bg-red-500 text-white shadow-xs'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* Main Focus Audio Card (Active Speaker Stage) */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-stone-900/90 to-[#181829] border border-stone-800 p-5 sm:p-6 flex flex-col gap-4">
        {/* Active speaker tag & wave animation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                currentLine?.speakerRole === 'A'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              {currentLine?.speaker}
            </span>
            <span className="text-xs text-stone-500">
              বাক্য {currentIndex + 1} / {dialogue.length}
            </span>
          </div>

          {/* Sound waves indicator when speaking */}
          {isPlaying && (
            <div className="flex items-center gap-1">
              <span className="w-1 h-3 bg-red-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1 h-5 bg-red-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1 h-4 bg-red-400 rounded-full animate-bounce [animation-delay:300ms]" />
              <span className="w-1 h-2 bg-red-400 rounded-full animate-bounce [animation-delay:450ms]" />
            </div>
          )}
        </div>

        {/* Japanese dialogue text */}
        <div className="my-2">
          {showFurigana ? (
            <p className="text-xl sm:text-2xl md:text-3xl font-japanese font-bold text-white leading-relaxed tracking-wide">
              {currentLine?.furigana || currentLine?.textJa}
            </p>
          ) : (
            <p className="text-xl sm:text-2xl md:text-3xl font-japanese font-bold text-white leading-relaxed tracking-wide">
              {currentLine?.textJa}
            </p>
          )}

          {/* Romaji */}
          {showRomaji && (
            <p className="text-sm sm:text-base text-amber-300/90 font-mono mt-2 tracking-wide">
              {currentLine?.romaji}
            </p>
          )}

          {/* Bengali translation */}
          {showBengali && (
            <p className="text-sm sm:text-base text-stone-300 mt-2 font-bangla border-t border-stone-800/80 pt-2 text-stone-300/95 leading-relaxed">
              <span className="text-stone-500 text-xs mr-2 font-sans font-medium uppercase tracking-wider">
                অর্থ:
              </span>
              {currentLine?.meaningBn}
            </p>
          )}
        </div>

        {/* Interactive Playbar Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-800/70">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevLine}
              disabled={currentIndex === 0}
              className="p-2.5 rounded-xl bg-stone-800/70 hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed text-stone-200 transition-colors cursor-pointer"
              title="পূর্ববর্তী বাক্য (Previous line)"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={handlePlayPause}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-red-600/30 active:scale-95 transition-all cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause size={18} />
                  <span>পজ (Pause)</span>
                </>
              ) : (
                <>
                  <Play size={18} />
                  <span>শুনুন (Listen)</span>
                </>
              )}
            </button>

            <button
              onClick={handleNextLine}
              disabled={currentIndex === dialogue.length - 1}
              className="p-2.5 rounded-xl bg-stone-800/70 hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed text-stone-200 transition-colors cursor-pointer"
              title="পরবর্তী বাক্য (Next line)"
            >
              <ChevronRight size={18} />
            </button>

            <button
              onClick={handleRestart}
              className="p-2.5 rounded-xl bg-stone-800/70 hover:bg-stone-800 text-stone-300 transition-colors cursor-pointer"
              title="শুরু থেকে আবার শুনুন (Replay from start)"
            >
              <RotateCcw size={16} />
            </button>
          </div>

          {/* Segment Loop Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLoopingCurrentLine(!isLoopingCurrentLine)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isLoopingCurrentLine
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700'
              }`}
              title="এই বাক্যটি বারবার বাজান যতক্ষণ না নিখুঁত হয়"
            >
              <Repeat size={14} />
              <span>{isLoopingCurrentLine ? 'লুপ চালু (Looping)' : 'বাক্য লুপ করুন'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Transcript Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-stone-900/60 p-3 rounded-xl border border-stone-800">
        <span className="text-stone-400 font-medium flex items-center gap-1.5">
          <Languages size={14} className="text-red-400" />
          ট্রান্সক্রিপ্ট সেটিংস:
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFurigana(!showFurigana)}
            className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer flex items-center gap-1 ${
              showFurigana
                ? 'bg-stone-800 border-red-500/40 text-red-300 font-semibold'
                : 'bg-stone-900 border-stone-800 text-stone-500'
            }`}
          >
            {showFurigana ? <Eye size={12} /> : <EyeOff size={12} />}
            <span>ফুরিগানা (Furigana)</span>
          </button>
          <button
            onClick={() => setShowRomaji(!showRomaji)}
            className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer flex items-center gap-1 ${
              showRomaji
                ? 'bg-stone-800 border-amber-500/40 text-amber-300 font-semibold'
                : 'bg-stone-900 border-stone-800 text-stone-500'
            }`}
          >
            {showRomaji ? <Eye size={12} /> : <EyeOff size={12} />}
            <span>রোমাজি (Romaji)</span>
          </button>
          <button
            onClick={() => setShowBengali(!showBengali)}
            className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer flex items-center gap-1 ${
              showBengali
                ? 'bg-stone-800 border-emerald-500/40 text-emerald-300 font-semibold'
                : 'bg-stone-900 border-stone-800 text-stone-500'
            }`}
          >
            {showBengali ? <Eye size={12} /> : <EyeOff size={12} />}
            <span>বাংলা অনুবাদ</span>
          </button>
        </div>
      </div>

      {/* Complete Dialogue Interactive List */}
      <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1 no-scrollbar">
        <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">
          পূর্ণ কথোপকথন (ক্লিক করে শুনুন):
        </p>
        {dialogue.map((line, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={line.id}
              ref={isActive ? activeLineRef : null}
              onClick={() => handleLineClick(idx)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isActive
                  ? 'bg-red-950/20 border-red-500/40 shadow-xs'
                  : 'bg-stone-900/40 border-stone-800/60 hover:bg-stone-900/80 hover:border-stone-700'
              }`}
            >
              <div className="flex items-start gap-3 flex-1">
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold shrink-0 mt-0.5 ${
                    line.speakerRole === 'A'
                      ? 'bg-rose-500/20 text-rose-300'
                      : 'bg-cyan-500/20 text-cyan-300'
                  }`}
                >
                  {line.speaker}
                </span>

                <div className="flex flex-col gap-0.5">
                  <p
                    className={`font-japanese text-sm sm:text-base ${
                      isActive ? 'text-white font-bold' : 'text-stone-300'
                    }`}
                  >
                    {showFurigana ? line.furigana : line.textJa}
                  </p>
                  {showRomaji && (
                    <p className="text-xs text-amber-400/80 font-mono">{line.romaji}</p>
                  )}
                  {showBengali && (
                    <p className="text-xs text-stone-400 font-bangla">{line.meaningBn}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {isActive && isPlaying ? (
                  <span className="text-xs font-bold text-red-400 flex items-center gap-1">
                    <Volume2 size={14} className="animate-pulse" />
                    বাজছে
                  </span>
                ) : (
                  <span className="text-xs text-stone-500 hover:text-stone-300 flex items-center gap-1">
                    <Play size={12} /> প্লে
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

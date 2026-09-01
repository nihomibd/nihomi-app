import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, Sparkles, User, Headphones, CheckCircle2 } from 'lucide-react';
import { speakJapanese, stopJapaneseSpeech } from '../../lib/tts';

interface TokyoListeningAudioPlayerProps {
  audioScript: {
    narratorText: string;
    dialogue: {
      speaker: string;
      textJa: string;
      romaji?: string;
      bangla?: string;
    }[];
    audioPrompt: string;
    questionAudioPromptJa: string;
  };
  onFinishedAudio?: () => void;
  autoPlayOnMount?: boolean;
}

export const TokyoListeningAudioPlayer: React.FC<TokyoListeningAudioPlayerProps> = ({
  audioScript,
  onFinishedAudio,
  autoPlayOnMount = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSpeakerIndex, setActiveSpeakerIndex] = useState<number>(-1); // -1: narrator, >=0: dialogue lines, 999: question prompt
  const [playbackRate, setPlaybackRate] = useState<number>(0.9);
  const [showScript, setShowScript] = useState<boolean>(false);
  const [playCount, setPlayCount] = useState<number>(0);

  useEffect(() => {
    return () => {
      stopJapaneseSpeech();
    };
  }, []);

  const playFullDrillSequence = () => {
    stopJapaneseSpeech();
    setIsPlaying(true);
    setPlayCount((prev) => prev + 1);

    // Sequence: 1. Narrator intro -> 2. Dialogue lines -> 3. Question Audio Prompt
    playStepNarrator();
  };

  const playStepNarrator = () => {
    setActiveSpeakerIndex(-1);
    speakJapanese(audioScript.narratorText, {
      rate: playbackRate,
      onEnd: () => {
        setTimeout(() => {
          if (audioScript.dialogue.length > 0) {
            playStepDialogue(0);
          } else {
            playStepQuestionPrompt();
          }
        }, 600);
      },
      onError: () => {
        setIsPlaying(false);
      }
    });
  };

  const playStepDialogue = (lineIndex: number) => {
    if (lineIndex >= audioScript.dialogue.length) {
      setTimeout(() => {
        playStepQuestionPrompt();
      }, 700);
      return;
    }

    setActiveSpeakerIndex(lineIndex);
    const line = audioScript.dialogue[lineIndex];

    // Give slightly different pitch for different speakers
    const pitch = line.speaker.includes('女') ? 1.15 : line.speaker.includes('男') ? 0.9 : 1.0;

    speakJapanese(line.textJa, {
      rate: playbackRate,
      pitch,
      onEnd: () => {
        setTimeout(() => {
          playStepDialogue(lineIndex + 1);
        }, 500);
      },
      onError: () => {
        setIsPlaying(false);
      }
    });
  };

  const playStepQuestionPrompt = () => {
    setActiveSpeakerIndex(999);
    speakJapanese(audioScript.questionAudioPromptJa || audioScript.audioPrompt, {
      rate: playbackRate,
      onEnd: () => {
        setIsPlaying(false);
        setActiveSpeakerIndex(-2);
        if (onFinishedAudio) onFinishedAudio();
      },
      onError: () => {
        setIsPlaying(false);
      }
    });
  };

  const handleStop = () => {
    stopJapaneseSpeech();
    setIsPlaying(false);
  };

  return (
    <div className="rounded-2xl border border-rose-500/20 bg-gradient-to-b from-slate-900/90 to-[#0a0a14] p-5 shadow-xl text-slate-100 mb-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Headphones className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold tracking-wide text-rose-300 flex items-center gap-2">
              Tokyo Listening Audio Drill (聴解音声)
              {isPlaying && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                  Playing...
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-400">
              Official JLPT format audio with Tokyo native articulation
            </p>
          </div>
        </div>

        {/* Speed & Script Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700">
            {[0.8, 0.9, 1.0, 1.2].map((speed) => (
              <button
                key={speed}
                type="button"
                onClick={() => setPlaybackRate(speed)}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
                  playbackRate === speed
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowScript((prev) => !prev)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              showScript
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            {showScript ? 'Hide Script' : 'Show Script (スクリプト)'}
          </button>
        </div>
      </div>

      {/* Main Playback Controller */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/60 rounded-xl p-4 border border-slate-800/80">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {isPlaying ? (
            <button
              type="button"
              onClick={handleStop}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-all shadow-lg shadow-rose-600/30"
            >
              <Pause className="w-4 h-4" /> Pause Audio
            </button>
          ) : (
            <button
              type="button"
              onClick={playFullDrillSequence}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-semibold text-sm transition-all shadow-lg shadow-rose-600/30"
            >
              <Play className="w-4 h-4 fill-white" />
              {playCount === 0 ? 'Play Official Audio (音声再生)' : 'Replay Audio (もう一度聴く)'}
            </button>
          )}

          {playCount > 0 && !isPlaying && (
            <button
              type="button"
              onClick={playFullDrillSequence}
              title="Restart from beginning"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Audio Wave Visualizer Simulation */}
        <div className="flex items-center gap-1.5 h-6">
          {[40, 75, 55, 90, 65, 80, 45, 95, 60, 85, 50, 70].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-300 ${
                isPlaying
                  ? 'bg-gradient-to-t from-rose-500 to-amber-400 animate-pulse'
                  : 'bg-slate-800'
              }`}
              style={{
                height: isPlaying ? `${Math.max(12, h * 0.28)}px` : '6px',
                animationDelay: `${i * 70}ms`
              }}
            />
          ))}
        </div>
      </div>

      {/* Script & Multi-Speaker Dialogue View */}
      {showScript && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3">
          {/* Narrator Intro */}
          <div
            className={`p-3 rounded-xl border text-xs sm:text-sm transition-all ${
              activeSpeakerIndex === -1
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-200 ring-1 ring-rose-500/50'
                : 'bg-slate-950/40 border-slate-800 text-slate-300'
            }`}
          >
            <div className="text-[11px] uppercase tracking-wider text-rose-400 font-bold mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Narrator (ナレーター)
            </div>
            <p className="font-japanese font-medium">{audioScript.narratorText}</p>
          </div>

          {/* Dialogue Lines */}
          {audioScript.dialogue.map((line, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-xs sm:text-sm transition-all ${
                activeSpeakerIndex === idx
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-100 ring-1 ring-amber-500/40'
                  : 'bg-slate-950/40 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400 flex items-center gap-1">
                  <User className="w-3 h-3" /> {line.speaker}
                </span>
              </div>
              <p className="font-japanese text-sm font-semibold text-slate-100 mb-1">{line.textJa}</p>
              {line.romaji && <p className="text-xs text-slate-400 italic mb-0.5">{line.romaji}</p>}
              {line.bangla && <p className="text-xs text-amber-300/80">{line.bangla}</p>}
            </div>
          ))}

          {/* Final Question Audio Prompt */}
          <div
            className={`p-3 rounded-xl border text-xs sm:text-sm transition-all ${
              activeSpeakerIndex === 999
                ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-100 ring-1 ring-emerald-500/40'
                : 'bg-slate-950/40 border-slate-800 text-slate-300'
            }`}
          >
            <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Question Prompt (質問)
            </div>
            <p className="font-japanese font-semibold">
              {audioScript.questionAudioPromptJa || audioScript.audioPrompt}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

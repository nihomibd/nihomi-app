import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Briefcase,
  Layers,
  ArrowRight,
  ChevronRight,
  Flame,
  MessageSquare,
  Globe,
  Award,
  Zap,
  Repeat,
  Check,
  X,
  Shuffle
} from 'lucide-react';
import { InfiniteContentEngine, InfiniteLearningExperience } from '../../../core/content-engine/infiniteContentEngine';
import { ContentIngestionService } from '../../../core/content-engine/contentIngestionService';
import { speakJapanese } from '../../../lib/tts';

export const InfiniteConceptStudio: React.FC = () => {
  const objects = ContentIngestionService.getKnowledgeObjects();
  const [selectedObjectId, setSelectedObjectId] = useState<string>(objects[0]?.id || '');
  const [activeFormatTab, setActiveFormatTab] = useState<number>(1);

  // Interactive format states
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [selectedMcqOption, setSelectedMcqOption] = useState<string | null>(null);
  const [fillInput, setFillInput] = useState('');
  const [selectedScramble, setSelectedScramble] = useState<string[]>([]);
  const [errorSpotterFixed, setErrorSpotterFixed] = useState(false);

  const selectedObj = objects.find((o) => o.id === selectedObjectId) || objects[0];
  const exp: InfiniteLearningExperience = InfiniteContentEngine.generateInfiniteExperience(selectedObj);

  const handleSelectObject = (id: string) => {
    setSelectedObjectId(id);
    setFlashcardFlipped(false);
    setSelectedMcqOption(null);
    setFillInput('');
    setSelectedScramble([]);
    setErrorSpotterFixed(false);
  };

  const formatList = [
    { id: 1, name: '1. Micro-Lesson Formula', icon: BookOpen },
    { id: 2, name: '2. MCQ Diagnostic Quiz', icon: HelpCircle },
    { id: 3, name: '3. Leitner 3D Flashcard', icon: Repeat },
    { id: 4, name: '4. Tokyo Baito & Keigo Scenario', icon: Briefcase },
    { id: 5, name: '5. Pitch Accent Shadowing Drill', icon: Volume2 },
    { id: 6, name: '6. Cloze / Fill-in-Blank', icon: CheckCircle2 },
    { id: 7, name: '7. Speed Recognition Matrix', icon: Zap },
    { id: 8, name: '8. Particle Discrimination Lab', icon: Layers },
    { id: 9, name: '9. Keigo Politeness Transformer', icon: Award },
    { id: 10, name: '10. Native Listening Audio', icon: MessageSquare },
    { id: 11, name: '11. Cultural Nuance & Tokyo Life', icon: Globe },
    { id: 12, name: '12. Radical & Stroke Order', icon: Sparkles },
    { id: 13, name: '13. Sentence Scramble Puzzle', icon: Shuffle },
    { id: 14, name: '14. Collocation & Phrasing', icon: Check },
    { id: 15, name: '15. Ghost Mode Error Spotter', icon: Flame }
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Top Concept Picker */}
      <div className="p-4 bg-stone-950 border border-stone-800 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <span className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-wider block">
            Infinite Learning Matrix™ (15 Automated Formats)
          </span>
          <h4 className="text-sm font-extrabold text-white">Target Concept Transformer</h4>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-stone-400 font-mono">Select Knowledge Object:</span>
          <select
            value={selectedObjectId}
            onChange={(e) => handleSelectObject(e.target.value)}
            className="bg-stone-900 border border-stone-700 text-stone-200 text-xs font-mono font-bold px-3 py-2 rounded-xl"
          >
            {objects.map((obj) => (
              <option key={obj.id} value={obj.id}>
                {obj.code} ({obj.type}) — {obj.level}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 15 Format Tabs Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {formatList.map((f) => {
          const Icon = f.icon;
          const isActive = activeFormatTab === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setActiveFormatTab(f.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{f.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Format Showcase Container */}
      <div className="p-6 bg-stone-950 border border-stone-800 rounded-3xl space-y-6">
        {/* Concept Title Banner */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-2xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs text-amber-400 font-bold">JLPT {exp.level}</span>
                <span className="px-2 py-0.5 bg-stone-800 text-stone-300 font-mono text-[10px] rounded">{exp.domain}</span>
              </div>
              <h3 className="text-lg font-bold text-white font-japanese mt-0.5">{exp.titleJa}</h3>
            </div>
          </div>

          <button
            onClick={() => speakJapanese(exp.titleJa)}
            className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-mono font-bold rounded-xl border border-stone-700 flex items-center space-x-1.5 cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-red-400" />
            <span>Tokyo Audio</span>
          </button>
        </div>

        {/* 1. Micro-Lesson Formula */}
        {activeFormatTab === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-5 bg-stone-900 rounded-2xl border border-stone-800 space-y-3">
              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">Structural Formula</span>
              <div className="p-4 bg-stone-950 rounded-xl font-mono text-base font-bold text-amber-300 border border-amber-900/40">
                {exp.formats.microLesson.formula}
              </div>
              <div className="space-y-2 text-xs">
                <p className="text-stone-300 font-sans leading-relaxed text-sm">
                  {exp.formats.microLesson.explanationBn}
                </p>
                <div className="p-3 bg-stone-950 rounded-xl text-stone-400 font-japanese text-xs border border-stone-800">
                  <strong className="text-stone-300">💡 Tokyo Accent & Usage Tip: </strong>
                  {exp.formats.microLesson.tipJa}
                </div>
                <div className="p-3 bg-amber-950/30 rounded-xl text-amber-300 text-xs border border-amber-900/40">
                  <strong>🧠 Mnemonic: </strong>
                  {exp.formats.microLesson.mnemonicBn}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. MCQ Concept Quiz */}
        {activeFormatTab === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-5 bg-stone-900 rounded-2xl border border-stone-800 space-y-4">
              <h4 className="text-sm font-bold text-white leading-relaxed">{exp.formats.mcqQuiz.question}</h4>
              <div className="space-y-2.5">
                {exp.formats.mcqQuiz.options.map((opt) => {
                  const isSelected = selectedMcqOption === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedMcqOption(opt.id)}
                      className={`w-full p-4 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? opt.isCorrect
                            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                            : 'bg-red-950/80 border-red-500 text-red-200'
                          : 'bg-stone-950 border-stone-800 hover:border-stone-700 text-stone-200'
                      }`}
                    >
                      <div className="space-y-0.5 font-sans">
                        <div className="font-bold text-sm font-japanese">{opt.textJa}</div>
                        <div className="text-stone-400 text-xs">{opt.textBn}</div>
                      </div>
                      {isSelected && (
                        <span>{opt.isCorrect ? <Check className="w-5 h-5 text-emerald-400" /> : <X className="w-5 h-5 text-red-400" />}</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedMcqOption && (
                <div className="p-3.5 bg-stone-950 rounded-xl border border-stone-800 text-xs text-stone-300 font-sans">
                  <strong className="text-amber-400 block mb-1">ব্যাখ্যা:</strong>
                  {exp.formats.mcqQuiz.explanationBn}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. Leitner 3D Flashcard */}
        {activeFormatTab === 3 && (
          <div className="flex flex-col items-center justify-center py-6 space-y-4 animate-in fade-in">
            <div
              onClick={() => setFlashcardFlipped(!flashcardFlipped)}
              className="w-full max-w-md h-64 bg-stone-900 border-2 border-stone-700 hover:border-amber-500 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-xl space-y-3"
            >
              {!flashcardFlipped ? (
                <>
                  <span className="text-[10px] font-mono text-stone-500 uppercase">Click to Flip (Front)</span>
                  <strong className="text-3xl font-extrabold text-white font-japanese tracking-wider">
                    {exp.formats.flashcard.front}
                  </strong>
                  <span className="text-xs font-mono text-red-400">{exp.formats.flashcard.furigana}</span>
                </>
              ) : (
                <>
                  <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">Meaning (Back)</span>
                  <div className="text-base font-bold text-white font-sans">{exp.formats.flashcard.back}</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakJapanese(exp.formats.flashcard.audioPhrase);
                    }}
                    className="p-2.5 bg-stone-800 hover:bg-stone-700 text-white rounded-xl border border-stone-700 flex items-center space-x-1 text-xs"
                  >
                    <Volume2 className="w-4 h-4 text-red-400" />
                    <span>Play Audio Phrase</span>
                  </button>
                </>
              )}
            </div>
            <span className="text-xs text-stone-500 font-mono">Spaced Repetition: Box 1 (Daily Review)</span>
          </div>
        )}

        {/* 4. Tokyo Baito & Keigo Scenario */}
        {activeFormatTab === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-5 bg-stone-900 rounded-2xl border border-stone-800 space-y-3.5 text-xs">
              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">Workplace Context</span>
              <div className="p-3 bg-stone-950 rounded-xl text-stone-300 font-sans">
                <strong>পরিস্থিতি: </strong>{exp.formats.baitoScenario.situationBn}
              </div>
              <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
                <div className="text-stone-400 text-xs">👤 কাস্টমার বা ম্যানেজারের কথা:</div>
                <div className="text-white font-japanese text-sm font-bold">{exp.formats.baitoScenario.customerDialogueJa}</div>
              </div>
              <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-800/80 space-y-2">
                <div className="text-emerald-400 text-xs font-bold">🗣️ আপনার সঠিক উত্তর (স্টাফ রেসপন্স):</div>
                <div className="text-white font-japanese text-sm font-bold">{exp.formats.baitoScenario.correctStaffResponseJa}</div>
              </div>
              <div className="p-3 bg-stone-950 rounded-xl text-stone-400 text-xs">
                <strong className="text-amber-400">Keigo / Manners Note: </strong>
                {exp.formats.baitoScenario.keigoNotesBn}
              </div>
            </div>
          </div>
        )}

        {/* 5. Pitch Accent Shadowing Drill */}
        {activeFormatTab === 5 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-5 bg-stone-900 rounded-2xl border border-stone-800 space-y-4 text-center">
              <span className="text-[10px] font-mono text-stone-400 uppercase font-bold block">
                Tokyo Native Tone Contour: {exp.formats.shadowingDrill.targetPitch}
              </span>
              <div className="p-6 bg-stone-950 rounded-2xl border border-stone-800 space-y-2">
                <div className="text-2xl font-japanese font-extrabold text-white">
                  {exp.formats.shadowingDrill.sentenceJa}
                </div>
                <div className="text-sm font-mono text-red-400">{exp.formats.shadowingDrill.romaji}</div>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <button
                  onClick={() => speakJapanese(exp.formats.shadowingDrill.sentenceJa)}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center space-x-2 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Shadow (1.0x Normal)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 6. Cloze / Fill-in-Blank */}
        {activeFormatTab === 6 && (
          <div className="p-5 bg-stone-900 rounded-2xl border border-stone-800 space-y-4 text-xs animate-in fade-in">
            <h4 className="text-base font-japanese font-bold text-white">
              {exp.formats.fillInBlank.sentenceTemplate}
            </h4>
            <div className="space-y-2">
              <input
                type="text"
                value={fillInput}
                onChange={(e) => setFillInput(e.target.value)}
                placeholder="উত্তরটি লিখুন..."
                className="w-full bg-stone-950 border border-stone-700 p-3 rounded-xl text-white font-japanese text-sm"
              />
              <span className="text-stone-400 text-xs block">হিন্ট: {exp.formats.fillInBlank.hintBn}</span>
            </div>
            {fillInput && (
              <div className={`p-3 rounded-xl text-xs font-mono font-bold ${
                fillInput.trim() === exp.formats.fillInBlank.correctAnswer
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-stone-950 text-stone-400'
              }`}>
                {fillInput.trim() === exp.formats.fillInBlank.correctAnswer
                  ? '✓ চমৎকার! সঠিক উত্তর।'
                  : `সঠিক উত্তর: ${exp.formats.fillInBlank.correctAnswer}`}
              </div>
            )}
          </div>
        )}

        {/* 7. Speed Recognition Matrix */}
        {activeFormatTab === 7 && (
          <div className="p-5 bg-stone-900 rounded-2xl border border-stone-800 space-y-4 text-center animate-in fade-in">
            <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">
              ⚡ 4-Second Speed Blitz
            </span>
            <div className="p-4 bg-stone-950 rounded-xl text-2xl font-japanese font-extrabold text-white">
              {exp.formats.speedRecognition.targetWord}
            </div>
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
              {[exp.formats.speedRecognition.targetWord, ...exp.formats.speedRecognition.distractors.slice(0, 3)].map((d, i) => (
                <button
                  key={i}
                  onClick={() => speakJapanese(d)}
                  className="p-3 bg-stone-950 hover:bg-stone-800 border border-stone-800 rounded-xl font-japanese font-bold text-white text-sm cursor-pointer"
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 8. Particle Discrimination Lab */}
        {activeFormatTab === 8 && (
          <div className="p-5 bg-stone-900 rounded-2xl border border-stone-800 space-y-4 text-xs animate-in fade-in">
            <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">
              MemoryOS™ Particle Contrast Lab
            </span>
            <div className="p-4 bg-stone-950 rounded-xl text-lg font-japanese font-bold text-white">
              {exp.formats.particleDiscrimination.sentenceWithBlank}
            </div>
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-mono font-bold rounded-lg border border-emerald-500/40">
                সঠিক: {exp.formats.particleDiscrimination.correctParticle}
              </span>
              <span className="px-3 py-1 bg-red-500/20 text-red-300 font-mono font-bold rounded-lg border border-red-500/40">
                ভুল: {exp.formats.particleDiscrimination.wrongParticle}
              </span>
            </div>
            <p className="text-stone-300 font-sans leading-relaxed">
              {exp.formats.particleDiscrimination.whyCorrectBn}
            </p>
          </div>
        )}

        {/* 9. Keigo Politeness Transformer */}
        {activeFormatTab === 9 && (
          <div className="p-5 bg-stone-900 rounded-2xl border border-stone-800 space-y-3 text-xs animate-in fade-in">
            <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">
              4-Tier Politeness Progression
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-japanese">
              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
                <span className="text-[10px] text-stone-500 font-mono block">1. 辞書形 (Plain / Casual)</span>
                <strong className="text-white text-sm">{exp.formats.keigoTransformation.plainForm}</strong>
              </div>
              <div className="p-3 bg-stone-950 rounded-xl border border-stone-800">
                <span className="text-[10px] text-stone-500 font-mono block">2. 丁寧語 (Teinei / Polite)</span>
                <strong className="text-white text-sm">{exp.formats.keigoTransformation.teineigo}</strong>
              </div>
              <div className="p-3 bg-stone-950 rounded-xl border border-amber-900/50">
                <span className="text-[10px] text-amber-400 font-mono block">3. 尊敬語 (Sonkeigo / Respect)</span>
                <strong className="text-amber-300 text-sm">{exp.formats.keigoTransformation.sonkeigo}</strong>
              </div>
              <div className="p-3 bg-stone-950 rounded-xl border border-emerald-900/50">
                <span className="text-[10px] text-emerald-400 font-mono block">4. 謙譲語 (Kenjougo / Humble)</span>
                <strong className="text-emerald-300 text-sm">{exp.formats.keigoTransformation.kenjougo}</strong>
              </div>
            </div>
          </div>
        )}

        {/* 10. Native Listening Audio */}
        {activeFormatTab === 10 && (
          <div className="p-5 bg-stone-900 rounded-2xl border border-stone-800 space-y-4 text-xs animate-in fade-in">
            <span className="text-[10px] font-mono text-stone-400 uppercase font-bold">
              Tokyo Audio Transcript
            </span>
            <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-2 font-japanese text-sm text-white">
              {exp.formats.nativeListening.audioTranscriptJa}
            </div>
            <button
              onClick={() => speakJapanese(exp.formats.nativeListening.audioTranscriptJa)}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-red-400" />
              <span>Listen to Conversation</span>
            </button>
            <div className="p-3 bg-stone-950 rounded-xl space-y-1 font-sans">
              <strong className="text-amber-400 block">প্রশ্ন: {exp.formats.nativeListening.questionBn}</strong>
              <div className="text-emerald-300">উত্তর: {exp.formats.nativeListening.answerBn}</div>
            </div>
          </div>
        )}

        {/* 11. Cultural Nuance & Tokyo Life */}
        {activeFormatTab === 11 && (
          <div className="p-5 bg-stone-900 rounded-2xl border border-stone-800 space-y-3 text-xs animate-in fade-in">
            <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">Tokyo Survival & Etiquette</span>
            <div className="p-3.5 bg-stone-950 rounded-xl text-stone-300 font-sans space-y-1">
              <strong className="text-white block">🇯🇵 টোকিও জীবনের বাস্তব প্রয়োগ:</strong>
              <p>{exp.formats.culturalContext.tokyoLifeInsight}</p>
            </div>
            <div className="p-3.5 bg-stone-950 rounded-xl text-stone-300 font-sans space-y-1">
              <strong className="text-amber-400 block">⚠️ শিষ্টাচার ও নিয়ম:</strong>
              <p>{exp.formats.culturalContext.etiquetteRuleBn}</p>
            </div>
          </div>
        )}

        {/* 12. Radical & Stroke Order */}
        {activeFormatTab === 12 && (
          <div className="p-5 bg-stone-900 rounded-2xl border border-stone-800 space-y-3 text-xs animate-in fade-in">
            <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">Kanji Anatomy</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-stone-950 rounded-xl">
                <span className="text-[10px] text-stone-500 block font-mono">Radical (部首)</span>
                <strong className="text-white text-lg font-japanese">{exp.formats.kanjiDecomposition.radical}</strong>
              </div>
              <div className="p-3 bg-stone-950 rounded-xl">
                <span className="text-[10px] text-stone-500 block font-mono">Meaning</span>
                <strong className="text-stone-300 text-xs">{exp.formats.kanjiDecomposition.radicalMeaning}</strong>
              </div>
              <div className="p-3 bg-stone-950 rounded-xl">
                <span className="text-[10px] text-stone-500 block font-mono">Total Strokes</span>
                <strong className="text-amber-400 text-lg font-mono">{exp.formats.kanjiDecomposition.strokeCount}</strong>
              </div>
            </div>
            <div className="p-3 bg-stone-950 rounded-xl text-stone-400 font-japanese text-xs">
              <strong>স্ট্রোক নিয়ম: </strong>{exp.formats.kanjiDecomposition.strokeHint}
            </div>
          </div>
        )}

        {/* 13. Sentence Scramble Puzzle */}
        {activeFormatTab === 13 && (
          <div className="p-5 bg-stone-900 rounded-2xl border border-stone-800 space-y-4 text-xs animate-in fade-in">
            <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">
              Tile Reordering Puzzle
            </span>
            <div className="flex flex-wrap gap-2">
              {exp.formats.sentenceScramble.shuffledTiles.map((tile, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedScramble([...selectedScramble, tile])}
                  className="px-3.5 py-2 bg-stone-950 hover:bg-stone-800 border border-stone-700 text-white font-japanese text-xs font-bold rounded-xl cursor-pointer"
                >
                  {tile}
                </button>
              ))}
            </div>
            {selectedScramble.length > 0 && (
              <div className="p-3 bg-stone-950 rounded-xl flex items-center justify-between">
                <span className="text-white font-japanese font-bold">{selectedScramble.join(' ')}</span>
                <button
                  onClick={() => setSelectedScramble([])}
                  className="text-[10px] text-red-400 font-mono hover:underline cursor-pointer"
                >
                  Reset
                </button>
              </div>
            )}
            <div className="text-stone-400 text-xs">
              পূর্ণ বাক্য: <span className="text-white font-japanese font-bold">{exp.formats.sentenceScramble.fullSentenceJa}</span> ({exp.formats.sentenceScramble.translationBn})
            </div>
          </div>
        )}

        {/* 14. Collocation & Phrasing */}
        {activeFormatTab === 14 && (
          <div className="p-5 bg-stone-900 rounded-2xl border border-stone-800 space-y-3 text-xs animate-in fade-in">
            <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">Natural Collocation</span>
            <div className="p-4 bg-stone-950 rounded-xl space-y-1 font-japanese">
              <strong className="text-white text-base block">{exp.formats.collocationMatch.naturalPair}</strong>
              <span className="text-stone-400 text-xs font-sans block">{exp.formats.collocationMatch.meaningBn}</span>
            </div>
            <div className="p-3 bg-amber-950/30 rounded-xl text-amber-300 text-xs border border-amber-900/40">
              ⚠️ {exp.formats.collocationMatch.unnaturalPairWarning}
            </div>
          </div>
        )}

        {/* 15. Ghost Mode Error Spotter */}
        {activeFormatTab === 15 && (
          <div className="p-5 bg-stone-900 rounded-2xl border border-stone-800 space-y-4 text-xs animate-in fade-in">
            <span className="text-[10px] font-mono text-red-400 uppercase font-bold flex items-center space-x-1">
              <Flame className="w-3.5 h-3.5" />
              <span>MemoryOS™ Error Spotter Challenge</span>
            </span>
            <div className="p-4 bg-stone-950 rounded-xl border border-red-900/50 space-y-1">
              <span className="text-[10px] text-stone-500 uppercase block font-mono">ভুল বাক্য (Spot the bug):</span>
              <strong className="text-red-300 font-japanese text-sm block">{exp.formats.errorSpotter.flawedSentenceJa}</strong>
            </div>

            {!errorSpotterFixed ? (
              <button
                onClick={() => setErrorSpotterFixed(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Reveal Correction & Particle Logic
              </button>
            ) : (
              <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-800/80 space-y-2 animate-in fade-in">
                <span className="text-[10px] text-emerald-400 uppercase block font-mono font-bold">✓ সঠিক বাক্য:</span>
                <strong className="text-white font-japanese text-sm block">{exp.formats.errorSpotter.correctedSentenceJa}</strong>
                <p className="text-stone-300 text-xs font-sans mt-1">{exp.formats.errorSpotter.errorReasonBn}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

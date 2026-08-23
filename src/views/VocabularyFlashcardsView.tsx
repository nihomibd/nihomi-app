import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Bookmark,
  BookmarkCheck,
  Volume2,
  RotateCw,
  Sparkles,
  CheckCircle2,
  Trash2,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Search,
  Download,
  Upload,
  X,
  Zap,
  Check,
  Clock,
  Flame,
  Brain,
  AlertCircle
} from 'lucide-react';
import { speakJapanese } from '../lib/tts.js';
import { formatApiUrl } from '../lib/api.js';
import {
  getSrsState,
  saveSrsItemReview,
  SrsRating,
  SrsItemState,
  getStageInfo,
  isItemDue,
  getDueItemsCount
} from '../lib/srs.js';

export interface FlashcardItem {
  id: string;
  kanji: string;
  reading: string;
  romaji: string;
  english: string;
  bangla: string;
  exampleSentence?: string;
  notes?: string;
  mastered?: boolean;
}

export interface VocabularyDeck {
  id: string;
  title: string;
  level: string;
  description: string;
  color: string;
  cards: FlashcardItem[];
}

const DEFAULT_DECKS: VocabularyDeck[] = [
  {
    id: 'deck-n5-core',
    title: 'JLPT N5 Core Essentials',
    level: 'N5',
    description: 'Crucial verbs, adjectives, and greetings required for Minna no Nihongo Lesson 1-10.',
    color: 'from-red-600 to-rose-600',
    cards: [
      {
        id: 'c-1',
        kanji: '日本語',
        reading: 'にほんご',
        romaji: 'nihongo',
        english: 'Japanese language',
        bangla: 'জাপানি ভাষা',
        exampleSentence: '日本語の勉強は楽しいです。',
        notes: 'Combine 日本 (Japan) + 語 (Language)'
      },
      {
        id: 'c-2',
        kanji: '食べる',
        reading: 'たべる',
        romaji: 'taberu',
        english: 'To eat',
        bangla: 'খাওয়া',
        exampleSentence: 'ご飯を食べます。',
        notes: 'Group 2 (Ichidan) verb: tabemasu, tabete'
      },
      {
        id: 'c-3',
        kanji: '行く',
        reading: 'いく',
        romaji: 'iku',
        english: 'To go',
        bangla: 'যাওয়া',
        exampleSentence: '明日、学校へ行きます。',
        notes: 'Special te-form exception: itte (行って)'
      },
      {
        id: 'c-4',
        kanji: '友達',
        reading: 'ともだち',
        romaji: 'tomodachi',
        english: 'Friend',
        bangla: 'বন্ধু',
        exampleSentence: '友達と遊びます。',
        notes: 'Can refer to singular or plural friends'
      },
      {
        id: 'c-5',
        kanji: '美味しい',
        reading: 'おいしい',
        romaji: 'oishii',
        english: 'Delicious / Tasty',
        bangla: 'সুস্বাদু',
        exampleSentence: 'このラーメンは美味しいです。',
        notes: 'i-Adjective: oishikunai in negative'
      }
    ]
  },
  {
    id: 'deck-tokyo-baito',
    title: 'Tokyo Convenience & Baito Survival',
    level: 'N4',
    description: 'Real-world customer service expressions, register dialogues, and payment terms.',
    color: 'from-amber-600 to-orange-600',
    cards: [
      {
        id: 'b-1',
        kanji: 'いらっしゃいませ',
        reading: 'いらっしゃいませ',
        romaji: 'Irasshaimase',
        english: 'Welcome to the store',
        bangla: 'স্বাগতম (দোকানে)',
        exampleSentence: 'いらっしゃいませ、何名様ですか。',
        notes: 'Standard greeting upon customer arrival'
      },
      {
        id: 'b-2',
        kanji: '少々お待ちください',
        reading: 'しょうしょうおまちください',
        romaji: 'Shoushou omachi kudasai',
        english: 'Please wait a brief moment',
        bangla: 'অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন',
        exampleSentence: 'ただいま確認しますので、少々お待ちください。',
        notes: 'Polite Keigo version of ちょっと待ってください'
      },
      {
        id: 'b-3',
        kanji: '袋',
        reading: 'ふくろ',
        romaji: 'fukuro',
        english: 'Shopping bag',
        bangla: 'শপিং ব্যাগ / থলে',
        exampleSentence: 'レジ袋はご利用ですか。',
        notes: 'Common question at checkout'
      },
      {
        id: 'b-4',
        kanji: 'お会計',
        reading: 'おかいけい',
        romaji: 'okaikei',
        english: 'Bill / Payment checkout',
        bangla: 'বিল / পেমেন্ট',
        exampleSentence: 'お会計は2,000円になります。',
        notes: 'Polite prefix お applied to 会計'
      }
    ]
  }
];

interface VocabularyFlashcardsViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const VocabularyFlashcardsView: React.FC<VocabularyFlashcardsViewProps> = ({ onNavigate }) => {
  const [decks, setDecks] = useState<VocabularyDeck[]>(() => {
    try {
      const raw = localStorage.getItem('nihomi_custom_decks_v1');
      return raw ? JSON.parse(raw) : DEFAULT_DECKS;
    } catch {
      return DEFAULT_DECKS;
    }
  });

  const [pinnedCardIds, setPinnedCardIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('nihomi_pinned_vocabulary_v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // SRS State for scheduled interval reviews
  const [srsDeck, setSrsDeck] = useState<Record<string, SrsItemState>>(() => getSrsState());
  const [showDueOnly, setShowDueOnly] = useState<boolean>(false);
  const [lastReviewFeedback, setLastReviewFeedback] = useState<string | null>(null);

  const [activeDeckId, setActiveDeckId] = useState<string | null>(null);
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);

  // Modals
  const [isCreateDeckModalOpen, setIsCreateDeckModalOpen] = useState(false);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);

  // Form states
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [newDeckLevel, setNewDeckLevel] = useState('N5');
  const [newDeckDesc, setNewDeckDesc] = useState('');

  const [newCardKanji, setNewCardKanji] = useState('');
  const [newCardReading, setNewCardReading] = useState('');
  const [newCardRomaji, setNewCardRomaji] = useState('');
  const [newCardEnglish, setNewCardEnglish] = useState('');
  const [newCardBangla, setNewCardBangla] = useState('');
  const [newCardSentence, setNewCardSentence] = useState('');
  const [newCardNotes, setNewCardNotes] = useState('');

  // Persist Decks
  const saveDecks = (updatedDecks: VocabularyDeck[]) => {
    setDecks(updatedDecks);
    try {
      localStorage.setItem('nihomi_custom_decks_v1', JSON.stringify(updatedDecks));
    } catch {}
  };

  // Sync published curriculum decks from Content Engine
  useEffect(() => {
    async function loadPublishedDecks() {
      try {
        const res = await fetch(formatApiUrl('/api/content/published'));
        if (!res.ok) return;
        const data = await res.json();
        if (!data.lessons || !Array.isArray(data.lessons)) return;

        const publishedDecks: VocabularyDeck[] = data.lessons
          .filter((l: any) => l.vocabulary && l.vocabulary.length > 0)
          .map((l: any) => ({
            id: `deck-pub-${l.id}`,
            title: `${l.level} • ${l.title}`,
            level: l.level || 'N5',
            description: `Published curriculum deck extracted from "${l.title}". Includes ${l.vocabulary.length} vocabulary terms with SRS tracking.`,
            color: 'from-amber-600 to-red-700',
            cards: l.vocabulary.map((v: any, idx: number) => ({
              id: v.id || `card-pub-${l.id}-${idx}`,
              kanji: v.japanese || '',
              reading: v.furigana || '',
              romaji: v.romaji || '',
              english: v.english || '',
              bangla: v.banglaMeaning || '',
              exampleSentence: v.exampleSentenceJa || '',
              notes: v.notes || (v.partOfSpeech ? `Part of speech: ${v.partOfSpeech}` : undefined)
            }))
          }));

        if (publishedDecks.length > 0) {
          setDecks((prev) => {
            const existingIds = new Set(prev.map((d) => d.id));
            const newDecks = publishedDecks.filter((pd) => !existingIds.has(pd.id));
            return newDecks.length > 0 ? [...prev, ...newDecks] : prev;
          });
        }
      } catch (err) {
        console.warn('[VocabularyFlashcards] Failed to load published decks:', err);
      }
    }
    loadPublishedDecks();
  }, []);

  const togglePin = (cardId: string) => {
    setPinnedCardIds((prev) => {
      const next = prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId];
      try {
        localStorage.setItem('nihomi_pinned_vocabulary_v1', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const activeDeck = decks.find((d) => d.id === activeDeckId) || decks[0];

  const baseCards = showPinnedOnly
    ? decks.flatMap((d) => d.cards).filter((c) => pinnedCardIds.includes(c.id))
    : activeDeck?.cards || [];

  const cardsToStudy = showDueOnly
    ? baseCards.filter((c) => {
        const itemState = srsDeck[c.id];
        return isItemDue(itemState);
      })
    : baseCards;

  const dueItemsCount = baseCards.filter((c) => isItemDue(srsDeck[c.id])).length;

  const handleSrsReview = (cardId: string, rating: SrsRating) => {
    const updated = saveSrsItemReview(cardId, rating, srsDeck[cardId]);
    setSrsDeck((prev) => ({ ...prev, [cardId]: updated }));
    const stage = getStageInfo(updated.stage);

    setLastReviewFeedback(`Scheduled in ${updated.intervalDays} day(s) &bull; ${stage.label}`);
    setTimeout(() => setLastReviewFeedback(null), 2500);

    setIsFlipped(false);
    if (currentCardIndex < cardsToStudy.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      // Completed drill
      setIsStudyMode(false);
      setCurrentCardIndex(0);
    }
  };

  const handleCreateDeck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeckTitle.trim()) return;

    const newDeck: VocabularyDeck = {
      id: `deck-${Date.now()}`,
      title: newDeckTitle.trim(),
      level: newDeckLevel,
      description: newDeckDesc.trim() || 'Custom user created Japanese deck.',
      color: 'from-purple-600 to-indigo-600',
      cards: []
    };

    saveDecks([...decks, newDeck]);
    setActiveDeckId(newDeck.id);
    setIsCreateDeckModalOpen(false);
    setNewDeckTitle('');
    setNewDeckDesc('');
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardKanji.trim() || !newCardEnglish.trim()) return;

    const newCard: FlashcardItem = {
      id: `c-${Date.now()}`,
      kanji: newCardKanji.trim(),
      reading: newCardReading.trim() || newCardKanji.trim(),
      romaji: newCardRomaji.trim(),
      english: newCardEnglish.trim(),
      bangla: newCardBangla.trim() || newCardEnglish.trim(),
      exampleSentence: newCardSentence.trim(),
      notes: newCardNotes.trim()
    };

    const updated = decks.map((d) => {
      if (d.id === activeDeck.id) {
        return { ...d, cards: [...d.cards, newCard] };
      }
      return d;
    });

    saveDecks(updated);
    setIsAddCardModalOpen(false);
    setNewCardKanji('');
    setNewCardReading('');
    setNewCardRomaji('');
    setNewCardEnglish('');
    setNewCardBangla('');
    setNewCardSentence('');
    setNewCardNotes('');
  };

  const handleDeleteDeck = (deckId: string) => {
    if (decks.length <= 1) return;
    const filtered = decks.filter((d) => d.id !== deckId);
    saveDecks(filtered);
    setActiveDeckId(filtered[0]?.id || null);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(decks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Nihomi_Vocabulary_Decks_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div id="vocabulary-flashcards-view" className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Bento Hero Header */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-red-50 text-red-700 border border-red-200">
                Custom Vocabulary Decks & Flashcards
              </span>
              <span className="text-xs text-stone-500 font-semibold">
                &bull; 3D Flip Spaced Repetition Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
              Vocabulary Deck Studio & Pinned Bank
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
              Create custom decks, pin tricky words to your local storage shelf, and build lasting muscle memory through 3D flip card drills.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowPinnedOnly(!showPinnedOnly)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                showPinnedOnly
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Pinned Words ({pinnedCardIds.length})</span>
            </button>

            <button
              onClick={() => setIsCreateDeckModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Deck</span>
            </button>
          </div>
        </div>

        {/* Deck Selector Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {decks.map((deck) => {
            const isSelected = activeDeck.id === deck.id && !showPinnedOnly;
            return (
              <div
                key={deck.id}
                onClick={() => {
                  setActiveDeckId(deck.id);
                  setShowPinnedOnly(false);
                  setIsStudyMode(false);
                }}
                className={`p-5 rounded-3xl border transition cursor-pointer flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'bg-white border-2 border-red-600 shadow-md ring-4 ring-red-50'
                    : 'bg-white border-stone-200 hover:border-stone-400 shadow-xs'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700 text-xs font-mono font-bold">
                      JLPT {deck.level}
                    </span>
                    <span className="text-xs font-bold text-stone-400">{deck.cards.length} Cards</span>
                  </div>
                  <h3 className="text-lg font-bold font-serif text-stone-900">{deck.title}</h3>
                  <p className="text-xs text-stone-500 line-clamp-2">{deck.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDeckId(deck.id);
                      setShowPinnedOnly(false);
                      setIsStudyMode(true);
                      setCurrentCardIndex(0);
                      setIsFlipped(false);
                    }}
                    className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Start Study Mode</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {decks.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDeck(deck.id);
                      }}
                      className="text-stone-300 hover:text-rose-600 p-1 transition"
                      title="Delete deck"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Study Mode Stage or Card Table */}
        {isStudyMode && cardsToStudy.length > 0 ? (
          /* 3D Flip Card Interactive Study Stage */
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 flex flex-col items-center">
            <div className="w-full max-w-xl flex items-center justify-between text-xs font-bold text-stone-500">
              <button
                onClick={() => setIsStudyMode(false)}
                className="hover:text-stone-900 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Exit Study Mode</span>
              </button>
              <span>
                Card {currentCardIndex + 1} of {cardsToStudy.length}
              </span>
            </div>

            {/* 3D Flip Card */}
            {(() => {
              const card = cardsToStudy[currentCardIndex];
              const isPinned = pinnedCardIds.includes(card.id);
              const itemSrs = srsDeck[card.id];
              const stageInfo = getStageInfo(itemSrs?.stage || 'apprentice');
              const isDue = isItemDue(itemSrs);

              return (
                <div className="w-full max-w-xl space-y-4">
                  {lastReviewFeedback && (
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold text-center animate-in fade-in flex items-center justify-center gap-1.5 shadow-xs">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span dangerouslySetInnerHTML={{ __html: lastReviewFeedback }} />
                    </div>
                  )}

                  <div
                    className="w-full h-84 perspective cursor-pointer select-none"
                    onClick={() => setIsFlipped(!isFlipped)}
                  >
                    <div
                      className={`relative w-full h-full rounded-3xl shadow-xl transition-transform duration-500 preserve-3d border border-stone-200 ${
                        isFlipped ? 'rotate-y-180 bg-stone-900 text-white' : 'bg-gradient-to-br from-white to-stone-50 text-stone-900'
                      }`}
                    >
                      {/* Front Face */}
                      <div className="absolute inset-0 backface-hidden p-7 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-red-600">
                              Front &bull; Tap to Flip
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${stageInfo.bgColor} ${stageInfo.textColor} ${stageInfo.borderColor}`}
                            >
                              SRS: {stageInfo.label}
                            </span>
                            {isDue && (
                              <span className="px-1.5 py-0.5 rounded-md bg-red-100 text-red-700 text-[10px] font-extrabold flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Due
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                speakJapanese(card.kanji);
                              }}
                              className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition"
                              title="Listen"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePin(card.id);
                              }}
                              className={`p-2 rounded-xl border transition ${
                                isPinned ? 'bg-amber-500 text-white border-amber-600' : 'bg-white text-stone-400 border-stone-200'
                              }`}
                            >
                              <Bookmark className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="text-center space-y-2">
                          <h2 className="text-5xl sm:text-6xl font-bold font-serif text-stone-900">
                            {card.kanji}
                          </h2>
                          <p className="text-sm font-medium text-stone-500">{card.reading}</p>
                        </div>

                        <div className="text-center text-[11px] text-stone-400 font-semibold flex items-center justify-center gap-1">
                          <span>Click to reveal English / Bengali & Spaced Repetition Ratings</span>
                        </div>
                      </div>

                      {/* Back Face */}
                      <div className="absolute inset-0 backface-hidden rotate-y-180 p-7 flex flex-col justify-between text-white">
                        <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                              Back &bull; Meanings
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${stageInfo.bgColor} ${stageInfo.textColor} ${stageInfo.borderColor}`}
                            >
                              {stageInfo.label} &bull; {itemSrs?.repetition || 0} reps
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              speakJapanese(card.kanji);
                            }}
                            className="p-1.5 text-stone-300 hover:text-white"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-2.5 text-center">
                          <p className="text-2xl font-bold font-serif text-white">{card.english}</p>
                          <p className="text-lg font-bold text-red-400">{card.bangla}</p>
                          <p className="text-xs font-mono text-stone-400">{card.romaji}</p>

                          {card.exampleSentence && (
                            <div className="p-2.5 rounded-xl bg-stone-800/80 border border-stone-700 text-xs text-stone-300 text-left">
                              <span className="font-bold text-stone-400 block text-[10px]">Example:</span>
                              {card.exampleSentence}
                            </div>
                          )}
                        </div>

                        <div className="text-center text-[11px] text-stone-400">
                          {card.notes || 'Rate your memory recall below to schedule next review'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SRS Review Rating Buttons when flipped */}
                  {isFlipped ? (
                    <div className="space-y-2 p-3 bg-stone-900 text-white rounded-2xl border border-stone-800 animate-in fade-in">
                      <div className="flex items-center justify-between text-[11px] font-bold text-stone-400 px-1">
                        <span>Spaced Repetition (SRS) Accuracy Rating:</span>
                        <span className="text-amber-400 font-mono">Select recall speed</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <button
                          onClick={() => handleSrsReview(card.id, 'again')}
                          className="py-2.5 px-2 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200 font-bold text-xs flex flex-col items-center gap-0.5 cursor-pointer transition"
                        >
                          <span>Again</span>
                          <span className="text-[10px] text-red-400 font-mono">&lt; 10 min</span>
                        </button>
                        <button
                          onClick={() => handleSrsReview(card.id, 'hard')}
                          className="py-2.5 px-2 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-800 text-amber-200 font-bold text-xs flex flex-col items-center gap-0.5 cursor-pointer transition"
                        >
                          <span>Hard</span>
                          <span className="text-[10px] text-amber-400 font-mono">1 day</span>
                        </button>
                        <button
                          onClick={() => handleSrsReview(card.id, 'good')}
                          className="py-2.5 px-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-200 font-bold text-xs flex flex-col items-center gap-0.5 cursor-pointer transition"
                        >
                          <span>Good</span>
                          <span className="text-[10px] text-emerald-400 font-mono">3-6 days</span>
                        </button>
                        <button
                          onClick={() => handleSrsReview(card.id, 'easy')}
                          className="py-2.5 px-2 rounded-xl bg-blue-950/80 hover:bg-blue-900 border border-blue-800 text-blue-200 font-bold text-xs flex flex-col items-center gap-0.5 cursor-pointer transition"
                        >
                          <span>Easy</span>
                          <span className="text-[10px] text-blue-400 font-mono">7+ days</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-stone-500 font-medium px-2">
                      <span>💡 Tap the card to reveal translation and rate your SRS recall.</span>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Navigation Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setIsFlipped(false);
                  setCurrentCardIndex((prev) => (prev > 0 ? prev - 1 : cardsToStudy.length - 1));
                }}
                className="px-5 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={() => {
                  setIsFlipped(false);
                  setCurrentCardIndex((prev) => (prev < cardsToStudy.length - 1 ? prev + 1 : 0));
                }}
                className="px-6 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/30 flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>Next Card</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Cards Grid & Management Table */
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-lg font-bold font-serif text-stone-900">
                  {showPinnedOnly ? 'Pinned Vocabulary Shelf' : activeDeck.title} ({cardsToStudy.length} cards)
                </h3>
                <p className="text-xs text-stone-500">
                  Manage individual vocabulary terms, pronunciation audio, and notes.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowDueOnly(!showDueOnly)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                    showDueOnly
                      ? 'bg-amber-500 text-stone-950 border-amber-600 font-extrabold shadow-sm'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                  }`}
                  title="Filter vocabulary items scheduled for review today"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Due Today ({dueItemsCount})</span>
                </button>

                {!showPinnedOnly && (
                  <button
                    onClick={() => setIsAddCardModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Word Card</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsStudyMode(true);
                    setCurrentCardIndex(0);
                    setIsFlipped(false);
                  }}
                  disabled={cardsToStudy.length === 0}
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Start Drill ({cardsToStudy.length})</span>
                </button>
              </div>
            </div>

            {/* Cards List */}
            {cardsToStudy.length === 0 ? (
              <div className="py-12 text-center text-stone-400 space-y-2">
                <BookOpen className="w-8 h-8 mx-auto text-stone-300" />
                <p className="text-xs font-semibold">
                  {showDueOnly ? 'No vocabulary cards due for review today! Great job staying caught up.' : 'No vocabulary cards in this deck yet.'}
                </p>
                {!showPinnedOnly && !showDueOnly && (
                  <button
                    onClick={() => setIsAddCardModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
                  >
                    Add Your First Word
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {cardsToStudy.map((card) => {
                  const isPinned = pinnedCardIds.includes(card.id);
                  const itemSrs = srsDeck[card.id];
                  const stageInfo = getStageInfo(itemSrs?.stage || 'apprentice');
                  const isDue = isItemDue(itemSrs);

                  return (
                    <div
                      key={card.id}
                      className="p-4 rounded-2xl bg-stone-50 border border-stone-200 hover:border-stone-300 transition space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-baseline justify-between">
                          <span className="text-2xl font-bold font-serif text-stone-900">{card.kanji}</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => speakJapanese(card.kanji)}
                              className="p-1.5 text-stone-500 hover:text-red-600 rounded-lg hover:bg-stone-200"
                              title="Listen"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => togglePin(card.id)}
                              className={`p-1.5 rounded-lg border transition ${
                                isPinned
                                  ? 'bg-amber-500 text-white border-amber-600'
                                  : 'bg-white text-stone-400 border-stone-200 hover:text-amber-600'
                              }`}
                              title="Pin to Shelf"
                            >
                              <Bookmark className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-red-600 font-sans font-medium">{card.reading}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase border ${stageInfo.bgColor} ${stageInfo.textColor} ${stageInfo.borderColor}`}
                          >
                            {stageInfo.label}
                          </span>
                          {isDue && (
                            <span className="px-1 py-0.2 rounded bg-red-100 text-red-700 text-[9px] font-bold">
                              Due
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-bold text-stone-800">{card.english}</p>
                        <p className="text-xs text-stone-500">{card.bangla}</p>
                      </div>

                      {card.exampleSentence && (
                        <p className="text-[11px] text-stone-400 font-serif line-clamp-1 border-t border-stone-200 pt-1">
                          {card.exampleSentence}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Create Deck Modal */}
        {isCreateDeckModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="text-lg font-bold font-serif text-stone-900">Create Custom Vocabulary Deck</h3>
                <button onClick={() => setIsCreateDeckModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateDeck} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Deck Title</label>
                  <input
                    type="text"
                    required
                    value={newDeckTitle}
                    onChange={(e) => setNewDeckTitle(e.target.value)}
                    placeholder="e.g. JLPT N5 Daily Verbs & Food"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-sans text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Target JLPT Level</label>
                  <select
                    value={newDeckLevel}
                    onChange={(e) => setNewDeckLevel(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 font-sans"
                  >
                    <option value="N5">JLPT N5 (Foundations)</option>
                    <option value="N4">JLPT N4 (Elementary)</option>
                    <option value="N3">JLPT N3 (Intermediate)</option>
                    <option value="Work">Business & Baito Japanese</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newDeckDesc}
                    onChange={(e) => setNewDeckDesc(e.target.value)}
                    placeholder="Brief description of what this deck covers..."
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 font-sans"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateDeckModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-xs"
                  >
                    Save Deck
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Card Modal */}
        {isAddCardModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="text-lg font-bold font-serif text-stone-900">
                  Add Word to "{activeDeck.title}"
                </h3>
                <button onClick={() => setIsAddCardModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddCard} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Japanese Kanji / Word *</label>
                    <input
                      type="text"
                      required
                      value={newCardKanji}
                      onChange={(e) => setNewCardKanji(e.target.value)}
                      placeholder="e.g. 食べる"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-serif text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Hiragana Reading</label>
                    <input
                      type="text"
                      value={newCardReading}
                      onChange={(e) => setNewCardReading(e.target.value)}
                      placeholder="e.g. たべる"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-serif text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">English Meaning *</label>
                    <input
                      type="text"
                      required
                      value={newCardEnglish}
                      onChange={(e) => setNewCardEnglish(e.target.value)}
                      placeholder="e.g. To eat"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">বাংলা অর্থ (Bengali)</label>
                    <input
                      type="text"
                      value={newCardBangla}
                      onChange={(e) => setNewCardBangla(e.target.value)}
                      placeholder="e.g. খাওয়া"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Romaji</label>
                  <input
                    type="text"
                    value={newCardRomaji}
                    onChange={(e) => setNewCardRomaji(e.target.value)}
                    placeholder="e.g. taberu"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Example Sentence</label>
                  <input
                    type="text"
                    value={newCardSentence}
                    onChange={(e) => setNewCardSentence(e.target.value)}
                    placeholder="e.g. 朝ご飯を食べます。"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 font-serif"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Memory Notes / Mnemonics</label>
                  <input
                    type="text"
                    value={newCardNotes}
                    onChange={(e) => setNewCardNotes(e.target.value)}
                    placeholder="e.g. Ichidan verb; drop ru and add masu"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 font-sans"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setIsAddCardModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-xs"
                  >
                    Add Card
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  X,
  Save,
  Tag,
  Check,
  Share2,
  Sparkles,
  BookOpen
} from 'lucide-react';

export interface LessonNote {
  id: string;
  lessonId: string;
  category: 'Grammar' | 'Vocabulary' | 'Kanji' | 'Particle Tip' | 'General';
  content: string;
  createdAt: string;
}

interface LessonQuickNotesProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId: string;
  lessonTitle: string;
}

export const LessonQuickNotes: React.FC<LessonQuickNotesProps> = ({
  isOpen,
  onClose,
  lessonId,
  lessonTitle
}) => {
  const storageKey = `nihomi_lesson_notes_${lessonId}`;

  const [notes, setNotes] = useState<LessonNote[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'sample-1',
        lessonId,
        category: 'Particle Tip',
        content: 'Remember: は (wa) marks the overall conversational topic, whereas が (ga) emphasizes specific new subject information.',
        createdAt: new Date().toISOString()
      }
    ];
  });

  const [newContent, setNewContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<LessonNote['category']>('General');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to save notes to storage:', e);
    }
  }, [notes, storageKey]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const newNote: LessonNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      lessonId,
      category: selectedCategory,
      content: newContent.trim(),
      createdAt: new Date().toISOString()
    };

    setNotes([newNote, ...notes]);
    setNewContent('');
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const handleCopyNote = (note: LessonNote) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`[${note.category}] ${note.content}`);
      setCopiedId(note.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const categories: LessonNote['category'][] = [
    'General',
    'Grammar',
    'Vocabulary',
    'Kanji',
    'Particle Tip'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-stone-900 shadow-2xl flex flex-col border-l border-stone-200 dark:border-stone-800 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/70 dark:bg-stone-900">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-red-600/10 text-red-600 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-white">Quick Study Notes</h3>
                <p className="text-xs text-stone-500 truncate max-w-[200px]">{lessonTitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Note Form */}
          <div className="p-5 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
            <form onSubmit={handleAddNote} className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-red-600" />
                  <span>Category</span>
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as LessonNote['category'])}
                  className="text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-2.5 py-1 text-stone-800 dark:text-stone-200"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Write your personal study note, mnemonic, grammar reminder..."
                rows={3}
                className="w-full text-xs p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-red-500 resize-none"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newContent.trim()}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save Note</span>
                </button>
              </div>
            </form>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-500 pb-1">
              <span className="font-bold uppercase tracking-wider text-[10px]">
                Saved Notes ({notes.length})
              </span>
              <span className="text-[10px]">Stored locally in browser</span>
            </div>

            {notes.length === 0 ? (
              <div className="text-center py-12 text-stone-400 space-y-2">
                <BookOpen className="w-8 h-8 mx-auto stroke-1" />
                <p className="text-xs">No notes saved for this lesson yet.</p>
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-2 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 text-[10px] font-bold">
                      {note.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyNote(note)}
                        className="p-1 rounded text-stone-400 hover:text-stone-700 cursor-pointer"
                        title="Copy note"
                      >
                        {copiedId === note.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1 rounded text-stone-400 hover:text-rose-600 cursor-pointer"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-stone-800 dark:text-stone-200 whitespace-pre-wrap leading-relaxed">
                    {note.content}
                  </p>
                  <p className="text-[10px] text-stone-400">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

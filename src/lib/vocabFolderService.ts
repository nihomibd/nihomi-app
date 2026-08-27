/**
 * VocabFolderService - Local & Cloud synced folder management for organizing flashcards.
 */

export interface VocabFolder {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  cardIds: string[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'nihomi_vocab_folders_v1';

const DEFAULT_FOLDERS: VocabFolder[] = [
  {
    id: 'folder-n5-verbs',
    name: 'N5 Essential Verbs (動詞)',
    emoji: '⚡',
    color: 'from-amber-500 to-orange-600',
    description: 'High-frequency verbs with te-form, nai-form, and masu-stem conjugations.',
    cardIds: ['c-2', 'c-3', 'c-8', 'c-14'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'folder-food-dining',
    name: 'Food, Dining & Izakaya (食べ物)',
    emoji: '🍱',
    color: 'from-emerald-500 to-teal-600',
    description: 'Everyday ingredients, restaurant ordering phrases, and cooking terminology.',
    cardIds: ['c-2', 'c-11', 'c-12'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'folder-work-business',
    name: 'Workplace & Baito (職場・バイト)',
    emoji: '💼',
    color: 'from-blue-500 to-indigo-600',
    description: 'Keigo polite expressions, manager greetings, and shift communication.',
    cardIds: ['c-1', 'c-4', 'c-9'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'folder-difficult-kanji',
    name: 'Hard Kanji to Review (要復習漢字)',
    emoji: '🎯',
    color: 'from-red-500 to-rose-600',
    description: 'Tricky stroke counts, similar radicals, and confusing kun-yomi readings.',
    cardIds: ['c-1', 'c-5', 'c-7'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export class VocabFolderService {
  static getFolders(): VocabFolder[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_FOLDERS));
        return DEFAULT_FOLDERS;
      }
      return JSON.parse(stored);
    } catch (err) {
      console.error('Failed to load vocab folders:', err);
      return DEFAULT_FOLDERS;
    }
  }

  static saveFolders(folders: VocabFolder[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(folders));
    } catch (err) {
      console.error('Failed to persist vocab folders:', err);
    }
  }

  static createFolder(data: {
    name: string;
    emoji?: string;
    color?: string;
    description?: string;
    cardIds?: string[];
  }): VocabFolder {
    const folders = this.getFolders();
    const newFolder: VocabFolder = {
      id: `folder-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: data.name.trim(),
      emoji: data.emoji || '📁',
      color: data.color || 'from-stone-700 to-stone-900',
      description: data.description || '',
      cardIds: data.cardIds || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    folders.push(newFolder);
    this.saveFolders(folders);
    return newFolder;
  }

  static updateFolder(
    id: string,
    updates: Partial<Omit<VocabFolder, 'id' | 'createdAt'>>
  ): VocabFolder | null {
    const folders = this.getFolders();
    const idx = folders.findIndex((f) => f.id === id);
    if (idx === -1) return null;

    folders[idx] = {
      ...folders[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveFolders(folders);
    return folders[idx];
  }

  static deleteFolder(id: string): boolean {
    const folders = this.getFolders();
    const filtered = folders.filter((f) => f.id !== id);
    if (filtered.length !== folders.length) {
      this.saveFolders(filtered);
      return true;
    }
    return false;
  }

  static toggleCardInFolder(folderId: string, cardId: string): boolean {
    const folders = this.getFolders();
    const target = folders.find((f) => f.id === folderId);
    if (!target) return false;

    const exists = target.cardIds.includes(cardId);
    if (exists) {
      target.cardIds = target.cardIds.filter((id) => id !== cardId);
    } else {
      target.cardIds.push(cardId);
    }
    target.updatedAt = new Date().toISOString();

    this.saveFolders(folders);
    return !exists;
  }

  static getFoldersForCard(cardId: string): VocabFolder[] {
    const folders = this.getFolders();
    return folders.filter((f) => f.cardIds.includes(cardId));
  }
}

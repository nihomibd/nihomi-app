// src/lib/offline/indexedDbLedger.ts
// Canonical IndexedDB Offline Ledger for NIHOMI.COM
// Implements Law 1 & Law 3: Stable Core Durability & Fail-Safe Offline Continuity

import type { LearnerKnowledgeState } from '../../core/curriculum/learnerKnowledgeState';

export interface OfflineLedgerAttempt {
  id: string;
  userId: string;
  domain: 'japanese-learning' | 'pos-simulation' | 'exam-os' | 'cv-rirekisho';
  activityId: string;
  timestamp: string;
  score: number;
  passed: boolean;
  xpEarned: number;
  evidenceData?: any;
  synced: boolean;
  syncError?: string;
}

export interface SyncBatchPayload {
  attempts: OfflineLedgerAttempt[];
  knowledgeState?: LearnerKnowledgeState;
  clientTimestamp: string;
}

export interface SyncBatchResult {
  success: boolean;
  syncedIds: string[];
  failedIds: string[];
  serverTimestamp?: string;
  message?: string;
}

const DB_NAME = 'nihomi_offline_ledger_v1';
const DB_VERSION = 1;
const STORE_KNOWLEDGE = 'knowledge_states';
const STORE_ATTEMPTS = 'offline_attempts';
const STORE_SYNC_QUEUE = 'sync_queue';

let dbInstance: IDBDatabase | null = null;
let isDbOpening = false;
let dbOpenPromise: Promise<IDBDatabase | null> | null = null;

/**
 * Checks if IndexedDB is supported and accessible in current runtime
 */
export function isIndexedDbSupported(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return 'indexedDB' in window && window.indexedDB !== null;
  } catch {
    return false;
  }
}

/**
 * Initializes and caches the IndexedDB connection singleton
 */
export async function getIndexedDb(): Promise<IDBDatabase | null> {
  if (!isIndexedDbSupported()) return null;
  if (dbInstance) return dbInstance;
  if (isDbOpening && dbOpenPromise) return dbOpenPromise;

  isDbOpening = true;
  dbOpenPromise = new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // 1. Knowledge State Store (Key: userId)
        if (!db.objectStoreNames.contains(STORE_KNOWLEDGE)) {
          db.createObjectStore(STORE_KNOWLEDGE, { keyPath: 'userId' });
        }

        // 2. Offline Attempts Store (Key: id)
        if (!db.objectStoreNames.contains(STORE_ATTEMPTS)) {
          const attemptStore = db.createObjectStore(STORE_ATTEMPTS, { keyPath: 'id' });
          attemptStore.createIndex('by_user', 'userId', { unique: false });
          attemptStore.createIndex('by_synced', 'synced', { unique: false });
          attemptStore.createIndex('by_timestamp', 'timestamp', { unique: false });
        }

        // 3. Pending Sync Queue Store (Key: auto-increment)
        if (!db.objectStoreNames.contains(STORE_SYNC_QUEUE)) {
          db.createObjectStore(STORE_SYNC_QUEUE, { keyPath: 'queueId', autoIncrement: true });
        }
      };

      request.onsuccess = () => {
        dbInstance = request.result;
        isDbOpening = false;
        resolve(dbInstance);
      };

      request.onerror = (err) => {
        console.warn('[IndexedDB] Open failed, using localStorage fallback:', err);
        isDbOpening = false;
        resolve(null);
      };
    } catch (err) {
      console.warn('[IndexedDB] Initialization exception:', err);
      isDbOpening = false;
      resolve(null);
    }
  });

  return dbOpenPromise;
}

/**
 * Saves learner knowledge state to IndexedDB with localStorage dual-write fallback
 */
export async function saveKnowledgeStateToIndexedDb(
  state: LearnerKnowledgeState,
  userId: string = 'guest'
): Promise<boolean> {
  const db = await getIndexedDb();
  if (!db) return false;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_KNOWLEDGE, 'readwrite');
      const store = tx.objectStore(STORE_KNOWLEDGE);
      const record = {
        userId,
        state,
        updatedAt: new Date().toISOString()
      };

      const req = store.put(record);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

/**
 * Loads knowledge state from IndexedDB
 */
export async function loadKnowledgeStateFromIndexedDb(
  userId: string = 'guest'
): Promise<LearnerKnowledgeState | null> {
  const db = await getIndexedDb();
  if (!db) return null;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_KNOWLEDGE, 'readonly');
      const store = tx.objectStore(STORE_KNOWLEDGE);
      const req = store.get(userId);

      req.onsuccess = () => {
        if (req.result && req.result.state) {
          resolve(req.result.state as LearnerKnowledgeState);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

/**
 * Records an attempt into the offline attempts store and enqueues for server sync
 */
export async function recordOfflineAttempt(
  attemptData: Omit<OfflineLedgerAttempt, 'id' | 'synced'>
): Promise<OfflineLedgerAttempt> {
  const id = `att_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const attempt: OfflineLedgerAttempt = {
    ...attemptData,
    id,
    synced: false
  };

  const db = await getIndexedDb();
  if (db) {
    try {
      const tx = db.transaction([STORE_ATTEMPTS, STORE_SYNC_QUEUE], 'readwrite');
      tx.objectStore(STORE_ATTEMPTS).put(attempt);
      tx.objectStore(STORE_SYNC_QUEUE).put({ attemptId: id, timestamp: attempt.timestamp });
    } catch (e) {
      console.warn('[IndexedDB] Failed to record offline attempt:', e);
    }
  }

  // Backup in localStorage queue as secondary safeguard
  try {
    if (typeof localStorage !== 'undefined') {
      const existingRaw = localStorage.getItem('nihomi_offline_attempts_queue');
      const queue: OfflineLedgerAttempt[] = existingRaw ? JSON.parse(existingRaw) : [];
      queue.push(attempt);
      // Keep at most 200 items in localStorage to stay within 5MB limit
      const trimmed = queue.slice(-200);
      localStorage.setItem('nihomi_offline_attempts_queue', JSON.stringify(trimmed));
    }
  } catch {}

  return attempt;
}

/**
 * Retrieves all pending unsynced attempts
 */
export async function getUnsyncedAttempts(): Promise<OfflineLedgerAttempt[]> {
  const db = await getIndexedDb();
  if (db) {
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_ATTEMPTS, 'readonly');
        const store = tx.objectStore(STORE_ATTEMPTS);
        const index = store.index('by_synced');
        // IDBKeyRange.only(0) or checking boolean false
        const req = index.getAll();

        req.onsuccess = () => {
          const all = (req.result || []) as OfflineLedgerAttempt[];
          const unsynced = all.filter((a) => !a.synced);
          resolve(unsynced);
        };
        req.onerror = () => resolve(getLocalStorageQueue());
      } catch {
        resolve(getLocalStorageQueue());
      }
    });
  }
  return getLocalStorageQueue();
}

function getLocalStorageQueue(): OfflineLedgerAttempt[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem('nihomi_offline_attempts_queue');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((a) => !a.synced) : [];
  } catch {
    return [];
  }
}

/**
 * Marks a list of attempts as synced in IndexedDB and localStorage
 */
export async function markAttemptsAsSynced(attemptIds: string[]): Promise<void> {
  if (!attemptIds.length) return;
  const idSet = new Set(attemptIds);

  const db = await getIndexedDb();
  if (db) {
    try {
      const tx = db.transaction([STORE_ATTEMPTS, STORE_SYNC_QUEUE], 'readwrite');
      const attemptStore = tx.objectStore(STORE_ATTEMPTS);

      for (const id of attemptIds) {
        const req = attemptStore.get(id);
        req.onsuccess = () => {
          if (req.result) {
            const updated = { ...req.result, synced: true };
            attemptStore.put(updated);
          }
        };
      }
    } catch {}
  }

  // Update localStorage queue
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem('nihomi_offline_attempts_queue');
      if (raw) {
        const queue: OfflineLedgerAttempt[] = JSON.parse(raw);
        const updated = queue.filter((a) => !idSet.has(a.id));
        localStorage.setItem('nihomi_offline_attempts_queue', JSON.stringify(updated));
      }
    }
  } catch {}
}

/**
 * Flushes all pending offline attempts to the backend /api/progress/sync-batch endpoint
 */
export async function flushSyncQueueToServer(
  token?: string,
  latestState?: LearnerKnowledgeState
): Promise<SyncBatchResult> {
  const unsynced = await getUnsyncedAttempts();
  if (!unsynced.length && !latestState) {
    return { success: true, syncedIds: [], failedIds: [] };
  }

  const authToken = token || (typeof localStorage !== 'undefined' ? localStorage.getItem('nihomi_auth_token') : null);
  if (!authToken) {
    return {
      success: false,
      syncedIds: [],
      failedIds: unsynced.map((a) => a.id),
      message: 'Authentication token not available for sync.'
    };
  }

  const payload: SyncBatchPayload = {
    attempts: unsynced,
    knowledgeState: latestState,
    clientTimestamp: new Date().toISOString()
  };

  try {
    const res = await fetch('/api/progress/sync-batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Sync batch failed with HTTP ${res.status}`);
    }

    const data: SyncBatchResult = await res.json();
    if (data.success && data.syncedIds.length > 0) {
      await markAttemptsAsSynced(data.syncedIds);
    }
    return data;
  } catch (err: any) {
    console.warn('[OfflineLedger] Batch sync failed, will retry next online event:', err?.message);
    return {
      success: false,
      syncedIds: [],
      failedIds: unsynced.map((a) => a.id),
      message: err?.message
    };
  }
}

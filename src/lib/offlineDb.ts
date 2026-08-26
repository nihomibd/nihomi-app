/**
 * IndexedDB Offline Lesson Storage Engine
 * Stores full lesson packages (grammar, vocabulary, kanji, dialogues) locally
 * ensuring uninterrupted student learning during network outages.
 */

const DB_NAME = 'NihomiOfflineDB';
const DB_VERSION = 1;
const STORE_LESSONS = 'cached_lessons';
const STORE_META = 'meta_cache';

export interface CachedLessonRecord {
  lessonId: string;
  data: any;
  cachedAt: number;
  title: string;
  level: string;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result as IDBDatabase;
      if (!db.objectStoreNames.contains(STORE_LESSONS)) {
        db.createObjectStore(STORE_LESSONS, { keyPath: 'lessonId' });
      }
      if (!db.objectStoreNames.contains(STORE_META)) {
        db.createObjectStore(STORE_META, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Cache lesson content into IndexedDB
 */
export async function cacheLessonOffline(lessonId: string, data: any, title?: string, level?: string): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_LESSONS], 'readwrite');
      const store = transaction.objectStore(STORE_LESSONS);

      const record: CachedLessonRecord = {
        lessonId,
        data,
        cachedAt: Date.now(),
        title: title || data?.lesson?.title || `Lesson ${lessonId}`,
        level: level || data?.lesson?.level || 'N5',
      };

      const request = store.put(record);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('Failed to cache lesson in IndexedDB:', error);
    return false;
  }
}

/**
 * Retrieve cached lesson from IndexedDB
 */
export async function getCachedLessonOffline(lessonId: string): Promise<CachedLessonRecord | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_LESSONS], 'readonly');
      const store = transaction.objectStore(STORE_LESSONS);
      const request = store.get(lessonId);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('Failed to read cached lesson from IndexedDB:', error);
    return null;
  }
}

/**
 * Get list of all available offline lessons
 */
export async function getAllCachedLessons(): Promise<CachedLessonRecord[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_LESSONS], 'readonly');
      const store = transaction.objectStore(STORE_LESSONS);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('Failed to retrieve all cached lessons:', error);
    return [];
  }
}

/**
 * Remove a cached lesson
 */
export async function deleteCachedLesson(lessonId: string): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_LESSONS], 'readwrite');
      const store = transaction.objectStore(STORE_LESSONS);
      const request = store.delete(lessonId);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('Failed to delete cached lesson:', error);
    return false;
  }
}

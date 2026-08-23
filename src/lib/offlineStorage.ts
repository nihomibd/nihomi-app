// Nihomi.com Offline Storage & Lesson Module Caching Engine
import { Lesson } from '../types.js';

const OFFLINE_LESSONS_KEY = 'nihomi_offline_lessons_v1';
const OFFLINE_PROGRESS_KEY = 'nihomi_offline_progress_v1';

export interface OfflineLessonData {
  lessonId: string;
  courseTitle: string;
  moduleTitle: string;
  lesson: Lesson;
  downloadedAt: string;
  sizeBytes: number;
}

export function getDownloadedLessonIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(OFFLINE_LESSONS_KEY);
    if (!raw) return [];
    const parsed: Record<string, OfflineLessonData> = JSON.parse(raw);
    return Object.keys(parsed);
  } catch {
    return [];
  }
}

export function isLessonDownloaded(lessonId: string): boolean {
  return getDownloadedLessonIds().includes(lessonId);
}

export function getOfflineLesson(lessonId: string): OfflineLessonData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(OFFLINE_LESSONS_KEY);
    if (!raw) return null;
    const parsed: Record<string, OfflineLessonData> = JSON.parse(raw);
    return parsed[lessonId] || null;
  } catch {
    return null;
  }
}

export function saveLessonOffline(
  lessonId: string,
  lesson: Lesson,
  courseTitle = 'JLPT Curriculum',
  moduleTitle = 'Japanese Core Foundations'
): OfflineLessonData {
  const data: OfflineLessonData = {
    lessonId,
    courseTitle,
    moduleTitle,
    lesson,
    downloadedAt: new Date().toISOString(),
    sizeBytes: new Blob([JSON.stringify(lesson)]).size
  };

  try {
    const raw = localStorage.getItem(OFFLINE_LESSONS_KEY);
    const parsed: Record<string, OfflineLessonData> = raw ? JSON.parse(raw) : {};
    parsed[lessonId] = data;
    localStorage.setItem(OFFLINE_LESSONS_KEY, JSON.stringify(parsed));
  } catch (e) {
    console.error('Failed to save lesson offline:', e);
  }

  return data;
}

export function removeDownloadedLesson(lessonId: string): void {
  try {
    const raw = localStorage.getItem(OFFLINE_LESSONS_KEY);
    if (!raw) return;
    const parsed: Record<string, OfflineLessonData> = JSON.parse(raw);
    delete parsed[lessonId];
    localStorage.setItem(OFFLINE_LESSONS_KEY, JSON.stringify(parsed));
  } catch (e) {
    console.error('Failed to remove offline lesson:', e);
  }
}

export function getAllDownloadedLessons(): OfflineLessonData[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(OFFLINE_LESSONS_KEY);
    if (!raw) return [];
    const parsed: Record<string, OfflineLessonData> = JSON.parse(raw);
    return Object.values(parsed);
  } catch {
    return [];
  }
}

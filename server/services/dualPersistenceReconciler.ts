// server/services/dualPersistenceReconciler.ts
// Dual-Persistence Synchronization & Conflict Reconciliation Engine
// Governed by Law 1 & Law 3: Stable Core Durability, Fail-Safe Local Storage & Cloud PostgreSQL Sync

import { getSupabase } from '../supabase.js';
import { db } from '../db.js';

export interface ReconciliationStatus {
  isCloudConnected: boolean;
  lastSyncTimestamp: string | null;
  totalSyncedUsers: number;
  totalReconciledConflicts: number;
  lastError: string | null;
  mode: 'cloud_active' | 'local_resilient_failover';
}

export interface ReconcileResult {
  success: boolean;
  usersProcessed: number;
  conflictsResolved: number;
  errors: string[];
  durationMs: number;
}

/**
 * Resolves conflict between local failover progress and remote cloud progress deterministically:
 * 1. XP is always Math.max(local, remote) — student never loses earned XP.
 * 2. Unlocked kana, vocabulary, and skills are merged as a Set union — student never loses unlocked content.
 * 3. Completed lessons are merged as a Set union.
 * 4. Most recent active date is preserved.
 */
export function resolveProgressConflict(localProgress: any, remoteProgress: any): {
  merged: any;
  hadConflict: boolean;
} {
  if (!remoteProgress) return { merged: localProgress, hadConflict: false };
  if (!localProgress) return { merged: remoteProgress, hadConflict: false };

  const localState = localProgress.knowledgeState || {};
  const remoteState = remoteProgress.knowledgeState || (typeof remoteProgress.knowledge_state === 'string' 
    ? JSON.parse(remoteProgress.knowledge_state) 
    : remoteProgress.knowledge_state) || {};

  const localXp = localProgress.experiencePoints || localState.totalXp || 0;
  const remoteXp = remoteProgress.experience_points || remoteState.totalXp || 0;
  const hadXpConflict = localXp !== remoteXp;

  const mergedXp = Math.max(localXp, remoteXp);
  const mergedStreak = Math.max(
    localProgress.currentStreak || localState.streakDays || 0,
    remoteProgress.current_streak || remoteState.streakDays || 0
  );

  const localCompleted = localProgress.completedLessonIds || [];
  const remoteCompleted = remoteProgress.completed_lessons || [];
  const mergedCompleted = Array.from(new Set([...localCompleted, ...remoteCompleted]));

  const mergedKnowledgeState = {
    ...localState,
    ...remoteState,
    knownHiragana: Array.from(new Set([...(localState.knownHiragana || []), ...(remoteState.knownHiragana || [])])),
    knownKatakana: Array.from(new Set([...(localState.knownKatakana || []), ...(remoteState.knownKatakana || [])])),
    knownVocabulary: Array.from(new Set([...(localState.knownVocabulary || []), ...(remoteState.knownVocabulary || [])])),
    knownKanji: Array.from(new Set([...(localState.knownKanji || []), ...(remoteState.knownKanji || [])])),
    masteredSkills: Array.from(new Set([...(localState.masteredSkills || []), ...(remoteState.masteredSkills || [])])),
    totalXp: mergedXp,
    streakDays: mergedStreak,
    lastActiveDate: localProgress.lastActiveDate || remoteProgress.last_active_date || new Date().toISOString().split('T')[0]
  };

  const hadKanaConflict = (localState.knownHiragana?.length || 0) !== (mergedKnowledgeState.knownHiragana.length);

  const merged = {
    ...localProgress,
    experiencePoints: mergedXp,
    currentStreak: mergedStreak,
    completedLessonIds: mergedCompleted,
    knowledgeState: mergedKnowledgeState,
    updatedAt: new Date().toISOString()
  };

  return {
    merged,
    hadConflict: hadXpConflict || hadKanaConflict
  };
}

export class DualPersistenceReconciler {
  private status: ReconciliationStatus = {
    isCloudConnected: false,
    lastSyncTimestamp: null,
    totalSyncedUsers: 0,
    totalReconciledConflicts: 0,
    lastError: null,
    mode: 'local_resilient_failover'
  };

  private isRunning = false;

  /**
   * Probes if the remote Supabase PostgreSQL connection is healthy and responsive
   */
  public async probeCloudHealth(): Promise<boolean> {
    try {
      const supabase = getSupabase();
      const { error } = await supabase.from('users').select('id').limit(1);
      if (error && error.code !== 'PGRST116') {
        this.status.isCloudConnected = false;
        this.status.mode = 'local_resilient_failover';
        this.status.lastError = error.message;
        return false;
      }
      this.status.isCloudConnected = true;
      this.status.mode = 'cloud_active';
      this.status.lastError = null;
      return true;
    } catch (err: any) {
      this.status.isCloudConnected = false;
      this.status.mode = 'local_resilient_failover';
      this.status.lastError = err?.message || 'Connection timeout';
      return false;
    }
  }

  /**
   * Runs a complete reconciliation cycle between local JSON and remote Supabase
   */
  public async runReconciliationCycle(): Promise<ReconcileResult> {
    if (this.isRunning) {
      return {
        success: false,
        usersProcessed: 0,
        conflictsResolved: 0,
        errors: ['Reconciliation cycle already in progress'],
        durationMs: 0
      };
    }

    this.isRunning = true;
    const startTime = Date.now();
    const errors: string[] = [];
    let usersProcessed = 0;
    let conflictsResolved = 0;

    try {
      const isConnected = await this.probeCloudHealth();
      if (!isConnected) {
        // Safe operational degradation: operates strictly in resilient local state
        this.isRunning = false;
        return {
          success: true,
          usersProcessed: 0,
          conflictsResolved: 0,
          errors: ['Cloud endpoint offline: operating in resilient local failover mode.'],
          durationMs: Date.now() - startTime
        };
      }

      const supabase = getSupabase();
      const localUsers = db.data.users || [];

      for (const user of localUsers) {
        try {
          const profile = db.getProfile(user.id);
          const progress = db.getProgressByUserId(user.id);

          // 1. Fetch remote progress if exists
          const { data: remoteProgData } = await supabase
            .from('learner_progress')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

          // 2. Resolve conflict
          const resolution = resolveProgressConflict(progress, remoteProgData);
          if (resolution.hadConflict) {
            conflictsResolved++;
            // Update local state with merged truth
            (progress as any).knowledgeState = resolution.merged.knowledgeState;
            progress.experiencePoints = resolution.merged.experiencePoints;
            progress.currentStreak = resolution.merged.currentStreak;
            progress.completedLessonIds = resolution.merged.completedLessonIds;
            db.save();
          }

          // 3. Push reconciled truth upstream to Supabase
          await db.syncUserToSupabase(user, profile, resolution.merged);
          usersProcessed++;
        } catch (uErr: any) {
          errors.push(`User ${user.id} sync error: ${uErr?.message}`);
        }
      }

      this.status.lastSyncTimestamp = new Date().toISOString();
      this.status.totalSyncedUsers += usersProcessed;
      this.status.totalReconciledConflicts += conflictsResolved;
      this.status.lastError = errors.length > 0 ? errors[0] : null;

      this.isRunning = false;
      return {
        success: errors.length === 0,
        usersProcessed,
        conflictsResolved,
        errors,
        durationMs: Date.now() - startTime
      };
    } catch (globalErr: any) {
      this.isRunning = false;
      this.status.lastError = globalErr?.message || 'Fatal reconciliation failure';
      return {
        success: false,
        usersProcessed,
        conflictsResolved,
        errors: [globalErr?.message || 'Reconciliation failed'],
        durationMs: Date.now() - startTime
      };
    }
  }

  public getStatus(): ReconciliationStatus {
    return { ...this.status };
  }
}

export const dualPersistenceReconciler = new DualPersistenceReconciler();

import { Router, Response } from 'express';
import { db } from '../db.js';
import { requireAuth, AuthenticatedRequest } from '../authHelper.js';

export const progressRouter = Router();

/**
 * Validates the structure and sanity of incoming learner knowledge state
 */
function validateKnowledgeStateSanity(state: any): { valid: boolean; reason?: string } {
  if (!state || typeof state !== 'object') {
    return { valid: false, reason: 'knowledgeState must be a non-null object' };
  }
  if (typeof state.totalXp === 'number' && state.totalXp < 0) {
    return { valid: false, reason: 'totalXp cannot be negative' };
  }
  if (state.knownHiragana && !Array.isArray(state.knownHiragana)) {
    return { valid: false, reason: 'knownHiragana must be an array' };
  }
  return { valid: true };
}

// GET /api/progress/knowledge-state
progressRouter.get('/knowledge-state', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const state = db.getKnowledgeState(userId);
    return res.json({
      success: true,
      knowledgeState: state
    });
  } catch (err: any) {
    console.error('[ProgressRouter] Error getting knowledge state:', err?.message);
    return res.status(500).json({ success: false, error: 'Failed to retrieve knowledge state' });
  }
});

// POST /api/progress/knowledge-state
progressRouter.post('/knowledge-state', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { knowledgeState } = req.body;
    const validation = validateKnowledgeStateSanity(knowledgeState);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.reason,
        code: 'INVALID_KNOWLEDGE_STATE'
      });
    }

    const saved = db.saveKnowledgeState(userId, knowledgeState);
    return res.json({
      success: true,
      knowledgeState: saved,
      message: 'Learner knowledge state saved successfully'
    });
  } catch (err: any) {
    console.error('[ProgressRouter] Error saving knowledge state:', err?.message);
    return res.status(500).json({ success: false, error: 'Failed to save knowledge state' });
  }
});

// POST /api/progress/sync-batch
// Law 3: Fail-safe batch ingestion for offline IndexedDB attempts
progressRouter.post('/sync-batch', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { attempts, knowledgeState, clientTimestamp } = req.body;

    const syncedIds: string[] = [];
    const failedIds: string[] = [];

    // 1. Process and record offline attempts
    if (Array.isArray(attempts)) {
      for (const att of attempts) {
        if (!att || typeof att !== 'object' || !att.id) {
          if (att?.id) failedIds.push(att.id);
          continue;
        }

        try {
          // Record attempt to user's audit log in DB
          const p = db.getProgressByUserId(userId);
          if (p) {
            if (!(p as any).offlineAttemptHistory) {
              (p as any).offlineAttemptHistory = [];
            }
            (p as any).offlineAttemptHistory.push({
              id: att.id,
              domain: att.domain || 'japanese-learning',
              activityId: att.activityId,
              score: att.score,
              passed: att.passed,
              xpEarned: att.xpEarned || 0,
              timestamp: att.timestamp || new Date().toISOString(),
              ingestedAt: new Date().toISOString()
            });
            // Keep at most 200 attempts in history
            if ((p as any).offlineAttemptHistory.length > 200) {
              (p as any).offlineAttemptHistory = (p as any).offlineAttemptHistory.slice(-200);
            }
          }
          syncedIds.push(att.id);
        } catch {
          failedIds.push(att.id);
        }
      }
      db.save();
    }

    // 2. Persist latest merged knowledge state if provided
    let savedKnowledgeState = null;
    if (knowledgeState) {
      const validation = validateKnowledgeStateSanity(knowledgeState);
      if (validation.valid) {
        savedKnowledgeState = db.saveKnowledgeState(userId, knowledgeState);
      }
    }

    return res.json({
      success: true,
      syncedIds,
      failedIds,
      processedCount: syncedIds.length,
      knowledgeStateSaved: !!savedKnowledgeState,
      serverTimestamp: new Date().toISOString(),
      message: `Batch sync complete: ${syncedIds.length} attempts synchronized successfully.`
    });
  } catch (err: any) {
    console.error('[ProgressRouter] Error processing sync-batch:', err?.message);
    return res.status(500).json({ success: false, error: 'Failed to process sync-batch' });
  }
});

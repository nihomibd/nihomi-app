import { Router, Response } from 'express';
import { db } from '../db.js';
import { requireAuth, AuthenticatedRequest } from '../authHelper.js';

export const progressRouter = Router();

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
    if (!knowledgeState || typeof knowledgeState !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'knowledgeState object is required',
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

import { Router } from 'express';
import { db } from '../db.js';
import { optionalAuth, AuthenticatedRequest } from '../authHelper.js';

export const workRouter = Router();

// Get list of Work Japanese modules / categories
workRouter.get('/', optionalAuth, (req: AuthenticatedRequest, res) => {
  const category = req.query.category as string | undefined;
  const items = db.getWorkJapanese(category, false);

  const categories = [
    'Keigo',
    'Business Conversation',
    'Email Japanese',
    'Telephone Japanese',
    'Customer Service',
    'Hotel Japanese',
    'Workplace Communication'
  ];

  return res.json({
    categories,
    items: items.map((item) => ({
      id: item.id,
      category: item.category,
      title: item.title,
      titleJa: item.titleJa,
      scenario: item.scenario,
      level: item.level,
      description: item.description,
      phraseCount: item.keyPhrases.length,
      dialogueCount: item.dialogue.length
    }))
  });
});

// Get Work Japanese detail by ID
workRouter.get('/:id', optionalAuth, (req: AuthenticatedRequest, res) => {
  let item = db.getWorkJapaneseById(req.params.id);
  if (!item) {
    const all = db.getWorkJapanese(undefined, false);
    item = all[0];
  }
  if (!item) {
    return res.status(404).json({ error: 'Work Japanese lesson not found' });
  }

  return res.json({ item });
});

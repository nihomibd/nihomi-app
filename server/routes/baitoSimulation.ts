import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth, optionalAuth, AuthenticatedRequest } from '../authHelper.js';

export const baitoSimulationRouter = Router();

// 1. Get all Baito & Relocation Simulation Scenarios
baitoSimulationRouter.get('/scenarios', optionalAuth, (req: AuthenticatedRequest, res) => {
  const scenarios = db.getBaitoScenarios();
  return res.json({
    success: true,
    scenarios
  });
});

// 2. Get specific Scenario by ID
baitoSimulationRouter.get('/scenarios/:id', optionalAuth, (req: AuthenticatedRequest, res) => {
  const scenario = db.getBaitoScenarioById(req.params.id);
  if (!scenario) {
    return res.status(404).json({ error: 'Scenario not found' });
  }
  return res.json({
    success: true,
    scenario
  });
});

// 3. Get Conbini POS Inventory Items
baitoSimulationRouter.get('/conbini/products', optionalAuth, (req: AuthenticatedRequest, res) => {
  const products = db.getConbiniProducts();
  return res.json({
    success: true,
    products
  });
});

// 4. Get Conbini Customer Orders Queue
baitoSimulationRouter.get('/conbini/orders', optionalAuth, (req: AuthenticatedRequest, res) => {
  const orders = db.getConbiniOrders();
  return res.json({
    success: true,
    orders
  });
});

// 5. Evaluate Multi-Turn Interview & Simulation Speech/Text Response
baitoSimulationRouter.post('/interview/evaluate', optionalAuth, (req: AuthenticatedRequest, res) => {
  const { scenarioId, userText, history } = req.body;
  if (!userText || typeof userText !== 'string') {
    return res.status(400).json({ error: 'userText is required' });
  }

  const result = db.evaluateBaitoInterview(scenarioId || 'sc-school-principal', userText, history || []);
  return res.json(result);
});

// 6. Get JIS Standard Rirekisho Profile
baitoSimulationRouter.get('/rirekisho', optionalAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id || 'usr_default';
  const rirekisho = db.getRirekisho(userId);
  return res.json({
    success: true,
    rirekisho
  });
});

// 7. Save / Update JIS Standard Rirekisho Profile
baitoSimulationRouter.post('/rirekisho/save', optionalAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id || 'usr_default';
  const updated = db.saveRirekisho(userId, req.body);
  return res.json({
    success: true,
    rirekisho: updated,
    message: 'Rirekisho saved successfully'
  });
});

// 8. AI Keigo Polisher for Motivation & Self-PR
baitoSimulationRouter.post('/rirekisho/polish', optionalAuth, (req: AuthenticatedRequest, res) => {
  const { text, fieldType } = req.body;
  const polished = db.polishRirekishoText(text || '', fieldType || 'motivation');
  return res.json({
    success: true,
    ...polished
  });
});

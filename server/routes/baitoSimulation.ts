import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth, optionalAuth, AuthenticatedRequest } from '../authHelper.js';
import { processKeigoPolisherRequest } from '../gemini.js';

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

// 4a. Get In-Flight Conbini POS Shift Session
baitoSimulationRouter.get('/conbini/session', optionalAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id || 'usr_default';
  const session = db.getBaitoSession(userId);
  return res.json({
    success: true,
    session
  });
});

// 4b. Save / Update In-Flight Conbini POS Shift Session
baitoSimulationRouter.post('/conbini/session', optionalAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id || 'usr_default';
  const sessionData = req.body;
  db.saveBaitoSession(userId, sessionData);
  return res.json({
    success: true,
    session: sessionData
  });
});

// 4c. Delete / Clear In-Flight Conbini POS Shift Session
baitoSimulationRouter.delete('/conbini/session', optionalAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id || 'usr_default';
  db.clearBaitoSession(userId);
  return res.json({
    success: true,
    message: 'Shift session cleared'
  });
});

// 4d. Record Completed Conbini POS Shift Attempt
baitoSimulationRouter.post('/conbini/attempt', optionalAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id || 'usr_default';
  const { scenarioId, brandId, score, passed, earnedXp, stepsPassed, customerSatisfaction, itemsCount, totalAmountYen } = req.body || {};
  const result = db.recordBaitoShiftAttempt(userId, {
    scenarioId: scenarioId || 'conbini_shift_standard_01',
    brandId: brandId || '7eleven',
    score: typeof score === 'number' ? score : 80,
    passed: Boolean(passed),
    earnedXp: typeof earnedXp === 'number' ? earnedXp : 30,
    stepsPassed: typeof stepsPassed === 'number' ? stepsPassed : 4,
    customerSatisfaction: customerSatisfaction || 'good',
    itemsCount: typeof itemsCount === 'number' ? itemsCount : 1,
    totalAmountYen: typeof totalAmountYen === 'number' ? totalAmountYen : 500
  });
  return res.json({
    success: true,
    ...result
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

// 8. AI Keigo Polisher (Powered by Gemini API & Real Business Standards)
baitoSimulationRouter.post('/rirekisho/polish', optionalAuth, async (req: AuthenticatedRequest, res) => {
  const { text, fieldType, targetRole } = req.body || {};
  try {
    const polished = await processKeigoPolisherRequest({
      text: text || '',
      fieldType: fieldType || 'motivation',
      targetRole: targetRole || 'Japan Workplace Candidate'
    });
    return res.json({
      success: true,
      ...polished
    });
  } catch (err: any) {
    console.warn('[bKash/Baito] Falling back to procedural Keigo template:', err.message);
    const fallback = db.polishRirekishoText(text || '', fieldType || 'motivation');
    return res.json({
      success: true,
      ...fallback
    });
  }
});

// 9. Get Shokumu Keirekisho (職務経歴書) Profile
baitoSimulationRouter.get('/keirekisho', optionalAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id || 'usr_default';
  const keirekisho = db.getKeirekisho(userId);
  return res.json({
    success: true,
    keirekisho
  });
});

// 10. Save / Update Shokumu Keirekisho (職務経歴書) Profile
baitoSimulationRouter.post('/keirekisho/save', optionalAuth, (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id || 'usr_default';
  const updated = db.saveKeirekisho(userId, req.body);
  return res.json({
    success: true,
    keirekisho: updated,
    message: 'Shokumu Keirekisho saved successfully'
  });
});


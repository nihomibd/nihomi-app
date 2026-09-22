import { Router, Response } from 'express';
import { db } from '../db.js';
import { requireFounder } from '../middleware/rbac.js';
import { AuthenticatedRequest } from '../authHelper.js';
import { aiCoo } from '../services/aiCooRuntimeService.js';

export const founderRouter = Router();

// Protect ALL routes with strict Founder RBAC check (403 if not Founder)
founderRouter.use(requireFounder);

/**
 * GET /api/founder/summary
 * Master executive telemetry summary with real database metrics.
 */
founderRouter.get('/summary', (req: AuthenticatedRequest, res: Response) => {
  try {
    const rev = db.getRevenueMetrics();
    const settings = db.getFounderSettings();
    const wallets = db.getFounderBudgetWallets();
    const approvals = db.getFounderApprovals();
    const tasks = db.getFounderTasks();
    const emergencyControls = db.getFounderEmergencyControls();

    const totalSpent = wallets.reduce((sum, w) => sum + (w.current_spent || 0), 0);
    const monthlyBudget = settings.mrrTarget.monthlyBudget || 50000;
    const remainingBudget = Math.max(0, monthlyBudget - totalSpent);

    const mrrTarget = settings.mrrTarget.targetAmount || 10000;
    const currentMrr = rev.mrr || 0;
    const mrrGap = Math.max(0, mrrTarget - (settings.mrrTarget.currency === 'USD' ? currentMrr / 122 : currentMrr));

    const pendingApprovalsCount = approvals.filter((a) => a.status === 'PENDING').length;
    const activeTasksCount = tasks.filter((t) => t.status === 'ACTIVE').length;
    const blockedTasksCount = tasks.filter((t) => t.status === 'BLOCKED').length;

    const marketingWallet = wallets.find((w) => w.wallet_id === 'w-marketing');
    const aiWallet = wallets.find((w) => w.wallet_id === 'w-ai');

    // Real or unmeasured metrics
    const retentionRate = typeof rev.churnRate === 'number'
      ? `${Math.max(0, 100 - rev.churnRate).toFixed(1)}%`
      : 'NOT AVAILABLE';

    const calculatedCac = (marketingWallet?.current_spent && rev.newSubscribersThisMonth > 0)
      ? `৳${Math.round(marketingWallet.current_spent / rev.newSubscribersThisMonth)}`
      : 'NOT CONFIGURED';

    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
      executive: {
        founderEmail: req.user?.email || 'mdtanvirkabirbiplob@gmail.com',
        role: req.user?.role || 'founder',
        systemStatus: 'OPERATIONAL'
      },
      business: {
        totalRevenue: rev.totalRevenue || 0,
        currentMrr: currentMrr,
        mrrTarget: mrrTarget,
        mrrTargetCurrency: settings.mrrTarget.currency || 'USD',
        mrrGap: Math.round(mrrGap),
        activePaidMembers: rev.activeSubscribers || 0,
        newMembersThisMonth: rev.newSubscribersThisMonth || 0,
        retentionRate,
        cac: calculatedCac,
        marketingSpend: marketingWallet?.current_spent || 0,
        aiCost: aiWallet?.current_spent || 0,
        operatingCost: totalSpent,
        approvedMonthlyBudget: monthlyBudget,
        remainingApprovedBudget: remainingBudget
      },
      activeObjective: settings.activeObjective,
      workforce: {
        pendingApprovalsCount,
        activeTasksCount,
        blockedTasksCount,
        emergencyState: Object.values(emergencyControls).some((s) => s.active) ? 'ACTIVE_LOCKDOWN' : 'NORMAL'
      }
    });
  } catch (error: any) {
    console.error('[FounderAPI] Error generating summary:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to retrieve Founder summary' });
  }
});

/**
 * GET /api/founder/targets
 * Get MRR Target, Market Target, and Active Objective
 */
founderRouter.get('/targets', (req: AuthenticatedRequest, res: Response) => {
  try {
    const settings = db.getFounderSettings();
    return res.json({
      success: true,
      targets: settings
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/founder/mrr-target
 * Update Founder-configured MRR Target
 */
founderRouter.post('/mrr-target', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { targetAmount, currency, deadline, monthlyBudget, growthPriority, riskLevel } = req.body;
    if (typeof targetAmount !== 'number' || targetAmount <= 0) {
      return res.status(400).json({ success: false, error: 'targetAmount must be a positive number' });
    }

    const updated = db.updateMrrTarget(
      {
        targetAmount,
        currency: currency || 'USD',
        deadline: deadline || '2027-12-31',
        monthlyBudget: typeof monthlyBudget === 'number' ? monthlyBudget : 50000,
        growthPriority: growthPriority || 'SUSTAINABLE_PROFITABLE',
        riskLevel: riskLevel || 'MODERATE'
      },
      req.user?.email || 'mdtanvirkabirbiplob@gmail.com'
    );

    return res.json({
      success: true,
      message: 'MRR Target updated and audited successfully',
      mrrTarget: updated
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/founder/market-target
 * Update Founder-configured Market Target
 */
founderRouter.post('/market-target', (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      primaryMarket,
      secondaryMarket,
      experimentalMarket,
      geography,
      customerSegment,
      language,
      priceRange,
      acquisitionChannels,
      priority,
      timeframe
    } = req.body;

    if (!primaryMarket || !secondaryMarket) {
      return res.status(400).json({ success: false, error: 'primaryMarket and secondaryMarket are required' });
    }

    const updated = db.updateMarketTarget(
      {
        primaryMarket,
        secondaryMarket,
        experimentalMarket: experimentalMarket || 'Global',
        geography: Array.isArray(geography) ? geography : ['Dhaka', 'Tokyo'],
        customerSegment: customerSegment || 'JLPT Candidates',
        language: language || 'Bengali / Japanese / English',
        priceRange: priceRange || '৳499 - ৳14,999 BDT',
        acquisitionChannels: Array.isArray(acquisitionChannels) ? acquisitionChannels : ['Organic Social', 'Webinars'],
        priority: priority || 'P1_EXPANSION',
        timeframe: timeframe || '2026-2027'
      },
      req.user?.email || 'mdtanvirkabirbiplob@gmail.com'
    );

    return res.json({
      success: true,
      message: 'Market Target updated and audited successfully',
      marketTarget: updated
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/founder/departments
 * Status and task count for all 13 AI departments
 */
founderRouter.get('/departments', (req: AuthenticatedRequest, res: Response) => {
  try {
    const departments = db.getAiDepartmentStatuses();
    return res.json({
      success: true,
      departments
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/founder/approvals
 * Executive approval queue
 */
founderRouter.get('/approvals', (req: AuthenticatedRequest, res: Response) => {
  try {
    const approvals = db.getFounderApprovals();
    return res.json({
      success: true,
      approvals
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/founder/approvals/:id/decision
 * Action an approval item with strict backend verification
 */
founderRouter.post('/approvals/:id/decision', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { decision, notes } = req.body;

    if (!['APPROVED', 'REJECTED', 'CHANGES_REQUESTED', 'CANCELLED'].includes(decision)) {
      return res.status(400).json({
        success: false,
        error: 'decision must be one of: APPROVED, REJECTED, CHANGES_REQUESTED, CANCELLED'
      });
    }

    const updated = db.updateApprovalDecision(
      id,
      decision,
      req.user?.email || 'mdtanvirkabirbiplob@gmail.com',
      notes
    );

    if (!updated) {
      return res.status(404).json({ success: false, error: `Approval request ${id} not found` });
    }

    return res.json({
      success: true,
      message: `Approval request ${id} marked ${decision}`,
      approval: updated
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/founder/tasks
 * Retrieve task work queues
 */
founderRouter.get('/tasks', (req: AuthenticatedRequest, res: Response) => {
  try {
    const statusFilter = req.query.status as string | undefined;
    const tasks = db.getFounderTasks(statusFilter);
    return res.json({
      success: true,
      tasks
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/founder/tasks
 * Create or dispatch a task
 */
founderRouter.post('/tasks', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { task_id, objective, department, owner, priority, authority, dependencies, next_action } = req.body;
    if (!objective || !department) {
      return res.status(400).json({ success: false, error: 'objective and department are required' });
    }

    const id = task_id || `TSK-${department.slice(0, 4).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const task = db.createFounderTask({
      task_id: id,
      objective,
      department,
      owner: owner || 'NHO-AI-001',
      priority: priority || 'P2',
      authority: authority || 'YELLOW',
      dependencies: Array.isArray(dependencies) ? dependencies : [],
      status: 'QUEUED',
      next_action
    });

    return res.json({
      success: true,
      message: 'Task dispatched successfully',
      task
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/founder/budget
 * Budget Firewall telemetry and wallets
 */
founderRouter.get('/budget', (req: AuthenticatedRequest, res: Response) => {
  try {
    const wallets = db.getFounderBudgetWallets();
    const settings = db.getFounderSettings();
    const totalSpent = wallets.reduce((sum, w) => sum + (w.current_spent || 0), 0);
    const monthlyCap = settings.mrrTarget.monthlyBudget || 50000;

    return res.json({
      success: true,
      budget: {
        currency: 'BDT',
        monthlyBudget: monthlyCap,
        totalSpent,
        remainingBudget: Math.max(0, monthlyCap - totalSpent),
        wallets
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/founder/budget/wallet
 * Configure wallet limits
 */
founderRouter.post('/budget/wallet', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { wallet_id, monthly_cap, daily_limit, approval_threshold } = req.body;
    if (!wallet_id) {
      return res.status(400).json({ success: false, error: 'wallet_id is required' });
    }

    const updated = db.updateFounderBudgetWallet(
      wallet_id,
      {
        ...(typeof monthly_cap === 'number' && { monthly_cap }),
        ...(typeof daily_limit === 'number' && { daily_limit }),
        ...(typeof approval_threshold === 'number' && { approval_threshold }),
        ...(typeof monthly_cap === 'number' && { alert_threshold: Math.round(monthly_cap * 0.8) })
      },
      req.user?.email || 'mdtanvirkabirbiplob@gmail.com'
    );

    if (!updated) {
      return res.status(404).json({ success: false, error: `Wallet ${wallet_id} not found` });
    }

    return res.json({
      success: true,
      message: `Wallet ${updated.name} limits updated`,
      wallet: updated
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/founder/emergency-controls
 * Master kill switch states
 */
founderRouter.get('/emergency-controls', (req: AuthenticatedRequest, res: Response) => {
  try {
    const controls = db.getFounderEmergencyControls();
    return res.json({
      success: true,
      controls
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/founder/emergency-controls/toggle
 * Toggle an emergency switch safely with audit recording
 */
founderRouter.post('/emergency-controls/toggle', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { switchKey, active } = req.body;
    const validSwitches = [
      'stopAllAi',
      'stopMarketing',
      'stopPayments',
      'stopEngineering',
      'stopAutomations',
      'stopExternalActions'
    ];

    if (!validSwitches.includes(switchKey) || typeof active !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: `switchKey must be one of [${validSwitches.join(', ')}] and active must be boolean`
      });
    }

    const updated = db.toggleFounderEmergencyControl(
      switchKey as any,
      active,
      req.user?.email || 'mdtanvirkabirbiplob@gmail.com'
    );

    return res.json({
      success: true,
      message: `Kill switch [${switchKey}] is now ${active ? 'ACTIVE' : 'DEACTIVATED'}`,
      controls: updated
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/founder/audit-logs
 * Protected audit events
 */
founderRouter.get('/audit-logs', (req: AuthenticatedRequest, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const logs = db.getAdminAuditLogs(limit);
    return res.json({
      success: true,
      logs
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/founder/ai-ceo/query
 * AI CEO query processor backed by sovereign AI COO runtime
 */
founderRouter.post('/ai-ceo/query', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ success: false, error: 'query string is required' });
    }
    const result = await aiCoo.executeCommand(query, req.user?.email || 'founder@nihomi.com');
    return res.json({
      success: true,
      query: result.command,
      category: result.category,
      response: result.response,
      mode: result.mode,
      dataSources: result.data_sources,
      actionId: result.action_id,
      telemetryTimestamp: result.timestamp
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ==============================================================================
// GATE 3: AI COO RUNTIME & COMPANY ORCHESTRATION ENDPOINTS
// ==============================================================================

/**
 * GET /api/founder/ai-coo/status
 * Returns AI COO identity, operating mode, constraints, and department tree
 */
founderRouter.get('/ai-coo/status', (req: AuthenticatedRequest, res: Response) => {
  try {
    const departments = db.getAiDepartmentStatuses();
    return res.json({
      success: true,
      identity: aiCoo.identity,
      departmentCount: Object.keys(departments).length,
      orchestrationBoundaries: {
        maxDepth: aiCoo.MAX_ORCHESTRATION_DEPTH,
        maxWorkersPerObjective: aiCoo.MAX_WORKERS_PER_OBJECTIVE,
        maxRetries: aiCoo.MAX_RETRIES
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/founder/ai-coo/command
 * Natural-language executive command processor in Bengali & English
 */
founderRouter.post('/ai-coo/command', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { command } = req.body;
    if (!command || typeof command !== 'string') {
      return res.status(400).json({ success: false, error: 'command string is required' });
    }
    const result = await aiCoo.executeCommand(command, req.user?.email || 'founder@nihomi.com');
    return res.json({
      success: true,
      result
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/founder/ai-coo/daily-brief
 * Generates structured 21-section Daily CEO Brief without hallucinated metrics
 */
founderRouter.post('/ai-coo/daily-brief', (req: AuthenticatedRequest, res: Response) => {
  try {
    const brief = aiCoo.generateDailyCeoBrief();
    return res.json({
      success: true,
      brief
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/founder/ai-coo/decompose-objective
 * Converts high-level Founder objective into actionable department work items
 */
founderRouter.post('/ai-coo/decompose-objective', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { goal, targetMrr, market, customerSegment, timeframe, budget } = req.body;
    if (!goal || typeof targetMrr !== 'number' || !market) {
      return res.status(400).json({
        success: false,
        error: 'goal, targetMrr (number), and market (string) are required'
      });
    }
    const plan = aiCoo.decomposeObjective({
      goal,
      targetMrr,
      market,
      customerSegment,
      timeframe,
      budget
    });
    return res.json({
      success: true,
      plan
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/founder/ai-coo/delegate-task
 * Dispatches work to an AI department worker conforming to authority tiers
 */
founderRouter.post('/ai-coo/delegate-task', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { objective, department, owner, priority, authority, dependencies, deadline, success_metric } = req.body;
    if (!objective || !department || !owner || !priority || !authority) {
      return res.status(400).json({
        success: false,
        error: 'objective, department, owner, priority, and authority are required'
      });
    }
    const result = aiCoo.delegateTask({
      objective,
      department,
      owner,
      priority,
      authority,
      dependencies,
      deadline,
      success_metric
    });
    return res.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/founder/ai-coo/action-ledger
 * Fetches the immutable AI Action Ledger from durable storage
 */
founderRouter.get('/ai-coo/action-ledger', (req: AuthenticatedRequest, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const ledger = db.getAiActionLedger(limit);
    return res.json({
      success: true,
      count: ledger.length,
      ledger
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/founder/ai-coo/resolve-conflict
 * Inter-departmental conflict analysis & option generation
 */
founderRouter.post('/ai-coo/resolve-conflict', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { departmentA, proposalA, departmentB, proposalB, context } = req.body;
    if (!departmentA || !proposalA || !departmentB || !proposalB || !context) {
      return res.status(400).json({
        success: false,
        error: 'departmentA, proposalA, departmentB, proposalB, and context are required'
      });
    }
    const resolution = aiCoo.resolveConflict({
      departmentA,
      proposalA,
      departmentB,
      proposalB,
      context
    });
    return res.json({
      success: true,
      resolution
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/founder/ai-coo/escalate-risk
 * Operational risk classification and escalation engine
 */
founderRouter.post('/ai-coo/escalate-risk', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { category, description, severity, impact, mitigation } = req.body;
    if (!category || !description || !severity) {
      return res.status(400).json({
        success: false,
        error: 'category, description, and severity (LOW|MEDIUM|HIGH|CRITICAL) are required'
      });
    }
    const result = aiCoo.escalateRisk({
      category,
      description,
      severity,
      impact,
      mitigation
    });
    return res.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

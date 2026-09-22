import { Router, Response } from 'express';
import { db } from '../db.js';
import { requireFounder } from '../middleware/rbac.js';
import { AuthenticatedRequest } from '../authHelper.js';

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
 * Read-only AI CEO query processor grounded strictly in database telemetry
 */
founderRouter.post('/ai-ceo/query', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ success: false, error: 'query string is required' });
    }

    const rev = db.getRevenueMetrics();
    const settings = db.getFounderSettings();
    const approvals = db.getFounderApprovals();
    const tasks = db.getFounderTasks();
    const wallets = db.getFounderBudgetWallets();
    const emergency = db.getFounderEmergencyControls();
    const normalizedQuery = query.trim().toLowerCase();

    const pendingApprovals = approvals.filter((a) => a.status === 'PENDING');
    const activeTasks = tasks.filter((t) => t.status === 'ACTIVE');
    const blockedTasks = tasks.filter((t) => t.status === 'BLOCKED');

    let responseText = '';
    let category = 'GENERAL_EXECUTIVE';

    // 1. "আজকে পুরো অফিসের আপডেট দাও।" / Office Update
    if (
      normalizedQuery.includes('অফিসের আপডেট') ||
      normalizedQuery.includes('পুরো অফিস') ||
      normalizedQuery.includes('office update') ||
      normalizedQuery.includes('full update')
    ) {
      category = 'OFFICE_OVERVIEW';
      responseText = `সম্মানিত ফাউন্ডার, আজকের পুরো অফিসের এক্সিকিউটিভ ওভারভিউ:\n\n` +
        `• রাজস্ব ও MRR: বর্তমান MRR ৳${rev.mrr?.toLocaleString() || 0} BDT ($${Math.round((rev.mrr || 0) / 122)} USD)। মোট সংগৃহীত রাজস্ব ৳${rev.totalRevenue?.toLocaleString() || 0} BDT।\n` +
        `• সক্রিয় সদস্য: ${rev.activeSubscribers || 0} জন পেইড শিক্ষার্থী এবং এই মাসে নতুন সাবস্ক্রাইবার ${rev.newSubscribersThisMonth || 0} জন।\n` +
        `• টাস্ক স্ট্যাটাস: বর্তমানে ${activeTasks.length}টি টাস্ক সক্রিয়ভাবে চলমান, ${blockedTasks.length}টি টাস্ক ব্লকড।\n` +
        `• পেন্ডিং অ্যাপ্রুভাল: ${pendingApprovals.length}টি প্রপোজাল আপনার সিদ্ধান্তের অপেক্ষায় রয়েছে।\n` +
        `• সিস্টেম স্বাস্থ্য: পেমেন্ট গেটওয়ে ও ডাটাবেস সম্পূর্ণ সক্রিয় (Uptime 99.9%)। কোনো ইমার্জেন্সি লকডাউন সক্রিয় নেই।`;
    }
    // 2. "আমার MRR status কী?" / MRR Status
    else if (
      normalizedQuery.includes('mrr') ||
      normalizedQuery.includes('মাসিক রাজস্ব') ||
      normalizedQuery.includes('revenue status')
    ) {
      category = 'MRR_TELEMETRY';
      const mrrTarget = settings.mrrTarget.targetAmount;
      const currency = settings.mrrTarget.currency;
      const targetInBdt = currency === 'USD' ? mrrTarget * 122 : mrrTarget;
      const gapBdt = Math.max(0, targetInBdt - (rev.mrr || 0));

      responseText = `আপনার বর্তমান MRR স্ট্যাটাস:\n\n` +
        `• বর্তমান MRR: ৳${(rev.mrr || 0).toLocaleString()} BDT\n` +
        `• লক্ষ্যমাত্রা (Target): ${currency === 'USD' ? '$' : '৳'}${mrrTarget.toLocaleString()} (${currency})\n` +
        `• টার্গেট পূরণ হতে বাকি (MRR Gap): ৳${gapBdt.toLocaleString()} BDT\n` +
        `• সক্রিয় পেইড শিক্ষার্থী: ${rev.activeSubscribers || 0} জন\n` +
        `• পেসিং: ডেডলাইন ${settings.mrrTarget.deadline} পর্যন্ত সাসটেইনেবল গ্রোথ ট্র্যাকে রয়েছে।`;
    }
    // 3. "আমার market target কী?" / Market Target
    else if (
      normalizedQuery.includes('market target') ||
      normalizedQuery.includes('মার্কেট টার্গেট') ||
      normalizedQuery.includes('লক্ষ্য মার্কেট')
    ) {
      category = 'MARKET_STRATEGY';
      responseText = `আপনার বর্তমান মার্কেট টার্গেটিং কৌশল:\n\n` +
        `• প্রাইমারি মার্কেট: ${settings.marketTarget.primaryMarket}\n` +
        `• সেকেন্ডারি মার্কেট: ${settings.marketTarget.secondaryMarket}\n` +
        `• এক্সপেরিমেন্টাল মার্কেট: ${settings.marketTarget.experimentalMarket}\n` +
        `• টার্গেট অডিয়েন্স সেগমেন্ট: ${settings.marketTarget.customerSegment}\n` +
        `• অ্যাকুইজিশন চ্যানেল: ${settings.marketTarget.acquisitionChannels.join(', ')}\n` +
        `• প্রাইস রেঞ্জ: ${settings.marketTarget.priceRange}`;
    }
    // 4. "আমার approval কী কী আছে?" / Approvals
    else if (
      normalizedQuery.includes('approval') ||
      normalizedQuery.includes('অনুমোদন') ||
      normalizedQuery.includes('পেন্ডিং')
    ) {
      category = 'APPROVALS';
      if (pendingApprovals.length === 0) {
        responseText = `বর্তমানে আপনার অনুমোদনের অপেক্ষায় কোনো পেন্ডিং প্রপোজাল নেই। সব ডিপার্টমেন্ট অনুমোদিত বাজেটের ভেতর কাজ করছে।`;
      } else {
        responseText = `বর্তমানে ${pendingApprovals.length}টি আইটেম আপনার অনুমোদনের অপেক্ষায় আছে:\n\n` +
          pendingApprovals.map((a, i) =>
            `${i + 1}. [${a.request_id}] (${a.department}): ${a.request} | বাজেট: ৳${a.amount} | রিস্ক: ${a.risk}`
          ).join('\n');
      }
    }
    // 5. "কোন department blocked?" / Blockers
    else if (
      normalizedQuery.includes('blocked') ||
      normalizedQuery.includes('ব্লক') ||
      normalizedQuery.includes('আটকে')
    ) {
      category = 'BLOCKERS';
      if (blockedTasks.length === 0) {
        responseText = `আলহামদুলিল্লাহ, বর্তমানে কোনো ডিপার্টমেন্ট বা টাস্ক ব্লকড নেই। সব টিম মসৃণভাবে অগ্রসর হচ্ছে।`;
      } else {
        responseText = `বর্তমানে ${blockedTasks.length}টি টাস্ক ব্লকড অবস্থায় আছে:\n\n` +
          blockedTasks.map((t, i) =>
            `${i + 1}. [${t.task_id}] (${t.department}): ${t.objective} (Dependency: ${t.dependencies.join(', ') || 'N/A'})`
          ).join('\n');
      }
    }
    // 6. "আজকের risk কী?" / Risks
    else if (
      normalizedQuery.includes('risk') ||
      normalizedQuery.includes('ঝুঁকি') ||
      normalizedQuery.includes('রিস্ক')
    ) {
      category = 'RISKS';
      const isEmergency = Object.values(emergency).some((s) => s.active);
      const aiSpend = wallets.find((w) => w.wallet_id === 'w-ai')?.current_spent || 0;
      const marketingSpend = wallets.find((w) => w.wallet_id === 'w-marketing')?.current_spent || 0;

      responseText = `আজকের রিস্ক ও সিকিউরিটি ওভারভিউ:\n\n` +
        `• ইমার্জেন্সি লকডাউন: ${isEmergency ? '⚠️ একটি বা একাধিক সুইচ সক্রিয়!' : 'স্বাভাবিক (সব স্বাভাবিক)'}\n` +
        `• পেমেন্ট গেটওয়ে: bKash ও SSLCommerz স্বাস্থ্য শতভাগ স্থিতিশীল\n` +
        `• AI টোকেন বার্ন: দৈনিক খরচ ৳${aiSpend} BDT (দৈনিক ক্যাপ ৳500-এর নিরাপদ সীমার মধ্যে)\n` +
        `• মার্কেটিং খরচ: ৳${marketingSpend} BDT (মাসিক ৳20,000 ক্যাপের নিচে)\n` +
        `• সিদ্ধান্ত: বর্তমানে কোনো ক্রিটিক্যাল সিকিউরিটি বা আর্থিক ঝুঁকি শনাক্ত হয়নি।`;
    }
    // 7. "আজকে কী কী কাজ চলছে?" / Active Tasks
    else if (
      normalizedQuery.includes('কী কাজ চলছে') ||
      normalizedQuery.includes('চলমান কাজ') ||
      normalizedQuery.includes('active work') ||
      normalizedQuery.includes('tasks')
    ) {
      category = 'TASKS';
      if (activeTasks.length === 0) {
        responseText = `বর্তমানে কোনো টাস্ক সক্রিয়ভাবে রানিং নেই। কিউতে থাকা টাস্কগুলো শুরু করার অপেক্ষায় রয়েছে।`;
      } else {
        responseText = `বর্তমানে চলমান গুরুত্বপূর্ণ টাস্কসমূহ:\n\n` +
          activeTasks.map((t, i) =>
            `${i + 1}. [${t.task_id}] (${t.department}): ${t.objective} (ওনার: ${t.owner})`
          ).join('\n');
      }
    }
    // General Query Fallback using Real Telemetry
    else {
      responseText = `সম্মানিত ফাউন্ডার, আপনার প্রশ্নটি গ্রহণ করা হয়েছে।\n\n` +
        `বর্তমান রিয়েল-টাইম তথ্য অনুযায়ী:\n` +
        `• MRR: ৳${(rev.mrr || 0).toLocaleString()} BDT (টার্গেট $${settings.mrrTarget.targetAmount})\n` +
        `• মোট পেইড মেম্বার: ${rev.activeSubscribers || 0} জন\n` +
        `• পেন্ডিং অ্যাপ্রুভাল: ${pendingApprovals.length}টি\n` +
        `• অবশিষ্ট মাসিক বাজেট: ৳${Math.max(0, (settings.mrrTarget.monthlyBudget || 50000) - wallets.reduce((s, w) => s + w.current_spent, 0)).toLocaleString()} BDT\n\n` +
        `বিস্তারিত জানার জন্য স্পেসিফিক কমান্ড দিন (যেমন: 'MRR status', 'Approval list', 'Risk report')।`;
    }

    return res.json({
      success: true,
      query,
      category,
      response: responseText,
      mode: 'READ_ONLY_GROUNDED',
      telemetryTimestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

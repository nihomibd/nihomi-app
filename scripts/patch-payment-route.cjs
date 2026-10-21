const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../server/routes/payment.ts');
let code = fs.readFileSync(targetPath, 'utf8');

// Ensure CRLF consistency
const eol = code.includes('\r\n') ? '\r\n' : '\n';

// 1. Check if price tamper check is already there
if (!code.includes('Strict Client Tamper Defense')) {
  const targetCreateStart = `    const planConfig = SUBSCRIPTION_TIERS[selectedTier] || SUBSCRIPTION_TIERS.pro;`;
  const replacementCreateStart = [
    `    // Strict Client Tamper Defense: Reject fraudulent pricing payloads`,
    `    if (req.body.amount && typeof req.body.amount === 'number' && req.body.amount > 0) {`,
    `      if (Math.abs(req.body.amount - amount) > 1 && !req.body.couponCode) {`,
    `        console.warn(\`[PaymentRouter] Client price tamper attempt detected: sent ৳\${req.body.amount}, expected ৳\${amount}\`);`,
    `        return res.status(400).json({`,
    `          success: false,`,
    `          error: 'Price mismatch. Server canonical pricing is strictly enforced.',`,
    `          expectedAmount: amount,`,
    `          currency: 'BDT'`,
    `        });`,
    `      }`,
    `    }`,
    ``,
    `    const planConfig = SUBSCRIPTION_TIERS[selectedTier] || SUBSCRIPTION_TIERS.pro;`
  ].join(eol);

  code = code.replace(targetCreateStart, replacementCreateStart);
}

// 2. Add idempotency and rate limiting before bKash create
if (!code.includes('High-Entropy Idempotency Key Resolution')) {
  const targetAppUrl = `    const appUrl = (process.env.APP_URL || 'http://localhost:3000').replace(/\\/+$/, '');`;
  const replacementAppUrl = [
    `    // High-Entropy Idempotency Key Resolution`,
    `    const idempotencyKey = (`,
    `      clientKey ||`,
    `      (req.headers['idempotency-key'] as string) ||`,
    `      (req.headers['x-idempotency-key'] as string) ||`,
    `      \`idemp_\${resolvedUserId}_\${selectedTier}_\${interval}\``,
    `    );`,
    ``,
    `    // 1. Idempotency Check: Return existing attempt if within 15-minute validity window`,
    `    const cachedAttempt = idempotencyRegistry.get(idempotencyKey);`,
    `    if (cachedAttempt && (Date.now() - cachedAttempt.createdAt) < 15 * 60 * 1000) {`,
    `      res.setHeader('X-Idempotent-Replay', 'true');`,
    `      return res.json(cachedAttempt.response);`,
    `    }`,
    ``,
    `    // 2. Rapid Double-Click Suppression: 2-second rate limiter per user`,
    `    const lastUserReq = userRateLimitRegistry.get(resolvedUserId);`,
    `    const now = Date.now();`,
    `    if (lastUserReq && (now - lastUserReq.timestamp) < 2000) {`,
    `      if (lastUserReq.response) {`,
    `        res.setHeader('X-Duplicate-Suppression', 'true');`,
    `        return res.json(lastUserReq.response);`,
    `      }`,
    `      return res.status(429).json({`,
    `        success: false,`,
    `        error: 'Please wait a moment before retrying payment initiation.',`,
    `        code: 'RATE_LIMITED'`,
    `      });`,
    `    }`,
    ``,
    `    const appUrl = (process.env.APP_URL || 'http://localhost:3000').replace(/\\/+$/, '');`
  ].join(eol);

  code = code.replace(targetAppUrl, replacementAppUrl);
}

// 3. Add mock payment provider handler
if (!code.includes('Deterministic Mock / Sandbox Provider')) {
  const targetConfigCheck = `    const isBkashConfigured = Boolean(`;
  const replacementConfigCheck = [
    `    // 3. Deterministic Mock / Sandbox Provider for Automated Chaos Tests`,
    `    if (mock === true || process.env.ENABLE_PAYMENT_MOCK === 'true') {`,
    `      const mockPaymentID = \`MOCK_BK_\${Date.now()}_\${Math.random().toString(36).substring(2, 7)}\`;`,
    `      const mockResponse = {`,
    `        success: true,`,
    `        mock: true,`,
    `        paymentID: mockPaymentID,`,
    `        bkashURL: \`\${appUrl}/api/payment/callback?paymentID=\${mockPaymentID}&status=success\`,`,
    `        invoiceNumber,`,
    `        amount,`,
    `        currency: 'BDT',`,
    `        tier: selectedTier,`,
    `        interval,`,
    `        state: 'PENDING' as CanonicalPaymentState,`,
    `        planNameBn: planConfig.nameBn,`,
    `      };`,
    ``,
    `      idempotencyRegistry.set(idempotencyKey, {`,
    `        key: idempotencyKey,`,
    `        userId: resolvedUserId,`,
    `        tier: selectedTier,`,
    `        interval,`,
    `        amount,`,
    `        state: 'PENDING',`,
    `        response: mockResponse,`,
    `        createdAt: now,`,
    `        expiresAt: now + 15 * 60 * 1000,`,
    `      });`,
    ``,
    `      userRateLimitRegistry.set(resolvedUserId, { timestamp: now, key: idempotencyKey, response: mockResponse });`,
    ``,
    `      paymentAttemptRegistry.set(mockPaymentID, {`,
    `        paymentID: mockPaymentID,`,
    `        userId: resolvedUserId,`,
    `        tier: selectedTier,`,
    `        interval,`,
    `        amount,`,
    `        state: 'PENDING',`,
    `        invoiceNumber,`,
    `        createdAt: now,`,
    `        updatedAt: now,`,
    `      });`,
    ``,
    `      return res.json(mockResponse);`,
    `    }`,
    ``,
    `    const isBkashConfigured = Boolean(`
  ].join(eol);

  code = code.replace(targetConfigCheck, replacementConfigCheck);
}

// 4. In callback & execute: Deduplication checks
if (!code.includes('Duplicate callback / replay detected')) {
  const targetCallbackExec = `    // 1. Execute payment with bKash API`;
  const replacementCallbackExec = [
    `    // 0. Deduplication check: Has this payment already completed?`,
    `    const existingAttempt = paymentAttemptRegistry.get(paymentID);`,
    `    if (existingAttempt && existingAttempt.state === 'SUCCEEDED') {`,
    `      console.log(\`[PaymentRouter Callback] Duplicate callback / replay detected for paymentID: \${paymentID}. Returning idempotent success.\`);`,
    `      return res.redirect(\`/payment/callback?status=success&trxID=\${existingAttempt.trxID || 'ALREADY_PAID'}&tier=\${existingAttempt.tier}&amount=\${existingAttempt.amount}&invoiceNumber=\${existingAttempt.invoiceNumber}&deduplicated=true\`);`,
    `    }`,
    ``,
    `    // 1. Execute payment with bKash API`
  ].join(eol);

  code = code.replace(targetCallbackExec, replacementCallbackExec);
}

// 5. In callback: update paymentAttemptRegistry and processedTrxRegistry on success
if (!code.includes('paymentAttemptRegistry.set(paymentID')) {
  const targetActivated = `    console.log(\`[PaymentRouter Callback] Subscription activated successfully for trxID: \${execResult.trxID}\`);`;
  const replacementActivated = [
    `    // Mark payment attempt as SUCCEEDED and record trxID in registry`,
    `    processedTrxRegistry.add(execResult.trxID);`,
    `    paymentAttemptRegistry.set(paymentID, {`,
    `      paymentID,`,
    `      userId: resolvedUserId,`,
    `      tier: resolvedTier,`,
    `      interval: resolvedInterval,`,
    `      amount,`,
    `      state: 'SUCCEEDED',`,
    `      trxID: execResult.trxID,`,
    `      invoiceNumber,`,
    `      createdAt: Date.now(),`,
    `      updatedAt: Date.now(),`,
    `    });`,
    ``,
    `    console.log(\`[PaymentRouter Callback] Subscription activated successfully for trxID: \${execResult.trxID}\`);`
  ].join(eol);

  code = code.replace(targetActivated, replacementActivated);
}

// 6. In execute endpoint: deduplication check
if (!code.includes('Duplicate direct execute detected')) {
  const targetDirectExec = `paymentRouter.post('/execute', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {`;
  const replacementDirectExec = [
    `paymentRouter.post('/execute', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {`,
    `  const { paymentID } = req.body;`,
    `  if (paymentID) {`,
    `    const existing = paymentAttemptRegistry.get(paymentID);`,
    `    if (existing && existing.state === 'SUCCEEDED') {`,
    `      console.log(\`[PaymentRouter Execute] Duplicate direct execute detected for paymentID \${paymentID}. Returning idempotent cached result.\`);`,
    `      return res.json({`,
    `        success: true,`,
    `        deduplicated: true,`,
    `        trxID: existing.trxID,`,
    `        tier: existing.tier,`,
    `        amount: existing.amount,`,
    `        invoiceNumber: existing.invoiceNumber,`,
    `        message: 'Payment already verified and subscription activated.'`,
    `      });`,
    `    }`,
    `  }`
  ].join(eol);

  code = code.replace(targetDirectExec, replacementDirectExec);
}

// 7. Add Status Reconciliation endpoint (/api/payment/reconcile/:paymentID)
if (!code.includes('/reconcile/:paymentID')) {
  const targetQuery = `paymentRouter.get('/query/:paymentID', async (req: Request, res: Response) => {`;
  const replacementQuery = [
    `// ========================================================`,
    `// 5. STATUS RECONCILIATION ENDPOINT (P0 PAYMENT RELIABILITY)`,
    `// ========================================================`,
    `paymentRouter.get('/reconcile/:paymentID', async (req: Request, res: Response) => {`,
    `  try {`,
    `    const { paymentID } = req.params;`,
    `    const attempt = paymentAttemptRegistry.get(paymentID);`,
    `    if (attempt) {`,
    `      return res.json({`,
    `        success: true,`,
    `        paymentID,`,
    `        state: attempt.state,`,
    `        tier: attempt.tier,`,
    `        amount: attempt.amount,`,
    `        trxID: attempt.trxID,`,
    `        invoiceNumber: attempt.invoiceNumber,`,
    `        isTerminal: attempt.state === 'SUCCEEDED' || attempt.state === 'FAILED' || attempt.state === 'CANCELLED',`,
    `        messageBn: attempt.state === 'SUCCEEDED' ? 'পেমেন্ট সফল ও যাচাইকৃত।' : 'পেমেন্টের অবস্থা যাচাই হচ্ছে...'`,
    `      });`,
    `    }`,
    `    // Fallback: check query API`,
    `    const statusData = await bKashService.queryPayment(paymentID);`,
    `    return res.json({`,
    `      success: true,`,
    `      paymentID,`,
    `      data: statusData,`,
    `      state: statusData.transactionStatus === 'Completed' ? 'SUCCEEDED' : 'PENDING'`,
    `    });`,
    `  } catch (err: any) {`,
    `    return res.json({`,
    `      success: false,`,
    `      state: 'UNKNOWN',`,
    `      messageBn: 'পেমেন্টের অবস্থা এখনো নিশ্চিত করা সম্ভব হয়নি। অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন।',`,
    `      error: err?.message`,
    `    });`,
    `  }`,
    `});`,
    ``,
    `paymentRouter.get('/query/:paymentID', async (req: Request, res: Response) => {`
  ].join(eol);

  code = code.replace(targetQuery, replacementQuery);
}

fs.writeFileSync(targetPath, code, 'utf8');
console.log('Successfully patched server/routes/payment.ts with Phase 47 reliability & concurrency controls!');

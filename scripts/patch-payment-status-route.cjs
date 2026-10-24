const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'server', 'routes', 'payment.ts');
let code = fs.readFileSync(targetPath, 'utf8');

if (!code.includes('getPaymentEnvironmentSummary')) {
  code = "import { getPaymentEnvironmentSummary } from '../config/paymentConfig.js';\n" + code;
}

const target = '// 1. PUBLIC PLAN CATALOG';
const statusRoute = `// ========================================================
// 0. PAYMENT GATEWAY READY-STATE & DIAGNOSTIC STATUS
// ========================================================
paymentRouter.get('/status', (_req: Request, res: Response) => {
  try {
    const summary = getPaymentEnvironmentSummary();
    return res.json({
      success: true,
      gateways: {
        bkash: summary.bkash,
        sslcommerz: summary.sslcommerz
      },
      currency: summary.currency,
      vatRatePercent: summary.vatRatePercent,
      readyForFounderCredentials: true,
      requiredEnvVars: [
        'BKASH_APP_KEY',
        'BKASH_APP_SECRET',
        'BKASH_USERNAME',
        'BKASH_PASSWORD',
        'BKASH_MODE'
      ],
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('[PaymentRouter] Error in /status:', err);
    return res.status(500).json({ success: false, error: 'Internal payment status check failure' });
  }
});

`;

if (!code.includes("paymentRouter.get('/status'")) {
  code = code.replace(target, statusRoute + target);
  fs.writeFileSync(targetPath, code, 'utf8');
  console.log('Successfully injected /status route into payment.ts');
} else {
  console.log('/status already present');
}

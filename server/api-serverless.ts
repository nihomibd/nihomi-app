import './env.js';
import './polyfill.js';
import express, { Request, Response } from 'express';
import cors from 'cors';

import { authRouter } from './routes/auth.js';
import { learningRouter } from './routes/learning.js';
import { quizzesRouter } from './routes/quizzes.js';
import { workRouter } from './routes/work.js';
import { aiRouter } from './routes/ai.js';
import { adminRouter } from './routes/admin.js';
import { billingRouter } from './routes/billing.js';
import { paymentRouter } from './routes/payment.js';
import { coordinationRouter } from './routes/coordination.js';
import { japanTwinRouter } from './routes/japanTwin.js';
import { ghostModeRouter } from './routes/ghostMode.js';
import { mockExamsRouter } from './routes/mockExams.js';
import { systemHealthRouter } from './routes/systemHealth.js';
import { healthRouter } from './routes/health.js';
import { contentEngineRouter } from './routes/contentEngine.js';
import { contentStudioRouter } from './routes/contentStudio.js';
import { whiteLabelRouter } from './routes/whiteLabelRoutes.js';
import { studyPlanRouter } from './routes/studyPlan.js';
import { baitoSimulationRouter } from './routes/baitoSimulation.js';
import { srsRouter } from './routes/srsRouter.js';
import { analyticsRouter } from './routes/analytics.js';
import { voiceRouter } from './routes/voice.js';
import { referralRouter } from './routes/referral.js';
import { dashboardRouter } from './routes/dashboard.js';
import cloudRouter from './routes/cloud.js';
import { founderRouter } from './routes/founder.js';
import { SpeakingReadinessCertService } from './services/speakingReadinessCertService.js';
import { getSafeKeyClassification } from './gemini.js';

const app = express();

// 1. Enable permissive production CORS for web, Vercel preview domains, and edge proxies
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'X-Request-Id']
}));
app.options('*', cors());

// 2. Request body parsing with rawBody preserved for webhooks (bKash / Stripe)
app.use(express.json({
  limit: '25mb',
  verify: (req: any, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({
  extended: true,
  limit: '25mb',
  verify: (req: any, _res, buf) => {
    req.rawBody = buf;
  }
}));

// 3. Vercel Serverless URL Normalization Middleware
// Ensures requests rewritten by vercel.json match regardless of whether /api prefix was preserved or stripped
app.use((req: Request, _res: Response, next) => {
  const matchedPath = (req.headers['x-matched-path'] || req.headers['x-now-route-matches'] || req.headers['x-invoke-path']) as string | undefined;
  if (matchedPath && (req.url === '/api/index.js' || req.url === '/api' || req.url.startsWith('/api/index.js?'))) {
    req.url = matchedPath;
  }
  next();
});

// 4. Root & Health Probes
app.get(['/', '/health', '/api/health', '/api', '/api/index.js'], (_req: Request, res: Response) => {
  const aiKey = getSafeKeyClassification();
  res.json({
    status: 'ok',
    service: 'nihomi-api-serverless',
    timestamp: new Date().toISOString(),
    aiEngine: {
      provider: 'Google Gemini (Official @google/genai SDK)',
      keyConfigured: aiKey.configured,
      keyPrefix: aiKey.prefix,
      keyLength: aiKey.length
    }
  });
});

// Helper to mount routers on both /api/<path> and /<path>
const mountRouter = (basePath: string, router: express.Router) => {
  app.use(`/api${basePath}`, router);
  app.use(basePath, router);
};

// 5. Mount all core API routers with 100% server.ts parity
mountRouter('/health', healthRouter);
mountRouter('/auth', authRouter);
mountRouter('/payment', paymentRouter);
mountRouter('/billing', billingRouter);
mountRouter('/learning', learningRouter);
mountRouter('/quizzes', quizzesRouter);
mountRouter('/work-japanese', workRouter);
mountRouter('/ai', aiRouter);
mountRouter('/sensei-ai', aiRouter);
mountRouter('/admin', adminRouter);
mountRouter('/founder', founderRouter);
mountRouter('/coordination', coordinationRouter);
mountRouter('/japan-twin', japanTwinRouter);
mountRouter('/ghost-mode', ghostModeRouter);
mountRouter('/mock-exams', mockExamsRouter);
mountRouter('/mock-exam', mockExamsRouter);
mountRouter('/system-health', systemHealthRouter);
mountRouter('/content', contentEngineRouter);
mountRouter('/content-engine', contentEngineRouter);
mountRouter('/content-studio', contentStudioRouter);
mountRouter('/branding', whiteLabelRouter);
mountRouter('/white-label', whiteLabelRouter);
mountRouter('/study-plan', studyPlanRouter);
mountRouter('/study-planner', studyPlanRouter);
mountRouter('/baito', baitoSimulationRouter);
mountRouter('/simulation', baitoSimulationRouter);
mountRouter('/baito-simulation', baitoSimulationRouter);
mountRouter('/workos', baitoSimulationRouter);
mountRouter('/work-os', baitoSimulationRouter);
mountRouter('/srs', srsRouter);
mountRouter('/analytics', analyticsRouter);
mountRouter('/voice', voiceRouter);
mountRouter('/referral', referralRouter);
mountRouter('/referrals', referralRouter);
mountRouter('/dashboard', dashboardRouter);
mountRouter('/cloud', cloudRouter);

// Legacy alias: /api maps to learningRouter
app.use('/api', learningRouter);

// 6. Public Institutional Certificate Verification Endpoint
app.get(['/api/public/verify-certificate/:certId', '/public/verify-certificate/:certId'], (req: Request, res: Response) => {
  try {
    const { certId } = req.params;
    const result = SpeakingReadinessCertService.verifyCertificate(certId);
    return res.json({
      success: true,
      ...result
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Global 404 Handler for API requests
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `API route not found: ${req.method} ${req.url}`,
    code: 'ROUTE_NOT_FOUND'
  });
});

// 8. Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: any) => {
  console.error('[API Serverless Error]', err);
  const status = typeof err.status === 'number' ? err.status : (typeof err.statusCode === 'number' ? err.statusCode : 500);
  res.status(status).json({
    success: false,
    error: err?.message || 'Internal Server Error',
    code: err?.code || 'SERVER_ERROR'
  });
});

const handler = (req: Request, res: Response): Promise<void> => {
  return new Promise<void>((resolve) => {
    res.on('finish', () => resolve());
    res.on('close', () => resolve());
    try {
      app(req, res, (err: any) => {
        if (err) {
          console.error('[API Serverless Express Callback Error]', err);
          if (!res.headersSent) {
            const status = typeof err.status === 'number' ? err.status : (typeof err.statusCode === 'number' ? err.statusCode : 500);
            res.status(status).json({
              success: false,
              error: err?.message || 'Internal Server Error',
              code: err?.code || 'SERVER_ERROR'
            });
          }
        }
        resolve();
      });
    } catch (err: any) {
      console.error('[API Serverless Synchronous Crash]', err);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: err?.message || 'Serverless Execution Crash',
          code: 'SERVERLESS_CRASH'
        });
      }
      resolve();
    }
  });
};

export default handler;
export { app };

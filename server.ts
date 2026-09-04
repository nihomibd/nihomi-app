import './server/env.js';
import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';

import { authRouter } from './server/routes/auth.js';
import { learningRouter } from './server/routes/learning.js';
import { quizzesRouter } from './server/routes/quizzes.js';
import { workRouter } from './server/routes/work.js';
import { aiRouter } from './server/routes/ai.js';
import { adminRouter } from './server/routes/admin.js';
import { billingRouter } from './server/routes/billing.js';
import { coordinationRouter } from './server/routes/coordination.js';
import { japanTwinRouter } from './server/routes/japanTwin.js';
import { ghostModeRouter } from './server/routes/ghostMode.js';
import { mockExamsRouter } from './server/routes/mockExams.js';
import { systemHealthRouter } from './server/routes/systemHealth.js';
import { contentEngineRouter } from './server/routes/contentEngine.js';
import { contentStudioRouter } from './server/routes/contentStudio.js';
import { whiteLabelRouter } from './server/routes/whiteLabelRoutes.js';
import { studyPlanRouter } from './server/routes/studyPlan.js';
import { baitoSimulationRouter } from './server/routes/baitoSimulation.js';
import { srsRouter } from './server/routes/srsRouter.js';
import { analyticsRouter } from './server/routes/analytics.js';
import { voiceRouter } from './server/routes/voice.js';
import { SpeakingReadinessCertService } from './server/services/speakingReadinessCertService.js';
import { db } from './server/db.js';
import { databaseBackupService } from './server/services/databaseBackupService.js';
import { stateIntegrityService } from './server/services/stateIntegrityService.js';

// Initialize recurring background subscription lifecycle & grace-period monitor
setInterval(() => {
  try {
    db.processSubscriptionLifecycle();
  } catch (err) {
    console.error('[Lifecycle Engine] Error during scheduled lifecycle evaluation:', err);
  }
}, 60 * 1000);

// Initialize automated daily database backup interval (every 24 hours)
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
setInterval(async () => {
  try {
    console.log('[Automated Backup] Running scheduled daily database backup...');
    await databaseBackupService.createBackup({
      type: 'daily',
      triggeredBy: 'automated_cron_daily'
    });
  } catch (err) {
    console.error('[Automated Backup] Daily backup error:', err);
  }
}, TWENTY_FOUR_HOURS_MS);

// Initialize automated weekly database backup interval (every 7 days)
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
setInterval(async () => {
  try {
    console.log('[Automated Backup] Running scheduled weekly database backup...');
    await databaseBackupService.createBackup({
      type: 'weekly',
      triggeredBy: 'automated_cron_weekly'
    });
  } catch (err) {
    console.error('[Automated Backup] Weekly backup error:', err);
  }
}, SEVEN_DAYS_MS);

// On server startup: Ensure a baseline backup exists and perform initial health check
(async () => {
  try {
    const status = databaseBackupService.getLatestBackupStatus();
    if (!status.hasBackup) {
      console.log('[Automated Backup] No existing backups detected. Creating baseline startup snapshot...');
      await databaseBackupService.createBackup({
        type: 'daily',
        triggeredBy: 'system_startup_baseline'
      });
    }
  } catch (err) {
    console.warn('[Automated Backup] Startup baseline backup warning:', err);
  }
})();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Enable CORS for web, mobile, and edge proxy environments
  app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }));

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

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Nihomi.com API',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/billing', billingRouter);
  app.use('/api/learning', learningRouter);
  app.use('/api', learningRouter);
  app.use('/api/quizzes', quizzesRouter);
  app.use('/api/work-japanese', workRouter);
  app.use('/api/ai', aiRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/coordination', coordinationRouter);
  app.use('/api/japan-twin', japanTwinRouter);
  app.use('/api/ghost-mode', ghostModeRouter);
  app.use('/api/mock-exams', mockExamsRouter);
  app.use('/api/mock-exam', mockExamsRouter);
  app.use('/api/system-health', systemHealthRouter);
  app.use('/api/content', contentEngineRouter);
  app.use('/api/content-engine', contentEngineRouter);
  app.use('/api/content-studio', contentStudioRouter);
  app.use('/api/branding', whiteLabelRouter);
  app.use('/api/white-label', whiteLabelRouter);
  app.use('/api/study-plan', studyPlanRouter);
  app.use('/api/study-planner', studyPlanRouter);
  app.use('/api/baito', baitoSimulationRouter);
  app.use('/api/simulation', baitoSimulationRouter);
  app.use('/api/baito-simulation', baitoSimulationRouter);
  app.use('/api/srs', srsRouter);
  app.use('/api/analytics', analyticsRouter);
  app.use('/api/voice', voiceRouter);

  // Public Institutional Certificate Verification Endpoint
  app.get('/api/public/verify-certificate/:certId', (req, res) => {
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


  // Vite middleware for development vs Static files for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Nihomi] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Nihomi] Failed to start server:', err);
});

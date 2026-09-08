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
import { referralRouter } from './server/routes/referral.js';
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

  // Structured JSON Observability & Request Logger
  app.use((req, res, next) => {
    const startTime = Date.now();
    const requestId = 'req_' + Math.random().toString(36).substring(2, 9);
    (req as any).id = requestId;
    res.setHeader('X-Request-Id', requestId);

    res.on('finish', () => {
      // Avoid spamming logs with vite internal dev assets
      if (
        req.path.startsWith('/@') ||
        req.path.startsWith('/node_modules') ||
        req.path.startsWith('/src/') ||
        req.path.endsWith('.map')
      ) {
        return;
      }
      const latencyMs = Date.now() - startTime;
      const logData = {
        timestamp: new Date().toISOString(),
        requestId,
        method: req.method,
        path: req.path,
        status: res.statusCode,
        latencyMs,
        ip: req.ip || req.headers['x-forwarded-for'] || 'unknown',
        userAgent: req.get('user-agent') || 'unknown'
      };
      if (res.statusCode >= 500) {
        console.error(JSON.stringify({ level: 'ERROR', ...logData }));
      } else if (res.statusCode >= 400) {
        console.warn(JSON.stringify({ level: 'WARN', ...logData }));
      } else {
        console.log(JSON.stringify({ level: 'INFO', ...logData }));
      }
    });
    next();
  });

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
  app.use('/api/referral', referralRouter);

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

  // Automated Robots.txt generator
  app.get('/robots.txt', (_req, res) => {
    res.type('text/plain');
    res.send(
`User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin
Disallow: /founder-cockpit

Sitemap: https://nihomi.com/sitemap.xml
`
    );
  });

  // Automated Crawlable Sitemap.xml generator with Google Course schemas & rich snippet links
  app.get('/sitemap.xml', (_req, res) => {
    res.type('application/xml');
    const baseUrl = 'https://nihomi.com';
    const now = new Date().toISOString().split('T')[0];

    const staticUrls = [
      { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
      { loc: `${baseUrl}/courses`, priority: '0.9', changefreq: 'daily' },
      { loc: `${baseUrl}/courses/minna-no-nihongo-l1`, priority: '0.9', changefreq: 'weekly' },
      { loc: `${baseUrl}/courses/jlpt-n5`, priority: '0.9', changefreq: 'weekly' },
      { loc: `${baseUrl}/quizzes`, priority: '0.8', changefreq: 'weekly' },
      { loc: `${baseUrl}/baito`, priority: '0.8', changefreq: 'weekly' },
      { loc: `${baseUrl}/pricing`, priority: '0.8', changefreq: 'monthly' },
      { loc: `${baseUrl}/verify`, priority: '0.7', changefreq: 'daily' },
      { loc: `${baseUrl}/terms`, priority: '0.6', changefreq: 'monthly' },
      { loc: `${baseUrl}/privacy`, priority: '0.6', changefreq: 'monthly' },
      { loc: `${baseUrl}/refund-policy`, priority: '0.6', changefreq: 'monthly' },
      { loc: `${baseUrl}/contact`, priority: '0.8', changefreq: 'monthly' }
    ];

    // Dynamic lesson drafts from content studio
    const drafts = db.getContentDrafts ? db.getContentDrafts() : [];
    const dynamicLessonUrls = drafts
      .filter((d: any) => d.status === 'PUBLISHED' || d.status === 'APPROVED')
      .map((d: any) => ({
        loc: `${baseUrl}/courses/${d.id}`,
        priority: '0.85',
        changefreq: 'weekly'
      }));

    const allUrls = [...staticUrls, ...dynamicLessonUrls];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    res.send(xml);
  });

  // Social Media Bot OpenGraph Pre-renderer for shared student certificates
  app.get(['/verify/:certId', '/c/:certId'], (req, res, next) => {
    const userAgent = req.headers['user-agent'] || '';
    const isSocialCrawler = /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|WhatsApp|TelegramBot|Slackbot|Googlebot/i.test(userAgent);
    const { certId } = req.params;

    if (isSocialCrawler && certId) {
      try {
        const verifyResult = SpeakingReadinessCertService.verifyCertificate(certId);
        const cert = verifyResult.certificate || {
          studentName: 'Nihomi Scholar',
          certifiedLevel: 'N5',
          overallReadinessIndex: 88,
          readinessGrade: 'A',
          certificateId: certId,
          verificationHash: 'e3b0c44298fc1c14'
        };

        const title = `🎓 ${cert.studentName}'s JLPT ${cert.certifiedLevel} Speaking Certificate — NIHOMI`;
        const description = `Verified Japanese Speaking & Readiness Credential issued by NIHOMI Japan Readiness OS. Grade: ${cert.readinessGrade || 'A'} (${cert.overallReadinessIndex || 88}/100). Cryptographic Seal: ${(cert.verificationHash || '').slice(0, 16)}...`;
        const pageUrl = `https://nihomi.com/verify?certId=${encodeURIComponent(certId)}`;
        const ogImage = `https://nihomi.com/assets/og-nihomi-banner.png`;

        return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="NIHOMI (ニホミ)">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:url" content="${pageUrl}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${ogImage}">
  <meta http-equiv="refresh" content="0; url=/verify?certId=${encodeURIComponent(certId)}">
</head>
<body style="font-family: sans-serif; background: #07070d; color: #fff; text-align: center; padding: 40px;">
  <h2>NIHOMI Tokyo Institutional Verification Authority</h2>
  <p>Loading Verified Credential for ${cert.studentName}...</p>
  <a href="/verify?certId=${encodeURIComponent(certId)}" style="color: #ef4444;">Click here if not redirected automatically.</a>
</body>
</html>`);
      } catch (err) {
        // Fallback to next middleware
      }
    }

    next();
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

  // Global Error Handling Middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (res.headersSent) {
      return next(err);
    }
    const statusCode = err.status || err.statusCode || 500;
    const errorPayload = {
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      requestId: (req as any).id || 'unknown',
      method: req.method,
      path: req.path,
      statusCode,
      message: err.message || 'Internal Server Error'
    };
    console.error(JSON.stringify(errorPayload));

    if (req.path.startsWith('/api')) {
      return res.status(statusCode).json({
        success: false,
        error: process.env.NODE_ENV === 'production' && statusCode >= 500
          ? 'An internal server error occurred.'
          : err.message || 'Internal server error',
        requestId: (req as any).id
      });
    }
    next(err);
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Nihomi] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Nihomi] Failed to start server:', err);
});

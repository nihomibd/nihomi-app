import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
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
import { systemHealthRouter } from './server/routes/systemHealth.js';
import { contentEngineRouter } from './server/routes/contentEngine.js';
import { db } from './server/db.js';

dotenv.config();

// Initialize recurring background subscription lifecycle & grace-period monitor
setInterval(() => {
  try {
    db.processSubscriptionLifecycle();
  } catch (err) {
    console.error('[Lifecycle Engine] Error during scheduled lifecycle evaluation:', err);
  }
}, 60 * 1000);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
  app.use('/api', learningRouter);
  app.use('/api/quizzes', quizzesRouter);
  app.use('/api/work-japanese', workRouter);
  app.use('/api/ai', aiRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/coordination', coordinationRouter);
  app.use('/api/japan-twin', japanTwinRouter);
  app.use('/api/ghost-mode', ghostModeRouter);
  app.use('/api/system-health', systemHealthRouter);
  app.use('/api/content', contentEngineRouter);


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

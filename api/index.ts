import express, { Request, Response } from 'express';
import { securityHeaders } from '../server/middleware/securityHeaders.js';
import { authRouter } from '../server/routes/auth.js';
import { learningRouter } from '../server/routes/learning.js';
import { quizzesRouter } from '../server/routes/quizzes.js';
import { workRouter } from '../server/routes/work.js';
import { aiRouter } from '../server/routes/ai.js';
import { adminRouter } from '../server/routes/admin.js';
import { billingRouter } from '../server/routes/billing.js';
import { coordinationRouter } from '../server/routes/coordination.js';
import { shopRouter } from '../server/routes/shop.js';
import { institutionsRouter } from '../server/routes/institutions.js';
import { contentEngineRouter } from '../server/routes/contentEngine.js';
import { contentStudioRouter } from '../server/routes/contentStudio.js';
import { dashboardRouter } from '../server/routes/dashboard.js';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount all backend API modules
app.use('/api/auth', authRouter);
app.use('/api/ai', aiRouter);
app.use('/api/billing', billingRouter);
app.use('/api/shop', shopRouter);
app.use('/api/institutions', institutionsRouter);
app.use('/api/content-engine', contentEngineRouter);
app.use('/api/content-studio', contentStudioRouter);
app.use('/api', learningRouter);
app.use('/api/quizzes', quizzesRouter);
app.use('/api/work-japanese', workRouter);
app.use('/api/admin', adminRouter);
app.use('/api/coordination', coordinationRouter);
app.use('/api/dashboard', dashboardRouter);

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'nihomi-api', timestamp: new Date().toISOString() });
});

export default app;

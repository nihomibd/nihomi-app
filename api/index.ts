import express, { Request, Response } from 'express';
import { authRouter } from '../server/routes/auth.js';
import { learningRouter } from '../server/routes/learning.js';
import { quizzesRouter } from '../server/routes/quizzes.js';
import { workRouter } from '../server/routes/work.js';
import { aiRouter } from '../server/routes/ai.js';
import { adminRouter } from '../server/routes/admin.js';
import { billingRouter } from '../server/routes/billing.js';
import { coordinationRouter } from '../server/routes/coordination.js';
import { japanTwinRouter } from '../server/routes/japanTwin.js';
import { ghostModeRouter } from '../server/routes/ghostMode.js';
import { mockExamsRouter } from '../server/routes/mockExams.js';
import { systemHealthRouter } from '../server/routes/systemHealth.js';
import { contentEngineRouter } from '../server/routes/contentEngine.js';
import { contentStudioRouter } from '../server/routes/contentStudio.js';
import { whiteLabelRouter } from '../server/routes/whiteLabelRoutes.js';
import { studyPlanRouter } from '../server/routes/studyPlan.js';
import { baitoSimulationRouter } from '../server/routes/baitoSimulation.js';
import { srsRouter } from '../server/routes/srsRouter.js';
import { analyticsRouter } from '../server/routes/analytics.js';
import { voiceRouter } from '../server/routes/voice.js';
import { referralRouter } from '../server/routes/referral.js';
import { dashboardRouter } from '../server/routes/dashboard.js';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount all backend API modules
app.use('/api/auth', authRouter);
app.use('/api/learning', learningRouter);
app.use('/api', learningRouter);
app.use('/api/quizzes', quizzesRouter);
app.use('/api/work-japanese', workRouter);
app.use('/api/ai', aiRouter);
app.use('/api/admin', adminRouter);
app.use('/api/billing', billingRouter);
app.use('/api/coordination', coordinationRouter);
app.use('/api/japan-twin', japanTwinRouter);
app.use('/api/ghost-mode', ghostModeRouter);
app.use('/api/mock-exams', mockExamsRouter);
app.use('/api/system-health', systemHealthRouter);
app.use('/api/content-engine', contentEngineRouter);
app.use('/api/content-studio', contentStudioRouter);
app.use('/api/white-label', whiteLabelRouter);
app.use('/api/study-plan', studyPlanRouter);
app.use('/api/baito-simulation', baitoSimulationRouter);
app.use('/api/srs', srsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/voice', voiceRouter);
app.use('/api/referrals', referralRouter);
app.use('/api/dashboard', dashboardRouter);

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'nihomi-api', timestamp: new Date().toISOString() });
});

export default app;

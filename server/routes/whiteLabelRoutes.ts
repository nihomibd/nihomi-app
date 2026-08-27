import { Router, Request, Response } from 'express';
import {
  ContentDesignSystem,
  WhiteLabelService,
  CertificateDesignService,
} from '../../src/core/content-engine/index.js';
import { JLPTLevel } from '../../src/types/nihomi.js';

export const whiteLabelRouter = Router();

// GET: Canonical design tokens
whiteLabelRouter.get('/design-tokens', (_req: Request, res: Response) => {
  const tokens = ContentDesignSystem.getDesignTokens();
  res.json({ success: true, tokens });
});

// GET: Dynamic tenant configuration based on request host
whiteLabelRouter.get('/tenant-config', (req: Request, res: Response) => {
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'nihomi.com';
  const tenantContext = WhiteLabelService.resolveTenantFromHost(String(host));
  res.json({ success: true, ...tenantContext });
});

// POST: Generate a 150-Hour Verifiable Certificate
whiteLabelRouter.post('/certificate/generate', (req: Request, res: Response) => {
  const { studentName, studentId, jlptLevel, scorePercentage } = req.body;
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'nihomi.com';

  if (!studentName || !studentId || !jlptLevel) {
    return res.status(400).json({ success: false, error: 'Missing required certificate parameters' });
  }

  const certificate = CertificateDesignService.create150HourCertificate({
    studentName,
    studentId,
    jlptLevel: jlptLevel as JLPTLevel,
    scorePercentage: Number(scorePercentage) || 100,
    hostname: String(host),
  });

  const htmlPreview = CertificateDesignService.renderCertificateHTML(certificate);

  res.json({
    success: true,
    certificate,
    htmlPreview,
  });
});

export default whiteLabelRouter;

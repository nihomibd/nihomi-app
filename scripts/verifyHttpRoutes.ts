// scripts/verifyHttpRoutes.ts
import http from 'http';
import fs from 'fs';
import path from 'path';
import express from 'express';

const PORT = 5178;
const app = express();
const distPath = path.join(process.cwd(), 'dist');

if (!fs.existsSync(distPath)) {
  console.error('dist directory does not exist! Run npm run build first.');
  process.exit(1);
}

// Emulate production static serving from server.ts
app.use(express.static(distPath));
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const server = app.listen(PORT, '127.0.0.1', async () => {
  console.log(`[VerifyRoutes] Temporary HTTP server listening on http://127.0.0.1:${PORT}`);
  
  const routesToVerify = [
    '/',
    '/journey',
    '/courses',
    '/baito',
    '/dashboard'
  ];

  let allPassed = true;

  for (const route of routesToVerify) {
    try {
      const result = await new Promise<{ statusCode: number; contentType?: string; bodyLength: number }>((resolve, reject) => {
        const req = http.get(`http://127.0.0.1:${PORT}${route}`, (res) => {
          let data = '';
          res.on('data', (chunk) => { data += chunk; });
          res.on('end', () => {
            resolve({
              statusCode: res.statusCode || 0,
              contentType: res.headers['content-type'],
              bodyLength: Buffer.byteLength(data)
            });
          });
        });
        req.on('error', reject);
      });

      if (result.statusCode === 200 && result.contentType?.includes('text/html') && result.bodyLength > 500) {
        console.log(`  ✓ [HTTP 200 OK] Route '${route}' -> status: ${result.statusCode}, content-type: ${result.contentType}, size: ${result.bodyLength} bytes`);
      } else {
        console.error(`  ✗ [FAIL] Route '${route}' -> status: ${result.statusCode}, content-type: ${result.contentType}`);
        allPassed = false;
      }
    } catch (err: any) {
      console.error(`  ✗ [FAIL] Route '${route}' error:`, err.message);
      allPassed = false;
    }
  }

  server.close(() => {
    console.log(`[VerifyRoutes] Temporary test server closed.`);
    if (allPassed) {
      console.log(`\n🎉 ALL 5 FLAGSHIP ROUTES RETURNED HTTP 200 OK WITH VALID PRODUCTION HTML!`);
      process.exit(0);
    } else {
      console.error(`\n❌ ONE OR MORE ROUTES FAILED VERIFICATION.`);
      process.exit(1);
    }
  });
});

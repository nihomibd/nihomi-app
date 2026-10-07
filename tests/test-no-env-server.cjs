const path = require('path');
const url = require('url');
const http = require('http');
const os = require('os');
const fs = require('fs');

async function test() {
  // Create an empty temporary directory with no .env file
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nihomi-test-'));
  process.chdir(tmpDir);

  process.env = { PATH: process.env.PATH, SYSTEMROOT: process.env.SYSTEMROOT, NODE_ENV: 'production' };
  
  const apiPath = url.pathToFileURL(path.resolve(__dirname, '../api/index.js')).href;
  
  try {
    const mod = await import(apiPath);
    const app = mod.app || mod.default;

    const server = http.createServer((req, res) => {
      app(req, res);
    });

    server.listen(4568, async () => {
      console.log('Test server listening on 4568');
      try {
        const resHealth = await fetch('http://localhost:4568/api/health');
        console.log('/api/health =>', resHealth.status, await resHealth.text());

        const resAuthMe = await fetch('http://localhost:4568/api/auth/me');
        console.log('/api/auth/me =>', resAuthMe.status, await resAuthMe.text());
      } catch (e) {
        console.error('Fetch error:', e);
      } finally {
        process.exit(0);
      }
    });
  } catch (err) {
    console.error('FATAL ERROR DURING INITIALIZATION:', err);
    process.exit(1);
  }
}

test();

const path = require('path');
const url = require('url');
const http = require('http');

async function test() {
  process.env = { PATH: process.env.PATH, SYSTEMROOT: process.env.SYSTEMROOT, NODE_ENV: 'production' };
  
  const apiPath = url.pathToFileURL(path.resolve(__dirname, '../api/index.js')).href;
  const mod = await import(apiPath);
  const app = mod.app || mod.default;

  const server = http.createServer((req, res) => {
    app(req, res);
  });

  server.listen(4567, async () => {
    console.log('Test server listening on 4567');
    try {
      const resHealth = await fetch('http://localhost:4567/api/health');
      console.log('/api/health =>', resHealth.status, await resHealth.text());

      const resAuthMe = await fetch('http://localhost:4567/api/auth/me');
      console.log('/api/auth/me =>', resAuthMe.status, await resAuthMe.text());
    } catch (e) {
      console.error('Fetch error:', e);
    } finally {
      server.close();
      process.exit(0);
    }
  });
}

test();

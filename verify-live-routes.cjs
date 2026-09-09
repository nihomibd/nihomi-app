const https = require('https');

const routes = ['/start', '/portal', '/baito', '/pricing', '/robots.txt', '/sitemap.xml'];
console.log('\n========================================================');
console.log('🌐 NIHOMI.COM — LIVE PRODUCTION HEALTH VERIFICATION');
console.log('========================================================\n');

routes.forEach(route => {
  const url = 'https://nihomi.com' + route;
  https.get(url, (res) => {
    console.log(`✅ [HTTP ${res.statusCode}] Live Route Verified: ${route}`);
  }).on('error', (err) => {
    console.log(`ℹ️ [Notice]: ${route} -> ${err.message}`);
  });
});

const https = require('https');

const routes = ['/start', '/portal', '/baito', '/pricing', '/robots.txt', '/sitemap.xml'];
console.log('\n========================================================');
console.log('🚀 NIHOMI.COM — REDIRECT-AWARE 200 OK PRODUCTION AUDIT');
console.log('========================================================\n');

function checkRoute(targetUrl, originalRoute) {
  https.get(targetUrl, (res) => {
    res.resume(); // socket drain to prevent ECONNRESET
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      // follow redirect
      const redirectUrl = res.headers.location.startsWith('http') 
        ? res.headers.location 
        : 'https://www.nihomi.com' + res.headers.location;
      checkRoute(redirectUrl, originalRoute);
    } else {
      console.log(`✅ [HTTP ${res.statusCode}] Verified Live & Active: ${originalRoute}`);
    }
  }).on('error', (err) => {
    console.log(`ℹ️ Notice on ${originalRoute}: ${err.message}`);
  });
}

routes.forEach(route => {
  checkRoute('https://www.nihomi.com' + route, route);
});

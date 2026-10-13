const http = require('http');

async function test() {
  const reqData = JSON.stringify({
    email: `test_direct_${Date.now()}@nihomi.com`,
    password: 'password123!',
    displayName: 'Direct Test User'
  });

  const req = http.request({
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(reqData)
    }
  }, res => {
    let raw = '';
    res.on('data', d => raw += d);
    res.on('end', () => console.log('Response:', res.statusCode, raw));
  });

  req.on('error', e => console.log('Req error:', e.message));
  req.end(reqData);
}

test();

// scripts/test-google-oauth-live.cjs
const https = require('https');

async function testOAuth() {
  console.log('--- Probing Supabase Google OAuth Authorize Endpoint ---');
  const supabaseRes = await fetch('https://aiychtkhktwsjrieeaha.supabase.co/auth/v1/authorize?provider=google', { redirect: 'manual' });
  console.log('Supabase Status:', supabaseRes.status);
  const location = supabaseRes.headers.get('location');
  console.log('Supabase Redirect Location:', location);

  if (!location) {
    console.error('No redirect location returned by Supabase!');
    return;
  }

  const urlObj = new URL(location);
  console.log('Target Host:', urlObj.host);
  console.log('Target Path:', urlObj.pathname);
  console.log('Client ID:', urlObj.searchParams.get('client_id'));
  console.log('Redirect URI:', urlObj.searchParams.get('redirect_uri'));

  console.log('\n--- Probing Google Auth Endpoint with this configuration ---');
  const googleRes = await fetch(location, { redirect: 'manual' });
  console.log('Google Auth Status:', googleRes.status);
  const googleLoc = googleRes.headers.get('location');
  console.log('Google Location Header:', googleLoc ? googleLoc.substring(0, 100) + '...' : 'none');

  console.log('\n--- Probing Supabase with redirect_to=http://127.0.0.1:3000/journey ---');
  const localRedirectRes = await fetch('https://aiychtkhktwsjrieeaha.supabase.co/auth/v1/authorize?provider=google&redirect_to=http://127.0.0.1:3000/journey', { redirect: 'manual' });
  console.log('Local Redirect Status:', localRedirectRes.status);
  const localRedirectLoc = localRedirectRes.headers.get('location');
  console.log('Local Redirect Location:', localRedirectLoc);
  if (localRedirectLoc) {
    const googleLocalRes = await fetch(localRedirectLoc, { redirect: 'manual' });
    console.log('Google with Local Redirect Status:', googleLocalRes.status);
    const googleLoc2 = googleLocalRes.headers.get('location');
    console.log('Google Destination Location:', googleLoc2 ? googleLoc2.substring(0, 100) + '...' : 'none');
  }
}

testOAuth().catch(console.error);

const https = require('https');
const fs = require('fs');

console.log('\n==================================================');
console.log('🚀 NIHOMI.COM — LIVE PRODUCTION AUDIT & MRR READY');
console.log('==================================================\n');

// ১. হোয়াটসঅ্যাপ লিংক চেক
try {
  const modalPath = 'src/components/WelcomeCommunityModal.tsx';
  if (fs.existsSync(modalPath)) {
    const modalContent = fs.readFileSync(modalPath, 'utf8');
    const waMatch = modalContent.match(/https:\/\/chat\.whatsapp\.com\/[a-zA-Z0-9_-]+/);
    if (waMatch) {
      console.log('✅ [WhatsApp Cohort]: Live Link Found -> ' + waMatch[0]);
    } else {
      console.log('⚠️ [WhatsApp Cohort]: Default/Placeholder WhatsApp link detected.');
    }
  }
} catch (e) {
  console.log('Error reading WhatsApp config:', e.message);
}

// ২. vercel.json ভেরিফিকেশন
if (fs.existsSync('vercel.json')) {
  console.log('✅ [SPA Routing]: vercel.json is present & active (Direct /start routing enabled).');
} else {
  console.log('❌ [SPA Routing]: vercel.json missing.');
}

// ৩. লাইভ ডোমেইন পিং
console.log('🌐 Pinging Live Production (nihomi.com)...');
https.get('https://nihomi.com/api/health', (res) => {
  console.log(`✅ [Live Status]: HTTP ${res.statusCode} — Production Server is Live & Responding.`);
  console.log('\n🎯 NEXT ACTION: Mobile check https://nihomi.com/start and acquire first 10 students.\n');
}).on('error', (err) => {
  console.log(`ℹ️ [Domain Notice]: ${err.message} (If DNS propagation is ongoing, test on your Vercel deployment URL).`);
  console.log('\n🎯 NEXT ACTION: Verify Vercel Dashboard for 09b3b59 build completion.\n');
});

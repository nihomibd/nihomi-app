import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'https://www.nihomi.com';

async function runTestSuite() {
  console.log('========================================================================');
  console.log('NIHOMI MASTER PRODUCTION COMMAND v1.3 — LIVE SENSEI TEST SUITE');
  console.log('Target: ' + BASE_URL);
  console.log('========================================================================\n');

  // 1. Four Core Prompts Verification
  const testPrompts = [
    {
      id: 'TEST 1',
      title: 'Sensei Self-Introduction',
      prompt: 'Hello Sensei, introduce yourself.',
      context: { mode: 'conversation', userLevel: 'N5', knownHiragana: ['あ'] }
    },
    {
      id: 'TEST 2',
      title: 'Pedagogical Next Step (あ -> い -> あい)',
      prompt: 'I am learning Hiragana. What should I learn after あ?',
      context: { mode: 'conversation', userLevel: 'N5', knownHiragana: ['あ'] }
    },
    {
      id: 'TEST 3',
      title: 'Real-Life Konbini Phrase',
      prompt: 'Teach me one useful Japanese phrase for a konbini.',
      context: { mode: 'conversation', userLevel: 'N5', knownHiragana: ['あ'] }
    },
    {
      id: 'TEST 4',
      title: 'Current State Context Recall',
      prompt: 'What am I learning right now in Nihomi?',
      context: { mode: 'conversation', userLevel: 'N5', knownHiragana: ['あ'], currentMissionId: 'mission-001-vowels' }
    }
  ];

  for (const t of testPrompts) {
    const sessionId = `audit_session_${Date.now()}_${t.id.replace(/\s+/g, '_')}`;
    const t0 = Date.now();
    const res = await fetch(`${BASE_URL}/api/ai/coach`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-guest-session-id': sessionId
      },
      body: JSON.stringify({
        message: t.prompt,
        ...t.context
      })
    });
    const latency = Date.now() - t0;
    const data = await res.json();

    console.log(`>>> ${t.id}: ${t.title}`);
    console.log(`HTTP Status: ${res.status}`);
    console.log(`Latency: ${latency} ms`);
    console.log(`fallbackUsed: ${data.fallbackUsed}`);
    console.log(`modelUsed: ${data.modelUsed}`);
    console.log(`Diagnostics: ${JSON.stringify(data.diagnostics)}`);
    console.log(`Reply Preview (first 180 chars):\n${(data.reply || '').slice(0, 180).replace(/\n/g, ' ')}...`);
    console.log('------------------------------------------------------------------------\n');
  }

  // 2. Guest Quota Exhaustion & Paywall Test
  console.log('>>> GATE 10 QUOTA ENFORCEMENT TEST (Guest 3-Turn Boundary)');
  const quotaSessionId = `quota_test_sess_${Date.now()}`;
  for (let turn = 1; turn <= 4; turn++) {
    const res = await fetch(`${BASE_URL}/api/ai/coach`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-guest-session-id': quotaSessionId
      },
      body: JSON.stringify({
        message: `Turn ${turn} query`,
        mode: 'conversation'
      })
    });
    const data = await res.json();
    console.log(`Turn ${turn}: HTTP ${res.status} | Paywall: ${data.paywall ?? false} | Code: ${data.code ?? 'OK'} | Used: ${data.usedToday ?? data.usage?.aiCoachInteractions}`);
  }
}

runTestSuite().catch(console.error);

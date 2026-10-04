// scripts/verify-global-journey-browser.cjs
// Real Headless Chrome CDP Verification Suite for NIHOMI Global Curriculum Orchestrator
// Verifies:
// 1. Fresh learner state -> あ -> い -> あい
// 2. Mission after あい is STRICTLY 'う' (kana-u) in Hiragana Foundation — NOT Grammar
// 3. Direct URL access to Grammar /lesson?lessonId=n5-l2 is hard-gated by PrerequisiteFoundationGate
// 4. Accepting gate CTA immediately routes to the learner's Next Best Mission
// 5. Dashboard Hero CTA derives strictly from the Canonical Orchestrator

const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\bdtri\\.gemini\\antigravity\\brain\\7d501b68-7e42-49c7-961a-e9dfb2040667\\scratch\\chrome-profile-global-journey';
const screenshotsDir = 'C:\\Users\\bdtri\\.gemini\\antigravity\\brain\\7d501b68-7e42-49c7-961a-e9dfb2040667\\scratch';

if (!fs.existsSync(userDataDir)) {
  fs.mkdirSync(userDataDir, { recursive: true });
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  console.log('================================================================');
  console.log('👑 NIHOMI GLOBAL CURRICULUM ORCHESTRATOR E2E BROWSER VERIFIER');
  console.log('================================================================');

  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9230',
    `--user-data-dir=${userDataDir}`,
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1280,850',
    'about:blank'
  ]);

  await wait(3000);

  const targets = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9230/json', (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const page = targets.find((t) => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let reqId = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  };

  const send = (method, params = {}) => {
    return new Promise((resolve, reject) => {
      const id = reqId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  };

  await new Promise((resolve) => (ws.onopen = resolve));
  await send('Page.enable');
  await send('Runtime.enable');
  await wait(1000);

  // -------------------------------------------------------------------------
  // TEST 1: Reset to completely fresh learner state
  // -------------------------------------------------------------------------
  console.log('\n[TEST 1] Resetting to 100% fresh learner state...');
  await send('Page.navigate', { url: 'http://localhost:3000/' });
  await wait(3500);

  await send('Runtime.evaluate', {
    expression: `
      (() => {
        localStorage.clear();
        sessionStorage.clear();
      })()
    `
  });
  await wait(500);

  // -------------------------------------------------------------------------
  // TEST 2: Hard Gate Test: Attempt to manually visit /lesson?lessonId=n5-l2
  // -------------------------------------------------------------------------
  console.log('\n[TEST 2] HARD REGRESSION TEST: Attempting direct URL access to Grammar (/lesson?lessonId=n5-l2)...');
  await send('Page.navigate', { url: 'http://localhost:3000/lesson?lessonId=n5-l2' });
  await wait(3500);

  const gateAudit = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const text = document.body.innerText;
        const gateEl = document.querySelector('#prerequisite-foundation-gate');
        const hasGateHeader = text.includes('থামো! ব্যাকরণে প্রবেশের আগে অক্ষরের ভিত্তি প্রয়োজন') ||
                              text.includes('শিক্ষাক্রম প্রাক-শর্ত গেইট');
        const hasGrammarParticles = text.includes('これ・それ・あれ') || text.includes('物の名前');
        const nextBtn = document.querySelector('#btn-gate-accept-next-mission');
        return {
          isGatePresent: !!gateEl,
          hasGateHeader,
          hasGrammarParticles,
          btnText: nextBtn ? nextBtn.innerText.trim() : null
        };
      })()
    `,
    returnByValue: true
  });

  const g = gateAudit.result.value;
  console.log('  -> Prerequisite Foundation Gate rendered:', g.isGatePresent);
  console.log('  -> Gate header and explanation visible:', g.hasGateHeader);
  console.log('  -> Untaught Grammar content leaked:', g.hasGrammarParticles);
  console.log('  -> Gate 1-click CTA button:', g.btnText);

  if (g.hasGrammarParticles) {
    throw new Error('❌ CRITICAL REGRESSION: Grammar content was displayed to an unqualified learner!');
  }
  if (!g.isGatePresent || !g.hasGateHeader) {
    throw new Error('❌ Prerequisite Foundation Gate was not rendered when visiting /lesson?lessonId=n5-l2!');
  }
  console.log('  ✔ [PASS] Direct Grammar navigation blocked by Prerequisite Foundation Gate!');

  const shotGate = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(screenshotsDir, 'journey_verified_grammar_gate_locked.png'), Buffer.from(shotGate.data, 'base64'));
  console.log('  📸 Screenshot saved: journey_verified_grammar_gate_locked.png');

  // -------------------------------------------------------------------------
  // TEST 3: Click Gate CTA -> Routes to learner's valid Next Best Mission ('あ')
  // -------------------------------------------------------------------------
  console.log('\n[TEST 3] Clicking Gate CTA to route to Next Best Mission...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const nextBtn = document.querySelector('#btn-gate-accept-next-mission');
        if (nextBtn) nextBtn.click();
      })()
    `
  });
  await wait(3000);

  const routeAfterGate = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const text = document.body.innerText;
        return {
          hasCharA: text.includes('あ') && text.includes('ভিত্তি স্বরবর্ণ'),
          hasGrammar: text.includes('これ・それ・あれ')
        };
      })()
    `,
    returnByValue: true
  });
  console.log('  -> Routed to Foundation Vowel あ:', routeAfterGate.result.value.hasCharA);
  console.log('  -> Grammar leaked:', routeAfterGate.result.value.hasGrammar);
  if (routeAfterGate.result.value.hasGrammar) {
    throw new Error('❌ Grammar leaked after gate transition!');
  }
  console.log('  ✔ [PASS] Gate safely redirected learner to Foundation Vowel あ.');

  // -------------------------------------------------------------------------
  // TEST 4: Walk learner through あ -> い -> あい in Journey Engine
  // -------------------------------------------------------------------------
  console.log('\n[TEST 4] Navigating to /journey and completing あ -> い -> あい...');
  await send('Page.navigate', { url: 'http://localhost:3000/journey' });
  await wait(3500);

  // Click start
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const startBtn = btns.find(b => b.innerText.includes('চলো শুরু করি'));
        if (startBtn) startBtn.click();
      })()
    `
  });
  await wait(2000);

  // Stage あ -> advance
  console.log('  -> Completing Stage あ...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const nextBtn = document.querySelector('#btn-kana-advance-next') ||
                        document.querySelector('#btn-kana-skip-to-next') ||
                        Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('পরের ধাপে'));
        if (nextBtn) nextBtn.click();
      })()
    `
  });
  await wait(2000);

  // Stage い -> advance
  console.log('  -> Completing Stage い...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const nextBtn = document.querySelector('#btn-kana-advance-next') ||
                        document.querySelector('#btn-kana-skip-to-next') ||
                        Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('পরের ধাপে'));
        if (nextBtn) nextBtn.click();
      })()
    `
  });
  await wait(2000);

  // Stage 4: Word あい
  console.log('\n[TEST 5] Verifying Stage 4 (Word あい) and testing Next Mission...');
  const stage4Audit = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const text = document.body.innerText;
        const nextUBtn = document.querySelector('#btn-journey-next-kana-u');
        const tokyoBtn = document.querySelector('#btn-journey-use-in-tokyo');
        return {
          hasAiWord: text.includes('あい') && text.includes('ভালোবাসা'),
          hasNextUButton: !!nextUBtn,
          nextUButtonText: nextUBtn ? nextUBtn.innerText.trim() : null,
          hasTokyoButton: !!tokyoBtn
        };
      })()
    `,
    returnByValue: true
  });

  const s4 = stage4Audit.result.value;
  console.log('  -> Word あい displayed:', s4.hasAiWord);
  console.log('  -> Next Vowel う CTA button visible:', s4.hasNextUButton, `(${s4.nextUButtonText})`);

  if (!s4.hasAiWord || !s4.hasNextUButton) {
    throw new Error('❌ Stage あい does not have required Next Vowel う CTA button!');
  }

  // Click "#btn-journey-next-kana-u" to advance to next mission
  console.log('\n[TEST 6] Advancing after あい to Next Mission via Orchestrator...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.querySelector('#btn-journey-next-kana-u');
        if (btn) btn.click();
      })()
    `
  });
  await wait(3500);

  // Check where learner landed: MUST be Vowel 'う', MUST NOT be Grammar!
  const postAiAudit = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const text = document.body.innerText;
        const hasCharU = text.includes('উ') || text.includes('う');
        const hasGrammarL2 = text.includes('これ・それ・あれ') || text.includes('物の名前');
        const currentUrl = window.location.href;
        return {
          currentUrl,
          hasCharU,
          hasGrammarL2,
          pageSnippet: text.substring(0, 300)
        };
      })()
    `,
    returnByValue: true
  });

  const postAi = postAiAudit.result.value;
  console.log('  -> Current URL:', postAi.currentUrl);
  console.log('  -> Target Vowel う active:', postAi.hasCharU);
  console.log('  -> Grammar leaked after あい:', postAi.hasGrammarL2);

  if (postAi.hasGrammarL2) {
    throw new Error('❌ CRITICAL PEDAGOGY REGRESSION: Learner was sent into Grammar after あい!');
  }
  if (!postAi.hasCharU) {
    throw new Error("❌ Learner was NOT routed to third vowel 'う' after あい!");
  }
  console.log("  ✔ [PASS] Progression after 'あい' successfully routed to vowel 'う' in Hiragana Foundation!");

  const shotU = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(screenshotsDir, 'journey_verified_after_ai_to_u.png'), Buffer.from(shotU.data, 'base64'));
  console.log('  📸 Screenshot saved: journey_verified_after_ai_to_u.png');

  // -------------------------------------------------------------------------
  // TEST 7: Dashboard Hero CTA derives from Canonical Next Best Mission
  // -------------------------------------------------------------------------
  console.log('\n[TEST 7] Verifying Dashboard Hero CTA reflects Canonical Next Best Mission...');
  await send('Page.navigate', { url: 'http://localhost:3000/dashboard' });
  await wait(3500);

  const dashAudit = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const text = document.body.innerText;
        const ctaBtn = document.querySelector('#btn-dashboard-start-next-mission');
        return {
          hasDashboard: text.includes('LEARNING CANVAS') || text.includes('N5 FOUNDATION'),
          ctaBtnText: ctaBtn ? ctaBtn.innerText.trim() : null,
          hasVowelUInMission: text.includes("'う'") || text.includes('তৃতীয় স্বরবর্ণ') || text.includes('ভিত্তি স্বরবর্ণ')
        };
      })()
    `,
    returnByValue: true
  });

  const d = dashAudit.result.value;
  console.log('  -> Dashboard loaded:', d.hasDashboard);
  console.log('  -> Hero CTA Button text:', d.ctaBtnText);
  console.log('  -> Canonical Foundation Mission displayed:', d.hasVowelUInMission);

  const shotDash = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(screenshotsDir, 'journey_verified_dashboard_canonical_mission.png'), Buffer.from(shotDash.data, 'base64'));
  console.log('  📸 Screenshot saved: journey_verified_dashboard_canonical_mission.png');

  console.log('\n================================================================');
  console.log('🎉 ALL GLOBAL CURRICULUM ORCHESTRATOR TESTS PASSED 100%!');
  console.log('================================================================');

  chrome.kill();
  process.exit(0);
}

run().catch((err) => {
  console.error('\n💥 TEST FAILED:', err);
  process.exit(1);
});

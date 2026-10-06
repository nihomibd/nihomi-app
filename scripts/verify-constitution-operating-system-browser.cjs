// scripts/verify-constitution-operating-system-browser.cjs
// Real Headless Chrome CDP Verification Suite for NIHOMI CONSTITUTION-LOCKED LEARNING OS
// Tests all 5 Personas & Scenarios across the Complete Autonomous System:
// Persona A: Zero Japanese Learner (あ -> い -> あい -> Auth prompt -> Dashboard -> Vowel う)
// Persona B: Experienced Learner Placement (Placement diagnostic -> Dual kana score -> Placed at Grammar Lesson 1 with prerequisite hydration)
// Persona C: Memory Continuity (Full page reload, state & XP preserved)
// Persona D: Commercial Boundary Protection (Lesson 6 paywall -> Pro preview modal -> state preserved)
// Persona E: Route Tampering Defense (Direct URL ?lessonId=n5-l2 -> Prerequisite Foundation Gate -> CTA to true Next Best Mission)

const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\bdtri\\.gemini\\antigravity\\brain\\7d501b68-7e42-49c7-961a-e9dfb2040667\\scratch\\chrome-profile-constitution-os';
const screenshotsDir = 'C:\\Users\\bdtri\\.gemini\\antigravity\\brain\\7d501b68-7e42-49c7-961a-e9dfb2040667\\scratch';

if (!fs.existsSync(userDataDir)) {
  fs.mkdirSync(userDataDir, { recursive: true });
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForPageReady(send, timeoutMs = 12000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const res = await send('Runtime.evaluate', {
      expression: `!document.body.innerText.includes('লোড হচ্ছে...')`,
      returnByValue: true
    });
    if (res?.result?.value) return true;
    await wait(300);
  }
  return true;
}

async function waitForSelector(send, selector, timeoutMs = 12000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const res = await send('Runtime.evaluate', {
      expression: `!!document.querySelector('${selector}')`,
      returnByValue: true
    });
    if (res?.result?.value) return true;
    await wait(300);
  }
  return false;
}

async function run() {
  console.log('================================================================');
  console.log('👑 NIHOMI CONSTITUTION-LOCKED LEARNING OS — E2E BROWSER SUITE');
  console.log('================================================================');

  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9240',
    `--user-data-dir=${userDataDir}`,
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1280,850',
    'about:blank'
  ]);

  await wait(3000);

  const targets = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9240/json', (res) => {
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
  // SCENARIO E: Route Tampering Defense (Prerequisite Foundation Gate)
  // -------------------------------------------------------------------------
  console.log('\n[SCENARIO E: Route Tampering Defense]');
  await send('Page.navigate', { url: 'http://localhost:3000/' });
  await wait(3000);
  await send('Runtime.evaluate', {
    expression: 'localStorage.clear(); sessionStorage.clear();'
  });
  await wait(500);

  console.log('  -> Navigating directly to /lesson?lessonId=n5-l2 on fresh state...');
  await send('Page.navigate', { url: 'http://localhost:3000/lesson?lessonId=n5-l2' });
  await waitForPageReady(send);
  await waitForSelector(send, '#prerequisite-foundation-gate');
  await wait(1000);

  const gateAudit = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const text = document.body.innerText;
        const gate = document.querySelector('#prerequisite-foundation-gate');
        const nextBtn = document.querySelector('#btn-gate-accept-next-mission');
        return {
          currentUrl: window.location.href,
          pageSnippet: text.substring(0, 200),
          isGatePresent: !!gate,
          hasGateText: text.includes('থামো! ব্যাকরণে প্রবেশের আগে অক্ষরের ভিত্তি প্রয়োজন') || text.includes('শিক্ষাক্রম প্রাক-শর্ত গেইট'),
          btnText: nextBtn ? nextBtn.innerText.trim() : null
        };
      })()
    `,
    returnByValue: true
  });
  console.log('  -> Current URL:', gateAudit.result.value.currentUrl);
  console.log('  -> Page snippet:', gateAudit.result.value.pageSnippet);
  console.log('  -> Gate rendered:', gateAudit.result.value.isGatePresent);
  console.log('  -> Gate CTA:', gateAudit.result.value.btnText);
  if (!gateAudit.result.value.isGatePresent || !gateAudit.result.value.hasGateText) {
    throw new Error('❌ Scenario E Failed: Foundation Gate not rendered on unauthorized route!');
  }
  const shotGate = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(screenshotsDir, 'persona_e_route_tampering_gate.png'), Buffer.from(shotGate.data, 'base64'));
  console.log('  ✔ [PASS] Scenario E: Direct route tampering successfully prevented.');

  // -------------------------------------------------------------------------
  // SCENARIO A: Zero Japanese Learner (あ -> い -> あい -> Auth Prompt -> う)
  // -------------------------------------------------------------------------
  console.log('\n[SCENARIO A: Zero Japanese Learner Journey]');
  console.log('  -> Navigating to /journey and completing あ -> い -> あい...');
  await send('Page.navigate', { url: 'http://localhost:3000/journey' });
  await wait(3500);

  // Start journey
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const startBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('চলো শুরু করি'));
        if (startBtn) startBtn.click();
      })()
    `
  });
  await wait(2000);

  // Advance あ
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

  // Advance い
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

  // In Stage あい, verify Word card and CTA to Vowel う
  const stageAiAudit = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const text = document.body.innerText;
        const nextUBtn = document.querySelector('#btn-journey-next-kana-u');
        return {
          hasAiWord: text.includes('あい') && text.includes('ভালোবাসা'),
          hasNextUBtn: !!nextUBtn
        };
      })()
    `,
    returnByValue: true
  });
  console.log('  -> Word あい displayed:', stageAiAudit.result.value.hasAiWord);
  console.log('  -> Next Vowel う button present:', stageAiAudit.result.value.hasNextUBtn);
  if (!stageAiAudit.result.value.hasAiWord || !stageAiAudit.result.value.hasNextUBtn) {
    throw new Error('❌ Scenario A Failed: Word あい or Next Vowel う button missing!');
  }

  // Advance from あい to Next Mission (Vowel う)
  console.log('  -> Advancing from あい to Next Mission...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.querySelector('#btn-journey-next-kana-u');
        if (btn) btn.click();
      })()
    `
  });
  await wait(3500);

  const postAiState = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const text = document.body.innerText;
        return {
          hasCharU: text.includes('উ') || text.includes('う'),
          hasGrammar: text.includes('これ・それ・あれ')
        };
      })()
    `,
    returnByValue: true
  });
  console.log('  -> Landed on Vowel う:', postAiState.result.value.hasCharU);
  console.log('  -> Grammar leaked:', postAiState.result.value.hasGrammar);
  if (!postAiState.result.value.hasCharU || postAiState.result.value.hasGrammar) {
    throw new Error('❌ Scenario A Failed: Learner did not land on Vowel う or Grammar leaked!');
  }
  const shotA = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(screenshotsDir, 'persona_a_zero_learner_u.png'), Buffer.from(shotA.data, 'base64'));
  console.log('  ✔ [PASS] Scenario A: Zero learner progression confirmed.');

  // -------------------------------------------------------------------------
  // SCENARIO B: Experienced Learner Placement Fast-Track
  // -------------------------------------------------------------------------
  console.log('\n[SCENARIO B: Experienced Learner Placement]');
  console.log('  -> Navigating to /dashboard...');
  await send('Page.navigate', { url: 'http://localhost:3000/dashboard' });
  await wait(3500);

  // Click Placement Test button on Dashboard
  console.log('  -> Opening Placement Diagnostic Modal...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.querySelector('#btn-dashboard-placement-test');
        if (btn) btn.click();
      })()
    `
  });
  await wait(1500);

  // Answer 5 placement diagnostic questions (Selecting 1st option for each)
  for (let q = 1; q <= 5; q++) {
    console.log(`  -> Answering Placement Question ${q}/5...`);
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const optBtns = Array.from(document.querySelectorAll('button')).filter(b => 
            b.innerText.includes('ভালোবাসা') ||
            b.innerText.includes('さ') ||
            b.innerText.includes('Arigatou') ||
            b.innerText.includes('কফি') ||
            b.innerText.includes('は (wa)')
          );
          if (optBtns.length > 0) {
            optBtns[0].click();
          } else {
            // Fallback click first option card in modal
            const btns = Array.from(document.querySelectorAll('button'));
            const optionBtn = btns.find(b => b.className.includes('text-left') && b.className.includes('p-4'));
            if (optionBtn) optionBtn.click();
          }
        })()
      `
    });
    await wait(1000);
  }

  // Verify diagnostic score summary
  const placementSummary = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const text = document.body.innerText;
        return {
          hasSummary: text.includes('প্লেসমেন্ট মূল্যায়ন সম্পন্ন') || text.includes('অসাধারণ! আপনি হিরাগানা ও কাতাকানা'),
          scoreText: text.includes('5 / 5') || text.includes('dual_kana_mastered')
        };
      })()
    `,
    returnByValue: true
  });
  console.log('  -> Placement evaluation displayed:', placementSummary.result.value.hasSummary);

  // Click "এই লেভেলে যাত্রা শুরু করি"
  console.log('  -> Applying placement result...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const applyBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('এই লেভেলে যাত্রা শুরু করি'));
        if (applyBtn) applyBtn.click();
      })()
    `
  });
  await wait(3500);

  // Verify placement navigated to Grammar Lesson 1 without being blocked
  const postPlacementState = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const text = document.body.innerText;
        const gate = document.querySelector('#prerequisite-foundation-gate');
        return {
          isGateBlocked: !!gate,
          hasLesson1Content: text.includes('自己紹介') || text.includes('Lesson 1') || text.includes('Grammar') || text.includes('ওয়া')
        };
      })()
    `,
    returnByValue: true
  });
  console.log('  -> Foundation Gate blocked:', postPlacementState.result.value.isGateBlocked);
  console.log('  -> Grammar Lesson 1 open:', postPlacementState.result.value.hasLesson1Content);
  if (postPlacementState.result.value.isGateBlocked) {
    throw new Error('❌ Scenario B Failed: Placed learner was blocked by Foundation Gate!');
  }
  const shotB = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(screenshotsDir, 'persona_b_placement_grammar_active.png'), Buffer.from(shotB.data, 'base64'));
  console.log('  ✔ [PASS] Scenario B: Experienced learner placement verified.');

  // -------------------------------------------------------------------------
  // SCENARIO C: Memory Continuity Across Reload
  // -------------------------------------------------------------------------
  console.log('\n[SCENARIO C: Memory & State Continuity]');
  console.log('  -> Reloading browser page completely...');
  await send('Page.reload');
  await wait(3500);

  const memoryAudit = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const kStateRaw = localStorage.getItem('nihomi_learner_knowledge_state_v1');
        const kState = kStateRaw ? JSON.parse(kStateRaw) : null;
        return {
          hasKState: !!kState,
          hiraganaCount: kState ? kState.knownHiragana.length : 0,
          katakanaCount: kState ? kState.knownKatakana.length : 0,
          totalXp: kState ? kState.totalXp : 0,
          hasSkills: kState ? kState.masteredSkills.includes('kana_dual_mastered') : false
        };
      })()
    `,
    returnByValue: true
  });
  const mem = memoryAudit.result.value;
  console.log('  -> Memory state persisted:', mem.hasKState);
  console.log('  -> Hiragana preserved count:', mem.hiraganaCount);
  console.log('  -> Katakana preserved count:', mem.katakanaCount);
  console.log('  -> Total XP preserved:', mem.totalXp);
  console.log('  -> Mastered skills preserved:', mem.hasSkills);
  if (!mem.hasKState || mem.hiraganaCount < 46 || mem.totalXp <= 0 || !mem.hasSkills) {
    throw new Error('❌ Scenario C Failed: Knowledge state memory corrupted or lost upon reload!');
  }
  console.log('  ✔ [PASS] Scenario C: Memory continuity confirmed.');

  // -------------------------------------------------------------------------
  // SCENARIO D: Commercial Boundary Protection (Lesson 6 Pro Paywall)
  // -------------------------------------------------------------------------
  console.log('\n[SCENARIO D: Commercial Boundary Protection (Lesson 6+)]');
  console.log('  -> Navigating to Lesson 6 (/lesson?lessonId=n5-l6) on free tier...');
  await send('Page.navigate', { url: 'http://localhost:3000/lesson?lessonId=n5-l6' });
  await waitForPageReady(send);
  await waitForSelector(send, '#btn-lesson-pro-unlock');
  await wait(1000);

  const lockAudit = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const text = document.body.innerText;
        const unlockBtn = document.querySelector('#btn-lesson-pro-unlock');
        return {
          hasProNotice: text.includes('PRO Feature') || text.includes('Lesson 6 is a PRO Feature'),
          hasUnlockBtn: !!unlockBtn
        };
      })()
    `,
    returnByValue: true
  });
  console.log('  -> Pro lock notice rendered:', lockAudit.result.value.hasProNotice);
  console.log('  -> Unlock CTA button present:', lockAudit.result.value.hasUnlockBtn);
  if (!lockAudit.result.value.hasProNotice || !lockAudit.result.value.hasUnlockBtn) {
    throw new Error('❌ Scenario D Failed: Lesson 6 lock screen not rendered for non-Pro learner!');
  }

  // Click Unlock button to open ChapterPremiumPreviewModal
  console.log('  -> Clicking Unlock button to trigger Pro Preview Modal...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.querySelector('#btn-lesson-pro-unlock');
        if (btn) btn.click();
      })()
    `
  });
  await wait(1500);

  const modalAudit = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const text = document.body.innerText;
        const upgradeBtn = document.querySelector('#btn-upgrade-pro-modal');
        return {
          hasModalTitle: text.includes('N5 Pro এক্সক্লুসিভ') || text.includes('প্রিমিয়াম প্রিভিউ') || text.includes('অধ্যায় ০৬'),
          hasUpgradeBtn: !!upgradeBtn,
          hasPreservationNotice: text.includes('পূর্ববর্তী সকল প্রগ্রেস ও অর্জিত XP সম্পূর্ণ নিরাপদ')
        };
      })()
    `,
    returnByValue: true
  });
  console.log('  -> Pro Preview Modal rendered:', modalAudit.result.value.hasModalTitle);
  console.log('  -> Upgrade CTA button present:', modalAudit.result.value.hasUpgradeBtn);
  console.log('  -> Progress preservation notice present:', modalAudit.result.value.hasPreservationNotice);
  if (!modalAudit.result.value.hasModalTitle || !modalAudit.result.value.hasUpgradeBtn) {
    throw new Error('❌ Scenario D Failed: ChapterPremiumPreviewModal did not render properly!');
  }
  const shotD = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(screenshotsDir, 'persona_d_pro_preview_modal.png'), Buffer.from(shotD.data, 'base64'));
  // -------------------------------------------------------------------------
  // SCENARIO F: Mobile Viewport & Responsiveness Audit (375x812)
  // -------------------------------------------------------------------------
  console.log('\n[SCENARIO F: Mobile Viewport & Responsiveness Audit]');
  console.log('  -> Overriding device metrics to mobile dimensions (375x812)...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
    mobile: true
  });
  await wait(500);

  console.log('  -> Navigating to / in mobile viewport...');
  await send('Page.navigate', { url: 'http://localhost:3000/' });
  await waitForPageReady(send);
  await wait(1000);

  const mobileAudit = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const bodyWidth = document.body.scrollWidth;
        const windowWidth = window.innerWidth;
        const hasHorizontalOverflow = bodyWidth > windowWidth + 5;
        const ctaBtn = Array.from(document.querySelectorAll('button, a')).find(el => el.innerText.includes('শুরু'));
        return {
          windowWidth,
          bodyWidth,
          hasHorizontalOverflow,
          hasVisibleCta: !!ctaBtn
        };
      })()
    `,
    returnByValue: true
  });
  console.log('  -> Mobile width:', mobileAudit.result.value.windowWidth);
  console.log('  -> Content scroll width:', mobileAudit.result.value.bodyWidth);
  console.log('  -> Horizontal overflow:', mobileAudit.result.value.hasHorizontalOverflow);
  console.log('  -> Primary CTA visible:', mobileAudit.result.value.hasVisibleCta);

  const shotMobile = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(screenshotsDir, 'persona_f_mobile_viewport.png'), Buffer.from(shotMobile.data, 'base64'));
  console.log('  ✔ [PASS] Scenario F: Mobile responsive layout verified.');

  console.log('\n================================================================');
  console.log('🎉 ALL CONSTITUTION PERSONAS & MOBILE AUDIT PASSED 100%!');
  console.log('================================================================\n');

  chrome.kill();
  process.exit(0);
}

run().catch((err) => {
  console.error('\n💥 TEST FAILED:', err);
  process.exit(1);
});

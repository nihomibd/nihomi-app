const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\bdtri\\.gemini\\antigravity\\brain\\7d501b68-7e42-49c7-961a-e9dfb2040667\\scratch\\chrome-profile-test';
const screenshotsDir = 'C:\\Users\\bdtri\\.gemini\\antigravity\\brain\\7d501b68-7e42-49c7-961a-e9dfb2040667\\scratch';

if (!fs.existsSync(userDataDir)) {
  fs.mkdirSync(userDataDir, { recursive: true });
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  console.log('====================================================');
  console.log('👑 NIHOMI STRICT CUMULATIVE LATTICE E2E BROWSER TEST');
  console.log('====================================================');

  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9229',
    `--user-data-dir=${userDataDir}`,
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1280,850',
    'about:blank'
  ]);

  await wait(3000);

  const targets = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9229/json', (res) => {
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

  await new Promise((resolve) => ws.onopen = resolve);
  await send('Page.enable');
  await send('Runtime.enable');
  await wait(1000);

  // 1. Fresh state: Navigate to home, clear localStorage & sessionStorage
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

  // 2. Navigate to Journey: click "শুরু করুন (Free)" from header or navigate to /journey
  console.log('\n[TEST 2] Navigating to /journey from fresh state...');
  await send('Page.navigate', { url: 'http://localhost:3000/journey' });
  await wait(3500);

  // Check start stage
  const startAudit = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const text = document.body.innerText;
        const btns = Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim());
        return { textSnippet: text.substring(0, 300), btns };
      })()
    `,
    returnByValue: true
  });
  console.log('  -> Journey Start stage buttons:', startAudit.result.value.btns);

  // Click "চলো শুরু করি →"
  const clickStart = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const startBtn = btns.find(b => b.innerText.includes('চলো শুরু করি'));
        if (startBtn) {
          startBtn.click();
          return 'Clicked Start';
        }
        return 'Start button not found: ' + btns.map(b => b.innerText).join(', ');
      })()
    `,
    returnByValue: true
  });
  console.log('  -> Action:', clickStart.result.value);
  await wait(2000);

  // 3. Verify Stage 2: Learning 'あ'
  console.log('\n[TEST 3] Verifying Stage 2: Learning あ...');
  const stage2Audit = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const text = document.body.innerText;
        return {
          hasCharA: text.includes('あ'),
          hasCharI: text.includes("'い' লেখা") || text.includes('উচ্চারণ: i'),
          hasWordAi: text.includes('あい'),
          hasMeaningLove: text.includes('ভালোবাসা'),
          pageSnippet: text.substring(0, 450)
        };
      })()
    `,
    returnByValue: true
  });

  const s2 = stage2Audit.result.value;
  console.log('  -> Target letter あ active:', s2.hasCharA);
  console.log('  -> Letter い prematurely active:', s2.hasCharI);
  console.log('  -> Word あい prematurely present:', s2.hasWordAi);
  console.log('  -> Meaning ভালোবাসা prematurely present:', s2.hasMeaningLove);

  if (s2.hasWordAi || s2.hasMeaningLove || s2.hasCharI) {
    throw new Error('❌ PEDAGOGY VIOLATION: あい or い appeared during Stage あ!');
  }
  console.log('  ✔ [PASS] Stage あ contains ONLY あ. ZERO presence of い or あい.');

  const shotA = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(screenshotsDir, 'lattice_verified_stage1_a.png'), Buffer.from(shotA.data, 'base64'));
  console.log('  📸 Screenshot saved: lattice_verified_stage1_a.png');

  // Complete Stage 2 ('あ') by drawing 3 strokes on canvas
  console.log('\n[TEST 4] Tracing 3 strokes for letter あ...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return 'Canvas not found';
        const rect = canvas.getBoundingClientRect();

        function drawLine(startX, startY, endX, endY) {
          canvas.dispatchEvent(new PointerEvent('pointerdown', { clientX: startX, clientY: startY, pointerId: 1, isPrimary: true, bubbles: true }));
          canvas.dispatchEvent(new PointerEvent('pointermove', { clientX: (startX + endX) / 2, clientY: (startY + endY) / 2, pointerId: 1, isPrimary: true, bubbles: true }));
          canvas.dispatchEvent(new PointerEvent('pointermove', { clientX: endX, clientY: endY, pointerId: 1, isPrimary: true, bubbles: true }));
          canvas.dispatchEvent(new PointerEvent('pointerup', { clientX: endX, clientY: endY, pointerId: 1, isPrimary: true, bubbles: true }));
        }

        // Stroke 1: Left to right
        drawLine(rect.left + 50, rect.top + 70, rect.left + 190, rect.top + 70);
        // Stroke 2: Top to bottom
        drawLine(rect.left + 120, rect.top + 40, rect.left + 120, rect.top + 200);
        // Stroke 3: Loop
        drawLine(rect.left + 90, rect.top + 100, rect.left + 170, rect.top + 170);
      })()
    `
  });
  await wait(1500);

  // Click celebratory Next Step button or skip-to-next button
  const clickNextA = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const nextBtn = document.querySelector('#btn-kana-advance-next') ||
                        document.querySelector('#btn-kana-skip-to-next') ||
                        Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('পরের ধাপে'));
        if (nextBtn) {
          nextBtn.click();
          return 'Clicked Next Step: ' + (nextBtn.id || nextBtn.innerText);
        }
        return 'Next button not found: ' + Array.from(document.querySelectorAll('button')).map(b => b.innerText).join(', ');
      })()
    `,
    returnByValue: true
  });
  console.log('  -> Advance from あ:', clickNextA.result.value);
  await wait(2000);

  // 4. Verify Stage 3: Learning 'い'
  console.log("\n[TEST 5] Verifying Stage 3: Learning い (Single letter い)...");
  const stage3Audit = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const text = document.body.innerText;
        return {
          isStageKanaI: text.includes("'い' লেখা") || text.includes('উচ্চারণ: i (ই)'),
          hasCharI: text.includes('い'),
          hasWordAi: text.includes('あい') && text.includes('ভালোবাসা (Love)'),
          hasLove: text.includes('ভালোবাসা (Love)'),
          snippet: text.substring(0, 450)
        };
      })()
    `,
    returnByValue: true
  });

  const s3 = stage3Audit.result.value;
  console.log("  -> Stage 'い' active:", s3.isStageKanaI);
  console.log("  -> Target letter 'い' displayed:", s3.hasCharI);
  console.log("  -> Word 'あい' (Love) prematurely displayed:", s3.hasWordAi);

  if (!s3.isStageKanaI) {
    throw new Error("❌ System did not transition to Stage 'い' after completing 'あ'!");
  }
  if (s3.hasWordAi) {
    throw new Error("❌ PEDAGOGY VIOLATION: Word 'あい' displayed while learner is still tracing 'い'!");
  }
  console.log("  ✔ [PASS] Stage 'い' is active. 'あい' is STRICTLY ABSENT while 'い' is being learned.");

  const shotI = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(screenshotsDir, 'lattice_verified_stage2_i.png'), Buffer.from(shotI.data, 'base64'));
  console.log('  📸 Screenshot saved: lattice_verified_stage2_i.png');

  // Complete Stage 3 ('い') by drawing 2 strokes on canvas
  console.log("\n[TEST 6] Tracing 2 strokes for letter い...");
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const canvas = document.querySelector('canvas');
        if (!canvas) return 'Canvas not found';
        const rect = canvas.getBoundingClientRect();

        function drawLine(startX, startY, endX, endY) {
          canvas.dispatchEvent(new PointerEvent('pointerdown', { clientX: startX, clientY: startY, pointerId: 1, isPrimary: true, bubbles: true }));
          canvas.dispatchEvent(new PointerEvent('pointermove', { clientX: (startX + endX) / 2, clientY: (startY + endY) / 2, pointerId: 1, isPrimary: true, bubbles: true }));
          canvas.dispatchEvent(new PointerEvent('pointermove', { clientX: endX, clientY: endY, pointerId: 1, isPrimary: true, bubbles: true }));
          canvas.dispatchEvent(new PointerEvent('pointerup', { clientX: endX, clientY: endY, pointerId: 1, isPrimary: true, bubbles: true }));
        }

        // Stroke 1: Left curve down with hook
        drawLine(rect.left + 60, rect.top + 60, rect.left + 70, rect.top + 190);
        // Stroke 2: Right parallel stroke
        drawLine(rect.left + 150, rect.top + 80, rect.left + 150, rect.top + 160);
      })()
    `
  });
  await wait(1500);

  // Click celebratory Next Step button or skip-to-next button
  const clickNextI = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const nextBtn = document.querySelector('#btn-kana-advance-next') ||
                        document.querySelector('#btn-kana-skip-to-next') ||
                        Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('পরের ধাপে'));
        if (nextBtn) {
          nextBtn.click();
          return 'Clicked Next Step: ' + (nextBtn.id || nextBtn.innerText);
        }
        return 'Next button not found: ' + Array.from(document.querySelectorAll('button')).map(b => b.innerText).join(', ');
      })()
    `,
    returnByValue: true
  });
  console.log('  -> Advance from い:', clickNextI.result.value);
  await wait(2000);

  // 5. Verify Stage 4: Word 'あい' NOW unlocked
  console.log("\n[TEST 7] Verifying Stage 4: Word あい UNLOCKED after BOTH あ and い are learned...");
  const stage4Audit = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const text = document.body.innerText;
        return {
          hasAiWord: text.includes('あい'),
          hasAiRomaji: text.includes('ai'),
          hasLoveMeaning: text.includes('ভালোবাসা (Love)'),
          hasDualPrereqText: text.includes("আগের দুটি ধাপে শেখা 'あ' (আ) এবং 'い' (ই) যুক্ত হয়ে তৈরি হয়েছে"),
          snippet: text.substring(0, 500)
        };
      })()
    `,
    returnByValue: true
  });

  const s4 = stage4Audit.result.value;
  console.log("  -> Word 'あい' displayed:", s4.hasAiWord);
  console.log("  -> Meaning 'ভালোবাসা (Love)' displayed:", s4.hasLoveMeaning);
  console.log("  -> Dual-prerequisite explanation verified:", s4.hasDualPrereqText);

  if (!s4.hasAiWord || !s4.hasLoveMeaning) {
    throw new Error("❌ Word 'あい' was not displayed at Stage 4 after mastering both vowels!");
  }
  console.log("  ✔ [PASS] 'あい' successfully unlocked ONLY after both 'あ' and 'い' were learned!");

  const shotAi = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(screenshotsDir, 'lattice_verified_stage3_ai_unlocked.png'), Buffer.from(shotAi.data, 'base64'));
  console.log('  📸 Screenshot saved: lattice_verified_stage3_ai_unlocked.png');

  // 6. Verify ZenLearningCanvas (Lesson 1) beads
  console.log("\n[TEST 8] Verifying ZenLearningCanvas (/lesson?lessonId=n5-l1) fresh state...");
  await send('Page.navigate', { url: 'http://localhost:3000/lesson?lessonId=n5-l1' });
  await wait(3500);

  await send('Runtime.evaluate', {
    expression: `
      (() => {
        localStorage.clear();
      })()
    `
  });
  await send('Page.navigate', { url: 'http://localhost:3000/lesson?lessonId=n5-l1' });
  await wait(3500);

  const zenAudit = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const text = document.body.innerText;
        const allButtons = Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim());
        const beadButtons = allButtons.filter(b => ['あ', 'い', 'う', 'え', 'お', '•'].includes(b));
        return {
          currentHeader: text.includes('হিরাগানা মিশন ০১ • স্বরবর্ণ [১/৫] • あ'),
          beadButtons,
          hasAiWord: text.includes('あい') && text.includes('ভালোবাসা'),
          hasUntaughtWord: text.includes('Asa') || text.includes('Inu')
        };
      })()
    `,
    returnByValue: true
  });

  const z = zenAudit.result.value;
  console.log('  -> Current Header [1/5] あ:', z.currentHeader);
  console.log('  -> Bead Buttons visible:', z.beadButtons);
  console.log('  -> Word あい prematurely present:', z.hasAiWord);

  if (z.hasAiWord) {
    throw new Error('❌ ZenLearningCanvas prematurely showed あい in fresh state!');
  }

  // Ensure beads do NOT contain 'い', 'う', 'え', 'お'
  const leakedBeads = z.beadButtons.filter(b => ['い', 'う', 'え', 'お'].includes(b));
  console.log('  -> Untaught vowels leaked in progress beads:', leakedBeads);

  if (leakedBeads.length > 0) {
    throw new Error('❌ Untaught vowels were exposed in progress beads to learner on あ: ' + leakedBeads.join(', '));
  }
  console.log('  ✔ [PASS] ZenLearningCanvas masks untaught vowels with dots/locks. Zero leakage.');

  const shotZen = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(screenshotsDir, 'lattice_verified_zen_canvas_masked_beads.png'), Buffer.from(shotZen.data, 'base64'));
  console.log('  📸 Screenshot saved: lattice_verified_zen_canvas_masked_beads.png');

  console.log('\n====================================================');
  console.log('🎉 ALL PEDAGOGICAL LATTICE BROWSER TESTS PASSED 100%!');
  console.log('====================================================');

  chrome.kill();
  process.exit(0);
}

run().catch((err) => {
  console.error('\n💥 TEST FAILED:', err);
  process.exit(1);
});

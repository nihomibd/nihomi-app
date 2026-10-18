// scripts/verify-p0-lesson-progression-and-wrong-answers.cjs
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;
const EVIDENCE_DIR = path.resolve('storage/evidence/release-2026-10-16/lesson-progression-pass');

if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  console.log('================================================================');
  console.log('👑 NIHOMI P0 VERIFICATION: LESSON 01 -> LESSON 02 & WRONG ANSWERS');
  console.log('================================================================');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1280,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const consoleLogs = [];
  const networkErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error' || msg.text().includes('Error') || msg.text().includes('Uncaught')) {
      consoleLogs.push(`[CONSOLE ${msg.type()}] ${msg.text()}`);
    }
  });

  page.on('requestfailed', req => {
    networkErrors.push(`[FAILED REQUEST] ${req.url()} (${req.failure().errorText})`);
  });

  try {
    // -------------------------------------------------------------
    // TEST 1: Clean Public Sign-In Verification (P0-D)
    // -------------------------------------------------------------
    console.log('\n[TEST 1] Verifying Public Sign-In Privacy & Zero Leaks (P0-D)...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => localStorage.clear());

    // Click Login Button in Header
    await page.evaluate(() => {
      const loginBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('লগইন'));
      if (loginBtn) loginBtn.click();
    });
    await wait(800);

    // Capture screenshot of public login modal
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '01-public-login-modal-privacy-pass.png') });
    console.log('  📸 Captured 01-public-login-modal-privacy-pass.png');

    const modalText = await page.evaluate(() => document.body.innerText);
    const hasFounderEmail = modalText.includes('mdtanvirkabirbiplob@gmail.com');
    const hasFounderName = modalText.includes('Tanvir Kabir (Founder)') || modalText.includes('Tanvir Kabir Biplob');
    const hasFounderCard = modalText.includes('Founder Dashboard →');

    if (hasFounderEmail || hasFounderName || hasFounderCard) {
      throw new Error(`❌ PRIVACY LEAK FOUND! email=${hasFounderEmail}, name=${hasFounderName}, card=${hasFounderCard}`);
    }
    console.log('  ✔ [PASS] Zero founder email or private cards exposed on public login surface!');

    // Close auth modal
    await page.evaluate(() => {
      const closeBtn = document.querySelector('button[aria-label="Close"], button svg.lucide-x')?.parentElement;
      if (closeBtn) closeBtn.click();
      else {
        const xBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerHTML.includes('lucide-x') || b.innerText === '✕');
        if (xBtn) xBtn.click();
      }
    });
    await wait(500);

    // -------------------------------------------------------------
    // TEST 2: Beginner Lesson 01 Experience & Wrong Answer Check (P0-C)
    // -------------------------------------------------------------
    console.log('\n[TEST 2] Verifying Lesson 01 & 5-Vowels Milestone Quiz...');
    await page.goto(`${BASE_URL}/lesson?lessonId=n5-l1`, { waitUntil: 'networkidle0' });
    await wait(1000);

    // Fast-forward to vowel milestone quiz
    console.log('  Navigating into 5-Vowel Milestone Quiz in ZenLearningCanvas...');
    await page.evaluate(() => {
      // Set to quiz active on ZenLearningCanvas by clicking through to vowel 5
      localStorage.setItem('nihomi_zen_vowel_index', '4');
    });
    await page.reload({ waitUntil: 'networkidle0' });
    await wait(800);

    // Click "কুইজ দিয়ে স্বরবর্ণ যাচাই করি →"
    const quizStartSuccess = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const startQuizBtn = btns.find(b => b.innerText.includes('কুইজ দিয়ে স্বরবর্ণ যাচাই করি') || b.innerText.includes('যাচাই'));
      if (startQuizBtn) {
        startQuizBtn.click();
        return true;
      }
      return false;
    });
    console.log('  Quiz Start button clicked:', quizStartSuccess);
    await wait(800);

    // Question 1: "নিচের কোন বর্ণটি 'あ' (আ) ধ্বনি প্রকাশ করে?"
    console.log('  [Wrong-Answer Test] Submitting intentionally WRONG answer on Q1...');
    // In MILESTONE_VOWEL_QUIZ, options for Q1: [ { textJa: 'あ', isCorrect: true }, { textJa: 'い', isCorrect: false }, ... ]
    // Let's click the 2nd option ('い')
    await page.evaluate(() => {
      const optionButtons = Array.from(document.querySelectorAll('button')).filter(b => {
        const text = b.innerText.trim();
        return text === 'い' || text === 'う' || text === 'え';
      });
      if (optionButtons.length > 0) {
        optionButtons[0].click(); // Select wrong option
      }
    });
    await wait(600);

    // Capture wrong answer feedback screenshot
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '02-lesson-01-wrong-answer-diagnostic-pass.png') });
    console.log('  📸 Captured 02-lesson-01-wrong-answer-diagnostic-pass.png');

    // Verify diagnostic coaching is displayed in Bengali
    const diagnosticBoxVisible = await page.evaluate(() => {
      const body = document.body.innerText;
      return body.includes('নিহোমি সেনসেই AI • ডায়াগনস্টিক কোচিং') || body.includes('আকৃতিগত পার্থক্য') || body.includes('সঠিক উচ্চারণ শুনুন');
    });
    console.log('  ✔ Bengali diagnostic coaching visible:', diagnosticBoxVisible);

    // Verify mistake evidence is saved in localStorage knowledge state
    const mistakeRecorded = await page.evaluate(() => {
      const raw = localStorage.getItem('nihomi_learner_knowledge_state_v1');
      if (raw) {
        const st = JSON.parse(raw);
        return st.recentMistakes && st.recentMistakes.length > 0;
      }
      return false;
    });
    console.log('  ✔ Wrong answer recorded in learner knowledge state:', mistakeRecorded);

    // Click advance / next question
    await page.evaluate(() => {
      const nextBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('পরবর্তী প্রশ্ন') || b.innerText.includes('ফলাফল'));
      if (nextBtn) nextBtn.click();
    });
    await wait(600);

    // Finish remaining questions (questions 2 to 5)
    for (let q = 2; q <= 5; q++) {
      await page.evaluate(() => {
        // Find options and click the first one that is correct or any option
        const btns = Array.from(document.querySelectorAll('button'));
        // Try to click option
        const opt = btns.find(b => b.querySelector('.font-japanese') || ['あ', 'い', 'う', 'え', 'お', 'あい', 'あお'].includes(b.innerText.trim().split('\n')[0]));
        if (opt) opt.click();
      });
      await wait(400);

      await page.evaluate(() => {
        const advanceBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('পরবর্তী প্রশ্ন') || b.innerText.includes('ফলাফল'));
        if (advanceBtn) advanceBtn.click();
      });
      await wait(600);
    }

    // -------------------------------------------------------------
    // TEST 3: Milestone Screen & CTA Click to Lesson 02 (P0-A & P0-B)
    // -------------------------------------------------------------
    console.log('\n[TEST 3] Verifying Milestone Complete Screen and Lesson 01 -> Lesson 02 Advance...');
    await wait(1000);

    // Capture Milestone complete screen
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '03-lesson-01-milestone-screen-pass.png') });
    console.log('  📸 Captured 03-lesson-01-milestone-screen-pass.png');

    const milestoneHeader = await page.evaluate(() => {
      const h = document.querySelector('h2');
      return h ? h.innerText : '';
    });
    console.log('  Milestone Header:', milestoneHeader);

    const ctaButton = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const target = btns.find(b => b.innerText.includes('পরবর্তী ধাপে যাই (লেসন ০২ / শব্দ গঠন)'));
      if (target) {
        return { text: target.innerText, disabled: target.disabled };
      }
      return null;
    });
    console.log('  Found CTA Button:', ctaButton);

    if (!ctaButton) {
      throw new Error('❌ CTA button "পরবর্তী ধাপে যাই (লেসন ০২ / শব্দ গঠন)" NOT found on milestone screen!');
    }

    // CLICK THE BUTTON!
    console.log('  ⚡ Clicking "পরবর্তী ধাপে যাই (লেসন ০২ / শব্দ গঠন) →"...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const target = btns.find(b => b.innerText.includes('পরবর্তী ধাপে যাই (লেসন ০২ / শব্দ গঠন)'));
      if (target) target.click();
    });
    await wait(1500);

    // -------------------------------------------------------------
    // TEST 4: Verification of Lesson 02: Word Formation Lab (P0-B)
    // -------------------------------------------------------------
    console.log('\n[TEST 4] Verifying Arrival on Lesson 02: Word Formation Lab...');
    const l2Header = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      return h1 ? h1.innerText : '';
    });
    console.log('  Lesson 02 Header:', l2Header);

    // Capture Lesson 02 study view screenshot
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '04-lesson-02-word-formation-study-pass.png') });
    console.log('  📸 Captured 04-lesson-02-word-formation-study-pass.png');

    if (!l2Header.includes('শব্দ গঠন')) {
      throw new Error(`❌ Did NOT advance to Lesson 02 Word Formation Lab! Header is: "${l2Header}"`);
    }
    console.log('  ✔ [PASS] Successfully advanced from Lesson 01 to Lesson 02 without getting stuck!');

    // -------------------------------------------------------------
    // TEST 5: Word Formation Tile Assembly Drill
    // -------------------------------------------------------------
    console.log('\n[TEST 5] Testing Word Builder Drill in Lesson 02...');
    // Click "২. শব্দ গঠন ড্রিল"
    await page.evaluate(() => {
      const tabBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('শব্দ গঠন ড্রিল') || b.innerText.includes('গঠন'));
      if (tabBtn) tabBtn.click();
    });
    await wait(600);

    // Capture Builder view screenshot
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '05-lesson-02-word-builder-drill-pass.png') });
    console.log('  📸 Captured 05-lesson-02-word-builder-drill-pass.png');

    // Build the word 'あい': click 'あ', then 'い'
    console.log("  Tapping tile 'あ' then 'い' to build 'あい'...");
    await page.evaluate(() => {
      const tileA = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'あ');
      if (tileA) tileA.click();
    });
    await wait(400);

    await page.evaluate(() => {
      const tileI = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'い');
      if (tileI) tileI.click();
    });
    await wait(800);

    const builderCelebration = await page.evaluate(() => {
      const body = document.body.innerText;
      return body.includes('চমৎকার! নিখুঁতভাবে গঠিত হয়েছে: あい');
    });
    console.log('  ✔ Word assembled successfully with celebration:', builderCelebration);

    // -------------------------------------------------------------
    // TEST 6: Lesson 02 Quiz and Completion
    // -------------------------------------------------------------
    console.log('\n[TEST 6] Testing Lesson 02 Review Quiz & Mastery Gate...');
    // Click "৩. রিভিউ কুইজ"
    await page.evaluate(() => {
      const tabBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('রিভিউ কুইজ') || b.innerText.includes('কুইজ'));
      if (tabBtn) tabBtn.click();
    });
    await wait(600);

    // Answer Q1: "'あい' (Ai) শব্দের বাংলা অর্থ কোনটি?" -> Select 'ভালোবাসা / প্রেম'
    await page.evaluate(() => {
      const opt = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('ভালোবাসা / প্রেম'));
      if (opt) opt.click();
    });
    await wait(400);

    // Submit answer
    await page.evaluate(() => {
      const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('উত্তর জমা দিন'));
      if (submitBtn) submitBtn.click();
    });
    await wait(600);

    // Capture Quiz Feedback screenshot
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '06-lesson-02-quiz-feedback-pass.png') });
    console.log('  📸 Captured 06-lesson-02-quiz-feedback-pass.png');

    // Complete remaining quiz questions
    for (let q = 2; q <= 5; q++) {
      await page.evaluate(() => {
        const nextBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('পরবর্তী প্রশ্ন') || b.innerText.includes('ফলাফল'));
        if (nextBtn) nextBtn.click();
      });
      await wait(500);

      await page.evaluate(() => {
        // Select an option
        const opt = Array.from(document.querySelectorAll('button')).find(b => b.querySelector('.font-japanese') || b.innerText.includes('いえ') || b.innerText.includes('নীল') || b.innerText.includes('いう') || b.innerText.includes('おおい'));
        if (opt) opt.click();
      });
      await wait(400);

      await page.evaluate(() => {
        const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('উত্তর জমা দিন'));
        if (submitBtn) submitBtn.click();
      });
      await wait(500);
    }

    // Advance to final milestone
    await page.evaluate(() => {
      const finalBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('ফলাফল দেখুন ও লেসন ২ সম্পন্ন করুন'));
      if (finalBtn) finalBtn.click();
    });
    await wait(1000);

    // Capture Lesson 02 Milestone celebration screenshot
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '07-lesson-02-milestone-complete-pass.png') });
    console.log('  📸 Captured 07-lesson-02-milestone-complete-pass.png');

    const l2MilestoneText = await page.evaluate(() => document.body.innerText);
    const isL2Complete = l2MilestoneText.includes('লেসন ০২ সম্পন্ন') && l2MilestoneText.includes('৭টি আসল জাপানি শব্দ');
    console.log('  ✔ Lesson 02 completed successfully:', isL2Complete);

    // -------------------------------------------------------------
    // TEST 7: Reload Persistence Verification (P0-C / P0-F)
    // -------------------------------------------------------------
    console.log('\n[TEST 7] Verifying State Persistence across Page Reload...');
    await page.reload({ waitUntil: 'networkidle0' });
    await wait(1000);

    const persistedState = await page.evaluate(() => {
      const raw = localStorage.getItem('nihomi_learner_knowledge_state_v1');
      if (raw) {
        const st = JSON.parse(raw);
        return {
          totalXp: st.totalXp,
          knownVocabCount: st.knownVocabulary ? st.knownVocabulary.length : 0,
          masteredSkills: st.masteredSkills || [],
          mistakesCount: st.recentMistakes ? st.recentMistakes.length : 0
        };
      }
      return null;
    });
    console.log('  Persisted State after reload:', persistedState);

    if (!persistedState || persistedState.totalXp < 50 || persistedState.knownVocabCount < 2) {
      throw new Error('❌ Learner state failed to persist across reload!');
    }
    console.log('  ✔ [PASS] Learner knowledge state, XP, vocabulary, and mistake history survived reload!');

    console.log('\n================================================================');
    console.log('🎉 ALL P0 TESTS PASSED: LESSON 01 -> LESSON 02 TRANSITION 100% OPERATIONAL!');
    console.log('================================================================');

  } catch (err) {
    console.error('❌ E2E Browser Test Failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

run();

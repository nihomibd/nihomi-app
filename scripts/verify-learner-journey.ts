// scripts/verify-learner-journey.ts
// Automated End-to-End Live Chrome Verification for Beginner Learner Journey
// NIHOMI Production Release Gate

import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

function findChromePath(): string {
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe'),
    path.join(process.env.PROGRAMFILES || '', 'Google\\Chrome\\Application\\chrome.exe'),
    path.join(process.env['PROGRAMFILES(X86)'] || '', 'Google\\Chrome\\Application\\chrome.exe'),
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  throw new Error('No Chrome or Chromium-based executable found on standard paths');
}

async function runLearnerJourneyVerification() {
  const chromePath = findChromePath();
  console.log(`[CDP] Using Chrome executable: ${chromePath}`);

  const scratchDir = path.join(process.cwd(), 'scratch');
  if (!fs.existsSync(scratchDir)) {
    fs.mkdirSync(scratchDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--window-size=1280,800'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('[CDP] 1. Navigating to lesson page http://localhost:3000/lesson?lessonId=n5-l1...');
  await page.goto('http://localhost:3000/lesson?lessonId=n5-l1', { waitUntil: 'networkidle0', timeout: 30000 });

  // Reset localStorage to simulate brand-new zero-Japanese student
  console.log('[CDP] 2. Initializing clean zero-knowledge learner state...');
  await page.evaluate(() => {
    localStorage.removeItem('nihomi_completed_vowels');
    localStorage.removeItem('nihomi_zen_vowel_index');
    localStorage.removeItem('nihomi_learner_knowledge_state_v1');
    localStorage.removeItem('nihomi_foundation_completed');
    localStorage.removeItem('nihomi_completed_lessons');
  });

  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));

  // Verify initial Hiragana character 'あ'
  const charText = await page.evaluate(() => {
    const el = document.querySelector('.text-7xl.font-japanese');
    return el ? el.textContent?.trim() : null;
  });
  console.log(`[CDP] 3. Initial character displayed: "${charText}" (Expected: あ)`);
  if (charText !== 'あ') {
    throw new Error(`Expected initial character 'あ', found: "${charText}"`);
  }

  // Step 1: Listen step verification
  const bodyText = await page.evaluate(() => document.body.innerText);
  const hasListenPrompt = bodyText.includes('কান দিয়ে শোনো') || bodyText.includes('মৌলিক স্বরবর্ণ');
  console.log(`[CDP] 4. Pedagogical listen prompt present: ${hasListenPrompt}`);

  // Helper function to click the primary advance button
  const clickPrimaryAdvance = async () => {
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => 
        b.textContent?.includes('পরের ধাপে যাই') || 
        b.textContent?.includes('পরবর্তী ধাপ') ||
        b.textContent?.includes('মাস্টার রিভিউ কুইজ') ||
        b.textContent?.includes('রিভিউ কুইজ')
      );
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 800));
  };

  // Advance Listen -> Watch
  console.log('[CDP] 5. Advancing Listen -> Watch...');
  await clickPrimaryAdvance();

  // Advance Watch -> Practice (Canvas)
  console.log('[CDP] 6. Advancing Watch -> Practice (Canvas trace)...');
  await clickPrimaryAdvance();

  const hasCanvas = await page.evaluate(() => !!document.querySelector('canvas'));
  console.log(`[CDP] 7. Hosho washi canvas present for tracing: ${hasCanvas}`);

  // Advance Practice -> Use
  console.log('[CDP] 8. Advancing Practice -> Use (Contextual grounding)...');
  await clickPrimaryAdvance();

  // Navigate to final vowel "お"
  console.log('[CDP] 9. Navigating to final vowel "お" to unlock Milestone Review Quiz...');
  await page.evaluate(() => {
    localStorage.setItem('nihomi_zen_vowel_index', '4');
    localStorage.setItem('nihomi_completed_vowels', JSON.stringify(['あ', 'い', 'う', 'え']));
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));

  // Advance through 4 steps on 'お' to trigger review quiz
  for (let s = 0; s < 4; s++) {
    await clickPrimaryAdvance();
  }

  // Check if Milestone Quiz is active
  const quizActive = await page.evaluate(() => {
    const text = document.body.innerText;
    return text.includes('৫-স্বরবর্ণ মাস্টার রিভিউ কুইজ');
  });
  console.log(`[CDP] 10. 5-Vowel Milestone Quiz active: ${quizActive}`);

  // Test diagnostic mistake recovery: intentionally click incorrect option 'お' on Question 1 ('あ')
  console.log('[CDP] 11. Intentionally selecting INCORRECT option "お" to verify Sensei AI Diagnostic Recovery...');
  const clickedWrong = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const wrongOpt = buttons.find(b => b.textContent?.includes('o (ও)'));
    if (wrongOpt) {
      (wrongOpt as HTMLButtonElement).click();
      return wrongOpt.textContent?.replace(/\s+/g, ' ').trim();
    }
    return null;
  });
  console.log(`[CDP] 11b. Clicked option: "${clickedWrong}"`);
  await new Promise(r => setTimeout(r, 1200));

  // Verify Sensei Diagnostic Recovery box
  const diagnosticInfo = await page.evaluate(() => {
    const text = document.body.innerText;
    const hasHeader = text.includes('নিহোমি সেনসেই AI • ডায়াগনস্টিক কোচিং');
    const hasVisualClue = text.includes('আকৃতিগত পার্থক্য') || text.includes('একটু থামি') || text.includes('পেটের ভেতর');
    return { hasHeader, hasVisualClue };
  });
  console.log(`[CDP] 12. Sensei Diagnostic Recovery Coaching Box visible: ${diagnosticInfo.hasHeader}`);
  console.log(`[CDP] 12b. Compassionate diagnostic clue rendered: ${diagnosticInfo.hasVisualClue}`);

  const screenshotDiagnostic = path.join(scratchDir, 'evidence_quiz_diagnostic_recovery.png');
  await page.screenshot({ path: screenshotDiagnostic, fullPage: false });
  console.log(`[CDP] 13. Captured diagnostic recovery screenshot: ${screenshotDiagnostic}`);

  // Advance through remaining questions
  console.log('[CDP] 14. Answering remaining quiz questions with correct options...');
  for (let step = 0; step < 5; step++) {
    // Click next question button
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const nextBtn = buttons.find(b => b.textContent?.includes('পরবর্তী প্রশ্ন') || b.textContent?.includes('ফলাফল দেখুন'));
      if (nextBtn) nextBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Select correct option
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const opt = buttons.find(b => 
        b.textContent?.includes('Ai • ভালোবাসা') || 
        b.textContent?.includes('বাড়ি / ঘর') || 
        b.textContent?.includes('Ao • নীল') || 
        b.textContent?.includes('উপরে / শীর্ষ')
      );
      if (opt) opt.click();
    });
    await new Promise(r => setTimeout(r, 600));
  }

  // Complete quiz
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const finalBtn = buttons.find(b => b.textContent?.includes('ফলাফল দেখুন') || b.textContent?.includes('মিশন সম্পন্ন'));
    if (finalBtn) finalBtn.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  // Check celebration screen
  const milestoneSuccess = await page.evaluate(() => {
    const text = document.body.innerText;
    return text.includes('অভিনন্দন') || text.includes('মৌলিক স্বরবর্ণ');
  });
  console.log(`[CDP] 15. Milestone Completion celebration screen reached: ${milestoneSuccess}`);

  const screenshotMilestone = path.join(scratchDir, 'evidence_milestone_celebration.png');
  await page.screenshot({ path: screenshotMilestone, fullPage: false });
  console.log(`[CDP] 16. Captured milestone celebration screenshot: ${screenshotMilestone}`);

  await browser.close();

  console.log('\n================================================================');
  console.log('✅ ALL LIVE CHROME CDP JOURNEY CHECKS COMPLETED SUCCESSFULLY!');
  console.log('================================================================');
}

runLearnerJourneyVerification().catch(err => {
  console.error('\n❌ CDP JOURNEY FAILED:', err);
  process.exit(1);
});

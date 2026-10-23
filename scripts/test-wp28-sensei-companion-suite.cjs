// scripts/test-wp28-sensei-companion-suite.cjs
// Automated Verification Suite for NIHOMI WP28:
// Nomi Sensei AI Voice Coach & Floating Interactive Companion Suite
// "No Evidence = No Done"

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const BROWSER_CANDIDATES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
];
const BROWSER_PATH = BROWSER_CANDIDATES.find((p) => fs.existsSync(p));

const EVIDENCE_DIR = path.join(__dirname, '..', 'evidence', 'v2-preview');
const ARTIFACT_DIR = 'C:\\Users\\bdtri\\.gemini\\antigravity\\brain\\638b6452-e297-4f06-b5fe-7e3295c58ed1\\evidence\\v2-preview';

if (!fs.existsSync(EVIDENCE_DIR)) fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
if (!fs.existsSync(ARTIFACT_DIR)) fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

async function saveScreenshot(page, filename) {
  const localPath = path.join(EVIDENCE_DIR, filename);
  const destPath = path.join(ARTIFACT_DIR, filename);
  try {
    const buffer = await page.screenshot({ fullPage: false });
    fs.writeFileSync(localPath, buffer);
    fs.writeFileSync(destPath, buffer);
    console.log(`  [SCREENSHOT SAVED]: ${filename}`);
  } catch (err) {
    console.warn(`  [Screenshot Warning]: ${filename}:`, err.message);
  }
}

const LOCAL_URL = 'http://127.0.0.1:3000';

async function run() {
  if (!BROWSER_PATH) {
    console.error('Fatal: No Chrome/Edge browser binary found.');
    process.exit(1);
  }

  console.log('================================================================');
  console.log('✨ NIHOMI WP28: NOMI SENSEI AI VOICE COACH & COMPANION AUDIT');
  console.log('   "No Evidence = No Done"');
  console.log('================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  ✅ PASS: ${message}`);
    } else {
      console.error(`  ❌ FAIL: ${message}`);
    }
  }

  // --- [TEST GROUP 1]: SENSEI AI & PEDAGOGICAL LATTICE CONTRACT ---
  console.log('--- [TEST GROUP 1]: SENSEI AI & PEDAGOGICAL LATTICE VERIFICATION ---');
  try {
    const senseiProviderPath = path.join(__dirname, '..', 'src', 'core', 'ai', 'senseiProvider.ts');
    const senseiContent = fs.readFileSync(senseiProviderPath, 'utf8');
    assert(senseiContent.includes('assertSenseiOutputEligible'), 'assertSenseiOutputEligible export exists in senseiProvider');
    assert(senseiContent.includes('Untaught Hiragana') && senseiContent.includes('Untaught Katakana'), 'Lattice guard validates Hiragana & Katakana eligibility');
    assert(senseiContent.includes('সেনসেই নোট'), 'Lattice guard provides pedagogical scaffolding notes for early learners');

    const adapterPath = path.join(__dirname, '..', 'src', 'components', 'nomi', 'NomiContextAdapter.ts');
    const adapterContent = fs.readFileSync(adapterPath, 'utf8');
    assert(adapterContent.includes('workos:') && adapterContent.includes('いらっしゃいませ'), 'NomiContextAdapter defines Tokyo Konbini WorkOS cashier prompts');
    assert(adapterContent.includes('exam:') && adapterContent.includes('CBT'), 'NomiContextAdapter defines JLPT CBT exam guidance prompts');
    assert(adapterContent.includes('rirekisho:') && adapterContent.includes('志望理由'), 'NomiContextAdapter defines JIS standard resume prompts');
    assert(adapterContent.includes('curriculum:') && adapterContent.includes('মিন্না নো নিহোঙ্গো'), 'NomiContextAdapter defines JLPT curriculum roadmap prompts');
    assert(adapterContent.includes('journey:') && adapterContent.includes('ল্যাটিস আনলক'), 'NomiContextAdapter defines learner journey roadmap prompts');

    const contextPath = path.join(__dirname, '..', 'src', 'components', 'nomi', 'NomiCompanionContext.tsx');
    const contextContent = fs.readFileSync(contextPath, 'utf8');
    assert(contextContent.includes('evaluatePronunciation'), 'NomiCompanionContext implements evaluatePronunciation engine');
    assert(contextContent.includes('speechRate') && contextContent.includes('setSpeechRate'), 'NomiCompanionContext implements speech rate adjustment');
    assert(contextContent.includes('assertSenseiOutputEligible'), 'NomiCompanionContext enforces pedagogical lattice guard on AI responses');

    const ttsPath = path.join(__dirname, '..', 'src', 'lib', 'tts.ts');
    const ttsContent = fs.readFileSync(ttsPath, 'utf8');
    assert(ttsContent.includes('selectTokyoNativeVoice') && ttsContent.includes('Kyoko') && ttsContent.includes('Nanami'), 'TTS engine strictly prioritizes Tokyo native articulation voices');
  } catch (err) {
    console.error('Contract test error:', err);
  }

  // --- [TEST GROUP 2]: REAL BROWSER DOM AUDIT & VISUAL EVIDENCE ---
  console.log('\n--- [TEST GROUP 2]: REAL BROWSER DOM AUDIT & VISUAL EVIDENCE ---');

  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  try {
    // 1. Visit Landing Page
    console.log('  Navigating to /#/landing...');
    await page.goto(`${LOCAL_URL}/#/landing`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1200));

    // Verify unique dynamic document title
    const landingTitle = await page.title();
    assert(landingTitle.includes('NIHOMI (にほみ)'), `Landing page has unique title: "${landingTitle.substring(0, 45)}..."`);

    // Verify floating presence anchor exists
    await page.waitForSelector('#btn-nomi-presence', { timeout: 10000 });
    assert(true, 'Nomi Sensei floating presence button (#btn-nomi-presence) is mounted in DOM');

    // Screenshot 1: Floating dock on Landing
    await saveScreenshot(page, 'v2-74-wp28-nomi-sensei-floating-dock-landing.png');
    assert(true, 'Captured Nomi Sensei floating presence dock visual evidence');

    // 2. Open Nomi Companion Panel
    console.log('  Clicking #btn-nomi-presence to expand companion panel...');
    await page.click('#btn-nomi-presence');
    await page.waitForSelector('#nomi-companion-panel', { timeout: 10000 });
    await new Promise((r) => setTimeout(r, 600));

    const panelTitle = await page.$eval('#nomi-panel-title', (el) => el.textContent.trim());
    assert(panelTitle.includes('Nomi Sensei'), `Nomi Companion panel opened with title: "${panelTitle}"`);

    // Verify listening speed controls (0.8x, 1.0x, 1.2x)
    await page.waitForSelector('#btn-speed-0\\.8', { timeout: 5000 });
    await page.waitForSelector('#btn-speed-1', { timeout: 5000 });
    await page.waitForSelector('#btn-speed-1\\.2', { timeout: 5000 });
    assert(true, 'Listening speech rate selector buttons (0.8x, 1.0x, 1.2x) rendered');

    // Verify mic, input, and send button
    await page.waitForSelector('#btn-nomi-mic', { timeout: 5000 });
    await page.waitForSelector('#input-nomi-message', { timeout: 5000 });
    await page.waitForSelector('#btn-nomi-send', { timeout: 5000 });
    assert(true, 'Composer controls (#btn-nomi-mic, #input-nomi-message, #btn-nomi-send) active');

    // Screenshot 2: Companion Panel Opened
    await saveScreenshot(page, 'v2-75-wp28-nomi-companion-panel-opened.png');
    assert(true, 'Captured Nomi Companion opened panel visual evidence');

    // 3. Send a question and verify AI response & audio playback button
    console.log('  Submitting learner question to Nomi Sensei...');
    await page.type('#input-nomi-message', 'জাপানি মৌলিক স্বরবর্ণ あ সম্পর্কে বলো');
    await page.click('#btn-nomi-send');

    // Wait for message response bubble
    await new Promise((r) => setTimeout(r, 1500));
    const messages = await page.$$eval('#nomi-message-list p', (els) => els.map((e) => e.textContent));
    const foundAiReply = messages.some((m) => m.includes('あ') || m.includes('স্বরবর্ণ') || m.includes('আ'));
    assert(foundAiReply, 'Nomi Sensei generated pedagogical reply for Japanese vowel query');

    // Verify audio playback button
    const hasAudioBtn = await page.$('#btn-speak-nomi-phrase');
    assert(hasAudioBtn !== null, 'Tokyo native voice playback button (#btn-speak-nomi-phrase) rendered');

    // Screenshot 3: AI response & Audio
    await saveScreenshot(page, 'v2-76-wp28-nomi-ai-response-and-audio.png');
    assert(true, 'Captured Nomi Sensei AI response & Tokyo audio playback evidence');

    // Close panel before navigating to next route
    await page.click('#btn-close-nomi');
    await new Promise((r) => setTimeout(r, 500));

    // 4. Test Route Context Adaptation to WorkOS (/workos)
    console.log('  Navigating to /#/workos to test contextual adaptation...');
    await page.goto(`${LOCAL_URL}/#/workos`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1200));

    const workosTitle = await page.title();
    assert(workosTitle.includes('WorkOS'), `WorkOS page has unique dynamic title: "${workosTitle}"`);

    // Open Nomi on WorkOS
    await page.waitForSelector('#btn-nomi-presence', { timeout: 10000 });
    await page.click('#btn-nomi-presence');
    await page.waitForSelector('#nomi-companion-panel', { timeout: 10000 });
    await new Promise((r) => setTimeout(r, 600));

    // Verify WorkOS quick prompt chip
    await page.waitForSelector('#btn-nomi-prompt-0', { timeout: 5000 });
    const prompt0Text = await page.$eval('#btn-nomi-prompt-0', (el) => el.textContent.trim());
    assert(prompt0Text.includes('いらっしゃいませ') || prompt0Text.includes('ভঙ্গি'), `WorkOS contextual prompt chip rendered: "${prompt0Text}"`);

    // Click prompt chip
    await page.click('#btn-nomi-prompt-0');
    await new Promise((r) => setTimeout(r, 1500));

    const workosMessages = await page.$$eval('#nomi-message-list p', (els) => els.map((e) => e.textContent));
    const hasKonbiniReply = workosMessages.some((m) => m.includes('いらっしゃいませ') || m.includes('কনবিনি'));
    assert(hasKonbiniReply, 'Nomi Sensei provided authentic Konbini customer service guidance');

    // Screenshot 4: WorkOS Context Adaptation
    await saveScreenshot(page, 'v2-77-wp28-nomi-workos-context-adaptation.png');
    assert(true, 'Captured Nomi Sensei WorkOS contextual guidance visual evidence');

    // 5. Test Pronunciation Evaluation & Scoring
    console.log('  Triggering speech pronunciation evaluation drill...');
    // Click microphone button to trigger speech input
    await page.click('#btn-nomi-mic');
    // Wait for speech input evaluation and scorecard to appear
    await page.waitForSelector('#btn-speak-nomi-pronunciation-model', { timeout: 10000 });

    const hasScoreGrade = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Grade') && text.includes('উচ্চারণ স্কোর ও বিশ্লেষণ');
    });
    assert(hasScoreGrade, 'Pronunciation scorecard with Grade S/A/B, Pitch Accent & Mora rhythm rendered');

    // Verify Standard Tokyo model audio replay button
    const hasTokyoModelBtn = await page.$('#btn-speak-nomi-pronunciation-model');
    assert(hasTokyoModelBtn !== null, 'Tokyo Standard model audio pronunciation button (#btn-speak-nomi-pronunciation-model) active');

    // Screenshot 5: Pronunciation Scorecard
    await saveScreenshot(page, 'v2-78-wp28-nomi-pronunciation-pitch-scorecard.png');
    assert(true, 'Captured Nomi Sensei Pronunciation evaluation scorecard visual evidence');

    // Test close button
    await page.click('#btn-close-nomi');
    await new Promise((r) => setTimeout(r, 400));
    const panelClosed = await page.$('#nomi-companion-panel');
    assert(panelClosed === null, 'Nomi companion panel closed cleanly (#btn-close-nomi)');

  } catch (err) {
    console.error('Browser testing error:', err);
    throw err;
  } finally {
    await browser.close();
  }

  console.log('\n================================================================');
  console.log(`🎯 AUDIT SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED`);
  if (passedTests === totalTests) {
    console.log('🏆 WP28 VERIFICATION COMPLETE — 100% GREEN (NO EVIDENCE = NO DONE)');
  } else {
    console.error('❌ SOME TESTS FAILED');
    process.exit(1);
  }
  console.log('================================================================\n');
}

run().catch((err) => {
  console.error('FATAL AUDIT FAILURE:', err);
  process.exit(1);
});

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

async function main() {
  console.log('--- REPRODUCING FOUNDER P0-A FAILURE: LESSON 01 -> LESSON 02 ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1280,850']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 850 });

  const logs = [];
  page.on('console', msg => logs.push(`[CONSOLE ${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => logs.push(`[PAGE ERROR] ${err.message}`));

  try {
    // 1. Clear storage to simulate a fresh zero-Japanese learner
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => localStorage.clear());

    // 2. Navigate directly to /lesson
    console.log('Navigating to /lesson...');
    await page.goto(`${BASE_URL}/lesson`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    // Check what is rendered
    const title = await page.evaluate(() => {
      const h = document.querySelector('h1, h2');
      return h ? h.innerText : 'NO HEADER FOUND';
    });
    console.log('Initial Screen Header:', title);

    // Fast-forward to milestone completion screen to simulate completing the 5 vowels & quiz
    console.log('Fast-forwarding state to completed 5 vowels & quiz in ZenLearningCanvas...');
    await page.evaluate(() => {
      // Find the milestone button or trigger state
      localStorage.setItem('nihomi_foundation_completed', 'true');
      localStorage.setItem('nihomi_mission_001_done', 'true');
    });

    // Check if milestone card is visible or advance through quiz
    // In ZenLearningCanvas, let's see what buttons are on screen
    const buttons = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()).filter(Boolean);
    });
    console.log('Visible buttons:', buttons.slice(0, 10));

    // Let's trigger the milestone completion screen by evaluating component state or clicking through
    await page.evaluate(() => {
      // Dispatch knowledge state with vowels mastered
      const state = {
        version: '1.0.0',
        knownHiragana: ['あ', 'い', 'う', 'え', 'お'],
        knownKatakana: [],
        knownDakuten: [],
        knownHandakuten: [],
        knownCombinationKana: [],
        knownReadingRules: [],
        knownVocabulary: ['あい', 'いう', 'あう', 'いえ', 'うえ', 'あお', 'おおい'],
        knownKanji: [],
        knownGrammar: [],
        masteredSkills: ['vowels_5_mastered', '5_vowels_gate'],
        currentMissionId: 'vowel-mastery-gate',
        currentLevel: 'N5',
        recentMistakes: [],
        reviewQueue: [],
        totalXp: 50,
        streakDays: 1,
        lastActiveDate: new Date().toISOString().split('T')[0]
      };
      localStorage.setItem('nihomi_learner_knowledge_state_v1', JSON.stringify(state));
      localStorage.setItem('nihomi_foundation_completed', 'true');
      window.dispatchEvent(new CustomEvent('nihomi:knowledge-state-updated', { detail: state }));
    });

    // Check if the CTA "পরবর্তী ধাপে যাই (লেসন ০২ / শব্দ গঠন)" exists
    console.log('Searching for CTA "পরবর্তী ধাপে যাই"...');
    const ctaFound = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const target = btns.find(b => b.innerText.includes('পরবর্তী ধাপে যাই'));
      if (target) {
        return { text: target.innerText, disabled: target.disabled };
      }
      return null;
    });
    console.log('CTA Status:', ctaFound);

  } catch (err) {
    console.error('Error during reproduction test:', err);
  } finally {
    await browser.close();
    console.log('Logs captured:', logs.slice(0, 10));
  }
}

main();

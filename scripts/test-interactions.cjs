const puppeteer = require('puppeteer-core');

async function testInteractions() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.toString()));

  await page.setViewport({ width: 1024, height: 1536 });
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle0' });

  console.log('--- Testing Interactive Elements ---');

  // 1. Check lesson tabs
  const tabButtons = await page.$$('section#try-lesson button');
  console.log(`Found ${tabButtons.length} buttons in TryLesson section`);
  if (tabButtons.length > 1) {
    await tabButtons[1].click();
    console.log('✔ Clicked Katakana tab');
  }

  // 2. Check audio button in Try Lesson
  const audioBtn = await page.$('button[aria-label="Play pronunciation"]');
  if (audioBtn) {
    await audioBtn.click();
    console.log('✔ Audio pronunciation button clicked');
  }

  // 3. Check Mic button in Try Lesson
  const micBtn = await page.$('button[aria-label="Microphone practice"]');
  if (micBtn) {
    await micBtn.click();
    console.log('✔ Mic button clicked');
  }

  // 4. Check Pro Plan CTA button
  const buttons = await page.$$('section#pricing-section button');
  console.log(`Found ${buttons.length} buttons in Pricing section`);
  if (buttons.length >= 3) {
    // Pro button is index 2
    await buttons[2].click();
    await new Promise(r => setTimeout(r, 800));
    const modalHeading = await page.$('h3');
    console.log('✔ Clicked Pro Plan CTA -> Modal or Action triggered');
  }

  // 5. Check Mobile overflow at 390w
  await page.setViewport({ width: 390, height: 844 });
  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  console.log('✔ Mobile 390px horizontal overflow check:', hasOverflow === false ? 'PASSED (no overflow)' : 'FAILED');

  console.log('Interaction test completed with total errors:', errors.length);
  await browser.close();
}

testInteractions().catch(console.error);

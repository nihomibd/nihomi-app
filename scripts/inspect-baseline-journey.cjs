const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\bdtri\\.gemini\\antigravity-ide\\brain\\f09ee804-2146-4121-96e0-aed91c5ebe78';

async function clickByText(page, text) {
  const found = await page.evaluate((targetText) => {
    const buttons = Array.from(document.querySelectorAll('button, a, div[role="button"], span'));
    const el = buttons.find(b => b.innerText && b.innerText.includes(targetText));
    if (el) {
      el.scrollIntoView({ behavior: 'instant', block: 'center' });
      el.click();
      return true;
    }
    return false;
  }, text);

  if (!found) {
    throw new Error(`Element containing text "${text}" not found.`);
  }
}

async function auditLayout(page, stageName, viewportLabel) {
  return await page.evaluate((sName, vLabel) => {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;
    const clientWidth = window.innerWidth;
    const hasVerticalScroll = scrollHeight > clientHeight + 5; // buffer for subpixel
    
    // Find main container width
    const mainEl = document.querySelector('main');
    const mainRect = mainEl ? mainEl.getBoundingClientRect() : null;
    const mainWidth = mainRect ? mainRect.width : 0;
    const leftVoid = mainRect ? mainRect.left : 0;
    const rightVoid = mainRect ? clientWidth - mainRect.right : 0;
    
    // Check below the fold elements
    const konbiniButtons = Array.from(document.querySelectorAll('button')).filter(b => 
      ['あ', 'り', 'が', 'と', 'う'].includes(b.innerText.trim())
    );
    const konbiniChipBelowFold = konbiniButtons.some(b => {
      const r = b.getBoundingClientRect();
      return r.bottom > clientHeight;
    });

    const ctaButton = document.querySelector('button[type="submit"], button.active\\:scale-95');
    const ctaRect = ctaButton ? ctaButton.getBoundingClientRect() : null;
    const ctaBelowFold = ctaRect ? ctaRect.bottom > clientHeight : false;

    return {
      stageName: sName,
      viewportLabel: vLabel,
      scrollHeight,
      clientHeight,
      clientWidth,
      hasVerticalScroll,
      mainWidth,
      leftVoid,
      rightVoid,
      voidPercentage: ((leftVoid + rightVoid) / clientWidth * 100).toFixed(1),
      konbiniChipBelowFold,
      ctaBelowFold
    };
  }, stageName, viewportLabel);
}

async function runBaselineAudit() {
  console.log('=== STARTING MISSION WORLD v6.0 BASELINE AUDIT ===');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const auditReport = [];

  try {
    // -----------------------------------------------------------------
    // DESKTOP 1440 x 900
    // -----------------------------------------------------------------
    console.log('\n--- AUDITING DESKTOP 1440x900 ---');
    const page1440 = await browser.newPage();
    await page1440.setViewport({ width: 1440, height: 900 });
    await page1440.goto('http://localhost:3000/journey', { waitUntil: 'networkidle0' });

    // Stage 1
    const d1440_s1 = await auditLayout(page1440, 'Stage 1: Welcome', '1440x900');
    auditReport.push(d1440_s1);
    await page1440.screenshot({ path: path.join(ARTIFACTS_DIR, 'baseline_desktop_1440_stage1.png') });

    // Stage 2: Kana Engine
    await clickByText(page1440, 'চলো শুরু করি');
    await new Promise(r => setTimeout(r, 400));
    const d1440_s2 = await auditLayout(page1440, 'Stage 2: Kana Trace', '1440x900');
    auditReport.push(d1440_s2);
    await page1440.screenshot({ path: path.join(ARTIFACTS_DIR, 'baseline_desktop_1440_stage2.png') });

    // Draw strokes to advance
    const canvasHandle = await page1440.$('canvas.cursor-crosshair');
    if (canvasHandle) {
      const box = await canvasHandle.boundingBox();
      for (let s = 0; s < 3; s++) {
        await page1440.mouse.move(box.x + box.width * (0.3 + 0.1 * s), box.y + box.height * 0.3);
        await page1440.mouse.down();
        await page1440.mouse.move(box.x + box.width * (0.6 + 0.1 * s), box.y + box.height * 0.6);
        await page1440.mouse.up();
        await new Promise(r => setTimeout(r, 100));
      }
    }
    await new Promise(r => setTimeout(r, 400));
    await clickByText(page1440, 'পরের ধাপে যাই');
    await new Promise(r => setTimeout(r, 400));

    // Stage 3: Light Personalization
    const d1440_s3 = await auditLayout(page1440, 'Stage 3: Personalization', '1440x900');
    auditReport.push(d1440_s3);
    await page1440.screenshot({ path: path.join(ARTIFACTS_DIR, 'baseline_desktop_1440_stage3.png') });

    await clickByText(page1440, 'পড়াশোনা বা চাকরি');
    await clickByText(page1440, "আমাদের প্রথম শব্দটা শিখি");
    await new Promise(r => setTimeout(r, 400));

    // Stage 4 Word: Asa
    const d1440_s4 = await auditLayout(page1440, 'Stage 4: Word Asa', '1440x900');
    auditReport.push(d1440_s4);
    await page1440.screenshot({ path: path.join(ARTIFACTS_DIR, 'baseline_desktop_1440_stage4_word.png') });

    await clickByText(page1440, 'টোকিও কনবিনিতে ব্যবহার করি');
    await new Promise(r => setTimeout(r, 500));

    // Stage 5: Konbini Scenario
    const d1440_s5 = await auditLayout(page1440, 'Stage 5: Tokyo Konbini', '1440x900');
    auditReport.push(d1440_s5);
    await page1440.screenshot({ path: path.join(ARTIFACTS_DIR, 'baseline_desktop_1440_stage5_konbini.png') });

    // Solve Konbini
    const buttons = await page1440.$$('button');
    for (const b of buttons) {
      const text = await (await b.getProperty('innerText')).jsonValue();
      if (text.trim() === 'あ') {
        await b.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 400));
    await clickByText(page1440, 'মিশন ০১ সম্পন্ন করি');
    await new Promise(r => setTimeout(r, 500));

    // Stage 6: Mission Complete
    const d1440_s6 = await auditLayout(page1440, 'Stage 6: Mission Complete', '1440x900');
    auditReport.push(d1440_s6);
    await page1440.screenshot({ path: path.join(ARTIFACTS_DIR, 'baseline_desktop_1440_stage6_complete.png') });

    await page1440.close();

    // -----------------------------------------------------------------
    // DESKTOP 1920 x 1080
    // -----------------------------------------------------------------
    console.log('\n--- AUDITING DESKTOP 1920x1080 ---');
    const page1920 = await browser.newPage();
    await page1920.setViewport({ width: 1920, height: 1080 });
    await page1920.goto('http://localhost:3000/journey', { waitUntil: 'networkidle0' });

    const d1920_s1 = await auditLayout(page1920, 'Stage 1: Welcome', '1920x1080');
    auditReport.push(d1920_s1);
    await page1920.screenshot({ path: path.join(ARTIFACTS_DIR, 'baseline_desktop_1920_stage1.png') });

    await page1920.close();

    // -----------------------------------------------------------------
    // MOBILE 390 x 844
    // -----------------------------------------------------------------
    console.log('\n--- AUDITING MOBILE 390x844 ---');
    const pageMobile = await browser.newPage();
    await pageMobile.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await pageMobile.goto('http://localhost:3000/journey', { waitUntil: 'networkidle0' });

    const mob_s1 = await auditLayout(pageMobile, 'Stage 1: Welcome', '390x844');
    auditReport.push(mob_s1);
    await pageMobile.screenshot({ path: path.join(ARTIFACTS_DIR, 'baseline_mobile_390_stage1.png') });

    await clickByText(pageMobile, 'চলো শুরু করি');
    await new Promise(r => setTimeout(r, 400));

    const mob_s2 = await auditLayout(pageMobile, 'Stage 2: Kana Trace', '390x844');
    auditReport.push(mob_s2);
    await pageMobile.screenshot({ path: path.join(ARTIFACTS_DIR, 'baseline_mobile_390_stage2.png') });

    await pageMobile.close();

    console.log('\n=== BASELINE AUDIT RESULTS ===');
    console.table(auditReport);

    fs.writeFileSync(
      path.join(__dirname, 'baseline_audit_data.json'),
      JSON.stringify(auditReport, null, 2)
    );
    console.log('Saved baseline audit data to scripts/baseline_audit_data.json');

  } catch (err) {
    console.error('Audit failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

runBaselineAudit();

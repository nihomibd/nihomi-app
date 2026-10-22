// scripts/test-v2-auth-and-roles.ts
// Verification Suite for NIHOMI V2 Role-Based Auth, Modal Responsiveness, and Avatar Hydration
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { canonicalizeRole } from '../server/authHelper.js';

const BROWSER_CANDIDATES = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
];
const BROWSER_PATH = BROWSER_CANDIDATES.find((p) => fs.existsSync(p));

const LOCAL_URL = 'http://127.0.0.1:3000';

async function runAuthAndRolesSuite() {
  console.log('================================================================');
  console.log('🧪 NIHOMI V2 ROLE-BASED AUTH & AVATAR VERIFICATION SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, message: string) {
    total++;
    if (condition) {
      passed++;
      console.log(`  ✔ PASS: ${message}`);
    } else {
      console.error(`  ❌ FAIL: ${message}`);
    }
  }

  // Unit Checks: Strict 2-Role Canonicalization
  console.log('[Phase 1] Unit Test: Strict 2-Role Canonicalization Rules...');
  const founderRole = canonicalizeRole('mdtanvirkabirbiplob@gmail.com');
  const founderRoleUpper = canonicalizeRole('MDTANVIRKABIRBIPLOB@GMAIL.COM');
  const studentRole1 = canonicalizeRole('student@gmail.com');
  const studentRole2 = canonicalizeRole('other.person@yahoo.com');
  const studentRoleEmpty = canonicalizeRole(undefined);

  assert(founderRole === 'founder', 'mdtanvirkabirbiplob@gmail.com canonicalizes strictly to "founder"');
  assert(founderRoleUpper === 'founder', 'Uppercase founder email canonicalizes strictly to "founder"');
  assert(studentRole1 === 'student', 'General email canonicalizes strictly to "student"');
  assert(studentRole2 === 'student', 'Alternate domain email canonicalizes strictly to "student"');
  assert(studentRoleEmpty === 'student', 'Undefined email canonicalizes strictly to "student"');

  // Phase 2: Real Headless Browser End-to-End Test
  console.log('\n[Phase 2] Real Headless Browser E2E: V2 Modal & Role Interaction...');
  if (!BROWSER_PATH) {
    console.error('Fatal: No Chrome or Edge browser found.');
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  try {
    const page = await browser.newPage();

    // Test 1: Desktop Login Button triggers AuthModal
    console.log('\n  [Browser 1] Testing Desktop Header "Login / Sign-up" button click...');
    await page.setViewport({ width: 1280, height: 900 });
    await page.goto(`${LOCAL_URL}/`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    // Clear any previous session
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    // Check header login button exists
    const hasHeaderLogin = await page.$('#header-login-btn');
    assert(Boolean(hasHeaderLogin), 'Desktop Header Login button (#header-login-btn) is rendered in V2');

    // Click Login Button
    await page.click('#header-login-btn');
    await new Promise((r) => setTimeout(r, 600));

    // Verify AuthModal is visible
    const modalVisible = await page.evaluate(() => {
      const overlay = document.getElementById('auth-modal-overlay');
      const card = document.getElementById('auth-modal-card');
      const googleBtn = document.getElementById('btn-google-continue');
      return Boolean(overlay && card && googleBtn);
    });
    assert(modalVisible, 'Clicking Header Login button immediately renders #auth-modal-overlay and #btn-google-continue');

    // Test 2: Founder Role Authentication via Modal
    console.log('\n  [Browser 2] Testing Founder Quick Sign-In and Avatar Rendering...');
    const hasFounderBtn = await page.$('#btn-quick-founder-preview');
    assert(Boolean(hasFounderBtn), 'Founder Quick Access button is present in AuthModal');

    await page.click('#btn-quick-founder-preview');
    await new Promise((r) => setTimeout(r, 1200));

    const founderState = await page.evaluate(() => {
      const rawUser = localStorage.getItem('nihomi_user');
      const user = rawUser ? JSON.parse(rawUser) : null;
      const founderBtn = document.getElementById('header-founder-cockpit-btn');
      const profileBtn = document.getElementById('header-user-profile-btn');
      const avatarImg = profileBtn?.querySelector('img');
      return {
        role: user?.role,
        email: user?.email,
        hasFounderBtn: Boolean(founderBtn),
        avatarSrc: avatarImg?.getAttribute('src'),
        hasNoReferrer: avatarImg?.getAttribute('referrerpolicy') === 'no-referrer'
      };
    });

    assert(founderState.role === 'founder', `Founder role is strictly "founder" (got: "${founderState.role}")`);
    assert(founderState.email === 'mdtanvirkabirbiplob@gmail.com', 'Founder email matches mdtanvirkabirbiplob@gmail.com');
    assert(founderState.hasFounderBtn, 'Founder Cockpit gateway (#header-founder-cockpit-btn) is unlocked and visible');
    assert(Boolean(founderState.avatarSrc), `Founder avatar <img> is rendered in V2Header with src`);
    assert(founderState.hasNoReferrer, 'Founder avatar has referrerPolicy="no-referrer" to prevent blocking');

    // Test 3: Logout
    console.log('\n  [Browser 3] Testing Logout and Return to Guest State...');
    await page.click('#header-user-profile-btn');
    await new Promise((r) => setTimeout(r, 500));
    await page.click('#dropdown-logout-btn');
    await new Promise((r) => setTimeout(r, 800));

    const loggedOut = await page.evaluate(() => {
      const rawUser = localStorage.getItem('nihomi_user');
      const loginBtn = document.getElementById('header-login-btn');
      return !rawUser && Boolean(loginBtn);
    });
    assert(loggedOut, 'Logout removes session and restores Header Login button');

    // Test 4: Mobile Drawer Login
    console.log('\n  [Browser 4] Testing Mobile 390px Drawer Login and Student Role...');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    // Open mobile hamburger
    await page.click('#mobile-menu-toggle-btn');
    await new Promise((r) => setTimeout(r, 600));

    const mobileDrawerLogin = await page.$('#mobile-drawer-login-btn');
    assert(Boolean(mobileDrawerLogin), 'Mobile Drawer renders #mobile-drawer-login-btn for unauthenticated visitor');

    // Click Mobile Drawer Login
    await page.click('#mobile-drawer-login-btn');
    await new Promise((r) => setTimeout(r, 600));

    const mobileModalVisible = await page.evaluate(() => {
      return Boolean(document.getElementById('auth-modal-overlay'));
    });
    assert(mobileModalVisible, 'Clicking Mobile Drawer Login opens #auth-modal-overlay on 390px viewport');

    // Sign in as Student
    await page.click('#btn-quick-student-preview');
    await new Promise((r) => setTimeout(r, 1200));

    const studentState = await page.evaluate(() => {
      const rawUser = localStorage.getItem('nihomi_user');
      const user = rawUser ? JSON.parse(rawUser) : null;
      const founderBtn = document.getElementById('header-founder-cockpit-btn');
      return {
        role: user?.role,
        hasNoFounderBtn: !founderBtn
      };
    });

    assert(studentState.role === 'student', `Student role is strictly "student" (got: "${studentState.role}")`);
    assert(studentState.hasNoFounderBtn, 'Founder Cockpit gateway is strictly HIDDEN for student');

  } catch (err: any) {
    console.error('Browser Test Error:', err);
    assert(false, 'Browser execution threw an unhandled exception');
  } finally {
    await browser.close();
  }

  console.log('\n================================================================');
  console.log(`📊 TOTAL SUITE RESULTS: ${passed}/${total} PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('================================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runAuthAndRolesSuite().catch((err) => {
  console.error(err);
  process.exit(1);
});

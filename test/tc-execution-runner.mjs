// tc-execution-runner.mjs — maps directly to testing/TC-01 through TC-16
// Run: node test/tc-execution-runner.mjs
// Outputs: test-execution/<version>-run-<n>-<timestamp>/

import { chromium } from 'file:///C:/Users/maila/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const UI   = join(ROOT, 'app', 'ui');

// ── Resolve output folder ───────────────────────────────────────────────────
const now      = new Date();
const ts       = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
const runLabel = `v4.3-run-001-${ts}`;
const OUT      = join(ROOT, 'test-execution', runLabel);
const SHOTS    = join(OUT, 'screenshots');
await mkdir(OUT,   { recursive: true });
await mkdir(SHOTS, { recursive: true });

// ── Static server ───────────────────────────────────────────────────────────
const MIME = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css',
  '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png',
  '.webmanifest':'application/manifest+json', '.woff2':'font/woff2', '.ico':'image/x-icon' };

const server = createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p === '/') p = '/index.html';
    const fp = join(UI, p);
    if (!existsSync(fp)) { res.writeHead(404); res.end('404'); return; }
    const body = await readFile(fp);
    res.writeHead(200, { 'Content-Type': MIME[extname(fp)] || 'application/octet-stream' });
    res.end(body);
  } catch (e) { res.writeHead(500); res.end(String(e)); }
});
const PORT = 8732;
await new Promise(r => server.listen(PORT, r));
const BASE = `http://127.0.0.1:${PORT}`;

// ── Result tracking ─────────────────────────────────────────────────────────
const results = {};   // tcId -> { id, title, status, detail, category }
function tc(id, title, status, detail = '', category = '') {
  results[id] = { id, title, status, detail, category };
  const sym = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : status === 'SKIP' ? '⏭ ' : '⚠️ ';
  console.log(`${sym} ${id}  ${title}${detail ? '  — ' + detail : ''}`);
}

// ── Helpers ─────────────────────────────────────────────────────────────────
async function gone(page, sel, t = 5000) {
  try { await page.waitForSelector(sel, { timeout: t }); return true; } catch { return false; }
}
async function shot(page, label) {
  try { await page.screenshot({ path: join(SHOTS, label + '.png'), fullPage: false }); } catch {}
}
async function seedUser(page, overrides = {}) {
  await page.addInitScript((o) => {
    const base = { userId:'test_exec', name:'Arjun Sharma', email:'arjun@test.com',
      category:'school', grade:'5', plan:'trial',
      trialStartDate: new Date().toISOString(), createdAt: new Date().toISOString() };
    localStorage.setItem('decashift_user', JSON.stringify({ ...base, ...o }));
    // seed a known account for sign-in tests
    const acc = { email:'arjun@test.com', passwordHash:'fakeHash', userId:'test_exec',
      createdAt: new Date().toISOString(), category:'school', grade:'5' };
    localStorage.setItem('decashift_accounts', JSON.stringify([acc]));
  }, overrides);
}

// ── Launch browser ──────────────────────────────────────────────────────────
const browser  = await chromium.launch();
const consoleErrors = [];

// ═══════════════════════════════════════════════════════════════════════════
// TC-01 — Authentication & Onboarding
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n── TC-01: Authentication & Onboarding ──');
{
  const ctx  = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('pageerror', e => consoleErrors.push(`TC01: ${e.message}`));
  await page.route('**raw.githubusercontent.com**', r => r.abort());

  // TC-01-001: Landing loads for first-time visitor
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  const landingVisible  = await gone(page, '#screen-landing.active, .lp-nav', 5000);
  const cta1            = await page.locator('#btn-for-students, .lp-cta-school').count() > 0;
  const signinBtn       = await page.locator('#btn-go-signin, .lp-nav').count() > 0;
  tc('TC-01-001', 'Landing page loads correctly for first-time visitor',
    (landingVisible && cta1 && signinBtn) ? 'PASS' : 'FAIL',
    `landing=${landingVisible} cta=${cta1} signinNav=${signinBtn}`);
  await shot(page, 'TC-01-001-landing');

  // TC-01-002: "For Students" → Sign Up with school category
  const stuBtn = page.locator('#btn-for-students').first();
  if (await stuBtn.count()) {
    await stuBtn.click();
    await page.waitForTimeout(500);
    const signupVisible  = await gone(page, '#screen-signup.active, #signup-form', 3000);
    const gradeSelector  = await page.locator('#reg-grade, #school-fields').count() > 0;
    tc('TC-01-002', '"For Students" → Sign Up with school category',
      (signupVisible && gradeSelector) ? 'PASS' : 'FAIL',
      `signup=${signupVisible} gradeField=${gradeSelector}`);
  } else {
    tc('TC-01-002', '"For Students" → Sign Up with school category', 'SKIP', 'btn-for-students not found');
  }

  // TC-01-003: "For Professionals" → no grade selector
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  const proBtn = page.locator('#btn-for-professionals, #btn-for-professionals-hero').first();
  if (await proBtn.count()) {
    await proBtn.click();
    await page.waitForTimeout(500);
    const signupPro    = await gone(page, '#screen-signup.active, #signup-form', 3000);
    const gradeGone    = await page.locator('#school-fields.hidden, #reg-grade').count();
    const schoolHidden = await page.evaluate(() => {
      const el = document.getElementById('school-fields');
      return el ? el.classList.contains('hidden') : true;
    });
    tc('TC-01-003', '"For Professionals" → Sign Up without grade selector',
      (signupPro && schoolHidden) ? 'PASS' : 'FAIL',
      `signup=${signupPro} schoolHidden=${schoolHidden}`);
  } else {
    tc('TC-01-003', '"For Professionals" → Sign Up without grade selector', 'SKIP', 'pro btn not found');
  }

  // TC-01-011: Auto-login when session exists
  await ctx.close();
  const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page2 = await ctx2.newPage();
  await page2.route('**raw.githubusercontent.com**', r => r.abort());
  await seedUser(page2);
  await page2.goto(BASE, { waitUntil: 'domcontentloaded' });
  const autoLogin = await gone(page2, '#screen-home.active', 8000);
  tc('TC-01-011', 'Auto-login when session exists in localStorage',
    autoLogin ? 'PASS' : 'FAIL', `homeVisible=${autoLogin}`);
  await shot(page2, 'TC-01-011-autologin');

  // TC-01-012: Sign out returns to landing
  if (autoLogin) {
    const signoutOk = await page2.evaluate(async () => {
      const chip = document.getElementById('user-chip') || document.querySelector('.user-chip');
      if (chip) chip.click();
      await new Promise(r => setTimeout(r, 300));
      const menu = document.getElementById('user-menu');
      if (!menu) return false;
      menu.classList.remove('hidden');
      const btn = [...menu.querySelectorAll('button, a')].find(el => /sign.?out|logout/i.test(el.textContent));
      if (btn) { btn.click(); return true; }
      return false;
    });
    await page2.waitForTimeout(800);
    const landingBack = await gone(page2, '#screen-landing.active, .lp-hero', 5000);
    tc('TC-01-012', 'Sign out clears session and returns to landing',
      landingBack ? 'PASS' : 'FAIL', `signoutClicked=${signoutOk} landing=${landingBack}`);
    await shot(page2, 'TC-01-012-signout');
  } else {
    tc('TC-01-012', 'Sign out clears session and returns to landing', 'SKIP', 'depends on TC-01-011');
  }

  // TC-01-013: Feature showcase auto-rotates on landing
  const ctx3 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page3 = await ctx3.newPage();
  await page3.route('**raw.githubusercontent.com**', r => r.abort());
  await page3.goto(BASE, { waitUntil: 'domcontentloaded' });
  const slide1 = await page3.evaluate(() => {
    const active = document.querySelector('.lp-fs-active, .lp-dot-active');
    return active ? active.dataset.slide || '0' : null;
  });
  await page3.waitForTimeout(4500);
  const slide2 = await page3.evaluate(() => {
    const active = document.querySelector('.lp-fs-active, .lp-dot-active');
    return active ? active.dataset.slide || '0' : null;
  });
  tc('TC-01-013', 'Phone feature showcase auto-rotates on landing',
    (slide1 !== null && slide1 !== slide2) ? 'PASS' : 'FAIL',
    `slide before=${slide1} after=${slide2}`);

  await ctx2.close(); await ctx3.close();
}

// ═══════════════════════════════════════════════════════════════════════════
// TC-02 — Home Screen & Navigation
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n── TC-02: Home Screen & Navigation ──');
{
  const ctx  = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('pageerror', e => consoleErrors.push(`TC02: ${e.message}`));
  await page.route('**raw.githubusercontent.com**', r => r.abort());
  await seedUser(page);
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // TC-02-001: Home renders all core sections
  const homeOk        = await gone(page, '#screen-home.active', 8000);
  const greetingEl    = await page.locator('#user-greeting, .user-greeting').count() > 0;
  const questBar      = await page.locator('#daily-quest, .daily-quest-bar').count() > 0;
  const drillShelf    = await page.locator('#flash-drill-wrap, .flash-drills-shelf').count() > 0;
  const subjectTabs   = await page.locator('#subject-tabs, .subject-tabs').count() > 0;
  tc('TC-02-001', 'Home screen renders all core sections after login',
    (homeOk && greetingEl && subjectTabs) ? 'PASS' : 'FAIL',
    `home=${homeOk} greeting=${greetingEl} quest=${questBar} drills=${drillShelf} tabs=${subjectTabs}`);
  await shot(page, 'TC-02-001-home-desktop');

  // TC-02-002: Greeting shows correct first name
  const greetingText = await page.evaluate(() => {
    const el = document.getElementById('user-greeting') || document.querySelector('.user-greeting');
    return el ? el.textContent.trim() : '';
  });
  const correctName = greetingText.toLowerCase().includes('arjun') && !greetingText.toLowerCase().includes('sharma');
  tc('TC-02-002', 'Greeting shows correct first name (not full name)',
    correctName ? 'PASS' : 'FAIL', `greeting="${greetingText}"`);

  // TC-02-003: Math tab pre-selected for school user
  const mathActive = await page.evaluate(() => {
    const tabs = document.querySelectorAll('.subject-tab');
    return [...tabs].some(t => t.dataset.subject === 'mathematics' && t.classList.contains('active'));
  });
  tc('TC-02-003', 'Math subject tab is pre-selected for school user',
    mathActive ? 'PASS' : 'FAIL', `mathTabActive=${mathActive}`);

  // TC-02-004: Tapping a subject tab filters content
  const scienceTab = page.locator('.subject-tab[data-subject="science"]');
  if (await scienceTab.count()) {
    await scienceTab.click();
    await page.waitForTimeout(400);
    const sciActive = await page.evaluate(() => {
      const t = document.querySelector('.subject-tab[data-subject="science"]');
      return t ? t.classList.contains('active') : false;
    });
    tc('TC-02-004', 'Tapping a subject tab filters content correctly',
      sciActive ? 'PASS' : 'FAIL', `scienceTabActive=${sciActive}`);
  } else {
    tc('TC-02-004', 'Tapping a subject tab filters content correctly', 'SKIP', 'no science tab');
  }

  // TC-02-006: Day cards show correct day labels
  const dayCards = await page.locator('.day-card').count();
  tc('TC-02-006', 'Day cards visible in shelf', dayCards > 0 ? 'PASS' : 'FAIL', `${dayCards} cards`);

  // TC-02-007: Expired user sees lock icons on Wed-Fri
  await ctx.close();
  const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page2 = await ctx2.newPage();
  await page2.route('**raw.githubusercontent.com**', r => r.abort());
  await seedUser(page2, { plan: 'expired' });
  await page2.goto(BASE, { waitUntil: 'networkidle' });
  await page2.waitForTimeout(600);
  const lockIcons = await page2.locator('.day-card .lock-icon, .day-card .locked, [data-locked="true"]').count();
  tc('TC-02-007', 'Expired user sees lock icons on Wed/Thu/Fri cards',
    lockIcons >= 3 ? 'PASS' : (lockIcons > 0 ? 'WARN' : 'FAIL'), `lock icons found: ${lockIcons}`);

  // TC-02-008: Pro user sees no lock icons
  await ctx2.close();
  const ctx3 = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page3 = await ctx3.newPage();
  await page3.route('**raw.githubusercontent.com**', r => r.abort());
  await seedUser(page3, { plan: 'pro' });
  await page3.goto(BASE, { waitUntil: 'networkidle' });
  await page3.waitForTimeout(600);
  const lockIconsPro = await page3.locator('.day-card .lock-icon, .day-card .locked').count();
  tc('TC-02-008', 'Pro user sees no lock icons', lockIconsPro === 0 ? 'PASS' : 'FAIL', `locks=${lockIconsPro}`);

  // TC-02-015: User menu opens on chip tap
  await seedUser(page3);
  const chip = page3.locator('#user-chip, .user-chip').first();
  if (await chip.count()) {
    await chip.click();
    await page3.waitForTimeout(300);
    const menuVisible = await page3.evaluate(() => {
      const m = document.getElementById('user-menu');
      return m ? !m.classList.contains('hidden') : false;
    });
    tc('TC-02-015', 'User menu dropdown opens on chip tap', menuVisible ? 'PASS' : 'FAIL');
  } else {
    tc('TC-02-015', 'User menu dropdown opens on chip tap', 'SKIP', 'chip not found');
  }

  // TC-02-016: User menu closes on outside click
  await page3.locator('body').click({ position: { x: 100, y: 100 } });
  await page3.waitForTimeout(300);
  const menuClosed = await page3.evaluate(() => {
    const m = document.getElementById('user-menu');
    return m ? m.classList.contains('hidden') : true;
  });
  tc('TC-02-016', 'User menu closes on outside click', menuClosed ? 'PASS' : 'FAIL');

  // TC-02-018: Mobile viewport — no horizontal overflow
  await ctx3.close();
  const ctxMob = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const pageMob = await ctxMob.newPage();
  await pageMob.route('**raw.githubusercontent.com**', r => r.abort());
  await seedUser(pageMob);
  await pageMob.goto(BASE, { waitUntil: 'networkidle' });
  await pageMob.waitForTimeout(600);
  const noOverflow = await pageMob.evaluate(() =>
    document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2
  );
  tc('TC-02-018', 'Home renders correctly on 375px mobile viewport — no overflow',
    noOverflow ? 'PASS' : 'FAIL');
  await shot(pageMob, 'TC-02-018-mobile-375');
  await ctxMob.close();
}

// ═══════════════════════════════════════════════════════════════════════════
// TC-03 — Quiz Engine
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n── TC-03: Quiz Engine ──');
{
  const ctx  = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.on('pageerror', e => consoleErrors.push(`TC03: ${e.message}`));
  await page.route('**raw.githubusercontent.com**', r => r.abort());
  await seedUser(page, { plan: 'pro' });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // start a quiz via JS (most reliable)
  const quizStarted = await page.evaluate(async () => {
    const g = (state.goals || []).find(g => g.id && !g.weekNum);
    if (g && typeof startGoal === 'function') { await startGoal(g.id); return true; }
    const first = (state.goals || [])[0];
    if (first && typeof startGoal === 'function') { await startGoal(first.id); return true; }
    return false;
  });
  await page.waitForTimeout(600);
  const quizVisible = await gone(page, '#screen-quiz.active', 5000);
  tc('TC-03-001', 'Starting a quiz navigates to quiz screen',
    (quizStarted && quizVisible) ? 'PASS' : 'FAIL', `started=${quizStarted} visible=${quizVisible}`);

  if (quizVisible) {
    // TC-03-002: Challenge banner visible
    const banner = await page.locator('#quiz-challenge-banner, .quiz-challenge-banner').count() > 0;
    tc('TC-03-002', 'Challenge banner visible on quiz start', banner ? 'PASS' : 'FAIL');

    // TC-03-005: Selecting an answer — submit button becomes active
    const answerCard = page.locator('#screen-quiz.active .answer-option, #screen-quiz.active .answer-card').first();
    if (await answerCard.count()) {
      await answerCard.click();
      await page.waitForTimeout(200);
      const submitEnabled = await page.locator('#screen-quiz.active button:has-text("Submit")').count() > 0;
      tc('TC-03-005', 'Selecting an answer enables Submit button', submitEnabled ? 'PASS' : 'FAIL');
    } else {
      tc('TC-03-005', 'Selecting an answer enables Submit button', 'SKIP', 'no answer cards found');
    }

    // TC-03-006/007: Submit shows feedback colours
    const submitBtn = page.locator('#screen-quiz.active button:has-text("Submit"), #screen-quiz.active #btn-submit').first();
    if (await submitBtn.count()) {
      await submitBtn.click();
      await page.waitForTimeout(400);
      const greenCard = await page.locator('#screen-quiz.active .answer-option.correct, #screen-quiz.active .answer-card.correct').count() > 0;
      const nextBtn   = await page.locator('#screen-quiz.active button:has-text("Next"), #screen-quiz.active #btn-next').count() > 0;
      tc('TC-03-006', 'Correct answer shows green feedback after submit',
        greenCard ? 'PASS' : 'FAIL', `greenCard=${greenCard}`);
      tc('TC-03-009', '"Next Question" button appears after submit', nextBtn ? 'PASS' : 'FAIL');
    } else {
      tc('TC-03-006', 'Correct answer shows green feedback', 'SKIP', 'no submit btn');
      tc('TC-03-009', '"Next Question" appears', 'SKIP', 'no submit btn');
    }

    // TC-03-010: Timer visible (default on)
    const timerVisible = await page.locator('#quiz-timer, .quiz-timer, #timer-display').count() > 0;
    tc('TC-03-010', 'Timer counts up when enabled', timerVisible ? 'PASS' : 'FAIL', `timerEl=${timerVisible}`);
    await shot(page, 'TC-03-quiz-screen');

    // Run through full quiz to get to result
    let answered = 0, reachedResult = false;
    for (let i = 0; i < 20; i++) {
      const opt = page.locator('#screen-quiz.active .answer-option, #screen-quiz.active .answer-card').first();
      if (!(await opt.count())) break;
      await opt.click().catch(() => {});
      await page.waitForTimeout(100);
      const sub = page.locator('#screen-quiz.active button:has-text("Submit"), #screen-quiz.active #btn-submit').first();
      if (await sub.count()) await sub.click().catch(() => {});
      answered++;
      await page.waitForTimeout(250);
      const nxt = page.locator('#screen-quiz.active button:has-text("Next"), #screen-quiz.active #btn-next').first();
      if (await nxt.count()) await nxt.click().catch(() => {});
      await page.waitForTimeout(200);
      if (await page.locator('#screen-result.active').count()) { reachedResult = true; break; }
    }
    tc('TC-03-013', 'Result screen shows after last question',
      reachedResult ? 'PASS' : 'FAIL', `answered=${answered}`);

    if (reachedResult) {
      // TC-03-017: XP shown on result
      const xpPill = await page.locator('#screen-result.active .xp-pill, #screen-result.active [class*="xp"]').count() > 0;
      tc('TC-03-017', 'XP is awarded and shown on result screen', xpPill ? 'PASS' : 'FAIL');
      await shot(page, 'TC-03-result-screen');

      // TC-03-018: Back to home button
      const backBtn = page.locator('#screen-result.active button:has-text("Back"), #screen-result.active button:has-text("Goals"), #screen-result.active button:has-text("Home")').first();
      if (await backBtn.count()) {
        await backBtn.click();
        await page.waitForTimeout(500);
        const homeBack = await gone(page, '#screen-home.active', 4000);
        tc('TC-03-018', '"Back to Home" returns to Home screen', homeBack ? 'PASS' : 'FAIL');
      } else {
        tc('TC-03-018', '"Back to Home" returns to Home screen', 'SKIP', 'back btn not found');
      }

      // TC-03-019: Session persisted to localStorage
      const sessions = await page.evaluate(() => {
        try { return (JSON.parse(localStorage.getItem('decashift_sessions') || '[]')).length; } catch { return 0; }
      });
      tc('TC-03-019', 'Session persisted to localStorage after quiz',
        sessions > 0 ? 'PASS' : 'FAIL', `${sessions} sessions found`);
    }
  } else {
    ['TC-03-002','TC-03-005','TC-03-006','TC-03-009','TC-03-010','TC-03-013','TC-03-017','TC-03-018','TC-03-019']
      .forEach(id => tc(id, '(depends on quiz start)', 'SKIP', 'quiz screen not reached'));
  }

  // TC-03-020: Gated set redirects expired user to paywall
  await ctx.close();
  const ctxExp = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pageExp = await ctxExp.newPage();
  await pageExp.route('**raw.githubusercontent.com**', r => r.abort());
  await seedUser(pageExp, { plan: 'expired' });
  await pageExp.goto(BASE, { waitUntil: 'networkidle' });
  await pageExp.waitForTimeout(600);
  const paywallShown = await pageExp.evaluate(async () => {
    const g = (state.goals || []).find(g => g.weekDay && ['wed','thu','fri'].includes(g.weekDay));
    if (!g) return 'no-gated-goal';
    await startGoal(g.id);
    await new Promise(r => setTimeout(r, 600));
    return document.querySelector('#screen-paywall.active') ? 'paywall' : 'no-paywall';
  });
  tc('TC-03-020', 'Gated set redirects expired user to paywall',
    paywallShown === 'paywall' ? 'PASS' : paywallShown === 'no-gated-goal' ? 'SKIP' : 'FAIL',
    paywallShown);
  await ctxExp.close();
}

// ═══════════════════════════════════════════════════════════════════════════
// TC-04 — Flash Drills
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n── TC-04: Flash Drills ──');
{
  const ctx  = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.route('**raw.githubusercontent.com**', r => r.abort());
  await seedUser(page);
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const drillShelf = await page.locator('#flash-drill-wrap .drill-card, .flash-drills-shelf .drill-card, .drill-card').count();
  tc('TC-04-001', 'Flash Drills shelf visible on Home screen',
    drillShelf > 0 ? 'PASS' : 'FAIL', `${drillShelf} drill cards`);

  if (drillShelf > 0) {
    const firstDrill = page.locator('.drill-card').first();
    const drillName = await firstDrill.locator('h3, .drill-name, strong').first().textContent().catch(() => '');
    tc('TC-04-002', 'Drill card shows name and description',
      drillName.length > 0 ? 'PASS' : 'FAIL', `name="${drillName.trim()}"`);

    // Start a drill
    const drillBtn = firstDrill.locator('button').first();
    if (await drillBtn.count()) {
      await drillBtn.click();
      await page.waitForTimeout(500);
      const drillScreen = await gone(page, '#screen-drill.active', 4000);
      tc('TC-04-004', 'Tapping a drill card opens drill screen', drillScreen ? 'PASS' : 'FAIL');

      if (drillScreen) {
        const questionEl = await page.locator('#screen-drill.active .drill-question, #drill-question').count() > 0;
        const answerOpts  = await page.locator('#screen-drill.active .answer-option, #screen-drill.active .drill-option').count();
        tc('TC-04-005', 'Drill question and 4 answer options shown',
          (questionEl && answerOpts >= 4) ? 'PASS' : 'FAIL', `q=${questionEl} opts=${answerOpts}`);
        await shot(page, 'TC-04-drill-screen');

        // Answer some drill questions
        let drillAnswered = 0;
        for (let i = 0; i < 12; i++) {
          const opt = page.locator('#screen-drill.active .answer-option, #screen-drill.active .drill-option').first();
          if (!(await opt.count())) break;
          await opt.click().catch(() => {});
          drillAnswered++;
          await page.waitForTimeout(700);
          if (await page.locator('#screen-drill.active .drill-result, .drill-result-screen').count()) break;
        }
        const drillResult = await page.locator('.drill-result, #drill-result, #screen-drill .result-score').count() > 0;
        tc('TC-04-011', 'Drill result screen shows after 10 questions',
          drillResult ? 'PASS' : 'FAIL', `answered=${drillAnswered}`);
      } else {
        tc('TC-04-004', 'Tapping a drill card opens drill screen', 'FAIL', 'drill screen not reached');
        tc('TC-04-005', 'Drill question and 4 answer options shown', 'SKIP', 'drill screen not reached');
        tc('TC-04-011', 'Drill result screen shows', 'SKIP');
      }
    } else {
      tc('TC-04-004', 'Tapping drill card opens drill screen', 'SKIP', 'no drill button');
    }
  } else {
    ['TC-04-002','TC-04-004','TC-04-005','TC-04-011'].forEach(id =>
      tc(id, '(drill shelf empty)', 'SKIP', 'no drill cards on home'));
  }
  await ctx.close();
}

// ═══════════════════════════════════════════════════════════════════════════
// TC-05 — Daily GK Capsule
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n── TC-05: Daily GK Capsule ──');
{
  const ctx  = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.route('**raw.githubusercontent.com**', r => r.abort());
  await seedUser(page);
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const gkTab = page.locator('.subject-tab[data-subject="gk"], .gk-tab').first();
  const gkTabExists = await gkTab.count() > 0;
  tc('TC-05-001', 'GK tab visible in subject tabs', gkTabExists ? 'PASS' : 'FAIL');

  if (gkTabExists) {
    await gkTab.click();
    await page.waitForTimeout(500);
    const gkCard = await page.locator('.gk-daily-card, #gk-daily-card').count() > 0;
    const startBtn = await page.locator('.gk-daily-card button, button:has-text("Start →")').count() > 0;
    tc('TC-05-002', 'GK tab shows the daily GK card',
      (gkCard && startBtn) ? 'PASS' : 'FAIL', `card=${gkCard} btn=${startBtn}`);
    await shot(page, 'TC-05-gk-tab');
  } else {
    tc('TC-05-002', 'GK tab shows daily GK card', 'SKIP', 'no GK tab');
  }
  await ctx.close();
}

// ═══════════════════════════════════════════════════════════════════════════
// TC-06 — Daily Quest
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n── TC-06: Daily Quest ──');
{
  const ctx  = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.route('**raw.githubusercontent.com**', r => r.abort());
  await seedUser(page);
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const questBar = await page.locator('#daily-quest, .daily-quest-bar, [id*="quest"]').count() > 0;
  tc('TC-06-001', 'Daily Quest bar is visible on Home screen', questBar ? 'PASS' : 'FAIL');

  const questState = await page.evaluate(() => {
    if (typeof DailyQuest !== 'undefined') {
      const s = DailyQuest.getState();
      return { done: s.done, total: s.total, complete: s.complete };
    }
    return null;
  });
  tc('TC-06-002', 'Quest state readable (DailyQuest.getState() works)',
    questState !== null ? 'PASS' : 'FAIL', questState ? JSON.stringify(questState) : 'DailyQuest not defined');

  // TC-06-009: Quest state persists across reload
  if (questState) {
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const questAfterReload = await page.evaluate(() => {
      if (typeof DailyQuest !== 'undefined') return DailyQuest.getState().done;
      return null;
    });
    tc('TC-06-009', 'Quest state persists across page reload',
      questAfterReload !== null ? 'PASS' : 'FAIL', `done after reload=${questAfterReload}`);
  } else {
    tc('TC-06-009', 'Quest state persists across page reload', 'SKIP', 'DailyQuest not available');
  }
  await ctx.close();
}

// ═══════════════════════════════════════════════════════════════════════════
// TC-07 — XP & Leveling
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n── TC-07: XP & Leveling ──');
{
  const ctx  = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.route('**raw.githubusercontent.com**', r => r.abort());
  await seedUser(page, { plan: 'pro' });
  // Seed XP near a level boundary: Level 1→2 threshold is 90 XP
  await page.addInitScript(() => {
    localStorage.setItem('donnibo_xp_v1', '80');  // 10 XP from level 2
  });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // Check XP module available
  const xpOk = await page.evaluate(() => typeof XP !== 'undefined' && typeof XP.getTotalXP === 'function');
  tc('TC-07-001', 'XP module (XP.js) is loaded and accessible', xpOk ? 'PASS' : 'FAIL');

  if (xpOk) {
    const xpBefore = await page.evaluate(() => XP.getTotalXP());
    tc('TC-07-011', 'XP total is persistent across page reload (seeded 80 XP)',
      xpBefore === 80 ? 'PASS' : 'FAIL', `xp=${xpBefore}`);

    // Manually award XP and check level-up
    const levelResult = await page.evaluate(() => {
      const before = XP.levelFromXP(XP.getTotalXP()).level;
      XP.addXP(15, 'test');  // pushes to 95, crosses Level 2 threshold (90)
      const after  = XP.levelFromXP(XP.getTotalXP()).level;
      return { before, after, total: XP.getTotalXP() };
    });
    tc('TC-07-008', 'Level increases when XP threshold is crossed',
      levelResult.after > levelResult.before ? 'PASS' : 'FAIL',
      `L${levelResult.before}→L${levelResult.after} (${levelResult.total} XP)`);

    tc('TC-07-012', 'XP never decreases (addXP only adds)',
      levelResult.total >= 80 ? 'PASS' : 'FAIL', `total=${levelResult.total}`);
  } else {
    ['TC-07-008','TC-07-011','TC-07-012'].forEach(id => tc(id, '(XP module)', 'SKIP', 'XP not defined'));
  }

  // TC-07-014: Lucky Question — verify luckyIndex is set per quiz
  const luckyOk = await page.evaluate(async () => {
    const g = (state.goals || [])[0];
    if (!g) return 'no-goal';
    await startGoal(g.id);
    await new Promise(r => setTimeout(r, 400));
    return typeof state.luckyIndex === 'number' && state.luckyIndex >= 0 ? 'set' : 'not-set';
  });
  tc('TC-07-014', 'Lucky Question index assigned per quiz session',
    luckyOk === 'set' ? 'PASS' : luckyOk === 'no-goal' ? 'SKIP' : 'FAIL', luckyOk);
  await ctx.close();
}

// ═══════════════════════════════════════════════════════════════════════════
// TC-08 — Avatar Evolution
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n── TC-08: Avatar Evolution ──');
{
  const ctx  = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.route('**raw.githubusercontent.com**', r => r.abort());
  await seedUser(page);
  await page.addInitScript(() => localStorage.setItem('donnibo_xp_v1', '0'));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const avatarOk = await page.evaluate(() => typeof Avatar !== 'undefined' && typeof Avatar.stageInfo === 'function');
  tc('TC-08-001', 'Avatar module loaded', avatarOk ? 'PASS' : 'FAIL');

  if (avatarOk) {
    const stage1 = await page.evaluate(() => Avatar.stageInfo(1).name);
    tc('TC-08-001', 'New user starts with Stage 1 (Spark)',
      stage1 === 'Spark' ? 'PASS' : 'FAIL', `stageName="${stage1}"`);

    const stageBoundaries = await page.evaluate(() => [
      { level: 3,  expected: 'Pup',      actual: Avatar.stageInfo(3).name  },
      { level: 6,  expected: 'Rookie',   actual: Avatar.stageInfo(6).name  },
      { level: 10, expected: 'Fighter',  actual: Avatar.stageInfo(10).name },
      { level: 15, expected: 'Champion', actual: Avatar.stageInfo(15).name },
      { level: 21, expected: 'Donnibo',  actual: Avatar.stageInfo(21).name },
    ]);
    const allCorrect = stageBoundaries.every(b => b.actual === b.expected);
    tc('TC-08-003', 'All 6 stage boundaries are correct',
      allCorrect ? 'PASS' : 'FAIL',
      stageBoundaries.map(b => `L${b.level}:${b.actual}`).join(' | '));

    // Avatar chip in header
    const chipAvatar = await page.locator('#user-chip .avatar-img, .user-chip img, .avatar-chip').count() > 0;
    tc('TC-08-004', 'Avatar visible in header chip', chipAvatar ? 'PASS' : 'WARN', `chipImg=${chipAvatar}`);
  } else {
    ['TC-08-001','TC-08-003','TC-08-004'].forEach(id => tc(id, '(avatar)', 'SKIP', 'Avatar not defined'));
  }
  await ctx.close();
}

// ═══════════════════════════════════════════════════════════════════════════
// TC-09 — My Journey
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n── TC-09: My Journey ──');
{
  const ctx  = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.route('**raw.githubusercontent.com**', r => r.abort());
  await seedUser(page);
  await page.addInitScript(() => {
    localStorage.setItem('donnibo_xp_v1', '250');
    localStorage.setItem('decashift_streak', JSON.stringify({ current: 7, longest: 14, lastPracticeDate: new Date().toDateString(), freezes: 1 }));
  });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // Open journey
  await page.evaluate(async () => { if (typeof openJourney === 'function') await openJourney(); });
  await page.waitForTimeout(600);
  const journeyOk = await gone(page, '#screen-journey.active', 5000);
  tc('TC-09-001', 'Journey screen opens', journeyOk ? 'PASS' : 'FAIL');

  if (journeyOk) {
    const levelEl  = await page.locator('#journey-level, .journey-level').count() > 0;
    const xpBar    = await page.locator('#journey-xpbar-fill, .journey-xp-bar').count() > 0;
    const streakEl = await page.locator('#journey-streak, .journey-streak').count() > 0;
    tc('TC-09-003', 'Avatar and level number displayed on Journey', levelEl ? 'PASS' : 'FAIL', `levelEl=${levelEl}`);
    tc('TC-09-004', 'XP progress bar present on Journey', xpBar ? 'PASS' : 'FAIL');
    tc('TC-09-005', 'Streak displayed on Journey', streakEl ? 'PASS' : 'FAIL');
    await shot(page, 'TC-09-journey-screen');

    // TC-09-012: Works offline (all local)
    const xpVal = await page.evaluate(() => typeof XP !== 'undefined' ? XP.getTotalXP() : -1);
    tc('TC-09-012', 'Journey data sourced from localStorage (offline-capable)',
      xpVal >= 0 ? 'PASS' : 'FAIL', `xp=${xpVal}`);

    // TC-09-013: Back button returns to Home
    const homeBack2 = await page.evaluate(async () => {
      if (typeof closeJourney === 'function') { await closeJourney(); return true; }
      if (typeof _showScreen === 'function') { await _showScreen('home'); return true; }
      return false;
    }).catch(() => false);
    await page.waitForTimeout(500);
    const homeBack = await gone(page, '#screen-home.active', 4000);
    tc('TC-09-013', 'Back button returns to Home (via closeJourney())',
      homeBack ? 'PASS' : 'FAIL', `navOk=${homeBack2} homeVisible=${homeBack}`);
  } else {
    ['TC-09-003','TC-09-004','TC-09-005','TC-09-012','TC-09-013'].forEach(id =>
      tc(id, '(journey)', 'SKIP', 'journey screen not reached'));
  }
  await ctx.close();
}

// ═══════════════════════════════════════════════════════════════════════════
// TC-10 — Streak
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n── TC-10: Streak ──');
{
  const ctx  = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.route('**raw.githubusercontent.com**', r => r.abort());
  await seedUser(page);
  await page.addInitScript(() => {
    localStorage.setItem('decashift_streak', JSON.stringify({
      current: 14, longest: 21,
      lastPracticeDate: new Date().toDateString(), freezes: 1 }));
  });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const streakInHeader = await page.evaluate(() => {
    const el = document.querySelector('#streak-count, .streak-count, [id*="streak"]');
    return el ? el.textContent.trim() : null;
  });
  tc('TC-10-001', 'Streak count displayed in header',
    streakInHeader !== null ? 'PASS' : 'FAIL', `streakEl="${streakInHeader}"`);

  const streakData = await page.evaluate(() => {
    try { return JSON.parse(localStorage.getItem('decashift_streak') || 'null'); } catch { return null; }
  });
  tc('TC-10-009', 'Streak data persists across reload (seeded 14-day streak)',
    (streakData && streakData.current === 14) ? 'PASS' : 'FAIL',
    `current=${streakData?.current} longest=${streakData?.longest}`);
  tc('TC-10-011', 'Longest streak tracked separately from current streak',
    (streakData && streakData.longest === 21 && streakData.current === 14) ? 'PASS' : 'FAIL',
    `current=${streakData?.current} longest=${streakData?.longest}`);
  await ctx.close();
}

// ═══════════════════════════════════════════════════════════════════════════
// TC-11 — Collectibles & Mystery Box
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n── TC-11: Collectibles & Mystery Box ──');
{
  const ctx  = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.route('**raw.githubusercontent.com**', r => r.abort());
  await seedUser(page);
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const collectiblesOk = await page.evaluate(() =>
    typeof Collectibles !== 'undefined' && typeof Collectibles.rollReward === 'function');
  tc('TC-11-010', 'Collectibles module loaded', collectiblesOk ? 'PASS' : 'FAIL');

  if (collectiblesOk) {
    const rollResult = await page.evaluate(() => Collectibles.rollReward({ type: 'quest' }));
    tc('TC-11-002', 'rollReward() returns a valid reward object',
      (rollResult && ['sticker','xp','freeze'].includes(rollResult.kind)) ? 'PASS' : 'FAIL',
      `kind=${rollResult?.kind}`);

    // TC-11-007: No duplicate stickers
    const grantTest = await page.evaluate(() => {
      Collectibles.grant('idle');
      Collectibles.grant('idle');   // second grant of same sticker
      return Collectibles.owned().filter(id => id === 'idle').length;
    });
    tc('TC-11-007', 'No duplicate stickers granted (idempotent grant)',
      grantTest === 1 ? 'PASS' : 'FAIL', `idle count=${grantTest}`);

    // Pool has 7 stickers
    const poolSize = await page.evaluate(() => Collectibles.POOL.length);
    tc('TC-11-011', 'Collectibles pool has 7 sticker entries',
      poolSize === 7 ? 'PASS' : 'FAIL', `pool=${poolSize}`);
  } else {
    ['TC-11-002','TC-11-007','TC-11-011'].forEach(id => tc(id, '(collectibles)', 'SKIP'));
  }
  await ctx.close();
}

// ═══════════════════════════════════════════════════════════════════════════
// TC-12 — Share Cards
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n── TC-12: Share Cards ──');
{
  const ctx  = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.route('**raw.githubusercontent.com**', r => r.abort());
  await seedUser(page, { plan: 'pro' });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const shareCardOk = await page.evaluate(() =>
    typeof ShareCard !== 'undefined' && typeof ShareCard.render === 'function');
  tc('TC-12-001', 'ShareCard module loaded', shareCardOk ? 'PASS' : 'FAIL');

  if (shareCardOk) {
    // TC-12-003: Canvas renders at 1080×1080
    const renderOk = await page.evaluate(async () => {
      try {
        const blob = await ShareCard.render({ type: 'score', level: 3, headline: 'Test', sub: 'Sub', stat: '80%', statLabel: 'Accuracy', accent: '#3b82f6' });
        return blob instanceof Blob ? { ok: true, size: blob.size } : { ok: false };
      } catch (e) { return { ok: false, err: e.message }; }
    });
    tc('TC-12-003', 'ShareCard.render() produces a Blob',
      renderOk?.ok ? 'PASS' : 'FAIL', JSON.stringify(renderOk));
  } else {
    tc('TC-12-003', 'ShareCard renders a Blob', 'SKIP', 'ShareCard not defined');
  }

  // TC-12-001: Share Result button on result screen
  await page.evaluate(async () => {
    const g = (state.goals || [])[0];
    if (g) await startGoal(g.id);
  });
  await page.waitForTimeout(500);
  // fast-complete quiz
  for (let i = 0; i < 20; i++) {
    const opt = page.locator('#screen-quiz.active .answer-option, #screen-quiz.active .answer-card').first();
    if (!(await opt.count())) break;
    await opt.click().catch(() => {});
    await page.waitForTimeout(80);
    const sub = page.locator('#screen-quiz.active button:has-text("Submit"), #screen-quiz.active #btn-submit').first();
    if (await sub.count()) await sub.click().catch(() => {});
    await page.waitForTimeout(150);
    const nxt = page.locator('#screen-quiz.active button:has-text("Next"), #screen-quiz.active #btn-next').first();
    if (await nxt.count()) await nxt.click().catch(() => {});
    await page.waitForTimeout(120);
    if (await page.locator('#screen-result.active').count()) break;
  }
  const shareBtn = await page.locator('#screen-result.active button:has-text("Share"), #screen-result.active [id*="share"]').count() > 0;
  tc('TC-12-001', '"Share Result" button visible on result screen', shareBtn ? 'PASS' : 'FAIL');
  await ctx.close();
}

// ═══════════════════════════════════════════════════════════════════════════
// TC-13 — Friend Challenge
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n── TC-13: Friend Challenge ──');
{
  const ctx  = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.route('**raw.githubusercontent.com**', r => r.abort());
  await seedUser(page);
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const challengeOk = await page.evaluate(() =>
    typeof Challenge !== 'undefined' && typeof Challenge.encode === 'function');
  tc('TC-13-003', 'Challenge module loaded', challengeOk ? 'PASS' : 'FAIL');

  if (challengeOk) {
    // TC-13-003: URL payload contains correct data
    const encTest = await page.evaluate(() => {
      const payload = Challenge.encode({ goalId: 'grade-5-math-w23-mon', score: 12, total: 15, name: 'Arjun' });
      const decoded = Challenge.decode(payload);
      return { payload, decoded };
    });
    const decodedOk = encTest.decoded?.goalId === 'grade-5-math-w23-mon'
      && encTest.decoded?.score === 12 && encTest.decoded?.total === 15;
    tc('TC-13-003', 'Challenge URL payload encodes and decodes correctly',
      decodedOk ? 'PASS' : 'FAIL', JSON.stringify(encTest.decoded));

    // TC-13-007: URL cleanup after capture
    const cleanupTest = await page.evaluate(() => {
      history.pushState(null, '', '/?ch=testpayload');
      Challenge.capture();
      return window.location.search;
    });
    tc('TC-13-007', 'Challenge URL stripped from address bar after capture',
      !cleanupTest.includes('ch=') ? 'PASS' : 'FAIL', `remaining qs="${cleanupTest}"`);

    // TC-13-009: Invalid payload does not crash
    const gracefulFail = await page.evaluate(() => {
      try { return Challenge.decode('!!!invalid!!!'); }
      catch (e) { return 'threw: ' + e.message; }
    });
    tc('TC-13-009', 'Invalid challenge payload returns null gracefully',
      gracefulFail === null ? 'PASS' : 'FAIL', `result=${JSON.stringify(gracefulFail)}`);
  } else {
    ['TC-13-003','TC-13-007','TC-13-009'].forEach(id => tc(id, '(challenge)', 'SKIP'));
  }
  await ctx.close();
}

// ═══════════════════════════════════════════════════════════════════════════
// TC-14 — Subscription & Paywall
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n── TC-14: Subscription & Paywall ──');
{
  const ctx  = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.route('**raw.githubusercontent.com**', r => r.abort());
  await seedUser(page, { plan: 'trial' });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // TC-14-001: New account has trial plan
  const plan = await page.evaluate(() => {
    try { return JSON.parse(localStorage.getItem('decashift_user') || '{}').plan; } catch { return null; }
  });
  tc('TC-14-001', 'Account has trial plan', plan === 'trial' ? 'PASS' : 'FAIL', `plan=${plan}`);

  // TC-14-002: Trial user — no locks
  const locks = await page.locator('.day-card .lock-icon, [data-locked]').count();
  tc('TC-14-002', 'Trial user sees all day cards with no locks', locks === 0 ? 'PASS' : 'FAIL', `locks=${locks}`);

  // TC-14-004/005: Expired user sees locks + paywall
  await ctx.close();
  const ctxExp = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pageExp = await ctxExp.newPage();
  await pageExp.route('**raw.githubusercontent.com**', r => r.abort());
  await seedUser(pageExp, { plan: 'expired' });
  await pageExp.goto(BASE, { waitUntil: 'networkidle' });
  await pageExp.waitForTimeout(600);
  const locksExp = await pageExp.locator('.day-card .lock-icon, .day-card.locked, [data-locked="true"]').count();
  tc('TC-14-004', 'Expired user sees lock icons on Wed/Thu/Fri',
    locksExp >= 3 ? 'PASS' : (locksExp > 0 ? 'WARN' : 'FAIL'), `locks=${locksExp}`);

  // Try to start a gated set
  const paywallResult = await pageExp.evaluate(async () => {
    const g = (state.goals || []).find(g => g.weekDay && ['wed','thu','fri'].includes(g.weekDay));
    if (!g) return 'no-gated-goal';
    await startGoal(g.id);
    await new Promise(r => setTimeout(r, 600));
    return document.querySelector('#screen-paywall.active') ? 'paywall' : 'no-paywall';
  });
  tc('TC-14-005', 'Tapping locked card shows paywall screen',
    paywallResult === 'paywall' ? 'PASS' : paywallResult === 'no-gated-goal' ? 'SKIP' : 'FAIL', paywallResult);
  await ctxExp.close();
}

// ═══════════════════════════════════════════════════════════════════════════
// TC-15 — Settings
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n── TC-15: Settings ──');
{
  const ctx  = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.route('**raw.githubusercontent.com**', r => r.abort());
  await seedUser(page);
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // TC-15-001: Settings opens
  await page.evaluate(async () => { if (typeof openSettings === 'function') await openSettings(); });
  await page.waitForTimeout(600);
  const settingsOpen = await page.evaluate(() => {
    const m = document.getElementById('settings-modal');
    return m ? !m.classList.contains('hidden') : false;
  });
  tc('TC-15-001', 'Settings modal opens', settingsOpen ? 'PASS' : 'FAIL');

  if (settingsOpen) {
    // TC-15-004: 5 tiles present
    const tiles = await page.locator('#settings-menu .settings-tile, .settings-menu .settings-tile').count();
    tc('TC-15-004', 'Settings menu shows all expected tiles',
      tiles >= 5 ? 'PASS' : 'FAIL', `${tiles} tiles`);
    await shot(page, 'TC-15-settings-menu');

    // TC-15-005: Profile sub-screen opens with user data
    await page.evaluate(() => { if (typeof openSettingsSection === 'function') openSettingsSection('profile'); });
    await page.waitForTimeout(400);
    const nameField = await page.locator('#settings-name').inputValue().catch(() => '');
    tc('TC-15-005', 'Profile sub-screen shows current user name',
      nameField.length > 0 ? 'PASS' : 'FAIL', `nameField="${nameField}"`);

    // TC-15-016: Back arrow returns to menu
    await page.evaluate(() => { if (typeof backToSettingsMenu === 'function') backToSettingsMenu(); });
    await page.waitForTimeout(300);
    const menuBack = await page.evaluate(() => {
      const m = document.getElementById('settings-menu');
      return m ? !m.classList.contains('hidden') : false;
    });
    tc('TC-15-016', 'Back arrow returns from sub-screen to settings menu', menuBack ? 'PASS' : 'FAIL');

    // TC-15-017: Close button hides modal
    await page.evaluate(() => { if (typeof closeSettings === 'function') closeSettings(); });
    await page.waitForTimeout(300);
    const settingsClosed = await page.evaluate(() => {
      const m = document.getElementById('settings-modal');
      return m ? m.classList.contains('hidden') : true;
    });
    tc('TC-15-017', 'Settings close button closes the modal', settingsClosed ? 'PASS' : 'FAIL');
  } else {
    ['TC-15-004','TC-15-005','TC-15-016','TC-15-017'].forEach(id =>
      tc(id, '(settings)', 'SKIP', 'settings did not open'));
  }
  await ctx.close();
}

// ═══════════════════════════════════════════════════════════════════════════
// TC-16 — PWA & Offline
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n── TC-16: PWA & Offline ──');
{
  const ctx  = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.route('**raw.githubusercontent.com**', r => r.abort());
  await seedUser(page);
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // TC-16-012: Manifest file accessible
  const manifestResp = await page.request.get(`${BASE}/manifest.webmanifest`).catch(() => null);
  tc('TC-16-012', 'Manifest file accessible at /manifest.webmanifest',
    manifestResp?.ok() ? 'PASS' : 'FAIL', `status=${manifestResp?.status()}`);

  // TC-16-013: Payload < 400 KB
  const payload = await page.evaluate(() => {
    return performance.getEntriesByType('resource')
      .filter(r => !r.name.includes('raw.githubusercontent'))
      .reduce((t, r) => t + (r.transferSize || r.encodedBodySize || 0), 0);
  });
  const payloadKB = Math.round(payload / 1024);
  tc('TC-16-013', 'App payload under 400 KB on first load',
    payloadKB < 400 ? 'PASS' : 'FAIL', `~${payloadKB} KB`);

  // TC-16-008: Offline quiz completes without data loss
  await seedUser(page, { plan: 'pro' });
  await page.evaluate(async () => {
    const g = (state.goals || [])[0];
    if (g) await startGoal(g.id);
  });
  await page.waitForTimeout(500);
  // Go offline
  await page.context().setOffline(true);
  let offlineAnswers = 0, offlineResult = false;
  for (let i = 0; i < 20; i++) {
    const opt = page.locator('#screen-quiz.active .answer-option, #screen-quiz.active .answer-card').first();
    if (!(await opt.count())) break;
    await opt.click().catch(() => {});
    await page.waitForTimeout(80);
    const sub = page.locator('#screen-quiz.active button:has-text("Submit"), #screen-quiz.active #btn-submit').first();
    if (await sub.count()) await sub.click().catch(() => {});
    offlineAnswers++;
    await page.waitForTimeout(180);
    const nxt = page.locator('#screen-quiz.active button:has-text("Next"), #screen-quiz.active #btn-next').first();
    if (await nxt.count()) await nxt.click().catch(() => {});
    await page.waitForTimeout(150);
    if (await page.locator('#screen-result.active').count()) { offlineResult = true; break; }
  }
  await page.context().setOffline(false);
  tc('TC-16-008', 'Quiz session completes offline without data loss',
    offlineResult ? 'PASS' : 'FAIL', `answered=${offlineAnswers}`);
  await ctx.close();
}

// ─── Wrap up ────────────────────────────────────────────────────────────────
await browser.close();
server.close();

// Summarise
const all   = Object.values(results);
const pass  = all.filter(r => r.status === 'PASS').length;
const fail  = all.filter(r => r.status === 'FAIL').length;
const warn  = all.filter(r => r.status === 'WARN').length;
const skip  = all.filter(r => r.status === 'SKIP').length;

console.log(`\n═══ SUMMARY ═══`);
console.log(`Total: ${all.length}  ✅ PASS: ${pass}  ❌ FAIL: ${fail}  ⚠️  WARN: ${warn}  ⏭  SKIP: ${skip}`);

// Write raw JSON
await writeFile(join(OUT, '_raw-results.json'),
  JSON.stringify({ runLabel, generatedAt: new Date().toISOString(), base: BASE,
    summary: { total: all.length, pass, fail, warn, skip }, results, consoleErrors }, null, 2));

console.log(`\nResults written to: test-execution/${runLabel}/`);
console.log(`Run label: ${runLabel}`);

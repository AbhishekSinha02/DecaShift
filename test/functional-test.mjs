// functional-test.mjs — browser functional, link-integrity, perf & breakpoint test
// Run: node test/functional-test.mjs
// Serves app/ui on a local port, drives Chromium headless, exercises the core flows,
// records console errors / failed requests / perf timings, and screenshots 4 breakpoints.

import { chromium } from 'file:///C:/Users/maila/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const UI   = join(ROOT, 'app', 'ui');
const SHOT = join(ROOT, 'test', 'screenshots');
await mkdir(SHOT, { recursive: true });

const MIME = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css',
  '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png',
  '.webmanifest':'application/manifest+json', '.woff2':'font/woff2' };

// ── static server ───────────────────────────────────────────────────────────
const server = createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p === '/' ) p = '/index.html';
    const fp = join(UI, p);
    if (!existsSync(fp)) { res.writeHead(404); res.end('404'); return; }
    const body = await readFile(fp);
    res.writeHead(200, { 'Content-Type': MIME[extname(fp)] || 'application/octet-stream' });
    res.end(body);
  } catch (e) { res.writeHead(500); res.end(String(e)); }
});
const PORT = 8731;
await new Promise(r => server.listen(PORT, r));
const BASE = `http://127.0.0.1:${PORT}`;

const report = { generatedAt: new Date().toISOString(), base: BASE,
  consoleErrors: [], pageErrors: [], failedRequests: [], steps: [], perf: {}, breakpoints: [] };
const step = (name, ok, detail='') => { report.steps.push({ name, ok, detail });
  console.log(`${ok?'PASS':'FAIL'}  ${name}${detail?'  — '+detail:''}`); };

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

// Block remote raw so we test LOCAL files (per repo gotcha)
await page.route('**raw.githubusercontent.com**', r => r.abort());

// Seed a grade-6 Pro user BEFORE first load — the correct path (signup/signin/settings
// all clear ds_manifest_cache; a direct localStorage write + reload would leave a stale
// flash-only manifest cache, which is a synthetic path users cannot reach via the UI).
await page.addInitScript(() => {
  // Real User-ID user (FEAT-002: loginId, NO email) + a matching account, so the
  // quiz/drill completion paths exercise Storage.findAccount(loginId) for real (BUG-030).
  if (!localStorage.getItem('decashift_user')) localStorage.setItem('decashift_user', JSON.stringify({
    userId:'test_fn', name:'Test Kid', loginId:'testfn', category:'school', grade:'6',
    plan:'pro', trialStartDate:new Date().toISOString(), createdAt:new Date().toISOString() }));
  if (!localStorage.getItem('decashift_accounts')) localStorage.setItem('decashift_accounts', JSON.stringify([
    { loginId:'testfn', passwordHash:'x', userId:'test_fn', category:'school', grade:'6' }]));
});

page.on('console', m => { if (m.type() === 'error') report.consoleErrors.push(m.text()); });
page.on('pageerror', e => report.pageErrors.push(e.message));
page.on('requestfailed', r => {
  const u = r.url();
  if (u.includes('raw.githubusercontent.com')) return;       // intentionally blocked
  if (u.includes('fonts.g')) return;                          // google fonts may be offline
  report.failedRequests.push({ url: u, err: r.failure()?.errorText });
});
page.on('response', r => { if (r.status() >= 400 && !r.url().includes('raw.github'))
  report.failedRequests.push({ url: r.url(), status: r.status() }); });

async function gone(sel, t=4000){ try{ await page.waitForSelector(sel,{timeout:t}); return true;}catch{return false;} }

try {
  // ── 1. cold load → landing ──────────────────────────────────────────────
  const t0 = Date.now();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  report.perf.coldLoadMs = Date.now() - t0;
  // perf timings from the browser
  report.perf.nav = await page.evaluate(() => {
    const n = performance.getEntriesByType('navigation')[0] || {};
    return { domContentLoaded: Math.round(n.domContentLoadedEventEnd),
             loadComplete: Math.round(n.loadEventEnd),
             domInteractive: Math.round(n.domInteractive),
             resourceCount: performance.getEntriesByType('resource').length };
  });

  // ── 2. returning grade-6 user goes straight to home ──────────────────────
  const home = await gone('#screen-home.active', 8000);
  step('Returning user lands on home', home);
  const loaded = await page.evaluate(() => ({ g:(state.goals||[]).length, q:(state.questions||[]).length, m:(state.manifest||[]).length }));
  step('Curriculum loaded for grade-6 user', loaded.q > 0, `${loaded.m} manifest · ${loaded.g} goals · ${loaded.q} questions`);

  // ── 3. home content rendered ────────────────────────────────────────────
  const goalCards = await page.locator('#goals-list .day-card, #goals-list .goal-card').count();
  step('Home renders goal/day cards', goalCards > 0, goalCards + ' cards');
  const questsVisible = await page.locator('.home-hero-grid, #flash-drill-wrap').count();
  step('Home hero grid / flash-drill region present', questsVisible > 0);

  // ── 4. start a quiz (click a card if present, else start first goal) ─────
  let quizStarted = false;
  const firstCard = page.locator('.day-card, .goal-card').first();
  if (await firstCard.count()) {
    await firstCard.click().catch(()=>{});
    quizStarted = await gone('#screen-quiz.active', 4000);
  }
  if (!quizStarted) {   // weekly card may not match current week → start a goal directly
    await page.evaluate(() => { const g=(state.goals||[])[0]; if (g && typeof startGoal==='function') startGoal(g.id); });
    quizStarted = await gone('#screen-quiz.active', 4000);
  }
  step('Quiz screen opens (card click or startGoal)', quizStarted);

  // ── 5. answer through the quiz to the result screen ──────────────────────
  let answered = 0, reachedResult = false;
  if (quizStarted) {
    for (let i = 0; i < 25; i++) {
      const opt = page.locator('#screen-quiz.active .answer-option, #screen-quiz.active .answer-card').first();
      if (!(await opt.count())) break;
      await opt.click().catch(()=>{});
      const submit = page.locator('#screen-quiz.active button:has-text("Submit")').first();
      if (await submit.count()) await submit.click().catch(()=>{});
      answered++;
      await page.waitForTimeout(150);
      const next = page.locator('#screen-quiz.active button:visible').filter({ hasText:/Next|Result|Finish|See|Done/i }).first();
      if (await next.count()) await next.click().catch(()=>{});
      await page.waitForTimeout(180);
      if (await page.locator('#screen-result.active').count()) { reachedResult = true; break; }
    }
  }
  step('Quiz answer→submit→next loop works', answered > 0, answered + ' questions answered');
  step('Quiz completes to result screen', reachedResult);

  // ── 6. result screen actions + export capability ─────────────────────────
  if (reachedResult) {
    const actions = await page.locator('#screen-result.active button').allInnerTexts();
    step('Result screen has action buttons', actions.length > 0, actions.map(s=>s.trim()).join(' | '));
    const exportOk = await page.evaluate(() => typeof Storage.exportAsJSON==='function' && typeof Storage.exportAsCSV==='function');
    step('Export JSON/CSV functions available', exportOk, 'in storage.js (Storage.exportAsJSON/CSV)');
    const back = page.locator('#screen-result.active button:has-text("Goals"), #screen-result.active button:has-text("Back")').first();
    if (await back.count()) { await back.click().catch(()=>{}); await gone('#screen-home.active', 4000); }
  }

  // ── 7. Journey screen + Settings modal (their real entry points) ─────────
  await page.evaluate(async () => { await _showScreen('journey'); });
  step('Navigate to Journey screen', await gone('#screen-journey.active', 4000));
  await page.evaluate(async () => { await _showScreen('home'); });
  await page.waitForTimeout(150);

  await page.evaluate(async () => { if (typeof openSettings==='function') await openSettings(); });
  await page.waitForTimeout(400);
  const settingsOpen = await page.evaluate(() => { const m=document.getElementById('settings-modal'); return !!m && !m.classList.contains('hidden'); });
  step('Settings modal opens via openSettings()', settingsOpen);
  await page.evaluate(() => { if (typeof closeSettings==='function') closeSettings(); });

  // ── 8. localStorage session persisted ────────────────────────────────────
  const sessions = await page.evaluate(() => (Storage.loadSessions?.()||[]).length);
  step('Session persisted to localStorage', sessions > 0, sessions + ' sessions');

  // ── 9. breakpoint screenshots ────────────────────────────────────────────
  await page.evaluate(() => { if (typeof _showScreen==='function'){_showScreen('home'); if(typeof _renderHome==='function')_renderHome();} });
  for (const [w,h,label] of [[375,812,'mobile-375'],[768,1024,'tablet-768'],[1024,768,'laptop-1024'],[1440,900,'desktop-1440']]) {
    await page.setViewportSize({ width:w, height:h });
    await page.waitForTimeout(400);
    const file = join(SHOT, `home-${label}.png`);
    await page.screenshot({ path: file, fullPage: true });
    // overflow detection
    const overflow = await page.evaluate(() => {
      const de = document.documentElement;
      return { horizontal: de.scrollWidth > de.clientWidth + 1, sw: de.scrollWidth, cw: de.clientWidth };
    });
    report.breakpoints.push({ label, w, h, screenshot: `screenshots/home-${label}.png`, ...overflow });
    step(`Breakpoint ${label}: no horizontal overflow`, !overflow.horizontal,
         overflow.horizontal ? `scrollW ${overflow.sw} > ${overflow.cw}` : '');
  }

} catch (e) {
  report.fatal = e.message + '\n' + e.stack;
  console.error('FATAL', e);
} finally {
  report.consoleErrorCount  = report.consoleErrors.length;
  report.pageErrorCount     = report.pageErrors.length;
  report.failedRequestCount = report.failedRequests.length;
  await browser.close();
  server.close();
  await writeFile(join(ROOT,'test','_functional-result.json'), JSON.stringify(report,null,2));
  const pass = report.steps.filter(s=>s.ok).length, total = report.steps.length;
  console.log(`\n=== ${pass}/${total} steps passed · console errors ${report.consoleErrorCount} · page errors ${report.pageErrorCount} · failed reqs ${report.failedRequestCount} ===`);
}

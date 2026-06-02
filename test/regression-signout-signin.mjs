// Reproduce BUG-026: sign out -> sign in shows empty home.
// Seeds a signed-up account+user, loads home, then drives signOut() and the
// real sign-in form, and inspects state.goals + the rendered #goals-list.
import { chromium } from 'file:///C:/Users/maila/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const UI   = join(ROOT, 'app', 'ui');
const MIME = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css',
  '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png',
  '.webmanifest':'application/manifest+json', '.woff2':'font/woff2' };

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
const PORT = 8743;
await new Promise(r => server.listen(PORT, r));
const BASE = `http://127.0.0.1:${PORT}`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.route('**raw.githubusercontent.com**', r => r.abort());

const errs = [];
page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
page.on('pageerror', e => errs.push('PAGEERR: ' + e.message));

// Seed a signed-up grade-6 school account the way signup would have:
// account record carries the full profile, user record present.
const PW_HASH = await (async () => {
  // mirror Storage.hashPassword('secret123')
  const { webcrypto } = await import('node:crypto');
  const data = new TextEncoder().encode('secret123:decashift-salt');
  const h = await webcrypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2,'0')).join('');
})();

await page.addInitScript((pwHash) => {
  const user = { userId:'u_repro', name:'Repro Kid', loginId:'reprokid', category:'school',
    grade:'6', regionalLanguage:null, registeredAt:new Date().toISOString(),
    trialStartDate:new Date().toISOString() };
  localStorage.setItem('decashift_user', JSON.stringify(user));
  // SCENARIO: account record has NO profile (as saved by the Drive-fetch path,
  // line 259: saveAccount(loginId, passwordHash, userId) — no 4th arg).
  localStorage.setItem('decashift_accounts', JSON.stringify([
    { loginId:'reprokid', passwordHash:pwHash, userId:'u_repro',
      createdAt:new Date().toISOString() }
  ]));
}, PW_HASH);

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

const afterLoad = await page.evaluate(() => ({
  screen: state.currentScreen, goals: state.goals.length,
  cards: document.querySelectorAll('#goals-list .goal-card, #goals-list .shelf-card, #goals-list > *').length
}));
console.log('AFTER LOAD (reload w/ user):', JSON.stringify(afterLoad));

// Now sign out via the real function
await page.evaluate(() => signOut());
await page.waitForTimeout(300);
const afterSignout = await page.evaluate(() => ({ screen: state.currentScreen, user: state.user, goals: state.goals.length }));
console.log('AFTER SIGNOUT:', JSON.stringify(afterSignout));

// Simulate a stale in-memory subject filter from a previous session — re-signin
// must reset to Daily Sprint, not land on an unloaded (blank) subject view.
await page.evaluate(() => { state.subjectFilter = 'mathematics'; });

// Drive the real sign-in form. Need to be on signin screen.
await page.evaluate(async () => { await _showScreen('signin'); _setupSignin(); });
await page.waitForTimeout(200);
await page.fill('#si-loginid', 'reprokid');
await page.fill('#si-password', 'secret123');
await page.click('#signin-btn');
await page.waitForTimeout(1500);

const afterSignin = await page.evaluate(() => ({
  screen: state.currentScreen,
  userCategory: state.user && state.user.category,
  userGrade: state.user && state.user.grade,
  manifest: state.manifest.length,
  goals: state.goals.length,
  questions: state.questions.length,
  goalsListChildren: document.getElementById('goals-list') ? document.getElementById('goals-list').children.length : 'NO #goals-list',
  goalsListHTMLlen: document.getElementById('goals-list') ? document.getElementById('goals-list').innerHTML.length : 0,
  homeActive: !!document.querySelector('#screen-home.active'),
  subjectFilter: state.subjectFilter,
  dailySprintTabActive: !!document.querySelector('#subject-tabs .subject-tab.active.daily-sprint-tab')
}));
console.log('AFTER SIGNIN:', JSON.stringify(afterSignin, null, 2));

await page.screenshot({ path: join(ROOT, 'test', 'screenshots', 'repro-after-signin.png'), fullPage: true });

await browser.close();
server.close();

// Regression assertion: signing back in (from a profile-less account record,
// no Drive endpoint) must restore grade content — not an empty home.
const pass = afterSignin.screen === 'home'
  && afterSignin.userCategory === 'school'
  && afterSignin.goals > 0
  && afterSignin.questions > 0
  && afterSignin.subjectFilter === 'daily-sprint'      // reset, not stale 'mathematics'
  && afterSignin.dailySprintTabActive === true;        // default tab visibly selected
console.log(pass ? '\nPASS — BUG-026 + default-tab reset: home has content, Daily Sprint active'
                 : '\nFAIL — empty home / wrong tab after sign-in');
process.exit(pass ? 0 : 1);

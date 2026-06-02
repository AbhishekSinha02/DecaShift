// FEAT-003 + ENH-009 — verify lazy subject-tab loading.
// Seeds a grade-6 school user, loads home (Daily Sprint), then:
//  1. asserts initial load fetched only today's files (small)
//  2. asserts ALL subject tabs render (derived from manifest, not loaded goals)
//  3. clicks the Math tab → asserts math files fetched + math shelves render
//  4. re-clicks Math → asserts NO new question-file fetches (cached)
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
const PORT = 8755;
await new Promise(r => server.listen(PORT, r));
const BASE = `http://127.0.0.1:${PORT}`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.route('**raw.githubusercontent.com**', r => r.abort());

// Count question-file fetches (questions/school/...) over time.
let qFetches = [];
page.on('request', r => {
  const u = r.url();
  if (u.includes('/questions/school/')) qFetches.push(u.split('/questions/')[1]);
});

await page.addInitScript(() => {
  window.__dsNoPrefetch = true;   // deterministic: test pure on-demand lazy loading
  localStorage.setItem('decashift_user', JSON.stringify({
    userId:'u_lazy', name:'Lazy Kid', loginId:'lazykid', category:'school',
    grade:'6', plan:'pro', trialStartDate:new Date().toISOString(),
    createdAt:new Date().toISOString() }));
});

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(600);

const initial = await page.evaluate(() => ({
  lazyMode: state.lazyMode,
  goals: state.goals.length,
  tabs: [...document.querySelectorAll('#subject-tabs .subject-tab')].map(b => b.dataset.subject),
  mathGoals: state.goals.filter(g => g.subject === 'mathematics' && g.weekNum).length,
  loadedSubjects: [...state.loadedSubjects]
}));
const initialFetches = qFetches.length;
console.log('INITIAL:', JSON.stringify(initial), '| qFetches=' + initialFetches);

// Click the Math tab
qFetches = [];
await page.evaluate(() => _setSubjectFilter('mathematics'));
await page.waitForTimeout(800);
const afterMath = await page.evaluate(() => ({
  goals: state.goals.length,
  mathWeekly: state.goals.filter(g => g.subject === 'mathematics' && g.weekNum).length,
  loadedSubjects: [...state.loadedSubjects],
  shelves: document.querySelectorAll('#goals-list .netflix-row').length,
  skeletons: document.querySelectorAll('#goals-list .skeleton-shelf').length
}));
const mathFetches = qFetches.length;
console.log('AFTER MATH CLICK:', JSON.stringify(afterMath), '| qFetches=' + mathFetches);

// Re-click Math — must NOT refetch (in-memory loadedSubjects guard)
qFetches = [];
await page.evaluate(() => _setSubjectFilter('mathematics'));
await page.waitForTimeout(400);
const reclickFetches = qFetches.length;
console.log('RE-CLICK MATH: qFetches=' + reclickFetches);

await page.close();

// ── Prefetch ON: a second user, no __dsNoPrefetch → background idle hydration
// should load other subjects on its own so a later tab open is instant. ────────
const page2 = await ctx.newPage();
await page2.route('**raw.githubusercontent.com**', r => r.abort());
await page2.addInitScript(() => {
  localStorage.setItem('decashift_user', JSON.stringify({
    userId:'u_pf', name:'Prefetch Kid', loginId:'pfkid', category:'school',
    grade:'6', plan:'pro', trialStartDate:new Date().toISOString(),
    createdAt:new Date().toISOString() }));
});
await page2.goto(BASE, { waitUntil: 'networkidle' });
await page2.waitForTimeout(2500);   // let idle prefetch run
const prefetched = await page2.evaluate(() => [...state.loadedSubjects]);
console.log('PREFETCHED (no click):', JSON.stringify(prefetched));

await browser.close();
server.close();

const pass =
  initial.lazyMode === true &&
  initial.tabs.includes('daily-sprint') && initial.tabs.includes('mathematics') &&
  initial.tabs.includes('science') &&
  initial.mathGoals < afterMath.mathWeekly &&      // only today's math at start, not all weeks
  afterMath.mathWeekly > 1 &&                      // full math weekly set loaded after click
  afterMath.shelves > 0 && afterMath.skeletons === 0 &&
  mathFetches > 0 &&                               // click triggered fetches
  reclickFetches === 0 &&                          // re-click served from memory
  prefetched.includes('mathematics');              // idle prefetch hydrated on its own
console.log(pass ? '\nPASS — FEAT-003 lazy loading + idle prefetch work'
                 : '\nFAIL — lazy subject loading broken');
process.exit(pass ? 0 : 1);

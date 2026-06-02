// BUG-030 — a User-ID account (no email field) + a non-empty accounts list must
// reach the quiz RESULT screen. Before the fix, Storage.findAccount(undefined)
// threw at the tail of _showResult, before _showScreen('result').
import { chromium } from 'file:///C:/Users/maila/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const UI   = join(ROOT, 'app', 'ui');
const MIME = { '.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json','.woff2':'font/woff2' };
const server = createServer(async (req,res)=>{ try{ let p=decodeURIComponent(req.url.split('?')[0]); if(p==='/')p='/index.html'; const fp=join(UI,p); if(!existsSync(fp)){res.writeHead(404);res.end('404');return;} const b=await readFile(fp); res.writeHead(200,{'Content-Type':MIME[extname(fp)]||'application/octet-stream'}); res.end(b);}catch(e){res.writeHead(500);res.end(String(e));}});
const PORT = 8812;
await new Promise(r => server.listen(PORT, r));
const BASE = `http://127.0.0.1:${PORT}`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.route('**raw.githubusercontent.com**', r => r.abort());

const pageErrors = [];
page.on('pageerror', e => pageErrors.push(e.message));

// User-ID user with NO email + a non-empty accounts list (the throw condition).
await page.addInitScript(() => {
  localStorage.setItem('decashift_user', JSON.stringify({
    userId:'u_b30', name:'Result Kid', loginId:'resultkid', category:'school', grade:'6',
    plan:'pro', trialStartDate:new Date().toISOString(), createdAt:new Date().toISOString() }));
  localStorage.setItem('decashift_accounts', JSON.stringify([
    { loginId:'resultkid', passwordHash:'x', userId:'u_b30', category:'school', grade:'6' }]));
});

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(700);

// Open a Math set, then answer every question to completion.
await page.evaluate(() => _setSubjectFilter('mathematics'));
await page.waitForTimeout(800);
const goalId = await page.evaluate(() => {
  const g = state.goals.find(x => x.subject === 'mathematics' && x.weekNum);
  if (g) startGoal(g.id);
  return g ? g.id : null;
});
await page.waitForTimeout(400);

// Answer loop: pick option 0, submit, next — until the result screen appears.
let reachedResult = false;
for (let i = 0; i < 40; i++) {
  const screen = await page.evaluate(() => state.currentScreen);
  if (screen === 'result') { reachedResult = true; break; }
  if (screen !== 'quiz') break;
  await page.evaluate(() => { _selectAnswer(0); submitAnswer(); });
  await page.waitForTimeout(120);
  await page.evaluate(() => { nextQuestion(); });
  await page.waitForTimeout(120);
}

const result = await page.evaluate(() => ({
  screen: state.currentScreen,
  resultActive: !!document.querySelector('#screen-result.active'),
  score: document.getElementById('result-score')?.textContent || ''
}));
console.log('GOAL:', goalId, '| RESULT:', JSON.stringify(result), '| reachedResult=' + reachedResult);
console.log('PAGE ERRORS:', JSON.stringify(pageErrors));

await browser.close();
server.close();

const pass = reachedResult && result.resultActive && /\d+\s*\/\s*\d+/.test(result.score)
  && pageErrors.length === 0;
console.log(pass ? '\nPASS — BUG-030: User-ID user reaches the result screen, no crash'
                 : '\nFAIL — result screen broken for User-ID user');
process.exit(pass ? 0 : 1);

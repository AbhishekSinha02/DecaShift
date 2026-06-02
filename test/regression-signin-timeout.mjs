// BUG: sign-in stuck on "Checking account…". Reproduce two paths:
//  A) same-browser signup→signout→signin: should find account locally, NOT hit Drive
//  B) account NOT local (cross-device / cleared storage) + slow Drive: must not hang
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
const PORT = 8788;
await new Promise(r => server.listen(PORT, r));
const BASE = `http://127.0.0.1:${PORT}`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.route('**raw.githubusercontent.com**', r => r.abort());
// Simulate a HANGING Apps Script endpoint — request never gets a response.
await page.route('**script.google.com**', () => { /* never fulfill → hang */ });

const pwHash = await (async () => {
  const { webcrypto } = await import('node:crypto');
  const h = await webcrypto.subtle.digest('SHA-256', new TextEncoder().encode('secret123:decashift-salt'));
  return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2,'0')).join('');
})();

// ── Path A: account present locally (post-signup state) ──────────────────────
await page.addInitScript((pw) => {
  const user = { userId:'u_h', name:'Hang Kid', loginId:'hangkid', category:'school',
    grade:'6', plan:'pro', trialStartDate:new Date().toISOString(), registeredAt:new Date().toISOString() };
  localStorage.setItem('decashift_user', JSON.stringify(user));
  localStorage.setItem('decashift_accounts', JSON.stringify([
    { loginId:'hangkid', passwordHash:pw, userId:'u_h', createdAt:new Date().toISOString(), ...user }
  ]));
}, pwHash);

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
await page.evaluate(() => signOut());
await page.waitForTimeout(200);
await page.evaluate(async () => { await _showScreen('signin'); _setupSignin(); });
await page.fill('#si-loginid', 'hangkid');
await page.fill('#si-password', 'secret123');
await page.click('#signin-btn');
await page.waitForTimeout(1500);
const A = await page.evaluate(() => ({ screen: state.currentScreen, btn: document.getElementById('signin-btn')?.textContent }));
console.log('PATH A (local account):', JSON.stringify(A));

// ── Path B: clear accounts → account only on (hanging) Drive ─────────────────
await page.evaluate(() => {
  document.getElementById('welcome-modal')?.classList.add('hidden');
  localStorage.removeItem('decashift_accounts'); localStorage.removeItem('decashift_user');
});
await page.evaluate(async () => { await _showScreen('signin'); _setupSignin(); });
await page.fill('#si-loginid', 'someoneelse');
await page.fill('#si-password', 'whatever1');
const tStart = Date.now();
// Submit programmatically (avoid the welcome-modal overlay intercepting a click).
// Do NOT return the promise — it never resolves while Drive hangs, which would
// block page.evaluate itself; fire-and-forget so we can poll the button.
await page.evaluate(() => { _handleSignin(new Event('submit')); });
// Poll up to 12s for the button to recover from "Checking account…"
let recovered = false, btnText = '';
for (let i = 0; i < 24; i++) {
  await page.waitForTimeout(500);
  btnText = await page.evaluate(() => document.getElementById('signin-btn')?.textContent || '');
  if (!/checking/i.test(btnText)) { recovered = true; break; }
}
const elapsed = Date.now() - tStart;
const errMsg = await page.evaluate(() => document.getElementById('err-si-loginid')?.textContent || '');
const btnEnabled = await page.evaluate(() => !document.getElementById('signin-btn')?.disabled);
console.log('PATH B (no local, hanging Drive): recovered=' + recovered + ' after ' + elapsed + 'ms, btn="' + btnText + '", enabled=' + btnEnabled + ', err="' + errMsg + '"');

await browser.close();
server.close();

const pass = A.screen === 'home'      // local-account sign-in works without Drive
  && recovered                         // button no longer stuck on "Checking account…"
  && btnEnabled                        // re-enabled so the user can retry
  && /reach the server|connection/i.test(errMsg);  // clear network error, not silent hang
console.log(pass ? '\nPASS — BUG-028 fixed: sign-in never hangs, recovers with a clear message'
                 : '\nFAIL — sign-in still hangs on Checking account');
process.exit(pass ? 0 : 1);

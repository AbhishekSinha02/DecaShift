// BUG-029 — when localStorage writes are silently blocked (private mode / blocked
// site data), signup must FAIL LOUDLY instead of looking successful and then
// failing at the next sign-in with "no account found".
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
const PORT = 8801;
await new Promise(r => server.listen(PORT, r));
const BASE = `http://127.0.0.1:${PORT}`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.route('**raw.githubusercontent.com**', r => r.abort());
await page.route('**script.google.com**', r => r.abort());

// Simulate a browser that silently drops writes to the accounts key.
await page.addInitScript(() => {
  const orig = localStorage.setItem.bind(localStorage);
  localStorage.setItem = (k, v) => { if (k === 'decashift_accounts') return; return orig(k, v); };
});

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
await page.evaluate(async () => { await _goToSignup('school'); });
await page.waitForTimeout(200);
await page.fill('#reg-name', 'Blocked Kid');
await page.fill('#reg-loginid', 'blockedkid');
await page.fill('#reg-password', 'secret123');
await page.fill('#reg-confirm', 'secret123');
await page.selectOption('#reg-grade', '6');
await page.evaluate(() => { document.getElementById('signup-form').requestSubmit(); });
await page.waitForTimeout(1000);

const res = await page.evaluate(() => ({
  screen: state.currentScreen,
  err: document.getElementById('err-loginid')?.textContent || '',
  btn: document.getElementById('signup-btn')?.textContent
}));
console.log('RESULT:', JSON.stringify(res));

await browser.close();
server.close();

const pass = res.screen !== 'home'                 // did NOT pretend signup worked
  && /save your account|allow site data|private/i.test(res.err)  // clear, actionable error
  && /Create Account/.test(res.btn);               // button re-enabled
console.log(pass ? '\nPASS — BUG-029: blocked storage fails signup loudly'
                 : '\nFAIL — signup silently "succeeds" with no persisted account');
process.exit(pass ? 0 : 1);

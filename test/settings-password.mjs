// BUG-027 — Settings → Security shows User ID (not blank Email) and password
// change works under the User-ID login system (FEAT-002).
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
const PORT = 8777;
await new Promise(r => server.listen(PORT, r));
const BASE = `http://127.0.0.1:${PORT}`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.route('**raw.githubusercontent.com**', r => r.abort());

const errs = [];
page.on('pageerror', e => errs.push('PAGEERR: ' + e.message));

// hash of 'oldpass1' per Storage.hashPassword
const oldHash = await (async () => {
  const { webcrypto } = await import('node:crypto');
  const h = await webcrypto.subtle.digest('SHA-256', new TextEncoder().encode('oldpass1:decashift-salt'));
  return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2,'0')).join('');
})();

await page.addInitScript((pw) => {
  const user = { userId:'u_sp', name:'Sec Kid', loginId:'seckid', category:'school',
    grade:'6', plan:'pro', trialStartDate:new Date().toISOString(), registeredAt:new Date().toISOString() };
  localStorage.setItem('decashift_user', JSON.stringify(user));
  localStorage.setItem('decashift_accounts', JSON.stringify([
    { loginId:'seckid', passwordHash:pw, userId:'u_sp', createdAt:new Date().toISOString(), ...user }
  ]));
}, oldHash);

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);

// Open Settings → Security
await page.evaluate(async () => { await openSettings(); openSettingsSection('security'); });
await page.waitForTimeout(200);

const idShown = await page.evaluate(() => {
  const el = document.getElementById('settings-loginid-display');
  const label = el?.closest('.form-group')?.querySelector('label')?.textContent || '';
  return { text: el ? el.textContent : 'NO ELEMENT', label };
});
console.log('ID DISPLAY:', JSON.stringify(idShown));

// Change the password
await page.fill('#settings-current-pw', 'oldpass1');
await page.fill('#settings-new-pw', 'newpass2');
await page.fill('#settings-confirm-pw', 'newpass2');
await page.evaluate(() => saveNewPassword());
await page.waitForTimeout(300);

const result = await page.evaluate(async () => {
  const ok  = document.getElementById('settings-pw-ok')?.textContent || '';
  const err = document.getElementById('settings-pw-err')?.textContent || '';
  const acct = Storage.findAccount('seckid');
  const newHash = await Storage.hashPassword('newpass2');
  const oldHashNow = await Storage.hashPassword('oldpass1');
  return { ok, err, matchesNew: acct?.passwordHash === newHash, stillOld: acct?.passwordHash === oldHashNow,
           profileKept: acct?.category === 'school' && acct?.grade === '6' };
});
console.log('CHANGE RESULT:', JSON.stringify(result));
console.log('PAGE ERRORS:', JSON.stringify(errs));

await browser.close();
server.close();

const pass =
  idShown.text === 'seckid' && /user id/i.test(idShown.label) &&   // shows User ID, labelled correctly
  result.ok.includes('updated') && !result.err &&                  // success, no error
  result.matchesNew && !result.stillOld &&                         // hash actually changed
  result.profileKept &&                                            // account profile not clobbered
  errs.length === 0;                                               // no thrown error (old bug threw)
console.log(pass ? '\nPASS — BUG-027 fixed: User ID shown, password change works'
                 : '\nFAIL — BUG-027 not fixed');
process.exit(pass ? 0 : 1);

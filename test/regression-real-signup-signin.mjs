// Reproduce the user's report: real signup, then sign out, then sign in on the
// SAME browser — does findAccount return the local account, or does it fall
// through to the Drive lookup (and fail)? Inspect localStorage at each step.
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
const PORT = 8799;
await new Promise(r => server.listen(PORT, r));
const BASE = `http://127.0.0.1:${PORT}`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.route('**raw.githubusercontent.com**', r => r.abort());
// Make any Drive call fail fast so we can SEE if sign-in wrongly reaches it.
let driveHits = 0;
await page.route('**script.google.com**', r => { driveHits++; r.abort(); });

page.on('pageerror', e => console.log('PAGEERR:', e.message));

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);

// ── Real signup (school, grade 6) ────────────────────────────────────────────
await page.evaluate(async () => { await _goToSignup('school'); });
await page.waitForTimeout(200);
await page.fill('#reg-name', 'Real Kid');
await page.fill('#reg-loginid', 'RealKid');           // note CamelCase — tests normalisation
await page.fill('#reg-password', 'secret123');
await page.fill('#reg-confirm', 'secret123');
await page.selectOption('#reg-grade', '6');
await page.evaluate(() => { document.getElementById('signup-form').requestSubmit(); });
await page.waitForTimeout(1200);

const afterSignup = await page.evaluate(() => ({
  screen: state.currentScreen,
  accounts: JSON.parse(localStorage.getItem('decashift_accounts') || '[]').map(a => ({ loginId: a.loginId, hasHash: !!a.passwordHash, userId: a.userId, category: a.category, grade: a.grade })),
  userLoginId: (JSON.parse(localStorage.getItem('decashift_user') || 'null') || {}).loginId
}));
console.log('AFTER SIGNUP:', JSON.stringify(afterSignup));

// ── Sign out ─────────────────────────────────────────────────────────────────
await page.evaluate(() => signOut());
await page.waitForTimeout(300);
const afterSignout = await page.evaluate(() => ({
  user: localStorage.getItem('decashift_user'),
  accounts: JSON.parse(localStorage.getItem('decashift_accounts') || '[]').map(a => ({ loginId: a.loginId, hasHash: !!a.passwordHash }))
}));
console.log('AFTER SIGNOUT:', JSON.stringify(afterSignout));

// ── Sign in (same browser) ───────────────────────────────────────────────────
driveHits = 0;
await page.evaluate(() => { document.getElementById('welcome-modal')?.classList.add('hidden'); });
await page.evaluate(async () => { await _showScreen('signin'); _setupSignin(); });
// what does findAccount return for the typed id?
const findResult = await page.evaluate(() => {
  const typed = 'RealKid'.trim().toLowerCase();
  const acct = Storage.findAccount(typed);
  return { typed, found: !!acct, acctLoginId: acct ? acct.loginId : null };
});
console.log('FINDACCOUNT AT SIGNIN:', JSON.stringify(findResult));

await page.fill('#si-loginid', 'RealKid');
await page.fill('#si-password', 'secret123');
await page.evaluate(() => { _handleSignin(new Event('submit')); });
await page.waitForTimeout(1500);
const afterSignin = await page.evaluate(() => ({
  screen: state.currentScreen,
  btn: document.getElementById('signin-btn')?.textContent,
  err: document.getElementById('err-si-loginid')?.textContent || '',
  pwErr: document.getElementById('err-si-password')?.textContent || ''
}));
console.log('AFTER SIGNIN:', JSON.stringify(afterSignin), '| driveHits=' + driveHits);

await browser.close();
server.close();

const pass = afterSignup.screen === 'home'
  && findResult.found === true
  && afterSignin.screen === 'home'
  && driveHits === 0;
console.log(pass ? '\nPASS — same-browser signup→signout→signin works, no Drive needed'
                 : '\nFAIL — sign-in broken on same browser');
process.exit(pass ? 0 : 1);

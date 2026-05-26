# Setup: Local Dev Testing — Zero Deployment Wait

**Priority:** P2 | **Type:** Developer Experience | **Complexity:** S | **Status:** Pending

## Goal
Eliminate the GitHub Pages deployment wait from the test loop. All flows should be testable locally in under 5 seconds from a code change.

## Steps to Enable Local Testing

### 1. VS Code Live Server (recommended)
- Install extension: "Live Server" by Ritwick Dey
- Right-click `app/ui/index.html` → Open with Live Server
- Runs at `http://127.0.0.1:5500/app/ui/`
- Auto-reloads on every file save

### 2. Python fallback (no VS Code needed)
```bash
cd app/ui
python -m http.server 8080
# Open http://localhost:8080
```

### 3. Node fallback
```bash
npx serve app/ui
```

## Why It Already Works Locally
`_loadManifest()` and `_fetchQuestionFile()` try GitHub raw URL first, then fall back to relative path on failure. On localhost, GitHub raw fetch fails silently and the local file is used. No code change needed.

## Dev Quick-Fill Shortcut (implement this)
Add a hidden keyboard shortcut `Ctrl+Shift+D` that pre-fills the signup form with test data so every test run doesn't require typing. Only active when `location.hostname === 'localhost'` or `127.0.0.1`.

```js
// In app.js — dev only
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') _devFill();
  });
}

function _devFill() {
  const s = id => document.getElementById(id);
  if (s('reg-name'))     s('reg-name').value     = 'Test User';
  if (s('reg-email'))    s('reg-email').value    = 'test@test.com';
  if (s('reg-mobile'))   s('reg-mobile').value   = '9876543210';
  if (s('reg-password')) s('reg-password').value = 'test123';
  if (s('reg-confirm'))  s('reg-confirm').value  = 'test123';
  if (s('reg-grade'))  { s('reg-grade').value    = '6'; s('reg-grade').dispatchEvent(new Event('change')); }
}
```

## Acceptance Criteria
- [ ] App loads at `http://localhost` with no errors
- [ ] Signup, signin, signout all work locally
- [ ] Questions load from local `questions/` folder (fallback path)
- [ ] `Ctrl+Shift+D` pre-fills signup form (localhost only)
- [ ] `TESTING.md` at repo root documents the local test flow

## Files to Touch
- `app/ui/app.js` — add `_devFill()` + keydown listener (localhost-gated)
- New: `TESTING.md` at repo root — local setup steps + test checklist

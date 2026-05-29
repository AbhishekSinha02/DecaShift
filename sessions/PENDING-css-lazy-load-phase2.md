# Session: PENDING — CSS Lazy-Load Phase 2 (P2-T035)

**Priority:** 2
**Type:** Performance
**Est. Duration:** 30 minutes
**Task:** P2-T035
**Trigger:** "start the session" when Priority 1 AND `styles-app.css` > 2,000 lines
**Depends on:** P1-T019 (Phase 1 must be complete — 3 CSS files must exist)

---

## Objective

Remove `styles-app.css` from `index.html` `<head>` and inject it via JavaScript
immediately before any app screen is shown. First-time visitors load ~15KB of CSS
instead of ~60KB. Zero FOUC. Zero visual change. Four `await` insertions.

---

## Pre-flight Check

Before starting, confirm:
1. `app/ui/styles-base.css`, `styles-auth.css`, `styles-app.css` all exist
2. `styles-app.css` is over 2,000 lines (run `wc -l app/ui/styles-app.css`)
3. `git status` is clean

If `styles-app.css` is under 2,000 lines: **do not run this session**. Put it back in
the queue. The Phase 1 split is sufficient until that threshold is crossed.

---

## Execute In This Order

### Step 1 — Add `_loadStylesheet()` to js/app-core.js

Add after the `_fetchJSON()` function:

```js
function _loadStylesheet(href) {
  if (document.querySelector(`link[href="${href}"]`)) return Promise.resolve();
  return new Promise(resolve => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = resolve;
    link.onerror = resolve; // fail open — app still works if CSS fails to load
    document.head.appendChild(link);
  });
}
```

### Step 2 — Remove styles-app.css from index.html

Find:
```html
  <link rel="stylesheet" href="styles-base.css">
  <link rel="stylesheet" href="styles-auth.css">
  <link rel="stylesheet" href="styles-app.css">
```

Replace with:
```html
  <link rel="stylesheet" href="styles-base.css">
  <link rel="stylesheet" href="styles-auth.css">
```

### Step 3 — Inject at sign-up completion (js/app-auth.js)

Find the sign-up completion block (after `Storage.saveUser(user)`, before `_showScreen('home')`):

```js
// before:
await _loadManifest();
await _loadQuestionsForUser(user);
// ... btn.disabled = false
_showScreen('home');

// after:
await _loadStylesheet('styles-app.css');
await _loadManifest();
await _loadQuestionsForUser(user);
// ... btn.disabled = false
_showScreen('home');
```

### Step 4 — Inject at sign-in completion (js/app-auth.js)

Find the sign-in completion block (before `_showScreen('home')`):

```js
// before:
await _loadManifest();
await _loadQuestionsForUser(user);
_showScreen('home');

// after:
await _loadStylesheet('styles-app.css');
await _loadManifest();
await _loadQuestionsForUser(user);
_showScreen('home');
```

### Step 5 — Inject at app boot for already-logged-in users (js/app-core.js)

Find in `init()`:
```js
if (user) {
  state.user = user;
  await _loadQuestionsForUser(user);
  _showScreen('home');

// after:
if (user) {
  state.user = user;
  await _loadStylesheet('styles-app.css');
  await _loadQuestionsForUser(user);
  _showScreen('home');
```

### ✅ COMMIT

```bash
git add app/ui/js/app-core.js app/ui/js/app-auth.js app/ui/index.html
git commit -m "perf(P2-T035): lazy-load styles-app.css after login — first-visit CSS ~15KB vs ~60KB"
git push origin main
```

---

## Verification

Open browser DevTools → Network tab → filter by CSS:

| Scenario | Expected |
|---|---|
| First visit (logged out) | Only `styles-base.css` + `styles-auth.css` fetched |
| After sign-in/sign-up | `styles-app.css` appears in Network log |
| Direct URL (already logged in) | All 3 appear, home screen fully styled |
| Refresh while logged in | `styles-app.css` served from cache (304 or `(disk cache)`) |
| Home screen first render | No unstyled flash — cards/nav/tabs all styled immediately |

---

## Success Criteria

- [ ] `styles-app.css` not in index.html `<head>`
- [ ] `_loadStylesheet()` helper in app-core.js
- [ ] Landing page: Network shows only base + auth CSS (no styles-app.css)
- [ ] After login: styles-app.css injected before home renders
- [ ] No FOUC on any path
- [ ] Returning user: 304 from cache for styles-app.css
- [ ] No console errors

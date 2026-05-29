# Task: CSS Lazy-Load Phase 2 — Critical Path Split (P2-T035)

**Priority:** P2 | **Type:** Performance | **Complexity:** S | **Status:** Pending
**Trigger:** Run when `styles-app.css` exceeds **2,000 lines**
**Depends on:** P1-T019 (Phase 1 must be done first)
**Created:** 2026-05-29

> Phase 1 splits for developer experience. Phase 2 splits for user performance.
> A first-time visitor on the landing page has no need for home/quiz/drill CSS.
> Inject styles-app.css via JavaScript the moment login completes.

---

## Why It Matters

**Without Phase 2** (after Phase 1 is done):
- All 3 CSS files are loaded upfront for every visitor
- A new user on the landing page downloads ~1,600 lines of quiz/home/drill CSS
  they will never see until after login

**With Phase 2:**
- Landing page visitor downloads: `styles-base.css` (~8KB gzipped) + `styles-auth.css` (~7KB) = **~15KB**
- After login, `styles-app.css` is injected before home screen renders
- Returning logged-in users: browser cache serves `styles-app.css` instantly (0ms, 0 bytes)

**On a 4G Indian connection at 5 Mbps:**
- Before Phase 2: ~27ms to download all CSS
- After Phase 2: ~5ms for auth CSS (22ms saved on first visit, 0ms saved on return)

**Why not do Phase 2 immediately:**
- At current size (~1,600 lines), the savings are real but small
- The complexity (async CSS injection) is worth it only when `styles-app.css` is large enough
  that the savings justify the added code path
- 2,000 lines (~50KB gzipped to ~12KB) is the crossover point where Phase 2 pays off

---

## Implementation

### 1. Add `_loadStylesheet()` helper to `js/app-core.js`

```js
function _loadStylesheet(href) {
  if (document.querySelector(`link[href="${href}"]`)) return Promise.resolve();
  return new Promise(resolve => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = resolve;
    link.onerror = resolve; // fail silently — app still works, just unstyled
    document.head.appendChild(link);
  });
}
```

### 2. Remove `styles-app.css` from index.html `<head>`

Before:
```html
<link rel="stylesheet" href="styles-base.css">
<link rel="stylesheet" href="styles-auth.css">
<link rel="stylesheet" href="styles-app.css">   ← remove this line
```

After:
```html
<link rel="stylesheet" href="styles-base.css">
<link rel="stylesheet" href="styles-auth.css">
```

### 3. Inject `styles-app.css` at the sign-in and sign-up completion points

In `js/app-auth.js`, both sign-up and sign-in flows, before `_showScreen('home')`:

```js
// sign-up completion:
await _loadStylesheet('styles-app.css');
_showScreen('home');

// sign-in completion:
await _loadStylesheet('styles-app.css');
_showScreen('home');
```

### 4. Handle already-logged-in users (app boot with existing session)

In `js/app-core.js`, in `init()`, when a user is found in localStorage:

```js
if (user) {
  state.user = user;
  await _loadStylesheet('styles-app.css'); // inject before showing home
  await _loadQuestionsForUser(user);
  _showScreen('home');
  _renderHome();
}
```

### 5. No FOUC (flash of unstyled content)

`_loadStylesheet()` is `await`-ed before any screen change. The home screen is never shown
before its CSS is ready. The Promise resolves on the `onload` event — the browser guarantees
the stylesheet is applied before the next paint.

---

## What Doesn't Change

- `styles-auth.css` remains in `<head>` — always needed for the landing/auth screens
- `styles-base.css` remains in `<head>` — always needed
- All CSS file contents are identical — this is a loading change, not a content change
- No change to any JS other than the 4 `await _loadStylesheet()` insertions and the helper function

---

## Acceptance Criteria

- [ ] `styles-app.css` removed from index.html `<head>`
- [ ] `_loadStylesheet()` helper added to app-core.js
- [ ] Sign-up flow: app CSS loads before home screen shows
- [ ] Sign-in flow: app CSS loads before home screen shows
- [ ] Already-logged-in (direct URL): app CSS loads before home screen shows
- [ ] No FOUC on any path: home screen is fully styled on first render
- [ ] Landing page loads only base + auth CSS (verify in Network tab: no styles-app.css)
- [ ] Returning user: styles-app.css served from browser cache (304 or from-cache)
- [ ] Committed and pushed

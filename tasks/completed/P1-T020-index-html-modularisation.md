# Task: index.html Modularisation — Screens into screens/ folder (P1-T020)

**Priority:** P1 | **Type:** Refactor / Architecture | **Complexity:** M | **Status:** Pending
**Created:** 2026-05-29
**Depends on:** — (standalone)

> index.html is 861 lines containing 7 screens + 1 settings modal + 6 modals.
> A developer editing the quiz screen scrolls past 385 lines of unrelated HTML to find it.
> This is the same structural problem styles.css had — everything in one file regardless of concern.
> The fix is the same pattern we used for manifests: fetch on demand, cache in memory.

---

## Why Now

- **Developer experience:** Finding any screen takes 30 seconds of scrolling. After modularisation,
  `screens/screen-quiz.html` opens directly to the quiz HTML.
- **Growth trajectory:** index.html grows ~20 lines per new screen feature. No bound on that growth.
- **Consistency:** js/ has JS. css/ has CSS. questions/manifests/ has manifests.
  index.html has everything else — that asymmetry should be resolved.
- **No performance regression:** Screen HTML is fetched once and cached in memory.
  Users on return visits: cached by service worker. First visit: fetch is ~1–2KB per screen.

**Decision filter:**
- Moves toward 5K users? ✅ Faster developer iteration → more features → better product
- Creates shareable moment? ❌
- Works on ₹8,000 Android on 4G? ✅ Each screen file is <3KB; fetch is identical to question loading

---

## Target State

```
app/ui/
  index.html         ← ~35 lines — shell only (head + empty body + scripts)
  screens/
    screen-landing.html    79 lines
    screen-signup.html    132 lines
    screen-signin.html     36 lines
    screen-home.html       96 lines
    screen-quiz.html       30 lines
    screen-result.html     34 lines
    screen-drill.html      48 lines
    screen-settings.html  238 lines  ← settings modal extracted too
```

**Modals** (welcome, gk-fact, reward-card, install-banner, ios-guide, streak-milestone):
These are already JS-populated (content injected via JS). Migrate to fully JS-rendered
using `document.body.insertAdjacentHTML('beforeend', ...)` — same pattern as reward-notif-wrap
and today-card-wrap already use. No separate HTML files needed for modals.

---

## Architecture — The _loadScreen() Pattern

### New function in js/app-core.js

```js
const _screenHTML = {};

async function _loadScreen(name) {
  if (document.getElementById('screen-' + name)) return; // already in DOM
  if (!_screenHTML[name]) {
    const urls = [
      _rawUrl('app/ui/screens/screen-' + name + '.html'),
      'screens/screen-' + name + '.html'
    ];
    for (const url of urls) {
      try {
        const r = await fetch(url);
        if (r.ok) { _screenHTML[name] = await r.text(); break; }
      } catch (_) {}
    }
  }
  if (_screenHTML[name]) {
    document.body.insertAdjacentHTML('beforeend', _screenHTML[name]);
  }
}
```

### _showScreen() becomes async

```js
// Before:
function _showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + name).classList.add('active');
  state.currentScreen = name;
}

// After:
async function _showScreen(name) {
  await _loadScreen(name);
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('screen-' + name);
  if (el) el.classList.add('active');
  state.currentScreen = name;
}
```

### All _showScreen() callers get await

Mechanical search-and-replace. Every call site:
```js
// before:
_showScreen('home');
_renderHome();

// after:
await _showScreen('home');
_renderHome();
```

The containing functions become async where needed (most are already async).

### Pre-fetch to prevent flash on first load

In `init()`, immediately after DOMContentLoaded, pre-fetch the two screens that show first:

```js
async function init() {
  // Pre-fetch landing + home in background — no await, parallel with everything else
  _loadScreen('landing');
  _loadScreen('home');
  // ... rest of init
}
```

These fetches start immediately and are cached before the user can possibly navigate.
If they resolve after the screen is needed, `_loadScreen()` returns instantly (element already in DOM).

---

## Screen Sizes + JS Dependencies

| Screen | Lines | Used by | Migration complexity |
|---|---|---|---|
| quiz | 30 | app-quiz.js, app-gk.js | Low — mostly static scaffold |
| result | 34 | app-quiz.js | Low |
| drill | 48 | app-drill.js | Low |
| signin | 36 | app-auth.js | Low |
| landing | 79 | app-auth.js | Medium — initial `class="screen active"` |
| home | 96 | app-home.js | Medium — many named elements |
| signup | 132 | app-auth.js | Medium — complex form |
| settings | 238 | app-settings.js | High — most complex HTML |

**Modals** (already JS-populated):
welcome (20L), gk-fact (15L), reward-card (25L), install-banner (15L),
ios-install (15L), streak-milestone (15L) → all move to JS-rendered, no HTML files

---

## Landing Screen Special Case

The landing screen currently has `class="screen active"` as initial state.
When extracted to a separate file, the HTML it contains uses `class="screen"` (no active).
The `init()` function in app-core.js adds `.active` via `_showScreen()`.

The pre-fetch in `init()` ensures `screen-landing.html` is in the DOM before any
user interaction can occur. The sequence:

1. Page loads → `init()` starts
2. `_loadScreen('landing')` called (no await) — fetch starts in background
3. `_loadScreen('home')` called (no await) — fetch starts in background
4. `_loadManifest()` called (awaited)
5. Landing/home fetch resolves (fast, ~1KB files)
6. `_showScreen('landing')` or `_showScreen('home')` called — DOM element already present

Even on slow 4G: manifest.json (749B) and screen-landing.html (~2KB) fetch in parallel.
Landing is ready before manifest parsing completes.

---

## index.html Shell After Migration

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#3b82f6">
  <meta name="description" content="...">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <title>Donnibo — Daily Quizzes for Sharp Minds</title>
  <link rel="icon" type="image/svg+xml" href="assets/icon.svg">
  <link rel="manifest" href="manifest.webmanifest">
  <script>document.documentElement.dataset.theme = localStorage.getItem('decashift_theme') || 'dark';</script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?..." rel="stylesheet">
  <link rel="stylesheet" href="css/styles-base.css">
  <link rel="stylesheet" href="css/styles-auth.css">
  <link rel="stylesheet" href="css/styles-app.css">
</head>
<body>
  <script>
    function toggleUserMenu() {
      document.getElementById('user-menu').classList.toggle('hidden');
    }
    document.addEventListener('click', e => {
      if (!e.target.closest('.avatar-ring-wrap') && !e.target.closest('.user-menu')) {
        const m = document.getElementById('user-menu');
        if (m) m.classList.add('hidden');
      }
    });
  </script>
  <script src="js/storage.js"></script>
  <script src="js/app-core.js"></script>
  <script src="js/app-auth.js"></script>
  <script src="js/app-home.js"></script>
  <script src="js/app-quiz.js"></script>
  <script src="js/app-drill.js"></script>
  <script src="js/app-settings.js"></script>
  <script src="js/app-gk.js"></script>
</body>
</html>
```

~35 lines. Zero screen HTML. Every screen is a file.

---

## Acceptance Criteria

- [ ] `screens/` folder with 8 HTML files (7 screens + settings)
- [ ] `_loadScreen()` helper in app-core.js
- [ ] `_showScreen()` is async, awaits `_loadScreen()`
- [ ] All `_showScreen()` call sites updated to await
- [ ] `init()` pre-fetches landing + home in background (no await)
- [ ] All 6 modals converted to JS-rendered (no hardcoded HTML in index.html)
- [ ] index.html is ~35 lines — shell only
- [ ] Full flow tested: landing → signup → home → quiz → result → drill → settings
- [ ] No flash of unstyled/blank content on any navigation path
- [ ] Git history preserved (screens extracted via Write + Edit, not copy-paste)

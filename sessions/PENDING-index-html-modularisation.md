# Session: PENDING — index.html Modularisation (P1-T020)

**Priority:** 1 ← TOP of queue, run this next
**Type:** Refactor / Architecture
**Est. Duration:** 3–4 hours across 5 atomic steps
**Task:** P1-T020
**Trigger:** "start the session"
**Depends on:** — (standalone; CSS split already done)
**Context safety:** Each step ends with a working app + commit.
If context runs out mid-session, last commit is always a working app.

---

## Objective

Break index.html (861 lines, 7 screens + modals) into a `screens/` folder.
index.html becomes a ~35-line shell. Every screen is its own file.
Pattern is identical to manifest sharding: fetch on demand, cache, serve instantly on repeat.

---

## Read Before Starting

```
app/ui/index.html              — full file, know all screen boundaries
app/ui/js/app-core.js          lines 227–231  (_showScreen — the function being upgraded)
app/ui/js/app-auth.js          — most _showScreen() call sites
```

Exact screen boundaries (do not re-derive):
```
screen-landing:  lines 26–104    (79 lines)
screen-signup:   lines 109–240  (132 lines)
screen-signin:   lines 245–280   (36 lines)
screen-home:     lines 285–380   (96 lines)
screen-quiz:     lines 385–414   (30 lines)
screen-result:   lines 419–452   (34 lines)
screen-drill:    lines 457–504   (48 lines)
settings-modal:  lines 507–744  (238 lines)
modals block:    lines 745–840  (96 lines — 6 modal divs)
shell remains:   head + scripts (~35 lines)
```

`git status` must be clean before starting.

---

## ATOMIC STEP 1 — Infrastructure: _loadScreen() + async _showScreen()
**Time:** ~30 min | **Files:** js/app-core.js, js/app-auth.js, js/app-quiz.js, js/app-drill.js, js/app-gk.js

### 1a. Add _loadScreen() + _screenHTML cache to js/app-core.js

Add right before the existing `_showScreen()` function:

```js
const _screenHTML = {};

async function _loadScreen(name) {
  if (document.getElementById('screen-' + name)) return;
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

### 1b. Make _showScreen() async

Replace the existing `_showScreen()`:
```js
async function _showScreen(name) {
  await _loadScreen(name);
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('screen-' + name);
  if (el) el.classList.add('active');
  state.currentScreen = name;
}
```

### 1c. Add pre-fetch to init()

In `init()`, add as the FIRST two lines (before `_initTheme()`):
```js
_loadScreen('landing');   // no await — fire and forget, cache while init runs
_loadScreen('home');
```

### 1d. Add await to all _showScreen() call sites

Search every JS file for `_showScreen(` and add `await`. The containing functions
must also be `async` (most already are since they use await elsewhere).

**app-auth.js** — 6 call sites (lines 8, 13, 37, 109, 122, 178, 190):
```js
// Every occurrence:
_showScreen('x')  →  await _showScreen('x')
// Ensure _setupLanding(), signUp(), signIn(), signOut() are async
```

**app-quiz.js** — 3 call sites (lines 13, 161, 191):
```js
async function startGoal(goalId) { ... await _showScreen('quiz'); ... }
async function _showResult() { ... await _showScreen('result'); ... }
// back-to-home button handler: wrap onclick in async arrow if needed
```

**app-drill.js** — 2 call sites (lines 123, 274):
```js
async function _startDrill(type) { ... await _showScreen('drill'); ... }
async function _exitDrill() { ... await _showScreen('home'); ... }
```

**app-gk.js** — 2 call sites (lines 118, 155):
```js
await _showScreen('quiz');
await _showScreen('home');
```

**app-core.js** — 2 call sites (lines 50, 53):
```js
await _showScreen('home');   // already inside async init()
await _showScreen('landing');
```

### ✅ COMMIT STEP 1
```
git add app/ui/js/
git commit -m "refactor(P1-T020): _loadScreen() + async _showScreen() — infrastructure for screen modularisation"
git push origin main
```

**Verify:** App loads, sign-in works, home shows. All screens still in index.html — no behaviour change, only _showScreen is now async.

---

## ATOMIC STEP 2 — Extract quiz, result, drill screens
**Time:** ~30 min | **Files:** index.html → screens/ (3 new files)

### 2a. Create screens/ folder. Extract exactly these lines from index.html:

**screens/screen-quiz.html** — copy lines 385–414 from index.html exactly as-is.
First line must be: `  <section id="screen-quiz" class="screen">`

**screens/screen-result.html** — copy lines 419–452.
First line: `  <section id="screen-result" class="screen">`

**screens/screen-drill.html** — copy lines 457–504.
First line: `  <section id="screen-drill" class="screen">`

### 2b. Remove those lines from index.html

Delete lines 382–504 (the 3 screens including their comment headers).
The `</section>` on line 380 (home screen end) should now be followed directly by
the settings modal `<div id="settings-modal"...>`.

### ✅ COMMIT STEP 2
```
git add app/ui/screens/ app/ui/index.html
git commit -m "refactor(P1-T020): extract quiz+result+drill screens to screens/ folder"
git push origin main
```

**Verify:** Start a quiz (home → tap Start) → quiz shows correctly → answer questions → result shows → return home. Flash Drill works.

---

## ATOMIC STEP 3 — Extract signin, signup, landing screens
**Time:** ~30 min | **Files:** index.html → screens/ (3 new files)

### 3a. Extract:

**screens/screen-signin.html** — lines 245–280 exactly.
**screens/screen-signup.html** — lines 109–240 exactly.
**screens/screen-landing.html** — lines 26–104 exactly.

Important for landing: the original has `class="screen active"`. In the extracted file,
change to `class="screen"` — the `active` class is added by `_showScreen()`, not baked in.

### 3b. Remove lines 23–280 from index.html

Lines 23–280 covered the 3 auth screens + their comment headers.
After deletion, index.html starts with the home screen comment at what was line 282.

### ✅ COMMIT STEP 3
```
git add app/ui/screens/ app/ui/index.html
git commit -m "refactor(P1-T020): extract landing+signup+signin screens to screens/ folder"
git push origin main
```

**Verify:** Open app in browser → landing shows. Click "I'm a Student" → signup shows. Switch to sign in → signin shows. Sign in → home shows.

---

## ATOMIC STEP 4 — Extract home + settings modal
**Time:** ~40 min | **Files:** index.html → screens/ (2 new files)

### 4a. Extract:

**screens/screen-home.html** — lines 285–380 (now renumbered after Steps 2+3 deletions;
use the `<section id="screen-home"` marker, not line numbers).

**screens/screen-settings.html** — the `<div id="settings-modal"...>` block through its
closing `</div>`. This is a modal-overlay div, not a `<section>`.

For the settings screen, `_loadScreen('settings')` won't work (it looks for `id="screen-settings"`
but the element has `id="settings-modal"`). Handle this differently:
```js
// In _showScreen(), special-case settings modal:
// Actually, openSettings() in app-settings.js already handles showing the modal.
// _loadScreen only needs to ensure the HTML is in the DOM.
// Use _loadScreen('settings-modal') and match to id="settings-modal".
```

Simplest approach: keep `_loadScreen()` as-is, use `'settings'` as the name,
but the HTML file contains `<div id="screen-settings" class="screen">` wrapping the modal box.

OR — even simpler: extract settings as a partial (`partials/settings-modal.html`) and
call `_loadPartial('settings-modal')` from `openSettings()` before showing.

**Recommended:** create `screens/screen-settings.html` containing just the `<div id="settings-modal"...></div>` block.
In `openSettings()` in app-settings.js:
```js
function openSettings() {
  _ensureSettingsInDOM().then(() => {
    document.getElementById('user-menu').classList.add('hidden');
    backToSettingsMenu();
    document.getElementById('settings-modal').classList.remove('hidden');
  });
}

async function _ensureSettingsInDOM() {
  if (document.getElementById('settings-modal')) return;
  const urls = ['screens/screen-settings.html', _rawUrl('app/ui/screens/screen-settings.html')];
  for (const url of urls) {
    try {
      const r = await fetch(url);
      if (r.ok) { document.body.insertAdjacentHTML('beforeend', await r.text()); return; }
    } catch (_) {}
  }
}
```

### 4b. Remove home + settings from index.html

After this step, index.html contains only: the shell (head + body open/close + scripts)
and the modals block (reward card, welcome, install banner, ios guide, streak milestone, gk fact).

### ✅ COMMIT STEP 4
```
git add app/ui/screens/ app/ui/index.html app/ui/js/app-settings.js
git commit -m "refactor(P1-T020): extract home+settings to screens/ folder"
git push origin main
```

**Verify:** Home loads after login. Tap ⚙️ → settings modal opens → all sub-screens work (profile, appearance, security, help) → close settings → back to home.

---

## ATOMIC STEP 5 — Convert modals to JS-rendered + finalize shell
**Time:** ~40 min | **Files:** index.html, js/*.js

The remaining modals in index.html are all JS-populated already. Convert each to
fully JS-rendered (create the DOM element in JS the first time it's needed).

### 5a. For each modal, move HTML out of index.html into the JS that shows it

**welcome-modal** → `_maybeShowWelcome()` in app-core.js:
```js
function _maybeShowWelcome() {
  if (localStorage.getItem('decashift_onboarded')) return;
  if (!document.getElementById('welcome-modal')) {
    document.body.insertAdjacentHTML('beforeend', `
      <div id="welcome-modal" class="modal-overlay hidden" onclick="if(event.target===this)dismissWelcome()">
        <div class="modal-box">
          ... exact HTML from index.html ...
        </div>
      </div>`);
  }
  document.getElementById('welcome-modal').classList.remove('hidden');
}
```

Repeat this pattern for each modal. The HTML string comes verbatim from what was in index.html.
Insert once, cached in DOM, never re-created.

### 5b. Delete the modals block from index.html (lines 745–840)

### 5c. Verify index.html is now the shell only (~35 lines)

Should contain: `<head>`, inline theme script, font links, CSS links, JS script tags.
Zero screen HTML. Zero modal HTML.

### ✅ COMMIT STEP 5
```
git add app/ui/index.html app/ui/js/
git commit -m "refactor(P1-T020): modals to JS-rendered — index.html is now a 35-line shell"
git push origin main
```

---

## Final Verification

- [ ] `index.html` ≤ 40 lines — shell only
- [ ] `screens/` folder: 8 HTML files
- [ ] Landing → Signup → Home → Quiz → Result flow: no flash, no blank screens
- [ ] Settings modal: opens, all 5 sub-screens work, closes
- [ ] Drills: flash drills work, GK drill works
- [ ] All 6 modals show correctly (welcome, gk-fact, reward-card, install-banner, ios-guide, streak-milestone)
- [ ] No console errors on any screen
- [ ] Mobile (375px): all screens render correctly

## Safe Handoff Note (if context runs long)

Each step is independently committed and working. Last committed step is always a stable app.
Step 1 is the riskiest (async _showScreen). Steps 2–5 are mechanical extractions.
If stopping after Step 1: app works, infrastructure ready for Step 2–5 in next session.

# ENH-010 — Refactor bulk files into focused modules (maintainability)

**Priority:** 🟠 P2 (tech-debt — do before the next big feature wave, not blocking launch)
**Estimate:** 1–1.5 sessions (code only, no content)
**Status:** Open — filed 2026-06-02 for a future session

---

## Why

A few files have grown well past the project's standing restructuring thresholds
(JS > 400 lines → split; CSS > 2,500 lines → split — see
`memory/feedback_code_restructuring.md`). The biggest, `app-home.js` at ~1,674
lines, now holds the tab strip, Daily Sprint, Netflix shelves, goal-card
builders, streak bar, greeting, daily quest and more in one file. Every bug fix
or enhancement there means scrolling a 1.6k-line file and risking unrelated
breakage. Splitting into focused modules makes changes safer and faster — which
is the whole point of the lazy-loading work that just landed (easier to extend
the load path, the shelves, etc.).

**This is a pure structural refactor: ZERO behaviour change, ZERO new features.**

---

## Targets (measured 2026-06-02)

| File | Lines | Over threshold? | Action |
|---|---|---|---|
| `app/ui/js/app-home.js` | **1,674** | 🔴 4× over (400) | **Split — top priority** |
| `app/ui/css/styles-app.css` | **2,860** | 🔴 over (2,500) | **Split by component area** |
| `app/ui/js/app-core.js` | 667 | 🟠 over | Split loaders/theme out |
| `app/ui/js/app-quiz.js` | 576 | 🟠 over | Split engine vs result (optional) |
| `app/ui/js/app-drill.js` | 378 | 🟡 near | Leave for now |
| `app/ui/js/app-settings.js` | 359 | 🟡 near | Leave for now |
| `app/ui/js/app-auth.js` | 332 | 🟡 near | Leave for now |
| `app/ui/screens/screen-landing.html` | 374 | 🟡 | Leave (markup, low churn) |

---

## Proposed split (final grouping decided in-session)

### `app-home.js` (1,674 → ~6 files)
- `app-home.js` — orchestrator only: `_renderHome`, the tab dispatch,
  `_setSubjectFilter`, `_ensureSubjectLoaded`, prefetch trigger, `_goHome`.
- `home-tabs.js` — subject tab strip render + per-tab accuracy badges.
- `home-daily-sprint.js` — `_renderDailySprint`, `_renderTodayCards`,
  `_renderGKSection`, `_renderFlashDrills`, `_renderGreeting`, `_renderDailyQuest`.
- `home-shelves.js` — Netflix rows, `_buildWeekRow`, `_buildTopicRow`,
  `_dayCardHtml`, `_shelfHtml`, shelf-arrow helpers, collapse + topic-key helpers.
- `home-goals.js` — goal actions (archive/unarchive/reset/menu),
  `_renderSubjectView`, `_renderRegionalView`, `_renderNoGradeState`.
- `home-streak.js` — `_renderStreakBar`, `_renderHeaderMeta`, `_renderCityStrip`.

### `styles-app.css` (2,860 → ~3–4 files)
- `styles-home.css` — home, tabs, shelves, cards, skeletons.
- `styles-quiz.css` — quiz + result + drill screens.
- `styles-components.css` — buttons, modals, chips, shared primitives.
- keep `styles-app.css` as remaining/shared or retire it.

### `app-core.js` (667 → 2–3 files)
- `app-core.js` — `init`, `state`, screen routing (`_showScreen`/`_loadScreen`),
  user menu.
- `app-loader.js` — `_loadManifest`, `_loadCurriculum`, `_ingestEntries`,
  `_loadSubjectData`, `_prefetchSubjectsIdle`, `_fetchJSON`, `_fetchQuestionFile`,
  `_filterManifest`, `_getShardsForUser`.
- `app-theme.js` — themes + `_autoApplyTheme` + theme selector.

### `app-quiz.js` (576) — optional this pass
- Split quiz engine (start/submit/next/timer) from result-screen rendering.

---

## Hard constraints (this codebase)

1. **Vanilla, no bundler.** All scripts share one global scope. Splitting is safe
   ONLY if every new file is added to `app/ui/index.html` and **load order is
   preserved** (a file must load after anything it calls at parse time; renderers
   are fine since they run later, but check top-level code).
2. **`index.html` is the only wiring point.** No service worker precache list
   exists (verified) — just the `<script>`/`<link>` tags. Add every new module
   there; add every new CSS file to the `<head>`.
3. **One file-group per commit, app works after each commit** (Code Stability
   Rules). Move a cohesive group, update index.html, run tests, commit. Never
   leave a half-moved file.
4. **No renames of public/global function names** — other files call them by bare
   name. Move definitions, don't rename.
5. Update `memory/feedback_code_restructuring.md` folder layout + this file's
   status when done.

---

## Test guard (run after every commit)

- `node test/functional-test.mjs` → must stay **16/16**, 0 page errors.
- `node test/regression-signout-signin.mjs` → PASS (sign-out/in + default tab).
- `node test/lazy-subject-tabs.mjs` → PASS (lazy + prefetch).
- Visual: screenshot home (Daily Sprint) + one subject tab; compare against
  current — pixel-identical expected (no behaviour change). Headless tests miss
  visual regressions (see `memory/session_handoff_20260530.md`).

---

## Acceptance

1. No JS file > ~500 lines; `app-home.js` orchestrator < ~250.
2. `styles-app.css` split so no CSS file > ~1,500 lines.
3. Functional 16/16 + both regression tests PASS, unchanged.
4. Home + subject tabs visually identical to pre-refactor screenshots.
5. `index.html` lists every module in correct order; app loads with 0 console
   errors (beyond the expected blocked-raw-URL ones in test).

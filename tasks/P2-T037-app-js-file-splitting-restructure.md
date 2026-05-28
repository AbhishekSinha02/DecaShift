# Feature: app.js File Splitting — JS Module Restructure

**Priority:** P2 | **Type:** Code Architecture | **Complexity:** M | **Status:** ✅ Done — 2026-05-29 · commit 2243807
**Do After:** P2-T031 (Flash Drill) session — app.js will be ~1,300 lines by then.
**Trigger:** Schedule this when app.js approaches 2,000 lines OR after 6:30 PM session on 2026-05-28.

> No framework. No bundler. No npm. Just clean file splitting via multiple script tags.
> Same performance. Same deployment. Zero new dependencies.
> The only change a user will ever notice: the app might load 50ms faster.

---

## Why This Matters

app.js is currently 1,067 lines. After Flash Drills (P2-T031) it will be ~1,300.
After Planner + Journal + Goals it will cross 2,000+. A 2,000-line single file means:
- Scrolling endlessly to find a function
- Merge conflicts when two features touch the same section
- Hard to reason about what depends on what
- Debugging slows down as the file grows

The fix is mechanical and low-risk: cut the file along logical boundaries,
add multiple `<script>` tags in the right load order, done.

---

## The Split Plan

### Target Structure

```
app/ui/
├── app-core.js        (~250 lines) Bootstrap, routing, theme, manifest, question loading
├── app-auth.js        (~200 lines) Signup, signin, signout, validation
├── app-home.js        (~350 lines) Home screen render, goals list, weekly sets, subject tabs, settings
├── app-quiz.js        (~250 lines) Quiz engine, timer, result screen, session save
├── app-drill.js       (~300 lines) Flash drill engine, data banks, GK/formula loaders
└── app-settings.js    (~150 lines) Settings modal, profile edit, password change, theme selector
```

Total: same ~1,500 lines. Split across 6 files of 150–350 lines each.
`storage.js` stays as-is — already a separate file.

### Load Order in index.html

```html
<!-- Load order matters — core first, features after -->
<script src="storage.js"></script>
<script src="app-core.js"></script>
<script src="app-auth.js"></script>
<script src="app-home.js"></script>
<script src="app-quiz.js"></script>
<script src="app-drill.js"></script>
<script src="app-settings.js"></script>
```

All files share the global `state` object (defined in app-core.js).
No imports. No exports. Same browser-global pattern as today.

---

## What Goes Where

### `app-core.js`
```
CONFIG, _rawUrl()
state object (the single global state)
THEMES, _initTheme(), _setTheme(), _autoApplyTheme()
_renderThemeSelector(), _toggleAvatar()
init()
_loadManifest(), _loadQuestionsForUser(), _fetchQuestionFile()
_filterManifest()
_showScreen()
_getFirstName(), _validEmail(), _esc()
_showError(), _clearErrors()
_getISOWeek()
```

### `app-auth.js`
```
_setupLanding(), _goToSignup()
_setupSignup(), _handleSignup()
_setupSignin(), _handleSignin()
signOut()
_maybeShowWelcome(), dismissWelcome()
```

### `app-home.js`
```
_renderHome()
_renderGoalsList(), _cardHtml(), _dayCardHtml()
_setSubjectFilter()
_toggleArchivedSection(), _toggleLastWeekSection()
_archiveGoal(), _unarchiveGoal()
resetGoal()
_toggleGoalMenu(), _closeAllGoalMenus()
_DAY_ORDER, _DAY_LABEL, _dayOrder(), _cap()
_shuffle() (shared util — keep in app-core.js or duplicate)
```

### `app-quiz.js`
```
startGoal()
_renderQuestion()
_selectAnswer()
submitAnswer()
nextQuestion()
showResult()
_renderResultTable()
toggleTimer(), _startTimer(), _stopTimer()
```

### `app-drill.js`
```
DRILL_META
_buildTablesBank(), _buildSquaresBank(), _buildCubesBank()
_getDrillRecord(), _saveDrillRecord()
_startDrill()
_startDrillTimer()
_renderDrillQuestion(), _showFormulaFlash(), _renderDrillMCQ()
_selectDrillAnswer()
_showDrillResult()
_retryDrill(), _exitDrill()
_shareDrillResult()
_loadGKBank(), _loadGKDrill(), _loadFormulaDrill()
```

### `app-settings.js`
```
openSettings(), closeSettings()
saveProfileEdit()
saveRegionalLanguage()
saveNewPassword()
_renderThemeSelector() (or keep in app-core.js)
_toggleAvatar()
```

---

## How to Execute the Split

This is a mechanical operation, not a rewrite. Steps:

1. **Create all 6 new files** as empty files
2. **Cut functions from app.js** into the correct target file — do not rewrite, just move
3. **Update index.html** — replace `<script src="app.js">` with the 6 new script tags in order
4. **Delete app.js** — it is now replaced by the 6 files
5. **Open in browser** — test all screens: login, home, quiz, drill, result, settings
6. **Fix any "not defined" errors** — these happen when a function referenced in one file lives in another that loads after it. Fix by moving to app-core.js or reordering script tags.
7. **Commit**

---

## Risk Profile

**Low risk.** This is a reorganisation, not a rewrite. The logic does not change.
The only failure mode is load order: if file B calls a function defined in file C
but C loads after B, you get a "not defined" error. Fix by checking the call chain
and adjusting the script tag order.

**Safe to test:** Open index.html locally in browser before committing. All errors
show instantly in the console. Nothing is hidden.

---

## Acceptance Criteria

- [ ] app.js deleted — replaced by 6 new files
- [ ] index.html has 6 script tags in correct order
- [ ] All 6 files < 400 lines each
- [ ] Browser console shows zero errors on: landing → signup → home → quiz → drill → settings
- [ ] Theme switching still works
- [ ] Streak still updates after quiz and drill sessions
- [ ] Settings save correctly (profile, password, language, avatar)
- [ ] Committed and pushed — `git status` clean

## Files to Touch

- DELETE: `app/ui/app.js`
- CREATE: `app/ui/app-core.js`, `app/ui/app-auth.js`, `app/ui/app-home.js`, `app/ui/app-quiz.js`, `app/ui/app-drill.js`, `app/ui/app-settings.js`
- EDIT: `app/ui/index.html` — replace 1 script tag with 6

## Dependencies

- P2-T031 (Flash Drill — must be complete first; app-drill.js is the home for all drill code)
- All other P2 tasks that touch app.js — complete them before splitting or the split creates extra merge work

## Note on Future Features

After the split, new features go into the correct file from the start:
- P3-T033 (Planner) → `app-planner.js` (new file, add script tag)
- P3-T034 (Journal)  → `app-journal.js` (new file, add script tag)
- P3-T035 (Goals)    → `app-goals.js` (new file, add script tag)
Each new feature = one new file. Clean, bounded, easy to find.

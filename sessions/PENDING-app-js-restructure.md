# Session: TBD — app.js File Splitting Restructure (P2-T037)

**Scheduled:** After 2026-05-28 18:30 session (Flash Drill implementation)
**Type:** Code / Architecture
**Est. Duration:** 1.5–2 hours
**Trigger:** "start the session" (when this is the next pending session in INDEX)
**Depends on:** P2-T031 Flash Drill implementation must be committed first

---

## Objective

Split `app/ui/app.js` (~1,300 lines post Flash Drill) into 6 focused files.
No logic changes. No framework. No build step. Same deployment. Just clean organisation.

---

## Context

- app.js is currently 1,067 lines. After P2-T031 it will be ~1,300 lines.
- Full split plan is in: `tasks/P2-T037-app-js-file-splitting-restructure.md`
- This is a mechanical move — cut functions, paste into correct file, test.
- Risk is low: only failure mode is load order errors, easily fixed in browser console.

---

## Pre-flight Check

```bash
git log --oneline -3        # confirm Flash Drill session committed
git status                  # confirm clean working tree
wc -l app/ui/app.js         # confirm current line count
```

If app.js is under 1,500 lines and no major feature is pending, this session can still run — it just means the files will be smaller. The split is always beneficial.

---

## Execute In This Order

### Step 1 — Read the full plan
Open: `tasks/P2-T037-app-js-file-splitting-restructure.md`
Confirm the 6 target files and what goes in each.

### Step 2 — Create the 6 new empty files

```bash
# Create all 6 files (empty to start)
touch app/ui/app-core.js
touch app/ui/app-auth.js
touch app/ui/app-home.js
touch app/ui/app-quiz.js
touch app/ui/app-drill.js
touch app/ui/app-settings.js
```

### Step 3 — Move functions into each file

Do one file at a time. Start with `app-core.js` (the foundation everything else depends on).

**Order to fill:**
1. `app-core.js` — state, CONFIG, init, theme, manifest, question loading, shared utils
2. `app-auth.js` — signup, signin, signout, welcome modal
3. `app-home.js` — home render, goals list, weekly sets, subject tabs, archive
4. `app-quiz.js` — quiz engine, timer, result screen
5. `app-drill.js` — all drill functions and data banks
6. `app-settings.js` — settings modal, profile edit, password change

After each file: verify app-core.js was correct by opening browser. Fix any console errors before moving on.

### Step 4 — Update index.html

Replace:
```html
<script src="app.js"></script>
```

With:
```html
<script src="app-core.js"></script>
<script src="app-auth.js"></script>
<script src="app-home.js"></script>
<script src="app-quiz.js"></script>
<script src="app-drill.js"></script>
<script src="app-settings.js"></script>
```

### Step 5 — Delete app.js

```bash
rm app/ui/app.js
```

### Step 6 — Full browser test (open index.html locally)

Test every flow:
- [ ] Landing page loads
- [ ] Sign up (new account)
- [ ] Sign in (existing account)
- [ ] Home screen renders with goals
- [ ] Subject tabs filter correctly
- [ ] Start a quiz → answer → result
- [ ] Flash drill (all 5 types)
- [ ] Settings → theme change → avatar toggle → profile save → password change
- [ ] Sign out

Fix any "X is not defined" console errors by checking which file the function ended up in vs where it's called.

### Step 7 — Commit

```bash
git add app/ui/
git commit -m "refactor: split app.js into 6 focused modules

app-core.js: state, init, theme, manifest, question loading, utils
app-auth.js: signup, signin, signout, welcome modal
app-home.js: home screen, goals list, weekly sets, subject tabs
app-quiz.js: quiz engine, timer, result screen, session save
app-drill.js: flash drill engine, data banks, GK/formula loaders
app-settings.js: settings modal, profile edit, password change, theme selector

No logic changes. No framework. Same deployment. app.js deleted.
Each file 150-350 lines. Console clean. All flows tested."
git push origin main
```

### Step 8 — Update sessions/INDEX.md

Move this session from Unscheduled → Completed with commit hash.
Mark task P2-T037 as ✅ Done in tasks/INDEX.md.

---

## Success Criteria

- [ ] `app/ui/app.js` does not exist
- [ ] 6 new files exist, each < 400 lines
- [ ] index.html has 6 script tags in order
- [ ] Browser console: zero errors on all tested flows
- [ ] Committed and pushed

---

## Hand-off to Next Session

After this session, every future feature gets its own file from the start:
- Planner → `app-planner.js`
- Journal → `app-journal.js`
- Goals → `app-goals.js`

No more single-file growth. The architecture scales cleanly from here.

# Session: UI Overhaul Phase 1 — App Shell + Avatar + Grade Visible

**Priority:** 1 — Run this next. Do not run any other session first.
**Type:** Code / Visual Design
**Tasks:** P1-T014, P1-T017, P1-T016 (partial)
**Est. Duration:** 3 hours across 9 atomic steps
**Context safety:** Every step ends with a git commit. App is stable after every commit.
If context runs out mid-session, the last commit is always a working app.

---

## Read These Files Before Touching Anything

```
app/ui/index.html       lines 283–355  (screen-home section)
app/ui/app-home.js      lines 1–50    (_renderHome top section)
app/ui/styles.css       lines 460–570 (home layout, subject-tabs, goal-card)
```

Also confirm: `git status` is clean before starting.

---

## Context (what the app looks like today)

The home screen (`screen-home`) is a flat `<div class="home-wrap">` with no persistent chrome:
- Brand logo: only visible on landing/signup screens. Gone after login.
- Streak: inside `home-dashboard` div — scrolls away
- Subject tabs: in `subject-tabs` div — scrolls away
- Flash drills: below tabs — scrolls away
- No bottom nav
- Avatar: a letter in a grey circle. Toggle does nothing visible.
- Grade: invisible. User has no idea what grade/level is active.

Target after this session:
- Fixed 52px header: logo + "Grade 7" chip + city chip + avatar (always visible)
- Sticky 44px streak bar: streak + accuracy + sessions (stays when scrolling)
- Sticky subject tabs (stays when scrolling)
- Bottom nav 56px: ⚡Drills · 📖Practice · 🌍GK · 👤Me (always accessible)
- City strip 36px above bottom nav
- Avatar: gradient background + SVG streak ring
- "Today's Mission" card at top of content area

---

## ATOMIC STEP 1 — Fixed App Header
**Time:** ~20 min | **Files:** index.html, styles.css, app-home.js

### 1a. In index.html, replace the home-header block

Find this in `screen-home`:
```html
      <div class="home-header">
        <div>
          <p class="home-sub">Ready to grow today?</p>
          <h1 class="home-title" id="user-greeting">Your Goals</h1>
        </div>
        <div class="home-header-right">
          <div class="user-chip" onclick="toggleUserMenu()" style="cursor:pointer">
            <div class="user-avatar" id="user-avatar">?</div>
            <span id="user-chip-name">—</span>
          </div>
          <div class="user-menu hidden" id="user-menu">
            <button class="user-menu-item" onclick="openSettings()">⚙ Settings</button>
            <button class="user-menu-item" onclick="signOut()">Sign Out</button>
          </div>
        </div>
      </div>
```

Replace with:
```html
      <header class="app-header">
        <div class="app-header-brand">
          <img src="assets/icon.svg" class="app-logo" alt="Donnibo">
          <span class="app-brand-name">Donnibo</span>
        </div>
        <div class="app-header-meta" id="app-header-meta"></div>
        <div class="app-header-right">
          <div class="avatar-ring-wrap" id="avatar-ring-wrap" onclick="toggleUserMenu()" style="cursor:pointer">
            <svg class="avatar-ring-svg" viewBox="0 0 52 52" fill="none">
              <circle class="avatar-ring-track" cx="26" cy="26" r="22" stroke-width="3"/>
              <circle class="avatar-ring-fill" id="avatar-ring-fill" cx="26" cy="26" r="22"
                      stroke-width="3" stroke-linecap="round" transform="rotate(-90 26 26)"/>
            </svg>
            <div class="user-avatar" id="user-avatar">?</div>
          </div>
          <div class="user-menu hidden" id="user-menu">
            <button class="user-menu-item" onclick="openSettings()">⚙ Settings</button>
            <button class="user-menu-item" onclick="signOut()">Sign Out</button>
          </div>
        </div>
      </header>
```

Also remove the `<p class="home-sub">` and `<h1 class="home-title" id="user-greeting">` elements (greeting replaced by header-meta chip).

### 1b. Add CSS at end of styles.css

```css
/* ══════════════════════════════════════════════════════════════
   APP SHELL — Fixed header
   ══════════════════════════════════════════════════════════════ */
.app-header {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  height: 52px;
  display: flex; align-items: center; gap: 10px; padding: 0 16px;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  max-width: 100%;
}
.app-header-brand {
  display: flex; align-items: center; gap: 8px; flex-shrink: 0;
}
.app-logo { width: 24px; height: 24px; }
.app-brand-name {
  font-family: var(--font-head); font-weight: 800; font-size: 16px;
  color: var(--text); letter-spacing: -0.3px;
}
.app-header-meta {
  flex: 1; display: flex; align-items: center; gap: 6px; overflow: hidden;
}
.header-grade-chip {
  font-size: 11px; font-weight: 700; color: var(--accent);
  background: rgba(59,130,246,0.12); border: 1px solid rgba(59,130,246,0.25);
  border-radius: 20px; padding: 2px 9px; white-space: nowrap;
  font-family: var(--font-head);
}
.header-city-chip {
  font-size: 11px; color: var(--muted); white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis;
}
.app-header-right { position: relative; flex-shrink: 0; }

/* home-wrap top padding for fixed header */
.home-wrap { padding-top: 52px; }
```

### 1c. Add `_renderHeaderMeta()` to app-home.js (at the bottom, before the event listener)

```js
function _renderHeaderMeta() {
  const el   = document.getElementById('app-header-meta');
  const user = state.user;
  if (!el || !user) return;
  const grade = user.grade
    ? (isNaN(Number(user.grade)) ? user.grade : 'Grade ' + user.grade)
    : '';
  const city = user.city || '';
  el.innerHTML =
    (grade ? `<span class="header-grade-chip">${_esc(grade)}</span>` : '') +
    (city  ? `<span class="header-city-chip">📍 ${_esc(city)}</span>` : '');
}
```

Call `_renderHeaderMeta()` at the end of `_renderHome()`.

### ✅ COMMIT STEP 1
```
git add app/ui/index.html app/ui/styles.css app/ui/app-home.js
git commit -m "feat(P1-T014): fixed app header — Donnibo logo, grade chip, avatar always visible"
git push origin main
```
**Verify:** Open app → sign in → scroll down → header stays pinned. "Grade 7" visible.

---

## ATOMIC STEP 2 — Sticky Streak Bar
**Time:** ~15 min | **Files:** index.html, styles.css, app-home.js

### 2a. In index.html, replace home-dashboard with streak-bar

Find and replace:
```html
      <!-- Dashboard: streak + progress stats -->
      <div class="home-dashboard">
        <div class="streak-row">
          <div class="streak-main">
            <span class="streak-flame">🔥</span>
            <span class="streak-count" id="streak-count">0</span>
            <span class="streak-label">day streak</span>
          </div>
          <div class="streak-best">Best: <strong id="streak-best">0</strong> days</div>
        </div>
        <div class="stats-row">
          <div class="stat-mini">
            <span class="stat-mini-val" id="stat-sessions">0</span>
            <span class="stat-mini-key">Sessions</span>
          </div>
          <div class="stat-mini">
            <span class="stat-mini-val" id="stat-accuracy">—</span>
            <span class="stat-mini-key">Avg Accuracy</span>
          </div>
          <div class="stat-mini">
            <span class="stat-mini-val" id="stat-time">0m</span>
            <span class="stat-mini-key">Practiced</span>
          </div>
        </div>
      </div>
```

Replace with:
```html
      <div class="streak-bar" id="streak-bar">
        <span class="streak-flame-sm">🔥</span>
        <span class="streak-num" id="streak-count">0</span>
        <span class="streak-label-sm">days</span>
        <span class="streak-sep">·</span>
        <span class="streak-stat-val" id="stat-accuracy">—</span>
        <span class="streak-stat-key">accuracy</span>
        <span class="streak-sep">·</span>
        <span class="streak-stat-val" id="stat-sessions">0</span>
        <span class="streak-stat-key">sessions</span>
        <span class="streak-sep">·</span>
        <span class="streak-stat-val" id="stat-time">0m</span>
        <span class="streak-stat-key">practiced</span>
        <span class="streak-best-sm">Best: <strong id="streak-best">0</strong>d</span>
      </div>
```

### 2b. Add CSS
```css
/* ── Sticky streak bar ───────────────────────────────────────── */
.streak-bar {
  position: sticky; top: 52px; z-index: 190;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; gap: 6px;
  padding: 0 16px; height: 40px; overflow-x: auto;
  scrollbar-width: none;
}
.streak-bar::-webkit-scrollbar { display: none; }
.streak-flame-sm  { font-size: 16px; flex-shrink: 0; }
.streak-num       { font-size: 18px; font-weight: 800; color: var(--warning); font-family: var(--font-head); flex-shrink: 0; }
.streak-label-sm  { font-size: 11px; color: var(--muted); flex-shrink: 0; }
.streak-sep       { font-size: 11px; color: var(--border); flex-shrink: 0; }
.streak-stat-val  { font-size: 13px; font-weight: 700; color: var(--text); flex-shrink: 0; font-family: var(--font-head); }
.streak-stat-key  { font-size: 11px; color: var(--muted); flex-shrink: 0; }
.streak-best-sm   { font-size: 11px; color: var(--muted); margin-left: auto; flex-shrink: 0; white-space: nowrap; }
```

### 2c. Remove old stat element IDs from `_renderHome()` in app-home.js

The old `stat-mini-val` spans are replaced. The new IDs (`stat-accuracy`, `stat-sessions`, `stat-time`, `streak-count`, `streak-best`) are the same, so `_renderHome()` stat-setting code works unchanged. No JS change needed.

### ✅ COMMIT STEP 2
```
git add app/ui/index.html app/ui/styles.css
git commit -m "feat(P1-T014): sticky streak bar — streak+stats always visible on scroll"
git push origin main
```

---

## ATOMIC STEP 3 — Sticky Subject Tabs
**Time:** ~5 min | **Files:** styles.css only

Find `.subject-tabs {` in styles.css and add sticky positioning:
```css
.subject-tabs {
  /* existing rules stay — add these: */
  position: sticky;
  top: 92px;   /* header 52px + streak bar 40px */
  z-index: 180;
  background: var(--bg);
}
```

### ✅ COMMIT STEP 3
```
git add app/ui/styles.css
git commit -m "feat(P1-T014): sticky subject tabs — never scroll away"
git push origin main
```

---

## ATOMIC STEP 4 — Content Wrapper + Bottom Padding
**Time:** ~10 min | **Files:** index.html, styles.css

### 4a. In index.html, wrap flash-drill-section and goals-list

Find:
```html
      <div class="flash-drill-section" id="flash-drill-section">
```

Before this line, add: `      <div class="home-content" id="home-content">`

After the `</div>` that closes `goals-list` div, add: `      </div><!-- /home-content -->`

### 4b. Add CSS
```css
.home-content {
  padding: 12px 16px 110px; /* bottom: 56px nav + 36px strip + 18px gap */
}
```

Also remove the existing `padding` from `.home-wrap` if it conflicts (`.home-wrap` should only have `padding-top: 52px`).

### ✅ COMMIT STEP 4
```
git add app/ui/index.html app/ui/styles.css
git commit -m "feat(P1-T014): home-content wrapper with padding for fixed bottom chrome"
git push origin main
```

---

## ATOMIC STEP 5 — Fixed Bottom Nav
**Time:** ~20 min | **Files:** index.html, styles.css

### 5a. Add to index.html, just before `</section>` of screen-home

```html
      <nav class="bottom-nav" id="bottom-nav">
        <button class="bnav-item" onclick="_startDrill('tables')">
          <span class="bnav-icon">⚡</span>
          <span class="bnav-label">Drills</span>
        </button>
        <button class="bnav-item bnav-active" id="bnav-practice" onclick="_navPractice()">
          <span class="bnav-icon">📖</span>
          <span class="bnav-label">Practice</span>
        </button>
        <button class="bnav-item" onclick="_setSubjectFilter('gk');_renderHome()">
          <span class="bnav-icon">🌍</span>
          <span class="bnav-label">GK</span>
        </button>
        <button class="bnav-item" onclick="openSettings()">
          <span class="bnav-icon">⚙️</span>
          <span class="bnav-label" id="bnav-me-label">Me</span>
        </button>
      </nav>
```

### 5b. Add CSS
```css
/* ── Fixed bottom nav ────────────────────────────────────────── */
.bottom-nav {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 200;
  height: 56px;
  background: var(--surface);
  border-top: 1px solid var(--border);
  display: flex; align-items: stretch;
}
.bnav-item {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 2px;
  background: none; border: none;
  color: var(--muted); cursor: pointer;
  transition: color 0.15s; padding: 6px 4px;
  font-family: inherit;
}
.bnav-item:active, .bnav-active { color: var(--accent); }
.bnav-icon  { font-size: 20px; line-height: 1; }
.bnav-label { font-size: 10px; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase; }
```

### 5c. Add `_navPractice()` to app-home.js
```js
function _navPractice() {
  state.subjectFilter = localStorage.getItem('ds_last_subject') || 'mathematics';
  _renderHome();
  document.getElementById('home-content')?.scrollTo({ top: 0, behavior: 'smooth' });
}
```

Also in `_renderHome()`, at the end, update bnav-me-label with first name:
```js
const bnavMe = document.getElementById('bnav-me-label');
if (bnavMe) bnavMe.textContent = _getFirstName(state.user);
```

### ✅ COMMIT STEP 5
```
git add app/ui/index.html app/ui/styles.css app/ui/app-home.js
git commit -m "feat(P1-T014): fixed bottom nav — drills, practice, GK, settings"
git push origin main
```

---

## ATOMIC STEP 6 — City Partner Strip
**Time:** ~15 min | **Files:** index.html, styles.css, app-home.js

### 6a. Add to index.html, just before `<nav class="bottom-nav">`
```html
      <div class="city-strip hidden" id="city-strip">
        <span class="city-strip-dot">📍</span>
        <span class="city-strip-text" id="city-strip-text"></span>
      </div>
```

### 6b. Add CSS
```css
/* ── City partner strip ──────────────────────────────────────── */
.city-strip {
  position: fixed; bottom: 56px; left: 0; right: 0; z-index: 195;
  height: 30px;
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(8px);
  display: flex; align-items: center; gap: 6px; padding: 0 14px;
  border-top: 1px solid rgba(255,255,255,0.06);
}
.city-strip-dot  { font-size: 12px; }
.city-strip-text { font-size: 11px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
```

Also update `.home-content` padding-bottom to `116px` (was 110px) to account for city strip.

### 6c. Add `_renderCityStrip()` to app-home.js, call it from `_renderHome()`
```js
function _renderCityStrip() {
  const strip = document.getElementById('city-strip');
  const text  = document.getElementById('city-strip-text');
  const user  = state.user;
  if (!strip || !text || !user) return;
  const city = user.city || '';
  if (!city) { strip.classList.add('hidden'); return; }
  strip.classList.remove('hidden');
  text.textContent = city + ' · Students practicing daily';
}
```

### ✅ COMMIT STEP 6
```
git add app/ui/index.html app/ui/styles.css app/ui/app-home.js
git commit -m "feat(P1-T016): city strip above bottom nav — city-aware presence"
git push origin main
```

---

## ATOMIC STEP 7 — Styled Avatar + Streak Ring (P1-T017)
**Time:** ~25 min | **Files:** styles.css, app-home.js (new _renderAvatar)

### 7a. Add CSS for avatar ring
```css
/* ── Avatar ring ─────────────────────────────────────────────── */
.avatar-ring-wrap {
  position: relative; width: 36px; height: 36px; flex-shrink: 0;
}
.avatar-ring-svg {
  position: absolute; top: -5px; left: -5px;
  width: 46px; height: 46px; pointer-events: none;
}
.avatar-ring-track { stroke: rgba(255,255,255,0.08); }
.avatar-ring-fill  {
  stroke-dasharray: 138.2; stroke-dashoffset: 138.2;
  transition: stroke-dashoffset 0.7s ease, stroke 0.4s ease;
}
.user-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; font-weight: 800; color: #fff;
  font-family: var(--font-head);
  position: relative; z-index: 1;
  background: #3b82f6; /* fallback, overridden by JS */
  user-select: none;
}
```

### 7b. Add `_renderAvatar()` to app-home.js, call it from `_renderHome()`

```js
const _AVATAR_GRADIENTS = [
  ['#6366f1','#8b5cf6'], ['#3b82f6','#06b6d4'], ['#10b981','#34d399'],
  ['#f59e0b','#f97316'], ['#ef4444','#ec4899'], ['#8b5cf6','#d946ef'],
  ['#14b8a6','#3b82f6'], ['#f97316','#eab308'],
];

function _renderAvatar() {
  const show = localStorage.getItem('ds_avatar') !== 'false';
  const wrap = document.getElementById('avatar-ring-wrap');
  if (!wrap) return;
  if (!show) { wrap.style.opacity = '0.4'; } else { wrap.style.opacity = '1'; }

  const user   = state.user;
  const letter = user ? _getFirstName(user)[0].toUpperCase() : '?';
  const n      = user?.name ? (user.name.charCodeAt(0) + (user.name.charCodeAt(1) || 0)) : 0;
  const [c1, c2] = _AVATAR_GRADIENTS[n % _AVATAR_GRADIENTS.length];

  const el = document.getElementById('user-avatar');
  if (el) {
    el.textContent = letter;
    el.style.background = `linear-gradient(135deg, ${c1}, ${c2})`;
  }

  const streak = Storage.loadStreak().current;
  const circ   = 2 * Math.PI * 22; // r=22
  const fill   = document.getElementById('avatar-ring-fill');
  if (fill) {
    const progress = Math.min(streak / 7, 1);
    fill.style.strokeDashoffset = String(circ * (1 - progress));
    fill.style.stroke = streak >= 7 ? '#f59e0b' : '#3b82f6';
  }
}
```

Also: remove the old `user-avatar` text-setting from `_renderHome()` (the line `if (avatar) avatar.textContent = firstName[0].toUpperCase()`) — `_renderAvatar()` now handles it.

### ✅ COMMIT STEP 7
```
git add app/ui/styles.css app/ui/app-home.js
git commit -m "feat(P1-T017): styled avatar — gradient initials + streak ring + toggle fix"
git push origin main
```

---

## ATOMIC STEP 8 — Today's Mission Card
**Time:** ~20 min | **Files:** app-home.js, styles.css

### 8a. Add `_renderTodayCard()` to app-home.js
Call it at the top of the scrollable content in `_renderHome()` — render into a `today-card-wrap` div.

First add the target div in index.html, at the top of `home-content`:
```html
      <div class="home-content" id="home-content">
        <div id="today-card-wrap"></div>   ← ADD THIS LINE
        <div class="flash-drill-section" ...>
```

Then add the function:
```js
function _renderTodayCard() {
  const el = document.getElementById('today-card-wrap');
  if (!el) return;

  const user = state.user;
  if (!user || user.category !== 'school') { el.innerHTML = ''; return; }

  const currentWeek = _getISOWeek(new Date());
  const today       = new Date();
  const dayNames    = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const todayDay    = ['sun','mon','tue','wed','thu','fri','sat'][today.getDay()];

  const todayGoal = state.goals.find(g =>
    g.weekNum === currentWeek && g.weekDay === todayDay && g.subject === state.subjectFilter
  ) || state.goals.find(g =>
    g.weekNum === currentWeek && g.weekDay === todayDay
  );

  if (!todayGoal) { el.innerHTML = ''; return; }

  const qCount   = state.questions.filter(q => q.goalId === todayGoal.id).length;
  const last     = Storage.getLastSessionForGoal(todayGoal.id);
  const done     = last && last.accuracy >= 0.8;
  const dayLabel = dayNames[today.getDay()];
  const dateStr  = today.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  el.innerHTML = `
    <div class="today-card${done ? ' today-done' : ''}">
      <div class="today-card-top">
        <span class="today-badge">${_esc(dayLabel)} · ${dateStr}</span>
        ${done ? '<span class="today-done-badge">✅ Done</span>' : ''}
      </div>
      <div class="today-card-title">${_esc(todayGoal.name)}</div>
      <div class="today-card-footer">
        <span class="today-card-count">${qCount} questions</span>
        <button class="btn btn-primary btn-sm" onclick="startGoal('${todayGoal.id}')">
          ${done ? 'Redo' : last ? 'Continue →' : 'Start →'}
        </button>
      </div>
    </div>`;
}
```

### 8b. Add CSS
```css
/* ── Today's Mission card ────────────────────────────────────── */
.today-card {
  background: linear-gradient(135deg, rgba(59,130,246,0.15), rgba(99,102,241,0.1));
  border: 1px solid rgba(59,130,246,0.3);
  border-radius: var(--radius); padding: 14px 16px; margin-bottom: 14px;
}
.today-card.today-done {
  background: linear-gradient(135deg, rgba(34,197,94,0.12), rgba(16,185,129,0.08));
  border-color: rgba(34,197,94,0.3);
}
.today-card-top  { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
.today-badge     { font-size: 11px; font-weight: 700; color: var(--accent); text-transform: uppercase; letter-spacing: 0.5px; }
.today-done-badge { font-size: 11px; color: var(--success); }
.today-card-title { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 10px; font-family: var(--font-head); }
.today-card-footer { display: flex; align-items: center; justify-content: space-between; }
.today-card-count  { font-size: 12px; color: var(--muted); }
```

### ✅ COMMIT STEP 8
```
git add app/ui/index.html app/ui/styles.css app/ui/app-home.js
git commit -m "feat(P1-T016): Today's Mission card — shows today's active set at top of home"
git push origin main
```

---

## ATOMIC STEP 9 — Stats Mini-Cards + Button Elevation
**Time:** ~15 min | **Files:** styles.css only

### 9a. Button elevation — add to `.btn-primary` in styles.css
Find the `.btn-primary` rule and add:
```css
/* Add to existing .btn-primary: */
background: linear-gradient(135deg, var(--accent), #1d4ed8);
box-shadow: 0 3px 12px rgba(59,130,246,0.30);
```
```css
.btn-primary:active { transform: scale(0.97); box-shadow: none; }
```

### 9b. Rebuild stats as mini-cards — update `_renderHome()` in app-home.js

The `stat-sessions`, `stat-accuracy`, `stat-time` elements now live in the streak bar (Step 2). If there are still old `stat-mini` divs anywhere in index.html, remove them.

No additional stat card work needed if Step 2 streak bar is complete — the streak bar already shows all three stats inline.

### 9c. Flash drill section — move INSIDE home-content wrapper (verify it's inside)

Check that in index.html the `flash-drill-section` div is inside `home-content`. If not, move it in.

### ✅ COMMIT STEP 9
```
git add app/ui/styles.css app/ui/index.html
git commit -m "feat(P1-T015): button elevation — gradient + shadow; stat cleanup"
git push origin main
```

---

## Final Verification Checklist

After all 9 steps:
- [ ] Donnibo logo + "Grade 7" visible in fixed header at all times
- [ ] City chip visible if `user.city` is set
- [ ] Streak bar sticky — stays visible when scrolling goals
- [ ] Subject tabs sticky — stays visible when scrolling
- [ ] Bottom nav fixed — always accessible
- [ ] City strip shows if user has city set
- [ ] Avatar: gradient background + streak ring (not flat grey)
- [ ] Avatar toggle in settings actually fades/shows avatar
- [ ] Today's Mission card shows if there's a today goal
- [ ] Primary buttons have gradient + shadow
- [ ] No console errors on: home, quiz, drill, result, settings
- [ ] Works on mobile (375px) — nothing overflows

## Hand-off to Phase 2

After this session: run PENDING-ui-overhaul-phase2.md
Phase 2: Inter typography, answer card animations, subject color map, streak milestone celebration.

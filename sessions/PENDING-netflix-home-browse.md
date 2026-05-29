# Session: PENDING — Netflix-Style Home Browse

**Priority:** 1
**Type:** Code / Design
**Est. Duration:** 3 hours
**Task:** P2-T045
**Trigger:** "start the session"
**Depends on:** all prior UI tasks done ✓

---

## Objective

Keep subject tabs as the selector. Replace everything below the tabs with Netflix-style
horizontal-scroll rows for the SELECTED subject only. Flash Drills become a horizontal
row (not pills). Today section shows selected-subject card + GK card together.
GK tab shows GK-specific Netflix rows.

---

## Context

- Today = 2026-05-29. ISO Week = W22 (May 25–31). Last week = W21.
- Each goal JSON: `subject`, `weekNum`, `weekDay`, `conceptId`, `title`, `description`
- `conceptId` = topic key: `"linear-equations-one-variable"` → displays as "Linear Equations"
- `SUBJECT_STYLE` has color + icon per subject (app-home.js line 8–19)
- `_dayCardHtml()` reused inside netflix rows
- Current pattern: tabs → week nav ◀▶ → grid = 3 gestures
- Target pattern: tabs → one tap → Netflix rows below update. Scroll down for more rows.
  Scroll right for more cards. ZERO nav buttons.

---

## Corrected Design Spec

### Full page structure (top → bottom, vertical scroll):

```
[App Header — fixed]
[Streak bar — sticky]
[Subject tabs — sticky: Math | Science | English | Hindi | French | Marathi | GK]
──────────────────────────────────────────────────────────────
[TODAY SECTION]
  ┌─────────────────────────────┐  ┌──────────────────┐
  │ Thu, 29 May                 │  │ 🌍 Today's GK    │
  │ Grade 7 Math · Linear Eq.   │  │ 5 questions      │
  │ 10 questions          Start │  │           Start  │
  └─────────────────────────────┘  └──────────────────┘
  (Subject card — full-ish width)  (GK card — compact, always visible)
──────────────────────────────────────────────────────────────
[FLASH DRILLS ROW — always visible regardless of tab]
  Row label: ⚡ Flash Drills
  → [× Tables][² Squares][³ Cubes][∫ Formulas][🌍 GK Capsule]  (snap scroll)
──────────────────────────────────────────────────────────────
[NETFLIX ROWS — changes based on selected subject tab]
  Row: "This Week (W22)" →  [Mon][Tue][Wed][Thu][Fri]
  Row: "Last Week (W21)" →  [Mon][Tue][Wed][Thu][Fri]
  Row: "Linear Equations" → [W22-Mon][W22-Tue]...[W21-Mon]...
  Row: "Fractions"        → [W21-Wed][W21-Thu]...
  (more topic rows…)
──────────────────────────────────────────────────────────────
[Partner footer]
```

### When GK tab selected:
```
[TODAY SECTION — GK only, no subject card]
  [Today's GK capsule — prominent, full width]
[FLASH DRILLS ROW — same as always]
[NETFLIX ROWS — GK specific]
  Row: "Today's GK"    → [capsule card]
  Row: "This Week GK"  → [Mon GK][Tue GK]...
  Row: [topic rows by GK conceptId if any]
```

---

## Netflix Row Anatomy

```
THIS WEEK (W22)          5 sets
──────────────────────────────────────────────── →
[card 160px][card 160px][card 160px][card 160px][card 160px]
```

- Row container: `display:flex; overflow-x:auto; scroll-snap-type:x mandatory; gap:10px; padding:0 16px`
- Each card: `min-width:160px; max-width:160px; scroll-snap-align:start`
- Row label: navy `#1e3a8a`, 11px, uppercase, 700 weight
- Count badge: muted, mono
- No ◀▶ buttons anywhere — pure touch scroll

---

## Flash Drill Cards (new — replaces pills)

Each drill card in the Flash Drills row:
```
┌────────────────────┐
│  ×                 │
│  Tables            │
│  2–20 timed        │
│  Best: 1:42        │
└────────────────────┘
```
- Width: 140px (narrower than day-cards — drills are quicker)
- Background: `var(--surface-2)` with subject-specific accent border-top
- On click: `_startDrill('tables')` etc.

Drill card types (in order): Tables (×), Squares (²), Cubes (³), Formulas (∫), GK Today (🌍)

---

## Today Section — Two-Card Layout

New layout for `_renderTodayCard()`:

```
.today-row { display:flex; gap:10px; margin-bottom:16px; }
.today-card-main { flex:1; }           /* subject card, full stretch */
.today-card-gk   { width:130px; flex-shrink:0; }  /* compact GK card */
```

- Subject card: existing `.today-card` but inside `.today-card-main`
- GK card: new `.today-card-gk` — shows "Today's GK · 5 questions · Start"
- GK card always shows if there are GK goals for today (or if GK content is loaded)
- On mobile 375px: stacked vertically (flex-direction:column), GK card full width

---

## Files to Change

| File | What changes |
|---|---|
| `app/ui/js/app-home.js` | New `_renderNetflixRows()` replaces the goals-list HTML; new `_buildWeekRow()`, `_buildTopicRow()`, `_conceptLabel()`, `_buildDrillRow()`; modify `_renderTodayCard()` for 2-card layout; remove week nav HTML from `_renderHome()`; keep `_setSubjectFilter()` working (tabs still filter) |
| `app/ui/css/styles-app.css` | Add: `.netflix-row`, `.netflix-row-label`, `.netflix-row-count`, `.netflix-cards`, `.netflix-cards .day-card` width, `.drill-card`, `.today-row`, `.today-card-gk` |
| `app/ui/screens/screen-home.html` | Remove the `flash-drill-section` div (drills move to JS-rendered netflix row); keep `subject-tabs` div; keep `goals-list` div |

**Do NOT touch:** quiz, result, drill screens, auth, storage.js, styles-base.css, styles-auth.css, landing CSS.

---

## Execute In This Order

### Step 1 — CSS additions (styles-app.css)

Add after the existing `.day-card` block:

```css
/* ── Netflix browse rows ─────────────────────────────────────── */
.netflix-row { margin-bottom: 24px; }

.netflix-row-label {
  font-size: 11px; font-weight: 700; letter-spacing: .08em;
  text-transform: uppercase; color: #1e3a8a;
  padding: 0 16px; margin-bottom: 8px;
  display: flex; align-items: center; gap: 8px;
}
.netflix-row-label-dark { color: var(--muted); }  /* for flash drills row */

.netflix-row-count {
  font-size: 10px; font-weight: 500; color: var(--muted);
  font-family: var(--font-mono); text-transform: none; letter-spacing: 0;
}

.netflix-cards {
  display: flex; gap: 10px;
  overflow-x: auto; scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch; scrollbar-width: none;
  padding: 0 16px 4px;
}
.netflix-cards::-webkit-scrollbar { display: none; }

/* Day-cards inside netflix row get fixed width */
.netflix-cards .day-card {
  min-width: 160px; max-width: 160px;
  flex-shrink: 0; scroll-snap-align: start;
}

/* ── Flash Drill cards ───────────────────────────────────────── */
.drill-card {
  min-width: 130px; max-width: 130px; flex-shrink: 0;
  scroll-snap-align: start;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px 12px;
  display: flex; flex-direction: column; gap: 4px;
  cursor: pointer; transition: transform .15s, border-color .15s;
}
.drill-card:hover { transform: translateY(-2px); border-color: var(--accent); }
.drill-card-icon  { font-size: 22px; line-height: 1; margin-bottom: 2px; }
.drill-card-name  { font-size: 13px; font-weight: 700; color: var(--text); }
.drill-card-sub   { font-size: 11px; color: var(--muted); line-height: 1.3; }
.drill-card-best  {
  font-size: 10px; font-family: var(--font-mono);
  color: var(--warning); margin-top: 4px;
}

/* ── Today two-card row ──────────────────────────────────────── */
.today-row {
  display: flex; gap: 10px; margin-bottom: 16px; align-items: stretch;
}
.today-card-main { flex: 1; min-width: 0; }
.today-card-gk {
  width: 128px; flex-shrink: 0;
  background: var(--surface);
  border: 1px solid rgba(20,184,166,.25);
  border-left: 3px solid #14b8a6;
  border-radius: var(--radius);
  padding: 12px 10px;
  display: flex; flex-direction: column; justify-content: space-between; gap: 8px;
}
.today-gk-label  { font-size: 10px; font-weight: 700; color: #14b8a6; text-transform: uppercase; letter-spacing: .06em; }
.today-gk-title  { font-size: 12px; font-weight: 700; color: var(--text); line-height: 1.3; }
.today-gk-count  { font-size: 10px; color: var(--muted); font-family: var(--font-mono); }

@media (max-width: 400px) {
  .today-row { flex-direction: column; }
  .today-card-gk { width: 100%; }
}
```

### Step 2 — HTML: Remove static Flash Drill section

In `screen-home.html`, remove the entire `<div class="flash-drill-section"...>` block
(lines 51–64). The drills will now be rendered by JS as a netflix row.
Keep the `<div id="goals-list">` div — that's where Netflix rows render.

### Step 3 — JS: New rendering functions in app-home.js

#### 3a. Modify `_renderHome()`

Remove the week-nav-row HTML building and the subject-track HTML building from `_renderHome()`.
Keep tab rendering logic as-is (tabs still filter via `state.subjectFilter`).
After tab rendering, call `_renderNetflixRows()` instead of building the goals grid.

At the end of the `_renderHome()` function (before `list.innerHTML = html`), replace the
entire "build html" section with:

```js
  _renderNetflixRows(list, weeklyFiltered, state.subjectFilter, currentWeek);
```

Where `weeklyFiltered` = weekly goals for the current subject filter (already computed).

#### 3b. New `_renderNetflixRows(list, goals, subject, currentWeek)`

```js
function _renderNetflixRows(list, goals, subject, currentWeek) {
  let html = '';

  // Flash Drills row (always, regardless of subject tab)
  html += _buildDrillRow();

  if (subject === 'gk') {
    html += _renderGKNetflixRows();
    list.innerHTML = html;
    return;
  }

  const thisWeek = goals
    .filter(g => g.weekNum === currentWeek)
    .sort((a,b) => _dayOrder(a.weekDay) - _dayOrder(b.weekDay));

  const lastWeek = goals
    .filter(g => g.weekNum === currentWeek - 1)
    .sort((a,b) => _dayOrder(a.weekDay) - _dayOrder(b.weekDay));

  if (thisWeek.length) html += _buildWeekRow('This Week', thisWeek, false);
  if (lastWeek.length) html += _buildWeekRow('Last Week', lastWeek, true);

  // Topic rows — group all goals by conceptId
  const byConcept = {};
  goals.forEach(g => {
    const cid = g.conceptId || 'practice';
    (byConcept[cid] = byConcept[cid] || []).push(g);
  });

  Object.entries(byConcept)
    .sort(([,a],[,b]) =>
      Math.max(...b.map(g=>g.weekNum||0)) - Math.max(...a.map(g=>g.weekNum||0))
    )
    .forEach(([cid, cGoals]) => { html += _buildTopicRow(cid, cGoals); });

  if (!thisWeek.length && !lastWeek.length && !Object.keys(byConcept).length) {
    html += `<div class="empty-state"><div class="empty-emoji">📚</div>
      <p class="empty-title">No content yet for this subject.</p>
      <p class="empty-sub">Try Flash Drills or Today's GK while we add more!</p></div>`;
  }

  list.innerHTML = html;
}
```

#### 3c. New `_buildDrillRow()`

```js
function _buildDrillRow() {
  const drills = [
    { id: 'tables',   icon: '×', name: 'Tables',   sub: '2–20 timed' },
    { id: 'squares',  icon: '²', name: 'Squares',  sub: '1–25' },
    { id: 'cubes',    icon: '³', name: 'Cubes',    sub: '1–15' },
    { id: 'formulas', icon: '∫', name: 'Formulas', sub: 'Physics · Math' },
    { id: 'gk',       icon: '🌍', name: 'GK Today', sub: '5 questions' },
  ];
  const bests = JSON.parse(localStorage.getItem('ds_drill_bests') || '{}');
  const cards = drills.map(d => {
    const best = bests[d.id];
    const bestHtml = best
      ? `<div class="drill-card-best">Best: ${best}</div>`
      : `<div class="drill-card-best" style="color:var(--muted)">Not tried yet</div>`;
    return `<div class="drill-card" onclick="_startDrill('${d.id}')">
      <div class="drill-card-icon">${d.icon}</div>
      <div class="drill-card-name">${d.name}</div>
      <div class="drill-card-sub">${d.sub}</div>
      ${bestHtml}
    </div>`;
  }).join('');
  return `<div class="netflix-row">
    <div class="netflix-row-label">⚡ Flash Drills</div>
    <div class="netflix-cards">${cards}</div>
  </div>`;
}
```

#### 3d. New `_buildWeekRow(label, goals, isPast)`

```js
function _buildWeekRow(label, goals, isPast) {
  const weekNum   = goals[0]?.weekNum;
  const weekLabel = weekNum ? `${label} (W${weekNum})` : label;
  return `<div class="netflix-row">
    <div class="netflix-row-label">${weekLabel}
      <span class="netflix-row-count">${goals.length} sets</span>
    </div>
    <div class="netflix-cards">
      ${goals.map(g => _dayCardHtml(g, isPast)).join('')}
    </div>
  </div>`;
}
```

#### 3e. New `_buildTopicRow(conceptId, goals)`

```js
function _buildTopicRow(conceptId, goals) {
  if (!goals.length) return '';
  const label  = _conceptLabel(conceptId);
  const sorted = goals.slice().sort((a,b) =>
    (b.weekNum - a.weekNum) || (_dayOrder(a.weekDay) - _dayOrder(b.weekDay))
  );
  return `<div class="netflix-row">
    <div class="netflix-row-label">${label}
      <span class="netflix-row-count">${goals.length} set${goals.length!==1?'s':''}</span>
    </div>
    <div class="netflix-cards">
      ${sorted.map(g => _dayCardHtml(g, false)).join('')}
    </div>
  </div>`;
}
```

#### 3f. New `_conceptLabel(conceptId)`

```js
function _conceptLabel(conceptId) {
  if (!conceptId || conceptId === 'practice') return 'Practice';
  const STOP = new Set(['one','two','three','basics','intro','introduction',
    'variable','variables','advanced','level','and','the','of','in']);
  return conceptId.split('-')
    .filter(w => !STOP.has(w))
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
```

#### 3g. New `_renderGKNetflixRows()` — called when GK tab selected

```js
function _renderGKNetflixRows() {
  const currentWeek = _getISOWeek(new Date());
  const gkGoals = state.goals.filter(g => g.subject === 'gk' && g.weekNum);
  const thisWeek = gkGoals.filter(g => g.weekNum === currentWeek);
  const lastWeek = gkGoals.filter(g => g.weekNum === currentWeek - 1);
  let html = '';
  if (thisWeek.length) html += _buildWeekRow('This Week GK', thisWeek, false);
  if (lastWeek.length) html += _buildWeekRow('Last Week GK', lastWeek, true);
  if (!html) html += `<div class="empty-state"><div class="empty-emoji">🌍</div>
    <p class="empty-title">GK sets loading…</p>
    <button class="btn btn-primary btn-sm" onclick="_startDrill('gk')">Today's GK Drill →</button></div>`;
  return html;
}
```

#### 3h. Modify `_renderTodayCard()` — add GK companion card

Wrap the existing today-card in a `.today-row` div, and append a `.today-card-gk` card.

Replace the final `el.innerHTML = ...` in `_renderTodayCard()` with:

```js
  // Find today's GK drill goal (any GK goal for today)
  const todayDayStr = ['sun','mon','tue','wed','thu','fri','sat'][today.getDay()];
  const gkGoal = state.goals.find(g =>
    g.subject === 'gk' && g.weekNum === currentWeek && g.weekDay === todayDayStr
  );

  const subjectCardHtml = `
    <div class="today-card${done ? ' today-done' : ''} today-card-main">
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

  const gkCardHtml = gkGoal ? `
    <div class="today-card-gk">
      <div class="today-gk-label">🌍 GK</div>
      <div class="today-gk-title">${_esc(gkGoal.description.split('—')[0].trim())}</div>
      <div class="today-gk-count">${state.questions.filter(q=>q.goalId===gkGoal.id).length} questions</div>
      <button class="btn btn-primary btn-sm" onclick="startGoal('${gkGoal.id}')">Start →</button>
    </div>` : '';

  el.innerHTML = gkGoal
    ? `<div class="today-row">${subjectCardHtml}${gkCardHtml}</div>`
    : subjectCardHtml;  // no row wrap if no GK available
```

---

## Tab changes — subject tabs stay, GK confirmed

The existing tab logic already includes `gk` as a tab (line 103 in app-home.js).
GK tab rendering and `_renderGKTab(list)` call are already there.
The only change: when GK tab is active, call `_renderNetflixRows(list, gkGoals, 'gk', currentWeek)`
instead of `_renderGKTab(list)`.

Keep `_setSubjectFilter(s)` fully functional — it still sets `state.subjectFilter` and calls
`_renderHome()`. This is how tabs filter content.

Remove `_weekNav()` as it's replaced — tab logic + scroll replaces the ◀▶ buttons.

---

## Success Criteria

- [ ] Subject tabs visible and functional — clicking changes Netflix rows below
- [ ] Flash Drills appear as a horizontal row with 5 drill cards (not pills)
- [ ] Today section has 2 cards: subject card + GK companion card (side by side or stacked on mobile)
- [ ] "This Week" and "Last Week" rows render for selected subject
- [ ] Topic rows group by `conceptId` and render horizontally
- [ ] GK tab shows GK-specific Netflix rows
- [ ] Cards snap-scroll horizontally within each row
- [ ] Week nav ◀▶ buttons removed
- [ ] No quiz/result/auth functionality broken
- [ ] Works on 375px mobile

---

## Hand-off to Next Session

Netflix home complete. Next: P2-T044 PWA install banner (Priority 2), then P2-T035 CSS lazy load.

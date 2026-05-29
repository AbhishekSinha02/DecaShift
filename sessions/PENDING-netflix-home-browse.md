# Session: PENDING — Netflix-Style Home Browse

**Priority:** 1  (run next — replaces tab-based navigation)
**Type:** Code / Design
**Est. Duration:** 3 hours
**Task:** P2-T045
**Trigger:** "start the session" → runs when Priority 1 in pending queue
**Depends on:** all prior UI tasks done ✓

---

## Objective

Replace the subject-tab + week-nav home screen with a Netflix-style vertical scroll
of horizontal carousels — subjects as sections, rows as week-context or topic-context,
cards snap-scroll horizontally. Two flows visible simultaneously: time-based (This
Week / Last Week) and topic-based (concept rows). Remove all subject tabs.

---

## Context

- Today = 2026-05-29. ISO Week = W22 (starts Mon May 25). Last week = W21.
- Content files: `grade-7/math-w22-mon.json` … `math-w22-fri.json` (10 daily files per subject per 2 weeks)
- Each goal JSON has: `subject`, `weekNum`, `weekDay`, `conceptId`, `title`, `description`
- `conceptId` = topic grouping key e.g. `"linear-equations-one-variable"` → display as "Linear Equations"
- `SUBJECT_STYLE` already has color + icon per subject (app-home.js line 8-19)
- `_dayCardHtml()` already exists and will be reused inside horizontal rows
- Current broken pattern: subject-tabs + week nav ◀▶ + grid = 3 gestures to find content
- Target: 0 tabs, 0 nav buttons — scroll down = more subjects, scroll right = more cards

---

## Design Spec

### Page structure (top to bottom, vertical scroll):

```
[App Header — fixed]
[Streak bar — sticky]
─────────────────────────────────────────
[Today's Mission card — hero, full width]
[Flash Drills row — compact pills]
─────────────────────────────────────────
[Subject section: 📐 Mathematics — navy header bar]
  Row: "This Week" →  [Mon][Tue][Wed][Thu][Fri]  (snap scroll)
  Row: "Last Week" →  [Mon][Tue][Wed][Thu][Fri]  (snap scroll)
  Row: "[Topic A]"  →  [card][card][card]...      (snap scroll)
  Row: "[Topic B]"  →  [card][card]...
─────────────────────────────────────────
[Subject section: 🔬 Science — green header bar]
  Row: "This Week" → ...
  Row: "Last Week" → ...
  Row: "[Topic A]" → ...
─────────────────────────────────────────
[Subject section: 📖 English]
[Subject section: 🇮🇳 Hindi — only if user.regionalLanguage = 'hindi']
[Subject section: 🥖 French — only if user picked French]
[Subject section: 🌍 GK capsule — compact]
─────────────────────────────────────────
[Partner footer]
```

### Netflix row anatomy:
```
[Row label]  "This Week (W22)"        [Count badge]
[────────────────────────────────────────────────→ scroll]
 [card 160px] [card 160px] [card 160px] [card 160px] [card 160px]
```
- Each row: `display:flex; overflow-x:auto; scroll-snap-type:x mandatory; gap:10px; padding:0 16px`
- Each card: `min-width:160px; scroll-snap-align:start`
- No ◀▶ buttons — pure touch/mouse scroll

### Subject section header:
```
[colored left bar 4px] [icon] [Subject Name]   [Grade chip]
```
- Full width, height 40px
- `background: linear-gradient(to right, {subjectColor}18, transparent)`
- Left border: `4px solid {subjectColor}`
- Font: Syne bold, 15px
- Sticky as you scroll past (optional stretch goal)

### Topic row label format:
- Derive human label from `conceptId`:
  - `"linear-equations-one-variable"` → `"Linear Equations"`
  - `"fractions-basics"` → `"Fractions"`
  - Rule: replace hyphens with spaces, title-case, remove last word if it's a dimension word (one-variable, basics, intro)
- Show number of sessions: `"Linear Equations  (5 sets)"`

### Card sizing — horizontal context:
- Existing `.day-card` width: currently auto (grid). Add `min-width: 160px; max-width: 160px` when inside `.netflix-cards` context
- Use a wrapper class `.netflix-cards` that sets fixed card sizes

### Two flows = one scroll:
- Time rows (This Week, Last Week) appear first in each subject section
- Topic rows appear below time rows within the same section
- User sees both without any toggle — pure scroll discovery

---

## Files to Change

| File | What changes |
|---|---|
| `app/ui/js/app-home.js` | Replace `_renderHome()` with Netflix renderer; add `_buildSubjectSection()`, `_buildWeekRow()`, `_buildTopicRow()`; remove `_weekNav()`, `_scrollToSubj()` (keep as no-ops to not break drawer); add `_conceptLabel()` helper |
| `app/ui/css/styles-app.css` | Add: `.subj-section`, `.subj-section-hdr`, `.netflix-row`, `.netflix-row-label`, `.netflix-cards`, `.netflix-cards .day-card` (width override) |
| `app/ui/screens/screen-home.html` | Remove `subject-tabs` div; keep all other HTML (header, streak-bar, home-content) |

**Do NOT touch:** quiz screen, result screen, drill screen, auth screens, storage.js, app-core.js, styles-base.css, styles-auth.css, landing.

---

## Execute In This Order

### Step 1 — CSS: New Netflix row classes
Add to `styles-app.css` (after `.day-card` block):

```css
/* ── Netflix browse layout ───────────────────────────────── */
.subj-section { margin-bottom: 32px; }

.subj-section-hdr {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 16px 10px 12px;
  margin-bottom: 12px;
  border-left: 4px solid var(--section-color, var(--accent));
  background: linear-gradient(to right,
    color-mix(in srgb, var(--section-color, var(--accent)) 12%, transparent),
    transparent 60%);
}
.subj-section-hdr-icon  { font-size: 18px; line-height: 1; }
.subj-section-hdr-name  {
  font-family: var(--font-head); font-size: 15px; font-weight: 800;
  color: var(--text); flex: 1;
}
.subj-section-hdr-grade {
  font-size: 10px; font-weight: 700; letter-spacing: .06em;
  color: var(--muted); text-transform: uppercase;
}

.netflix-row { margin-bottom: 20px; }

.netflix-row-label {
  font-size: 11px; font-weight: 700; letter-spacing: .07em;
  text-transform: uppercase; color: #1e3a8a;
  padding: 0 16px; margin-bottom: 8px;
  display: flex; align-items: center; gap: 8px;
}
.netflix-row-count {
  font-size: 10px; font-weight: 500; color: var(--muted);
  font-family: var(--font-mono); letter-spacing: 0;
}

.netflix-cards {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding: 0 16px 8px;
}
.netflix-cards::-webkit-scrollbar { display: none; }

/* Override day-card width inside netflix row */
.netflix-cards .day-card {
  min-width: 160px;
  max-width: 160px;
  flex-shrink: 0;
  scroll-snap-align: start;
}
```

### Step 2 — HTML: Remove subject-tabs div
In `screen-home.html` remove the line:
```html
<div id="subject-tabs" class="subject-tabs" style="display:none"></div>
```
(The JS reference `tabsEl = document.getElementById('subject-tabs')` will return null gracefully.)

### Step 3 — JS: Replace _renderHome() in app-home.js

Replace the entire `_renderHome()` function and add new helpers. Keep all other functions
(goal actions, _dayCardHtml, streak rendering, reward cards, drawer, etc.) unchanged.

**New `_renderHome()` logic:**

```js
function _renderHome() {
  const user = state.user;
  _renderHeaderMeta();
  _renderCityStrip();
  _renderAvatar();
  _renderStreakBar();        // extracts streak + stats rendering
  _renderTodayCard();
  _renderRewardNotif();
  _renderNetflixHome();
  _renderPartnerFooter();
}
```

**New `_renderNetflixHome()`:**
```js
function _renderNetflixHome() {
  const list = document.getElementById('goals-list');
  if (!list) return;
  const user       = state.user;
  const isSchool   = user.category === 'school';
  const currentWeek = _getISOWeek(new Date());

  if (!isSchool) {
    // Professional: keep existing regular goals render
    _renderProfessionalGoals(list);
    return;
  }

  const subjectOrder = ['mathematics','science','english','social-science',
    'physics','chemistry','biology','hindi','french','gk'];
  const regionalLang = user.regionalLanguage;
  if (regionalLang && !subjectOrder.includes(regionalLang)) {
    subjectOrder.splice(subjectOrder.indexOf('gk'), 0, 'regional-' + regionalLang);
  }

  const allGoals   = state.goals.filter(g => g.weekNum);
  const subjects   = [...new Set(allGoals.map(g => g.subject))].sort((a,b) =>
    (subjectOrder.indexOf(a) + 100 || 99) - (subjectOrder.indexOf(b) + 100 || 99)
  );

  if (!subjects.length) {
    list.innerHTML = `<div class="empty-state"><div class="empty-emoji">📚</div>
      <p class="empty-title">Content loading…</p>
      <button class="btn btn-primary btn-sm" onclick="_startDrill('gk')">Today's GK →</button></div>`;
    return;
  }

  list.innerHTML = subjects.map(subj =>
    _buildSubjectSection(subj, allGoals.filter(g => g.subject === subj), currentWeek)
  ).join('');
}
```

**New `_buildSubjectSection(subject, goals, currentWeek)`:**
```js
function _buildSubjectSection(subject, goals, currentWeek) {
  const st      = SUBJECT_STYLE[subject] || { color: 'var(--accent)', icon: '📚' };
  const labels  = { mathematics:'Mathematics', science:'Science', english:'English',
    'social-science':'Social Science', hindi:'Hindi', french:'French',
    physics:'Physics', chemistry:'Chemistry', biology:'Biology', gk:'General Knowledge' };
  const name    = labels[subject] || _cap(subject);
  const thisWeek = goals.filter(g => g.weekNum === currentWeek).sort((a,b) => _dayOrder(a.weekDay)-_dayOrder(b.weekDay));
  const lastWeek = goals.filter(g => g.weekNum === currentWeek - 1).sort((a,b) => _dayOrder(a.weekDay)-_dayOrder(b.weekDay));

  // Group all goals by conceptId for topic rows
  const byConcept = {};
  goals.forEach(g => {
    const cid = g.conceptId || 'practice';
    (byConcept[cid] = byConcept[cid] || []).push(g);
  });
  // Sort concept groups: most recent week first
  const conceptEntries = Object.entries(byConcept).sort(([,a],[,b]) =>
    Math.max(...b.map(g=>g.weekNum||0)) - Math.max(...a.map(g=>g.weekNum||0))
  );

  const grade = state.user?.grade ? 'Grade ' + state.user.grade : '';

  let html = `<div class="subj-section" style="--section-color:${st.color}">
    <div class="subj-section-hdr">
      <span class="subj-section-hdr-icon">${st.icon}</span>
      <span class="subj-section-hdr-name">${name}</span>
      ${grade ? `<span class="subj-section-hdr-grade">${grade}</span>` : ''}
    </div>`;

  if (thisWeek.length) html += _buildWeekRow('This Week', thisWeek, false);
  if (lastWeek.length) html += _buildWeekRow('Last Week', lastWeek, true);

  conceptEntries.forEach(([cid, cGoals]) => {
    html += _buildTopicRow(cid, cGoals);
  });

  html += `</div>`;
  return html;
}
```

**New `_buildWeekRow(label, goals, isPast)`:**
```js
function _buildWeekRow(label, goals, isPast) {
  const weekNum = goals[0]?.weekNum;
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

**New `_buildTopicRow(conceptId, goals)`:**
```js
function _buildTopicRow(conceptId, goals) {
  if (goals.length <= 0) return '';
  const label = _conceptLabel(conceptId);
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

**New `_conceptLabel(conceptId)`:**
```js
function _conceptLabel(conceptId) {
  if (!conceptId || conceptId === 'practice') return 'Practice';
  const STOP_WORDS = new Set(['one','two','three','basics','intro','introduction',
    'variable','variables','advanced','level']);
  return conceptId
    .split('-')
    .filter(w => !STOP_WORDS.has(w))
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
```

**Extract `_renderStreakBar()`** from current `_renderHome()` — just the streak number + stat elements
(already present in the existing function, just needs its own named function for clarity).

**Keep `_weekNav()` and `_setSubjectFilter()` as no-op functions** so drawer and any old
callsites don't throw:
```js
function _weekNav(delta) {}       // retired — no-op
function _setSubjectFilter(s) {}  // retired — no-op
```

### Step 4 — Verify and commit
- Open app in browser. Check: Math section visible with This Week + Last Week rows + topic rows
- Check: Science, Hindi/French (if applicable) sections render
- Check: horizontal scroll works, cards snap
- Check: Today's Mission card still appears at top
- Check: Flash Drills pills still appear
- Commit: `feat(home): Netflix-style browse — subject sections, week rows, topic rows`

---

## Success Criteria

- [ ] No subject tabs visible anywhere on home screen
- [ ] Each subject is a section with colored header (navy left bar + subject color gradient)
- [ ] "This Week" and "Last Week" appear as horizontal scroll rows within each section
- [ ] Topic rows (by conceptId) appear below week rows in each section
- [ ] Cards in horizontal rows have fixed width 160px and snap-scroll
- [ ] Today's Mission card stays at top
- [ ] Flash Drills section stays in place
- [ ] No quiz/result/auth functionality broken
- [ ] Works on 375px mobile width

---

## Hand-off to Next Session

Netflix home complete. Next options:
- P2-T044: PWA install banner (currently Priority 5 → bump to 2 after this)
- P2-T035: CSS lazy load for styles-app.css
- Design polish: topic card visual upgrade (show concept progress arc)

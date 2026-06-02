# Home UX — Card Grouping + Flash Drill Tab Scoping
**Priority:** ★ HIGH (visible UX regression — all older cards collapse into one "Practice" pile; drills bleed across all subject tabs)
**Type:** Code session
**Effort:** ~1.5 hours
**File:** `app/ui/js/app-home.js`

---

## Issue 1 — "Practice" catch-all row (older cards beyond W23/W24)

### What users see now
After "This Week" and "Last Week" rows, ALL older weekly sets (grades 9-12 and 2-8) collapse into a single row labelled **"Practice"** because none of those goals have a `conceptId` field in their JSON. Every card lands in `byConcept['practice']` → one giant undifferentiated shelf.

### Root cause (app-home.js line 288-298)
```js
const byConcept = {};
goals.forEach(g => {
  const cid = g.conceptId || 'practice';   // ← everything without conceptId goes here
  (byConcept[cid] = byConcept[cid] || []).push(g);
});
```

Goals from grades 9-12 weekly files (and grade 2-8 daily files) have no `conceptId`; only professionally structured concept-bank goals do.

### Fix spec

**Step 1 — Derive a topic key from the goal title**

When `g.conceptId` is absent, extract a topic slug from `g.name` (goal title).

Strip known prefixes: `"Grade N "`, `"Grade N "`, subject name, ` — ` separator.
Take the first 4-5 meaningful words of what remains.

Examples:
- `"Grade 9 Mathematics — Lines and Angles & Triangles"` → `"Lines and Angles"`
- `"Grade 10 Social Science — Nationalism in India"` → `"Nationalism in India"`
- `"Grade 11 Physics — Work, Energy and Power"` → `"Work Energy Power"`
- `"Grade 5 Mathematics — Fractions"` → `"Fractions"`

If the title gives no meaningful topic (e.g., just the subject), fall back to `"Week ${g.weekNum}"` as the key.

**Helper to add in app-home.js (before `_renderNetflixRows`):**
```js
function _topicKeyFromGoal(g) {
  if (g.conceptId && g.conceptId !== 'practice') return g.conceptId;
  const raw = (g.name || '').replace(/^Grade\s+\d+\s+/i, '').replace(/^[^—–]+[—–]\s*/, '').trim();
  if (!raw || raw.length < 4) return g.weekNum ? 'week-' + g.weekNum : 'practice';
  // Slug: lowercase, only alphanum and hyphens, max 40 chars
  return raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
}
```

**Step 2 — Replace the byConcept bucketing in `_renderNetflixRows`**

```js
// OLD
const byConcept = {};
goals.forEach(g => {
  const cid = g.conceptId || 'practice';
  (byConcept[cid] = byConcept[cid] || []).push(g);
});

// NEW
const byConcept = {};
goals.forEach(g => {
  const cid = _topicKeyFromGoal(g);
  (byConcept[cid] = byConcept[cid] || []).push(g);
});
```

**Step 3 — Limit to 5 topic rows max + collapse/expand**

Show only the 5 most recent topics (by max weekNum in group).
If there are more, add a "Show all topics" toggle link.

```js
const topicEntries = Object.entries(byConcept)
  .sort(([, a], [, b]) =>
    Math.max(...b.map(g => g.weekNum || 0)) - Math.max(...a.map(g => g.weekNum || 0))
  );

const MAX_TOPICS = 5;
const visible = state.showAllTopics ? topicEntries : topicEntries.slice(0, MAX_TOPICS);

visible.forEach(([cid, cGoals]) => { html += _buildTopicRow(cid, cGoals); });

if (topicEntries.length > MAX_TOPICS && !state.showAllTopics) {
  html += `<div class="show-more-row">
    <button class="btn btn-ghost btn-sm" onclick="state.showAllTopics=true;_renderHome()">
      Show ${topicEntries.length - MAX_TOPICS} more topics ↓
    </button>
  </div>`;
}
```

Add `showAllTopics: false` to the `state` object in `app-core.js`.
Reset `state.showAllTopics = false` when the subject tab changes (in the tab click handler).

**Step 4 — Topic rows with >5 cards: split by difficulty**

In `_buildTopicRow`, if a topic group has more than 5 goals, render sub-rows by difficulty instead of one flat shelf:

```js
function _buildTopicRow(conceptId, goals) {
  if (!goals.length) return '';
  const label = _conceptLabel(conceptId);
  const sorted = goals.slice().sort((a, b) =>
    (b.weekNum - a.weekNum) || (_dayOrder(a.weekDay) - _dayOrder(b.weekDay))
  );

  if (sorted.length <= 5) {
    // Original flat shelf
    return _buildTopicRowShelf(label, sorted);
  }

  // >5 cards: group by difficulty level
  const byDiff = { easy: [], medium: [], hard: [] };
  sorted.forEach(g => {
    // Infer difficulty from goal level (1=easy, 2=medium, 3=hard) or from weekly position
    const diff = g.level <= 1 ? 'easy' : g.level === 2 ? 'medium' : 'hard';
    byDiff[diff].push(g);
  });

  let html = `<div class="topic-group">
    <div class="netflix-row-label topic-group-label">${label}</div>`;
  if (byDiff.easy.length)   html += _buildTopicRowShelf('Easy',   byDiff.easy);
  if (byDiff.medium.length) html += _buildTopicRowShelf('Medium', byDiff.medium);
  if (byDiff.hard.length)   html += _buildTopicRowShelf('Hard',   byDiff.hard);
  html += `</div>`;
  return html;
}

function _buildTopicRowShelf(label, goals) {
  // ... (existing _buildTopicRow body, renamed)
}
```

---

## Issue 2 — Flash drills showing on ALL subject tabs

### What users see now
The Flash Drill row renders identically on Math, Science, English, Social Science — it always shows the same Math-oriented drills regardless of the active subject tab.

### Root cause
`_renderFlashDrills()` is called unconditionally in `_renderHome()` (line 74), always writing to `#flash-drill-wrap`. There is no subject-awareness in `_buildDrillRow()`.

### Immediate fix (for this session)

In `_renderFlashDrills()`, only render when the active tab is `mathematics`:

```js
// BEFORE
function _renderFlashDrills() {
  const wrap = document.getElementById('flash-drill-wrap');
  if (wrap) wrap.innerHTML = _buildDrillRow();
}

// AFTER
function _renderFlashDrills() {
  const wrap = document.getElementById('flash-drill-wrap');
  if (!wrap) return;
  const showDrills = !state.user || state.subjectFilter === 'mathematics' || state.subjectFilter === 'all';
  wrap.innerHTML = showDrills ? _buildDrillRow() : '';
}
```

This hides drills on Science, English, Social Science, GK, and regional language tabs.
Math tab still shows drills normally. Non-school users (no subject tabs, `subjectFilter === 'all'`) still see drills.

### Deferred decision (tracked separately — see task below)
Whether to:
- (A) Create subject-specific drill sets for each subject
- (B) Add a dedicated "Drills" tab that shows all drills regardless of subject
- (C) Keep drills Math-only permanently

---

## Commit plan

```
# Step 1: hide drills on non-math tabs (10 min)
git add app/ui/js/app-home.js
git commit -m "fix: hide flash drills on non-math subject tabs (math-only for now)"

# Step 2: topic-based grouping for older cards (45 min)
git add app/ui/js/app-home.js app/ui/js/app-core.js
git commit -m "fix: group older sets by topic (max 5 rows), split >5 by difficulty"
```

---

## Related pending decision task

`PENDING-drill-tab-strategy.md` — created alongside this task. Decide drill UX before W25 content session.

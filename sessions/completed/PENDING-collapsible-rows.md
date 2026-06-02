# Home UX — Collapsible Rows
**Priority:** ★ HIGH (do in same session as PENDING-home-ux-card-grouping-and-drills.md)
**Type:** Code
**Effort:** ~45 min
**Files:** `app/ui/js/app-home.js`, `app/ui/styles-app.css`

---

## What users see now
All rows (This Week, Last Week, topic groups) are always fully expanded. On a phone with 4+ weeks of content, the home screen becomes a very long scroll with no way to collapse sections you've already done.

## What we want
Every row has a clickable header. Click → collapses the shelf. Click again → expands.

**Header shows:**
- **Week rows:** `This Week · 2–8 Jun` or `Last Week · 26 May–1 Jun`
- **Topic rows:** `Nazism and Rise of Hitler · 3 of 5 done` or `Fractions · 2 of 4 done`
- A chevron (`›` or `˅`) on the right that rotates when collapsed

**Default state:**
- This Week → **expanded** (users need to see their current work)
- Last Week → **collapsed** (done, out of the way)
- All older topic rows → **collapsed**

---

## Implementation

### 1 — Collapse state in localStorage (survives tab switch)

Store collapsed row IDs in localStorage so state persists when the user switches subject tabs.

```js
// In app-home.js — collapse helpers
const _COLLAPSE_KEY = 'ds_collapsed_rows';

function _collapsedSet() {
  try { return new Set(JSON.parse(localStorage.getItem(_COLLAPSE_KEY) || '[]')); }
  catch { return new Set(); }
}
function _setCollapsed(rowId, collapsed) {
  const s = _collapsedSet();
  collapsed ? s.add(rowId) : s.delete(rowId);
  localStorage.setItem(_COLLAPSE_KEY, JSON.stringify([...s]));
}
function _isCollapsed(rowId) { return _collapsedSet().has(rowId); }
```

### 2 — Row ID convention

| Row type | Row ID example |
|---|---|
| This Week | `row-week-current` |
| Last Week | `row-week-last` |
| Topic group | `row-topic-nazism-and-rise-of-hitler` (the cid slug) |
| Difficulty sub-row | `row-topic-fractions-easy` |

### 3 — Update `_buildWeekRow`

```js
function _buildWeekRow(label, goals, isPast) {
  const weekNum   = goals[0]?.weekNum;
  const weekLabel = weekNum ? `${label} · ${_weekRangeStr(isPast)}` : label;
  const rowId     = isPast ? 'row-week-last' : 'row-week-current';
  const collapsed = _isCollapsed(rowId);                // Last Week collapses by default
  const chevron   = `<span class="row-chevron${collapsed ? ' collapsed' : ''}">›</span>`;

  return `<div class="netflix-row${collapsed ? ' row-collapsed' : ''}" id="${rowId}">
    <div class="netflix-row-label collapsible-header"
         onclick="_toggleRow('${rowId}')">
      ${weekLabel}
      <span class="netflix-row-count">${goals.length} sets</span>
      ${chevron}
    </div>
    <div class="row-body">
      ${_shelfHtml(goals.map(g => _dayCardHtml(g, isPast)).join(''))}
    </div>
  </div>`;
}
```

**Default collapse for Last Week:** pre-populate `_COLLAPSE_KEY` in localStorage when first seen:
```js
// At start of _renderNetflixRows, after lastWeek is computed:
if (lastWeek.length && !localStorage.getItem(_COLLAPSE_KEY)) {
  localStorage.setItem(_COLLAPSE_KEY, JSON.stringify(['row-week-last']));
}
```

### 4 — Update `_buildTopicRow` (and `_buildTopicRowShelf`)

```js
function _buildTopicRow(conceptId, goals) {
  // ...existing sorting and done-count logic...
  const rowId     = 'row-topic-' + conceptId;
  const collapsed = _isCollapsed(rowId);   // topic rows collapsed by default
  const chevron   = `<span class="row-chevron${collapsed ? ' collapsed' : ''}">›</span>`;

  // single shelf (≤5 cards)
  return `<div class="netflix-row${collapsed ? ' row-collapsed' : ''}" id="${rowId}">
    <div class="netflix-row-label collapsible-header"
         onclick="_toggleRow('${rowId}')">
      <span class="concept-label-text">${label}</span>
      <span class="concept-dots">${dots}</span>
      <span class="netflix-row-count">${done} of ${total} done</span>
      ${chevron}
    </div>
    <div class="row-body">
      ${_shelfHtml(sorted.map(g => _dayCardHtml(g, false)).join(''))}
    </div>
  </div>`;
}
```

For difficulty sub-rows (>5 cards), each sub-row (Easy/Medium/Hard) is independently collapsible using the id `row-topic-${cid}-easy`, etc. The parent topic header is non-collapsible in that case (it's just a label).

### 5 — Toggle function

```js
function _toggleRow(rowId) {
  const el = document.getElementById(rowId);
  if (!el) return;
  const nowCollapsed = !el.classList.contains('row-collapsed');
  el.classList.toggle('row-collapsed', nowCollapsed);
  el.querySelector('.row-chevron')?.classList.toggle('collapsed', nowCollapsed);
  _setCollapsed(rowId, nowCollapsed);
}
```

### 6 — CSS additions in `styles-app.css`

```css
/* Collapsible rows */
.collapsible-header {
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 8px;
}
.collapsible-header:hover { opacity: 0.85; }

.row-chevron {
  margin-left: auto;
  font-size: 18px;
  color: var(--muted);
  transition: transform 0.2s ease;
  transform: rotate(90deg);   /* pointing down = expanded */
}
.row-chevron.collapsed {
  transform: rotate(0deg);    /* pointing right = collapsed */
}

.row-body {
  overflow: hidden;
  transition: max-height 0.25s ease, opacity 0.2s ease;
  max-height: 400px;
  opacity: 1;
}
.row-collapsed .row-body {
  max-height: 0;
  opacity: 0;
  pointer-events: none;
}
```

**Note:** `max-height` animation requires a set value (400px is safe for a single shelf row). If a row has multiple sub-shelves, use 800px.

---

## Default collapse behaviour summary

| Row | Default |
|---|---|
| This Week | Expanded |
| Last Week | Collapsed |
| Topic rows (older) | Collapsed |
| Difficulty sub-rows | Expanded (parent topic is already collapsed) |

---

## Commit
```
git add app/ui/js/app-home.js app/ui/styles-app.css
git commit -m "feat: collapsible row headers — week + topic rows collapse/expand with chevron"
```

---

## Do this in same session as PENDING-home-ux-card-grouping-and-drills.md
The topic grouping task creates `_buildTopicRow` changes; collapsible rows need the same function. Do card grouping first, then layer collapsibility on top.

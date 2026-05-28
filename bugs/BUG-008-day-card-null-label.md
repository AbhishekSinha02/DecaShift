# BUG-008 — Day card shows "DAY 1 • NULL" for weekly sets without a weekDay

**Status:** Fixed  
**Severity:** Medium (cosmetic, visible to all grade 9-12 users)  
**Reported:** 2026-05-28  
**Fixed:** 2026-05-28  

## Symptom

Day cards for grade 9–12 weekly question sets displayed "DAY 1 • NULL" as the
meta label instead of a meaningful label.

## Root Cause

`_dayCardHtml()` in `app.js` built the meta label unconditionally:

```js
// BEFORE (broken):
const dayNum   = (_DAY_ORDER[goal.weekDay] ?? 0) + 1;
const dayLabel = _DAY_LABEL[goal.weekDay] || goal.weekDay;
// rendered: `Day ${dayNum} · ${dayLabel}`
```

Grade 9–12 weekly sets have `weekNum` set but `weekDay: null` (they are weekly
topic sets, not daily drills). With `weekDay = null`:

- `_DAY_ORDER[null]` → `undefined` → `?? 0` → `dayNum = 1`
- `_DAY_LABEL[null]` → `undefined` → `|| goal.weekDay` → `null` → renders "NULL"

Result: "DAY 1 · NULL"

## Fix

Detect the `weekDay: null` case and fall back to "Week N":

```js
// AFTER (fixed):
const metaLabel = goal.weekDay
  ? `Day ${dayNum} · ${dayLabel}`   // daily drill: "Day 3 · Wed"
  : `Week ${goal.weekNum}`;          // weekly set: "Week 22"
```

## Files Changed

- `app/ui/app.js` — `_dayCardHtml()` meta label construction

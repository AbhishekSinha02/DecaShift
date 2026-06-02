# Decision — Flash Drill Tab Strategy
**Priority:** ★ MEDIUM (decide before W25 content session)
**Type:** Product decision (no code until decided)
**Effort:** 15-min decision → 1-2hr implementation

---

## Current state
Flash drills exist for Math only (5 drills: arithmetic, fractions, times-tables, basic-algebra, mental-math).
As of this task, drills are hidden on all non-math tabs (implemented in PENDING-home-ux-card-grouping-and-drills.md).

## The three options

### Option A — Subject-specific drill sets (most work, best experience)
Create drill question banks for Science, English, Social-Science.
Each subject tab shows its own drills.

**Science drill examples:** identify-the-organism, chemical-formula-flash, periodic-table-quiz
**English drill examples:** word-meaning-flash, grammar-rule-blitz, spelling-challenge
**Social-Science drills:** capital-city-flash, date-event-match, map-feature-quiz

**Effort:** ~3 hours per subject (content + code)
**Verdict:** Best UX, but significant content work. Do AFTER launch if at all.

### Option B — Dedicated "Drills" tab (medium work, clean)
Add a "⚡ Drills" tab to the subject tab bar.
All drills from all subjects live there.
Drills are hidden from all subject content tabs.

**Effort:** ~1 hour code
**Verdict:** Cleanest separation. Recommended if drills are to grow beyond Math.

### Option C — Math-only drills, permanently (zero extra work)
Drills stay Math-only forever. Other subjects never get drills.
The Math tab is the only place that shows drills.

**Effort:** Zero (already implemented)
**Verdict:** Simplest. Defensible if Math drilling is the primary use case.

---

## Decision needed
Pick A, B, or C before the next content session (W25).

**Recommended:** Option B (dedicated Drills tab) — separates concerns cleanly, doesn't require per-subject content work, still highlights drills as a feature without polluting subject tabs.

---

## If Option B chosen — implementation
1. Add `'drills'` to the `allTabs` array in `_renderHome` tab builder
2. Add a `state.subjectFilter === 'drills'` branch that calls `_buildDrillRow()` for all drills
3. Remove drills from `#flash-drill-wrap` entirely (they render in the main `list`)
4. Update `_renderFlashDrills` to be a no-op (drills only render in the drills tab)

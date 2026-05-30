# Session: PENDING — App Navigation Overhaul

**Priority:** 2
**Type:** Code / Design
**Est. Duration:** 4–5 hours
**Tasks:** P2-T043, P2-T041 (partial), P2-T042 (app shell portion)
**Trigger:** "start the session"
**Depends on:** P2-T041 streak word decision confirmed by user before this session starts

---

## Objective

Transform the app's navigation from a generic web-app bottom bar into a premium, native-feeling experience:
- Remove bottom nav entirely
- All navigation from a top-right drawer (☰ → slide-in panel)
- Current/Last week: vertical swipe snap
- Subject sets within a week: horizontal swipe snap
- "Streak" replaced with confirmed replacement word throughout the app
- Fixed framework — content slides, shell never moves

---

## Pre-session Requirement

**User must confirm the replacement word for "streak" before this session runs.**
Options: Run / Habit / Flow / Chain (see P2-T041).
Once confirmed, this session executes the rename + full navigation overhaul in one pass.

---

## Steps

### Step 1: Streak word replacement (30 min)
Replace all user-visible "streak" strings with the confirmed word.
Internal function names (`updateStreak`, `loadStreak`, localStorage keys) stay unchanged.
Files: app-home.js, app-quiz.js, app-drill.js, app-core.js, screen-home.html, screen-result.html, screen-landing.html.

### Step 2: Remove bottom nav (20 min)
Delete `.bottom-nav` section from screen-home.html.
Remove `.bottom-nav`, `.bnav-*` CSS from styles-app.css.
Remove bottom nav JS (`_navPractice()`, `_setSubjectFilter('gk')` onclick wires) — move these to drawer.

### Step 3: Add drawer trigger to header (20 min)
Add ☰ button left of avatar ring in screen-home.html.
Wire `_openDrawer()` in app-home.js.

### Step 4: Navigation drawer (60 min)
New inline drawer in screen-home.html (not a separate fetch — it's always available in the home screen):
```
[ ╳ ]
[ ⚡ Flash Drills  ]
[ 📖 Practice      ] ← current, highlighted
[ 🌍 Today's GK   ]
[ ⚙️ Settings      ]
```
CSS: fixed right panel, slide-in animation, overlay backdrop.

### Step 5: Vertical week snap container (60 min)
Wrap home content in scroll-snap container.
Week label indicator (pill) updates as user scrolls between weeks.
"This week" / "Last week" / "2 weeks ago" as snap points.

### Step 6: Horizontal subject card track (60 min)
Within each week snap point, subject sets as horizontal scroll-snap cards.
Each card = one subject's weekly sets (Math sets, Science sets, etc.).
Small left-right swipe indicator at edges.

### ✅ Commit after each step

---

## Hand-off

After this session: P2-T038 (feature gating + trial) in its own session.

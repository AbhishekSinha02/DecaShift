# Session: PENDING — UI Overhaul Phase 1 — App Shell + Avatar + Grade Visible

**Priority:** 1  (ELEVATE ABOVE ALL OTHER PENDING SESSIONS)
**Type:** Code / Visual Design
**Est. Duration:** 3–4 hours (2 sessions)
**Tasks:** P1-T014, P1-T017, P1-T016 (partial)
**Trigger:** "start the session" — this is now Priority 1

---

## Objective

Make the app feel like a premium product in the first 10 seconds of opening.
Fix the three structural UX failures: no persistent chrome, grade invisible, avatar fake.

---

## Session A (~2 hours): App Shell Architecture (P1-T014)

### Step 1 — Fixed header HTML
Replace `home-header` div with `<header class="app-header">`:
- Logo (icon.svg) + brand name "Donnibo"
- Grade chip: "Grade 7" rendered by `_renderHeaderMeta()`
- City chip: "📍 Pune" if city known
- Avatar in top-right (40px)

### Step 2 — Streak bar (sticky)
Collapse current `home-dashboard` into a single sticky `streak-bar` div:
- 🔥 streak count (large, bold)
- Accuracy % (colored)
- Session count
- Height: 44px, sticky below header

### Step 3 — Subject tabs sticky
Add `position: sticky; top: 96px` to `.subject-tabs` (header 52px + streak bar 44px)

### Step 4 — Scrollable content wrapper
Wrap `flash-drill-section` + `goals-list` in `<div class="home-content">`:
- `margin-top: 96px` (header + streak bar)
- `padding-bottom: 100px` (space for city strip + bottom nav)

### Step 5 — Bottom nav (fixed)
New `<nav class="bottom-nav">` fixed at bottom:
- ⚡ Drills (opens drill picker or starts tables)
- 📖 Practice (scrolls to goals list)
- 🌍 GK (sets subjectFilter = 'gk')
- 👤 Me (opens settings)

### Step 6 — City strip
`<div class="city-strip">` fixed above bottom nav:
- Reads `user.city` or defaults to blank
- Shows partner from `data/city-partners.json` if exists

### Step 7 — CSS
Add all new layout rules. Test at 375px, 768px, 1280px.

### Step 8 — Commit
```
feat(P1-T014): app shell — fixed header, sticky streak+tabs, bottom nav
```

---

## Session B (~2 hours): Avatar + Grade + Premium Polish (P1-T017 + P1-T016 partial)

### Step 1 — Styled avatar with streak ring (P1-T017)
Replace `<div class="user-avatar">` with SVG ring + gradient initial.
`_renderAvatar()` function: name-keyed gradient, ring fills per streak week.
Avatar toggle (ds_avatar) actually shows/hides now.

### Step 2 — Grade visible
`_renderHeaderMeta()`: renders "Grade 7 · Pune" in header.
Also: small grade badge under avatar in bottom nav "Me" tab.

### Step 3 — Today card
Above the day-cards grid: "Today's Mission" card showing:
- Day number + subject + progress bar (questions done / total)
- Single CTA button: Continue / Start

### Step 4 — Stats mini-cards
Replace plain stat numbers with colored mini-cards (3-up grid):
- 🎯 Accuracy: XX% — green if >70, amber if >50, red otherwise
- 📊 Sessions: N — blue
- ⏱ Practiced: Xh Ym — accent

### Step 5 — Button + card quick polish
- All `.btn-primary` → gradient + shadow (5-line CSS change)
- Day cards → left border colored by subject + completion state
- Answer cards → letter label as pill (A/B/C/D colored circles)

### Step 6 — Commit
```
feat(P1-T017, P1-T016): avatar ring, grade chip, today card, stats mini-cards, card polish
```

---

## Success Criteria

After both sessions:
- [ ] Brand logo visible on home screen at all times
- [ ] Grade chip "Grade 7" visible in header
- [ ] City "📍 Pune" visible in header (if known)
- [ ] Streak bar always visible (doesn't scroll away)
- [ ] Subject tabs always visible (doesn't scroll away)
- [ ] Bottom nav accessible without scrolling
- [ ] Avatar shows styled initial + streak ring (not flat grey circle)
- [ ] Avatar toggle actually works (hides/shows)
- [ ] "Today's Mission" card at top of content
- [ ] Stats are colored mini-cards, not plain numbers
- [ ] Zero regressions on quiz, drill, result, settings flows

---

## Hand-off to Next UI Session

After Phase 1: run PENDING-ui-overhaul-phase2.md
Phase 2 covers: full visual design system (P1-T015) — typography scale,
card gradients, answer card animations, streak milestone celebration.

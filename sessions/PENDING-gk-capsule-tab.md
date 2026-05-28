# Session: PENDING — Daily GK Capsule + GK Subject Tab (P2-T032)

**Priority:** 2
**Type:** Code
**Est. Duration:** 1.5 hours
**Task:** P2-T032
**Trigger:** "start the session" (Priority 2 in pending queue)
**Depends on:** P2-T031 Flash Drill done (GK bank file must exist from 1:30 PM session)

---

## Objective

Add the reflective Daily GK mode (with explanations after each answer), the "Today in India" fact card, the monthly Current Affairs pack, and a GK subject tab on the home screen.

---

## Context

- Flash Drill (P2-T031) has the speed GK mode (5 questions, no explanation) — that's already live
- This task adds the reflective version with explanations + the GK tab on home screen
- GK bank (`questions/flash/gk-bank.json`) was generated in the 1:30 PM session
- Full spec in: `tasks/P2-T032-daily-gk-capsule-current-affairs.md`
- The GK tab goes between the existing subject tabs (Math, Science, etc.) and All

---

## Execute In This Order

### Step 1 — Pre-flight
```bash
git log --oneline -3    # confirm Flash Drill committed
ls questions/flash/     # confirm gk-bank.json exists
```

### Step 2 — Read full spec
Open `tasks/P2-T032-daily-gk-capsule-current-affairs.md` and execute.

### Step 3 — HTML changes
- Add GK tab to subject tab strip (`app/ui/index.html`)
- Add "Today's GK" card markup to home screen (below Flash Drill section)
- Add "Today in India" fact card markup (shown after GK completion)
- Add Current Affairs pack card markup

### Step 4 — JS changes (`app/ui/app.js` or `app-home.js` post-split)
- `_renderGKTab()` — GK tab content
- `_startDailyGK()` — opens reflective 5-question session with explanations
- `_getGKRotationWeek()` — returns current week's topic from gk-bank.json
- `_getTodayFact()` — date-keyed fact from today-in-india.json (if file exists)
- `_renderCurrentAffairsPack()` — shows monthly pack card
- GK completion → marks today as active in streak

### Step 5 — CSS changes
- GK tab style (matches existing subject tabs)
- Today's GK card style (distinct from quiz goal cards)
- Fact card style (warm, newspaper-feel)

### Step 6 — Create today-in-india.json stub
`questions/gk/today-in-india.json` — minimum 10 date-keyed facts to test the feature.

### Step 7 — Test in browser
- GK tab visible and clickable
- Daily GK shows today's 5 questions with explanations
- Completion updates streak
- Fact card shows after completion

### Step 8 — Commit
```bash
git add app/ui/ questions/gk/
git commit -m "feat(P2-T032): daily GK capsule + GK subject tab"
git push origin main
```

---

## Success Criteria
- [ ] GK tab visible in subject strip
- [ ] Daily 5 GK questions show with explanations after each answer
- [ ] Today in India fact card shows after GK completion
- [ ] GK completion updates daily streak
- [ ] Committed and pushed

## Hand-off
After this: Priority 3 (PWA install prompt) or Priority 1 (restructure) depending on queue order.

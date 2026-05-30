# Feature: Flash-Drill Mode — Tables, Squares, Cubes, Formulas, GK

**Priority:** P2 | **Type:** Core Learning / Retention | **Complexity:** M | **Status:** ✅ Done — 2026-05-28 · commit f59c60e

> A parent's top complaint to every school teacher: "My child doesn't know their
> multiplication tables. They count on fingers for 7×8. They forgot the square of 13
> the week after I drilled them." This is not a content problem. It is a practice format
> problem. A quiz is too slow for memorisation. Speed drills are how the brain locks in
> number facts. This task builds the speed drill engine.

---

## Why This Exists — Tied to 5K User Goal

**Word of mouth from parents is the only growth channel at ₹0 budget.**
Parents share what solves their actual pain. Their #1 expressed pain is:
*"My child doesn't know their tables / squares / cubes / formulas."*

Not: "My child needs concept understanding."
Not: "My child needs NCERT-aligned practice."

**Tables. Squares. Cubes. Formulas. GK. Forgotten every week. That is the pain.**

A Flash-Drill session takes 2–3 minutes. The parent can set it as a morning routine before
school. When the child improves their time from 3:20 to 1:45 in two weeks, the parent
sends a screenshot to every parent group they are in. That is the word-of-mouth moment.

**Decision filter check:**
- Moves toward 5K users? ✅ Solves the #1 parent pain point — direct word-of-mouth driver
- Fixes F1 (content)? ✅ Partial — Flash-Drill content is lightweight and reusable across all grades
- Creates shareable moment? ✅ "Personal best: 1:45" — parent screenshots this
- Works on ₹8,000 Android phone on 4G? ✅ No images, no network — pure text + timer

---

## The Five Drill Banks

Every drill bank is a static JS array — no JSON file fetch, no network dependency.
Loads instantly. Works offline.

### Bank 1 — Multiplication Tables (2×–20×)

```
Full table drill: user sees "7 × 8 = ?" and types/selects answer
Speed drill: 20 questions, random from 2–12 range, 60-second timer
Mastery: complete 2–12 tables with 100% accuracy in under 2 minutes
```

### Bank 2 — Squares (1²–25²)

```
1²=1, 2²=4, 3²=9 ... 20²=400, 21²=441 ... 25²=625
User sees "17² = ?" — 4 options shown — selects fast
Speed drill: 15 questions, random, 60-second timer
Mastery: all 1–20 squares with 90%+ accuracy
```

### Bank 3 — Cubes (1³–15³)

```
1³=1, 2³=8, 3³=27 ... 10³=1000, 11³=1331 ... 15³=3375
User sees "7³ = ?" — 4 options — selects fast
Speed drill: 10 questions, 45-second timer
Mastery: all 1–10 cubes with 90%+ accuracy
```

### Bank 4 — Formula Cards (by Grade + Subject)

Formulas are shown as **show → recall → test** — not pure speed.

```
Step 1: Flash the formula card (5 seconds display)
        "Area of a triangle = ½ × base × height"

Step 2: Hide the formula — show the question
        "What is the formula for the area of a triangle?"
        A) ½ × b × h   B) b × h   C) 2 × b × h   D) ½ × b + h

Step 3: User selects — instant feedback
```

Formulas organised by grade:
- **Grade 5–6:** Perimeter, Area (square, rectangle, triangle, circle)
- **Grade 7–8:** Volume, Surface area, Algebraic identities
- **Grade 9–10:** Trigonometry ratios, Coordinate geometry, Laws (physics)
- **Grade 11–12:** Calculus basics, Probability, Chemistry equations

Formula bank is a JSON file per grade — extensible by content.

### Bank 5 — General Knowledge Capsule (5 questions daily)

```
Topics rotate weekly:
Week 1: Indian Geography (states, capitals, rivers, mountains)
Week 2: World Geography (countries, continents, oceans)
Week 3: Indian History (independence movement, rulers, events)
Week 4: Science facts (inventions, discoveries, body systems)
Week 5: Current Affairs (monthly pack — 30 fixed questions for the month)
Week 6: Sports & Awards (India-relevant)
→ repeats from Week 1
```

Each day: 5 GK questions from that week's topic. Same 5 questions for everyone on the same day
(date-seeded random from that week's pool). This creates a "today's GK" moment — students
in the same school all answer the same 5 questions. Shareable.

---

## The Flash-Drill Screen

### Entry Point

On the home screen, below the subject tabs:

```
┌─────────────────────────────────────┐
│  ⚡ Flash Drills                      │
│  Quick 2-min sessions for memory    │
│                                     │
│  [×] Tables  [²] Squares  [³] Cubes │
│  [∫] Formulas    [🌍] Today's GK    │
└─────────────────────────────────────┘
```

Tap any pill → opens that drill instantly.

### Drill Screen (Tables example)

```
┌─────────────────────────────────────┐
│  ⚡ Tables Drill        ⏱️ 0:47      │
│  ████████████░░░░   12 / 20         │
│                                     │
│           7 × 8 = ?                 │
│                                     │
│  ┌────────┐  ┌────────┐             │
│  │  54    │  │  56    │  ← correct  │
│  └────────┘  └────────┘             │
│  ┌────────┐  ┌────────┐             │
│  │  48    │  │  63    │             │
│  └────────┘  └────────┘             │
│                                     │
│  Personal Best: 1:52 🏆             │
└─────────────────────────────────────┘
```

No submit button. Tap the answer → immediate feedback (green/red flash, 0.3s) → next question.
The timer never stops. Speed is the mechanic.

### Drill Result Screen

```
┌─────────────────────────────────────┐
│  ⚡ Tables Drill Complete!           │
│                                     │
│     20 / 20  ✅  Time: 1:45         │
│                                     │
│  🏆 New Personal Best! (was 1:52)   │
│                                     │
│  Accuracy: 100%                     │
│  Avg per question: 5.2 seconds      │
│                                     │
│  Missed: None this session 🎉       │
│                                     │
│  [Try Again]  [Share Result]        │
└─────────────────────────────────────┘
```

**[Share Result]** generates a plain text card:
```
⚡ Tables Drill · Donnibo
Score: 20/20 in 1:45 🏆 Personal Best
Try it: donnibo.in
```
Copies to clipboard → parent pastes in WhatsApp group. That is the word-of-mouth trigger.

---

## Personal Best Tracking

Per drill type, stored in localStorage:

```js
const DRILL_RECORDS = {
  'tables': { bestTime: 112, bestAccuracy: 1.0, sessionsCompleted: 14 },
  'squares': { bestTime: 78, bestAccuracy: 0.93, sessionsCompleted: 6 },
  'cubes': { bestTime: null, bestAccuracy: null, sessionsCompleted: 0 },
  'formulas-grade5': { bestTime: null, bestAccuracy: null, sessionsCompleted: 0 },
  'gk-today': { lastCompletedDate: '2026-05-28', score: 4 }
};
```

Personal best shown prominently during and after each drill.
The "New Personal Best!" moment is the shareable event.

---

## How This Ties to Streaks

Flash drills count toward the daily streak — same as regular quiz sessions.
A day where the child only does the 5-question GK drill still maintains the streak.
This is intentional: the lowest-friction possible action keeps the habit alive.

The streak counter on the home screen includes a drill tag:
```
🔥 7 days   (5 quiz sessions · 2 GK drills this week)
```

---

## Progression Unlocks (Gamification Layer)

| Achievement | Condition | Reward |
|---|---|---|
| "Lightning" badge | Tables drill under 90 seconds | Badge on profile |
| "Number Power" badge | All squares 1–20 mastered | Badge + avatar expression |
| "Cube Master" badge | All cubes 1–10 with 90%+ accuracy | Badge |
| "Scholar" badge | 30-day GK streak | Badge + avatar stage nudge |
| "Formula Hero" badge | Full grade formula bank completed | Badge |

Badges link to P3-T005 (gamification badges). This task creates the drill engine; badges
are awarded by the existing badge system using drill completion events.

---

## Content — What to Build in This Task

**Tables bank:** JS array, inline in app.js — 20 questions per session, random subset of 2×–12×
**Squares bank:** JS array — 1²–25², 15 questions per session
**Cubes bank:** JS array — 1³–15³, 10 questions per session
**GK bank:** `questions/flash/gk-bank.json` — 180 questions (6 weeks × 30 questions per week)
**Formula banks:** `questions/flash/formulas-grade{N}.json` for grades 5, 6, 7, 8, 9, 10

Formula files are expandable by content contributors without code changes.

---

## Acceptance Criteria

### Drill Engine
- [ ] Flash-Drill section visible on home screen below subject tabs
- [ ] 5 drill type pills: Tables, Squares, Cubes, Formulas, Today's GK
- [ ] Each pill opens the drill screen immediately (no loading state — content is inline or cached)
- [ ] Drill screen: question text large, 4 answer tiles full-width, timer running
- [ ] Tap answer → immediate green/red flash (no submit button) → next question auto-loads
- [ ] Timer never pauses between questions
- [ ] "Personal Best" shown during drill if one exists

### Results
- [ ] Drill result screen shows score, time, accuracy, missed questions
- [ ] "New Personal Best!" shown when time improves
- [ ] [Share Result] button copies plain-text result card to clipboard
- [ ] [Try Again] restarts with a new shuffled question set

### Personal Best Tracking
- [ ] Personal best stored per drill type in `localStorage` under `ds_drill_records`
- [ ] Best time, best accuracy, sessions completed tracked
- [ ] GK: tracks last completed date + score (max 1 per day)

### Today's GK
- [ ] 5 questions per day, date-seeded from weekly topic bank
- [ ] Same 5 questions for all users on the same date (seeded by `YYYY-MM-DD`)
- [ ] After completing today's GK, shows "Come back tomorrow for new questions"
- [ ] Completion counts toward daily streak

### Content
- [ ] Tables bank: 2×–12× full coverage (inline JS, no fetch)
- [ ] Squares bank: 1²–25² (inline JS)
- [ ] Cubes bank: 1³–15³ (inline JS)
- [ ] GK bank: minimum 6 weeks × 30 = 180 questions in `questions/flash/gk-bank.json`
- [ ] Formula banks: Grade 5–8 minimum (4 files) in `questions/flash/`

### Streak Integration
- [ ] Completing any Flash Drill (including GK) marks today as active in streak
- [ ] Streak home screen shows drill sessions alongside quiz sessions in weekly summary

### Mobile
- [ ] Drill screen readable and tappable at 375px width
- [ ] Answer tiles are minimum 48px touch target
- [ ] Timer visible at top without scrolling

---

## Files to Touch

- `app/ui/app.js` — drill engine: `_startDrill(type)`, `_renderDrillQuestion()`,
  `_submitDrillAnswer()`, `_showDrillResult()`, `_getDrillRecord()`, `_saveDrillRecord()`,
  `_getGKQuestionsForToday()` (date-seeded), `_generateShareCard()`
- `app/ui/index.html` — Flash Drill section on home screen; drill screen markup
- `app/ui/styles.css` — drill screen styles, answer tile green/red flash animation, personal best badge
- `questions/flash/gk-bank.json` — 180 GK questions (6 weekly topics × 30 each)
- `questions/flash/formulas-grade5.json` through `formulas-grade10.json`

## Dependencies

- P3-T001 (daily streak — done; drill completions feed the streak counter)
- P3-T005 (gamification badges — drill achievements emit badge events; badges rendered by P3-T005)
- P3-T004 (avatar growth — "Number Power" badge nudges avatar expression; avatar logic in P3-T004)

## Strategic Connection to 5K Goal

| Pain Solved | Parent Complaint | Drill Answer |
|---|---|---|
| Multiplication tables | "Counts on fingers at Grade 5" | Tables drill — 2 min morning routine |
| Squares / cubes | "Forgets every week" | Dedicated speed drill with personal best |
| Formulas | "Studies formula, forgets by exam" | Show → recall → test cycle |
| GK | "Not reading anything" | 5 daily questions, shared with classmates |
| Word-of-mouth | Nothing to share | Personal best card → WhatsApp group |

**This task directly fixes F7 (no virality) for the parent demographic.** The share card
is the first genuinely shareable artefact in the app.

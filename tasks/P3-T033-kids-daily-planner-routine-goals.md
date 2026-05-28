# Feature: Kids Daily Planner — Routine + Tasks + Donnibo Goals Unified

**Priority:** P3 | **Type:** Engagement / Retention / Habit | **Complexity:** M | **Status:** Pending

> The best EdTech apps do not win because they have better questions.
> They win because they become part of the child's day — indistinguishable
> from the daily routine itself. Duolingo wins because it sits between
> breakfast and school. Khan Academy loses because it is homework, not habit.
> The Daily Planner is how Donnibo moves from "app I use sometimes" to
> "part of how my day works." That is the retention engine.

---

## Why This Exists — Tied to 5K User Goal

**Retention is the 5K multiplier.** Acquiring a user costs nothing (word of mouth).
Keeping a user active past day 30 is what converts them to Pro. The biggest churn driver
is not content running out — it is the child having no reason to open the app on a day
they feel lazy. The planner gives them a reason: they have tasks to check off.

**The planner transforms Donnibo from a quiz app into a life tool.**
Parents do not pay ₹79/month for a quiz app. They pay for structure, discipline,
and visible progress in their child's day. A planner that a parent sets up and a child
follows — with Donnibo quiz time built in — is a product that parents advocate for.

**The planner is the parent layer (F10 fix).**
Parents want to be involved in their child's learning routine. The planner is the
first feature designed for the parent + child unit, not just the child. The parent
sets the template. The child checks off. The streak covers both.

**Decision filter check:**
- Moves toward 5K users? ✅ Transforms daily retention + creates parent advocacy
- Fixes F1 (content)? ❌ (separate issue)
- Creates shareable moment? ✅ "Perfect Week" badge — child shares with parent; parent shares with other parents
- Works on ₹8,000 Android phone on 4G? ✅ Planner is pure local state — zero network, works offline

---

## What the Planner Does

A child's day has structure that repeats every weekday. The planner makes that
structure visible, checkable, and rewarded. Donnibo practice sessions are built
into the planner as native tasks — not a separate "go to the app" step, but one
item in the same list as "brush teeth" and "complete homework."

### The Daily View

```
┌─────────────────────────────────────┐
│  📋 My Day — Thursday, 29 May       │
│  🔥 Streak: 7 days                  │
│                                     │
│  ☀️ Morning (0/3)                   │
│  ○ Wake up & get ready              │
│  ○ Breakfast                        │
│  ○ ⚡ Tables Drill (2 min)          │ ← Donnibo task
│                                     │
│  🏫 School (2/4)                    │
│  ✅ Attend all classes              │
│  ✅ Hand in homework                │
│  ○ Read one chapter (Hindi)         │
│  ○ Review today's notes             │
│                                     │
│  📚 Study Time (1/3)                │
│  ✅ 🌍 Today's GK (5 questions)    │ ← Donnibo task (done)
│  ○ 📖 Math: Fractions Set           │ ← Donnibo task
│  ○ Complete science worksheet       │
│                                     │
│  🌙 Evening (0/2)                   │
│  ○ Outdoor / Free play (30 min)     │
│  ○ Sleep by 10 PM                   │
│                                     │
│  Progress today: 3 / 12  ████░░░░  │
│  [Complete Day]                     │
└─────────────────────────────────────┘
```

### Four Time Blocks

| Block | Icon | What Goes Here |
|---|---|---|
| Morning | ☀️ | Wake-up routine, breakfast, morning drill |
| School | 🏫 | Attendance, homework submission, class tasks |
| Study Time | 📚 | Donnibo practice, school reading, exercises |
| Evening | 🌙 | Play, family time, dinner, sleep |

Donnibo tasks (drills, quiz sets) appear in the planner with their own icon and open
directly in the app when tapped — same session, no navigation.

---

## The Template System

### Parent Sets the Template (One-Time Setup)

On first access to the Planner, a setup flow runs:

```
Step 1: Who is setting up?
        ○ I am the parent / guardian
        ○ I am the student (setting up myself)

Step 2: Choose a starter template:
        ○ School weekday (Mon–Fri)
        ○ Weekend (Sat–Sun)
        ○ Exam week (intensive)
        ○ Summer holiday

Step 3: Customise tasks:
        Add / remove / rename tasks in each time block
        Set Donnibo goal: [Daily GK] [Flash Drills] [Math Set] [All three]

Step 4: Set days to repeat:
        ✅ Monday  ✅ Tuesday  ✅ Wednesday  ✅ Thursday  ✅ Friday
        ○ Saturday  ○ Sunday
```

The template auto-generates each day from the saved configuration.
Parent can edit any individual day (override for holidays, exams, events).

### Starter Templates (Built-in)

**School Weekday (Default):**
- Morning: Wake up, Breakfast, Flash Drill (2 min)
- School: Attendance, Homework submitted
- Study Time: Today's GK, Quiz Set (Grade-appropriate), Reading (20 min)
- Evening: Outdoor play, Sleep by 10 PM

**Exam Week:**
- Morning: Wake up, Breakfast, Formula Cards (5 min), GK Drill
- Study Time: 2× Donnibo subject sets, Revision from textbook, Practice paper
- Evening: Relaxation (no phone), Sleep by 9:30 PM

**Summer Holiday:**
- Morning: Wake up, Outdoor play, Breakfast
- Midday: Donnibo practice (30 min), Reading (any book), Creative activity
- Evening: Family time, Journaling (optional)

---

## Donnibo Tasks in the Planner

Donnibo tasks are a special type of task — they have a "launch" action instead of just a checkbox.

```
Types of Donnibo planner tasks:
- ⚡ Flash Drill (type: drill, drillType: 'tables' | 'squares' | 'cubes' | 'formulas')
- 🌍 Today's GK (type: gk)
- 📖 Quiz Set (type: quiz, subject: 'mathematics' | 'science' | etc.)
- 📰 Current Affairs (type: currentAffairs)
```

When a student taps a Donnibo task in the planner:
- App navigates directly to that drill / GK / quiz
- On completion, returns to the planner with that task auto-checked ✅
- No manual "mark as done" required for Donnibo tasks — completion is automatic

This is the key UX insight: **the planner and the app are one thing, not two.**
The student does not switch apps. The planner is the home screen extension.

---

## Habit Streaks — Unified with Quiz Streaks

The existing quiz streak (P3-T001) continues unchanged.
The planner adds a **"Planner Streak"** — days when the student completed 80%+ of their planned tasks.

Both streaks shown on home screen:
```
🔥 Quiz Streak: 7 days
📋 Planner Streak: 4 days
```

**Perfect Week badge:** Complete 80%+ of daily tasks every day Mon–Sun.
This is the "shareable moment" — parent sends "Arjun had a Perfect Week!" to school group.

---

## Badges and Rewards Integration

| Achievement | Condition | Badge |
|---|---|---|
| "First Day Done" | Complete all tasks on any one day | Bronze badge |
| "3-Day Planner" | 3 consecutive days 80%+ completion | Silver badge |
| "Perfect Week" | 7 consecutive days 80%+ | Gold badge + avatar expression |
| "Study Champion" | 30 days average 80%+ planner completion | Platinum badge |
| "Early Bird" | Morning block complete before 8 AM × 5 days | Special badge |

The Perfect Week badge is designed to be shared. When earned:

```
┌─────────────────────────────────────┐
│  🏆 Perfect Week!                   │
│  Arjun completed his full routine   │
│  every day this week.               │
│                                     │
│  Math · Science · GK · Hindi        │
│  7 days · 84 tasks completed        │
│                                     │
│  [Share]                            │
└─────────────────────────────────────┘
```

[Share] generates:
```
🏆 Perfect Week — Donnibo
Arjun had a perfect routine week!
84 tasks · 7 days · Grade 5, Pune

Try Donnibo: punekids.in
```

---

## Weekly Planner View (Future Extension)

The MVP delivers the daily view. The weekly view (Mon–Sun at a glance) is visible
but read-only in the MVP — showing completed vs. incomplete days with colour coding.
Full weekly editing is a follow-up task.

---

## Local Rewards Integration (P3-T032)

Planner completion milestones can trigger Reward Cards:

| Planner Achievement | Reward Card Trigger |
|---|---|
| "Perfect Week" badge earned | Reward Card issued (valid at all city partners) |
| 30-day planner streak | "Habit Champion" Gold Card issued |

This connects the planner directly to the local partner ecosystem — a child who
completes their routine earns real-world rewards. The parent sees tangible value.

---

## Data Schema

Planner data stored entirely in `localStorage` — no server, no network.

```js
// Template (set once by parent)
const plannerTemplate = {
  weekdays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  blocks: {
    morning: [
      { id: 't1', label: 'Wake up & get ready', type: 'routine' },
      { id: 't2', label: 'Breakfast', type: 'routine' },
      { id: 't3', label: 'Tables Drill', type: 'donnibo', drillType: 'tables' }
    ],
    school: [
      { id: 't4', label: 'Attend all classes', type: 'routine' },
      { id: 't5', label: 'Hand in homework', type: 'routine' }
    ],
    study: [
      { id: 't6', label: "Today's GK", type: 'donnibo', subtype: 'gk' },
      { id: 't7', label: 'Math Quiz Set', type: 'donnibo', subtype: 'quiz', subject: 'mathematics' }
    ],
    evening: [
      { id: 't8', label: 'Outdoor / Free play (30 min)', type: 'routine' },
      { id: 't9', label: 'Sleep by 10 PM', type: 'routine' }
    ]
  }
};

// Daily state (generated from template each day, overrideable)
const plannerDay = {
  date: '2026-05-29',
  tasks: [
    { id: 't1', completed: true, completedAt: '2026-05-29T06:45:00Z' },
    { id: 't6', completed: true, completedAt: '2026-05-29T17:10:00Z', donniboCreditedSession: 'sess_abc' }
  ]
};
```

`localStorage` key: `ds_planner_template` + `ds_planner_day_{YYYY-MM-DD}`

---

## Acceptance Criteria

### Planner Entry Point
- [ ] Planner tab or button accessible from home screen (e.g., bottom nav or home card)
- [ ] On first access: template setup flow (4 steps: who, template, customise, days)
- [ ] 3 starter templates available: School Weekday, Exam Week, Summer Holiday
- [ ] Parent can add, remove, rename tasks in any block

### Daily View
- [ ] Today's tasks shown in 4 blocks: Morning, School, Study Time, Evening
- [ ] Routine tasks: tap to toggle checked/unchecked
- [ ] Donnibo tasks: tap opens the relevant drill/quiz in-app; auto-checks on completion
- [ ] Progress bar shows X/Y tasks completed
- [ ] Date and day of week shown at top

### Donnibo Task Integration
- [ ] Flash Drill task → opens drill screen → auto-checks on drill completion
- [ ] GK task → opens Daily GK → auto-checks on completion
- [ ] Quiz Set task → opens quiz for selected subject → auto-checks on session end
- [ ] Planner completion fires even if user completes Donnibo tasks from home screen (not planner)

### Streaks and Badges
- [ ] Planner Streak: increments when 80%+ of day's tasks completed
- [ ] "First Day Done" badge on first 100% completion day
- [ ] "Perfect Week" badge on 7 consecutive 80%+ days
- [ ] Perfect Week share card generated with [Share] button

### Reward Card Integration
- [ ] Perfect Week achievement triggers Reward Card (calls same `_checkRewardMilestones()` from P3-T032)
- [ ] 30-day planner streak triggers "Habit Champion" Gold Card

### Data Persistence
- [ ] Template saved to `localStorage` — survives browser close
- [ ] Daily state saved to `localStorage` keyed by date
- [ ] Past 30 days of planner state retained; older days cleared (storage hygiene)

### Mobile
- [ ] Full planner readable and usable at 375px width
- [ ] Touch targets on task checkboxes: minimum 44px
- [ ] Blocks collapsible on mobile to reduce scroll length

---

## Files to Touch

- `app/ui/app.js` — `_initPlanner()`, `_renderPlannerDay()`, `_renderPlannerBlock()`,
  `_togglePlannerTask()`, `_launchDonniboTask(task)`, `_savePlannerDay()`,
  `_checkPlannerStreak()`, `_checkPlannerBadges()`, `_renderPlannerSetup()`,
  `_sharePerfectWeek()`; hook Donnibo session completion to auto-check planner tasks
- `app/ui/index.html` — planner entry point (home card or bottom nav tab);
  planner screen markup; setup flow markup; Perfect Week celebration modal
- `app/ui/styles.css` — planner screen layout; time block styles (coloured headers);
  task checkbox styles; progress bar; Donnibo task special styling (highlighted row)

## Dependencies

- P3-T001 (daily streak — planner streak is a parallel streak; reuses streak increment logic)
- P2-T031 (Flash Drills — Donnibo drill tasks in planner launch drill engine)
- P2-T032 (GK Capsule — GK task in planner launches Daily GK)
- P3-T005 (gamification badges — Perfect Week, Study Champion badges registered here)
- P3-T032 (Reward Cards — Perfect Week + 30-day planner streak trigger reward cards)

## Strategic Connection to 5K Goal

| Metric | Without Planner | With Planner |
|---|---|---|
| Day-30 retention | ~15% (industry avg quiz app) | Target 35%+ (habit loop, not just content) |
| Parent advocacy | "Nice quiz app" | "This is how my child structures their day" |
| F10 mitigation | No parent layer | Parent is the planner architect — invested |
| Revenue conversion | Content-dependent | Habit-dependent — user converts when streak matters |

**The planner is the structural reason to open the app on days when the child
doesn't feel like doing a quiz.** Habit is more durable than interest.
At 5,000 users, a 10% lift in Day-30 retention from the planner = 500 more
subscribers — without acquiring a single new user.

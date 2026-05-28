# Feature: Kids Long-Term Goals + Milestone Tracker

**Priority:** P3 | **Type:** Engagement / Growth / Motivation | **Complexity:** M | **Status:** Pending

> This is Pillar 4 of the **Donnibo Daily Loop** — the architecture that transforms
> Donnibo into the complete daily companion for school children.
> **Live** (Planner) · **Learn** (Quiz + Drills) · **Reflect** (Journal) · **Grow** (Goals ← this task)
>
> The quiz tells a child where they are today.
> The goal tells them where they are going.
> Without a destination, every day is just another quiz.
> With a goal, every day is a step toward something the child chose.

---

## Why Long-Term Goals Matter for 5K

**Goals convert casual users into committed ones.** A child who has set a goal —
"I will master all multiplication tables by June 30" — has made a promise to themselves.
Breaking a habit is easy. Breaking a goal you set yourself is harder. Goals create
psychological commitment that streaks alone cannot replicate.

**Goals give parents something to talk about with their child.**
"How is your fractions goal going?" is a conversation starter that "Did you do your
quiz today?" is not. Parents who are engaged in their child's goal journey are
subscribers who renew. Parents who only see a streak number are subscribers who churn.

**Goals create the most compelling word-of-mouth moment in the entire app:**
```
A child achieves their first goal.
The app shows a full-screen celebration: "You did it. You set a goal. You worked for it.
You achieved it. This is what growth feels like."
The child runs to show their parent.
The parent takes a photo of the screen.
The parent shares it in the school WhatsApp group.
```

**Decision filter check (5K goal):**
- Moves toward 5K users? ✅ Goals create the strongest shareable moment — achievement celebration is social currency
- Fixes F1 (content)? ❌ (separate concern)
- Creates shareable moment? ✅ Goal achievement screen — the most emotional moment in the app
- Works on ₹8,000 Android phone on 4G? ✅ Entirely local state — no network required

---

## What a Goal Looks Like

Goals are self-set, specific, and time-bound. The app provides templates; the child
picks one and personalises it or creates their own.

### Goal Templates (Starter Library)

**Academic Goals:**
- "I will complete the full Fractions concept arc by [date]"
- "I will maintain a 90%+ accuracy in Mathematics for 4 weeks"
- "I will learn all multiplication tables (2×–12×) with no mistakes"
- "I will score 80%+ in the Grade [N] weekly exam for 3 consecutive weeks"
- "I will complete the entire Science unit on [topic] by [date]"

**Habit Goals:**
- "I will maintain a 30-day quiz streak"
- "I will journal every day for 21 days"
- "I will complete my daily planner routine for 4 weeks"
- "I will do a Flash Drill every morning for 14 days"

**Knowledge Goals:**
- "I will complete the May 2026 Current Affairs pack"
- "I will learn 100 new GK facts this month"
- "I will master squares of numbers 1–20"
- "I will finish the French language set for Grade [N]"

**Personal Goals (free-form):**
- "I will [child writes their own goal]"
- Optional: child draws or types a picture of what achieving this goal means to them

---

## The Goal-Setting Flow

### Step 1 — Choose or Create

```
┌─────────────────────────────────────┐
│  🌱 Set a New Goal                  │
│                                     │
│  [Academic]  [Habit]  [Knowledge]   │
│  [My Own Goal]                      │
│                                     │
│  Or pick from popular goals:        │
│  • Master multiplication tables     │
│  • 30-day quiz streak               │
│  • Complete Fractions concept arc   │
│  • Journal every day for 21 days    │
│                                     │
└─────────────────────────────────────┘
```

### Step 2 — Personalise

```
┌─────────────────────────────────────┐
│  Your Goal:                         │
│  "I will master multiplication      │
│   tables (2×–12×) with no mistakes" │
│                                     │
│  By when?                           │
│  [June 15, 2026]   (pick date)      │
│                                     │
│  Why does this matter to you?       │
│  [                               ]  │
│  (optional — helps on hard days)    │
│                                     │
│  [Set This Goal]                    │
└─────────────────────────────────────┘
```

The "Why does this matter?" field is stored and shown on the goal card during hard days:
```
On a day the child skips the drill:
"Remember why you set this goal:
'Because I want to stop counting on fingers in class'"
```

### Step 3 — Milestone Breakdown

The app breaks the goal into 4–6 weekly milestones automatically:

```
Goal: Master multiplication tables by June 15

Week 1 (by May 8):  Tables 2× and 3× — 100% accuracy in drill
Week 2 (by May 15): Tables 4× and 5× — 100% accuracy
Week 3 (by May 22): Tables 6× and 7× — under 2 minutes for both
Week 4 (by May 29): Tables 8× and 9× — under 2 minutes for both
Week 5 (by June 7): Tables 10×, 11×, 12× — 100% accuracy
Week 6 (by June 15): Full 2×–12× drill — under 3 minutes, 100% accuracy
```

Each milestone is auto-verified when the child completes the relevant drill/set
with the required score. Manual verification available for goals the app cannot
auto-check (e.g., "read 1 chapter per day").

---

## The Goal Card on Home Screen

Each active goal shows a card on the home screen:

```
┌─────────────────────────────────────┐
│  🎯 Master Multiplication Tables    │
│                                     │
│  ████████░░░░░░░░  Week 3 of 6      │
│  Due: June 15 · 18 days left        │
│                                     │
│  Last activity: Tables 6× ✅ 98%   │
│  Next: Tables 7× drill              │
│                                     │
│  [Continue]  [View Milestones]      │
└─────────────────────────────────────┘
```

[Continue] launches the relevant drill/quiz immediately — no navigation needed.
[View Milestones] shows the full 6-week breakdown with status.

Maximum 3 active goals at a time — children who set too many goals complete none.
Free users: 1 active goal. Pro users: up to 3 active goals. Clear Pro upsell.

---

## Goal Achievement — The Emotional Peak

When a child completes all milestones and the goal is achieved:

```
┌─────────────────────────────────────┐
│                                     │
│  🏆                                 │
│                                     │
│  You Did It.                        │
│                                     │
│  Goal Achieved:                     │
│  "Master Multiplication Tables"     │
│                                     │
│  Started: May 1 · Achieved: June 12 │
│  42 drill sessions · 6 milestones   │
│                                     │
│  You set a goal.                    │
│  You worked for it every day.       │
│  You achieved it.                   │
│  This is what growth feels like.   │
│                                     │
│  [Add to Achievements]  [Share]     │
│                                     │
└─────────────────────────────────────┘
```

This is a full-screen takeover. The text is written to be read aloud — by the child,
or by the parent looking over their shoulder. Every word is intentional.
"This is what growth feels like." — that is the product positioning, lived in real time.

### [Share] generates:

```
🏆 Goal Achieved — Donnibo
"Master Multiplication Tables"
Arjun Sharma · Grade 5, Pune
42 sessions · 42 days

From counting on fingers to no mistakes.
That's what happens when you show up every day.

Try Donnibo: punekids.in
```

This is the most powerful shareable artefact in the entire app. It is not a quiz score.
It is a life moment. Parents share life moments.

---

## The Achievements Wall

Past completed goals live on a dedicated screen — "My Achievements":

```
┌─────────────────────────────────────┐
│  🏆 My Achievements                 │
│                                     │
│  🥇 Master Multiplication Tables    │
│     Achieved June 12, 2026          │
│     42 sessions · 42 days           │
│                                     │
│  🥈 30-Day Quiz Streak              │
│     Achieved May 30, 2026           │
│                                     │
│  🥉 Complete Fractions Arc          │
│     In progress — Week 2 of 4       │
│                                     │
│  [Start a New Goal]                 │
└─────────────────────────────────────┘
```

This is the growth record. A child who has 5 gold achievements after 6 months of
using Donnibo has a visible history of who they were becoming. That record is worth
more than any subscription — it is why they will not leave.

---

## Goals × Planner Integration

When a goal has a "next step" (e.g., "Do Tables 7× drill today"), it can be
**automatically added to tomorrow's Planner** Study Time block:

```
Planner suggestion:
📌 Continue goal: "Master Tables" → Tables 7× Drill (2 min)
[Add to my planner]  [Not today]
```

This creates a direct pipeline from goal → planner → action → achievement.
The four pillars of the Donnibo Daily Loop become one connected system.

---

## Acceptance Criteria

### Goal Setup
- [ ] Goals entry point on home screen (card or Grow tab in bottom nav)
- [ ] 4 goal categories: Academic, Habit, Knowledge, My Own
- [ ] 12+ goal templates across categories
- [ ] Personalisation: custom date picker, "Why this matters" field
- [ ] Free users: 1 active goal; Pro: 3 active goals (plan gate from P3-T028 pattern)

### Milestone Engine
- [ ] Every goal broken into 4–6 weekly milestones automatically
- [ ] Academic/Habit goals: milestones auto-verified from drill/quiz completion data
- [ ] Manual goals: child taps "Mark milestone done" with a confirmation step
- [ ] Missed milestone: deadline shown in red; no penalty — just visibility
- [ ] Completed milestone: green checkmark + celebratory micro-animation

### Goal Card on Home
- [ ] Active goal(s) shown on home screen as cards (below flash drills section)
- [ ] Card shows: goal name, week progress, days remaining, last activity, next step
- [ ] [Continue] launches relevant drill/quiz directly
- [ ] Up to 3 goal cards (Pro); 1 goal card (Free)

### Goal Achievement Screen
- [ ] Full-screen takeover when all milestones complete
- [ ] Text: "You Did It" + goal name + duration + session count + "This is what growth feels like"
- [ ] [Add to Achievements] saves to achievements wall
- [ ] [Share] generates formatted share text (copied to clipboard)
- [ ] Achievement saved with: goal name, achieved date, milestone count, session count

### Achievements Wall
- [ ] Dedicated screen showing all completed goals (gold badges)
- [ ] In-progress goals shown below completed ones
- [ ] Each completed goal shows: name, achieved date, session count
- [ ] [Share] available on each completed achievement

### Planner Integration
- [ ] When a goal has a "next step" drill/quiz, suggest adding to Planner Study block
- [ ] [Add to my planner] inserts the task for the next day
- [ ] Completing the planner task advances the goal milestone progress

### Content
- [ ] 12+ goal templates in `config/goal-templates.json`
- [ ] Milestone breakdown logic for each template type (academic, habit, knowledge)
- [ ] 52 weekly creative writing prompts (shared with P3-T034 journal)

---

## Files to Touch

- `app/ui/app.js` — `_renderGoalsHome()`, `_startGoalSetup()`, `_saveGoal()`,
  `_generateMilestones(goal)`, `_checkMilestoneProgress()`, `_showGoalAchievement()`,
  `_shareAchievement()`, `_renderAchievementsWall()`, `_suggestGoalToPlanner()`;
  hook drill/quiz completion events to `_checkMilestoneProgress()`
- `app/ui/index.html` — goals cards section on home; goal setup flow screens;
  achievement screen; achievements wall screen
- `app/ui/styles.css` — goal card styles; milestone progress bar; achievement
  full-screen styles (warm gold, celebratory); achievements wall badge grid
- `config/goal-templates.json` — 12+ goal templates with milestone structures

## Dependencies

- P2-T031 (flash drills — drill completion events auto-verify goal milestones)
- P3-T001 (daily streak — habit goals like "30-day streak" are directly measured)
- P3-T028 (plan gating — 1 goal free, 3 goals Pro)
- P3-T033 (planner — goals suggest tasks to planner; completing planner tasks advances goals)
- P3-T034 (journal — "Why this matters" connects to journal reflection on hard days)
- P3-T005 (gamification badges — "First Goal Achieved" badge; "3 Goals Completed" badge)
- P3-T032 (reward cards — first goal achievement can trigger a reward card)

## Strategic Connection — The Donnibo Daily Loop

This is Pillar 4 — **Grow**:

```
☀️ LIVE    → Planner (P3-T033): structure my day
📖 LEARN   → Quiz + Drills + GK (P2-T031/032): improve my knowledge
💭 REFLECT → Journal (P3-T034): process what I experienced
🌱 GROW    → Goals (this task): become who I want to be
```

**The moat this creates:** A child with active goals, a journal history, a planner routine,
and a quiz streak has all four pillars of their daily life in Donnibo. The switching cost
is no longer "₹79/month vs ₹0 for Khan Academy." It is:

"Do I want to lose my goal progress, my journal entries, my planner routine,
and my streak — all at once — to switch to a different app?"

Nobody makes that trade. That is the retention moat.

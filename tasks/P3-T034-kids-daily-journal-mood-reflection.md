# Feature: Kids Daily Journal — Mood Check-In, Reflection, Gratitude

**Priority:** P3 | **Type:** Engagement / Emotional Wellbeing / Retention | **Complexity:** M | **Status:** Pending

> This is part of the **Donnibo Daily Loop** — the four-pillar architecture that transforms
> Donnibo from a quiz app into the complete daily companion for school-going children.
> The four pillars are: **Live** (Planner) · **Learn** (Quiz + Drills) · **Reflect** (Journal) · **Grow** (Goals)
> See the strategic note at the bottom of this file.

---

## Why Journaling for Kids

A child who writes one sentence about what they learned today retains it 40% longer
than a child who simply answered questions. That is not an ed-tech claim — it is
basic cognitive science (elaborative encoding). The journal is not a diary. It is the
final step in the learning loop: input → practice → reflection → retention.

But the journal does something the quiz cannot: it gives the child a voice.

A quiz tells the child what they got right or wrong. The journal asks them what was
hard, what made sense, what they feel proud of. Over 30 days, the journal becomes a
record of who the child is becoming — not just what they scored. Parents who read
their child's journals do not cancel subscriptions. They upgrade.

**Decision filter check (5K goal):**
- Moves toward 5K users? ✅ Journaling creates daily engagement independent of quiz content — solves churn during content-thin days
- Fixes F1 (content exhaustion)? ✅ A journal entry requires zero question content — it is user-generated. Each entry is content the child created.
- Creates shareable moment? ✅ "My child wrote this today" — a parent sharing their child's journal entry is the most powerful word-of-mouth imaginable
- Works on ₹8,000 Android phone on 4G? ✅ Text-only, entirely local — no network required

---

## The Four Journal Modes (Adaptive by Grade)

The journal adapts its depth and prompts to the child's grade. Not announced — just naturally calibrated.

### Mode 1 — Mood Check-In (All Grades, 30 seconds)

The simplest possible entry. One tap + one word.

```
┌─────────────────────────────────────┐
│  How are you feeling today?         │
│                                     │
│  😊  😐  😴  😢  🤩                 │
│                                     │
│  (one tap — done)                   │
└─────────────────────────────────────┘
```

Five emoji options. Single tap. Mood logged with timestamp.
This runs as the first screen of the journal — completing it alone counts as a journal entry for that day.
It is low enough friction that a child who does nothing else still opens the journal.

Mood data is stored locally and shown as a 7-day emoji strip on the home screen:
```
This week: 😊 😊 😴 😊 😐 🤩 😊
```

Parents can see patterns over time. A child consistently choosing 😴 on Monday mornings
tells the parent something the child never said out loud.

### Mode 2 — Daily Reflection (Grade 2–5, ~2 minutes)

After mood check-in, 2 prompted questions. Short answers. No blank page.

```
Today's questions:
1. What did you learn today? (one sentence)
   [___________________________________]

2. What made you happy today? (one sentence)
   [___________________________________]

[Done]  [Add more]
```

Prompts rotate daily from a bank of 30+:
- "What was the hardest question you got wrong today? Why was it hard?"
- "What would you teach a friend from today's learning?"
- "What are you looking forward to tomorrow?"
- "Did anything surprise you today?"
- "Name one thing you understood better than you did last week."

### Mode 3 — Guided Reflection (Grade 6–8, ~3 minutes)

Three sections: Learn · Feel · Plan

```
📖 What I Learned Today
   [One concept or fact from today's quiz/drill]

💬 How I Feel About It
   [Easy / Still confusing / Want to know more]
   [Optional: write why]

📅 What I'll Do Tomorrow
   [One small goal or plan]
```

The "How I Feel About It" selector (Easy / Still confusing / Want to know more) is
a **learning signal** — if a child marks a topic as "still confusing" three days in a row,
the app can surface more questions on that topic the next day. This is feedback-driven
personalization with zero backend complexity.

### Mode 4 — Deep Journal (Grade 9–12, ~5 minutes)

Free text, structurally prompted:

```
📅 [Date]

🎯 Goal I worked on today:
   [                          ]

📊 Study summary:
   [What I practiced] · [Score] · [How I felt about it]

💡 Key insight:
   [One thing I understood differently today]

🙏 Gratitude:
   [One thing I am grateful for today]

🔜 Tomorrow's intention:
   [One thing I want to focus on]
```

This is closest to a traditional journal. Grade 11–12 users preparing for board exams
find the structure useful. It mirrors what coaching centres tell students to do (reflection
notebooks) — except Donnibo makes it a 5-minute habit built into their existing app.

---

## Gratitude Practice (All Grades — Optional Add-On)

After completing any journal mode, an optional "Gratitude" section appears:

```
┌─────────────────────────────────────┐
│  🙏 3 Things I'm Grateful For Today  │
│                                     │
│  1. [                             ] │
│  2. [                             ] │
│  3. [                             ] │
│                                     │
│  [Save]  [Skip]                     │
└─────────────────────────────────────┘
```

Gratitude practice is well-documented in child psychology research as reducing anxiety
and improving sleep quality. It takes 60 seconds. For a parent, this is one of the most
compelling features in the entire app — not because it improves quiz scores, but because
it improves their child's day.

**The gratitude entries are the most shareable content the child creates.**
A parent who reads "I am grateful for my mother who helps me when I don't understand fractions"
will forward that app to every parent they know.

---

## The 7-Day Mood Strip (Home Screen Widget)

```
┌─────────────────────────────────────┐
│  📔 My Week                         │
│  M  T  W  T  F  S  S               │
│  😊 😊 😴 😊 😐 🤩 😊             │
│                                     │
│  [Write Today's Entry]              │
└─────────────────────────────────────┘
```

Shown on the home screen. Updates daily after mood check-in.
Visible to the child as a pattern ("I'm always tired on Wednesday — that's my longest school day").
Visible to the parent as a window into emotional wellbeing.

---

## Journal Streak — Separate from Quiz Streak

```
🔥 Quiz Streak: 7 days
📔 Journal Streak: 4 days
```

The journal streak only requires a mood check-in (1 tap) to maintain.
This is intentionally low-threshold — the habit of opening the journal matters more
than the length of each entry.

On the "Perfect Month" achievement (30 days journal streak + quiz streak combined):
```
🏆 Perfect Month!
Arjun journalled and practised every day for 30 days.
This is what growth looks like.
[Share]
```

---

## Parent View (Read-Only)

A parent who is set up as a "guardian" for the account (future P4 feature, but data
is prepared from this task) can view:
- The mood strip (last 30 days)
- Journal entry text (child can mark individual entries as "private" — parent cannot see those)
- Gratitude entries (always visible to parent — children are rarely private about gratitude)
- Learning reflection ("still confusing" tags for topics)

This is the feature that answers F10 (school segment needs parents):
**The parent dashboard exists within the journal — not as a separate admin screen.**

---

## Creative Writing Prompt (Weekly — Grade 2–8)

Once per week (Saturday or Sunday), a Creative Prompt replaces the regular reflection:

```
🎨 Weekend Story Starter
"You find a door in your classroom that wasn't there yesterday.
You open it and step through..."

[Write your story]
[I'll skip this week]
```

Creative prompts rotate from a bank of 52 (one per week, annual cycle).
This is not graded, not evaluated — it is pure creative expression.
For parents, this is gold: a child's story starter response is the most
personal, imaginative piece of content they will ever share from an app.

**No other Indian EdTech app has this.** Byju's, Vedantu, Khan Academy — none.

---

## Acceptance Criteria

### Mood Check-In
- [ ] Journal entry point on home screen (card or bottom nav icon)
- [ ] 5 emoji mood options — single tap logs mood with date + time
- [ ] Mood logged to `localStorage` under `ds_journal_{YYYY-MM-DD}`
- [ ] 7-day mood strip shown on home screen, updates after each check-in
- [ ] Completing mood check-in alone counts as journal entry for the day (streak maintained)

### Daily Reflection (Grade-Adaptive)
- [ ] Grade 2–5: 2 prompted questions (short text input)
- [ ] Grade 6–8: 3-section Learn/Feel/Plan format
- [ ] Grade 9–12: 5-field deep journal (goal, summary, insight, gratitude, tomorrow)
- [ ] Prompts rotate from a pool (minimum 30 prompts per grade band)
- [ ] [Done] saves entry; [Add more] allows additional free text

### Gratitude Section
- [ ] Optional 3-field gratitude shown after reflection
- [ ] [Save] stores gratitude entries separately for potential parent view
- [ ] [Skip] dismisses — does not affect journal streak

### Journal Streak
- [ ] Journal streak tracked independently from quiz streak
- [ ] Mood check-in alone (1 tap) is sufficient to maintain journal streak
- [ ] Both streaks shown on home screen: "🔥 Quiz · 📔 Journal"

### Creative Prompt (Weekly)
- [ ] Saturday/Sunday: creative writing prompt replaces reflection
- [ ] 52 prompts in bank (one per calendar week, cycling annually)
- [ ] Text input, no word count limit, no evaluation
- [ ] [I'll skip this week] dismisses without affecting streak

### "Still Confusing" Signal
- [ ] Grade 6–8 journal: "How I Feel About It" selector (Easy / Still confusing / Want to know more)
- [ ] When "Still confusing" selected, topic stored in `user.confusedTopics`
- [ ] Next session: one additional question from that topic surfaced as warm-up (soft personalization)

### Content
- [ ] 30+ daily reflection prompts per grade band (minimum 90 prompts total)
- [ ] 52 weekly creative writing prompts
- [ ] All prompts in `config/journal-prompts.json`

### Privacy
- [ ] Child can mark any journal entry as "private" (lock icon)
- [ ] Private entries not included in any export or parent view
- [ ] Default: all entries visible (parent view is future P4 feature — data structure prepared now)

---

## Files to Touch

- `app/ui/app.js` — `_renderJournalHome()`, `_startJournalEntry()`, `_saveMoodCheckIn()`,
  `_saveReflection()`, `_saveGratitude()`, `_getJournalPromptForToday()`,
  `_checkJournalStreak()`, `_renderMoodStrip()`, `_isCreativePromptDay()`
- `app/ui/index.html` — journal card on home screen; journal screen with grade-adaptive sections;
  mood strip widget; 7-day mood emoji display
- `app/ui/styles.css` — journal screen styles; mood emoji selector; mood strip;
  journal entry card (warm, paper-like feel — distinct from quiz card style)
- `config/journal-prompts.json` — all prompts organised by grade band + creative prompts

## Dependencies

- P3-T001 (daily streak — done; journal streak is parallel, same increment pattern)
- P3-T033 (planner — planner has an "Evening Reflection" task that launches the journal;
  completing the journal auto-checks that planner task)
- P3-T005 (gamification badges — "30-day journal streak" badge; "First Creative Story" badge)
- P3-T032 (reward cards — 30-day combined streak triggers "Habit Champion" Gold Card)

## Strategic Connection — The Donnibo Daily Loop

This task is Pillar 3 of the **Donnibo Daily Loop**:

```
☀️ LIVE    → Planner (P3-T033): what am I doing today?
📖 LEARN   → Quiz + Drills (P2-T031/032): practise and improve
💭 REFLECT → Journal (this task): what did I learn? how do I feel?
🌱 GROW    → Goals (P3-T035): am I moving toward who I want to become?
```

No Indian EdTech competitor has all four pillars. Most have one (content delivery).
Some have two (content + streak). None have a journal. None have a goals system.
**The Donnibo Daily Loop is the moat.** Once a child's routine, learning, reflections,
and goals are all in Donnibo, the switching cost is not a pricing decision. It is a life decision.

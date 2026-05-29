# Donnibo — Delight Task Index

> **Goal:** Make every student feel smarter after every session. Make every parent see proof.
> **Cycle:** Pick one task. Build it. See it. Move to next.
> **Rule:** No task is "done" until you can feel the difference on the phone.

---

## How to Run a Delight Task

1. Read the task card (Goal, Build, UX Outcome, Delight Impact)
2. Say "start D-XXX" — Claude executes it
3. Test it on mobile
4. If it feels right → commit → next task
5. If it doesn't feel right → fix before moving

---

## Stack 1 — Delight Stack
*These are the quick wins. Do all 7 before anything else.*
*A kid who uses the app for 3 days should feel ALL of these.*

---

### D-001 · Personalized Morning Greeting
**Type:** Code · **Effort:** S (30 min) · **Depends on:** —

**Goal today (broken):**
Home screen opens with "Hello, Abhishek" + a generic list of content.
The app doesn't know you. It doesn't know what day it is in your journey.
It could be anyone's app.

**What we're building:**
Replace the generic greeting with a context-aware line at the top of home:
> *"Good morning, Aryan. Day 9 of your daily practice. Today: Linear Equations — final session for this topic."*

Or if they've already completed today:
> *"You're done for today, Aryan. Come back tomorrow for Geometry."*

Or on Day 1:
> *"Welcome, Aryan! Let's start your first day. Grade 7 Math is loaded and ready."*

**UX outcome:**
The app opens and immediately says something personal. Not a dashboard. Not a menu. A line that proves the app knows you.

**Customer delight:**
The first second matters most. A kid who opens the app and sees their name + their specific day + their specific topic feels like they're using something made for them. Generic apps don't do this. This one does. That's the whole difference.

---

### D-002 · Result Screen — Specific Win Message
**Type:** Code · **Effort:** S (1 hr) · **Depends on:** —

**Goal today (broken):**
Result screen shows: "7 / 10 — Good job!" with a badge.
That's a test score. It means nothing emotionally. The kid closes the app.

**What we're building:**
After every quiz, the top of the result screen shows one personalized insight:
- If accuracy improved: *"Your Linear Equations accuracy: 78% — up from 52% last week. That's real improvement."*
- If personal best: *"New personal best on this topic! 9/10 — you've never scored higher here."*
- If first session: *"First session on Linear Equations done. 7/10 is a strong start. You'll be better next time."*
- If struggled: *"5/10 today. Linear Equations is a tough one — but 3 sessions in, most students go from 50% to 80%. You're early."*

**UX outcome:**
The result screen has a human voice. It knows where you are. It doesn't just judge — it contextualizes.

**Customer delight:**
A kid who reads "that's real improvement" walks away feeling like the practice is working. A kid who reads "7/10" walks away feeling like they took a test. One of these makes them come back tomorrow. The other doesn't.

---

### D-003 · Result Screen — Accuracy Trend (This Week vs Last Week)
**Type:** Code · **Effort:** S (1 hr) · **Depends on:** D-002

**Goal today (broken):**
Result screen shows the score for this session only. No history. No trend. No proof that practice is working.

**What we're building:**
Below the win message, a simple two-line accuracy comparison:
```
This week:   ████████░░  78%
Last week:   ████░░░░░░  45%
```
With the delta: **↑ 33% improvement on Linear Equations**

If it's the first week, show: "First week — come back next week to see your improvement."

**UX outcome:**
The result screen now shows PROGRESS, not just performance. Before and after. Proof the habit is working.

**Customer delight:**
This is what a parent wants to see. This is what a student shows their parent. "Look, I went from 45% to 78% in Math." This is the screenshot that gets sent to the family WhatsApp group. This single graph is worth more than any feature we can build.

---

### D-004 · WhatsApp Share Card — Result
**Type:** Code · **Effort:** S (1 hr) · **Depends on:** D-002

**Goal today (broken):**
After a good quiz, there's nowhere for that feeling to go. No share. No output. The moment dies.

**What we're building:**
One "Share" button on the result screen. Tapping it generates a text card shared via navigator.share():

```
🏆 Aryan's Daily Practice — Day 9
Grade 7 · Linear Equations
Score: 9/10 · Accuracy this week: 87%
↑ from 45% when he started

12 days of daily practice on Donnibo
donnibo.app
```

Beautiful formatting. Parent-friendly language. One tap.

**UX outcome:**
Every good quiz result has an exit path that creates value outside the app.

**Customer delight:**
One parent who shares this to their school group creates 10 curious parents. That's the entire growth engine. No ads needed. No interns needed. Just a well-designed share card that parents are proud to forward.

---

### D-005 · "Beat Your Last Score" Challenge
**Type:** Code · **Effort:** XS (30 min) · **Depends on:** —

**Goal today (broken):**
Quiz starts with no context of previous attempts. It's always a fresh start with no stakes.

**What we're building:**
Before the first question, one line on the quiz screen:
- If previous session: *"Last time on Linear Equations: 7/10. Can you beat it today?"*
- If personal best already high: *"Your best on this topic: 9/10. Try to match it."*
- If first time: *"First time on Linear Equations. No pressure — just see where you are."*

**UX outcome:**
Every quiz has a micro-goal. Not just "answer 10 questions" — beat your last score.

**Customer delight:**
Self-competition is the cleanest motivation mechanic. No leaderboards needed. No friends needed. Just you vs your last score. It makes the same content feel fresh because the goal has changed.

---

### D-006 · Streak — Reward, Not Punish
**Type:** Code · **Effort:** S (1 hr) · **Depends on:** —

**Goal today (broken):**
Miss one day → streak resets to zero. 14 days of practice wiped. Devastating feeling.
This is the #1 reason habit apps lose users. Loss aversion kills the loop.

**What we're building:**
Two separate concepts:
1. **Current Run** — days practiced in a row (resets on miss, shown as 🔥 flame)
2. **Milestone Cards** — earned at 7, 14, 30 days. Once earned, NEVER taken away. Shown as permanent badges.

On a missed day, instead of silent reset: *"Your 14-day run ended. Start a new one today — your 14-day card is safe."*

**UX outcome:**
Missing a day feels like a fresh start, not a punishment. The earned cards stay. The student's identity as "someone who practices" is preserved.

**Customer delight:**
A kid who misses one day and sees their 7-day card still in their profile doesn't feel like a failure. They feel like someone who had a great week and is starting a new run. That's the difference between quitting and continuing.

---

### D-007 · Today Card — Visual Redesign
**Type:** UX · **Effort:** M (2 hr) · **Depends on:** D-001

**Goal today (broken):**
The Today section has two cards side by side — a small subject card and a small GK card. Both feel like UI elements, not content. There's no sense of importance. A kid glances at it and sees a form, not an invitation.

**What we're building:**
A full-width hero card that takes the first visible space below the subject tabs:

```
┌─────────────────────────────────────────────┐
│  📐 GRADE 7 MATHEMATICS           Day 4/5   │
│                                              │
│  Linear Equations                            │
│  "Solving for two variables"                 │
│                                              │
│  ████████████░░░░░░  78% accuracy            │
│                                              │
│         [ Start Today's Practice → ]         │
└─────────────────────────────────────────────┘
```

With the subject color as the left border. Day X/5 to show where you are in the week. Accuracy progress bar. One strong CTA button.

GK companion stays — compact, below or alongside.

**UX outcome:**
Opening the app feels like arriving somewhere specific, not opening a menu.

**Customer delight:**
The first 3 seconds on the home screen determine if a kid starts the quiz or closes the app. A hero card with their name, their subject, their progress, and one clear button is impossible to ignore.

---

## Stack 2 — Retention Stack
*Do these after all 7 Delight tasks are shipped.*
*These are what keep the student coming back in week 2 and week 3.*

---

### D-008 · "You're Ready for Next Level" Prompt
**Type:** Code · **Effort:** M (1.5 hr) · **Depends on:** D-002

**Goal today (broken):**
After every result screen: back to home. No sense of progression. Every session feels the same.

**What we're building:**
After 3+ sessions on a concept at 70%+ accuracy, the result screen shows:
> *"You've done Linear Equations 3 times. Your accuracy: 78%. You're ready to move on. Next up: Solving for Two Variables — want to start it?"*

With two buttons: **Start Next Topic →** and **Practice more here**

**UX outcome:**
The app guides the student's journey. They're not just picking from a menu — the app says "you're ready."

**Customer delight:**
The feeling of being told "you're ready for the next level" is one of the most motivating things a learning tool can do. It validates effort and creates forward momentum. This is what a good teacher does. Most apps don't.

---

### D-009 · Concept Progress on Netflix Rows
**Type:** Code · **Effort:** S (1 hr) · **Depends on:** —

**Goal today (broken):**
Netflix row label: "Linear Equations  8 sets"
No indication of how many you've done. No sense of progress within the concept.

**What we're building:**
Row label becomes: "Linear Equations  ⬤⬤⬤◯◯  3 of 8 done"

Filled circles = sessions completed. Empty = remaining.
Color of circles = subject color (blue for Math, green for Science).

**UX outcome:**
Every Netflix row now shows your progress inside it. Scrolling home is no longer looking at content — it's looking at YOUR progress in the curriculum.

**Customer delight:**
Circles to fill is one of the oldest motivation mechanics (think Pokédex, progress bars, achievement rings). A student who sees 3 filled and 5 empty circles on Linear Equations has an obvious reason to come back: finish the row.

---

### D-010 · Subject Accuracy on Tabs
**Type:** Code · **Effort:** S (1 hr) · **Depends on:** D-003

**Goal today (broken):**
Subject tabs are just labels: Math | Science | English
No at-a-glance indication of how you're doing in each subject.

**What we're building:**
Active tab shows: **Math 78%↑**
Inactive tabs show accuracy too but smaller: Science 62% | English 71%

On first use (no data): tabs show just the label, no accuracy.

**UX outcome:**
The tab bar becomes a dashboard. A parent can look at the subject tabs and know exactly how their child is doing across subjects without navigating anywhere.

**Customer delight:**
Parents love data at a glance. Students feel accountable when the number is visible. Both motivate behavior — parents ask "why is Science at 62%?" and students feel compelled to improve the lower number.

---

### D-011 · Quiz Animations — Celebratory Correct, Empathetic Wrong
**Type:** UX · **Effort:** M (1.5 hr) · **Depends on:** —

**Goal today (broken):**
Correct answer: card turns green. Wrong answer: card turns red.
That's it. Functional but emotionally flat. Getting something right should feel like a small win.

**What we're building:**
**Correct:** Brief scale-up animation on the correct card + a small particle burst + one-line positive text ("Sharp." / "Exactly right." / "Nailed it.") before showing the explanation.

**Wrong:** Card shows red but explanation starts with: *"This one trips most Grade 7 students — here's exactly why:"* — empathetic, not judgmental.

No sound by default (school setting). Optional in settings.

**UX outcome:**
Every question has an emotional beat. Getting something right feels rewarding. Getting something wrong feels like learning, not failing.

**Customer delight:**
Kids who feel good when they get things right practice more. Kids who feel ashamed when they get things wrong practice less. The tone of the wrong-answer explanation is the most important emotional design decision in the entire app.

---

### D-012 · "Your Best" Label on Concept Row
**Type:** Code · **Effort:** S (1 hr) · **Depends on:** D-009

**Goal today (broken):**
Concept rows show sessions done. No personal record visible.

**What we're building:**
Below the concept row label, if sessions have been done:
> *"Linear Equations · Your best: 9/10 · 3 sessions done"*

Clicking the row header (not a card) shows a small summary: total questions answered, average accuracy, best score.

**UX outcome:**
Personal records are visible at a glance. The home screen shows your history, not just available content.

**Customer delight:**
Personal records create identity. "I've done 3 Linear Equations sessions and my best is 9/10" is a fact about yourself that makes you want to protect it — and beat it. Records make content feel like personal history, not just tasks.

---

### D-013 · Empty State — Guidance Not Void
**Type:** Code · **Effort:** XS (30 min) · **Depends on:** —

**Goal today (broken):**
When a student finishes today's content: "Content loading…" or a blank area. Dead end.

**What we're building:**
Smart empty states:
- All today's content done: *"You're done for today, Aryan! 🎉 Come back tomorrow for Geometry. Meanwhile, try a Flash Drill to keep sharp."*
- No content for selected subject: *"Science content for this week loads Monday. Flash Drills and GK are ready now."*
- First login, no grade set: *"Set your grade in Settings and we'll load your personal curriculum."*

Each empty state has one specific next action button.

**UX outcome:**
No dead ends. Every state in the app has a clear next step.

**Customer delight:**
A confused user is a lost user. A kid who hits a blank screen closes the app. A kid who reads "you're done for today, come back tomorrow" knows exactly what to do — and is more likely to come back.

---

## Stack 3 — Trust Stack
*Do these after Stack 1 + Stack 2.*
*These are what make parents trust the app and students feel they're actually learning.*

---

### D-014 · Explanation Quality — Teaching Tone (Grade 7 Math W22)
**Type:** Content · **Effort:** L (content session) · **Depends on:** —

**Goal today (broken):**
Explanation after correct answer: "Correct! Subtract 5 from both sides: 3x = 15, x = 5."
That's confirming, not teaching. The student already knows they're correct.

**What we're building:**
Rewrite every explanation in W22 Math (the most-used current content) to:
1. Start with the principle, not the answer: *"The rule here: whatever you do to one side of the equation, do to the other. Always."*
2. Show the working clearly
3. End with a "remember this for next time" line: *"Watch for this in Q8 — same principle, just disguised."*

**UX outcome:**
Every explanation teaches something, not just confirms something.

**Customer delight:**
A student who reads an explanation and thinks "I didn't know that" will come back for more. A student who reads an explanation and thinks "I already knew that" will not. Teaching = trust. Confirming = indifference.

---

### D-015 · Wrong Answer — "Here's the Trap" Explanation
**Type:** Content · **Effort:** L (content session) · **Depends on:** D-014

**Goal today (broken):**
Wrong answer explanation: "The answer is B because [reason]."
No acknowledgment of why someone would pick the wrong answer. No empathy. No insight.

**What we're building:**
Every wrong-answer explanation follows a structure:
1. Name the trap: *"Most people pick A here — and here's why it looks right:"*
2. Explain the trap: *"Because you see '3x' and you think divide by 3 immediately. But that skips a step."*
3. Show the correct path: *"First subtract 5 from both sides. Now divide. That's the order."*
4. Close with the principle: *"Rule: clear the constant first, then the coefficient."*

**UX outcome:**
Getting something wrong teaches you more than getting it right. The wrong-answer moment becomes the highest-value learning moment in the session.

**Customer delight:**
"The app understood why I got it wrong." That is the most powerful thing an educational product can say. It creates the feeling of having a tutor, not taking a test. This is the single biggest differentiator from every competitor.

---

### D-016 · Weekly Parent Progress Share Card
**Type:** Code · **Effort:** M (1.5 hr) · **Depends on:** D-003, D-004

**Goal today (broken):**
Parents have no output from the app. They see their child using it but have no visible proof of progress.

**What we're building:**
In Settings > My Progress (new section), a "Share Week Summary" button that generates:

```
📊 Aryan's Week 22 Progress Report
Grade 7 — Donnibo Daily Practice

Math:        87% accuracy  ↑35% from Week 21
Science:     64% accuracy  ↑12% from Week 21
English:     71% accuracy  → steady

Days practiced: 5 of 7
Concepts covered this week: Linear Equations, Motion & Force

donnibo.app
```

Sharable via WhatsApp.

**UX outcome:**
Parents have a weekly summary they can send to the teacher or share with family. The app produces parent-relevant output without needing a separate parent account.

**Customer delight:**
A parent who receives this summary every week doesn't uninstall the app. A parent who has nothing from the app doesn't know if it's working. The weekly card is the parent retention mechanic.

---

### D-017 · Concept Mastery Tier Badge on Rows
**Type:** Code · **Effort:** M (2 hr) · **Depends on:** D-009, D-012

**Goal today (broken):**
Netflix rows show sessions done (⬤⬤⬤◯◯). No sense of mastery level. No achievement language.

**What we're building:**
Each concept row earns a tier badge based on sessions done + accuracy:
- 0 sessions: ○ **Not started**
- 1-2 sessions, <60%: 📖 **Learning**
- 1-2 sessions, 60%+: 📗 **Developing**
- 3+ sessions, 70%+: ⭐ **Solid**
- 5+ sessions, 85%+: 🏆 **Mastered**

Badge appears on the row label: "Linear Equations ⭐ Solid"

**UX outcome:**
The home screen becomes a mastery map. A student can see at a glance which concepts they own and which ones need work.

**Customer delight:**
Kids understand levels instinctively. Seeing "Mastered" next to a concept is a trophy. Seeing "Learning" next to another is a challenge. This is the Pokédex principle — completing the map becomes the meta-game of the entire app.

---

### D-018 · Flash Drill Personal Best — Real-Time Pressure
**Type:** Code · **Effort:** S (1 hr) · **Depends on:** —

**Goal today (broken):**
Flash Drill starts. Timer runs. You finish. You see "Done" with your time.
No comparison to last time. No target. No pressure to beat yourself.

**What we're building:**
During the drill, show your personal best in the corner: "PB: 1:42"
When you beat it: brief celebration animation + "New Personal Best! 🎯 1:38"
When you don't: "So close — 1:44. 2 seconds off your best."

**UX outcome:**
Every drill has a target. Every drill has stakes. Every drill result has emotional weight.

**Customer delight:**
Flash Drills are the fastest habit loop in the app (2 minutes). Personal best tracking turns them into self-competition. A kid who runs a drill in 1:44 and sees their PB is 1:42 will immediately run it again. That's the loop.

---

## Task Count Summary

| Stack | Tasks | Effort | What it creates |
|---|---|---|---|
| Delight (D-001–D-007) | 7 tasks | ~8 hours | First-session delight. Kids feel known and smart. |
| Retention (D-008–D-013) | 6 tasks | ~7 hours | Week 2–3 retention. Reasons to come back. |
| Trust (D-014–D-018) | 5 tasks | ~10 hours | Parent trust. Actual learning. Long-term advocacy. |
| **Total** | **18 tasks** | **~25 hours** | **Kids love it. Parents trust it. Both tell others.** |

---

## Running Order

```
D-001 → D-005 → D-006 (easy wins, 2 hours)
D-007 → D-002 → D-003 (visual + result screen, 4 hours)
D-004 (share card, 1 hour) ← LAUNCH THIS ONE EARLY
D-011 → D-013 (emotion + empty state, 2 hours)
D-008 → D-009 → D-010 → D-012 (retention mechanics, 4.5 hours)
D-018 (flash drill PB, 1 hour)
D-016 (parent share card, 1.5 hours)
D-014 → D-015 (content quality — dedicated session)
D-017 (mastery tiers, 2 hours)
```

**Say "start D-001" to begin the first task.**

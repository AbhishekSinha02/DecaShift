# Feature: Content Generation Session Protocol

**Priority:** P2 | **Type:** Content Operations | **Complexity:** S | **Status:** Pending

> The content bottleneck was not the model. It was mixing code + content in the same session.
> Code context fills the window. Content generation slows down. Session ends mid-batch.
>
> Fix: dedicated sessions for content only. No code. No context noise.
> I write files directly using the Write tool. You review and push.
> One session = 200–500 questions written to the correct files.
> No API cost. No scripts. No setup. Uses the current plan entirely.

---

## Why Session Mixing Was the Problem

When a Claude Code session has thousands of lines of app.js, styles.css, and index.html
in context, generating content consumes context that's already half-full.
By question 30, the window is crowded and quality degrades.

A fresh session with only a topic brief and a format template stays lean.
Question 1 and question 200 are the same quality.

---

## The Protocol (What to Say to Start a Content Session)

At the start of a dedicated content session, paste this brief:

```
Content generation session — no code today.

Format: CBSE-aligned MCQ JSON for Donnibo.
Schema:
{
  "id": "q_{subject}_{grade}_{topic}_{NNN}",
  "goalId": "grade{N}-{subject}",
  "question": "...",
  "options": ["A", "B", "C", "D"],
  "correctIndex": 0,
  "explanation": "1-2 sentences why correct.",
  "difficulty": "easy|medium|hard",
  "tags": ["topic", "subtopic"]
}

File wrapper (required around the questions array):
{
  "goalId": "grade{N}-{subject}",
  "title": "Grade N Subject — Topic",
  "description": "Topic practice",
  "category": "school",
  "grade": N,
  "subject": "{subject-slug}",
  "level": 1,
  "weekNum": WW,
  "weekDay": null,
  "questions": [ ... ]
}

Target: 40% easy, 40% medium, 20% hard per file.
Generate AND write each file directly. I'll tell you when to review.
```

Then just say what you need:
```
Grade 9 Math — Polynomials. 15 questions. Week 23, Set 1.
```

---

## Output Per Session (Realistic Estimates, Sonnet 4.6)

| Your request | My output | Time |
|---|---|---|
| 1 topic, 15 questions | 1 file written directly | ~2 min |
| 1 grade, 1 subject, 4 topics | 4 files written directly | ~8 min |
| 1 grade, all 4 subjects, 4 topics each | 16 files written | ~35 min |
| Full Grade 9 + Grade 10, all subjects | 32 files, ~480 questions | ~90 min |

**A 2-hour dedicated session covers two full grades across all subjects.**
With a full week (7 days), running 1–2 sessions per day covers Grades 9–12 completely.

---

## Weekly Content Cadence

The app releases new weekly sets on Monday (week number advances).
Content for the coming week should be ready by Sunday.

**Suggested weekly rhythm:**

| Day | Content work |
|---|---|
| Monday | Review what ran this week. Identify thin grades. |
| Tuesday–Wednesday | 1 dedicated session → 2 grades fully covered |
| Thursday–Friday | 1 dedicated session → remaining grades + GK bank top-up |
| Saturday | Review generated files, commit, push. Content live Sunday midnight. |
| Sunday | Rest. Or bonus session for Grade 11–12 deeper coverage. |

---

## Model Choice

**Stay on Sonnet 4.6 for all content generation.** Do not switch to Opus.

For MCQ question generation (factual, structured, curriculum-aligned):
- Sonnet 4.6 is more than sufficient
- Quality difference vs Opus is negligible for this content type
- Opus is for complex reasoning tasks — not needed here
- Fast mode (Opus) adds speed but the content quality gain is zero

---

## File Naming Reference

```
questions/school/grade-{N}/{subject-slug}/w{WW}-set{S}.json

Subject slugs:
  mathematics    →  mathematics
  science        →  science
  english        →  english
  social-science →  social-science
  hindi          →  hindi
  physics        →  physics
  chemistry      →  chemistry
  biology        →  biology

Example: questions/school/grade-9/mathematics/w23-set1.json
```

---

## Acceptance Criteria

- [ ] First dedicated content session run successfully (no code in session)
- [ ] At least 1 grade fully covered (4 subjects × 4 weekly sets = 16 files) from one session
- [ ] Files written directly by me (no copy-paste by user)
- [ ] All files pass manifest validation after session
- [ ] Weekly content cadence established and documented

## Connection to Other Tasks

- P2-T034 (Grade 9–12 sprint) — this protocol IS the method to execute that task
- P2-T036 (curriculum calendar) — calendar config tells each session what to generate next; admin view shows coverage gaps
- Existing manifest.json — auto-discovers new weekly files; no code change needed

## Strategic Note

This protocol costs ₹0 beyond the current Claude Code plan.
At 2 sessions per week × 300 questions per session = 600 questions/week.
Grades 9–12 fully covered in 10 sessions = 5 weeks.
The content bottleneck is a scheduling problem, not a technology problem.

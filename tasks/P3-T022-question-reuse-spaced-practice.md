# P3-T022 — Question Reuse & Spaced Practice Sessions

## Problem

After a user completes a quiz session, all questions — including ones they got wrong — are gone. There is no mechanism to:
- Revisit questions answered incorrectly
- Practice weak topics repeatedly until mastery
- Distinguish between "seen and mastered" vs "seen and failed" vs "not yet seen"

This makes the app a **one-shot content delivery tool** rather than a **learning system**. Users who fail a topic have no structured path to recover.

---

## Goal

Build a lightweight **practice layer** on top of the existing quiz engine so that:

1. Wrong answers are stored per question ID and surfaced as a "Review" session
2. Questions already mastered (≥ 2 correct attempts) are de-prioritized in random practice
3. A "Practice Weak Topics" mode can be launched from the home/profile screen
4. The question reuse loop creates a **mastery feedback cycle**, not just a score

---

## What to Build

### Phase 1 — Track Question-Level Mastery (localStorage)
- After each session, update `decashift_question_mastery` in localStorage
- Schema: `{ [questionId]: { attempts: N, correct: N, lastSeen: ISO, mastered: bool } }`
- `mastered = correct >= 2 && (correct / attempts) >= 0.8`
- Write a `updateMastery(responses[])` function in `storage.js`

### Phase 2 — Review Session Mode
- New session type: `"review"` — pulls questions where `mastered === false && attempts > 0`
- Entry point: "Review Weak Questions" button on result screen + home screen
- Same quiz engine, same UI — just a different question source
- Session tagged as `type: "review"` in session data

### Phase 3 — Practice Pool (Unseen Questions)
- Entry point: "Practice More" button — pulls questions not yet in mastery store (`attempts === 0`)
- Useful when user finishes all weekly questions but wants more practice
- Can draw from archived weeks or question banks within the same subject

### Phase 4 — Mastery Badge on Day-Cards
- Day-card on home shows a small mastery indicator:
  - ⬜ Not started
  - 🔄 Started, not mastered (some wrong)
  - ✅ Mastered (all questions mastered)
- Driven by `decashift_question_mastery` store, computed on render

---

## Acceptance Criteria

- [ ] `updateMastery(responses)` writes to localStorage after every session
- [ ] "Review Weak Questions" button appears on result screen if any wrong answers exist
- [ ] Review session loads correctly and saves a new session entry
- [ ] Mastery status visible on day-cards (Phase 4 — can ship separately)
- [ ] No change to existing quiz engine behavior for regular sessions

---

## Complexity: M (2–3 days)

**Why:** Core mastery tracking (Phase 1+2) is storage + session logic only. The quiz engine is untouched. Phase 3 and 4 are additive UI layers that can ship independently.

---

## Dependencies

- Depends on: P1-T013 (question file structure — done), P3-T017 (weekly sets — done)
- Naturally pairs with: P3-T021 (curriculum map — prerequisite understanding), P3-T006 (confidence/consistency tracking)
- Enables: P3-T005 (mastery-triggered badges), future adaptive difficulty

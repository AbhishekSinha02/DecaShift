# P3-T019 — Content Calendar & Weekly Question Pipeline

**Priority:** P3 — Engagement & Retention
**Complexity:** M (2–3 days)
**Status:** Pending

---

## Goal

Build a sustainable, continuous content growth system so the app never feels stale.
Weekly new questions land automatically; users who have seen all questions in a set
get surfaced fresh ones first. This directly mitigates F1 (content exhausts in 2 sessions).

---

## Scope

### Content Calendar (operational)
- Commit target: 10+ new questions per week across at least 2 subjects/grades
- Rotation: one new `set-N.json` file per grade/subject every 2–3 weeks
- Weekly challenge: new `weekly/YYYY-Www.json` every Monday (already scaffolded in P3-T017)
- Regional language: 1 new set per language per month

### Seen-Questions Filter (code)
- Track answered question IDs per user in localStorage: `user.seenQuestions = { goalId: [qId, ...] }`
- When loading a goal, sort unseen questions first, seen questions last
- Badge on goal card: "3 new questions!" when unseenCount > 0
- Never hide seen questions — just deprioritize them so repeat practice is still possible

### Content Source Expansion
- Add grades 7–12 Set 2 files (currently only grades 3–6 have Set 2)
- Add professional Set 2 files for azure-aks, devops, mlops, python, system-design
- Target: 50+ questions per grade/subject before soft-lock launches

---

## Data Change

```js
// Added to user profile in localStorage
user.seenQuestions = {
  "grade-5-math-1": ["q001", "q003", "q007"],
  "grade-5-science-1": ["q001", "q002"]
}
```

```js
// _renderQuestion() marks question as seen on display
// startGoal() sorts filteredQuestions: unseen first
```

---

## Acceptance Criteria
- [ ] Questions already answered by user appear at end of set, not beginning
- [ ] Goal card shows "N new" badge when unseen questions exist
- [ ] Weekly file published every Monday by 00:00 IST (manual workflow, git push)
- [ ] Content calendar markdown in `tasks/content-calendar.md` tracking upcoming sets
- [ ] Grades 7–12 each have at least Set 2 (10+ questions)
- [ ] Professional tracks each have Set 2 (10+ questions)

---

## Dependencies
- P3-T017 (weekly sets — done, framework in place)
- P3-T018 (regional language — done, framework in place)
- P2-T020 (content ops / CSV import — speeds up content creation)

---

## Weekly Rotation Log

> Weekly math files: grades 2–8 × 5 days (mon–fri) × 15q = 35 files / 525q per week.
> File pattern: `school/grade-N/math-wWW-DAY.json`, wired in `manifests/manifest-grade-N.json`.
> Home shows "This Week" (currentWeek) + "Last Week" (currentWeek−1) shelves via ISO week.

| Week | Dates | Math (G2–8) | Regional | Notes |
|---|---|---|---|---|
| W21 | May 18–24 | ✅ 35 files | set-1 | last week |
| W22 | May 25–31 | ✅ 35 files | set-2 | current week |
| **W23** | **Jun 01–07** | ✅ **35 files (shipped 2026-05-30)** | ✅ **set-3 (6 langs, 60q)** | next week, pre-staged |

**W23 science topic map (progresses from W22), shipped 2026-05-30 (`11ca503`):**
G2 Plants Around Us · G3 Animal Life · G4 Animals & Their Habitats · G5 The Skeletal System ·
G6 Fibre to Fabric · G7 Nutrition in Animals · G8 Synthetic Fibres & Plastics. 35 files / 525q.

**W23 math topic map (progresses from W22):**
G2 3D Solid Shapes · G3 Division · G4 Fractions · G5 Percentages & Averages ·
G6 Ratio & Proportion · G7 Comparing Quantities (%, profit/loss, SI) · G8 Squares & Square Roots.

**Regional W23:** set-3 (level 3, `weekNum:23`) for marathi/sanskrit/tamil/telugu/punjabi/malayalam —
animals, body, family & nature words. Kept on existing set-based regional tab (no JS change, no day-gating).
Note: regional is grade-null/flat-card, NOT the daily-gated weekly model. True daily regional would need
app-home/app-quiz changes (E-track polish, deferred).

**Still pending for W23 (not yet generated — next content sessions):** hindi, french for G2–8
(W22 has them: 35 files each). Hindi/French W23 = 70 more files / 1,050q. Run one subject per
~1M-token session per the content protocol (full week = 2,100q ≈ 4–5 standard sessions).

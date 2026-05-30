# P3-T021 — Curriculum Topic Progression Plan

## Problem

Weekly question files are generated per day (Mon–Fri) with topics chosen ad-hoc. There is no structured sequence ensuring a student covers foundational topics before advanced ones, or that related topics build on each other across weeks. The current system creates a **random content delivery experience**, not a **learning journey**.

Example gap: A Grade 5 student might get "Decimals" on W22-Wed without having mastered "Place Value" from W21. There is no dependency graph ensuring prerequisites come first.

---

## Goal

Define a **topic progression map** per grade per subject, so that:

1. Each week's 5 files follow a coherent learning arc (Mon = intro → Fri = application/review)
2. W22 content **builds on** W21 content — not independent
3. Topics for the full year are pre-planned so content teams know what to generate next
4. The app can surface "you haven't covered this prerequisite yet" warnings to the user

---

## What to Build

### Phase 1 — Curriculum Map (Data, no code)
- Create `curriculum-map.json` in `app/ui/questions/school/` 
- Schema: `{ grade, subject, weeks: [{ weekNum, theme, topics: [Mon, Tue, Wed, Thu, Fri], prerequisiteWeeks: [] }] }`
- Populate for Grades 3 and 5 first (already have question files for those)
- Topics should follow NCERT / standard school curriculum sequence

### Phase 2 — UI Signal (Light)
- On the day-card in the subject tab, show the topic name (already in `description` field of each JSON)
- Show a "builds on W{N}" chip if the file has `prerequisiteWeekNum` set
- No blocking — just informational

### Phase 3 — Adaptive Hint (Future)
- If user scored < 60% on a prerequisite week, show a soft warning before they start the current week
- "You scored 40% on Fractions last week — this week uses fractions. Want to review first?"

---

## Acceptance Criteria

- [ ] `curriculum-map.json` exists and covers Grades 3 + 5 for Math + Science
- [ ] Each week entry has a `theme` and ordered `topics[]` matching actual file `description` fields
- [ ] Day-card on home screen shows topic name pulled from file `description`
- [ ] No regression in existing question loading or filtering

---

## Complexity: M (1–3 days)

**Why:** Curriculum map is a data task (design + write JSON). UI change is minimal — just surface the `description` field that already exists. The adaptive hint layer is Phase 3 and out of scope for this task.

---

## Dependencies

- Depends on: P3-T017 (weekly sets — done), BUG-005 (file structure fix — done)
- Blocks: Future spaced repetition (P3-T022), adaptive learning paths (P4+)

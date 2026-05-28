# Feature: Grade 9–12 Content Sprint

**Priority:** P2 — URGENT | **Type:** Content | **Complexity:** M | **Status:** Pending

> Grade 9–12 students feel board exam pressure. Their parents will pay on day 1
> if the content is credible. They churn on day 2 if it's thin.
> This is not a content problem — it is a revenue problem.
> Every day without Grade 9–12 content is a paying subscriber who never signed up.

---

## Why This Is P2 (Not P3)

The app has ~6,000 questions. Almost all are Grade 2–8.
Grade 9–12 is "still thin" — the user's own words in the failure tracker.

The failure this creates:
- F1 (content exhaustion) is NOT mitigated for Grade 9–12 — only for Grade 2–8
- A Grade 10 student who signs up exhausts content in 1–2 sessions and never returns
- This is the highest-intent segment (board exams = real urgency to study)
- It is also the segment most likely to self-convert to Pro without a parent's push

**Fix Grade 9–12 content before any marketing push targeting older students.**
Any rep selling to a Grade 10 parent is selling a product that will disappoint that user.

---

## Content Gap Analysis

### Current State (estimated)

| Grade | Math | Science | English | Social Science | Total |
|---|---|---|---|---|---|
| 9 | ~15q | ~10q | 0 | 0 | ~25q |
| 10 | ~15q | ~10q | 0 | 0 | ~25q |
| 11 | ~10q | ~5q | 0 | 0 | ~15q |
| 12 | ~10q | ~5q | 0 | 0 | ~15q |

**Gap to fill:** ~800 questions across 4 grades × 4 subjects.

### Target State (after this task)

| Grade | Math | Science | English | Social Science | Total |
|---|---|---|---|---|---|
| 9 | 60q | 50q | 40q | 40q | 190q |
| 10 | 60q | 50q | 40q | 40q | 190q |
| 11 | 60q | 50q | 40q | 30q | 180q |
| 12 | 60q | 50q | 40q | 30q | 180q |

60q/subject at 10q/day = 6 days of content per subject. Enough for the free trial.
Pro users get access to multiple subjects → 24 days of non-repeating content per grade.

---

## Topic Priority Per Grade

### Grade 9–10 Math (CBSE / State board aligned)
Number Systems, Polynomials, Linear Equations, Coordinate Geometry, Triangles,
Quadrilaterals, Circles, Areas, Surface Area & Volume, Statistics, Probability,
Trigonometry (Grade 10), Real Numbers (Grade 10), Arithmetic Progressions

### Grade 9–10 Science
Motion, Force & Laws, Gravitation, Sound, Matter, Atoms & Molecules,
Cell Biology, Tissues, Natural Resources, Life Processes (10), Chemical Reactions (10),
Acids Bases Salts (10), Electricity (10), Magnetic Effects (10), Heredity (10)

### Grade 11–12 Math
Sets, Functions, Trigonometry, Sequences, Straight Lines, Conic Sections,
Permutations, Binomial Theorem, Limits, Derivatives (11),
Relations, Inverse Trig, Matrices, Determinants, Integrals,
Differential Equations, Vectors, 3D Geometry, Linear Programming, Probability (12)

### Grade 11–12 Science (PCM / PCB tracks)
Physics: Units, Motion, Laws of Motion, Work-Energy, Gravitation, Thermodynamics,
Waves, Electrostatics, Current Electricity, Magnetism, Optics, Modern Physics

Chemistry: Some Basic Concepts, Atomic Structure, Bonding, States of Matter,
Thermodynamics, Equilibrium, Redox, Hydrogen, S-Block, Hydrocarbons, Organic

Biology (if PCB): Cell, Biomolecules, Cell Cycle, Genetics, Evolution,
Human Physiology, Biotechnology, Ecology

---

## Generation Method

**Do NOT generate these in Claude Code sessions.** Use P2-T035 (standalone generation script) once it's built. If P2-T035 is not ready yet, generate in batches of 30 questions per Claude Code message, one topic at a time, to avoid context exhaustion.

**File naming convention** (existing format):
```
questions/school/grade-{N}/{subject}/w21-set1.json   ← weekly set format
questions/school/grade-{N}/{subject}/w22-set1.json
```

**Minimum viable per file:** 15 questions per weekly set file.
Generate W21 and W22 for each subject/grade combination → 2 files × 15q = 30q per subject per grade as MVP.

---

## Generation Prompt Template

Use this exact prompt for each batch (paste into Claude or into the generation script):

```
Generate 15 multiple-choice questions for Grade {N} {Subject} on the topic "{Topic}".

Requirements:
- CBSE / Indian state board curriculum aligned
- 4 options per question (A, B, C, D)
- One correct answer
- Brief explanation (1–2 sentences) for the correct answer
- Mix: 40% easy, 40% medium, 20% hard

Output as JSON array matching this schema exactly:
[{
  "id": "q_{subject}_{grade}_{topic}_{sequence}",
  "goalId": "grade{N}-{subject}",
  "question": "...",
  "options": ["...", "...", "...", "..."],
  "correctIndex": 0,
  "explanation": "...",
  "difficulty": "easy|medium|hard",
  "tags": ["topic", "subtopic"]
}]
```

---

## Acceptance Criteria

- [ ] Grade 9 Math: 60+ questions across 4 weekly set files
- [ ] Grade 9 Science: 50+ questions across 4 weekly set files
- [ ] Grade 9 English: 40+ questions (grammar, comprehension, vocabulary)
- [ ] Grade 9 Social Science: 40+ questions (History, Geography, Civics basics)
- [ ] Grade 10: Same coverage as Grade 9
- [ ] Grade 11 Math: 60+ questions across key chapters
- [ ] Grade 11 Science: 50+ questions (Physics + Chemistry split)
- [ ] Grade 12: Same coverage as Grade 11
- [ ] All files pass manifest validation (manifest.json updated)
- [ ] App loads Grade 9–12 goals correctly after manifest update
- [ ] No question has duplicate IDs across files

## Dependencies

- P2-T035 (standalone generation script) — preferred generation method; if not ready, generate manually in batches
- Existing manifest.json discovery system (already handles new weekly files automatically)

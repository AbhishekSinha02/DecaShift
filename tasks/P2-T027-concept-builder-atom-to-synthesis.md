# Feature: Concept Builder — Atom-to-Synthesis Learning Engine

**Priority:** P2 | **Type:** Core Learning Architecture | **Complexity:** L | **Status:** Pending

> This task defines how DecaShift actually teaches — not just tests.
> Everything else (weekly sets, question bank, avatar growth, weekly exam) is a
> surface. This is the engine underneath.

---

## The Vision

A child should never face a hard problem cold.

They should arrive at it having already understood every atom it is built from —
what each word means, what each operation does, how each piece relates to the next.
By the time the synthesis question appears, it does not feel hard. It feels like the
natural conclusion of something they built themselves, week by week, inside their head.

No teacher needs to explain it. No book needs to be opened.
The app sequences the journey. The child does the work. The understanding is theirs.

**This is the difference between a quiz app and a learning system.**

---

## The Five Concept Levels

Every question in the bank belongs to exactly one level within one concept.
Levels are not difficulty scores — they are positions in an understanding hierarchy.

```
Level 0 — ATOM
  The smallest indivisible unit of understanding.
  What does this word mean? What does this symbol represent?
  No calculation. No inference. Just recognition.
  Example: "In the fraction 3/4, what does the 4 tell you?"

Level 1 — FOUNDATION
  Using one atom correctly in isolation.
  The child applies a single concept — nothing combined yet.
  Example: "What fraction of this shape is shaded?" [visual: 3 of 4 squares]

Level 2 — RELATIONSHIP
  Two or more atoms working together.
  The child sees how concepts connect and affect each other.
  Example: "Which is bigger: 1/2 or 1/4? How do you know?"

Level 3 — APPLICATION
  Using the concept to solve a real situation.
  Context is introduced. The concept must be extracted and applied.
  Example: "I walked 3/4 of a km. How many metres is that?"

Level 4 — SYNTHESIS
  All atoms, all relationships, all applications operating simultaneously.
  The hard question. The exam question. The one that used to feel impossible.
  Example: "A recipe needs 2/3 cup of sugar. You make half the recipe. How much sugar?"
```

A student who has mastered Levels 0–3 does not find Level 4 hard.
They find it satisfying — because they built it themselves.

---

## The Weekly Arc (How Each Week Feels Like Growth)

A concept spans 4–5 weeks. Each week, the student moves one level deeper.
The question bank is the source. The weekly sets draw from it — not randomly,
but deliberately, based on where the student is in the concept arc.

```
CONCEPT: Fractions (Grade 4) — 4-week arc

WEEK 1 — "Understanding the Pieces"  (Level 0 + 1: Atoms + Foundation)
  Set 1: What is a fraction? What do the numbers mean?
  Set 2: Reading fractions from shapes and diagrams
  Set 3: Fractions on a number line
  Set 4: Fractions of a group (e.g. 2 of 5 apples)
  Set 5: Identifying equal fractions visually

  The student finishes Week 1 knowing what fractions ARE.
  Nothing has been calculated yet. The atoms are in place.

WEEK 2 — "Seeing How They Fit"  (Level 1 + 2: Foundation + Relationship)
  Set 1: Comparing fractions with the same denominator
  Set 2: Equivalent fractions — same value, different look
  Set 3: Fractions on the number line (ordering)
  Set 4: Adding fractions with the same denominator
  Set 5: Subtracting fractions with the same denominator

  The student starts to feel the relationships. Things connect.
  The Week 1 atoms are already doing useful work.

WEEK 3 — "Using What You Know"  (Level 2 + 3: Relationship + Application)
  Set 1: Unlike denominators — comparing
  Set 2: Mixed numbers — what they mean and how to read them
  Set 3: Fractions in real-world contexts (recipes, distance, time)
  Set 4: Word problems — one step
  Set 5: Word problems — two steps

  This is the week things start to feel real. The student is no longer
  answering questions about circles and squares. They are solving situations.

WEEK 4 — "You Built This"  (Level 3 + 4: Application + Synthesis)
  Set 1: Adding unlike denominators
  Set 2: Subtracting unlike denominators
  Set 3: Mixed number operations
  Set 4: Multi-step real-world problems
  Set 5 + Exam: Everything combined — the synthesis question

  A student who worked through Weeks 1–3 does not find these hard.
  They find them familiar. They built every piece.
```

**The question bank is the source for all of this.**
Week 4 Set 5 draws from the same bank as Week 1 Set 1 — just at a different level.
Questions are never generated fresh each week. They are curated once, tagged precisely,
and served by the engine at exactly the right moment.

---

## Question Schema — Updated

Two new required fields on every question:

```json
{
  "id": "q_frac_014",
  "goalId": "grade4-mathematics",
  "conceptId": "fractions",
  "conceptLevel": 0,
  "levelLabel": "atom",
  "question": "In the fraction 3/4, what does the 4 tell you?",
  "options": [
    "How many pieces you have eaten",
    "How many equal pieces the whole is divided into",
    "The size of each piece",
    "How many pieces are left"
  ],
  "correctIndex": 1,
  "explanation": "The bottom number (denominator) always tells you how many equal parts the whole is divided into.",
  "difficulty": "easy",
  "tags": ["fractions", "denominator"],
  "prerequisite": null
}
```

```json
{
  "id": "q_frac_089",
  "goalId": "grade4-mathematics",
  "conceptId": "fractions",
  "conceptLevel": 4,
  "levelLabel": "synthesis",
  "question": "A recipe needs 2/3 cup of sugar. You want to make half the recipe. How much sugar do you need?",
  "options": ["1/3 cup", "1/6 cup", "4/3 cup", "1/2 cup"],
  "correctIndex": 0,
  "explanation": "Half of 2/3 means multiply 2/3 × 1/2 = 2/6 = 1/3.",
  "difficulty": "hard",
  "tags": ["fractions", "multiplication", "word-problems"],
  "prerequisite": ["fractions-level-0", "fractions-level-1", "fractions-level-2", "fractions-level-3"]
}
```

**Fields added:**
- `conceptId` — the concept this question builds (e.g. `"fractions"`, `"photosynthesis"`, `"past-tense"`)
- `conceptLevel` — 0–4 (atom → synthesis)
- `levelLabel` — human-readable level name
- `prerequisite` — which concept-levels must be mastered before this question is served
  (null for atoms; levels below for higher questions)

---

## The Smart Selection Engine

Weekly sets are not randomly assembled. The engine queries the bank:

```
Given:
  student.grade = "4"
  student.subject = "mathematics"
  student.conceptProgress = { "fractions": { highestLevel: 1, masteredAt: "2026-03-15" } }
  currentWeek = 12

Select:
  conceptId = "fractions"
  conceptLevel = 2                          ← next level for this student
  exclude: questions seen in last 14 days   ← spaced repetition
  prefer: questions never seen              ← freshness
  fallback: questions seen longest ago      ← if bank is thin at this level
  count: 8–10 per set
```

**The bank is always the source. The engine is always purposeful.**

No question is served before its prerequisites are met.
No question is served randomly when a purposeful choice exists.
A student who is on Level 2 of fractions will never be served a Level 4 question —
not because they are blocked, but because the engine knows Level 4 is not yet useful.

---

## Concept Progress Tracking

A new lightweight record per student, per concept:

```js
user.conceptProgress = {
  "fractions": {
    currentLevel: 2,
    levelHistory: [
      { level: 0, masteredAt: "2026-03-01", accuracy: 0.92 },
      { level: 1, masteredAt: "2026-03-08", accuracy: 0.87 }
    ],
    questionsAnswered: 47,
    questionsCorrect: 41
  },
  "decimals": {
    currentLevel: 0,
    levelHistory: [],
    questionsAnswered: 0,
    questionsCorrect: 0
  }
}
```

**Level mastery threshold:** 80% accuracy across 8+ questions at a level.
Once mastered, the engine begins serving the next level in the next session.

**Regression rule:** If a student scores below 50% on a Level N question set,
the next session includes 3–4 Level N-1 review questions before returning to Level N.
This is invisible to the student — the questions just feel easier for one session,
then harder again. It never announces "you went backwards."

---

## How Each Week Feels

The UI does not label levels. The student does not see "Level 0 — Atom."
They see question cards that feel simpler at the start of a concept arc and
richer by the end. The understanding grows inside them — unlabelled, unannounced.

**What the student notices over four weeks:**
- Week 1: "These questions are easy. I get them all."
- Week 2: "Okay, these are a bit more interesting."
- Week 3: "This is actually useful — I saw something like this in school."
- Week 4: "Wait, I just solved something I didn't understand a month ago."

That last moment — that is the product. That is what "DecaShift" means.

**What the parent notices:**
The child's avatar grew. The concept map shows all five levels lit up.
The weekly exam score was 82%.
Nobody explained anything. The child figured it out.

---

## Concept Catalogue (Starter — Expandable)

Each grade/subject has a set of concepts. Each concept has a 4-week arc.

**Grade 4 Mathematics:**
Fractions · Decimals · Multiplication · Division · Geometry-Basics · Measurement

**Grade 5 Mathematics:**
Fractions-Advanced · Decimals-Operations · Area-Perimeter · Data-Handling · Factors-Multiples

**Grade 4 Science:**
Photosynthesis · Food-Chain · States-of-Matter · Water-Cycle · Human-Body-Systems

This catalogue grows with the content strategy (P3-T023).
Each concept in the catalogue maps to 4–5 weeks of question sets in the bank.

---

## How This Changes Existing Architecture

| Component | Before | After |
|---|---|---|
| Weekly sets | Date-gated files, content fixed | Bank-drawn, concept-level aware, student-adaptive |
| Question files | Flat list of questions | Tagged by conceptId + conceptLevel + prerequisite |
| Difficulty | easy / medium / hard | conceptLevel 0–4 (richer, prerequisite-linked) |
| Set composition | Fixed per file | Dynamic: engine selects from bank per student state |
| Progress tracking | Accuracy per goal | Mastery per concept level per student |
| Weekly exam | — (P3-T029) | Synthesises all 5 levels; tests the full arc |
| Avatar growth | Streak-driven | Concept mastery drives stage transitions (alongside streaks) |

---

## Concept Map UI (on Home Screen)

Each topic card shows a small visual tree instead of just a question count:

```
  Fractions
  ●─●─●    Atoms + Foundation (3 mastered)
      │
    ●─●    Relationship (1 mastered, 1 in progress)
      │
    ░░░    Application (locked — relationship not yet mastered)
      │
    ░░░    Synthesis (locked)
```

- Filled circle ● = mastered at 80%+
- Half circle ◑ = in progress (questions answered, not yet mastered)
- Empty circle ○ = attempted, accuracy low (needs more practice)
- Ghost ░ = not yet reached (prerequisite level incomplete)

This is the progress view. Not "you got 7/10." But "you understand 3 of the 5 layers
of fractions." Parents can read this. Children can feel it.

---

## Acceptance Criteria

### Schema
- [ ] All existing question files updated with `conceptId` + `conceptLevel` + `prerequisite`
- [ ] Grade 3 + Grade 5 Math + Science fully tagged (test baseline)
- [ ] `conceptLevel` values are 0–4 only; `levelLabel` present on all
- [ ] `prerequisite` is null for Level 0; populated correctly for Levels 2–4

### Engine
- [ ] `_selectQuestionsForSet(user, conceptId, targetLevel)` implemented
- [ ] Engine respects prerequisite chain — never serves Level N if Level N-1 not mastered
- [ ] Engine excludes questions seen in last 14 days (spaced repetition)
- [ ] Mastery threshold: 80% accuracy across 8+ questions triggers level advancement
- [ ] Regression: sub-50% on any set inserts Level N-1 review into next session (silent)

### Concept Progress
- [ ] `user.conceptProgress` object created and maintained per student
- [ ] Mastery events stored with date + accuracy
- [ ] Progress synced to Drive on session end

### Concept Map UI
- [ ] Topic card shows concept tree (5 nodes, coloured by mastery state)
- [ ] Map updates after each completed session
- [ ] Mobile: concept tree renders cleanly at 375px card width

### Weekly Arc Feel
- [ ] Grade 4 Fractions 4-week arc built as first reference implementation
- [ ] Each week's sets draw from bank at the correct level for that week in the arc
- [ ] A student completing all 4 weeks can answer the synthesis question with 75%+ accuracy

---

## Files to Touch
- `questions/` — add `conceptId`, `conceptLevel`, `prerequisite` to all question files
- New: `config/concept-catalogue.json` — concept → grade → level → week-target mapping
- `app/ui/storage.js` — `user.conceptProgress` schema, mastery threshold logic
- `app/ui/app.js` — `_selectQuestionsForSet()`, `_updateConceptProgress()`,
  `_renderConceptMap()`, regression logic
- `app/ui/styles.css` — concept map node styles (●, ◑, ○, ░)
- `app/ui/index.html` — concept tree in topic cards

## Dependencies
- P3-T017 (weekly sets — done; this engine replaces static file-per-day with bank queries)
- P3-T023 (content strategy — concept catalogue is the strategic backbone; done in parallel)
- P3-T024 (AI generation — prompts now specify conceptId + conceptLevel explicitly)
- P3-T027 (tag quality — canonical tags align with concept vocabulary)
- P3-T029 (weekly exam — exam draws one question per concept level; tests the full arc)
- P3-T004 (avatar growth — concept mastery events feed avatar stage progression)
- **This task must be designed before content scales past Grade 5** — schema backfill
  becomes exponentially harder with every 100 questions added without conceptLevel tags

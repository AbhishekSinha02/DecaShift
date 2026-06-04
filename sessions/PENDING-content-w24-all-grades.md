# Content Generation — Week 24, All Grades & Subjects
**Type:** Content generation (no code) · **Model:** Sonnet 4.6 · **Trigger:** "start questions generation"
**Pre-approved:** Execute top to bottom. No questions needed.

---

## What Is W24?
**ISO Week 24 = Jun 9–15, 2026 (Mon Jun 9 → Sun Jun 15)**

W24 set1 already exists for grades 9–12 (created with W23 set1 batch).
Everything below is **new work**.

---

## Scope — 196 Files Total

| Priority | Scope | Files | ~Questions |
|----------|-------|-------|-----------|
| **C4 — P1** | Grades 2–8 **Math** W24 (5 days × 7 grades) | 35 | 525 |
| **C5 — P2** | Grades 2–8 **Science** W24 | 35 | 525 |
| **C6 — P2** | Grades 2–8 **Hindi** W24 | 35 | 525 |
| **C6 — P2** | Grades 2–8 **French** W24 | 35 | 525 |
| **C7 — P3** | Grades 9–12 **set2–set5** W24 (all subjects) | 56 | 840 |

**Session budget:** ~300–500q per session → approx 4–5 sessions to complete all.
Start with C4 (Math). Each subject = one session.

---

## File Schema — Grades 2–8 (daily files)

Mirror exactly from any W23 daily file (e.g. `grade-5/math-w23-mon.json`):

```json
{
  "goalId": "grade-N-math-w24-mon",
  "title": "Grade N Math — Mon, Jun 09",
  "description": "<Topic> — Day 1 of 5: <subtopic intro>",
  "subject": "mathematics",
  "category": "school",
  "grade": N,
  "level": 1,
  "weekNum": 24,
  "weekDay": "mon",
  "weekStart": "2026-06-09",
  "weekEnd": "2026-06-15",
  "status": "active",
  "questions": [ ...15 questions... ]
}
```

**Day titles:**
- Mon Jun 09 · Tue Jun 10 · Wed Jun 11 · Thu Jun 12 · Fri Jun 13

**Question IDs:** `gNm-w24-mon-001` … `gNm-w24-mon-015`
(replace `m` with `s`/`h`/`f` for science/hindi/french)

**5-day arc rule:** Day 1 = concept intro → Day 2/3 = build/practice → Day 4 = application → Day 5 = synthesis/mixed.

---

## C4 — Math W24: Topics per Grade (build on W23 end)

| Grade | W23 Ended On | W24 Topic |
|-------|-------------|-----------|
| 2 | 3D Solid Shapes | **Measurement** — length, weight, capacity (cm/m/km, g/kg, mL/L) |
| 3 | Division | **Fractions** — introduction, halves, thirds, equal parts |
| 4 | Fractions | **Decimals** — tenths, hundredths, place value, addition/subtraction |
| 5 | Percentages & Averages | **Simple Interest** — principal, rate, time, SI formula |
| 6 | Ratio & Proportion | **Basic Geometry** — lines, angles (types, measurement with protractor) |
| 7 | Comparing Quantities | **Simple & Compound Interest** — formulas, difference |
| 8 | Squares & Square Roots | **Cubes & Cube Roots** — perfect cubes, cube root by prime factorisation |

**After creating all 35 Math files:** update `manifests/manifest-grade-{2,3,4,5,6,7,8}.json` — add 5 entries per grade with `weekNum: 24`, `weekDay: mon/tue/wed/thu/fri`.

---

## C5 — Science W24: Topics per Grade

| Grade | W23 Ended On | W24 Topic |
|-------|-------------|-----------|
| 2 | Plants Around Us | **Animals Around Us** — types, body parts, movement, food, homes |
| 3 | Animal Life | **Plant Kingdom** — flowering/non-flowering, roots, stems, leaves functions |
| 4 | Animals & Their Habitats | **Food & Nutrition** — nutrients, balanced diet, deficiency diseases |
| 5 | The Skeletal System | **The Digestive System** — organs, digestion process, enzymes |
| 6 | Fibre to Fabric | **Separation of Substances** — sieving, filtration, evaporation, distillation |
| 7 | Nutrition in Animals | **Fibre to Fabric** (G7 level — spinning, weaving, silk/wool processes) |
| 8 | Synthetic Fibres & Plastics | **Metals & Non-metals** — properties, uses, reactivity |

---

## C6 — Hindi W24: Topics per Grade

| Grade | W23 Ended On | W24 Topic |
|-------|-------------|-----------|
| 2 | गिनती व तुकांत शब्द | **संज्ञा (Nouns)** — व्यक्तिवाचक, जातिवाचक, भाववाचक |
| 3 | वचन (Number) | **लिंग (Gender)** — पुल्लिंग, स्त्रीलिंग, लिंग परिवर्तन |
| 4 | क्रिया (Verbs) | **काल (Tense)** — भूत, वर्तमान, भविष्य |
| 5 | विशेषण (Adjectives) | **क्रिया-विशेषण (Adverbs)** — प्रकार, प्रयोग |
| 6 | संज्ञा व लिंग | **सर्वनाम (Pronouns)** — प्रकार, प्रयोग, वाक्य में स्थान |
| 7 | पर्यायवाची व विलोम | **मुहावरे (Idioms)** — अर्थ, प्रयोग, वाक्य-निर्माण |
| 8 | संधि | **समास (Compound Words)** — प्रकार, विग्रह, पहचान |

---

## C6 — French W24: Topics per Grade

| Grade | W23 Ended On | W24 Topic |
|-------|-------------|-----------|
| 2 | Les couleurs et les nombres | **Les animaux** — domestic/wild, names, habitat vocabulary |
| 3 | Les couleurs | **La famille** — family members, relationships, my family sentences |
| 4 | Verbes en -IR | **Les aliments** — food vocabulary, j'aime/je n'aime pas, meals |
| 5 | La maison | **La nourriture au marché** — shopping for food, quantities, prices |
| 6 | La routine quotidienne | **Les sports et les loisirs** — verbs jouer à/faire de, frequency |
| 7 | Le futur proche | **Le passé composé** — avoir + past participle (regular verbs) |
| 8 | L'imparfait | **Le conditionnel présent** — formation (-ais, -ais, -ait…), politeness |

---

## C7 — Grades 9–12: W24 set2–set5

W24 set1 already exists for all grade 9–12 subjects. Add set2, set3, set4, set5 **exactly as done for W23 in the previous session** — same 15q per file, same schema, same manifest update pattern.

**W24 set1 topics (for progression reference):**

| Grade | Subject | W24 set1 Topic (already exists) |
|-------|---------|--------------------------------|
| 9 | English | Beehive Unit 6 "My Childhood" + Passive Voice basics |
| 9 | Social Science | Geography Ch.3 — Drainage (rivers, river systems) |
| 9 | Mathematics | Already exists — check file for topic |
| 9 | Science | Already exists — check file for topic |
| 10 | English | First Flight Unit 6 "The Making of a Scientist" + Clauses |
| 10 | Social Science | Geography Ch.3 — Water Resources |
| 10 | Mathematics | Already exists |
| 10 | Science | Already exists |
| 11 | Mathematics | Already exists |
| 11 | Physics | Ch.6 Work, Energy and Power |
| 11 | Chemistry | Ch.6 Chemical Thermodynamics (enthalpy, entropy) |
| 12 | Mathematics | Already exists |
| 12 | Physics | Ch.5 Magnetism and Matter (bar magnet, Earth's magnetism) |
| 12 | Chemistry | Ch.5 Surface Chemistry |

**For sets 2–5:** Cover remaining subtopics of the same chapter (or next chapter) — same pattern as W23. 15q per set. Update manifests to add 4 entries per subject after generating.

**Manifest pattern for grade 9 (same for all):**
```json
{ "file": "school/grade-9/english/w24-set2.json", "category": "school", "grade": 9, "subject": "english", "level": 1, "weekNum": 24 }
```

---

## Commit Sequence

One commit per grade-subject batch:
```
# Grades 2-8 Math W24
git add app/ui/questions/school/grade-{2..8}/math-w24-*.json app/ui/questions/manifests/manifest-grade-{2..8}.json
git commit -m "content(w24): grades 2-8 Math W24 — 35 files + manifests"

# Repeat for Science, Hindi, French
# Then grades 9-12 set2-5 per grade
```

---

## Verification

After each subject batch, confirm manifests have correct `weekNum: 24` entries. The app will auto-show W24 content the week of Jun 9.

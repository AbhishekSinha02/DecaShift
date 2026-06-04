# Content Generation — W24 Science, Grades 2–8 (C5)

**Type:** Content generation (no code) · **Model:** Sonnet 4.6 · **Trigger:** "start questions generation"
**Pre-approved:** Execute top to bottom. No questions needed.
**Part of:** `PENDING-content-w24-all-grades.md` → session **C5**

---

## Context

**C4 (W24 Math, Grades 2–8) is DONE** — commit `446ac80`, pushed 2026-06-04.
This session = **C5: W24 Science, Grades 2–8** (35 files, 525 questions).

**After this session:** C6 = W24 Hindi (35 files), C6b = W24 French (35 files), C7 = Grades 9–12 W24 set2–set5 (56 files).

---

## W24 Week Dates

- **ISO Week 24:** Jun 9–15, 2026
- weekStart: `"2026-06-09"` · weekEnd: `"2026-06-15"`
- Days: `mon` (Jun 09) · `tue` (Jun 10) · `wed` (Jun 11) · `thu` (Jun 12) · `fri` (Jun 13)

---

## File Schema — exact mirror of W23 science files

```json
{
  "goalId": "grade-N-science-w24-mon",
  "title": "Grade N Science — Mon, Jun 09",
  "description": "<Topic> — Day 1 of 5: <subtopic intro>",
  "subject": "science",
  "category": "school",
  "grade": N,
  "level": 1,
  "weekNum": 24,
  "weekDay": "mon",
  "weekStart": "2026-06-09",
  "weekEnd": "2026-06-15",
  "status": "active",
  "tags": ["science", "grade-N", "weekly", "<topic-tag>"],
  "questions": [ ...15 questions... ]
}
```

**File paths:** `app/ui/questions/school/grade-N/science-w24-DAY.json`
(NOT a `science/` subfolder — flat in the grade folder, same as W23)

**Question IDs:** `gNs-w24-mon-001` … `gNs-w24-mon-015`
(N = grade number, `s` for science)

**Per file:** 15 questions. 5-day arc: Day 1 = concept intro → Day 2/3 = build/practice → Day 4 = application → Day 5 = synthesis/mixed.

**Quality rules:**
- CBSE-aligned, grade-appropriate vocabulary
- Explanation names the concept, not just the answer
- correctIndex varies — don't default to index 0
- Distractors plausible (not obviously wrong)
- Indian context where possible (Indian animals, Indian examples)

---

## Topics per Grade — W24 Science

Build on where W23 ended (W23 Friday topic listed for reference):

| Grade | W23 Ended On | **W24 Topic** |
|-------|-------------|---------------|
| 2 | Plants Around Us | **Animals Around Us** — types (wild/domestic/pet), body parts, movement, food, homes |
| 3 | Animal Life | **Plant Kingdom** — flowering/non-flowering plants, roots/stems/leaves functions |
| 4 | Animals & Their Habitats | **Food & Nutrition** — nutrients (carbs/proteins/fats/vitamins/minerals), balanced diet, deficiency diseases |
| 5 | The Skeletal System | **The Digestive System** — organs (mouth→stomach→intestines), digestion process, enzymes, absorption |
| 6 | Fibre to Fabric | **Separation of Substances** — sieving, filtration, evaporation, distillation, chromatography |
| 7 | Nutrition in Animals | **Fibre to Fabric** (G7 level) — spinning, weaving, silk/wool processes, synthetic vs natural fibres |
| 8 | Synthetic Fibres & Plastics | **Metals & Non-metals** — physical/chemical properties, reactivity series, uses, corrosion |

**Levels:** Grades 2–7 = level 1. Grade 8 = level 2.

---

## 5-Day Arc per Grade (suggested)

### Grade 2 — Animals Around Us
- Mon: Types of animals — wild, domestic, pets; naming common animals
- Tue: Body parts — legs, wings, fins, tails; how animals move
- Wed: What animals eat — herbivore, carnivore, omnivore
- Thu: Animal homes — nest, burrow, den, stable, pond
- Fri: Mixed — baby animal names, sounds, uses to humans

### Grade 3 — Plant Kingdom
- Mon: Flowering vs non-flowering plants; what a flower does
- Tue: Roots — types (tap/fibrous), functions (anchor + absorb)
- Wed: Stem — functions (transport + support); types (herbaceous/woody)
- Thu: Leaves — parts (blade/petiole/veins), photosynthesis intro
- Fri: Mixed — plants we eat, medicinal plants, trees vs shrubs vs herbs

### Grade 4 — Food & Nutrition
- Mon: Nutrients intro — why we eat; 5 main nutrients
- Tue: Carbohydrates and fats — energy foods, sources, tests (iodine for starch)
- Wed: Proteins and vitamins — body-building foods, deficiency diseases
- Thu: Minerals and water — functions, sources; balanced diet concept
- Fri: Mixed — deficiency disease matching, food groups, healthy habits

### Grade 5 — The Digestive System
- Mon: Overview of digestion — what it is, why we need it, mouth
- Tue: Stomach and small intestine — gastric juices, enzymes, absorption of nutrients
- Wed: Large intestine, liver, pancreas — water absorption, bile, insulin
- Thu: Nutrition label reading, digestion timeline, common digestive problems
- Fri: Mixed — organ functions, enzyme names, complete flow from mouth to excretion

### Grade 6 — Separation of Substances
- Mon: Why we separate — mixtures, need for separation; hand-picking, winnowing, sieving
- Tue: Filtration and sedimentation — separating insoluble solids from liquids
- Wed: Evaporation and distillation — separating soluble solids/liquids
- Thu: Chromatography and magnetic separation; real-world applications
- Fri: Mixed — matching mixture to best separation method; multi-step separations

### Grade 7 — Fibre to Fabric (G7 level)
- Mon: Natural fibres — cotton, silk, wool; origin plants/animals
- Tue: Cotton: ginning → spinning → weaving; kharif crop, India's cotton belt
- Wed: Silk: sericulture, reeling, weaving; Mulberry silk vs Tasar/Eri
- Thu: Wool: shearing, scouring, carding, spinning; sheep breeds in India
- Fri: Mixed — synthetic vs natural, properties comparison, fabric identification

### Grade 8 — Metals & Non-metals
- Mon: Physical properties — lustre, malleability, ductility, conductivity; metals vs non-metals
- Tue: Chemical properties — reaction with oxygen (oxides), water, acids
- Wed: Reactivity series; displacement reactions; more/less reactive metals
- Thu: Alloys, corrosion, rust prevention; uses of metals in daily life
- Fri: Mixed — property identification, reaction prediction, non-metal properties (sulphur, carbon, etc.)

---

## Manifest Updates (after writing all 35 files)

For each grade, append 5 entries to `app/ui/questions/manifests/manifest-grade-N.json`:

```json
{ "file": "school/grade-N/science-w24-mon.json", "category": "school", "grade": N, "subject": "science", "level": 1, "weekNum": 24, "weekDay": "mon" },
{ "file": "school/grade-N/science-w24-tue.json", "category": "school", "grade": N, "subject": "science", "level": 1, "weekNum": 24, "weekDay": "tue" },
{ "file": "school/grade-N/science-w24-wed.json", "category": "school", "grade": N, "subject": "science", "level": 1, "weekNum": 24, "weekDay": "wed" },
{ "file": "school/grade-N/science-w24-thu.json", "category": "school", "grade": N, "subject": "science", "level": 1, "weekNum": 24, "weekDay": "thu" },
{ "file": "school/grade-N/science-w24-fri.json", "category": "school", "grade": N, "subject": "science", "level": 1, "weekNum": 24, "weekDay": "fri" }
```

**Note:** Grade 8 uses `"level": 2` not 1.

---

## Commit (after all 35 files + manifests)

```
git add app/ui/questions/school/grade-{2,3,4,5,6,7,8}/science-w24-*.json \
        app/ui/questions/manifests/manifest-grade-{2,3,4,5,6,7,8}.json
git commit -m "content(w24): grades 2-8 Science W24 — 35 files + manifests (C5 complete)"
git push
```

Then tell user: **"C5 done — Grade 2–8 Science W24 complete. 35 files, 525 questions. Ready for C6 (Hindi)."**

---

## What Comes After This Session

| Session | Scope | Files |
|---------|-------|-------|
| C6 | W24 Hindi, Grades 2–8 | 35 |
| C6b | W24 French, Grades 2–8 | 35 |
| C7 | W24 Grades 9–12 set2–set5 (all subjects) | 56 |

Full topic map for C6/C6b/C7 is in `sessions/PENDING-content-w24-all-grades.md`.

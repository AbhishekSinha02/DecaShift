# Feature: Content Expansion — Science, Hindi, French for Grades 2–8

**Priority:** P3 | **Type:** Content | **Complexity:** M | **Status:** Pending

## Goal
Add Science, Hindi, and French question sets for every grade from 2 to 8. Currently only Math exists for most grades (Grade 8 only has Science). This expansion gives each grade a minimum of 4 subjects — enough to make subject tab filtering (P2-T021) genuinely useful.

## Target File Count
| Grade | Math | Science | Hindi | French |
|-------|------|---------|-------|--------|
| 2     | ✅ exists | ➕ add | ➕ add | ➕ add |
| 3     | ✅ exists | ➕ add | ➕ add | ➕ add |
| 4     | ✅ exists | ➕ add | ➕ add | ➕ add |
| 5     | ✅ exists | ➕ add | ➕ add | ➕ add |
| 6     | ✅ exists | ➕ add | ➕ add | ➕ add |
| 7     | ✅ exists | ➕ add | ➕ add | ➕ add |
| 8     | ➕ add | ✅ exists | ➕ add | ➕ add |

**New files: 22 total** (21 + grade-8 math)

## Question Standards
- 10–12 questions per file
- 2–3 personalized questions per file using `{{userName}}` placeholder in word problems
- Difficulty: easy–medium for grades 2–5; medium for grades 6–8
- Accurate, NCERT-aligned content for Math, Science, Hindi; DELF A1–A2 aligned for French

## Subject Coverage per Grade
| Grade | Science | Hindi | French |
|-------|---------|-------|--------|
| 2 | Plants, animals, senses, weather | Swar/Vyanjan, basic words | Greetings, numbers 1–20, colors |
| 3 | Water cycle, rocks, food chains | Ling, Vachan, Vilom shabd | Animals, family, days of week |
| 4 | States of matter, magnets, habitats | Karak, Pratyay, Vilom | Body parts, avoir/être |
| 5 | Solar system, human body systems | Samas, Muhavre, Kaal | Food, adjectives, present tense |
| 6 | Cells, photosynthesis, Newton's laws | Paryayvachi, Sandhi, Ras | Articles, present tense verbs |
| 7 | Chemical reactions, DNA, electricity | Alankar, Viram chinh, Ras | Passé composé, negation |
| 8 | (exists) | Advanced grammar, nibandh, kavya | Futur simple, comparatives |

## Files to Create
```
app/ui/questions/school/
  grade-2/science.json, hindi.json, french.json
  grade-3/science.json, hindi.json, french.json
  grade-4/science.json, hindi.json, french.json
  grade-5/science.json, hindi.json, french.json
  grade-6/science.json, hindi.json, french.json
  grade-7/science.json, hindi.json, french.json
  grade-8/math.json, hindi.json, french.json
```

## manifest.json Updates
Add one entry per new file. No JS changes needed — manifest-driven architecture handles it automatically.

## Acceptance Criteria
- [ ] All 22 files created in correct paths
- [ ] manifest.json updated with all 22 entries
- [ ] Grade 2 school user sees 4 subject cards (Math, Science, Hindi, French)
- [ ] Grade 8 school user sees 4 subject cards (Math, Science, Hindi, French)
- [ ] Each file has ≥10 questions
- [ ] Each file has ≥2 questions with `{{userName}}` placeholder

## Dependencies
- P2-T021 (subject tab UI — shows tabs for these new subjects)
- P3-T015 ({{userName}} rendering — needed to personalize questions in these files)

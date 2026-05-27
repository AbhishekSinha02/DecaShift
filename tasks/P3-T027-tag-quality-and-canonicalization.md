# Feature: Tag Quality and Canonicalization

**Priority:** P3 | **Type:** Content / Data Quality | **Complexity:** S | **Status:** Pending

## Goal
Ensure every question has at least one meaningful topic tag, tags are consistent across
files (no `fraction` vs `fractions` vs `Fractions`), and a canonical tag vocabulary
exists for each subject/grade band so the topic filter (P3-T026) works reliably.

## Context (from testing notes)
Topic filter UI depends entirely on tag quality. If tags are absent, inconsistent, or
too granular, the pills won't be useful. This task is the prerequisite data-quality
pass before the filter UI ships.

## Problem
Current state of tags in question files:
- Some questions have `tags: []` (empty)
- Some have highly specific tags (`"unlike-denominators"`) that appear only once
- Capitalisation and pluralisation inconsistencies (`fraction` vs `Fractions`)
- No agreed vocabulary — tags were added ad-hoc per file

## Canonical Tag Vocabulary

### Math (Grade 2–8)
```
fractions, decimals, multiplication, division, addition, subtraction,
place-value, geometry, measurement, time, money, algebra, word-problems,
mental-math, number-sense, patterns, data-handling
```

### Science (Grade 2–8)
```
living-things, plants, animals, human-body, earth-science, matter,
forces-motion, light-sound, water-cycle, weather, environment, food-chain
```

### English (if applicable)
```
grammar, comprehension, vocabulary, spelling, punctuation, sentence-structure
```

### Hindi / French
```
vocabulary, grammar, reading, writing, conversation
```

## Rules
1. Every question must have 1–3 tags from the canonical list above
2. Tags are lowercase, hyphenated (no spaces, no capitals)
3. Avoid tags that apply to >80% of questions in a file (too broad to be useful)
4. Avoid tags that apply to only 1 question (too narrow to surface as a pill)
5. A question may have one specific sub-tag in addition to the canonical parent
   (e.g. `["fractions", "unlike-denominators"]` is fine — only the parent surfaces in pills)

## Deliverables
1. **Canonical tag list** finalized in `tasks/canonical-tags.json`
2. **Audit script** `tools/audit-tags.js` — reports questions with no tags,
   unknown tags, or over-specific tags
3. **Backfill** — run audit, fix all Grade 3 and Grade 5 files first
   (those are the test baseline grades)
4. **Going-forward rule** added to P3-T024 (AI generation pipeline) prompt template:
   "Tags must be from the canonical list"

## Acceptance Criteria
- [ ] `canonical-tags.json` created with Math + Science vocabulary
- [ ] `tools/audit-tags.js` runs and reports coverage stats
- [ ] Grade 3 and Grade 5 math + science files: 0 questions with empty tags
- [ ] No unknown tags in Grade 3 / 5 files after backfill
- [ ] P3-T024 prompt template updated to reference canonical tag list

## Files to Touch
- New: `tasks/canonical-tags.json`
- New: `tools/audit-tags.js`
- `questions/grade3/**` and `questions/grade5/**` — tag backfill

## Dependencies
- P3-T023 (content strategy — canonical tags are part of the quality rubric)
- P3-T024 (AI generation pipeline — updated prompt template uses canonical tags)
- P3-T026 (topic filter UI — blocked until tags are reliable)

# Feature: Content Expansion Tracking

**Priority:** P3 | **Type:** Content / Infrastructure | **Complexity:** S | **Status:** Pending

## Goal
Track content coverage across all grades and professional topics, define minimum
question targets, and build the process for continuously adding high-quality
questions without developer involvement.

## Current State (after v3.5 — 2026-05-26)

### Weekly file format (new architecture — BUG-005 fix)
Each subject per grade = 10 files (5 active W22 + 5 archived W21) × 15q each = 150q per subject

| Grade | Math | Science | Hindi | French | Total weekly Q |
|---|---|---|---|---|---|
| Grade 3 | ✅ 10 files (150q) | ✅ 10 files (150q) | ✅ 10 files (150q) | ✅ 10 files (150q) | **600q** |
| Grade 5 | ✅ 10 files (150q) | ✅ 10 files (150q) | ✅ 10 files (150q) | ✅ 10 files (150q) | **600q** |
| Grade 2 | ❌ not yet | ❌ not yet | — | — | 0 |
| Grade 4 | ❌ not yet | ❌ not yet | ❌ not yet | ❌ not yet | 0 |
| Grade 6 | ❌ not yet | ❌ not yet | ❌ not yet | ❌ not yet | 0 |
| Grade 7 | ❌ not yet | ❌ not yet | — | — | 0 |
| Grade 8 | ❌ not yet | ❌ not yet | — | — | 0 |
| **Weekly subtotal** | | | | | **1,200q** |

### Legacy flat files (old format — still active for untouched grades)
| File | Questions | Grade/Category |
|---|---|---|
| grade-2-math.json | 15 | Grade 2 |
| grade-4-math.json | 15 | Grade 4 |
| grade-6-math.json | 15 | Grade 6 |
| grade-7-math.json | 15 | Grade 7 |
| grade-8-science.json | 20 | Grade 8 |
| grade-9-math.json | 15 | Grade 9 |
| grade-10-math.json | 20 | Grade 10 |
| grade-11-math.json | 15 | Grade 11 |
| grade-12-cs.json | 20 | Grade 12 |
| college-web-dev.json | 20 | College |
| college-dsa.json | 20 | College |
| pro-azure-aks.json | 20 | Professional |
| pro-mlops.json | 20 | Professional |
| pro-devops.json | 15 | Professional |
| pro-python.json | 15 | Professional |
| pro-system-design.json | 15 | Professional |
| **Legacy subtotal** | **275** | |

**GRAND TOTAL: ~1,475 questions** (1,200 weekly + 275 legacy)

> ⚠️ Do NOT generate more weekly files until P3-T021 (curriculum map) is defined. Topics must follow a structured learning sequence, not be chosen ad-hoc. Test Grades 3+5 in the browser first.

## Minimum Coverage Targets

### School (Per Grade)
- [ ] 1 subject file with 15+ questions → ✅ All grades 2-12 now covered
- [ ] 2 subjects per grade (second subject e.g., science/english for all grades) — **NEXT PRIORITY**
- [ ] 30+ questions per grade total

### College
- [ ] 2 topics → ✅ Done (web-dev, dsa)
- [ ] Add: college-os.json (Operating Systems), college-dbms.json (Database Systems)
- [ ] Target: 4+ college topics

### Professional
- [ ] 5 topics → ✅ Done (azure-aks, mlops, devops, python, system-design)
- [ ] Add: pro-aws.json, pro-react.json, pro-sql-advanced.json
- [ ] Target: 8+ professional topics

## Content Quality Standards
Every question should have:
- `id` — unique, consistent pattern (g5m-001, g6m-001, etc.)
- `question` — clear, unambiguous
- `options` — 4 choices, one clearly correct, plausible distractors
- `correctIndex` — integer 0-3
- `explanation` — explains WHY the correct answer is right (not just restates it)
- `difficulty` — "easy" | "medium" | "hard"
- `tags` — 1-3 topic tags

## Admin Addition Process (Until P3-T007 is built)
1. Create a new JSON file following the schema above
2. Add it to `manifest.json`
3. Push to GitHub → auto-discovered on next tab open

## Acceptance Criteria
- [ ] All grades 2-12 have at least 1 subject file ✅ (done in v3.2)
- [ ] All grades have 15+ questions (done) → target 30+ questions
- [ ] Each grade has 2+ subjects (next milestone)
- [ ] College has 4+ topic files
- [ ] Professional has 8+ topic files
- [ ] This task file updated each time new content is added

## Confidence Score Impact
Currently: Content Depth 2/10
After v3.2 (295 questions): ~5/10
After 2 subjects/grade + 30q/grade: ~7/10
After 3 subjects/grade + 50q/grade: ~9/10

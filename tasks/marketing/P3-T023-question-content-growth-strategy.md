# Feature: Question Content Growth Strategy

**Priority:** P3 | **Type:** Product / Content | **Complexity:** M | **Status:** Pending

## Goal
Define a sustainable, long-term strategy for growing the question bank so that
users never run out of fresh content, quality stays consistent, and the coverage
map across grades/subjects/difficulty is intentional — not accidental.

## Problem
Right now, question files are added reactively: "Grade 3 Math needed → generate 80 questions."
There is no:
- Coverage map showing what's done vs. what's missing
- Quality standard that all questions must meet
- Freshness policy (when does a question feel stale?)
- Retirement policy (when do we remove or recycle questions?)
- Growth velocity target (how many questions/week sustains engagement?)

## Strategy Framework

### 1. Coverage Matrix
Build and maintain a spreadsheet/JSON tracking:
```
Grade × Subject × Difficulty → Target Count → Actual Count → Gap
```
Example targets per cell:
- Grade 2–5 core subjects (Math, English, Science): 50 questions/grade/subject
- Grade 6–8: 75/grade/subject
- Grade 9–12: 100/grade/subject
- Electives (Hindi, French, GK): 40/grade

### 2. Quality Rubric
Every question must pass before being committed:
- [ ] Factually accurate (verifiable source or curriculum alignment)
- [ ] One unambiguously correct answer
- [ ] Distractors are plausible but clearly wrong (not trick questions)
- [ ] Language level matches grade (Flesch-Kincaid grade level check)
- [ ] Explanation teaches, not just states the answer
- [ ] No repeated stem within same goal/week

### 3. Freshness and Rotation Policy
- Questions seen by a user in the last 30 days are deprioritized (handled by P3-T022)
- Questions with >90% correct rate across all users → retire or increase difficulty
- Questions with >80% skip/wrong rate → review for clarity or retire
- New content added weekly; each grade gets at least 7 new questions/week (1/day)

### 4. Growth Velocity Targets
| Phase | Users | Questions/week | Cumulative Target |
|---|---|---|---|
| Pre-launch | 0–100 | 20 | 500 |
| Growth | 100–1k | 50 | 2,000 |
| Scale | 1k–10k | 100 | 10,000 |

### 5. Content Ownership
- Define who authors questions: internal, AI-generated + reviewed, teacher-contributed
- Each question file has `source: "curated" | "ai-reviewed" | "teacher"` tag
- AI-generated questions must be human-reviewed before shipping

## Deliverables
1. **Coverage matrix** as a JSON file: `tasks/content-coverage-matrix.json`
2. **Quality rubric** finalized in this task file
3. **Content calendar** aligned with P3-T019 (weekly rotation)
4. **Velocity tracker** — running count of questions added per week

## Acceptance Criteria
- [ ] Coverage matrix JSON created with current state (actual counts) and targets
- [ ] Quality rubric agreed and documented
- [ ] Freshness/retirement thresholds defined
- [ ] Growth velocity targets confirmed for each phase
- [ ] P3-T024 (AI generation pipeline) can use this as its input spec

## Dependencies
- P3-T017 (weekly question sets — done, this strategy governs their content)
- P3-T019 (content calendar — pending, this strategy feeds the calendar)
- P3-T021 (curriculum progression — pending, this strategy sets the sequence)
- P3-T022 (question reuse/spaced practice — pending, uses retirement signals from here)
- P3-T024 (AI generation pipeline — this is the upstream spec)

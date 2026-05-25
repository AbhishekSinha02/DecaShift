# Feature: Category + Level Based Question Population

**Priority:** P1 | **Type:** Technical | **Complexity:** M | **Status:** Pending

## Goal
Questions shown to a user are filtered by their category (school/professional/etc.) and difficulty level. A Grade 5 student never sees MLOps questions.

## Acceptance Criteria
- [ ] `questions.json` entries have `category`, `level` (beginner/intermediate/advanced), and `targetGrades` (nullable array) fields
- [ ] Home screen shows only goals relevant to the user's category
- [ ] Within a goal, questions are filtered by user's level (default: beginner)
- [ ] User can manually change their level in profile settings
- [ ] Adding a new question to `questions.json` with correct category/level automatically appears for matching users — no code change needed
- [ ] Empty state shown gracefully if no questions match a filter

## Technical Notes
- Filter chain: `goalId` → `category` → `level` → `targetGrades` (if school student)
- Level progression: after completing a goal at current level with >80% accuracy, prompt user to level up
- Store `user.level` per goal (not one global level) — `{ "azure-aks": "intermediate" }`

## Dependencies
- P1-T006 (user category)
- P2-T001 (JSON-driven UI)

## Files to Touch
- `app/ui/questions.json` — add `category`, `level`, `targetGrades` fields to all entries
- `app/ui/goals.json` — add `category`, `levels` fields
- `app/ui/app.js` — `_getQuestionsForUser()` filter function
- `app/ui/storage.js` — store per-goal level in user profile

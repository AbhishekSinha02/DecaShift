# Feature: Efficient Question Addition System

**Priority:** P3 | **Type:** Functional + Technical | **Complexity:** M | **Status:** Pending

## Goal
Adding new questions to the app should take seconds, not an editing session. Support bulk import, AI-assisted generation, and a simple form UI.

## Methods to Support

### Method 1: Direct JSON Edit (existing)
- Edit `questions.json` → commit → deployed. Already works.

### Method 2: Admin Form UI (new)
- Simple form: question text, 4 options, correct answer, category, level, goal
- Submit saves to `questions.json` via a local admin page (not served publicly)

### Method 3: Bulk CSV Import (new)
- Upload a CSV with columns: question, option_a, option_b, option_c, option_d, correct (A/B/C/D), category, level, goalId
- Preview before import, then append to `questions.json`

### Method 4: AI-Assisted Generation (future — task P4)
- Paste a topic → get 10 questions in schema format → review → add

## Acceptance Criteria
- [ ] Admin form at `app/ui/admin.html` (separate page, not part of main app)
- [ ] Form validates all required fields before saving
- [ ] CSV upload parses and previews in a table before confirming
- [ ] Exported output is valid `questions.json` schema (downloadable)
- [ ] Question IDs auto-generated (`q` + timestamp + random suffix)
- [ ] Admin page protected by a simple password stored in config (not a real auth system)

## Technical Notes
- Admin page outputs a downloadable JSON file — user manually replaces `questions.json` and commits
- No server write needed — pure client-side generation + download
- CSV parse: pure JS, split on comma, handle quoted fields

## Dependencies
- P1-T008 (category/level schema must be finalized)

## Files to Touch
- New: `app/ui/admin.html`
- New: `app/ui/admin.js`
- New: `app/ui/admin.css`

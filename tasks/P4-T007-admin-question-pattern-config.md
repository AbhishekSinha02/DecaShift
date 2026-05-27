# Feature: Admin — Question Pattern and Difficulty Configuration

**Priority:** P4 | **Type:** Admin Tooling | **Complexity:** S | **Status:** Pending

## Goal
Let the admin configure — without code changes — the difficulty distribution for
weekly sets, the exam composition, and which difficulty ranks map to which day slots.
This is what turns "we have 5 sets" into a deliberate pedagogical arc that can be
tuned per grade or subject.

## Why Admin Controls This
Content strategy (P3-T023) sets the philosophy; this tool is the dial.
Different grades need different ramps:
- Grade 2–3: 4 easy + 1 medium (confidence-first)
- Grade 7–8: 2 easy + 2 medium + 1 hard (challenge arc)
- Grade 11–12: 1 easy + 2 medium + 2 hard (exam-prep intensity)

Changing this per grade today requires editing code. This task makes it a config.

## Config Schema

Stored as `config/weekly-pattern.json` (fetched from GitHub raw / Drive):
```json
{
  "default": {
    "weekSlots": [
      { "slot": 1, "difficulty": "easy",   "label": "Warm Up" },
      { "slot": 2, "difficulty": "easy",   "label": "Practice" },
      { "slot": 3, "difficulty": "medium", "label": "Build" },
      { "slot": 4, "difficulty": "medium", "label": "Extend" },
      { "slot": 5, "difficulty": "hard",   "label": "Challenge" }
    ],
    "exam": {
      "enabled": true,
      "questionCount": 12,
      "difficultyMix": { "easy": 0.30, "medium": 0.40, "hard": 0.30 }
    }
  },
  "grade2": {
    "weekSlots": [
      { "slot": 1, "difficulty": "easy",   "label": "Warm Up" },
      { "slot": 2, "difficulty": "easy",   "label": "Play" },
      { "slot": 3, "difficulty": "easy",   "label": "Practice" },
      { "slot": 4, "difficulty": "medium", "label": "Try Harder" },
      { "slot": 5, "difficulty": "medium", "label": "Challenge" }
    ],
    "exam": {
      "enabled": true,
      "questionCount": 8,
      "difficultyMix": { "easy": 0.50, "medium": 0.50, "hard": 0.00 }
    }
  }
}
```

Grade-specific config overrides `default`. App loads default + looks up grade override.

## Admin UI (in P4-T006 Admin Portal)

A "Weekly Pattern" panel in the admin portal's content module:
- Table: Grade → Slot 1…5 difficulty + label → Exam settings
- Edit inline: change difficulty for any slot, change exam question count / mix
- Save → writes to `config/weekly-pattern.json` in Drive (or commits to GitHub via API)
- "Preview" button: renders what home screen looks like for that grade with new pattern

## App Integration
- `app.js` fetches `weekly-pattern.json` during `init()` (cached in sessionStorage)
- `_renderHome()` uses pattern to:
  - Set `goal.difficultyRank` at load time (no need to store in manifest)
  - Determine which slots are free vs pro (slots > freeSlotLimit are locked)
  - Set slot labels on goal cards ("Warm Up", "Challenge", etc.)
- Exam composition in P3-T029 reads `exam.questionCount` and `exam.difficultyMix` from pattern

## Acceptance Criteria
- [ ] `config/weekly-pattern.json` schema defined and used by app
- [ ] Default pattern works if no grade-specific override exists
- [ ] Admin panel shows weekly pattern table, editable per grade
- [ ] Save writes to config file; app picks up change on next load (no redeploy needed)
- [ ] Grade 2 and Grade 7 patterns render correctly on home screen
- [ ] Exam question count and mix pulled from config, not hardcoded

## Files to Touch
- New: `config/weekly-pattern.json`
- `app/ui/app.js` — load + apply weekly-pattern config in `init()` and `_renderHome()`
- `admin/content.html` / `admin/admin.js` — Weekly Pattern panel

## Dependencies
- P3-T028 (weekly set gating — difficultyRank logic moves here from hardcode)
- P3-T029 (weekly exam — exam config consumed from this pattern)
- P4-T006 (admin portal — this panel lives inside it)

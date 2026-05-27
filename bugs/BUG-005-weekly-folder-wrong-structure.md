# BUG-005 — Weekly Questions in Separate Folder Instead of Subject Grade Folder

**Priority:** High | **Status:** Open | **Affects:** All school grade users

## Symptom

A separate `questions/weekly/` folder exists with one cross-grade JSON file per week
(`2026-W22.json`, `2026-W23.json`, …). This is wrong in two ways:

1. **Wrong location** — weekly question files are isolated from the subject they belong to,
   breaking the grade → subject → file hierarchy.
2. **Wrong granularity** — one file per week (mixed subjects, grade: null) means no
   per-day structure and no clean archiving. It shows awkwardly as a generic "This Week"
   card rather than as a natural part of Math, Science, Hindi, French, etc.

## Expected Behavior

Weekly day-files live **inside the same grade+subject folder** with no separate `weekly/` directory.

### Folder structure (example: Grade 5 Math)

```
questions/school/grade-5/
  math-w22-mon.json   ← current week Monday   (15 questions) [ACTIVE]
  math-w22-tue.json   ← current week Tuesday  (15 questions) [ACTIVE]
  math-w22-wed.json   ← current week Wednesday(15 questions) [ACTIVE]
  math-w22-thu.json   ← current week Thursday (15 questions) [ACTIVE]
  math-w22-fri.json   ← current week Friday   (15 questions) [ACTIVE]
  math-w21-mon.json   ← last week Monday      (15 questions) [ARCHIVED]
  math-w21-tue.json   ← last week Tuesday     (15 questions) [ARCHIVED]
  math-w21-wed.json   ← last week Wednesday   (15 questions) [ARCHIVED]
  math-w21-thu.json   ← last week Thursday    (15 questions) [ARCHIVED]
  math-w21-fri.json   ← last week Friday      (15 questions) [ARCHIVED]
```

Same pattern applies to every subject per grade: `science-w22-mon.json`, `hindi-w22-mon.json`,
`french-w22-mon.json`, etc.

### Rules

| File type | Count | Visibility |
|---|---|---|
| Current week (w-current) | 5 (Mon–Fri) | All 5 visible throughout the current week |
| Last week (w-previous) | 5 (Mon–Fri) | Visible as Archived / Past (accessible, labeled) |
| **Total per subject** | **10** | — |

- Each file: **15 questions**, same subject, same grade
- File naming convention: `{subject}-w{weekNum}-{day}.json`
  - day values: `mon`, `tue`, `wed`, `thu`, `fri`
- No `grade: null` cross-grade mixing inside these files
- When the week rolls over (Monday): current week files become archived, new week files become active

### JSON file header (example)

```json
{
  "goalId": "grade-5-math-w22-mon",
  "weekNum": 22,
  "weekDay": "mon",
  "weekStart": "2026-05-25",
  "weekEnd": "2026-05-31",
  "status": "active",
  "title": "Grade 5 Math — Mon, May 25",
  "category": "school",
  "grade": 5,
  "subject": "math",
  "questions": [ ... 15 questions ... ]
}
```

## What Needs to Be Done

1. **Delete** `questions/weekly/` folder (2026-W22.json through W26.json)
2. **Create** day-files inside each grade+subject folder following the naming convention
3. **Update manifest.json** — remove weekly entries, add new per-day file entries with `status` field
4. **Update app.js** — detect active vs archived files by `weekNum` + `status` instead of a separate
   weekly section; render current week's day-cards within the subject tab naturally
5. **Update P3-T017** task doc to reflect the corrected design

## Root Cause

P3-T017 was implemented with a cross-grade `questions/weekly/` folder design that was never
aligned with the user's intent. The actual requirement is per-subject, per-day files co-located
in the grade folder with a 5-active / 5-archived rolling window.

## Verification

1. Open Grade 5 Math tab — should see Mon–Fri cards for current week (15 Q each)
2. Last week's Mon–Fri cards visible below, labeled "Last Week" / archived
3. No "This Week" generic card separate from the subject tabs
4. Folder `questions/weekly/` does not exist
5. `manifest.json` has no `weekly/` entries

# Feature: Multi-File Questions Folder — Auto-Populate by Grade / Subject / Level

**Priority:** P1 | **Type:** Functional | **Complexity:** M | **Status:** Done ✅

## Goal
Replace the single `questions.json` file with a `questions/` folder containing one JSON file per grade+subject+level combination. When a user logs in, the app fetches only the files that match their grade and populates their goal list automatically — no code change needed to add new subjects or levels.

## Folder Structure
```
app/ui/questions/
├── grade6-math-level1.json
├── grade6-math-level2.json
├── grade6-science-level1.json
├── grade6-science-level2.json
├── grade8-math-level1.json
├── grade8-science-level1.json
├── grade10-math-level1.json
├── grade12-cs-level1.json
├── college-webdev-level1.json
├── college-dsa-level1.json
├── pro-azure-aks-level1.json
└── pro-mlops-level1.json
```

## File Naming Convention
```
{category}-{subject}-level{n}.json

where category = grade6 | grade8 | college | pro
      subject  = math | science | cs | webdev | dsa | azure-aks | mlops
      level    = 1 | 2 | 3
```

## Individual File Schema
Each file is a self-contained question set — it defines its own goal metadata + questions array:
```json
{
  "goalId": "grade6-math-level1",
  "name": "Math — Level 1",
  "subject": "math",
  "category": "school",
  "grade": "6",
  "level": 1,
  "description": "Basic arithmetic, fractions, decimals",
  "questions": [
    {
      "id": "g6-m1-q001",
      "question": "What is 3/4 + 1/2?",
      "options": ["1", "5/4", "1 1/4", "2"],
      "correctIndex": 2,
      "explanation": "3/4 + 2/4 = 5/4 = 1 1/4",
      "difficulty": "easy"
    }
  ]
}
```

## How Auto-Population Works
1. App maintains a `questions/manifest.json` — list of all available question files with their metadata (grade, subject, level)
2. On login, app reads `manifest.json`, filters by user's grade (for school users) or category (college/pro)
3. Fetches only the matching files — lazy loads, not all at once
4. Each fetched file becomes a goal card on the home screen

## `questions/manifest.json`
```json
[
  { "file": "grade6-math-level1.json",    "category": "school", "grade": "6",  "subject": "math",    "level": 1 },
  { "file": "grade6-science-level1.json", "category": "school", "grade": "6",  "subject": "science", "level": 1 },
  { "file": "grade8-math-level1.json",    "category": "school", "grade": "8",  "subject": "math",    "level": 1 },
  { "file": "college-dsa-level1.json",    "category": "college","grade": null, "subject": "dsa",     "level": 1 },
  { "file": "pro-azure-aks-level1.json",  "category": "professional","grade": null,"subject":"azure-aks","level":1}
]
```
Adding a new grade/subject = add one JSON file + one line in `manifest.json`. No HTML, no JS changes.

## Acceptance Criteria
- [ ] `questions/` folder exists with at least 3 files (grade6-math-level1, grade6-science-level1, pro-azure-aks-level1)
- [ ] `questions/manifest.json` exists and lists all available files
- [ ] Grade 6 user sees only grade 6 subjects on home screen (math + science cards)
- [ ] Professional user sees only professional goals (azure-aks, mlops)
- [ ] Adding a new file + manifest entry → appears on correct user's home without any JS change
- [ ] Each question file fetched independently (not bundled) — `fetch('./questions/grade6-math-level1.json')`
- [ ] Old `questions.json` and `goals.json` files removed or ignored (manifest is the new source of truth)
- [ ] College user with course = "dsa" sees college-dsa-level1, not math or pro goals

## Grade Matching Rule
- School user with grade "6" → fetch all manifest entries where `grade === "6"`
- College user → fetch all where `category === "college"` (course filter is a future enhancement)
- Professional user → fetch all where `category === "professional"`

## Dependencies
- P1-T008 (category+level filtering logic already in app.js — refactor, not rewrite)
- P1-T010 (if questions served from GitHub raw URLs, manifest path must be absolute)

## Files to Touch
- New: `app/ui/questions/` folder with question files
- New: `app/ui/questions/manifest.json`
- `app/ui/app.js` — replace `_loadData()` to fetch manifest → filter → fetch matched files
- `app/ui/goals.json` — **remove** (goals now defined inside each question file)
- `app/ui/questions.json` — **remove** (replaced by individual files)

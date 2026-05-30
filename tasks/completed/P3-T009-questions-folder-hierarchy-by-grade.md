# Feature: Questions Folder Hierarchy — Subfolders Per Category / Grade

**Priority:** P3 | **Type:** Architecture | **Complexity:** M | **Status:** ✅ Done

## Goal
Restructure the flat `questions/` folder into a nested hierarchy so adding new
question sets is as simple as dropping a JSON file in the right subfolder and
adding one line to `manifest.json`.

## Implemented Structure (nested)
```
app/ui/questions/
├── manifest.json           ← single source of truth; no GitHub API
├── school/
│   ├── grade-2/math.json
│   ├── grade-3/math.json
│   ├── grade-4/math.json
│   ├── grade-5/math.json
│   ├── grade-6/math.json
│   ├── grade-7/math.json
│   ├── grade-8/science.json
│   ├── grade-9/math.json
│   ├── grade-10/math.json
│   ├── grade-11/math.json
│   └── grade-12/computer-science.json
├── college/
│   ├── web-dev.json
│   └── dsa.json
└── professional/
    ├── azure-aks.json
    ├── mlops.json
    ├── devops.json
    ├── python.json
    └── system-design.json
```

## Architecture Decision: manifest.json over GitHub API
The original task description proposed GitHub Contents API recursive traversal.
This was rejected in favour of `manifest.json` as the single source of truth:

| | GitHub API | manifest.json |
|---|---|---|
| Network requests per user | 1 (API) + N files | 1 (manifest) + user files |
| Rate limiting | 60 req/hr anonymous | None |
| Works offline / localhost | No | Yes |
| Stability when folder changes | Breaks unexpectedly | Explicit, always clear |
| Adding content | Drop file → auto-appears | Drop file + 1 line in manifest |

**Adding content = 2-file commit: drop JSON + add one line to manifest.json.**

## manifest.json Schema
```json
[
  { "file": "school/grade-5/math.json", "category": "school", "grade": 5, "subject": "mathematics", "level": 1 },
  { "file": "college/dsa.json",         "category": "college", "grade": null, "subject": "dsa",     "level": 1 }
]
```

## Performance
Any user always makes exactly **2 network requests** regardless of total file count
(manifest.json + their single grade/category file). Adding 100 more files has zero
performance impact on existing users.

## app.js Changes
- `_loadManifest()` — GitHub API removed; fetches manifest.json from GitHub raw URL
  with `questions/manifest.json` as localhost fallback; caches in sessionStorage
- `_loadQuestionsForUser(user)` — simplified; calls `_filterManifest()` to get
  user-specific entries, fetches only those files, no dual-path branching
- `_fileMatchesUser()` — **deleted**; filtering now done purely on manifest metadata
  before any file is fetched

## Acceptance Criteria
- [x] All 18 question files moved into nested folder hierarchy via `git mv`
- [x] `manifest.json` updated with new relative paths (all 18 entries)
- [x] `_loadQuestionsForUser()` simplified — no `isAutoDiscovered` branch
- [x] `_fileMatchesUser()` removed
- [x] `file.title || file.name` fallback for schema compatibility
- [x] Localhost dev works via manifest.json with new paths
- [x] `sessionStorage` cache prevents re-fetching manifest on every page action

## Files Touched
- `app/ui/questions/manifest.json` — updated all paths to nested structure
- `app/ui/questions/school/grade-{2..12}/` — new subdirectories (git mv)
- `app/ui/questions/college/` — new subdirectory (git mv)
- `app/ui/questions/professional/` — new subdirectory (git mv)
- `app/ui/app.js` — `_loadManifest()`, `_loadQuestionsForUser()`, removed `_fileMatchesUser()`

## Dependencies
- P1-T013 (multi-file questions — done, this extends it)
- P1-T010 (GitHub raw URLs — done)

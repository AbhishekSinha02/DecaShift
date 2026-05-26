# Feature: Questions Folder Hierarchy — Subfolders Per Category / Grade

**Priority:** P3 | **Type:** Architecture | **Complexity:** M | **Status:** Pending

## Goal
Restructure the flat `questions/` folder into a nested hierarchy so adding new
question sets is as simple as dropping a JSON file in the right subfolder.
The app auto-discovers everything — no manifest.json edits needed.

## Current Structure (flat)
```
app/ui/questions/
├── manifest.json
├── grade-5-math.json
├── grade-8-science.json
├── grade-10-math.json
├── grade-12-cs.json
├── college-web-dev.json
├── college-dsa.json
├── pro-azure-aks.json
└── pro-mlops.json
```

## Target Structure (nested)
```
app/ui/questions/
├── manifest.json           ← still used as localhost fallback
├── school/
│   ├── grade-2/
│   ├── grade-3/
│   ├── grade-4/
│   ├── grade-5/
│   │   └── mathematics.json
│   │   └── science.json    ← add new subject = drop file here
│   ├── grade-6/
│   ├── grade-7/
│   ├── grade-8/
│   │   └── science.json
│   ├── grade-9/
│   ├── grade-10/
│   │   └── mathematics.json
│   ├── grade-11/
│   └── grade-12/
│       └── computer-science.json
├── college/
│   ├── web-dev.json
│   └── dsa.json
└── professional/
    ├── azure-aks.json
    └── mlops.json
```

## Auto-Discovery via GitHub Contents API (Recursive)
Replace single-folder API call with recursive folder traversal:
```js
async function _discoverFiles(path) {
  const r = await fetch(`https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${path}`);
  if (!r.ok) return [];
  const items = await r.json();
  const files = [];
  for (const item of items) {
    if (item.type === 'file' && item.name.endsWith('.json') && item.name !== 'manifest.json') {
      files.push({ file: item.path.replace('app/ui/questions/', '') });
    } else if (item.type === 'dir') {
      files.push(...await _discoverFiles(item.path));
    }
  }
  return files;
}
```

## manifest.json Update for Localhost Fallback
```json
[
  { "file": "school/grade-5/mathematics.json", "category": "school", "grade": 5, "subject": "mathematics", "level": 1 },
  { "file": "school/grade-8/science.json",      "category": "school", "grade": 8, "subject": "science",     "level": 1 },
  ...
]
```

## Acceptance Criteria
- [ ] All existing question files moved into new folder hierarchy
- [ ] Existing `manifest.json` updated with new relative paths
- [ ] GitHub API auto-discovery traverses subfolders recursively
- [ ] `_fetchQuestionFile` works with relative paths like `school/grade-5/mathematics.json`
- [ ] Adding a new file (e.g., `school/grade-5/english.json`) appears automatically on GitHub Pages
- [ ] Localhost dev still works via manifest.json with new paths
- [ ] v2/ snapshot unaffected (frozen copy, has its own flat structure)

## Migration Notes
- Question files themselves don't change — only their location changes
- `goalId`, `category`, `grade` fields inside each file are unchanged
- GitHub raw URLs just get the new path prefix

## Dependencies
- P1-T013 (multi-file questions — done, this extends it)
- P1-T010 (GitHub raw URLs — done)

## Files to Touch
- `app/ui/questions/` — move files into subfolders
- `app/ui/questions/manifest.json` — update file paths
- `app/ui/app.js` — recursive `_discoverFiles()`, update `_fetchQuestionFile` path handling

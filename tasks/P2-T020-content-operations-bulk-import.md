# Feature: Content Operations — Admin Panel + Bulk Import

**Priority:** P2 | **Type:** Infrastructure + Tool | **Complexity:** M | **Status:** Pending

## Goal
Break the developer-only content bottleneck. Anyone with basic computer skills —
a teacher, a subject expert, the app owner — should be able to add questions
without touching git, JSON, or the terminal.

Content is the engagement engine. It cannot be gated behind a developer workflow.

---

## Current Bottleneck (F5)
Adding one question today:
1. Open VS Code
2. Find the right JSON file
3. Edit JSON manually (error-prone)
4. Run git add, commit, push
5. Wait for GitHub Pages to deploy

This is a developer task. A subject expert cannot do it.
At 50+ questions/file × 24 files (after language + expansion) = 1,200+ questions
to write, edit, and maintain — this workflow does not scale.

---

## Solution: Two-Mode Content Entry

### Mode 1 — In-App Admin Panel (for single question additions)
A hidden admin screen accessible only when `user.isAdmin === true`.

URL: `#admin` or admin panel button visible only to admin users.

```
┌─────────────────────────────────────────────┐
│ Add Question                                 │
│                                              │
│ File: [ school/grade-5/math.json     ▼ ]    │
│                                              │
│ Question: ________________________           │
│                                              │
│ Option A: ____  Option B: ____              │
│ Option C: ____  Option D: ____              │
│                                              │
│ Correct: [ A ▼ ]                            │
│                                              │
│ Explanation: ____________________           │
│                                              │
│ [ Preview ]  [ Save to Drive ]              │
└─────────────────────────────────────────────┘
```

"Save to Drive" appends the question to a staging JSON file in the user's Drive.
Staged questions are manually reviewed and committed to git in a batch.
This gives content creation speed without bypassing git review.

### Mode 2 — CSV Bulk Import (for batch additions from teachers/spreadsheets)
CSV format:
```csv
file,question,optionA,optionB,optionC,optionD,correctIndex,explanation
school/grade-5/math.json,"What is 15 × 4?","60","45","70","50",0,"15 × 4 = 60"
```

Import screen: upload CSV → preview table → validate (check for missing fields,
duplicate IDs) → export as JSON → download ready-to-commit file.

This lets a teacher fill a Google Sheet and export to CSV. The app converts it
to the correct JSON structure without any developer involvement.

---

## Admin User Flag
```js
// In user profile:
{ isAdmin: true }  // Set manually in Drive file by app owner
```

Admin panel is not accessible by URL guessing — it checks `user.isAdmin` first.
Not a security feature — just prevents accidental access.

---

## Acceptance Criteria

- [ ] Admin panel screen hidden behind `user.isAdmin` check
- [ ] File selector shows all manifest.json entries
- [ ] Form fields: question, 4 options, correct answer index, explanation
- [ ] Preview renders question as it will appear in quiz
- [ ] "Export to JSON" downloads the new question as a JSON snippet to paste
- [ ] CSV import screen: upload file → parse → preview → validate → export JSON
- [ ] CSV validation catches: missing fields, invalid correctIndex (not 0-3)
- [ ] Exported JSON matches question file schema exactly

## Files to Touch
- `app/ui/app.js` — admin screen render + navigation
- `app/ui/index.html` — admin panel HTML (hidden div)
- `app/ui/styles.css` — admin panel styles

## Elevates
- P3-T007 (admin form + CSV bulk import — same goal, promoted to P2)

## Dependencies
- P3-T009 (nested folder structure — done; admin panel uses same paths)
- Needed before P3-T011 (content expansion to 50q/file) can scale

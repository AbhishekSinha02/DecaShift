# Refactor: One File Per User + One File Per Session in Google Drive

**Priority:** P1 | **Type:** Technical | **Complexity:** S | **Status:** Done ✅ (v2.0)

## Supersedes
P1-T009 (migrate to Google Sheets) — **cancel that task**. This approach stays with Drive files but fixes the shared-file problem. Do P1-T011 instead of P1-T009.

## Goal
Every user gets their own file. Every session gets its own file. No file is shared between users. No file is ever appended to — only created. This makes writes fast, isolated, and safe.

## Why Individual Files
- Appending to a shared file requires reading it first, then rewriting — slow and collision-prone
- Individual files are write-once (sessions) or create-once (users) — no read-before-write
- A corrupt session file affects only that session, not all data
- Finding one user's data = open one file, not scan a list

## Format: JSON (not CSV)
JSON wins here because:
- Sessions contain a nested `responses` array — flat CSV cannot represent this cleanly
- Each file is a single self-contained object — JSON is the natural fit
- File creation speed is identical for both formats in Apps Script
- Easier to read and debug in Drive without downloading

## Drive Folder Structure
```
Drive Root (1EENu6cQzED2mjSdWCuXRLYYQ_BBxbPTp)/
├── users/
│   ├── user_abc123.json       ← one file per user
│   └── user_def456.json
└── sessions/
    ├── user_abc123/           ← subfolder per user
    │   ├── sess_001.json      ← one file per session
    │   └── sess_002.json
    └── user_def456/
        └── sess_003.json
```

## File Schemas

**users/user_{userId}.json**
```json
{
  "userId": "user_abc123",
  "name": "Abhishek Sinha",
  "email": "mail@example.com",
  "mobile": "+919876543210",
  "role": "software-engineer",
  "company": "Acme",
  "registeredAt": "2025-05-25T10:00:00Z",
  "updatedAt": "2025-05-25T10:00:00Z"
}
```

**sessions/user_{userId}/sess_{sessionId}.json**
```json
{
  "sessionId": "sess_001",
  "userId": "user_abc123",
  "goalId": "azure-aks",
  "mode": "practice",
  "score": 7,
  "total": 10,
  "accuracy": 0.7,
  "totalDurationSeconds": 420,
  "sessionStart": "2025-05-25T10:00:00Z",
  "sessionEnd": "2025-05-25T10:07:00Z",
  "responses": [
    {
      "questionId": "q001",
      "selectedIndex": 0,
      "correctIndex": 0,
      "isCorrect": true,
      "durationSeconds": 37
    }
  ]
}
```

## Acceptance Criteria
- [ ] `saveUser()` in `Code.gs` creates `users/user_{userId}.json` — overwrites if same userId (profile update)
- [ ] `saveSession()` in `Code.gs` creates `sessions/user_{userId}/sess_{sessionId}.json` — write-once, never overwritten
- [ ] No shared `users.json` or `sessions.json` files anywhere
- [ ] No CSV files created anywhere
- [ ] If `user_{userId}.json` already exists (returning user), overwrite only that file
- [ ] Subfolder `sessions/user_{userId}/` created automatically if it doesn't exist
- [ ] Test: register 2 different users → 2 separate files in `users/`
- [ ] Test: complete 2 sessions → 2 separate files in `sessions/user_{userId}/`
- [ ] Test: re-register same email → only `user_{userId}.json` updated, no duplicate files

## Dependencies
- Cancels P1-T009 (do not implement Sheets migration)
- `storage.js` is unchanged — only `Code.gs` changes

## Files to Touch
- `app/google-apps-script/Code.gs` — rewrite `saveUser()` and `saveSession()`

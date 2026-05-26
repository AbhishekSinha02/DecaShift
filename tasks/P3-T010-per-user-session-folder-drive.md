# Feature: Per-User Session Folder in Drive

**Priority:** P3 | **Type:** Infrastructure | **Complexity:** S | **Status:** ✅ Already Implemented

## Goal
Every user's sessions are stored in their own subfolder in Google Drive so admin
can browse sessions per-user, data is isolated, and Drive stays organized at scale.

## Current Drive Structure
```
DecaShift Drive Folder (1EENu6cQzED2mjSdWCuXRLYYQ_BBxbPTp)
├── accounts/
│   └── acc_{emailHash}.json        ← one per user (cross-device login)
├── users/
│   └── user_{userId}.json          ← one file per user profile
├── sessions/
│   └── {userId}/                   ← per-user subfolder ✅ already done
│       └── sess_{sessionId}.json   ← one file per session
└── logs/
    └── log_{timestamp}.json
```

## Status: Already Implemented
`Code.gs` lines 99–108 already create `sessions/{userId}/` subfolder:
```js
function saveSession(session) {
  const root           = _rootFolder();
  const sessionsFolder = _subFolder(root, 'sessions');
  const userFolder     = _subFolder(sessionsFolder, session.userId); // ← per-user folder
  const filename       = 'sess_' + session.sessionId + '.json';
  userFolder.createFile(filename, JSON.stringify(session, null, 2), MimeType.PLAIN_TEXT);
}
```

## Remaining Work
- [ ] Verify Drive folder actually contains `sessions/{userId}/` structure after a real session
- [ ] Add `accounts/{userId}/` structure so each user's account file is also in their own subfolder (optional enhancement for privacy)
- [ ] Consider: add an `index.json` per user folder listing all their session IDs for fast lookup
- [ ] Document this structure in README.md

## Future Enhancement: User Root Folder
```
DecaShift Drive Folder/
└── users/
    └── {userId}/
        ├── profile.json
        ├── streak.json           ← synced streak
        └── sessions/
            └── sess_{id}.json
```
This full per-user folder structure would make Drive browsable and
remove the need for separate `accounts/`, `users/`, `sessions/` folders.

## Dependencies
- P1-T011 (individual Drive files — done, this is an extension)

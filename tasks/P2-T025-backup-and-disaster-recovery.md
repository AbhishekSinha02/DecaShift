# Feature: Backup and Disaster Recovery Plan

**Priority:** P2 | **Type:** Infrastructure / Reliability | **Complexity:** M | **Status:** Pending

## Goal
Define and implement a backup strategy so that no user loses their session history,
streak data, or profile — even if Google Drive, Apps Script, or the app's storage
layer fails or is accidentally corrupted.

## Problem
All user data lives in a single Google Drive folder controlled by a single Apps Script
deployment. There is currently:
- No second copy of user data
- No alert if data writes fail silently
- No way for a user to export their own history
- No recovery playbook if the Apps Script web app URL breaks or Drive quota is exceeded

## Risk Inventory

| Risk | Likelihood | Impact | Current Mitigation |
|---|---|---|---|
| Apps Script URL rotates / breaks | Low | High | None |
| Drive storage quota exceeded | Medium | High | None |
| User JSON file accidentally deleted | Low | High | None |
| localStorage cleared (browser wipe) | High | Medium | Drive re-hydrates |
| Admin accidentally corrupts users.json | Low | High | None |
| Apps Script daily quota exceeded | Medium | Medium | localStorage fallback |

## Backup Strategy

### Layer 1 — Client-Side Cache (Already Exists)
localStorage holds the last known session state as a fallback.

### Layer 2 — Periodic Drive Snapshot (New)
- Apps Script triggered daily (time-based trigger): copy `users/` and `sessions/` folders
  to `decashift-backup/YYYY-MM-DD/`
- Retain last 30 days of snapshots
- Add a backup health check endpoint: `?action=getBackupStatus` returns last backup date

### Layer 3 — User Data Export (New)
- Add "Export my data" button to profile screen
- Downloads a single JSON file with all user sessions, streak data, profile
- Works entirely from localStorage if Drive is unreachable
- Allows users to keep their own copy independent of the app

### Layer 4 — Admin Recovery Playbook (New)
Document in this task file:
1. How to restore from a Drive snapshot
2. How to re-deploy Apps Script if the URL breaks
3. How to repair a corrupted users.json
4. How to handle Drive quota overflow (clean up old sessions, archive)

## Acceptance Criteria
- [ ] Daily snapshot trigger configured in Apps Script (time-based)
- [ ] Backup folder structure: `decashift-backup/YYYY-MM-DD/users/ + sessions/`
- [ ] `getBackupStatus` endpoint returns `{ lastBackup: "2025-05-27", snapshotCount: 14 }`
- [ ] "Export my data" button in profile → downloads `decashift-export-{userId}.json`
- [ ] Recovery playbook written in this file (Steps 1–4 above documented in detail)
- [ ] Admin dashboard (P4-T001 / P4-T006) shows last backup date

## Files to Touch
- `app/google-apps-script/Code.gs` — add `createDailySnapshot()` and `getBackupStatus()`
- `app/ui/app.js` — add "Export my data" to profile screen
- `app/ui/storage.js` — `exportUserData()` function

## Dependencies
- P1-T011 (Drive session files — done)
- P1-T012 (Drive account persistence — done)
- P2-T024 (session management audit — do first, fixes sync gaps before backup layer)

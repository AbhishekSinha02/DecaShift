# Feature: Session Management Confidence Audit

**Priority:** P2 | **Type:** Technical / Reliability | **Complexity:** M | **Status:** Pending

## Goal
Establish full confidence in how every user session is captured, stored, synced, and
recovered. Right now session data flow (Drive sync → localStorage fallback → cross-device
login) is coded but never systematically verified — we need to document the lifecycle and
test every path, especially failure paths.

## Problem
- It's unclear what happens to a session if Drive sync fails mid-quiz
- Cross-device login relies on Drive JSON files — if those are malformed, a user
  could lose all history
- No documented recovery path if localStorage and Drive get out of sync
- No visibility into how many active users have incomplete or missing session data

## Session Lifecycle to Document + Verify

### Happy Path
```
User starts quiz
  → questionStartTime set (ISO string)
  → Each response saved to state.responses[]
User submits last answer
  → sessionEnd set
  → saveSession() called
    → POST to Apps Script → writes session JSON to Drive/sessions/
    → On success: also write to localStorage as cache
    → On failure: write to localStorage only, set syncPending flag
```

### Failure Paths to Test
| Scenario | Expected Behavior | Verified? |
|---|---|---|
| Drive unreachable (offline) | Save to localStorage, flag for retry | ☐ |
| Apps Script quota exceeded | Silent fallback, no data loss | ☐ |
| User closes tab mid-quiz | Partial session recoverable from localStorage | ☐ |
| User logs in on new device | Drive fetch restores session history | ☐ |
| localStorage cleared | Drive fetch re-hydrates history | ☐ |
| Drive JSON file corrupted | Graceful empty state, no crash | ☐ |
| Duplicate session IDs | Latest wins, no silent overwrite | ☐ |

### Data Integrity Checks
- sessionId is always unique (crypto.randomUUID())
- userId is stable across devices (Drive-persisted)
- All response timestamps are ISO strings, not timestamps
- score/total/accuracy are recalculated server-side (don't trust client)

## Deliverables
1. **Session lifecycle diagram** in this file (ASCII)
2. **Test checklist** covering all failure scenarios above
3. **Code fixes** for any gaps found (retry queue, sync-pending indicator, data validation)
4. **Sync status indicator** on profile/home: "Synced ✓" or "Saved locally (sync pending)"

## Acceptance Criteria
- [ ] All failure paths in table above manually tested and marked verified
- [ ] syncPending flag implemented and visible in UI
- [ ] Session recovery tested: clear localStorage → re-login → history restored from Drive
- [ ] No data loss in any tested failure scenario
- [ ] Cross-device login tested on two separate browsers

## Files to Touch
- `app/ui/storage.js` — audit + add retry queue, sync status flag
- `app/ui/app.js` — add sync status indicator to home/profile screen
- `app/google-apps-script/Code.gs` — verify session write is idempotent

## Dependencies
- P1-T011 (Drive session files — done)
- P1-T012 (Drive account persistence — done)
- P1-T004 (session persistence — done)

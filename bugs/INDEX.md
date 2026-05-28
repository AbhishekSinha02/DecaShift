# Donnibo — Bug Tracker

| Bug | Description | Severity | Status |
|---|---|---|---|
| BUG-001 | — | — | ✅ Fixed |
| BUG-002 | — | — | ✅ Fixed v3.1 |
| BUG-003 | — | — | ✅ Fixed v3.1 |
| BUG-004 | Greeting showed full email instead of name | Low | ✅ Fixed |
| BUG-005 | Weekly questions in wrong folder (manifest mismatch) | High | ✅ Fixed |
| [BUG-006](BUG-006-incognito-device-data-divergence.md) | Incognito / cross-device data divergence — streak, questions, login behave differently | High | ✅ Fix A done (2026-05-28) — streak syncs to Drive after every session · Fix B long-term (Upstash Redis) |
| [BUG-007](BUG-007-grade12-subject-tabs-missing.md) | Grade 9–12 subject tabs missing | High | ✅ Fixed |
| [BUG-008](BUG-008-day-card-null-label.md) | Day card shows NULL label for weekly sets | Low | ✅ Fixed |
| [BUG-009](BUG-009-grade-not-shown-in-settings.md) | Grade not pre-populated in Settings → Profile — defaults to Grade 2 | Medium | ✅ Fixed (P2-T030 restructure, 2026-05-29) |

---

## BUG-006 Quick Summary

Streak, questions, and login state differ between regular browser, incognito, and other devices.

**Root cause:** Two data stores (localStorage + Google Drive) that fall out of sync.
- Regular browser reads localStorage (fast, current)
- Incognito / other device reads Drive (slower, potentially days behind)

**Recommended fix:** Option A (30 min) — sync streak to Drive after every session.
**Full fix:** Option B (1 session) — migrate to Upstash Redis, remove Drive OAuth.

See full bug report for details.

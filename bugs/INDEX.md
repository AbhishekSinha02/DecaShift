# Donnibo — Bug Tracker

| Bug | Description | Severity | Status |
|---|---|---|---|
| BUG-001 | — | — | ✅ Fixed |
| BUG-002 | — | — | ✅ Fixed v3.1 |
| BUG-003 | — | — | ✅ Fixed v3.1 |
| BUG-004 | Greeting showed full email instead of name | Low | ✅ Fixed |
| BUG-005 | Weekly questions in wrong folder (manifest mismatch) | High | ✅ Fixed |
| [BUG-006](BUG-006-incognito-device-data-divergence.md) | Incognito / cross-device data divergence — streak, questions, login behave differently | High | 🟡 Fix A planned (sync streak after every session) · Fix B long-term (Upstash Redis) |

---

## BUG-006 Quick Summary

Streak, questions, and login state differ between regular browser, incognito, and other devices.

**Root cause:** Two data stores (localStorage + Google Drive) that fall out of sync.
- Regular browser reads localStorage (fast, current)
- Incognito / other device reads Drive (slower, potentially days behind)

**Recommended fix:** Option A (30 min) — sync streak to Drive after every session.
**Full fix:** Option B (1 session) — migrate to Upstash Redis, remove Drive OAuth.

See full bug report for details.

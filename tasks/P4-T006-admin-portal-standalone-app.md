# Feature: Admin Portal — Dedicated Standalone Web App

**Priority:** P4 | **Type:** Internal Tooling | **Complexity:** L | **Status:** Pending

## Goal
Build a dedicated admin web app — separate from the student-facing app — that gives
the content team and operator full visibility into users, sessions, content health,
and system status, with tools to manage questions, review content, and trigger
maintenance operations.

## Why Separate from P4-T001
P4-T001 covers basic admin metrics (user counts, session counts) as a hidden page
within the main app. This task goes further:
- Standalone deployment (its own URL/subdirectory, not embedded in the student app)
- Full content management (upload questions, review AI-generated content)
- Operational tools (trigger backups, inspect session data, manage user accounts)
- Safe separation: admin code never ships to students, reducing attack surface

## Portal Structure

```
admin/
  index.html         # Login + dashboard home
  users.html         # User management
  content.html       # Question management + upload
  sessions.html      # Session viewer + export
  health.html        # System health: Drive, sync status, backup status
  admin.js           # Shared logic
  admin.css          # Admin-specific styles (can reuse CSS vars)
```

## Modules

### 1. Dashboard (index.html)
- Total users, DAU/WAU/MAU
- Sessions today / this week
- Content health: files missing from manifest, files below min question count
- Last backup date + status (from P2-T025)
- Sync error count (sessions with syncPending flag)

### 2. User Management (users.html)
- Table: userId, name, email, grade, category, signup date, last active, sessions count
- Search / filter by grade, category, date range
- View individual user: profile, full session history, streak data
- Actions: reset password, delete account (with confirmation)

### 3. Content Management (content.html)
- Question browser: filter by grade/subject/week/difficulty
- Upload new questions (JSON paste or file upload)
- Question review queue (AI-generated questions from P3-T024 awaiting approval)
- Coverage matrix heatmap: grade × subject → question count (green = target met, red = gap)
- Edit existing questions inline

### 4. Session Viewer (sessions.html)
- All sessions with filters: date range, userId, goalId, accuracy range
- Drill into a session: all responses, timing, question text
- Export filtered sessions as CSV
- Flag anomalies: sessions with 0 responses, sessions with implausible timing

### 5. System Health (health.html)
- Drive connection status (ping Apps Script health endpoint)
- Last backup date and snapshot count (from P2-T025)
- Total Drive storage used
- Apps Script daily quota remaining
- Recent error log (Apps Script execution log summary)
- Manual trigger: "Run backup now"

## Security
- Protected by admin token (checked in Apps Script `doGet`/`doPost` handler)
- Token stored in Apps Script Script Properties — never committed to git
- Admin portal not linked from the student app (obscurity + token auth)
- All write operations require token; read operations also gated

## Deployment
- Lives at `admin/` subdirectory of the same GitHub Pages site
- OR deployed to a separate GitHub Pages branch `gh-pages-admin`
- Access URL is not publicly advertised

## Acceptance Criteria
- [ ] All 5 modules functional with real Drive data
- [ ] Admin token auth working (invalid token returns 403)
- [ ] Question upload flow: paste JSON → validate → preview → commit to Drive
- [ ] Session export CSV working for filtered range
- [ ] Coverage matrix heatmap renders with current question counts
- [ ] Backup status visible and "Run backup now" trigger works
- [ ] No student-facing code changed by admin portal addition

## Files to Touch
- New: `admin/index.html`, `admin/users.html`, `admin/content.html`,
  `admin/sessions.html`, `admin/health.html`
- New: `admin/admin.js`, `admin/admin.css`
- `app/google-apps-script/Code.gs` — add admin endpoints (getUsers, getSessions,
  getContentHealth, uploadQuestions, getBackupStatus, triggerBackup)

## Dependencies
- P4-T001 (admin metrics — absorb and extend; P4-T001 becomes a subset of this)
- P2-T024 (session management audit — sync status needed for health dashboard)
- P2-T025 (backup plan — backup status + trigger lives here)
- P3-T024 (AI question pipeline — review queue lives in content module)
- P2-T020 (content operations — this task supersedes and extends it)

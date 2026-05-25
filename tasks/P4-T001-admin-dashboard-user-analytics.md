# Feature: Admin Dashboard — User + Attempt Analytics

**Priority:** P4 | **Type:** Technical | **Complexity:** M | **Status:** Pending

## Goal
A private admin view showing total users, sessions, popular goals, accuracy distributions, and daily active users — pulled directly from the Google Drive JSON files.

## Acceptance Criteria
- [ ] Admin page at `app/ui/admin.html` (separate from user-facing app)
- [ ] Protected by a hardcoded admin password (env-level, not committed — loaded from a `config.js` that is gitignored)
- [ ] Reads `users/users.json` and `sessions/sessions.json` from Google Drive via Apps Script GET endpoint
- [ ] Metrics shown:
  - Total registered users
  - Total sessions completed
  - Daily active users (last 7 days chart)
  - Top 5 goals by attempts
  - Average accuracy per goal
  - Users by category (pie-like bar chart)
  - Streak distribution (histogram)
- [ ] All charts: pure SVG/Canvas, no library
- [ ] Exportable as CSV (admin only)
- [ ] Auto-refresh every 5 minutes

## Technical Notes
- Add `doGet` action to Apps Script: `getAnalytics` — aggregates and returns summary JSON
- Admin page makes a GET request: `APPS_SCRIPT_URL?action=getAnalytics&token=ADMIN_TOKEN`
- Admin token checked server-side in Apps Script (stored in Script Properties)

## Dependencies
- P1-T002 (users exist in Drive)
- P1-T007 (sessions auto-saved)

## Files to Touch
- `app/google-apps-script/Code.gs` — add `getAnalytics()` handler
- New: `app/ui/admin.html`
- New: `app/ui/admin.js`

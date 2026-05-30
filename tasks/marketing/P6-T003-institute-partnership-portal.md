# Feature: Institute Partnership Portal

**Priority:** P6 | **Type:** Functional | **Complexity:** L | **Status:** Pending

## Goal
Schools and coaching institutes can create a branded instance of DecaShift for their students — with their own question banks, branding, and a private leaderboard.

## What Institutes Get
- Custom subdomain or URL parameter: `?institute=dps-delhi`
- Institute logo + name in header
- Private question bank (only their students see it)
- Institute-wide leaderboard
- Admin access to see their student analytics
- Bulk student onboarding (CSV upload of student emails)

## Acceptance Criteria
- [ ] Institute config loaded from `institutes.json`: `{ id, name, logoUrl, goalIds[], adminEmail }`
- [ ] If `?institute=X` in URL, app loads institute branding and question bank
- [ ] Institute-specific questions have `instituteId` field in `questions.json`
- [ ] Institute admin sees only their students' data in admin dashboard
- [ ] Bulk onboarding: admin uploads CSV of student emails → invites sent (Apps Script email trigger)
- [ ] Institute students see their school's private leaderboard + public leaderboard

## Notes
- This is a revenue feature — institutes pay a flat monthly fee (separate from individual Pro plans)
- Design should support 100+ institutes without code changes — pure config-driven
- Branding: logo URL only (no custom CSS per institute in Phase 1)

## Dependencies
- P4-T001 (admin dashboard)
- P5-T003 (leaderboard)
- P6-T001 (teacher content contribution)

## Files to Touch
- New: `app/ui/institutes.json`
- `app/ui/app.js` — institute config detection on init
- `app/ui/index.html` — institute branding slots (logo, name)
- `app/google-apps-script/Code.gs` — institute-scoped data queries

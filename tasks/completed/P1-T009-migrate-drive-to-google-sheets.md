# Refactor: Replace Google Drive JSON Files with Google Sheets for User Data

**Priority:** P1 | **Type:** Technical | **Complexity:** S | **Status:** Pending

## Goal
Write user registrations and session data directly to a Google Sheet (rows) instead of JSON files in Drive. Simpler, queryable, and viewable without downloading anything.

## Why
- Drive JSON files require downloading + parsing to view data
- Google Sheets is a built-in UI for the data — no admin dashboard needed initially
- Sheets supports filtering, sorting, charts out of the box
- Easier to share with collaborators (just share the Sheet)
- No folder permission complexity

## Target Sheet Structure

**Sheet 1 — "users"**
| userId | name | email | mobile | role | company | registeredAt | schemaVersion |

**Sheet 2 — "sessions"**
| sessionId | userId | goalId | score | total | accuracy | totalDurationSeconds | sessionStart | sessionEnd | mode | schemaVersion |

## Acceptance Criteria
- [ ] `Code.gs` rewritten to use `SpreadsheetApp` instead of `DriveApp`
- [ ] A single Google Sheet ID stored as a Script Property in Apps Script (not hardcoded)
- [ ] `saveUser()` appends a row to the "users" sheet; duplicate email updates existing row
- [ ] `saveSession()` appends a row to the "sessions" sheet
- [ ] Headers auto-created if sheet is empty (first run)
- [ ] `schemaVersion` column added to both sheets (set to `"1.0"` for all current records)
- [ ] Old Drive folder and Drive-reading code removed from `Code.gs`
- [ ] Existing `APPS_SCRIPT_URL` in `storage.js` unchanged — only the Apps Script internals change
- [ ] Test: submit registration form → row appears in Sheet within 5 seconds

## How to Set Up the Sheet
1. Create a new Google Sheet in Drive
2. Copy the Sheet ID from the URL (`/spreadsheets/d/SHEET_ID/edit`)
3. In Apps Script: Extensions → Script Properties → add `SHEET_ID = <your-id>`
4. Redeploy the Web App (new deployment)

## Dependencies
- None — self-contained backend change, `storage.js` is untouched

## Files to Touch
- `app/google-apps-script/Code.gs` — full rewrite of storage logic

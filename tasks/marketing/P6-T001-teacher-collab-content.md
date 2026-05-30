# Feature: Teacher Collaboration — Content Contribution

**Priority:** P6 | **Type:** Functional | **Complexity:** M | **Status:** Pending

## Goal
Teachers can submit question sets for their subject/grade level. Approved content appears in the app for all matching students. Gives teachers a low-friction way to contribute and credit them for their content.

## Flow
1. Teacher fills a form: name, school/org, subject, grade level, questions (CSV or JSON)
2. Submission goes to a review queue (Google Sheet via Apps Script)
3. Admin reviews and approves via admin dashboard
4. Approved questions added to `questions.json` (manual merge for now, automated later)
5. Teacher credited: `"contributed_by": "Ms. Sharma, DPS Delhi"` field in question schema

## Acceptance Criteria
- [ ] Teacher submission form at `app/ui/contribute.html` (separate page)
- [ ] Form fields: name, email, institution, subject, grade level, question CSV upload
- [ ] CSV preview before submit
- [ ] Submission confirmed with "Thank you — your questions are under review" message
- [ ] Submissions stored in a Google Sheet (separate from user data)
- [ ] Admin can approve/reject from admin dashboard
- [ ] Approved questions show contributor credit on the explanation card

## Dependencies
- P3-T007 (question addition system — defines the schema)
- P4-T001 (admin dashboard — review queue lives there)

## Files to Touch
- New: `app/ui/contribute.html`
- New: `app/ui/contribute.js`
- `app/google-apps-script/Code.gs` — `saveContribution()` action
- `app/ui/index.html` — "Contribute Questions" link in footer

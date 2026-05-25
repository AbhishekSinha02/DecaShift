# Feature: Multi-Language / Localization Support

**Priority:** P4 | **Type:** Technical | **Complexity:** M | **Status:** Pending

## Goal
Support UI in multiple languages so the app reaches non-English users — starting with Hindi, then expanding. Questions can also be translated per language.

## Phase 1 — UI Strings (Launch with Hindi + English)
- All UI labels, buttons, messages, errors translated
- Language picker in profile settings
- Stored in `user.language`

## Phase 2 — Translated Questions
- `questions.json` entries gain a `translations: { hi: { question, options, explanation } }` object
- If translation exists for user's language, use it; else fall back to English

## Acceptance Criteria
- [ ] Language toggle (EN / HI to start) in profile and onboarding
- [ ] All static strings in UI switch language without page reload
- [ ] Question text, options, and explanation translate if available
- [ ] Language preference persisted across sessions
- [ ] Adding a new language requires only a new JSON file — no code change
- [ ] RTL support not required in Phase 1 (Hindi is LTR)

## Technical Notes
- Translations stored in `app/ui/lang/en.json`, `app/ui/lang/hi.json`
- `t(key)` helper function: returns string from current language JSON
- On language switch: re-render current screen
- String keys: `reg.title`, `quiz.submit`, `result.excellent`, etc.

## Dependencies
- P2-T001 (JSON-driven UI must be clean before adding i18n layer)

## Files to Touch
- New: `app/ui/lang/en.json`
- New: `app/ui/lang/hi.json`
- New: `app/ui/i18n.js`
- `app/ui/app.js` — replace hardcoded strings with `t()` calls
- `app/ui/index.html` — language picker

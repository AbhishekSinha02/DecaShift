# P2-T022 — Remove Regional Language from Signup

## Problem

Regional language selection currently appears during the signup flow. This:
- Makes the app feel India-specific from the first interaction, limiting international appeal
- Adds friction to signup for users who don't need or want a regional language
- Regional language is an optional personalisation preference, not a signup requirement

## Goal

Remove the regional language step from signup entirely. Move it to the user profile settings page where it belongs alongside other optional preferences.

## What to Change

- **Signup flow**: Remove regional language step/field completely — no mention of it during onboarding
- **Profile settings**: Add a "Regional Language" dropdown (same options as before) under a "Learning Preferences" or "Languages" section
- The selection behaviour is unchanged — selecting a language adds that subject tab; clearing it removes the tab
- Default: no regional language selected (user opts in via profile, not forced at signup)

## Acceptance Criteria

- [ ] No regional language field appears during signup or the welcome onboarding flow
- [ ] Profile settings page has a "Regional Language" selector with the same options (Hindi, Marathi, Tamil, Telugu, Kannada, Bengali)
- [ ] Selecting/clearing from profile updates the subject tabs on home screen immediately
- [ ] Existing users who had a regional language set during signup are unaffected (value persists in their profile)

## Complexity: S (< 1 day)

**Why:** Remove one field from signup form; add one field to profile settings. The underlying storage and tab-rendering logic already exists.

## Dependencies

- Depends on: P3-T018 (regional language feature — done), P2-T017 (profile page — pending, can ship independently)
- No downstream dependencies blocked

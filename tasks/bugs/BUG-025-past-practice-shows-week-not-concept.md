---
id: BUG-025
severity: Medium
status: FIXED
title: Past Practice header rows show "Week N" instead of concept name
---

## Problem

Under each subject tab, the Past Practice section groups older cards into rows.
The row headers display "Week 21", "Week 22", etc. instead of the concept name
(e.g. "Fractions & Decimals", "Algebra Intro").

## Root Cause

`_topicKeyFromGoal()` and `_topicLabel()` check `g.conceptId` first, but the weekly
JSON content files do not include a `conceptId` field — so `g.conceptId` is always
`undefined`. The fallback fires immediately and produces "Week N" labels.

The concept name is available in the `description` field of every weekly file:
  "Fractions & Decimals — Day 1 of 5"
  "Algebra Intro — Last Week Day 5"

The concept is the substring before ` — `.

## Fix

Added two helpers in `app-home.js`:
- `_conceptFromDesc(desc)` — extracts concept name before ` — ` in description
- `_conceptSlug(text)` — converts concept name to a stable group key slug

Updated fallback chain in both `_topicKeyFromGoal` and `_topicLabel`:
  conceptId (if present) → description-derived concept → Week N → "Practice"

No data file changes needed.

## Affected file

`app/ui/js/app-home.js`

# BUG-010 — Avatar Not Implemented (Shows Letter Initial Only)

**Severity:** High
**Status:** ✅ Resolved by E-006 (commit ffdc1a8) — header avatar renders the level-based Donnibo stage SVG, with letter fallback if the asset fails

## Symptom

Settings → Appearance → Show Avatar is toggled ON. Nothing changes on the home screen.
The "avatar" is a circular div (`user-avatar`) showing only the first letter of the user's name.
No growth character, no visual identity, no Donnibo avatar visible anywhere in the app.

## What Was Intended

P3-T004 (Avatar Growth System) defines a 6-stage Donnibo mascot (SVG) that grows as the
user's streak and accuracy improve. The avatar is meant to be the central visual identity —
the user sees themselves growing.

## What Was Built

A placeholder `<div class="user-avatar" id="user-avatar">?</div>` in the home header chip
that gets the first letter of `user.name` set via `_renderHome()`. That is all.
The avatar toggle in settings has no effect on anything visible.

## Root Cause

P3-T004 was specced but never implemented. The designer SVG assets were never created.
The toggle in settings was wired in anticipation of the feature but the feature doesn't exist.

## Fix Path

**Interim (P1-T017):** Replace the letter-in-circle with a premium styled avatar —
gradient background keyed to user initial, growth ring showing streak progress.
This ships in 1 session with no SVG design work.

**Full fix (P3-T004):** Commission Donnibo character SVG from designer,
implement 6 growth stages based on streak + accuracy milestones.

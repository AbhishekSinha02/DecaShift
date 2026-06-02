# ENH-005 — Rename "Needs Work" badge to something encouraging

**Priority:** High (immediate, 10 min fix)
**Effort:** XS
**Audience:** All grades, especially Grade 2-8

## Why

The result screen shows three badge labels:
- ≥80%: "Excellent" ✓
- ≥60%: "Good" ✓
- <60%: "Needs Work" ✗

"Needs Work" is educational admin language. It's the kind of thing a teacher writes on a returned test to mark it for corrections. For a 10-year-old who already knows they did poorly, seeing "Needs Work" is demoralizing — not motivating.

Duolingo replaces failure with "You can do it!" Kahoot uses "Nice try!" The goal is to keep the student coming back tomorrow, not to accurately characterize today's performance.

## Proposed replacements

| Option | Tone |
|---|---|
| "Keep Going 💪" | Action-oriented, motivating |
| "Rising Star ⭐" | Aspirational, identity-building |
| "Almost There →" | Forward-looking |
| "Building Up 🌱" | Connects to the "see yourself grow" brand |

**Recommendation:** "Keep Going 💪" — clear, simple, not patronizing.

## Fix

**File:** `app/ui/js/app-quiz.js` line 437

```js
// OLD
badge.textContent = 'Needs Work'; badge.className = 'result-badge badge-needs-work';

// NEW
badge.textContent = 'Keep Going 💪'; badge.className = 'result-badge badge-needs-work';
```

Also update the badge-needs-work CSS class if it uses a harsh color (red → orange or amber instead).

## Acceptance

Getting less than 60% shows "Keep Going 💪" (or chosen alternative) instead of "Needs Work".

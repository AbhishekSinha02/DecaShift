# BUG-024 — Subject tabs flush against left edge — no horizontal padding

**Severity:** Low (cosmetic — looks unpolished on every screen)
**Found by:** User report 2026-06-03
**Status:** ✅ FIXED — commit pending
**File:** `app/ui/css/styles-app.css` — `.subject-tabs`

## What's wrong

`.subject-tabs` had `padding: 8px 0 8px` — zero left/right padding. The first tab
pill touched the left edge of the screen with no breathing room.

## Fix applied

```css
/* before */
padding: 8px 0 8px;

/* after */
padding: 8px 16px;
```

16px matches the standard horizontal inset used by `.app-header` (padding: 0 16px)
and `.home-content` (padding: 12px 16px), keeping everything visually aligned.

## Acceptance

- First subject tab has 16px gap from the left edge on mobile.
- Last tab has 16px gap from the right edge.
- Horizontal scroll still works when tabs overflow the container width.

# BUG-014 — App version shows v3.9 instead of v4.3

**Severity:** Medium
**Found by:** UX Audit 2026-06-03 (Settings → About & Help)
**File:** `app/ui/screens/screen-settings.html` line 202

## What's wrong

```html
<span class="settings-help-value">v3.9</span>
```

The app underwent a full rebuild (P2-T037, P1-T019, P1-T020 etc.) and is running v4.3 code per git commits. Settings still shows v3.9. Any user who checks the version (teachers, tech-savvy parents) sees a stale number — erodes trust.

## Fix

Update the version string to `v4.3` in `screen-settings.html`.

## Acceptance

Settings → About & Help → App Version shows `v4.3`.

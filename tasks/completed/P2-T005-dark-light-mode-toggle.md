# Feature: Light Mode / Dark Mode Toggle

**Priority:** P2 | **Type:** Technical | **Complexity:** S | **Status:** Pending

## Goal
Users can switch between dark (default) and light themes. Preference is saved and respected on every return visit.

## Acceptance Criteria
- [ ] Toggle button visible in header on all screens
- [ ] Light mode has a clean white/grey palette (not just dark mode inverted)
- [ ] Transition between modes is smooth (CSS transition on background/color)
- [ ] System preference (`prefers-color-scheme: light`) applied on first visit if no saved preference
- [ ] Preference saved to localStorage and user profile
- [ ] All components (cards, inputs, buttons, badges) look correct in both modes
- [ ] No white flash on load (apply class before paint using inline script in `<head>`)

## Technical Notes
- Use a `data-theme="light"` attribute on `<html>` element
- Override CSS variables inside `[data-theme="light"] { --bg: #f8fafc; ... }`
- Inline script in `<head>`: `document.documentElement.dataset.theme = localStorage.getItem('decashift_theme') || 'dark'`

## Light Mode Variables
```css
[data-theme="light"] {
  --bg: #f8fafc; --surface: #ffffff; --surface-2: #f1f5f9;
  --text: #0f172a; --muted: #64748b; --border: rgba(0,0,0,0.08);
}
```

## Dependencies
- None

## Files to Touch
- `app/ui/index.html` — theme toggle button + inline head script
- `app/ui/styles.css` — light mode variable overrides
- `app/ui/app.js` — `toggleTheme()` function

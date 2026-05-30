# Feature: Colorful Student Theme

**Priority:** P3 | **Type:** UX / Design | **Complexity:** M | **Status:** Pending

## Goal
Add a vibrant, colorful theme option designed for younger students (Grade 2–8)
where the current dark/professional aesthetic feels too cold and the light mode
isn't distinctive enough.

## Problem
Current themes:
- **Dark** — works well for professionals and older students
- **Light** — clean but generic, still feels like a "work app"
- **Gap** — a Grade 3 student picking math questions doesn't feel welcomed by either

## Solution: Student (Color) Theme

### Palette: "Ocean" (example)
```css
[data-theme="student"] {
  --bg:      #eef6ff;   /* light sky blue background */
  --surface: #ffffff;
  --accent:  #2563eb;   /* deeper blue */
  --success: #16a34a;
  --error:   #dc2626;
  --text:    #1e3a5f;
  --muted:   #64748b;
  --border:  #bfdbfe;
}
```

### Alternative: "Sunshine" (warmer option for younger kids)
```css
[data-theme="student"] {
  --bg:      #fffbeb;   /* warm cream */
  --surface: #ffffff;
  --accent:  #d97706;   /* amber */
  --success: #16a34a;
  --error:   #dc2626;
  --text:    #78350f;
  --muted:   #92400e;
  --border:  #fcd34d;
}
```

## UX Changes for Student Theme
- Rounded corners (--radius: 16px, up from 12px)
- Slightly larger font sizes for answer cards
- Progress bar in a more vivid green
- Streak flame is larger / more animated
- Question cards have a subtle colored left-border by subject (blue=math, green=science)

## Theme Selection
Options:
1. **Auto** — detect user grade, auto-apply student theme for Grade 2–8
2. **Manual** — add "Student" option in the theme cycle (Dark → Light → Student → Dark)
3. **Profile-based** — save theme preference per user profile

**Recommendation:** Option 2 (manual toggle). Auto-applying by grade feels presumptuous
and breaks when a parent or teacher is using the same account.

## Theme Toggle Update
Current toggle: Dark ↔ Light
New toggle: cycle through Dark → Light → Student (Color) → Dark
Update the emoji in the toggle button to match: 🌙 / ☀️ / 🎨

## Acceptance Criteria
- [ ] Student theme palette defined in CSS with 3 variables blocks
- [ ] Theme persists in localStorage (same key `decashift_theme`, new value `'student'`)
- [ ] Toggle button cycles through all 3 themes
- [ ] All screens (landing, auth, home, quiz, result) look correct in student theme
- [ ] Mobile looks correct in student theme at 375px

## Files to Touch
- `app/ui/styles.css` — add `[data-theme="student"]` block
- `app/ui/app.js` — update `toggleTheme()` to cycle 3 themes

## Dependencies
- P2-T005 (dark/light toggle — done, this extends it)

## Priority Note
**This is P3 — not blocking launch.** The existing dark/light toggle works for all users.
The student theme improves engagement for Grade 2–8 users specifically, which becomes
relevant after the first 1,000 users when we can measure which user segments are churning.

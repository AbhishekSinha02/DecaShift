# Feature: Cross-Page UI Consistency + Kid-Friendly Default Theme

**Priority:** P2 | **Type:** UX / Design | **Complexity:** M | **Status:** Pending

## Goal
Make the app visually consistent and welcoming across every screen, and automatically
apply a warm, colorful theme for school users (Grade 2–8) instead of forcing them to
choose between a black and white experience that kids find off-putting.

## Problem
Kids' direct feedback: the dark theme feels "scary" and the light theme feels like a
spreadsheet. Neither makes a Grade 3 student excited to open the app. Additionally,
brand colors, font sizes, header styles, and card layouts vary slightly between the
landing page, auth screens, home, quiz, and result — eroding trust and making the
app feel unfinished.

## Scope

### 1. Cross-Page UI Consistency Audit
- Audit every screen (landing, sign-in/up, home, quiz, result) for:
  - Header height and logo placement
  - Font scale (heading / body / mono)
  - Card radius, shadow, and border color
  - Button sizes and icon alignment
  - Footer / nav consistency
- Document deviations and fix them in one pass

### 2. Auto Kid-Friendly Theme for School Users
- When a user's profile `category === 'school'` and grade is 2–8, apply the student
  palette by default on first login (override system dark preference)
- User can still manually cycle themes, preference is saved
- Student palette: warm cream/amber (see P3-T012 "Sunshine" palette):
  ```css
  [data-theme="student"] {
    --bg:      #fffbeb;
    --surface: #ffffff;
    --accent:  #d97706;
    --success: #16a34a;
    --error:   #dc2626;
    --text:    #78350f;
    --muted:   #92400e;
    --border:  #fcd34d;
    --radius:  16px;
  }
  ```
- Theme toggle cycles: Dark → Light → Student 🎨 → Dark

### 3. Branding Anchors Across All Pages
- Consistent logo/wordmark in top-left on every page
- Same tagline treatment ("Answer. Track. Improve. Repeat.")
- Consistent accent color usage — no pages using ad-hoc hex values outside CSS vars

## Acceptance Criteria
- [ ] UI audit doc listing all deviations fixed
- [ ] Student theme auto-applied on first login for school Grade 2–8 users
- [ ] Theme preference saved and respected across sessions
- [ ] All 5 screens (landing, auth, home, quiz, result) pass visual consistency check
- [ ] Mobile 375px passes for all screens in all 3 themes
- [ ] Theme toggle button shows 🌙 / ☀️ / 🎨 correctly

## Files to Touch
- `app/ui/styles.css` — add `[data-theme="student"]` block, fix cross-page deviations
- `app/ui/app.js` — auto-apply theme in `init()` based on user grade/category

## Dependencies
- P2-T005 (dark/light toggle — done, this extends it)
- P2-T014 (branding SVG/logo — do in parallel, feeds consistent logo asset here)
- P3-T012 (colorful student theme — this task elevates and partially implements it)

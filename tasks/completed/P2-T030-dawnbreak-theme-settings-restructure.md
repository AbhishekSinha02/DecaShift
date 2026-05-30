# Feature: 5-Theme System + Settings Restructure (6 Sections + Avatar Toggle)

**Priority:** P2 | **Type:** UI / UX | **Complexity:** M | **Status:** Pending

> A parent in a school WhatsApp group sees a screenshot of the app.
> She has 3 seconds to decide if it looks trustworthy enough for her child.
> The current dark-grey default reads "developer tool." The Dawnbreak theme reads
> "this was made for my kid." One visual decision, two completely different conversion rates.
>
> **Scope update (2026-05-28):** All 5 themes ship together. Dawnbreak is the headline.
> The theme selector in Settings → Appearance is how users switch between all five.
> Architecture cost is the same — CSS variables already power everything.

---

## Why This Exists — Tied to 5K User Goal

**The 5K goal lives or dies on first impressions and word-of-mouth.**

Parents are the buyers for Grade 2–10. They are not the users — but they control the install.
A parent who sees the app on another parent's phone either forwards the link or doesn't.
The current theme does not pass the "3-second parent screenshot test."

The Dawnbreak theme (deep indigo + golden yellow) reads:
- Aspirational and premium — not toy-like, not corporate
- Warm and energetic — not sterile or dark
- Distinct from every Indian EdTech competitor (Byju's: blue+white, Vedantu: purple+white)

**Settings restructure is a trust signal.** A cluttered single-page settings modal reads
"built in a weekend." Six clearly labelled sections reads "thoughtfully designed product."
Parents who explore settings before trusting an app with their child's data need to see order.

**Decision filter check:**
- Moves toward 5K users? ✅ First-impression conversion for parents
- Fixes F1 (content)? ❌ (not this task)
- Creates shareable moment? ✅ Parent screenshots the home screen — it needs to look worth sharing
- Works on ₹8,000 Android phone on 4G? ✅ CSS-only — zero performance cost

---

## Feasibility Note — Why This Is Easy

The existing app is already 100% CSS-variable-driven. Every `background`, `color`,
`border` in the app reads from `--bg`, `--surface`, `--accent` etc.
`[data-theme="light"]` already proves the pattern — it's just 7 overridden variables.

Adding 3 more themes = 3 more CSS blocks. The JS toggle changes from binary (dark/light)
to a 5-option `_setTheme(name)` call. No component changes. No HTML structural changes.
This is the cheapest visual transformation in the codebase.

**Complexity reality: S–M** — CSS work is S (small). Settings UI restructure is M (medium).

---

## The 5-Theme System

### All Five Themes + CSS Variables

```css
/* ── THEME 1: Dark (existing default) ──────────────── */
:root {
  --bg:          #0f1117;
  --surface:     #1a1d27;
  --surface-2:   #252836;
  --accent:      #3b82f6;
  --accent-dim:  rgba(59,130,246,0.12);
  --text:        #f1f5f9;
  --muted:       #64748b;
  --border:      rgba(255,255,255,0.08);
  --font-head:   'Syne', sans-serif;
  --font-body:   'DM Sans', sans-serif;
  --font-mono:   'DM Mono', monospace;
}

/* ── THEME 2: Light (existing) ──────────────────────── */
[data-theme="light"] {
  --bg:          #f8fafc;
  --surface:     #ffffff;
  --surface-2:   #f1f5f9;
  --text:        #0f172a;
  --muted:       #64748b;
  --border:      rgba(0,0,0,0.10);
  --accent-dim:  rgba(59,130,246,0.08);
  /* accent stays #3b82f6 — same blue */
}

/* ── THEME 3: Dawnbreak (new — RECOMMENDED) ─────────── */
[data-theme="dawnbreak"] {
  --bg:          #1A1040;   /* deep indigo */
  --surface:     #2D2060;   /* purple card */
  --surface-2:   #3A2880;   /* elevated card */
  --accent:      #FBBF24;   /* golden yellow */
  --accent-dim:  rgba(251,191,36,0.12);
  --text:        #F5F3FF;   /* lavender white */
  --muted:       #A78BFA;   /* soft violet */
  --border:      rgba(76,59,154,0.6);
  --font-head:   'Nunito', sans-serif;
  --font-body:   'Inter', sans-serif;
  --font-mono:   'DM Mono', monospace;
}

/* ── THEME 4: Sunrise (new) ─────────────────────────── */
[data-theme="sunrise"] {
  --bg:          #FFFBF0;   /* warm cream */
  --surface:     #FFF3DC;   /* light amber card */
  --surface-2:   #FFE9C0;   /* deeper amber */
  --accent:      #F59E0B;   /* amber */
  --accent-dim:  rgba(245,158,11,0.12);
  --text:        #1C1917;   /* near-black */
  --muted:       #78716C;   /* warm grey */
  --border:      rgba(229,213,160,0.8);
  --font-head:   'Nunito', sans-serif;
  --font-body:   'Inter', sans-serif;
  --font-mono:   'DM Mono', monospace;
}
/* Sunrise needs light-mode input overrides */
[data-theme="sunrise"] input,
[data-theme="sunrise"] select,
[data-theme="sunrise"] textarea {
  background: var(--surface);
  color: var(--text);
}
[data-theme="sunrise"] select option { background: var(--surface); color: var(--text); }

/* ── THEME 5: Ocean Focus (new) ─────────────────────── */
[data-theme="ocean"] {
  --bg:          #0F172A;   /* deep navy */
  --surface:     #1E293B;   /* slate card */
  --surface-2:   #263346;   /* elevated slate */
  --accent:      #38BDF8;   /* sky blue */
  --accent-dim:  rgba(56,189,248,0.12);
  --text:        #F8FAFC;   /* near-white */
  --muted:       #94A3B8;   /* cool grey */
  --border:      rgba(51,65,85,0.8);
  --font-head:   'Syne', sans-serif;  /* keep Syne — premium feel */
  --font-body:   'DM Sans', sans-serif;
  --font-mono:   'DM Mono', monospace;
}
```

### Why Nunito for Dawnbreak + Sunrise Only

`Syne` is precise and modern — right for Dark, Light, and Ocean (adult/professional feel).
`Nunito` has rounded terminals — psychologically warmer and friendlier — right for
Dawnbreak and Sunrise (Grade 2–8, younger learners, parent approval).
`DM Mono` stays across all 5 themes for stats, timers, and scores — consistency matters
where numbers live.

### Design SVG Mockups

All 3 new themes have been designed and approved as SVGs:
- `design/themes/theme-1-dawnbreak.svg` — approved by user (2026-05-28)
- `design/themes/theme-2-sunrise.svg`
- `design/themes/theme-3-ocean.svg`

Each SVG shows: Landing page · Home screen · Settings + Signup.

---

## Theme Auto-Apply on First Login

```js
function _autoApplyTheme(userGrade) {
  if (localStorage.getItem('decashift_theme')) return; // user already chose — respect it
  const grade = parseInt(userGrade, 10);
  const auto  = (grade >= 2 && grade <= 8)  ? 'dawnbreak'
              : (grade >= 9 && grade <= 12)  ? 'ocean'
              :                                'dark';        // college / professional
  _setTheme(auto);
}
```

Called once at the end of signup (after grade is set). Never called again — user choice
in Settings always wins.

---

## The Settings Theme Selector (Appearance Sub-Screen)

Replaces the existing ☀️/🌙 binary toggle button entirely:

```
Settings → Appearance → Theme

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  ● Dawnbreak │  │  ○ Sunrise   │  │  ○ Ocean     │
│  Deep indigo │  │  Warm cream  │  │  Deep navy   │
│  + gold      │  │  + amber     │  │  + sky blue  │
│  Grade 2–8   │  │  Light mode  │  │  Grade 9–12  │
│  Recommended │  │              │  │  Focused     │
└──────────────┘  └──────────────┘  └──────────────┘
┌──────────────┐  ┌──────────────┐
│  ○ Dark      │  │  ○ Light     │
│  Original    │  │  Classic     │
│  default     │  │  light mode  │
└──────────────┘  └──────────────┘

Selected theme: border highlighted in --accent color
```

Tapping any tile calls `_setTheme('dawnbreak' | 'sunrise' | 'ocean' | 'dark' | 'light')`.
Change is instant — no reload. User sees the app repaint in real time.

```js
function _setTheme(name) {
  document.documentElement.dataset.theme = name;
  localStorage.setItem('decashift_theme', name);
  _renderThemeSelector(); // re-render tiles to show new selection
}
```

---

## The JS Changes (Replacing Binary Toggle)

**Before (binary toggle):**
```js
function _toggleTheme() {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('decashift_theme', next);
  _updateThemeBtns(next);
}
function _updateThemeBtns(theme) {
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  });
}
```

**After (5-theme selector):**
```js
const THEMES = {
  dawnbreak: { label: 'Dawnbreak', desc: 'Deep indigo + gold', grade: '2–8' },
  sunrise:   { label: 'Sunrise',   desc: 'Warm cream + amber', grade: '2–5' },
  ocean:     { label: 'Ocean',     desc: 'Deep navy + blue',   grade: '9–12' },
  dark:      { label: 'Dark',      desc: 'Original default',   grade: 'All' },
  light:     { label: 'Light',     desc: 'Classic light mode', grade: 'All' },
};

function _setTheme(name) {
  document.documentElement.dataset.theme = name;
  localStorage.setItem('decashift_theme', name);
  _renderThemeSelector();
}

function _initTheme() {
  const saved = localStorage.getItem('decashift_theme') || 'dark';
  document.documentElement.dataset.theme = saved;
}
```

The old `.theme-toggle-btn` click handler is removed. Theme changes only happen
through Settings → Appearance tiles (or `_autoApplyTheme()` at first login).

---

## Google Fonts Update

Add Nunito to the existing Google Fonts import in `index.html`:

```html
<!-- Before -->
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&family=DM+Mono&display=swap" rel="stylesheet">

<!-- After -->
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&family=DM+Mono&family=Nunito:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

Nunito + Inter are only applied in Dawnbreak and Sunrise themes via `--font-head` and `--font-body`.
Dark, Light, Ocean themes continue using Syne + DM Sans unchanged.

---

---

## Settings Restructure — 6 Sections

### Current State (Problem)

All settings are in a single scrollable modal. Password change, grade change, language
selection, avatar toggle, theme toggle — all in one long list. First-time parents see
this and either scroll past everything or close it confused.

### Target State — 6 Sub-Screens

Settings becomes a **menu screen** with 6 tiles. Each tile opens its own sub-screen
with a back button. No scrolling through unrelated options.

```
Settings (menu screen)
│
├── 👤  My Profile          → name, profile photo (future), city, grade/role
├── 🔐  Account & Security  → email (read-only), change password, linked Google, delete account
├── 📚  Learning Preferences→ default subject, notification time, timer on/off, language
├── 🎨  Appearance          → theme (Dawnbreak / Dark / Light), avatar ON/OFF, font size (S/M/L)
├── 📍  My City             → city override, partner listings for your city
└── ℹ️  About & Help        → version, install app (PWA guide), contact, privacy, terms
```

### Each Section's Contents

**My Profile** (was: profile edit section)
- Display name (editable)
- Grade / Role dropdown (Grade 2–12, College, Professional)
- City (links to My City section)
- Language (for regional language questions — moved from signup)

**Account & Security** (was: scattered across modal)
- Email address (display only — cannot be changed after signup)
- Change Password (current → new → confirm)
- Google Account linked: Yes/No + link/unlink button
- Delete Account (danger zone, requires typing "DELETE")

**Learning Preferences**
- Default subject tab (Math / Science / Hindi / French / All)
- Timer: ON / OFF toggle
- Push notifications: time picker (e.g. "Remind me at 7:30 PM")
- Regional language: dropdown (move from signup — see P2-T022)

**Appearance**
- Theme: 3 tiles — Dark, Light, Dawnbreak (highlighted as "Recommended for kids")
- Avatar: ON / OFF toggle (see section below)
- Font size: Small / Medium / Large (accessibility — important for Grade 2–4)

**My City**
- City: auto-detected or manual override dropdown (20 cities)
- "Your local partners" — shows partner listing for city (feeds into P3-T032)
- "Students from your city this week" — city-specific activity count

**About & Help**
- App version + last updated date
- Install App on your device (PWA guide — feeds P2-T033)
- WhatsApp Support link (P2-T028)
- Privacy Policy / Terms of Service links
- Rate this app (links to Play Store or browser prompt)

---

## Avatar ON/OFF Toggle

### Why This Matters

Parents of Grade 10–12 students may want a "serious study app" without a cartoon character.
Some schools or teachers may share the app and need it to look academic.
The avatar is the identity system for Grade 2–8 — but it should never be forced on users
who find it distracting.

### Behaviour

```
Settings → Appearance → Avatar

[Avatar]  Show my growth character on the home screen   ●●●○  ON

When OFF:
- Home screen shows a circular progress ring (accuracy% + streak) instead of avatar
- Quiz and result screens are unchanged
- Avatar stage still advances internally (data not lost)
- Switching back ON reveals the avatar at the correct growth stage

When ON (default for Grade 2–8):
- Avatar is the identity anchor — home screen top-center
- Stage reflects concept mastery + streak progress
```

```js
// In app.js
const SHOW_AVATAR = localStorage.getItem('ds_avatar') !== 'false'; // default true
// Toggle handler
function _toggleAvatar(show) {
  localStorage.setItem('ds_avatar', show ? 'true' : 'false');
  _renderHome(); // re-render home with or without avatar
}
```

---

## What a Parent Sees After This Task Ships

1. Opens app (dark indigo + gold = premium, not toy)
2. Taps Settings — sees 6 clean menu tiles, not a wall of options
3. Taps "Appearance" — sees three theme options clearly labelled
4. Sees "Dawnbreak (Recommended for kids)" already selected
5. Sees "Avatar: ON" toggle — taps to understand, leaves it ON
6. Takes a screenshot and sends to school WhatsApp group: "Check this out"

That last step is the word-of-mouth trigger. The theme is what earns the screenshot.

---

## Acceptance Criteria

### CSS — All 5 Themes
- [ ] `[data-theme="dawnbreak"]` block in `styles.css` — 9 variable overrides + font vars
- [ ] `[data-theme="sunrise"]` block in `styles.css` — 9 variable overrides + input/select overrides (light bg)
- [ ] `[data-theme="ocean"]` block in `styles.css` — 9 variable overrides
- [ ] Existing `[data-theme="light"]` block unchanged
- [ ] Existing `:root` (dark) block unchanged
- [ ] All 5 themes tested at 375px — no layout breaks, no unreadable text
- [ ] Answer cards, progress bars, streak flame readable in all 5 themes
- [ ] `Nunito` font added to Google Fonts import — used in Dawnbreak + Sunrise only
- [ ] `Inter` font added to Google Fonts import — used in Dawnbreak + Sunrise only
- [ ] Numbers and stats use `DM Mono` in all 5 themes (unchanged)

### JS — Theme System Upgrade
- [ ] `THEMES` const defined (5 entries: dawnbreak, sunrise, ocean, dark, light)
- [ ] `_setTheme(name)` replaces old `_toggleTheme()` — sets `data-theme` + localStorage
- [ ] `_initTheme()` reads `localStorage` on page load (default: `'dark'` if nothing saved)
- [ ] `_autoApplyTheme(grade)` called once at signup end — sets Dawnbreak (2–8), Ocean (9–12), Dark (others)
- [ ] `_autoApplyTheme` is a no-op if `decashift_theme` already in localStorage
- [ ] Old binary toggle `.theme-toggle-btn` click handler removed
- [ ] `_renderThemeSelector()` renders 5 tiles in Appearance sub-screen with active highlight

### Settings Restructure (6 Sub-Screens)
- [ ] Settings button opens 6-tile menu screen (not the old scrollable modal)
- [ ] Each tile navigates to its own sub-screen with a back button
- [ ] All existing settings preserved in new locations — none removed, only relocated

### Appearance Sub-Screen
- [ ] 5 theme tiles displayed in a 3+2 grid
- [ ] Active theme tile: border highlighted in current `--accent` colour
- [ ] Tapping a tile → instant theme repaint (no reload required)
- [ ] "Recommended for Grade 2–8" label on Dawnbreak tile
- [ ] Avatar ON/OFF toggle below theme tiles

### Avatar Toggle
- [ ] Toggle OFF removes avatar from home screen, shows progress ring instead
- [ ] Avatar data preserved when toggled OFF then back ON
- [ ] State persists in `localStorage`

---

## Files to Touch

- `app/ui/styles.css` — 3 new `[data-theme]` blocks (Dawnbreak, Sunrise, Ocean); Sunrise input overrides
- `app/ui/index.html` — add Nunito + Inter to Google Fonts; restructure settings modal to 6-section menu; 5-tile theme selector in Appearance sub-screen
- `app/ui/app.js` — `THEMES` const; `_setTheme()`; `_initTheme()`; `_autoApplyTheme()`; `_renderThemeSelector()`; `_toggleAvatar()`; settings sub-screen navigation handlers; remove old `_toggleTheme()` + `_updateThemeBtns()`

## Dependencies

- P2-T005 (dark/light toggle — done; this task replaces the toggle with a 5-option selector)
- P3-T004 (avatar growth — avatar ON/OFF is independent of avatar stage logic)
- P2-T017 (profile page — Account & Security sub-screen shares scope)
- P3-T032 (city partners — My City sub-screen shows partner list)
- P2-T033 (PWA install — About & Help sub-screen links to install guide)

## Strategic Connection to 5K Goal

| Metric | Before | After |
|---|---|---|
| Parent screenshot conversion | Dark grey = developer tool | Dawnbreak auto for Grade 2–8 = aspirational |
| Teen/professional screenshot | Same dark grey | Ocean auto for Grade 9–12 = focused, premium |
| User control | Binary toggle | 5 choices — users find their theme, stay longer |
| Settings trust signal | Cluttered = users close it | 6 clean sub-screens = thoughtful product |
| Word-of-mouth | Nothing to share | Theme repaint on every tap = satisfying to demo |

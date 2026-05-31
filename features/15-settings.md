# Feature: Settings

## Overview
A modal overlay with 5–6 tile-based sub-screens. Accessible from the user menu or nav drawer. Covers profile editing, appearance (theme), learning preferences, security (password change), plan management, and progress overview. Lazy-loaded — the HTML is fetched on first open to keep initial bundle size small.

---

## User Flows

### Flow 1: Opening Settings

**Entry point:** User taps their name chip → user menu → "Settings" OR drawer nav → "Settings."

1. User menu / drawer closes
2. `openSettings()` is called:
   - If settings HTML isn't in the DOM yet, it's fetched from `screens/screen-settings.html`
   - Settings modal appears as a full-screen overlay
3. **Settings menu** shows 5 tiles:
   - 👤 Profile
   - 🎨 Appearance
   - 📚 Learning
   - 🔒 Security
   - 💳 My Plan
   - (Optional: 📊 Progress)

---

### Flow 2: Profile Sub-screen

1. User taps **Profile** tile
2. Sub-screen shows:
   - **Name field**: current display name, editable
   - **Grade selector** (school users only): current grade, changeable (Grade 2–12)
   - **Category**: School / Professional (read-only after sign-up)
   - **"Save Changes"** button
3. User edits name → taps Save → profile is updated in localStorage → greeting on Home updates

---

### Flow 3: Appearance Sub-screen

1. User taps **Appearance** tile
2. Sub-screen shows theme options:
   - 🌙 Dark (default)
   - ☀️ Light
   - 🖥 System (follows OS setting)
3. User taps a theme → app theme updates immediately (CSS class swap on `<body>`)
4. Selection is persisted to `decashift_theme` in localStorage

---

### Flow 4: Learning Sub-screen

1. User taps **Learning** tile
2. Sub-screen shows:
   - **Timer toggle**: On / Off — controls whether the per-question timer shows during quizzes
   - (Future: question count per session, difficulty preference)
3. User toggles timer → setting saved to `decashift_timer` in localStorage → quiz engine respects it immediately

---

### Flow 5: Security Sub-screen

1. User taps **Security** tile
2. Sub-screen shows:
   - Current email (read-only)
   - **Change Password** form:
     - Current password
     - New password
     - Confirm new password
   - **"Update Password"** button
3. User submits → app:
   - Verifies current password hash matches stored hash
   - If match: hashes new password, updates stored account, shows success toast
   - If mismatch: shows error "Current password is incorrect"

---

### Flow 6: My Plan Sub-screen

1. User taps **My Plan** tile
2. Sub-screen shows:
   - Current plan badge: "Free Trial" / "Pro" / "Expired"
   - For Trial: "X days remaining"
   - For Expired: "Upgrade to Pro — ₹79/month" with CTA button
   - For Pro: renewal info
3. **"Upgrade"** button → opens paywall or payment link

---

### Flow 7: Progress Sub-screen (optional)

1. User taps **Progress** tile (if shown)
2. Sub-screen shows a summary of:
   - Total sessions completed
   - Total questions answered
   - All-time accuracy
   - Export button: **"Export My Data (JSON)"** → downloads full session history

---

### Flow 8: Closing Settings

1. User taps the **✕** close button or back arrow
2. Settings modal slides out / hides
3. User is returned to the screen they were on (Home, Journey, etc.)

---

## Lazy Loading

Settings HTML (`screen-settings.html`) is NOT included in the initial page load. It is fetched via `fetch()` on the first `openSettings()` call and inserted into the DOM with `insertAdjacentHTML`. This keeps the initial bundle lean.

Fetch tries two URLs in order:
1. GitHub raw URL (production)
2. Local relative path `screens/screen-settings.html` (local dev fallback)

---

## Settings Navigation Architecture

- **Menu → Sub-screen**: `openSettingsSection(name)` hides menu, shows sub
- **Sub-screen → Menu**: `backToSettingsMenu()` shows menu, hides all subs
- Each sub-screen has its own `_init*Section()` function that populates it on open

---

## Screens Involved
- `screens/screen-settings.html` — all settings HTML (lazy-loaded)
- `app/ui/js/app-settings.js` — all settings logic
- `app/ui/js/storage.js` — reads/writes theme, timer, user profile, password hash

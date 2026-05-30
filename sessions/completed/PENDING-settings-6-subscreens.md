# Session: PENDING — Settings Restructure → 6 Sub-Screens (P2-T030 Remainder)

**Priority:** ✅ Done — 2026-05-29 · commit [see below]
**Type:** Code
**Est. Duration:** 2 hours
**Task:** P2-T030 (remainder — themes shipped, this is the settings UX restructure)
**Depends on:** — (standalone, themes already shipped in P2-T030 part 1)

**Also fixed:** BUG-009 — grade not pre-populated in settings (root cause: monolithic
openSettings() set grade before sub-screen was active; fixed by per-section init functions)

---

## Objective

Replace the current flat scrollable settings modal with a 6-tile menu screen where each tile opens its own sub-screen with a back button. Cleaner, more trustworthy, easier to navigate.

---

## Context

- P2-T030 phase 1 (themes + Appearance section) already shipped
- This is the settings UX restructure — the second part of P2-T030
- Current settings: one long scrollable modal (Profile + Regional Language + Password)
- Target: 6 tiles → 6 sub-screens (My Profile, Account & Security, Learning Preferences, Appearance, My City, About & Help)
- Full spec in: `tasks/P2-T030-dawnbreak-theme-settings-restructure.md` (Settings Restructure section)

---

## The 6 Sub-Screens

```
Settings (menu)
├── 👤 My Profile           → name, grade/role, city
├── 🔐 Account & Security   → email (read-only), change password, delete account
├── 📚 Learning Preferences → default subject, timer, notifications, regional language
├── 🎨 Appearance           → 5-tile theme selector + avatar toggle (ALREADY BUILT)
├── 📍 My City              → city override dropdown + partner listings
└── ℹ️ About & Help         → version, install app, WhatsApp support, privacy
```

---

## Execute In This Order

### Step 1 — Read full spec
Open `tasks/P2-T030-dawnbreak-theme-settings-restructure.md` (Settings Restructure section)

### Step 2 — HTML restructure
Replace the current settings modal interior with:
- Main menu: 6 tile buttons, each with `onclick="openSettingsSection('profile')"` etc.
- 6 sub-screen divs (hidden by default), each with a back button
- Move existing form fields into the correct sub-screen div

### Step 3 — JS navigation
```js
function openSettingsSection(name) {
  document.querySelectorAll('.settings-sub').forEach(s => s.classList.add('hidden'));
  document.getElementById('settings-menu').classList.add('hidden');
  document.getElementById('settings-sub-' + name).classList.remove('hidden');
}
function backToSettingsMenu() {
  document.querySelectorAll('.settings-sub').forEach(s => s.classList.add('hidden'));
  document.getElementById('settings-menu').classList.remove('hidden');
}
```

### Step 4 — CSS
- Settings menu: grid of 6 tiles (2 columns on mobile)
- Each tile: icon + label + › arrow
- Active sub-screen: full modal height, back button top-left
- No changes to existing form field styles

### Step 5 — Test all sub-screens
- Profile save still works
- Password change still works
- Regional language still works
- Theme selector (Appearance) still works
- Back button returns to menu correctly

### Step 6 — Commit
```bash
git add app/ui/
git commit -m "feat(P2-T030): settings restructure -- 6 sub-screens with back navigation"
git push origin main
```

---

## Success Criteria
- [ ] Settings opens to 6-tile menu (not scrollable list)
- [ ] Each tile opens correct sub-screen
- [ ] Back button returns to menu
- [ ] All existing settings (profile, password, language, theme, avatar) functional
- [ ] Committed and pushed

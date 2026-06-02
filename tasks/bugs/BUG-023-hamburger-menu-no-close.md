# BUG-023 — Hamburger (☰) button opens drawer but never closes it on second tap

**Severity:** Medium (UX friction — users must tap overlay to dismiss; back gesture expected)
**Found by:** User report 2026-06-03
**Status:** ✅ FIXED — commit pending
**File:** `app/ui/screens/screen-home.html` (menu-btn onclick)

## What's wrong

The hamburger button `#menu-btn` always calls `_openDrawer()`:
```html
<button class="menu-btn" id="menu-btn" onclick="_openDrawer()" ...>
```

Tapping it when the drawer is already open does nothing visible (the drawer re-opens,
already open). The only way to close was: tap the overlay or a drawer item.

## Fix applied

Added `_toggleDrawer()` to `app-home.js`:
```js
function _toggleDrawer() {
  const drawer = document.getElementById('app-drawer');
  if (!drawer) return;
  if (drawer.classList.contains('open')) _closeDrawer();
  else _openDrawer();
}
```

Updated `screen-home.html`:
```html
<button class="menu-btn" id="menu-btn" onclick="_toggleDrawer()" ...>
```

## Acceptance

- First tap on ☰ → drawer slides open.
- Second tap on ☰ → drawer closes.
- Tapping the overlay still closes the drawer.
- Tapping a drawer item still closes the drawer (existing behaviour unchanged).

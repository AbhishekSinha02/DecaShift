# P2-T044 — PWA Install Banner on Home Screen

**Priority:** P2 (pre-launch quality)
**Status:** Pending
**Estimated effort:** 30 min

---

## Problem

The PWA install guidance currently lives in Settings → Help, which users never find.
Android users need one tap to install. iOS users need a clear visual guide.
Neither is surfaced where users actually are — the home screen.

---

## Solution

A dismissible install banner below the streak bar, shown only to users who haven't installed yet.

```
┌─────────────────────────────────────────────────────┐
│  📲  Add Donnibo to your home screen                │
│      Faster access, works offline    [Add →]  [✕]  │
└─────────────────────────────────────────────────────┘
```

**Android (Chrome):** Tapping "Add →" triggers `_deferredInstallPrompt.prompt()` — native install dialog appears in one tap. Done.

**iOS (Safari):** Tapping "Add →" shows an inline mini-guide (3 lines + arrow pointing to Share button). No steps the user has to remember.

---

## Behaviour

- Only shown if `_deferredInstallPrompt` is available (Android) OR iOS Safari without standalone mode
- Hidden if already installed (`window.matchMedia('(display-mode: standalone)').matches`)
- Hidden if user dismisses — store `localStorage.setItem('ds_install_dismissed', '1')`
- Never shown again after dismissal or install
- Positioned: below streak bar, above subject tabs

---

## Files

- `app/ui/screens/screen-home.html` — add banner HTML (just above `#subject-tabs`)
- `app/ui/js/app-home.js` — `_renderInstallBanner()` called from `_renderHome()`
- `app/ui/css/styles-app.css` — `.install-banner` styles

---

## iOS Detection

```js
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
const isDismissed = localStorage.getItem('ds_install_dismissed');
```

- iOS + not standalone + not dismissed → show iOS guide banner
- Android + `_deferredInstallPrompt` exists + not dismissed → show one-tap banner
- Otherwise → hide banner

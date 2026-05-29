# Session: PENDING — PWA Install Banner on Home Screen

**Priority:** 5 ← after css-lazy-load-phase2
**Type:** Code
**Est. Duration:** 30 min
**Task:** P2-T044
**Trigger:** "start the session"
**Depends on:** —

---

## Objective

Add a dismissible install banner below the streak bar so users can install the PWA in one tap (Android) or see a clear inline guide (iOS), without needing to hunt through Settings.

---

## Context

- `_deferredInstallPrompt` is already captured in `init()` — Android one-tap install is wired, just not surfaced
- The existing Settings install guide stays as-is (backup)
- Banner must not show if already installed (`display-mode: standalone`)
- Banner must not show after dismissal (`ds_install_dismissed` in localStorage)

---

## Execute In This Order

### Step 1 — Banner HTML in screen-home.html

Add just above `<div id="subject-tabs"`:

```html
<div class="install-banner hidden" id="install-banner">
  <span class="install-banner-icon">📲</span>
  <div class="install-banner-text">
    <div class="install-banner-title">Add to your home screen</div>
    <div class="install-banner-sub" id="install-banner-sub">Faster access · works offline</div>
  </div>
  <button class="install-banner-btn" id="install-banner-btn">Add →</button>
  <button class="install-banner-close" onclick="_dismissInstallBanner()">✕</button>
</div>
```

### Step 2 — Banner logic in app-home.js

Add `_renderInstallBanner()` and call it from `_renderHome()`:

```js
function _renderInstallBanner() {
  const banner = document.getElementById('install-banner');
  if (!banner) return;

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    || navigator.standalone === true;
  const isDismissed  = localStorage.getItem('ds_install_dismissed');

  if (isStandalone || isDismissed) { banner.classList.add('hidden'); return; }

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());

  if (isIOS) {
    document.getElementById('install-banner-sub').textContent =
      'Tap Share  →  "Add to Home Screen"';
    document.getElementById('install-banner-btn').onclick = _showIOSInstallTip;
    banner.classList.remove('hidden');
  } else if (_deferredInstallPrompt) {
    document.getElementById('install-banner-btn').onclick = _triggerInstallBanner;
    banner.classList.remove('hidden');
  }
}

function _triggerInstallBanner() {
  if (!_deferredInstallPrompt) return;
  _deferredInstallPrompt.prompt();
  _deferredInstallPrompt.userChoice.then(result => {
    if (result.outcome === 'accepted') _dismissInstallBanner();
    _deferredInstallPrompt = null;
  });
}

function _showIOSInstallTip() {
  alert('In Safari: tap the Share button (box + arrow) at the bottom → "Add to Home Screen" → Add.');
}

function _dismissInstallBanner() {
  localStorage.setItem('ds_install_dismissed', '1');
  document.getElementById('install-banner')?.classList.add('hidden');
}
```

### Step 3 — CSS in styles-app.css

```css
.install-banner {
  display: flex; align-items: center; gap: 10px;
  background: var(--surface-2); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 10px 14px;
  margin: 8px 16px 0;
}
.install-banner-icon { font-size: 20px; flex-shrink: 0; }
.install-banner-text { flex: 1; min-width: 0; }
.install-banner-title { font-size: 13px; font-weight: 700; color: var(--text); }
.install-banner-sub   { font-size: 11px; color: var(--muted); }
.install-banner-btn {
  background: var(--accent); color: #fff; border: none;
  padding: 6px 12px; border-radius: 8px; font-size: 12px;
  font-weight: 700; cursor: pointer; white-space: nowrap; flex-shrink: 0;
}
.install-banner-close {
  background: none; border: none; color: var(--muted);
  font-size: 14px; cursor: pointer; padding: 2px 4px; flex-shrink: 0;
}
```

### ✅ Commit

```
git commit -m "feat(pwa): install banner on home screen — 1-tap Android, iOS guide"
git push origin main
```

---

## Success Criteria

- [ ] Banner appears below streak bar on Android Chrome (not yet installed)
- [ ] Tapping "Add →" on Android shows native install dialog immediately
- [ ] Banner appears on iOS Safari with Share → Add to Home Screen hint
- [ ] Banner hidden if already in standalone mode
- [ ] Dismissing hides banner permanently (localStorage flag)
- [ ] No banner if already dismissed

## Hand-off

No follow-on. Standalone task.

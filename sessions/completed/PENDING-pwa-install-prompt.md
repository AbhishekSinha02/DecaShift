# Session: PENDING — PWA Install Prompt + Taskbar Guide (P2-T033)

**Priority:** 3
**Type:** Code
**Est. Duration:** 1 hour
**Task:** P2-T033
**Trigger:** "start the session" (Priority 3 in pending queue)
**Depends on:** — (standalone, no dependency)

---

## Objective

Add the Android PWA install banner (after 3rd session), iOS Safari manual guide modal, and Windows taskbar instructions in Settings → About & Help. Makes the app feel like a native app for Indian parents on Android.

---

## Context

- App already has `sw.js` + `manifest.webmanifest` — PWA infrastructure is complete
- This task adds the user-facing install layer only
- Full spec in: `tasks/P2-T033-pwa-install-prompt-taskbar-guide.md`
- The About & Help sub-screen lives in Settings (P2-T030 restructure pending — can be added to existing modal for now)
- Highest impact on Indian market: Android Chrome is 75%+ of Indian mobile browser share

---

## Execute In This Order

### Step 1 — Read full spec
Open `tasks/P2-T033-pwa-install-prompt-taskbar-guide.md`

### Step 2 — JS (`app/ui/app.js`)
```js
// Add these functions:
_detectPlatform()          // isIOS, isAndroid, isWindows, isStandalone
_shouldShowInstallPrompt() // 3+ sessions, not already installed, not dismissed
_showInstallBanner()       // Android bottom banner
_showIOSGuide()            // iOS modal with Safari share button instructions
_onInstallAccepted()       // post-install success message
_onInstallDismissed()      // store dismissal in localStorage, wait 7 days

// Wire beforeinstallprompt event in init():
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  drillState._installPrompt = e;
  if (_shouldShowInstallPrompt()) _showInstallBanner();
});
```

### Step 3 — HTML (`app/ui/index.html`)
- Add install banner markup (bottom of body, hidden by default)
- Add iOS guide modal markup

### Step 4 — CSS (`app/ui/styles.css`)
- Install banner: bottom-sheet style, non-blocking
- iOS guide modal: standard modal style

### Step 5 — Settings About & Help
Add "Install App" section to the existing settings modal (bottom of modal, above Close button):
```html
<div class="settings-section">
  <h3 class="settings-section-title">📲 Install App</h3>
  <p class="settings-section-desc">Add Donnibo to your home screen for instant daily access.</p>
  <button class="btn btn-primary btn-sm" onclick="_showInstallBanner()">Install on This Device</button>
</div>
```

### Step 6 — Test
- Android Chrome: banner appears after 3rd session, tapping Install triggers native prompt
- iOS Safari: guide modal appears
- Already installed: banner never shows (standalone mode detected)

### Step 7 — Commit
```bash
git add app/ui/
git commit -m "feat(P2-T033): PWA install prompt -- Android banner, iOS guide, settings install section"
git push origin main
```

---

## Success Criteria
- [ ] Android: install banner shown after 3rd session (not on 1st visit)
- [ ] Android: native browser install triggered on tap
- [ ] iOS: Safari instructions modal shown
- [ ] Standalone mode: banner never shows if already installed
- [ ] Settings has "Install App" section
- [ ] Committed and pushed

## Hand-off
After this: Priority 4 (Settings 6 sub-screens) or reorder as needed.

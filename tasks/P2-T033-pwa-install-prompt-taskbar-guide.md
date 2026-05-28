# Feature: PWA Install Prompt + Desktop Taskbar & Home Screen Guide

**Priority:** P2 | **Type:** Mobile / PWA / Retention | **Complexity:** S | **Status:** Pending

> An app that lives in the browser is an app that gets forgotten.
> An app that is pinned to the home screen or taskbar is part of the daily routine.
> The difference between a 3-day user and a 30-day user is often just: did the icon land
> on their home screen? This task makes sure it does — proactively, at the right moment,
> for Android, Windows, and iOS.

---

## Why This Exists — Tied to 5K User Goal

**Retention is the 5K multiplier.** Getting 5,000 users to sign up is one problem.
Keeping 5,000 users active long enough to convert to Pro is a different, harder problem.

The app already has a Service Worker and a Web App Manifest (PWA infrastructure is done).
What is missing: the **prompt** and the **guide**. A user who never sees an install prompt
will never install. A user who installs has:
- An app icon as a daily visual reminder (habit anchor)
- Faster launch (no browser chrome)
- Offline access to cached content
- A "real app" feeling — not a website

**Indian parent psychology:** Parents distinguish sharply between "a website" and "an app."
They trust apps more. They share apps more. "Download the app" is a more compelling
instruction than "visit the website." The install prompt converts a website into an app
in their mental model.

**Decision filter check:**
- Moves toward 5K users? ✅ Installed apps retain 2–3× better than browser-only — directly impacts 5K sustained users
- Fixes F1 (content)? ❌
- Creates shareable moment? ✅ "Install the app" is a more natural ask in WhatsApp groups than "visit the site"
- Works on ₹8,000 Android phone on 4G? ✅ This IS the primary path — Android Chrome install is seamless

---

## Install Flow — Three Platforms

### Platform 1: Android (Primary — Highest Priority)

Android Chrome shows the `beforeinstallprompt` event automatically when:
- User has visited the site twice in 5 minutes, OR
- User has spent enough time to suggest genuine interest

We intercept this event and show our own styled prompt at the right moment.

**Trigger:** After the user completes their 3rd quiz session or 2nd Flash Drill.
*Not on first visit — earn the prompt. Show it when they are clearly engaged.*

**In-app banner (bottom of screen, non-blocking):**

```
┌─────────────────────────────────────┐
│  📲 Add Donnibo to your home screen  │
│  One tap — open instantly, anytime  │
│                 [Install]  [Not now] │
└─────────────────────────────────────┘
```

[Install] → triggers the browser's native `beforeinstallprompt.prompt()` call.
[Not now] → dismisses for 7 days, then re-prompts once.

**After install (Android):**
```
┌─────────────────────────────────────┐
│  ✅ Donnibo is on your home screen!  │
│  Open it anytime — no browser needed│
└─────────────────────────────────────┘
```

### Platform 2: Windows (Desktop Taskbar)

Microsoft Edge supports PWA install natively via the address bar install icon.
Chrome on Windows supports "Create shortcut → Open as window."

We surface this in **Settings → About & Help** as a step-by-step guide:

```
📌 Pin Donnibo to Your Taskbar

Using Microsoft Edge (Recommended):
1. Open donnibo.in in Edge
2. Click ⋯ (three dots) in the top right
3. Tap Apps → Install this site as an app
4. Click Install
5. Right-click the Donnibo icon in taskbar → Pin to taskbar

Using Google Chrome:
1. Open donnibo.in in Chrome
2. Click ⋮ (three dots) in the top right
3. Click Save and share → Create shortcut
4. Check "Open as window" → Create
5. Find Donnibo in Start Menu → Right-click → Pin to taskbar
```

This guide is shown as a scrollable card in Settings → About & Help.
No code beyond the content — purely instructional.

### Platform 3: iOS (Home Screen)

iOS Safari does not support `beforeinstallprompt`. We detect iOS and show a manual guide:

**After 3rd session, show a modal specific to iOS:**

```
┌─────────────────────────────────────┐
│  📲 Add to your Home Screen         │
│                                     │
│  1. Tap the Share button  [↑]       │
│     (bottom centre of Safari)       │
│                                     │
│  2. Scroll down and tap             │
│     "Add to Home Screen"            │
│                                     │
│  3. Tap "Add" in the top right      │
│                                     │
│  Donnibo will appear as an app!     │
│                      [Got it]       │
└─────────────────────────────────────┘
```

Show once, dismiss permanently on [Got it].

---

## Platform Detection Logic

```js
function _detectPlatform() {
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  const isAndroid = /Android/.test(ua);
  const isWindows = /Windows/.test(ua);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
                    || window.navigator.standalone === true;
  return { isIOS, isAndroid, isWindows, isStandalone };
}

// Show install prompt only if:
// 1. Not already installed (isStandalone = false)
// 2. User has completed 3+ sessions
// 3. Prompt not previously dismissed (check localStorage)
function _shouldShowInstallPrompt() {
  const { isStandalone } = _detectPlatform();
  if (isStandalone) return false; // already installed
  const dismissed = localStorage.getItem('ds_install_dismissed');
  if (dismissed) {
    const dismissedAt = new Date(dismissed);
    const daysSince = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
    if (daysSince < 7) return false; // wait 7 days after dismissal
  }
  const sessions = JSON.parse(localStorage.getItem('ds_sessions') || '[]');
  return sessions.length >= 3;
}
```

---

## "Install App" in Settings

The Settings → About & Help sub-screen (from P2-T030) includes:

```
📲 Install App on Your Device

Get Donnibo as an app for instant daily access.

[Android / Chrome]  [Windows / Edge]  [iPhone / iPad]

(Tab switches guide content)
```

This is always available — not just on first encounter. Parents who want to install
the app for their child on a different device can always find the instructions here.

---

## Offline Mode Connection

Once installed (standalone mode), the Service Worker (already in place) serves the
app from cache on subsequent visits — even without network.

This directly mitigates **F8 (no offline mode for Indian market):**
- Without install: user opens browser → hits network → fails if offline
- With install: OS launches the app → Service Worker serves from cache → works offline

Post-install, show a one-time message:
```
📶 Donnibo works offline too!
Your questions for this week are saved on your device.
```

---

## Acceptance Criteria

### Android Install Prompt
- [ ] `beforeinstallprompt` event intercepted and stored (not triggered immediately)
- [ ] Install banner shown at bottom of screen after 3rd completed session
- [ ] Banner is non-blocking — quiz/drill session not interrupted
- [ ] [Install] button triggers native browser install prompt
- [ ] [Not now] dismisses for 7 days; dismissed state stored in `localStorage`
- [ ] Post-install success message shown ("Donnibo is on your home screen!")
- [ ] Banner not shown if app is already installed (standalone mode detected)

### iOS Manual Guide
- [ ] iOS detected via user agent
- [ ] After 3rd session on iOS, show Safari install instructions modal
- [ ] Modal includes visual cues: "Share button [↑]" referenced correctly
- [ ] [Got it] permanently dismisses the modal (no re-show)

### Windows Guide in Settings
- [ ] Settings → About & Help shows "Install App" section
- [ ] Three tabs: Android, Windows, iPhone/iPad
- [ ] Each tab shows step-by-step text instructions for pinning to taskbar / home screen
- [ ] Instructions are specific to Edge and Chrome on Windows

### Standalone Detection
- [ ] When app is opened in standalone mode, install prompt never shown
- [ ] Standalone mode message shown once: "You're using Donnibo as an app"

### Offline Message
- [ ] After first install + first offline-capable launch, show "Donnibo works offline" message
- [ ] Message dismissible, shown once only

---

## Files to Touch

- `app/ui/app.js` — `_detectPlatform()`, `_shouldShowInstallPrompt()`,
  `_showInstallBanner()` (Android), `_showIOSGuide()`, `_onInstallAccepted()`,
  `_onInstallDismissed()`; connect to session completion event
- `app/ui/index.html` — install banner markup; iOS guide modal markup
- `app/ui/styles.css` — install banner bottom-sheet styles; iOS guide modal styles

## Dependencies

- P2-T030 (settings restructure — About & Help sub-screen is where the Windows guide lives)
- Existing `sw.js` + `manifest.webmanifest` (PWA infrastructure — already in place; this task adds the user-facing install layer)

## Strategic Connection to 5K Goal

| Metric | Browser-only users | Installed app users |
|---|---|---|
| Day-7 retention (industry avg) | ~15% | ~35–40% |
| Streak continuation | Breaks when browser history clears | Persists — app icon is a daily reminder |
| "Real app" perception (Indian parents) | "Just a website" | "My child's learning app" |
| Sharing behaviour | "Visit this site" | "Download this app" — more compelling |

At 5,000 users, even a 10% improvement in Day-30 retention from installs = 500 more
active users without acquiring a single new one. This is the cheapest retention lever
in the entire task queue.

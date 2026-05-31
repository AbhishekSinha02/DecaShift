# Feature: PWA & Offline Support

## Overview
The app is a Progressive Web App (PWA) — installable on Android and iOS home screens, with a service worker for offline caching. An in-app install banner prompts users to add the app to their home screen. The app targets ₹8,000 Android phones on 4G — every feature must work on slow connections and survive network drops mid-session.

---

## User Flows

### Flow 1: Install Banner (Android Chrome)

**Entry point:** User has visited the app at least once; browser fires the `beforeinstallprompt` event.

1. A **"Add to Home Screen"** banner slides up from the bottom of the screen
2. Banner shows:
   - Donnibo icon
   - "Add Donnibo to your home screen — learn faster, load instantly"
   - **"Install"** button
   - **"Not now"** dismiss link

3. **User taps "Install"**:
   - `deferredPrompt.prompt()` is called
   - Native browser install dialog appears
   - User confirms → app installs to home screen
   - Banner dismisses permanently

4. **User taps "Not now"**:
   - Banner hides; `localStorage` flag set to avoid showing again for 7 days

---

### Flow 2: Install on iOS (Safari)

iOS does not support `beforeinstallprompt`. A different flow:

1. If the app detects iOS Safari and is not already in standalone mode:
   - A tooltip / instruction card appears:
     - "Tap the Share icon → 'Add to Home Screen'"
     - Arrow pointing to the Safari share button
2. User follows the instruction → app installs to home screen
3. Instruction dismisses after 10 seconds or on tap

---

### Flow 3: Using the App After Install

1. User taps the Donnibo icon on their home screen
2. App opens in **standalone mode** (no browser address bar — looks like a native app)
3. Service worker serves the app shell from cache → loads in <1 second even on slow 4G
4. Question content is fetched from GitHub raw CDN (cached on first fetch)

---

### Flow 4: Going Offline Mid-Session

**Scenario:** User loses connection while in the middle of a quiz.

1. Quiz continues uninterrupted — all question data was loaded into memory at session start
2. Session is completed; result is calculated locally
3. On save: Drive sync fails silently → session saves to localStorage instead
4. When connection returns: next sync attempt succeeds; session is uploaded to Drive

No data is lost. The user never sees an error.

---

### Flow 5: Opening App Fully Offline

**Scenario:** User has no internet connection and opens the app.

1. Service worker serves the cached app shell (HTML, CSS, core JS)
2. User can log in with a locally stored account (localStorage)
3. Cached question sets load for sets already visited
4. Un-cached sets show a "No connection — check your internet" message on that card only
5. All completed sessions from previous online use are visible in Journey / history

---

## Service Worker Behaviour

- **Cache strategy**: Cache-first for app shell (HTML, CSS, JS); Network-first for question JSON
- App shell is cached on install event → loads instantly on repeat visits
- Question files are cached on first fetch → available offline thereafter
- Service worker registered from `sw.js` at the root

---

## PWA Manifest (`manifest.webmanifest`)

Key fields:
```json
{
  "name": "Donnibo",
  "short_name": "Donnibo",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f1117",
  "theme_color": "#7c3aed",
  "icons": [{ "src": "assets/icon-192.png", "sizes": "192x192", "type": "image/png" }]
}
```

Manifest is **sharded** — the full manifest (58 KB with inline SVG icons) was split so the initial HTML only loads a 749 B stub. Full manifest is loaded after the app shell is interactive (P1-T018 manifest sharding).

---

## Performance Targets (₹8,000 Android Phone on 4G)

| Metric | Target |
|---|---|
| First Contentful Paint | < 2 seconds |
| Time to Interactive | < 3 seconds |
| Payload (initial) | < 400 KB |
| Offline usability | Core features work |

Current baseline (2026-05-30): **340 KB payload**, 0 broken links.

---

## Screens Involved
- `sw.js` — service worker (cache strategy, install, fetch events)
- `manifest.webmanifest` — PWA manifest stub
- `app/ui/js/app-core.js` — service worker registration
- PWA install banner logic in `app/ui/js/app-home.js` or dedicated module

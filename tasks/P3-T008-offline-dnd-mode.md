# Feature: Offline / Do Not Disturb (DnD) Mode

**Priority:** P3 | **Type:** Technical | **Complexity:** M | **Status:** Pending

## Goal
Users can practice fully offline. DnD mode silences all notifications and prevents Drive sync while the user focuses. Makes the app reliable and distraction-free.

## Offline Mode
- App fully functional without internet
- Questions loaded from cache (`questions.json` cached via Service Worker)
- Responses saved to localStorage
- When connection returns, sync automatically in background

## DnD Mode
- User-triggered toggle in quiz screen header
- Disables: all remote syncs, "at risk" streak warnings, any notification logic
- Visual indicator: small moon icon in header when active
- Automatically turns off when user leaves quiz screen

## Acceptance Criteria
- [ ] Service Worker caches `index.html`, `app.js`, `styles.css`, `storage.js`, `goals.json`, `questions.json` on first load
- [ ] App fully usable with DevTools → Network → Offline checked
- [ ] DnD toggle in quiz screen — prevents all background fetch calls
- [ ] Offline sessions are queued and synced when connectivity returns (use `navigator.onLine` + `online` event)
- [ ] "You're offline — practicing in local mode" banner shown when offline
- [ ] Service Worker updates cache when new version deployed (version hash in SW)

## Technical Notes
- Service Worker: `CacheFirst` strategy for static assets, `NetworkFirst` for JSON data files
- Queue pending syncs in localStorage under `decashift_sync_queue`
- `navigator.onLine` check + `window.addEventListener('online', flushSyncQueue)`

## Dependencies
- P1-T004 (session persistence)

## Files to Touch
- New: `app/ui/sw.js` — Service Worker
- `app/ui/index.html` — SW registration script, offline banner, DnD toggle
- `app/ui/app.js` — DnD state, offline banner logic
- `app/ui/storage.js` — sync queue logic

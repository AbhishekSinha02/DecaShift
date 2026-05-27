# Feature: Offline-First Question Prefetch & Smart Cache Invalidation

**Priority:** P3 | **Type:** Performance / Offline | **Complexity:** M | **Status:** Pending

## Goal
Pre-load all questions a student needs for the week into local storage the moment
they log in — so every quiz session runs at zero network cost. Network is only touched
on specific change events (new week, grade change, plan upgrade). Students in low-signal
environments get a fully smooth experience.

## How This Differs from P3-T008 (Offline / Service Worker)
P3-T008 makes the app *survive* going offline reactively (Service Worker catches failed
requests). This task makes the app *never need the network* during normal use, proactively.
Both ship together — this task defines the prefetch + invalidation logic; P3-T008 provides
the Service Worker shell that serves from cache as a safety net.

## The Problem with Current Behaviour
Every quiz session fetches question JSON from GitHub raw URLs in real time:
- Slow on first load, especially on mobile networks
- Fails entirely if network drops mid-quiz
- Re-fetches the same files every session, every day
- Drive calls on every login to read user profile

As content grows (100+ files), this gets progressively worse.

## Design: Event-Driven Prefetch, IndexedDB Store

### Why IndexedDB (not localStorage or SW Cache)
- `localStorage`: 5–10 MB limit; question files for one grade/week = 1–3 MB;
  a full term's cache will exceed this
- `SW Cache API`: designed for HTTP responses, not structured data queries
- **IndexedDB**: 50–250 MB typical quota; structured; queryable by goalId/week/grade;
  survives app restarts; right tool for bulk JSON content

### Local Store Schema (IndexedDB, db: `decashift_content`)

```
Store: question_files
  key:   fileKey  (e.g. "grade5/mathematics/week21-day1")
  value: { questions: [...], cachedAt: ISO, weekNum: 21, grade: "5", subject: "mathematics" }

Store: goals_manifest
  key:   gradeKey  (e.g. "grade5")
  value: { goals: [...], cachedAt: ISO }

Store: app_meta
  key:   "prefetch_state"
  value: { lastPrefetchWeek: 21, lastPrefetchGrade: "5", lastPrefetchPlan: "free", prefetchedAt: ISO }
```

## Cache Invalidation Events

Only these events trigger a network fetch. All other sessions read from IndexedDB.

| Event | Action |
|---|---|
| **First login / new account** | Full prefetch: all question files for user's grade + plan tier |
| **Week boundary crossed** (Mon 00:00) | Fetch new week files, evict files older than 2 weeks |
| **Grade change** (profile edit) | Flush all cached files for old grade; prefetch for new grade |
| **Plan upgrade** (free → pro) | Fetch Sets 3–5 + exam files for current week (already have Sets 1–2) |
| **Manual refresh** (escape hatch) | User-triggered "Refresh content" in settings; full refetch |
| **App version bump** | SW detects new version hash; full refetch of all files |

Everything else (daily quiz, navigating between goals, retrying sets) → IndexedDB only.

## Prefetch Logic

```js
async function prefetchWeekContent(user) {
  const state = await idb.get('app_meta', 'prefetch_state');
  const currentWeek = _getWeekNumber();

  const needsRefetch =
    !state ||
    state.lastPrefetchWeek !== currentWeek ||
    state.lastPrefetchGrade !== user.grade ||
    state.lastPrefetchPlan  !== user.plan;

  if (!needsRefetch) return;   // nothing to do — serve from cache

  const filesToFetch = _getFilesForUser(user, currentWeek);  // from manifest
  await Promise.all(filesToFetch.map(fetchAndStore));
  await idb.put('app_meta', 'prefetch_state', {
    lastPrefetchWeek: currentWeek, lastPrefetchGrade: user.grade,
    lastPrefetchPlan: user.plan,   prefetchedAt: new Date().toISOString()
  });
}
```

Prefetch runs in the background after `init()` completes — it does not block the home screen render.

## What Gets Prefetched

| User type | Files fetched |
|---|---|
| Free, Grade 5 | This week Sets 1–2 (Math + Science), last week Sets 1–2, goals manifest |
| Pro, Grade 5 | This week Sets 1–5 + Exam, last week Sets 1–5 + Exam, goals manifest |
| After grade change | Above for new grade; old grade files evicted |

Files older than 2 weeks are evicted from IndexedDB on each prefetch cycle.

## Network Traffic Estimate
- Current (no cache): ~10 fetches/day/user on active days
- With prefetch: ~8–12 fetches/week/user regardless of daily activity
- Reduction: **~85% fewer network calls** for an active daily user

## Offline Experience During Quiz
- Questions come from IndexedDB — zero latency, works on airplane mode
- Session responses saved to localStorage (existing behaviour)
- Drive sync attempted at session end; queued if offline (P3-T008 sync queue)
- "Practicing offline" indicator shown if `!navigator.onLine` (from P3-T008)

## Prefetch Progress Indicator (First Login Only)
On first login, show a subtle progress state:
```
Setting up your content...  [████░░░░] 40%
```
Shown once. Subsequent logins are silent background updates.

## Acceptance Criteria
- [ ] IndexedDB store initialised on first load with correct schema
- [ ] `prefetchWeekContent()` runs after `init()` without blocking home screen render
- [ ] No network calls during quiz when content is cached
- [ ] Grade change → old grade content evicted, new grade content fetched
- [ ] Plan upgrade → Sets 3–5 fetched immediately without requiring re-login
- [ ] Week boundary (Monday) → new week files fetched, files > 2 weeks old evicted
- [ ] Manual "Refresh content" in settings triggers full refetch
- [ ] App fully functional offline after one successful prefetch session
- [ ] First-login progress indicator shown, silent thereafter
- [ ] DevTools Application → IndexedDB → `decashift_content` shows populated stores

## Files to Touch
- `app/ui/storage.js` — IndexedDB wrapper (`idb.get`, `idb.put`, `idb.delete`),
  `prefetchWeekContent()`, eviction logic
- `app/ui/app.js` — call `prefetchWeekContent()` at end of `init()`,
  hook grade-change and plan-upgrade events to trigger targeted refetch
- `app/ui/index.html` — first-login progress bar

## Dependencies
- P1-T013 (multi-file questions folder — done; prefetch reads the same manifest)
- P3-T008 (Service Worker / offline — companion task; SW is the safety net, this is the strategy)
- P3-T028 (set gating — plan tier determines which files to prefetch)
- P2-T026 (tamper protection — plan verification before fetching Pro files)
- P3-T025 (file architecture at scale — prefetch volume grows with that manifest design)

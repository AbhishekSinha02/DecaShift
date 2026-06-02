# ENH-009 — Sign-in performance: reduce latency on login

**Priority:** 🔴 P1  
**Estimate:** 0.5 session  
**Status:** Open  

---

## Problem

Sign-in currently takes noticeably long on every login. The root cause: `_handleSignin()` blocks the UI waiting for:

1. `_loadManifest()` — fetches `manifest.json` index from GitHub Raw, then fetches the user's grade shard (e.g. `manifest-grade-7.json`) — 2 sequential network calls
2. `_loadQuestionsForUser()` — fetches ALL question files for the user's grade in parallel — can be 20–40 `fetch()` calls to GitHub Raw
3. Only THEN is the home screen shown

On a slow 4G connection (₹8,000 Android phone target) this is 3–5 seconds of white screen after entering the password.

---

## Fix strategy

### Step 1 — Show home skeleton immediately (perceived performance)

After password verification, show the home screen RIGHT AWAY before fetching questions:

```js
// In _handleSignin():
state.user = user;
await _showScreen('home');         // ← show skeleton immediately
_renderHomeShell();                // ← render header/streak only, leave goals-list as skeleton

// Load data in background
sessionStorage.removeItem('ds_manifest_cache');
await _loadManifest();
await _loadQuestionsForUser(user);
_renderHome();                     // ← fill in real content
```

The skeleton is already in the HTML:
```html
<div id="goals-list" class="goals-list">
  <div class="skeleton-shelf" aria-hidden="true">...</div>
  <div class="skeleton-shelf" aria-hidden="true">...</div>
</div>
```

So the user sees the app immediately with loading placeholders, then content fills in.

### Step 2 — Cache question files in sessionStorage

Currently question files are re-fetched on every sign-in. Cache them in sessionStorage keyed by filename. On sign-in, serve from cache if present.

```js
async function _fetchQuestionFile(filename) {
  const cacheKey = 'ds_qfile_' + filename.replace(/\//g, '_');
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached);
  
  // fetch from network...
  const data = await fetchFromGitHub(filename);
  if (data) sessionStorage.setItem(cacheKey, JSON.stringify(data));
  return data;
}
```

### Step 3 — Pair with FEAT-003 lazy loading

Only fetch the Daily Sprint shard on sign-in. Other subject shards load on tab click. This reduces initial fetch count from ~40 to ~8.

---

## Acceptance

Sign-in to visible home screen: ≤1 second (skeleton shown). Full content loaded: ≤3 seconds on 4G.

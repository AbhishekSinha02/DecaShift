# BUG-026 — Sign Out → Sign In leaves home screen empty (no subject tabs, no content)

**Severity:** 🔴 High — breaks the core re-entry flow  
**Repro:** Laptop · Chrome Incognito  
**Status:** Open — RCA in progress  

---

## Symptom

After signing out and signing back in (same incognito session):

| Element | Visible? |
|---|---|
| Left nav-rail | ✓ |
| Header | ✓ |
| Streak bar | ✓ |
| Subject tabs (Math / Science / etc.) | ✗ |
| Weekly content cards | ✗ |
| Flash drills section | ✗ |
| "Try GK" button | ✓ (hardcoded, doesn't depend on goals) |

**Key observation:** Fresh landing → Sign In in the same session works fine. Only sign-out → sign-in is broken.

---

## Root Cause Analysis (RCA)

### Why subject tabs disappear

`_renderHome()` renders subject tabs only when `allTabs.length > 1`:
```js
const subjects = [...new Set([...regularGoals, ...weeklyGoals].map(g => g.subject))];
const allTabs = subjects.length > 0 ? ['daily-sprint', ...subjects] : [];
if (allTabs.length > 1) {
  tabsEl.style.display = 'flex';
  ...
} else {
  tabsEl.style.display = 'none';  // ← this fires → tabs hidden
}
```

If `state.goals = []`, `subjects = []`, `allTabs = []`, tabs are hidden. This confirms `state.goals` is empty when `_renderHome()` runs.

GK works because it is hardcoded and does not read `state.goals`.

### Why `state.goals` is empty

`state.goals` is populated by `_loadQuestionsForUser(user)`:
```js
async function _loadQuestionsForUser(user) {
  const entries = _filterManifest(state.manifest, user);
  // if entries is empty → state.goals stays []
  ...
}
```

`_filterManifest` returns `[]` if either:
- `state.manifest` is empty
- `user.category` is falsy
- No manifest entries match the user's grade

### The suspected culprit — `_loadManifest()` v2 shard mode

`_loadManifest()` uses `Storage.loadUser()` (NOT `state.user`) to decide which grade shard to fetch:

```js
async function _loadManifest() {
  const cached = sessionStorage.getItem('ds_manifest_cache');
  if (cached) { state.manifest = JSON.parse(cached); return; }

  const index = await _fetchJSON([...]);           // fetches manifest.json (v2 shard index)
  // ...
  const user      = Storage.loadUser();            // ← reads from localStorage
  const shardKeys = _getShardsForUser(user, index.shards);
  const arrays    = await Promise.all(
    shardKeys.map(k => _fetchJSON([...index.shards[k]...]))
  );
  state.manifest = arrays.flat().filter(Boolean);
}
```

`_getShardsForUser(null, shards)` returns only `['flash']` — no grade shard. This means `state.manifest` only has flash drill entries, and `_filterManifest` finds zero school entries → `state.goals = []`.

### Sign-out flow does NOT clear user from localStorage early enough

`signOut()`:
```js
async function signOut() {
  Storage.clearSession();   // removes decashift_user from localStorage
  state.user = null;
  state.goals = [];
  state.questions = [];
  await _showScreen('landing');
  _setupLanding();
}
```

After `signOut()`, `Storage.loadUser()` returns null.

### Sign-in flow — order of operations

`_handleSignin()`:
```js
let user = Storage.loadUser();            // (1) null — cleared by signOut
if (!user || user.userId !== account.userId) {
  const { passwordHash: _ph, ...userProfile } = account;
  user = userProfile;
  Storage.saveUser(user);                 // (2) user SAVED to localStorage
}
if (!user.trialStartDate) { ... Storage.saveUser(user); }  // (3) maybe
state.user = user;                        // (4)
sessionStorage.removeItem('ds_manifest_cache');  // (5) clears cache
await _loadManifest();                    // (6) _loadManifest calls Storage.loadUser()
await _loadQuestionsForUser(user);        // (7)
_renderHome();                            // (8)
```

Step (2) runs before step (6). `Storage.saveUser()` is synchronous. So `Storage.loadUser()` at step (6) SHOULD return the user.

### Unresolved question

The order appears correct from code analysis. Yet the bug reproduces on laptop incognito. Possible remaining causes:

**Hypothesis A — shard fetch silently fails (most likely)**  
In incognito, the GitHub Raw shard file (e.g. `manifest-grade-7.json`) may fail on the second fetch (cold cache after sign-out/sign-in). The first sign-in succeeds because the CDN edge cache is warm. After sign-out/sign-in ~30 seconds later, the edge cache may be warm too — but in incognito the browser has no local fetch cache, and GitHub may rate-limit unauthenticated requests from the same IP if many shards are fetched rapidly.

`_fetchQuestionFile` returns `null` on failure and is silently skipped. `state.goals = []`.

**Hypothesis B — Storage.loadUser() returns null despite saveUser being called**  
Unlikely but: some localStorage quota or serialization error in incognito mode causes `saveUser` to silently fail.

**Hypothesis C — user.category is missing from reconstructed user**  
The account record might not have `category` if it was saved in a way that drops it. Needs verification by logging.

---

## What to check when reproducing

Open DevTools console before sign-out → sign-in:
```js
// After sign-in button click, before home renders:
console.log('user', Storage.loadUser());
console.log('manifest length', state.manifest.length);
console.log('goals length', state.goals.length);
```

Expected: user has `category` + `grade`. Manifest length > 0. Goals length > 0.
If manifest.length = 0 → shard fetch failed → Hypothesis A.
If manifest.length > 0, goals = 0 → `_filterManifest` failing → Hypothesis B or C.
If user.category is undefined → Hypothesis C.

---

## Fix options

### Option A — Add console logging + defensive guard (diagnostic first)
Add temporary console logs in `_loadManifest()` and `_loadQuestionsForUser()` to confirm which hypothesis is correct.

### Option B — Fallback to state.user if Storage.loadUser() returns null (safest, likely correct fix)

In `_loadManifest()`, change:
```js
const user = Storage.loadUser();
```
to:
```js
const user = Storage.loadUser() || state.user;
```

This ensures that even if localStorage hasn't been flushed yet (or fails), `state.user` is used. Since `state.user = user` is set at step (4) before `_loadManifest()` is called at step (6), `state.user` is always available.

### Option C — Pass user as parameter to `_loadManifest(user)`
Cleaner: avoid reading from localStorage inside `_loadManifest` entirely. The caller always has the user.

### Option D — Clear sessionStorage manifest cache in signOut()
Add `sessionStorage.removeItem('ds_manifest_cache')` to `signOut()` as defensive measure. This doesn't fix the root cause but eliminates one edge case.

---

## Recommended fix

**Option B + D combined** — minimal change, defensive:

1. In `_loadManifest()`: `const user = Storage.loadUser() || state.user;`
2. In `signOut()`: add `sessionStorage.removeItem('ds_manifest_cache');`

If Hypothesis A is the real cause (shard fetch fails), the deeper fix is to add retry logic to `_fetchQuestionFile` or to fall back to the FULL manifest when shard fetches fail.

---

## Files to change

| File | Change |
|---|---|
| `app/ui/js/app-core.js` | `_loadManifest()` — use `state.user` as fallback |
| `app/ui/js/app-auth.js` | `signOut()` — clear sessionStorage cache |

---

## Related

- FEAT-002: changed login from email → User ID (shipped 2026-06-04, same session as bug found)
- `storage.js: findAccount()` — uses `loginId` as key post FEAT-002
- Incognito: no service worker cache, no browser fetch cache → all content from GitHub Raw network

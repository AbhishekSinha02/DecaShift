# Session: PENDING — Grade-Sharded Manifest (P1-T018)

**Priority:** 1  ← TOP of queue, run this next
**Type:** Code / Infrastructure
**Est. Duration:** 1.5 hours
**Task:** P1-T018
**Trigger:** "start the session"
**Depends on:** — (standalone, no dependency)

---

## Objective

Split the 58KB monolithic `manifest.json` into 15 grade-sharded files so each user
downloads only their grade's metadata (~3–8KB) instead of the entire 58KB blob.
Zero-downtime migration with legacy fallback. No change to question files or UI.

---

## Context

- `manifest.json` is 58KB / 408 entries today; grows ~40 entries per new content week
- Every user downloads all grades on every login — Grade 7 pays for Grade 12 content
- At full content scale (52 weeks × 11 grades): ~700KB manifest
- Fix is structural: split by grade, load only what the user needs
- Full spec in: `tasks/P1-T018-manifest-sharding.md`

---

## Read Before Starting

```
app/ui/app-core.js          lines 114–133  (_loadManifest, _filterManifest)
app/ui/questions/manifest.json              (full 408-entry file — know its structure)
```

---

## Execute In This Order

### Step 1 — Read manifest.json fully, count entries per grade

Understand the exact split before touching any file.

### Step 2 — Generate 15 shard files

Create these files by extracting entries from `manifest.json`:

| File | Filter condition |
|---|---|
| `manifest-grade-2.json`  | `"grade": 2` |
| `manifest-grade-3.json`  | `"grade": 3` |
| `manifest-grade-4.json`  | `"grade": 4` |
| `manifest-grade-5.json`  | `"grade": 5` |
| `manifest-grade-6.json`  | `"grade": 6` |
| `manifest-grade-7.json`  | `"grade": 7` |
| `manifest-grade-8.json`  | `"grade": 8` |
| `manifest-grade-9.json`  | `"grade": 9` |
| `manifest-grade-10.json` | `"grade": 10` |
| `manifest-grade-11.json` | `"grade": 11` |
| `manifest-grade-12.json` | `"grade": 12` |
| `manifest-college.json`  | `"category": "college"` |
| `manifest-professional.json` | `"category": "professional"` |
| `manifest-regional.json` | subject starts with `"regional-"` |
| `manifest-flash.json`    | `"category": "flash"` |

Each file is a plain JSON array `[...]` — same entry schema as today.

### Step 3 — Update `_loadManifest()` in app-core.js

Replace the current implementation with shard-aware loading.
Keep the full logic in `_loadManifest()`:

```js
async function _loadManifest() {
  const cached = sessionStorage.getItem('ds_manifest_cache');
  if (cached) { state.manifest = JSON.parse(cached); return; }

  const index = await _fetchJSON([
    _rawUrl('app/ui/questions/manifest.json'),
    'questions/manifest.json'
  ]);
  if (!index) { state.manifest = []; return; }

  // Legacy fallback: old array format
  if (Array.isArray(index)) {
    state.manifest = index;
    sessionStorage.setItem('ds_manifest_cache', JSON.stringify(index));
    return;
  }

  // v2 shard mode
  const user      = Storage.loadUser();
  const shardKeys = _getShardsForUser(user, index.shards);
  const arrays    = await Promise.all(
    shardKeys.map(k => _fetchJSON([
      _rawUrl('app/ui/questions/' + index.shards[k]),
      'questions/' + index.shards[k]
    ]))
  );
  state.manifest = arrays.flat().filter(Boolean);
  sessionStorage.setItem('ds_manifest_cache', JSON.stringify(state.manifest));
}

function _getShardsForUser(user, shards) {
  const keys = ['flash'];
  if (!user) return keys;
  const cat = user.category;
  if (cat === 'school') {
    const g = user.grade === 'college' ? 'college' : 'school-' + user.grade;
    if (shards[g])        keys.push(g);
    if (shards['regional'] && user.regionalLanguage) keys.push('regional');
  } else if (cat === 'college') {
    if (shards['college']) keys.push('college');
  } else if (cat === 'professional') {
    if (shards['professional']) keys.push('professional');
  }
  return keys;
}

async function _fetchJSON(urls) {
  for (const url of urls) {
    try {
      const r = await fetch(url);
      if (r.ok) return r.json();
    } catch (_) {}
  }
  return null;
}
```

Also remove the old `_fetchQuestionFile` url-building (it inline-uses `_rawUrl`) — replace with `_fetchJSON`.

### Step 4 — Save manifest-legacy.json (rollback copy)

```bash
cp app/ui/questions/manifest.json app/ui/questions/manifest-legacy.json
```

### Step 5 — Replace manifest.json with shard index

```json
{
  "version": 2,
  "shards": {
    "school-2":       "manifest-grade-2.json",
    "school-3":       "manifest-grade-3.json",
    "school-4":       "manifest-grade-4.json",
    "school-5":       "manifest-grade-5.json",
    "school-6":       "manifest-grade-6.json",
    "school-7":       "manifest-grade-7.json",
    "school-8":       "manifest-grade-8.json",
    "school-9":       "manifest-grade-9.json",
    "school-10":      "manifest-grade-10.json",
    "school-11":      "manifest-grade-11.json",
    "school-12":      "manifest-grade-12.json",
    "college":        "manifest-college.json",
    "professional":   "manifest-professional.json",
    "regional":       "manifest-regional.json",
    "flash":          "manifest-flash.json"
  }
}
```

### Step 6 — Clear sessionStorage cache key in index.html (one-time)

After login, `sessionStorage.removeItem('ds_manifest_cache')` is called — this is already done in `saveProfileEdit()`. Also add it to the sign-in flow so existing users get the new shards on next login.

In `app-auth.js`, after successful sign-in:
```js
sessionStorage.removeItem('ds_manifest_cache');
```

### Step 7 — Verify

Open app in browser (or describe what to check):
- Sign in as Grade 7 → home loads, Math/Science tabs appear, weekly cards render
- Sign in as Grade 10 → same
- Sign in as Grade 12 → Physics/Chemistry/Math appear
- Check Network tab: only `manifest.json` (tiny) + `manifest-grade-N.json` fetched

### ✅ COMMIT after Step 7 passes

```bash
git add app/ui/questions/manifest*.json app/ui/app-core.js app/ui/app-auth.js
git commit -m "perf(P1-T018): shard manifest by grade — 58KB→<8KB per user; legacy fallback preserved"
git push origin main
```

---

## Success Criteria

- [ ] `manifest.json` is the shard index (v2, ~500B)
- [ ] 15 shard files exist in `questions/`
- [ ] Grade 7 user: only `manifest-grade-7.json` + `manifest-flash.json` fetched
- [ ] Grade 10 user: only `manifest-grade-10.json` + `manifest-flash.json` fetched
- [ ] Legacy array format still works (fallback path in `_loadManifest`)
- [ ] `manifest-legacy.json` present as rollback
- [ ] `sessionStorage` cache cleared on sign-in so existing users re-fetch shards
- [ ] All grades tested: questions appear correctly
- [ ] No console errors

## Hand-off

After this: manifest can grow indefinitely without affecting any user's load time.
Each grade's shard only grows with that grade's content.
Next steps: update `_loadQuestionsForUser()` to also invalidate shard cache when grade changes (already handled via `sessionStorage.removeItem('ds_manifest_cache')` in `saveProfileEdit`).

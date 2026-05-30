# Feature: Grade-Sharded Manifest (P1-T018)

**Priority:** P1 | **Type:** Performance / Infrastructure | **Complexity:** S | **Status:** Pending
**Created:** 2026-05-29

> The manifest is the first network request after login. Every byte here costs
> real time on a ₹8,000 Android phone on 4G. At 58KB today and growing linearly
> with content, this is a structural problem that must be fixed before scale.

---

## Why P1

- **Direct impact on first 100 paid users:** Slow first load = parent bounces = no conversion.
  On a 4G Indian mobile connection, 58KB is ~200ms extra. At full scale it becomes 700KB+.
- **Blocks content scaling:** Every new week of content makes this worse. Fix the structure
  before generating more content, not after.
- **Zero user-visible change:** This is pure infrastructure. No UI work, no risk of regression
  in features. The highest ROI category of task.

**Decision filter:**
- Moves toward 5K users? ✅ Faster load = better conversion, especially on low-end devices
- Fixes F1 (content)? ❌ (but unblocks unlimited content scaling)
- Creates shareable moment? ❌
- Works on ₹8,000 Android on 4G? ✅ This IS the fix for that constraint

---

## Current State

```
questions/manifest.json  — 58KB, 408 entries, 1 file, all grades loaded for every user
```

Growth projection:
- +2 weeks for Gr 2–8: ~120KB
- Full 52-week content: ~700KB+

A Grade 7 user currently downloads metadata for Grades 2, 3, 4, 5, 6, 8, 9, 10, 11, 12,
college, professional, and regional — none of which they'll ever see.

---

## Target State

```
questions/
  manifest.json                ← index only: { "version": 2, "shards": {...} }  ~500B
  manifest-grade-2.json        ← all Grade 2 entries  ~6KB
  manifest-grade-3.json        ← all Grade 3 entries  ~6KB
  manifest-grade-4.json        ← ~6KB
  manifest-grade-5.json        ← ~6KB
  manifest-grade-6.json        ← ~6KB
  manifest-grade-7.json        ← ~5KB
  manifest-grade-8.json        ← ~5KB
  manifest-grade-9.json        ← ~2KB
  manifest-grade-10.json       ← ~2KB
  manifest-grade-11.json       ← ~2KB
  manifest-grade-12.json       ← ~2KB
  manifest-college.json        ← ~500B
  manifest-professional.json   ← ~500B
  manifest-regional.json       ← ~2KB
  manifest-flash.json          ← ~300B
```

**Per-user cold load after sharding:**

| User | Before | After |
|---|---|---|
| Grade 7 (school) | 58KB | ~5KB (grade-7 + flash) |
| Grade 10 (school) | 58KB | ~3KB (grade-10 + flash) |
| Grade 7 + Marathi | 58KB | ~7KB (grade-7 + regional + flash) |
| Full scale (52w) | 700KB+ | ~8KB always |

---

## Schema — Index File (`manifest.json` after migration)

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

Each shard file is just a JSON array — same schema as today's manifest entries.

---

## Code Change — `_loadManifest()` in `app-core.js`

**Current (loads everything):**
```js
async function _loadManifest() {
  // fetches manifest.json → assigns full array to state.manifest
}
```

**After (loads only what user needs):**
```js
async function _loadManifest() {
  const index = await _fetchManifestIndex();
  if (!index.version || index.version < 2) {
    // legacy fallback: load full array as before
    state.manifest = Array.isArray(index) ? index : [];
    return;
  }
  // shard mode: determine which shards this user needs
  // (called before user is loaded, so load ALL shards in parallel at init,
  //  then re-load targeted shards after login if user changed grade)
  const user = Storage.loadUser();
  const shardKeys = _getShardsForUser(user, index.shards);
  const results = await Promise.all(shardKeys.map(k => _fetchShard(index.shards[k])));
  state.manifest = results.flat().filter(Boolean);
}

function _getShardsForUser(user, shards) {
  const keys = ['flash'];  // always load flash
  if (!user) return keys;  // pre-login: just flash
  const cat = user.category;
  if (cat === 'school') {
    const g = user.grade === 'college' ? 'college' : 'school-' + user.grade;
    keys.push(g);
    if (user.regionalLanguage) keys.push('regional');
  } else if (cat === 'college') {
    keys.push('college');
  } else if (cat === 'professional') {
    keys.push('professional');
  }
  return keys.filter(k => shards[k]);
}
```

**No changes to `_filterManifest()`** — it works on the same array, just smaller.

---

## Migration Plan (Zero Downtime)

1. **Generate shard files** from current `manifest.json` — split entries by grade/category into 15 files
2. **Update `_loadManifest()`** — detect `version: 2`, fall back to legacy array if not present
3. **Test:** sign in as Grade 7 → confirm questions load → sign in as Grade 10 → same
4. **Flip `manifest.json`** to index-only (version 2 format)
5. **Verify and push**

Old `manifest.json` (array format) can be kept as `manifest-legacy.json` for one release cycle.

---

## Files to Touch

- `app/ui/questions/manifest.json` — convert to shard index
- `app/ui/questions/manifest-grade-{N}.json` × 11 — generated shard files
- `app/ui/questions/manifest-college.json`
- `app/ui/questions/manifest-professional.json`
- `app/ui/questions/manifest-regional.json`
- `app/ui/questions/manifest-flash.json`
- `app/ui/app-core.js` — `_loadManifest()`, add `_getShardsForUser()`, `_fetchShard()`

---

## Acceptance Criteria

- [ ] `manifest.json` is the index (version 2, ~500B)
- [ ] Each grade loads only its own shard + flash
- [ ] Grade 7 manifest fetch total < 8KB
- [ ] All existing grades tested: questions load correctly
- [ ] `manifest-legacy.json` kept as rollback
- [ ] Service Worker cache updated (shard files individually cacheable)
- [ ] app-core.js change is backward compatible (legacy array fallback works)
- [ ] No change to question file format, goals, or any UI component

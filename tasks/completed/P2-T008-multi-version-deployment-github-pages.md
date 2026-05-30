# Setup: Multi-Version Deployment via GitHub Pages Subdirectories

**Priority:** P2 | **Type:** Technical | **Complexity:** S | **Status:** Done ✅ (v1/ folder created, app/ui/ = latest)

## Goal
Deploy 2–3 versions of the app simultaneously so you can open them side by side in the browser and compare behavior, UI, or data schema — without any extra hosting cost.

## How It Works
Each version lives in its own subfolder in the repo root. GitHub Pages serves all of them from the same domain.

```
repo root (served by GitHub Pages)
├── v1/              ← copy of app at v1.0 state
│   ├── index.html
│   ├── styles.css
│   ├── app.js
│   └── storage.js
├── v2/              ← copy of app at v2.0 state (after auth)
│   └── ...
└── app/ui/          ← always the latest (current development)
    └── ...
```

**Live URLs:**
```
https://abhisheksinha02.github.io/DecaShift/v1/
https://abhisheksinha02.github.io/DecaShift/v2/
https://abhisheksinha02.github.io/DecaShift/app/ui/   ← latest
```

## Acceptance Criteria
- [ ] `v1/` folder created by copying `app/ui/` at the v1.0 tag state
- [ ] Each versioned folder is self-contained — its own HTML/CSS/JS, no shared imports
- [ ] `CONFIG.contentBranch` in each version's `app.js` points to the correct git tag's raw files
- [ ] All three URLs open independently and function fully in separate browser tabs
- [ ] GitHub Pages root set to `/` (repo root), not `/app/ui/`
- [ ] No version folder affects another — localStorage keys are namespaced by version: `decashift_v1_user`, `decashift_v2_user`

## localStorage Namespacing (prevents version cross-contamination)
Add to each version's `storage.js`:
```js
const VERSION = 'v1'; // change per version folder
const KEYS = {
  USER:     `decashift_${VERSION}_user`,
  SESSIONS: `decashift_${VERSION}_sessions`
};
```

## Acceptance Test
- Open `/v1/` and `/v2/` in two browser tabs simultaneously
- Register different users in each — confirm no localStorage collision
- Change a question in `questions.json` — confirm only `/app/ui/` (latest) picks it up

## Dependencies
- P2-T007 (tagging must exist so you know what state each version folder represents)
- P1-T010 (GitHub raw URLs make version-specific content fetching possible via `contentBranch`)

## Files to Touch
- New: `v1/` folder (copy of `app/ui/` at v1.0 tag)
- `v1/storage.js` — add `VERSION = 'v1'` namespace
- `v1/app.js` — set `CONFIG.contentBranch = 'main'` (or tag ref)
- GitHub Pages settings: change source to root `/`

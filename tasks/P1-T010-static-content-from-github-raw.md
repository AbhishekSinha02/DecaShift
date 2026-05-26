# Refactor: Serve Static JSON Content from GitHub Raw URLs

**Priority:** P1 | **Type:** Technical | **Complexity:** S | **Status:** Pending

## Goal
Fetch `goals.json` and `questions.json` directly from GitHub's raw file URL instead of relative paths. This means content is always in sync with the repo — no manual upload, no Drive folder needed for read-only data.

## Why
- Files already live in the repo — GitHub serves them publicly for free
- Every `git push` automatically updates content for all users
- Versioned by git — rolling back content = rolling back a commit
- Removes any confusion about Drive being needed for static content
- Works identically on localhost and GitHub Pages

## GitHub Raw URL Format
```
https://raw.githubusercontent.com/AbhishekSinha02/DecaShift/main/app/ui/goals.json
https://raw.githubusercontent.com/AbhishekSinha02/DecaShift/main/app/ui/questions.json
```

## Acceptance Criteria
- [ ] `app.js` `_loadData()` fetches from GitHub raw URLs (not relative `./goals.json`)
- [ ] A `CONFIG.contentBranch` variable controls which branch to fetch from (default: `"main"`)
- [ ] Switching `contentBranch` to `"v2"` or `"staging"` fetches that branch's content — enables version comparison
- [ ] Fallback: if GitHub fetch fails, try relative path `./goals.json` (works on localhost without internet)
- [ ] Cache-busting: append `?v=<git-sha-or-timestamp>` to prevent stale CDN responses
- [ ] No change to how content is rendered — only the fetch source changes
- [ ] Test: push a new question to `questions.json` → refresh app → new question appears

## CONFIG Object (add to top of app.js)
```js
const CONFIG = {
  owner: 'AbhishekSinha02',
  repo: 'DecaShift',
  contentBranch: 'main',
  rawBase: 'https://raw.githubusercontent.com'
};
```

## Dependencies
- None — isolated change to `_loadData()` only

## Files to Touch
- `app/ui/app.js` — `_loadData()` function + `CONFIG` object at top

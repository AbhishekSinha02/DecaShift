# Setup: Git Version Tagging Strategy for Deployable Versions

**Priority:** P2 | **Type:** Technical | **Complexity:** S | **Status:** Done ✅ (v1.0, v1.1 tagged)

## Goal
Establish a clear convention for tagging releases so any version can be retrieved, deployed, or compared at any time. Every significant app state is a named, recoverable point.

## Tagging Convention
```
v1.0   — first working registration screen (current state)
v1.1   — after P1-T001 (perf fix)
v2.0   — after full P1 block (auth + categories + auto-save)
v2.1   — after P2 landing page + dark mode
v3.0   — after P3 streaks + badges
```

- `vMAJOR.MINOR` — major = new screen or feature block, minor = fix or small addition
- Tag at the end of each task completion, not mid-task
- Tag message describes what changed: `git tag -a v1.1 -m "fix: non-blocking profile save"`

## Acceptance Criteria
- [ ] Current state tagged as `v1.0` and pushed to GitHub (`git push origin --tags`)
- [ ] `VERSIONS.md` in repo root lists each tag, what changed, and the GitHub Pages URL for that version
- [ ] Git tag creation added as the final step in every task's definition of done
- [ ] Tags visible on GitHub under Releases tab (create a GitHub Release from each tag)
- [ ] Any version retrievable with: `git checkout v1.0` locally

## Tagging Command Reference
```bash
git tag -a v1.0 -m "feat: initial registration screen + Drive sync"
git push origin --tags
```

## Dependencies
- None — can be done immediately against current codebase

## Files to Touch
- New: `VERSIONS.md` in repo root (version changelog)
- No app code changes

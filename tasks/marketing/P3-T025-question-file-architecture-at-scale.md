# Feature: Question File Architecture at Scale

**Priority:** P3 | **Type:** Technical / Architecture | **Complexity:** M | **Status:** Pending

## Goal
Design and implement a file loading strategy that stays performant and maintainable
as the question bank grows from the current ~300 questions to 1,000+ questions across
100+ files — without requiring a database or build step.

## Problem
Current architecture (manifest-driven GitHub raw file loading) works well up to ~50 files.
As weekly question sets compound (7 files/week × 52 weeks = 364 files/year, per grade),
the manifest itself becomes large, initial load slows, and the `_loadData()` function
starts firing dozens of concurrent fetch requests. There is no:
- File size enforcement (one large file vs. many small ones?)
- Lazy loading (only fetch files relevant to today's date / current user)
- Manifest pagination or delta updates
- Strategy for archiving old content without breaking existing session records

## File Size and Splitting Rules

### Targets
- Max questions per file: **50** (fits in one fetch, readable in one edit)
- Min questions per file: **5** (avoid hundreds of micro-files)
- Weekly day files: already 1 file/day/grade/subject → keep this pattern
- Topic files: split by topic within subject if > 50 questions

### Manifest Evolution Plan
Current manifest: single `manifest.json` listing all files.

**Phase 1 (now – 500q):** Single manifest, all files listed. Already implemented.

**Phase 2 (500q – 2000q):** Split manifest by grade:
```
questions/
  manifest-grade3.json
  manifest-grade5.json
  ...
```
App loads only the manifest for the current user's grade.

**Phase 3 (2000q+):** Split manifest by grade + subject:
```
questions/
  grade3/
    manifest-math.json
    manifest-science.json
```
App loads manifest for user's grade + selected subject only.

### Lazy Loading Strategy
- On home screen load: fetch only the manifest for user's grade
- On quiz start: fetch only the files for the selected goal/week
- Never pre-fetch all files on app init
- Cache fetched files in sessionStorage (avoid re-fetch within same tab session)

### Archiving Old Weekly Files
- Files older than 6 months move to `questions/archive/YYYY/`
- Archive manifest is only loaded if user explicitly views "Past weeks"
- Session records reference `questionId` (stable), not file paths, so archives don't break history

### GitHub Raw URL Limits
- GitHub raw has no official rate limit for small repos, but large repos (>100MB) get throttled
- Monitor total repo size; if approaching 50MB of JSON, consider moving question files to a CDN (Cloudflare R2 or GitHub Releases assets)

## Performance Targets
| Metric | Target |
|---|---|
| Time to first question (cold load) | < 1.5s on 4G |
| Manifest fetch size | < 10KB per grade |
| Concurrent fetches on quiz start | ≤ 3 |
| Total questions in memory at once | ≤ 100 |

## Acceptance Criteria
- [ ] File size audit: flag any file > 50 questions
- [ ] Manifest split by grade implemented (Phase 2) when total files > 30
- [ ] Lazy loading: only current grade's manifest fetched on init
- [ ] sessionStorage caching for fetched question files
- [ ] Archive strategy documented + old files moveable without breaking session history
- [ ] Performance targets measured on a 4G throttled connection in DevTools

## Files to Touch
- `app/ui/app.js` — `_loadData()` refactor for lazy manifest loading
- `app/ui/storage.js` — sessionStorage cache layer
- `questions/` folder structure — grade-split manifests

## Dependencies
- P1-T013 (multi-file questions folder — done, this extends it)
- P3-T019 (content calendar — this architecture is its foundation)
- P3-T023 (content growth strategy — file count projections come from there)

# Feature: Version Comparison Index Page

**Priority:** P2 | **Type:** Functional | **Complexity:** S | **Status:** Done ✅ (root index.html + versions.json)

## Goal
A simple root-level page that lists all deployed versions with links, descriptions, and what changed — so you can open any version instantly without remembering URLs.

## What It Shows
```
DecaShift — Version Comparison

v1.0  [Open]  Registration screen, Drive sync, basic quiz
v2.0  [Open]  + Firebase auth, categories, auto-save
v2.1  [Open]  + Dark mode, landing page, timer toggle
      [Open Latest]
```

## Acceptance Criteria
- [ ] `index.html` at repo root (not inside `app/ui/`) — this becomes the GitHub Pages landing
- [ ] Lists all deployed version folders with: version number, date, 1-line description, "Open" button
- [ ] "Open Latest" button always links to `./app/ui/`
- [ ] Version list is driven by a `versions.json` file — adding a new version = adding one JSON entry, no HTML edit
- [ ] Each version card shows a status badge: `stable` / `beta` / `latest`
- [ ] Dark theme matching the app — feels like part of the product, not a dev tool
- [ ] Mobile-friendly

## `versions.json` Schema
```json
[
  {
    "version": "v1.0",
    "path": "./v1/",
    "date": "2025-05-25",
    "description": "Registration screen, quiz engine, Drive sync",
    "status": "stable"
  },
  {
    "version": "latest",
    "path": "./app/ui/",
    "date": "current",
    "description": "Active development — may be unstable",
    "status": "latest"
  }
]
```

## Acceptance Test
- Push `versions.json` with 2 entries → open GitHub Pages root → both versions listed with working links
- Add a third entry to `versions.json`, push → third card appears with no HTML change

## Dependencies
- P2-T008 (version folders must exist to link to)
- P2-T007 (tags define what each version is)

## Files to Touch
- New: `index.html` at repo root
- New: `versions.json` at repo root
- New: `index.css` at repo root (minimal styles, ~50 lines)

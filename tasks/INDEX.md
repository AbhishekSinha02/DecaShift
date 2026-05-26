# DecaShift — Task Index

> Build for user transformation, not just content delivery.
> Priority is visible in every filename: P1 = must ship first, P6 = future expansion.

---

## Priority Key

| Level | Meaning | Ship When |
|---|---|---|
| **P1** | Foundation — app broken without it | Before any user testing |
| **P2** | Core experience — users expect it | Before public launch |
| **P3** | Engagement & retention — keeps users coming back | First 4 weeks post-launch |
| **P4** | Power features — admin + advanced UX | After first 1,000 users |
| **P5** | Monetization — Stripe + paid tier | After retention is proven |
| **P6** | Ecosystem — collab + scale | After first revenue |

---

## P1 — Foundation (Build First)

| File | Goal | Complexity |
|---|---|---|
| [P1-T001](P1-T001-fix-profile-save-performance.md) | Fix slow "Saving Profile" — non-blocking sync | S |
| [P1-T002](P1-T002-user-signup-email-password.md) | User sign-up with email + password (Firebase Auth) | M |
| [P1-T003](P1-T003-user-signin-form.md) | User sign-in form + forgot password | S |
| [P1-T004](P1-T004-session-persistence-auth.md) | Session persistence — stay logged in across browser restarts | M |
| [P1-T005](P1-T005-user-signout.md) | Sign-out — clean state clear + Firebase signOut | S |
| [P1-T006](P1-T006-user-category-selection.md) | User category: School (Grade 2–12) / College / Professional | S |
| [P1-T007](P1-T007-auto-save-responses-remove-export.md) | Auto-save responses on submit — remove manual CSV/JSON export | S |
| [P1-T008](P1-T008-category-level-question-filtering.md) | Filter questions by user category + difficulty level | M |
| ~~[P1-T009](P1-T009-migrate-drive-to-google-sheets.md)~~ | ~~Replace Drive JSON files with Google Sheets rows~~ — **CANCELLED, superseded by P1-T011** | S |
| [P1-T010](P1-T010-static-content-from-github-raw.md) | Fetch goals.json + questions.json from GitHub raw URLs | S |
| [P1-T011](P1-T011-individual-drive-files-per-user-and-session.md) | One JSON file per user + one JSON file per session in Drive (no shared files) | S |

---

## P2 — Core Experience (Before Public Launch)

| File | Goal | Complexity |
|---|---|---|
| [P2-T001](P2-T001-json-driven-ui-dynamic-reflection.md) | JSON changes reflect on UI instantly — fully data-driven | S |
| [P2-T002](P2-T002-landing-page-success-stories.md) | Landing page with success stories — emotional hook before sign-up | M |
| [P2-T003](P2-T003-mobile-tab-responsive-redesign.md) | Mobile-first + tab-friendly full redesign | M |
| [P2-T004](P2-T004-timer-toggle-on-off.md) | Timer on/off toggle — pressure-free practice option | S |
| [P2-T005](P2-T005-dark-light-mode-toggle.md) | Dark / light mode with system preference detection | S |
| [P2-T006](P2-T006-daily-free-unlimited-practice.md) | Daily free unlimited practice — no paywalls on core loop | S |
| [P2-T007](P2-T007-git-version-tagging-strategy.md) | Git tag convention — every release recoverable by version number | S |
| [P2-T008](P2-T008-multi-version-deployment-github-pages.md) | Deploy v1/v2/latest simultaneously on GitHub Pages subdirectories | S |
| [P2-T009](P2-T009-version-comparison-index-page.md) | Root index page listing all versions with links for side-by-side comparison | S |

---

## P3 — Engagement & Retention (First 4 Weeks)

| File | Goal | Complexity |
|---|---|---|
| [P3-T001](P3-T001-daily-streak-tracking.md) | Daily streak tracking — core habit loop | S |
| [P3-T002](P3-T002-streak-visualization-ui.md) | Streak visualization — flame, 7-day strip, milestone celebrations | S |
| [P3-T003](P3-T003-progress-dashboard.md) | Progress dashboard — accuracy trends, time invested, goal breakdown | M |
| [P3-T004](P3-T004-avatar-profile-photo.md) | Avatar + profile photo upload | S |
| [P3-T005](P3-T005-gamification-badges-milestones.md) | Badges for streaks, accuracy, exploration, growth | M |
| [P3-T006](P3-T006-confidence-consistency-tracking.md) | Confidence + consistency score per goal | S |
| [P3-T007](P3-T007-efficient-question-addition.md) | Admin form + CSV bulk import for adding questions | M |
| [P3-T008](P3-T008-offline-dnd-mode.md) | Offline mode (Service Worker) + DnD focus toggle | M |

---

## P4 — Power Features (After 1,000 Users)

| File | Goal | Complexity |
|---|---|---|
| [P4-T001](P4-T001-admin-dashboard-user-analytics.md) | Admin dashboard — users, sessions, daily actives, goal popularity | M |
| [P4-T002](P4-T002-multi-language-support.md) | Multi-language UI + translated questions (English + Hindi first) | M |

---

## P5 — Monetization (After Retention Proven)

| File | Goal | Complexity |
|---|---|---|
| [P5-T001](P5-T001-stripe-integration-setup.md) | Stripe Checkout — paid plan upgrade flow | L |
| [P5-T002](P5-T002-real-exam-mode-paid.md) | Real exam mode — countdown, no mid-feedback, review before submit | M |
| [P5-T003](P5-T003-leaderboard-paid.md) | Leaderboard — weekly + all-time, exam sessions only | M |

---

## P6 — Ecosystem (After First Revenue)

| File | Goal | Complexity |
|---|---|---|
| [P6-T001](P6-T001-teacher-collab-content.md) | Teacher content contribution + review queue | M |
| [P6-T002](P6-T002-student-peer-collab.md) | Student challenge links + peer comparison | L |
| [P6-T003](P6-T003-institute-partnership-portal.md) | Institute-branded portal + private question banks | L |

---

## Dependency Map

```
P1-T001  (fix perf)          — standalone
P1-T002  (sign-up)           → P1-T003, P1-T004, P1-T005, P1-T006
P1-T003  (sign-in)           → P1-T004, P1-T005
P1-T004  (session persist)   → P3-T001, P3-T003, P3-T005, P3-T006, P5-T001
P1-T006  (categories)        → P1-T008
P1-T008  (question filter)   → P2-T001, P3-T007
P1-T009  (Drive→Sheets)      — CANCELLED, superseded by P1-T011
P1-T011  (individual files)  — standalone, replaces Apps Script internals only
P1-T010  (GitHub raw URLs)   — standalone, isolated to _loadData() in app.js

P2-T001  (JSON-driven)       → P4-T002
P2-T002  (landing page)      → P1-T002 (CTA links to sign-up)
P2-T006  (free practice)     → P6-T002
P2-T007  (git tagging)       → P2-T008, P2-T009
P2-T008  (multi-version)     → P2-T009
P2-T008  (multi-version)     depends on P1-T010 (GitHub raw URLs enable branch switching)

P3-T001  (streak)            → P3-T002, P3-T005
P3-T007  (Q addition)        → P6-T001

P4-T001  (admin)             → P6-T001, P5-T003
P5-T001  (Stripe)            → P5-T002, P5-T003
P5-T002  (exam mode)         → P5-T003
P5-T003  (leaderboard)       → P6-T003
```

---

## Complexity Reference
- **S** — Small: < 1 day | single file change | can ship + test independently
- **M** — Medium: 1–3 days | 2–4 files | needs integration test
- **L** — Large: 3–5 days | cross-cutting | needs staging test before deploy

---

*Total tasks: 29 (1 cancelled) | P1: 11 (P1-T009 cancelled) | P2: 9 | P3: 8 | P4: 2 | P5: 3 | P6: 3*
*All tasks are self-contained, independently deployable, and version-controlled in this folder.*

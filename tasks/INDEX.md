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

| File | Goal | Complexity | Status |
|---|---|---|---|
| [P1-T001](P1-T001-fix-profile-save-performance.md) | Fix slow "Saving Profile" — non-blocking sync | S | ✅ Done |
| [P1-T002](P1-T002-user-signup-email-password.md) | User sign-up with email + password | M | ✅ Done (localStorage auth) |
| [P1-T003](P1-T003-user-signin-form.md) | User sign-in form | S | ✅ Done (localStorage auth) |
| [P1-T004](P1-T004-session-persistence-auth.md) | Session persistence — stay logged in across browser restarts | M | ✅ Done (localStorage) |
| [P1-T005](P1-T005-user-signout.md) | Sign-out — clean state clear | S | ✅ Done |
| [P1-T006](P1-T006-user-category-selection.md) | User category: School (Grade 2–12) / College / Professional | S | ✅ Done |
| [P1-T007](P1-T007-auto-save-responses-remove-export.md) | Auto-save responses on submit — remove manual CSV/JSON export | S | ✅ Done |
| [P1-T008](P1-T008-category-level-question-filtering.md) | Filter questions by user category + difficulty level | M | ✅ Done |
| ~~[P1-T009](P1-T009-migrate-drive-to-google-sheets.md)~~ | ~~Replace Drive JSON files with Google Sheets rows~~ | S | ❌ Cancelled |
| [P1-T010](P1-T010-static-content-from-github-raw.md) | Fetch question files from GitHub raw URLs with local fallback | S | ✅ Done |
| [P1-T011](P1-T011-individual-drive-files-per-user-and-session.md) | One JSON file per user + one JSON file per session in Drive | S | ✅ Done |
| [P1-T012](P1-T012-drive-account-persistence-cross-device-login.md) | Save account to Drive — login works on any device / incognito | S | ✅ Done |
| [P1-T013](P1-T013-multi-file-questions-folder-by-grade-subject-level.md) | Multi-file questions folder — auto-populate goals by grade/subject/level | M | ✅ Done |

---

## P2 — Core Experience (Before Public Launch)

| File | Goal | Complexity | Status |
|---|---|---|---|
| [P2-T001](P2-T001-json-driven-ui-dynamic-reflection.md) | JSON changes reflect on UI instantly — fully data-driven | S | ✅ Done (manifest-driven) |
| [P2-T002](P2-T002-landing-page-success-stories.md) | Landing page with success stories — emotional hook before sign-up | M | ✅ Done |
| [P2-T003](P2-T003-mobile-tab-responsive-redesign.md) | Mobile-first + tab-friendly full redesign | M | 🔄 Partial (touch targets, responsive quiz header done) |
| [P2-T004](P2-T004-timer-toggle-on-off.md) | Timer on/off toggle — pressure-free practice option | S | ✅ Done |
| [P2-T005](P2-T005-dark-light-mode-toggle.md) | Dark / light mode with system preference detection | S | ✅ Done |
| [P2-T006](P2-T006-daily-free-unlimited-practice.md) | Daily free unlimited practice — no paywalls on core loop | S | ✅ Done |
| [P2-T007](P2-T007-git-version-tagging-strategy.md) | Git tag convention — every release recoverable by version number | S | ✅ Done |
| [P2-T008](P2-T008-multi-version-deployment-github-pages.md) | Deploy v1/v2/latest simultaneously on GitHub Pages subdirectories | S | ✅ Done |
| [P2-T009](P2-T009-version-comparison-index-page.md) | Root index page listing all versions with links for side-by-side comparison | S | ✅ Done |
| [P2-T010](P2-T010-local-dev-testing-setup.md) | Local dev testing setup — Live Server + Ctrl+Shift+D quick-fill | S | ✅ Done |
| [P2-T011](P2-T011-manual-test-checklist.md) | Manual test checklist — all screens, auth flows, edge cases | S | Pending |
| **[P2-T012](P2-T012-profile-edit-grade-change.md)** | **Profile edit — grade/role change without losing history** | **S** | **✅ Done** |
| **[P2-T013](P2-T013-subscription-tier-design.md)** | **Subscription strategy — 15-day trial, soft lock, ₹199/month Pro** | **S** | **Pending** |
| **[P2-T014](P2-T014-branding-logo-rename.md)** | **Branding — SVG logo, favicon, PWA icon, tagline** | **M** | **Pending** |
| **[P2-T015](P2-T015-landing-page-improvements.md)** | **Landing page — real stats, screenshot, specific social proof, FAQ** | **M** | **Pending** |
| **[P2-T016](P2-T016-welcome-onboarding-flow.md)** | **Welcome onboarding — first-login modal, guided profile setup, empty states** | **M** | **Pending** |
| **[P2-T017](P2-T017-profile-page-password-reset.md)** | **Profile page — account screen, change password, delete account** | **M** | **Pending** |
| **[P2-T018](P2-T018-automated-testing-strategy.md)** | **Automated E2E tests — Playwright, GitHub Actions CI, all critical flows** | **M** | **Pending** |
| **[P2-T019](P2-T019-subscription-prelaunch-readiness.md)** | **Subscription pre-launch readiness — content depth gate, landing page honesty, differentiation story** | **M** | **Pending** |
| **[P2-T020](P2-T020-content-operations-bulk-import.md)** | **Content operations — in-app admin panel + CSV bulk import for non-developer content growth** | **M** | **Pending** |
| **[P2-T021](P2-T021-subject-tab-filter-ui.md)** | **Subject tab filter — Math / Science / Hindi / French tabs on home screen** | **S** | **✅ Done** |

---

## P3 — Engagement & Retention (First 4 Weeks)

| File | Goal | Complexity | Status |
|---|---|---|---|
| [P3-T001](P3-T001-daily-streak-tracking.md) | Daily streak tracking — core habit loop | S | ✅ Done |
| [P3-T002](P3-T002-streak-visualization-ui.md) | Streak visualization — flame, 7-day strip, milestone celebrations | S | ✅ Done (flame + count; 7-day strip pending) |
| [P3-T003](P3-T003-progress-dashboard.md) | Progress dashboard — accuracy trends, time invested, goal breakdown | M | ✅ Done (inline on home; deep analytics pending) |
| [P3-T009](P3-T009-questions-folder-hierarchy-by-grade.md) | Questions folder hierarchy — nested category/grade, manifest-only discovery | M | ✅ Done |
| **[P3-T010](P3-T010-per-user-session-folder-drive.md)** | **Per-user session folder in Drive — verified + future full user-root folder** | **S** | **✅ Already Implemented (Code.gs)** |
| **[P3-T011](P3-T011-content-expansion-tracking.md)** | **Content expansion — 295 questions across 18 files, targets for 2 subjects/grade** | **S** | **🔄 In Progress (v3.2 adds 295q)** |
| **[P3-T012](P3-T012-colorful-student-theme.md)** | **Colorful student theme (Grade 2–8) — 3rd theme option, warm/bright palette** | **M** | **Pending** |
| ~~[P3-T013](P3-T013-regional-language-learning.md)~~ | ~~Regional language learning (superseded by P3-T018)~~ | **M** | ❌ Superseded |
| **[P3-T014](P3-T014-content-expansion-science-hindi-french-grade2-8.md)** | **Content expansion — Science, Hindi, French for grades 2–8 (22 new files, 264 questions)** | **M** | **✅ Done** |
| **[P3-T015](P3-T015-personalized-questions-username-placeholder.md)** | **Personalized questions — {{userName}} placeholder replaced at render time** | **S** | **✅ Done** |
| **[P3-T016](P3-T016-goal-archive-mark-as-done.md)** | **Goal archive — mark as done, hide from home, "Show completed (N)" toggle** | **S** | **✅ Done** |
| **[P3-T017](P3-T017-weekly-question-sets.md)** | **Weekly question sets — date-gated, Mon–Sun, "This Week" card on home screen** | **M** | **✅ Done** |
| **[P3-T018](P3-T018-regional-language-signup-profile.md)** | **Regional language — signup selection, settings, 120 questions (6 languages × 2 sets)** | **M** | **✅ Done** |
| [P3-T004](P3-T004-avatar-profile-photo.md) | Avatar + profile photo upload | S | Pending |
| [P3-T005](P3-T005-gamification-badges-milestones.md) | Badges for streaks, accuracy, exploration, growth | M | Pending |
| [P3-T006](P3-T006-confidence-consistency-tracking.md) | Confidence + consistency score per goal | S | Pending |
| [P3-T007](P3-T007-efficient-question-addition.md) | Admin form + CSV bulk import for adding questions | M | Pending |
| [P3-T008](P3-T008-offline-dnd-mode.md) | Offline mode (Service Worker) + DnD focus toggle | M | Pending |

---

## P4 — Power Features (After 1,000 Users)

| File | Goal | Complexity | Status |
|---|---|---|---|
| [P4-T001](P4-T001-admin-dashboard-user-analytics.md) | Admin dashboard — users, sessions, daily actives, goal popularity | M | Pending |
| [P4-T002](P4-T002-multi-language-support.md) | Multi-language UI + translated questions (English + Hindi first) | M | Pending |
| **[P4-T003](P4-T003-go-to-market-strategy.md)** | **Go-to-market strategy — target segment, first 100 users plan, success metrics** | **S** | **Pending** |

---

## P5 — Monetization (After Retention Proven)

| File | Goal | Complexity | Status |
|---|---|---|---|
| **[P5-T004](P5-T004-feature-gate-system.md)** | **Feature gate system — `user.plan` checks for Free/Pro/Max** | **S** | **Pending** |
| **[P5-T005](P5-T005-upgrade-prompt-ui.md)** | **Upgrade prompt UI — plan comparison screen with CTA** | **M** | **Pending** |
| [P5-T001](P5-T001-stripe-integration-setup.md) | Stripe Checkout — paid plan upgrade flow | L | Pending |
| [P5-T002](P5-T002-real-exam-mode-paid.md) | Real exam mode — countdown, no mid-feedback, review before submit | M | Pending |
| [P5-T003](P5-T003-leaderboard-paid.md) | Leaderboard — weekly + all-time, exam sessions only | M | Pending |
| **[P5-T006](P5-T006-global-payment-gateway.md)** | **Global payment gateway — Stripe + Razorpay, multi-currency, international markets** | **M** | **Pending** |

---

## P6 — Ecosystem (After First Revenue)

| File | Goal | Complexity | Status |
|---|---|---|---|
| [P6-T001](P6-T001-teacher-collab-content.md) | Teacher content contribution + review queue | M | Pending |
| [P6-T002](P6-T002-student-peer-collab.md) | Student challenge links + peer comparison | L | Pending |
| [P6-T003](P6-T003-institute-partnership-portal.md) | Institute-branded portal + private question banks | L | Pending |
| **[P6-T004](P6-T004-app-internationalization-i18n.md)** | **App & landing page i18n — Hindi, Arabic, French, German, Spanish UI translation + RTL** | **L** | **Pending** |
| **[P6-T005](P6-T005-international-language-learning.md)** | **International language learning — French, German, Arabic, Spanish, Japanese, Mandarin** | **M** | **Pending** |
| **[P6-T006](P6-T006-localized-curriculum-content.md)** | **Localized curriculum — math/science in Arabic, French, German, Spanish for local school markets** | **L** | **Pending** |

---

## Dependency Map

```
P1-T001  (fix perf)          — standalone
P1-T002  (sign-up)           → P1-T003, P1-T004, P1-T005, P1-T006
P1-T003  (sign-in)           → P1-T004, P1-T005
P1-T004  (session persist)   → P3-T001, P3-T003, P3-T005, P3-T006, P5-T001
P1-T006  (categories)        → P1-T008, P2-T012
P1-T008  (question filter)   → P2-T001, P3-T007
P1-T009  (Drive→Sheets)      — CANCELLED, superseded by P1-T011
P1-T011  (individual files)  — standalone, replaces Apps Script internals only
P1-T012  (Drive accounts)    — depends on P1-T011 (adds accounts/ subfolder to Drive)
P1-T013  (questions folder)  — depends on P1-T008 (refactors existing filter logic)
P1-T010  (GitHub raw URLs)   — standalone, isolated to _loadData() in app.js

P2-T001  (JSON-driven)       → P4-T002
P2-T002  (landing page)      → P1-T002 (CTA links to sign-up)
P2-T006  (free practice)     → P6-T002
P2-T007  (git tagging)       → P2-T008, P2-T009
P2-T008  (multi-version)     → P2-T009
P2-T008  (multi-version)     depends on P1-T010 (GitHub raw URLs enable branch switching)
P2-T012  (profile edit)      depends on P1-T006 (categories — done)
P2-T013  (subscription)      → P5-T004, P5-T005, P5-T001; trial gate is the feature gate
P2-T018  (automated tests)   depends on P2-T013 (trial gate needed for trial.spec.js)
P2-T019  (sub readiness)     depends on P3-T011 (50q/file content) + P2-T013; blocks P5-T005
P2-T020  (content ops)       elevates P3-T007; needed before P3-T011 can scale
P4-T003  (GTM strategy)      informs P2-T015 landing page copy + P6-T004 language priorities
P5-T006  (global payments)   depends on P5-T001 (Stripe Phase 1); adds Razorpay + multi-currency
P6-T004  (i18n)              depends on P4-T003 (which markets); → P6-T005, P6-T006
P6-T005  (intl languages)    depends on P3-T013 (regional lang arch); extends same pattern
P6-T006  (localized content) depends on P6-T004 (UI in local lang first)

P3-T001  (streak)            → P3-T002, P3-T005
P3-T016  (goal archive)      depends on P2-T021 (subject tabs — done); archive state hides goals within each tab filter too
P3-T007  (Q addition)        → P6-T001
P3-T013  (regional lang)     depends on P3-T009 (nested folders — done); → P2-T012 (profile edit adds change-language option)

P4-T001  (admin)             → P6-T001, P5-T003
P5-T004  (feature gate)      depends on P2-T013 (tier design must be finalized)
P5-T005  (upgrade UI)        depends on P5-T004, P2-T013
P5-T001  (Stripe)            depends on P5-T004, P5-T005 → P5-T002, P5-T003
P5-T002  (exam mode)         → P5-T003
P5-T003  (leaderboard)       → P6-T003
```

---

## Complexity Reference
- **S** — Small: < 1 day | single file change | can ship + test independently
- **M** — Medium: 1–3 days | 2–4 files | needs integration test
- **L** — Large: 3–5 days | cross-cutting | needs staging test before deploy

---

*Total tasks: 59 (1 cancelled, 1 superseded) | P1: 13 | P2: 21 | P3: 18 | P4: 3 | P5: 6 | P6: 6*
*Bugs: BUG-001 (fixed), BUG-002 (fixed v3.1), BUG-003 (fixed v3.1), BUG-004 (fixed) — greeting showed full email instead of name when user.name was absent; `.split(' ')[0]` doesn't strip `@domain`, fixed with `_getFirstName()` helper that splits on `@` for email fallback*
*New tasks bolded. All tasks are self-contained, independently deployable, and version-controlled in this folder.*

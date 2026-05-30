# Donnibo — Code Task Index

> **Only code-change tasks live here.**
> Marketing, strategy, content ops, collab → `tasks/marketing/`
> Completed tasks → `tasks/completed/`

---

## Engagement Track (E-track) — "Beat Netflix/YouTube" delight & habit

> Strategy + framework: [ENGAGEMENT-STRATEGY.md](ENGAGEMENT-STRATEGY.md) · Build plan: [../sessions/ENGAGEMENT-SESSIONS.md](../sessions/ENGAGEMENT-SESSIONS.md)
> Force key: Substrate = responsive · Ritual = daily return · Identity = see-yourself-grow · Juice = polish
>
> ✅ **Wave 1 (E-001…E-009) + E5 (E-010/011/012) + E6 (E-013/015) shipped** → moved to `tasks/completed/`.
> Home UX polish shipped 2026-05-30 (laptop hero-grid, Netflix shelf arrows, week date-ranges, removed All tab, CTA/badge/gap fixes — see `session_handoff_20260530`).

| File | What | Force | Session | Size | Status |
|---|---|---|---|---|---|
| [E-014](E-014-daily-reminder-notifications.md) | Daily reminder + streak-save nudge (last Wave-2 task) | Ritual | E7 | L | Pending |
| E-016 | Card token primitive (`--card-*`) — every card consumes it | Polish | E8 | S | Proposed |
| E-017 | Shelf primitive everywhere + sticky-offset tokens (`--header-h`/`--tabs-h`) | Polish | E8 | M | Proposed |
| E-018 | Truncation-safe CTA pattern + spacing scale (`--sp-*`) | Polish | E8 | S | Proposed |
| E-019 | One `Avatar.render()` + shared `.corner-badge` utility | Polish | E8 | M | Proposed |

> **Before E7/E8: a manual cross-breakpoint visual QA pass (375/768/1024/1440)** — headless tests miss visual bugs (proven 2026-05-30).

---

## Code Hygiene (High priority — fast-follow, not launch-blocking)

| File | What | Size | Note |
|---|---|---|---|
| [REFACTOR-001](REFACTOR-001-split-home-and-appcss.md) | Split `app-home.js` (1,343 lines) + `styles-app.css` (2,765 lines) past standing-instruction thresholds | M | **Not required for launch.** Do after E-014 + visual QA; bundle CSS split into the E8 token track. ~3–4 hrs, low risk. |

## Pending — Launch Critical (do now)

| File | What | Size |
|---|---|---|
| [P2-T017](P2-T017-profile-page-password-reset.md) | Forgot-password email flow | S |
| [P2-T026](P2-T026-subscription-plan-tamper-protection.md) | HMAC subscription tamper protection | M |
| [P2-T035](P2-T035-css-lazy-load-phase2.md) | Lazy-load styles-app.css after login | S |
| [P2-T044](P2-T044-pwa-install-banner-home.md) | PWA install banner improvements | S |

## Pending — High Value Pre-Scale

| File | What | Size |
|---|---|---|
| [P2-T027](P2-T027-concept-builder-atom-to-synthesis.md) | Concept Builder atom→synthesis | XL |
| [P2-T016](P2-T016-welcome-onboarding-flow.md) | Welcome onboarding flow | M |
| [P2-T023](P2-T023-cross-page-ui-consistency-kid-theme.md) | Cross-page UI consistency | S |
| [P3-T003](P3-T003-progress-dashboard.md) | Progress dashboard | M |
| [P3-T004](P3-T004-avatar-growth-system.md) | Avatar growth system (Donnibo mascot) | L |
| [P3-T005](P3-T005-gamification-badges-milestones.md) | Gamification badges + milestones | M |
| [P3-T007](P3-T007-efficient-question-addition.md) | Admin form / CSV import for questions | M |
| [P3-T008](P3-T008-offline-dnd-mode.md) | Offline / DND mode | L |
| [P3-T026](P3-T026-topic-tag-filter-ui.md) | Topic tag filter UI | S |
| [P3-T029](P3-T029-weekly-progressive-test-subscribers.md) | Weekly progressive test for Pro users | M |
| [P3-T030](P3-T030-offline-first-question-prefetch.md) | Offline-first question prefetch (IndexedDB) | L |
| [P3-T031](P3-T031-city-weather-localization.md) | City weather localization widget | S |
| [P3-T033](P3-T033-kids-daily-planner-routine-goals.md) | Kids daily planner + routine goals | L |
| [P3-T034](P3-T034-kids-daily-journal-mood-reflection.md) | Kids daily journal + mood reflection | L |
| [P3-T035](P3-T035-kids-longterm-goals-milestone-tracker.md) | Kids long-term goals + milestone tracker | L |
| [P3-T036](P3-T036-parent-progress-notifications-whatsapp-email.md) | Parent progress notifications | M |

## Pending — Monetization (Stripe stays here)

| File | What | Size |
|---|---|---|
| [P5-T001](P5-T001-stripe-integration-setup.md) | Stripe integration setup | L |
| [P5-T002](P5-T002-real-exam-mode-paid.md) | Real exam mode (paid feature) | M |
| [P5-T003](P5-T003-leaderboard-paid.md) | Leaderboard (paid feature) | M |
| [P5-T004](P5-T004-feature-gate-system.md) | Feature gate system | M |
| [P5-T005](P5-T005-upgrade-prompt-ui.md) | Upgrade prompt UI | S |
| [P5-T006](P5-T006-global-payment-gateway.md) | Global payment gateway | L |

## Pending — Future Scale (P4/P6 code)

| File | What | Size |
|---|---|---|
| [P3-T010](P3-T010-per-user-session-folder-drive.md) | Per-user session folder in Drive | M |
| [P4-T001](P4-T001-admin-dashboard-user-analytics.md) | Admin dashboard + user analytics | L |
| [P4-T002](P4-T002-multi-language-support.md) | Multi-language support | L |
| [P4-T005](P4-T005-multilanguage-ui-landing-signup.md) | Multi-language UI (landing + signup) | M |
| [P4-T006](P4-T006-admin-portal-standalone-app.md) | Admin portal standalone app | XL |
| [P4-T007](P4-T007-admin-question-pattern-config.md) | Admin question pattern config | M |
| [P6-T004](P6-T004-app-internationalization-i18n.md) | App internationalisation (i18n) | L |
| [P6-T005](P6-T005-international-language-learning.md) | International language learning content | L |
| [P6-T006](P6-T006-localized-curriculum-content.md) | Localized curriculum content | L |

---

**22 code tasks total · 73 completed (tasks/completed/) · 30 marketing (tasks/marketing/)**

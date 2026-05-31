# Donnibo — Manual Test Case Index

> **Role:** Senior Test Engineer  
> **Scope:** Full manual regression suite covering all 16 major features  
> **Total test cases:** 195  
> **Test case files:** 16 (one per feature)

---

## Test Suite Files

| # | Feature | File | TCs | Coverage Areas |
|---|---|---|---|---|
| TC-01 | Authentication & Onboarding | [TC-01-authentication-onboarding.md](TC-01-authentication-onboarding.md) | 15 | Sign up (school/pro), sign in, wrong password, auto-login, sign out, landing animations |
| TC-02 | Home Screen & Navigation | [TC-02-home-navigation.md](TC-02-home-navigation.md) | 18 | Greeting, subject tabs, day cards, lock icons, shelf arrows, wheel scroll, drawer, user menu, date labels, mobile viewport |
| TC-03 | Quiz Engine (Practice Sets) | [TC-03-quiz-engine.md](TC-03-quiz-engine.md) | 21 | Start flow, challenge banner, answer feedback, timer, progress bar, result screen, XP award, session save, gating, retry |
| TC-04 | Flash Drills | [TC-04-flash-drills.md](TC-04-flash-drills.md) | 17 | Drill cards, question generation, answer feedback, timeout, result, PB tracking, XP, quest integration, shuffle |
| TC-05 | Daily GK Capsule | [TC-05-daily-gk-capsule.md](TC-05-daily-gk-capsule.md) | 12 | GK tab, topic rotation, quiz flow, reflective explanations, XP, quest, done badge, daily reset |
| TC-06 | Daily Quest | [TC-06-daily-quest.md](TC-06-daily-quest.md) | 12 | Quest bar, 3 objectives, completion reward, XP, mystery box, state persistence, midnight reset, idempotency |
| TC-07 | XP & Leveling System | [TC-07-xp-leveling.md](TC-07-xp-leveling.md) | 14 | All XP sources, level thresholds, level-up overlay, Journey display, persistence, Lucky Question |
| TC-08 | Avatar Evolution | [TC-08-avatar-evolution.md](TC-08-avatar-evolution.md) | 10 | Stage 1–6 progression, header chip, Journey ring, fallback, level ring, evolution announcement |
| TC-09 | My Journey | [TC-09-my-journey.md](TC-09-my-journey.md) | 14 | Open paths, avatar + XP, streak, stats, mastery tiers (all 5), offline render, back nav, data freshness |
| TC-10 | Daily Practice Streak | [TC-10-daily-practice-streak.md](TC-10-daily-practice-streak.md) | 12 | Streak start/increment/reset, freeze usage, freeze cap, persistence, longest streak, same-day idempotency |
| TC-11 | Collectibles & Mystery Box | [TC-11-collectibles-mystery-box.md](TC-11-collectibles-mystery-box.md) | 11 | Box trigger, reward types, sticker album, NEW ribbon, no duplicates, freeze/XP rewards, persistence, rarity |
| TC-12 | Share Cards | [TC-12-share-cards.md](TC-12-share-cards.md) | 10 | Button, card generation, resolution, avatar on card, content, wordmark, native share, download fallback, SVG fallback, offline |
| TC-13 | Friend Challenge | [TC-13-friend-challenge.md](TC-13-friend-challenge.md) | 11 | Button, URL generation, payload data, new user flow, login flow, banner, URL cleanup, replay prevention, invalid payload, gated set fallback, head-to-head result |
| TC-14 | Subscription & Paywall | [TC-14-subscription-paywall.md](TC-14-subscription-paywall.md) | 11 | Trial on signup, trial unlocks, expired locks, paywall screen, dismiss, free sets always on, trial expiry, settings plan, free content access |
| TC-15 | Settings | [TC-15-settings.md](TC-15-settings.md) | 17 | Open paths, lazy load, tiles, profile edit, grade change, appearance/theme, timer toggle, password change, back nav, close |
| TC-16 | PWA & Offline | [TC-16-pwa-offline.md](TC-16-pwa-offline.md) | 13 | Install prompt, banner content, install action, dismiss, iOS instructions, standalone mode, cache load, offline quiz, sync fallback, payload size |

---

## Test Execution Tracker

| Feature | Total TCs | Pass | Fail | Skip | % Done |
|---|---|---|---|---|---|
| TC-01 Authentication | 15 | — | — | — | 0% |
| TC-02 Home / Nav | 18 | — | — | — | 0% |
| TC-03 Quiz Engine | 21 | — | — | — | 0% |
| TC-04 Flash Drills | 17 | — | — | — | 0% |
| TC-05 Daily GK | 12 | — | — | — | 0% |
| TC-06 Daily Quest | 12 | — | — | — | 0% |
| TC-07 XP & Levels | 14 | — | — | — | 0% |
| TC-08 Avatar | 10 | — | — | — | 0% |
| TC-09 My Journey | 14 | — | — | — | 0% |
| TC-10 Streak | 12 | — | — | — | 0% |
| TC-11 Collectibles | 11 | — | — | — | 0% |
| TC-12 Share Cards | 10 | — | — | — | 0% |
| TC-13 Friend Challenge | 11 | — | — | — | 0% |
| TC-14 Subscription | 11 | — | — | — | 0% |
| TC-15 Settings | 17 | — | — | — | 0% |
| TC-16 PWA / Offline | 13 | — | — | — | 0% |
| **TOTAL** | **195** | — | — | — | **0%** |

---

## Test Environment

| Parameter | Value |
|---|---|
| App URL | https://abhisheksinha02.github.io/DecaShift/ |
| Primary browsers | Chrome (latest), Safari (iOS), Chrome (Android) |
| Mobile viewport | 375px (iPhone SE), 390px (iPhone 14) |
| Tablet viewport | 768px (iPad) |
| Desktop viewport | 1280px, 1440px |
| OS | Windows 11, macOS, Android 12+, iOS 16+ |
| Network | Online, Slow 3G, Offline (DevTools simulation) |

---

## How to Run

1. Open the app URL in the target browser
2. Work through each TC file in order (TC-01 → TC-16)
3. For each test case: set up preconditions → follow steps → compare to expected result
4. Mark ☑ Pass, ✗ Fail, or — Skip
5. Add notes for any failures (screenshots, console errors)
6. Update the tracker table above after each file is complete

---

## Priority Order for Initial Test Run

| Priority | TC Files | Reason |
|---|---|---|
| P0 (Critical path) | TC-01, TC-02, TC-03 | Must work before anything else |
| P1 (Core engagement) | TC-06, TC-07, TC-10 | Daily retention drivers |
| P2 (Acquisition) | TC-12, TC-13, TC-14 | Revenue + virality |
| P3 (Enhancement) | TC-04, TC-05, TC-08, TC-09, TC-11, TC-15, TC-16 | Important but not blocking |

---

## Known Test Gotchas

| # | Gotcha | Mitigation |
|---|---|---|
| 1 | Streak tests require clock manipulation | Set `lastPracticeDate` in localStorage directly |
| 2 | Trial expiry test requires old `trialStart` | Set `trialStart` to 181+ days ago in localStorage |
| 3 | Lucky Question is random — can't predict which Q | Answer all correctly and watch for badge |
| 4 | Mystery box reward is probabilistic | May need to run quest completion 3–5 times to see all reward types |
| 5 | headless test suite misses visual bugs | These test cases MUST be run in a real browser |
| 6 | iOS install prompt needs real device | iOS simulator does not trigger `beforeinstallprompt` |

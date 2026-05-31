# Donnibo — Feature Index

> **Principal Product Owner view:** Every major feature of the app, with complete end-to-end user flows.
> Each file documents what the user sees, what they can do, and how the flow works — step by step.

---

## Feature Files

| # | Feature | File | Core Modules |
|---|---|---|---|
| 01 | Authentication & Onboarding | [01-authentication-onboarding.md](01-authentication-onboarding.md) | `app-auth.js`, `storage.js` |
| 02 | Home Screen & Navigation | [02-home-navigation.md](02-home-navigation.md) | `app-home.js`, `app-core.js` |
| 03 | Quiz Engine (Practice Sets) | [03-quiz-engine.md](03-quiz-engine.md) | `app-quiz.js`, `storage.js` |
| 04 | Flash Drills | [04-flash-drills.md](04-flash-drills.md) | `app-drill.js` |
| 05 | Daily GK Capsule | [05-daily-gk-capsule.md](05-daily-gk-capsule.md) | `app-gk.js` |
| 06 | Daily Quest | [06-daily-quest.md](06-daily-quest.md) | `daily-quest.js` |
| 07 | XP & Leveling System | [07-xp-leveling-system.md](07-xp-leveling-system.md) | `xp.js` |
| 08 | Avatar Evolution (Donnibo) | [08-avatar-evolution.md](08-avatar-evolution.md) | `avatar.js` |
| 09 | My Journey (Profile & Progress) | [09-my-journey.md](09-my-journey.md) | `app-journey.js`, `mastery.js` |
| 10 | Daily Practice Streak | [10-daily-practice-streak.md](10-daily-practice-streak.md) | `storage.js` |
| 11 | Collectibles & Mystery Box | [11-collectibles-mystery-box.md](11-collectibles-mystery-box.md) | `collectibles.js` |
| 12 | Share Cards (Achievement Images) | [12-share-cards.md](12-share-cards.md) | `sharecard.js` |
| 13 | Friend Challenge | [13-friend-challenge.md](13-friend-challenge.md) | `challenge.js` |
| 14 | Subscription & Paywall | [14-subscription-paywall.md](14-subscription-paywall.md) | `app-quiz.js`, `app-settings.js` |
| 15 | Settings | [15-settings.md](15-settings.md) | `app-settings.js` |
| 16 | PWA & Offline Support | [16-pwa-offline.md](16-pwa-offline.md) | `sw.js`, `manifest.webmanifest` |

---

## Feature Dependency Map

```
Landing → Auth (01)
  └─► Home (02)
        ├─► Quiz Engine (03) ──► XP (07) ──► Avatar (08) ──► Journey (09)
        │         └─────────────────────────────────► Share Cards (12)
        │                                              └─► Friend Challenge (13)
        ├─► Flash Drills (04) ──► XP (07)
        ├─► Daily GK (05) ──► XP (07)
        ├─► Daily Quest (06) ──► Mystery Box (11) ──► Collectibles (11)
        ├─► Streak (10) ──► Streak Freeze (11)
        ├─► Settings (15)
        └─► PWA Install (16)

Quiz (03) + Drills (04) + GK (05)
  └─► Daily Quest (06) ──► +50 XP ──► Level Up ──► Avatar Stage Unlock
```

---

## Engagement Pillars

| Pillar | Features |
|---|---|
| **Daily Pull** | Daily Quest (06), Streak (10), Daily GK (05) |
| **Progress Visibility** | XP & Levels (07), Avatar Evolution (08), My Journey (09) |
| **Variable Reward** | Mystery Box (11), Collectibles (11), Lucky Question in Quiz (03) |
| **Social & Virality** | Share Cards (12), Friend Challenge (13) |
| **Content Depth** | Quiz Engine (03), Flash Drills (04), GK Capsule (05) |

---

## User Type Quick Reference

| User Type | Key Features |
|---|---|
| School student (Grade 2–12) | Quiz (03), Drills (04), GK (05), Quest (06), Avatar (08) |
| Professional / upskiller | Quiz (03) with professional content sets, Journey (09) |
| Parent (observer) | Journey (09) — mastery tiers, avatar evolution; Share Cards (12) |
| Free user | Mon–Tue sets (03), Drills (04), GK (05) |
| Pro user | All sets (03), all Drills (04), full GK, all rewards |

# Donnibo — Engagement & Delight Strategy ("Beat Netflix/YouTube")

> **Mandate:** Build the most delightful, most habit-forming learning UI for Grade 2–12 —
> a product a kid does not want to leave, like a video game. World-class on **mobile,
> tablet, and laptop**. Engagement and virality are the primary design goals, not features.
>
> **Owner lens:** Principal Product Designer + Principal UI/UX. Every decision filtered
> through "does a kid come back tomorrow without being told to?"
>
> Created 2026-05-29 · Track prefix **E-###** · Sits on top of the shipped Delight Stack (D-001–D-018).

---

## 0 · Honest read of where we are

We are **not** starting cold. The app already has: Netflix-style browse home, streaks,
daily GK capsule, flash drills, subject tabs, trial gating, a rebuilt landing page, and
15 shipped "delight" micro-features (greetings, win messages, trend bars, share cards).
Launch confidence **83/100, 0 critical failures**.

So this strategy is **not** "add more features." It is: **convert a competent quiz app into
an experience with a gravitational pull** — the thing that makes a 9-year-old open it before
being asked, and a parent say "I can't get them off it (in a good way)."

Three real gaps block that today:

| Gap | Evidence | Cost |
|---|---|---|
| **No tablet/laptop layout** | CSS is 100% mobile-first, every layout capped at `max-width: 720px`. On a laptop it's a stretched phone column. | Half the "world-class on laptop/tablet" mandate is unmet. School demos happen on laptops/tablets. |
| **No game-feel layer** | No XP, no levels, no avatar evolution (BUG-010 open), no sound, no haptics, no particle reward. Feedback is visual-only. | This is *the* difference between "a quiz" and "a game kids don't leave." |
| **No daily pull mechanic** | Streak exists, but no daily quest, no "Continue", no completion ritual, no return trigger. | Retention depends on the user *remembering*. We're not engineering the return. |

---

## 1 · What we are actually beating (and how)

The director said "beat Netflix and YouTube." Read that correctly: those apps win on
**production polish + an engineered return loop**, not on content format. We don't copy
passive consumption — that's the opposite of learning. We copy the *machinery of delight*
and point it at **active mastery**.

| Their weapon | Our learning-native version |
|---|---|
| Netflix "Continue Watching" hero | **"Continue your quest"** — one tap back into the exact next question set |
| Netflix personalized rows + cover art | Already shipped (Netflix browse) — extend with progress dots, mastery tiers, cover energy |
| YouTube infinite variable reward | **Mystery rewards + XP crits** — you never know if this question is worth 2× |
| YouTube autoplay momentum | **Streak + daily quest + "one more set"** completion momentum |
| Netflix 60fps polish, instant everything | **Juice layer** — sound, haptics, confetti, skeleton loaders, shared-element transitions |
| Parasocial creator bond | **Donnibo avatar that grows *into you*** — the character is the kid, leveling up |
| Push notifications | **Daily reminder + streak-save nudge** (PWA Notification API) |

The real engagement benchmark for *learning habit* is **Duolingo**, and for *kid game feel*
it's **Prodigy / Khan Academy Kids**. We aim to out-polish both at ₹79.

---

## 2 · The framework — "The Daily Pull" (5 forces + 1 substrate)

Every engagement task maps to exactly one of these. If a proposed task maps to none, we don't build it.

```
        ┌─────────────────────────────────────────────┐
        │   SUBSTRATE:  RESPONSIVE EXCELLENCE           │
        │   flawless on phone · tablet · laptop         │
        └─────────────────────────────────────────────┘
   ┌──────────┬──────────┬──────────┬──────────┬──────────┐
   │ IDENTITY │  RITUAL  │   JUICE  │  REWARD  │ BELONGING│
   │ "this is │ "I do    │ "it feels│ "I never │ "others  │
   │  me      │  this    │  amazing │  know    │  see me  │
   │  growing"│  daily"  │  to play"│  what    │  grow"   │
   │          │          │          │  I'll get│          │
   └──────────┴──────────┴──────────┴──────────┴──────────┘
```

1. **IDENTITY** — the kid builds a character that *is* them. Avatar evolution, level, "My Journey."
   The progress-fantasy loop. *Why kids stay: sunk-cost in a self they're proud of.*
2. **RITUAL** — a fixed, short, satisfying daily loop with a clear start and a celebrated end.
   Daily quest, streak, completion moment. *Why kids return: the loop has a shape they crave to close.*
3. **JUICE** — production polish that makes every tap feel good. Sound, haptics, particles,
   transitions, skeletons. *Why it beats Netflix: 60fps delight on a ₹8,000 phone.*
4. **REWARD** — variable, surprising, collectible. Mystery boxes, XP crits, sticker album.
   *Why kids keep playing: the next tap might be the big one.*
5. **BELONGING** — the kid is seen growing. Leaderboards, friend challenges, shareable wins,
   parent-pride moments. *Why it goes viral: the share is the product showing off the child.*

**Substrate — RESPONSIVE EXCELLENCE:** none of the five lands if the layout is broken on the
device the demo happens on. This is P0 and ships first.

---

## 3 · Constraints (every E-task must obey)

- Vanilla HTML/CSS/JS only. No framework, no build, no bundler, no CDN UI lib. GitHub Pages safe.
- Must hit **60fps on a ₹8,000 Android phone on 4G**. CSS transforms/opacity only for animation;
  no layout-thrash. Audio/particles must be lazy and killable.
- Every change atomic + committed working (Code Stability Rules). Feature-flag anything multi-step.
- Respect existing module split: `app-home.js`, `app-quiz.js`, `app-drill.js`, `app-core.js`,
  `app-settings.js`, `storage.js`; CSS `styles-base/app`; screens in `screens/*.html`.
- **Accessibility & calm:** sound + haptics default-on but one-tap muteable; reduced-motion respected;
  rewards must never block the learning path or nag.
- No new infra cost. Notifications use the browser Notification API + Service Worker (no push server yet).

---

## 4 · The roadmap (prioritized)

Two waves. **Wave 1 (E-001–E-009)** is fully specced as task files now and is the immediate
build queue. **Wave 2 (E-010–E-015)** is captured here and gets detailed after Wave 1 ships
and we have live engagement data.

### Wave 1 — the engagement spine (specced, build now)

| # | Task | Force | Size | Why it's in Wave 1 |
|---|---|---|---|---|
| **E-001** | Fluid responsive foundation (tokens, clamp type, container scale) | Substrate | S | Unlocks every other layout; cheap, high leverage |
| **E-002** | Tablet & laptop shell + multi-column home | Substrate | L | Half the mandate; school demos run on these screens |
| **E-003** | Daily Quest + "Continue your quest" hero | Ritual | M | The single strongest return mechanic we lack |
| **E-004** | Daily completion ritual + kind streak-freeze | Ritual | M | Closes the loop; removes the punishment that kills streaks |
| **E-005** | XP + Levels engine + level-up moment | Identity | M | The spine the avatar, rewards, and leaderboard all hang off |
| **E-006** | Donnibo avatar growth — 6-stage evolution | Identity | L | The headline "see yourself grow." Implements P3-T004, closes BUG-010 |
| **E-007** | "My Journey" profile screen | Identity | M | Where identity, levels, badges, and replay live |
| **E-008** | Feedback engine — sound + haptics + confetti | Juice | M | The reusable juice layer; instantly lifts every screen |
| **E-009** | Transitions + skeleton loaders | Juice | M | Perceived-performance polish that out-classes competitors |

### Wave 2 — depth & virality (detail after Wave 1)

| # | Task | Force | Size | Sketch |
|---|---|---|---|---|
| **E-010** | Mystery reward box on milestones | Reward | M | Streak/level milestones open a box → cosmetic/sticker/XP. Variable reward. |
| **E-011** | Sticker / collectible album | Reward | L | Collect-the-set drives completion; album is a self-display surface. |
| **E-012** | XP crits & lucky-question events | Reward | S | Surprise 2× XP on random questions. Cheap, strong variable reward. |
| **E-013** | Friend challenge via share link | Belonging | M | "Beat my 9/10" link → opens same set → result compares. Viral loop, no backend. |
| **E-014** | Daily reminder + streak-save nudge | Ritual | L | Notification API + SW. Re-engagement without a push server. |
| **E-015** | Achievement → shareable image cards | Belonging | M | Every badge/level renders a card a parent forwards. Builds on D-004/D-016. |

> **Note on existing tasks:** E-006 supersedes `P3-T004` (avatar) and closes `BUG-010`.
> E-013/leaderboard relate to `P5-T003` (paid leaderboard) — keep ranked/social play in the
> free tier for engagement; reserve *prizes/real-exam* leaderboard for paid. Pending Delight
> items D-012/D-017 (mastery tiers) fold naturally into E-007's Journey screen.

---

## 5 · Sequencing logic (why this order)

1. **Substrate before delight.** A beautiful reward on a broken laptop layout is a bug, not delight.
   E-001 → E-002 first.
2. **Ritual before identity.** Get them *returning* (E-003/E-004) before investing in the long-arc
   identity (E-005–E-007) — retention compounds the identity payoff.
3. **XP engine before avatar/rewards.** E-005 is the currency everything else spends. Build it once.
4. **Juice last in Wave 1, applied everywhere.** E-008/E-009 are horizontal — they make all prior
   work *feel* premium in one pass, right before any marketing push.
5. **Virality after the loop works.** A share (Wave 2) only spreads if the thing shared is already
   sticky. Don't pour growth into a leaky loop.

---

## 6 · Success metrics (how we know it worked)

Instrument locally (session history already persisted — no new infra):

- **D1 / D7 return rate** — % of users who open the app the next day / 7 days later.
- **Daily quest completion rate** — % of opens that finish the day's ritual.
- **Sessions per active day** — "one more set" momentum (target > 1.5).
- **Streak survival** — % of 3-day streaks that reach 7 (freeze should lift this sharply).
- **Avg level reached by day 7** — identity investment proxy.
- **Share-card sends** — virality leading indicator (parent-pride + friend-challenge).

A win is: **D7 return > 35%**, **quest completion > 60%**, **sessions/active-day > 1.5**.

---

## 7 · The 4 build sessions

See `sessions/ENGAGEMENT-SESSIONS.md`. Each session is independently shippable and leaves the
app working at every commit.

| Session | Theme | Tasks | Net effect |
|---|---|---|---|
| **E1** | Responsive Excellence | E-001, E-002 | App is world-class on tablet & laptop, not just phone |
| **E2** | The Daily Pull | E-003, E-004 | The app engineers the return; the daily loop has a satisfying shape |
| **E3** | See Yourself Grow | E-005, E-006, E-007 | XP, levels, an evolving avatar, and a profile that is the kid's identity |
| **E4** | Game Juice | E-008, E-009 | Sound, haptics, particles, transitions — every screen feels premium |

After E4: re-score launch confidence, review engagement metrics, then spec Wave 2.

---

*Donnibo — See yourself grow.*

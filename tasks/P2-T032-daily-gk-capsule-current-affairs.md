# Feature: Daily GK Capsule + Current Affairs Monthly Pack

**Priority:** P2 | **Type:** Content / Retention | **Complexity:** S | **Status:** ✅ Done (MVP) — 2026-05-29 · commit 21f22e7 · Current Affairs pack deferred post-launch

> Note: GK inside Flash Drills (P2-T031) covers speed-based 5-question daily GK.
> This task handles the deeper GK ecosystem: current affairs packs, topic catalogue,
> a dedicated GK subject tab, and the "Today in India" daily card. These are separate
> from speed drills — they are reading + reflection + quiz, not speed + memory.

---

## Why This Exists — Tied to 5K User Goal

**GK is the easiest cross-grade content.** A current affairs question about the 2026 Budget
is relevant to Grade 5 and Grade 10. Science fact questions about the solar system apply
from Grade 4 upward. GK is the one content category where the same question bank serves
multiple grades simultaneously — reducing the content bottleneck (F1) at scale.

**GK is the second-biggest parent pain point** (after tables). Parents say:
- "My child doesn't read newspapers."
- "They failed the GK section in the entrance test."
- "They don't know the capital of Karnataka."

This is not a problem of intelligence. It is a problem of **daily exposure without a system.**
Donnibo gives them the system: 5 fresh GK questions, same time every day, permanently.

**Decision filter check:**
- Moves toward 5K users? ✅ Solves a common parent pain; makes app useful every day even if school content runs dry
- Fixes F1 (content exhaustion)? ✅ GK questions are reusable across multiple grades — one question bank, many users
- Creates shareable moment? ✅ "Today in India" card + monthly current affairs results are shareable
- Works on ₹8,000 Android phone on 4G? ✅ Text-only, small JSON files, zero images

---

## Two Distinct GK Modes

### Mode 1 — Daily 5 (The Habit Loop)

Already defined in P2-T031 (Flash Drills) for the speed version.
This task adds the **reflective version** — same 5 questions, but with:
- Brief explanation shown after each answer (not just green/red)
- "Did you know?" fact card after the last question
- Designed for kids who want to learn, not just drill

The reflective Daily 5 appears on the home screen as a card distinct from Flash Drills:

```
┌─────────────────────────────────────┐
│  🌍 Today's GK — Thursday 29 May    │
│  Topic: Indian Rivers               │
│                                     │
│  ████████░░░░   4 / 5 done          │
│                                     │
│  [Continue]   ✅ 3 correct so far   │
└─────────────────────────────────────┘
```

One card per day. Resets at midnight. Completion contributes to streak.

### Mode 2 — Monthly Current Affairs Pack

A dedicated set of 30 questions for the current calendar month.
Updated once per month. Available all month — not date-gated within the month.
Displayed as a "Special Set" on the home screen during the relevant month.

```
┌─────────────────────────────────────┐
│  📰 May 2026 Current Affairs        │
│  30 questions · Updated monthly     │
│                                     │
│  [Start Set]    0 / 30 done         │
└─────────────────────────────────────┘
```

User can complete it in one go or across multiple sessions (progress saved).
Questions cover: Indian + world events, sports, awards, government schemes, science news.

---

## GK Topic Rotation (Weekly Calendar)

The Daily 5 draws from a rotating weekly topic:

| Week | Topic | Sample Questions |
|---|---|---|
| 1 | Indian Geography | Rivers, states, capitals, mountain ranges, national parks |
| 2 | World Geography | Countries, continents, oceans, world capitals |
| 3 | Indian History | Independence movement, Mughal era, post-independence events |
| 4 | Science & Technology | Inventions, scientific discoveries, space missions, body facts |
| 5 | Indian Constitution & Government | Fundamental rights, articles, amendments, government roles |
| 6 | Sports & Awards | Olympics, cricket, national awards, Padma, Bharat Ratna |
| 7 | Environment & Ecology | Endangered species, national parks, climate, rivers |
| 8 | Famous Personalities | Scientists, leaders, writers, artists (Indian) |
| → | Repeats from Week 1 | — |

The rotating calendar means:
- A student who uses the app for 8 weeks covers all major GK categories
- Students in the same class answer the same topic together → "Did you get the Kaveri question?"
- Teachers can synchronise classroom GK revision with the Donnibo topic of the week

---

## "Today in India" Fact Card

After completing the Daily 5, show a brief fact card:

```
┌─────────────────────────────────────┐
│  🇮🇳 Today in India                  │
│                                     │
│  On this day in 1947, the Indian    │
│  Constituent Assembly met for the   │
│  first time to draft the            │
│  Constitution.                      │
│                                     │
│  [Share this fact]                  │
└─────────────────────────────────────┘
```

Facts are date-keyed in a simple JSON array:
```json
{ "date": "05-28", "fact": "...", "category": "history" }
```

365 facts, one per calendar date, cycling annually.
This is the easiest type of content to generate (AI-assisted, human-reviewed).

The [Share this fact] button copies:
```
🇮🇳 Today in India · Donnibo
[Fact text]
Learn more: donnibo.in
```

A parent who reads this and finds it interesting will share it — that is organic reach.

---

## GK Subject Tab

GK is added as a subject tab on the home screen alongside Math, Science, Hindi, French:

```
[Math] [Science] [Hindi] [French] [GK] [All]
```

The GK tab shows:
- "Today's GK" card (Daily 5 — reflective version)
- "May 2026 Current Affairs" pack card
- "Topic Bank" — all weekly topic sets (accessible to Pro users; Free: current week only)
- Past month current affairs packs (Pro: all months, Free: current month only)

This creates a clear Pro upsell: access to the full GK archive.

---

## Content Plan

### Minimum to Ship (Phase 1)
- 8 weeks × 30 questions per topic = 240 questions in weekly topic bank
- May 2026 Current Affairs: 30 questions
- "Today in India" fact for every date May–August 2026 (93 dates × 1 fact = 93 facts)

### Full Coverage (Phase 2 — post-launch)
- Full 365-date "Today in India" fact catalogue
- 12 months of current affairs packs (backfill June 2025 – April 2026 for archive value)
- Topic bank expanded to 16 weeks (two full cycles) before repeating

---

## Acceptance Criteria

### Daily 5 (Reflective Mode)
- [ ] Home screen shows "Today's GK" card with current topic + date
- [ ] Tapping opens 5-question session with explanations shown after each answer
- [ ] Progress saved — partial completion resumable
- [ ] Completion at midnight resets the card (next topic from rotation)
- [ ] Completion counts toward daily streak

### Today in India Fact Card
- [ ] Shown after Daily 5 completion
- [ ] Fact is date-keyed (same fact for all users on same date)
- [ ] [Share this fact] copies plain-text card to clipboard
- [ ] Fact catalogue: minimum May–August 2026 dates covered

### Monthly Current Affairs Pack
- [ ] "May 2026 Current Affairs" pack visible on GK tab and as a Special Set
- [ ] 30 questions, progress saved across sessions
- [ ] Pack replaced on the 1st of each month (old pack archived for Pro users)
- [ ] Free users: current month only; Pro users: all months

### GK Subject Tab
- [ ] GK tab added to subject tab strip (between French and All)
- [ ] Tab shows Today's GK card, Current Affairs pack, Topic Bank section
- [ ] Topic Bank — Free: current week's topic only; Pro: all topics

### Content
- [ ] 8 weekly topic packs × 30 questions = 240 questions minimum in `questions/gk/`
- [ ] May 2026 Current Affairs: 30 questions in `questions/gk/current-affairs-2026-05.json`
- [ ] "Today in India" facts: minimum 90 dates in `questions/gk/today-in-india.json`

---

## Files to Touch

- `app/ui/app.js` — `_renderGKTab()`, `_startDailyGK()`, `_getGKRotationWeek()`,
  `_getTodayFact()`, `_renderCurrentAffairsPack()`, Pro gate for archive access
- `app/ui/index.html` — GK tab in subject strip; Today's GK card markup; Fact card markup
- `app/ui/styles.css` — GK tab styles, Fact card styles, "Today in India" India-flag accent
- `questions/gk/weekly-bank.json` — 240 questions organised by week + topic
- `questions/gk/current-affairs-2026-05.json` — 30 May 2026 current affairs questions
- `questions/gk/today-in-india.json` — 90+ date-keyed facts

## Dependencies

- P2-T031 (Flash Drills — done first; speed-based GK 5 questions defined there; this task adds reflective mode)
- P3-T028 (free/Pro set gating — GK archive is Pro-only; gating pattern from P3-T028)
- P3-T019 (content calendar — weekly rotation pattern is the same; GK rotation uses the same date-seeding logic)

## Strategic Connection to 5K Goal

GK is the lowest-friction daily content. A student who finishes their weekly quiz sets
but still wants to do "something" has the Daily GK as a 2-minute habit keeper.
This keeps the streak alive during content-thin periods — directly mitigating F1
(content exhaustion) as a churn driver.

The monthly Current Affairs pack creates a monthly event: students who completed it
feel accomplished and share. The archive is a Pro upsell with clear value.

# Feature: City Partner Footer + Local Reward Card System

**Priority:** P3 | **Type:** Distribution / Virality / B2B | **Complexity:** M | **Status:** Pending

> A child shows her 7-day streak Reward Card at Perfect Stationaries in Pune.
> She gets a 10% discount on her next notebook purchase.
> Her mother tells two parents from the school WhatsApp group.
> One of those parents downloads Donnibo before they reach home.
> That is the entire acquisition flywheel. Zero ad spend. Zero marketing team.
> One reward card. One child. One local shop.

---

## Why This Exists — Tied to 5K User Goal

This task directly fixes two of the highest-severity failure points:

**F7 — No virality / sharing / social hooks (Medium)**
The Reward Card is the first genuine offline-to-online word-of-mouth trigger.
It creates a real-world interaction that a digital sharing button cannot replicate.
A parent watching their child redeem a reward at a local shop is a trust event —
they see the app doing something for their family. That parent becomes an advocate.

**F10 — School segment needs parents, not students, to convert (Medium)**
The current app has no parent layer. Parents discover the app, not students.
The partner system gives parents a reason to care: discounts, referrals, and a
network of trusted local businesses that vouch for Donnibo by listing it.

**The local partner is also a free marketing channel:**
A coaching center that tells its students "show us your Donnibo streak for a discount"
is effectively running our marketing for us. Their student database is our prospect list.

**Decision filter check:**
- Moves toward 5K users? ✅ Direct acquisition from local business networks — city by city
- Fixes F1 (content)? ❌
- Creates shareable moment? ✅ Reward Card redemption is a real-world event — retold in parent groups
- Works on ₹8,000 Android phone on 4G? ✅ Reward Card is a simple in-app screen — no images, no network

---

## The Partner System

### What a Partner Gets (Free)

1. **Logo/name listed in the app footer** (city-specific — only Pune users see Pune partners)
2. **"Donnibo Partner" badge** they can display at their counter
3. **QR code** linking to the Donnibo city domain (e.g., `punekids.in`) — printable
4. **First mention in city-specific social posts** when Donnibo launches in their city

Partners pay ₹0. The listing is free permanently for Phase 1.
Revenue from partners begins in Phase 2 (see P4-T009 hyperlocal ads) — after the
partnership model is proven and partners see student footfall.

### What Students Get

A **Reward Card** is generated in the app when a student hits a qualifying milestone.
The card is a visual screen (not a downloaded file) with a unique daily code.

### Partner Examples (Starter List)

| City | Category | Example Partners |
|---|---|---|
| Pune | Stationery | Perfect Stationaries |
| Pune | Coaching | Global Coaching |
| Pune | Books | Mira Books |
| Nagpur | To be added | — |
| Indore | To be added | — |

Partners are stored in a city-keyed JSON config:

```json
{
  "pune": [
    { "name": "Perfect Stationaries", "category": "Stationery", "offer": "10% off on notebooks", "icon": "✏️" },
    { "name": "Global Coaching",      "category": "Coaching",   "offer": "Free trial class for streak holders", "icon": "📚" },
    { "name": "Mira Books",           "category": "Books",      "offer": "₹20 off on any purchase over ₹100", "icon": "📖" }
  ],
  "nagpur": [],
  "indore": []
}
```

Adding a new partner requires one JSON entry — no code change.

---

## The City Partner Footer

In `index.html` footer, below the developer card (P2-T028):

```
┌─────────────────────────────────────┐
│  🤝 Our Partners in Pune            │
│                                     │
│  ✏️ Perfect Stationaries            │
│     10% off on notebooks            │
│                                     │
│  📚 Global Coaching                 │
│     Free trial class for            │
│     streak holders                  │
│                                     │
│  📖 Mira Books                      │
│     ₹20 off on any purchase ₹100+   │
│                                     │
│  [Become a Partner]                 │
└─────────────────────────────────────┘
```

- Only shown when a city is detected (from hostname or IP — P3-T031)
- If no partners exist for the city: footer section is hidden (no empty state shown)
- [Become a Partner] links to a simple Google Form (or WhatsApp message) for business inquiries

The footer is visible to **all users** (Free + Pro). Partners are a trust signal for
every user who scrolls to the bottom — it signals local legitimacy.

---

## The Reward Card System

### Qualifying Milestones (Phase 1 — Simple, Easy to Earn)

| Milestone | Card Name | Valid At |
|---|---|---|
| 7-day quiz or drill streak | "7-Day Streak" Reward Card | All city partners |
| Complete any Monthly Current Affairs pack | "Scholar" Reward Card | Book partners only |
| 30-day streak | "Habit Champion" Gold Card | All partners + premium offers |
| First 50 questions answered | "First Steps" Card | Stationery partners |

A student can only hold one active Reward Card at a time.
Earning a new milestone replaces the previous card (upgrades it).

### Reward Card Screen

When a qualifying milestone is reached, home screen shows a pulsing banner:

```
┌─────────────────────────────────────┐
│  🎉 You Earned a Reward Card!       │
│  7-Day Streak Achieved              │
│  [View My Card]                     │
└─────────────────────────────────────┘
```

[View My Card] opens the Reward Card screen:

```
┌─────────────────────────────────────┐
│                                     │
│  🎫 DONNIBO REWARD CARD             │
│     7-Day Streak                    │
│                                     │
│  Arjun Sharma                       │
│  Grade 5 · Pune                     │
│                                     │
│  Valid at:                          │
│  ✏️ Perfect Stationaries — 10% off  │
│  📚 Global Coaching — Free trial    │
│  📖 Mira Books — ₹20 off            │
│                                     │
│  Code: DS-7STR-2048                 │
│  Valid: 28 May – 4 June 2026        │
│  ████████████████████               │
│  (barcode visual)                   │
│                                     │
│  Show this screen at the shop.      │
│  Partner will verify your code.     │
│                                     │
│  [Share Card]                       │
└─────────────────────────────────────┘
```

### Code Generation (Simple, Not Cryptographic)

The reward code is not security-critical — the partner visually verifies the card.
It just needs to be unique enough to prevent obvious duplication.

```js
function _generateRewardCode(userId, milestone, date) {
  const prefix = { '7day': 'DS-7STR', '30day': 'DS-30GD', 'scholar': 'DS-SCH' };
  const shortId = userId.slice(-4).toUpperCase();
  const dayCode = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % 9999;
  return `${prefix[milestone]}-${shortId}-${dayCode}`;
  // Example: DS-7STR-A2F8-2048
}
```

Code is valid for 7 days from issue date. After 7 days: card expires, milestone
stays recorded, next earned milestone generates a new card.

### [Share Card] Button

Copies to clipboard (for WhatsApp sharing):
```
🎫 My Donnibo Reward Card
7-Day Streak — Arjun Sharma (Grade 5, Pune)
Valid at Perfect Stationaries, Global Coaching, Mira Books
Code: DS-7STR-A2F8-2048 · Valid until 4 June 2026

Try Donnibo: punekids.in
```

When this message is shared in a school WhatsApp group, every parent sees:
1. A child earned a reward for a learning streak
2. Local shops they know are participating
3. A link to sign up

That is the complete acquisition loop — triggered by one share.

---

## Partner Onboarding (The Business Side)

**Phase 1 — Manual (Launch to first 10 partners):**
- Developer reaches out directly to 5–10 local businesses per city
- One WhatsApp message: "List your business in our kids learning app for free. We send students who show their streak."
- Partner agrees → JSON entry added → deploys in minutes

**Phase 2 — Self-serve form (after 10 partners prove the model):**
- [Become a Partner] button in footer links to a Google Form
- Form collects: business name, city, category, offer to students, WhatsApp number
- Developer reviews + adds to JSON within 24 hours

**Phase 3 — Paid partner listings** (see P4-T009 hyperlocal ads):
- Featured listing (top position in city footer): ₹500/month
- QR code print materials provided: ₹200 one-time
- Revenue before Pro subscription scale

---

## Acceptance Criteria

### City Partner Footer
- [ ] Footer shows "Our Partners in [City]" section when city is detected
- [ ] Partners loaded from `config/city-partners.json` — city key matches detected city
- [ ] Each partner shows: name, category icon, offer text
- [ ] [Become a Partner] link visible — leads to contact form or WhatsApp
- [ ] If no partners exist for detected city: section completely hidden (no empty state)
- [ ] Footer section works at 375px mobile — no overflow

### Reward Card Generation
- [ ] 7-day streak triggers Reward Card notification banner on home screen
- [ ] [View My Card] opens Reward Card screen
- [ ] Card shows: student name, grade, city, valid partners, code, validity dates
- [ ] Code format: `DS-{MILESTONE}-{SHORTID}-{DAYCODE}` — unique per student per day
- [ ] Card validity: 7 days from issue date
- [ ] After expiry: card shows "Expired" — new card earned on next milestone

### Share Card
- [ ] [Share Card] button copies formatted text card to clipboard
- [ ] Shared text includes: milestone, student name/grade, city, valid partners, donnibo link
- [ ] Copy confirmation shown ("Copied! Share in WhatsApp")

### Partner JSON
- [ ] `config/city-partners.json` created with Pune partners (3 entries minimum)
- [ ] Schema: `{ "city": [{ "name", "category", "offer", "icon" }] }`
- [ ] Adding a new partner requires only a JSON edit — no code change

### Milestone Triggers
- [ ] 7-day streak → "7-Day Streak" card
- [ ] 30-day streak → "Habit Champion Gold" card (upgrades previous)
- [ ] Monthly Current Affairs completion → "Scholar" card
- [ ] First 50 questions → "First Steps" card
- [ ] Only one active card at a time — new milestone upgrades current card

---

## Files to Touch

- `config/city-partners.json` — partner database keyed by city slug
- `app/ui/app.js` — `_loadCityPartners()`, `_renderPartnerFooter()`,
  `_checkRewardMilestones()`, `_generateRewardCode()`, `_showRewardCard()`,
  `_shareRewardCard()`, milestone event hooks (streak + content completion)
- `app/ui/index.html` — partner footer section markup; reward card screen markup;
  reward notification banner
- `app/ui/styles.css` — partner footer styles; reward card screen styles;
  "Donnibo Reward Card" visual treatment (golden border, card-like appearance)

## Dependencies

- P3-T031 (city + weather detection — city must be known to show city partners)
- P2-T029 (city domains — city detected from hostname is most accurate source)
- P3-T001 (daily streak — streak count is the primary trigger for reward cards)
- P3-T005 (gamification badges — milestones here emit badge events too; coordinate badge names)
- P4-T009 (hyperlocal ads — Phase 3 of partner system is paid featured listings; this task is Phase 1 free)

## Strategic Connection to 5K Goal

| Failure Fixed | How |
|---|---|
| F7 (no virality) | Reward Card share in WhatsApp group → organic acquisition |
| F10 (school segment needs parents) | Partner = trusted local business = parent trust proxy |
| F3 (audience too broad) | City-specific partners make the app feel hyper-local, not generic |

**Revenue path:** Phase 1 free → Phase 2 self-serve → Phase 3 paid (₹500/month per partner).
At 20 cities × 5 paid partners = ₹50,000/month in partner revenue before a single Pro subscription.
This is the fastest path to revenue that does not require Stripe or subscription infrastructure.

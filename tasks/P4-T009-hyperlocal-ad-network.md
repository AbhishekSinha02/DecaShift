# Feature: Hyperlocal Ad Network — City-Targeted Education Business Sponsorships

**Priority:** P4 | **Type:** Monetization / B2B | **Complexity:** M | **Status:** Pending

> Not banner ads. "Study Resources Near You" — local coaching centers, tutors,
> and ed-tech businesses that want to reach students in their city.
> Higher trust, higher CPM, and every city becomes its own micro-market.

---

## The Business Case

India's coaching center market is ₹58,000 crore and hyper-local by nature.
A coaching center in Indore is competing with other Indore centers — not Mumbai ones.
They cannot afford national TV or newspaper ads, but they can afford ₹2,000/month
to be "the recommended study center" for every student in Indore who opens this app.

**Revenue model:**
- Manual outreach initially (email / WhatsApp to local coaching centers)
- ₹2,000–5,000/month per advertiser per city
- 20 cities × 3 advertisers × ₹3,000 = ₹1.8 lakh/month passive income
- This number is achievable before 5,000 users (B2B, not consumer-scale)
- Self-serve ad portal added in P4-T006 (admin portal) later

**Why this beats standard ads:**
- Standard AdSense CPM for Indian edtech: ₹30–80 per 1,000 impressions
- Local coaching center placement: ₹2,000–5,000/month flat, regardless of impressions
- Lower friction for advertiser (no account, no campaign setup)
- Higher trust for user (local name they recognize, not Google spam)

---

## Ad Types (Start Simple)

### Type 1 — Sponsored Study Resource Card
Shown on home screen, below the "This Week" challenge card.
Looks like a goal card, not a banner ad.

```
┌─────────────────────────────────────────┐
│  📍 Sponsored · Pune                    │
│  ─────────────────────────────────────  │
│  🏫 Vidyalankar Classes                 │
│  "Top Math coaching in Pune — Grade 6-10"│
│  ⭐ 4.8  ·  Kothrud, Pune               │
│                [Visit →]                │
└─────────────────────────────────────────┘
```

- Free users: see 1 card per home screen load
- Pro users: see 0 (ad-free experience — a Pro perk)
- Card style: matches goal card, uses `var(--surface)` — not jarring
- Label: small "📍 Sponsored" chip at top — honest, not hidden

### Type 2 — City Welcome Line (Landing Page)
On landing page, below the city/weather ambient line (P3-T031):
`"10,000+ students in Mumbai already practice on DecaShift"`
Dynamic: replace "Mumbai" with detected city. If no ad data for city, show generic.

### Type 3 — Session End Card (Future, Phase 2)
After a quiz session ends, before the result summary auto-closes:
"You practiced Science today — here's a resource from your city."
Higher intent moment; higher CPM equivalent.

---

## Ad Data Schema (JSON-Driven, No Backend)

Ads are stored in a single JSON file: `app/ui/ads/city-ads.json`
Loaded once on app init, filtered by detected city.

```json
[
  {
    "id": "ad-001",
    "city": "Pune",
    "businessName": "Vidyalankar Classes",
    "tagline": "Top Math coaching in Pune — Grade 6–10",
    "rating": "4.8",
    "location": "Kothrud, Pune",
    "url": "https://vidyalankar-pune.com",
    "targetGrades": [6, 7, 8, 9, 10],
    "targetSubjects": ["mathematics", "science"],
    "active": true,
    "startDate": "2026-06-01",
    "endDate": "2026-07-01"
  }
]
```

**Filtering rules:**
- Match on `city` (case-insensitive, partial match for "Greater Mumbai" → "Mumbai")
- Filter by `active: true` and current date within `startDate`–`endDate`
- If `targetGrades` set, only show to users in that grade range
- If `targetSubjects` set, show after sessions for that subject
- Random selection if multiple ads match (rotate impressions evenly)
- If no ads for city: no card shown — never show a generic national ad

**Why JSON, not database:**
- Zero backend cost
- Claude can generate new ad entries in seconds
- Ad rotation managed manually via PR for now; self-serve portal later (P4-T006)
- File is public (GitHub Pages) — no sensitive data, just business info

---

## Revenue Operations

### Phase 1 — Manual (Now to 1,000 users)
1. Identify 5 cities where app has meaningful user concentration (from Drive analytics)
2. WhatsApp or email 3–5 coaching centers per city
3. Pitch: "Your ad shown to every student in [City] who opens our app — ₹2,000/month"
4. Collect: business name, tagline, rating, area, website URL
5. Claude generates the JSON entry; one git push to deploy
6. Invoice manually (UPI / bank transfer)

**Pitch template (WhatsApp, 3 lines):**
> "Hi, I run DecaShift — a daily study app used by students in [City].
> I show one sponsored card per city — currently showing [N] students/month.
> Interested in a ₹2,000/month placement? Reach Grade 6–10 students in [City]."

### Phase 2 — Semi-Automated (After 1,000 users)
- Add a simple form on a separate `/advertise` page (no auth needed)
- Advertiser submits: city, business name, tagline, URL, grade range
- Form triggers an email to admin (Formspree, free tier)
- Admin reviews → generates JSON entry → pushes to repo
- Add payment link (Razorpay payment page) to the form

### Phase 3 — Self-Serve (After 5,000 users)
- Full self-serve portal as part of P4-T006 (admin portal)
- Advertiser creates account, submits ad content, pays online, goes live instantly
- City-level impression tracking
- Automated expiry and renewal reminders

---

## Subscription Integration (Ad-Free as a Pro Perk)

```js
function _shouldShowAd(user) {
  if (user.plan === 'pro' || user.plan === 'max') return false;
  return true;  // free users see one ad per home screen load
}
```

This makes "no ads" a concrete Pro perk — not just abstract value.
Add to subscription comparison table: "✅ Ad-free experience (Pro)"

---

## City Coverage Priority

Start manual outreach in cities with highest coaching center density:

| City | Coaching Market | Priority |
|---|---|---|
| Pune | ⭐⭐⭐⭐⭐ | 1 |
| Indore | ⭐⭐⭐⭐⭐ | 1 (Kota spillover) |
| Nagpur | ⭐⭐⭐⭐ | 2 |
| Jaipur | ⭐⭐⭐⭐ | 2 (Kota adjacent) |
| Lucknow | ⭐⭐⭐⭐ | 2 |
| Hyderabad | ⭐⭐⭐⭐ | 2 |
| Surat | ⭐⭐⭐ | 3 |
| Bhopal | ⭐⭐⭐ | 3 |
| Mumbai | ⭐⭐⭐ | 3 (higher cost, lower density) |
| Bengaluru | ⭐⭐ | 4 (ed-tech saturated) |

---

## What NOT to Do

- **No Google AdSense** — CPM too low, ads irrelevant, trust destroyed
- **No popups or interstitials** — kills retention immediately
- **No ads for non-education businesses** — a student seeing a "Buy car insurance" ad
  tells their parents the app is spam
- **No auto-playing video ads** — ever
- **No hidden or deceptive labeling** — "📍 Sponsored" always visible
- **No ads for Grade 2–5** — too young; parents won't tolerate it;
  only show ads to Grade 6+ users

---

## Acceptance Criteria

- [ ] `city-ads.json` schema defined and at least 3 sample entries for 2 cities
- [ ] Ads loaded once on `init()`, filtered by city + grade + active status
- [ ] Sponsored card shown on home screen for free users below "This Week" card
- [ ] Pro users see zero ad cards — confirmed in manual test
- [ ] "📍 Sponsored" label always visible on ad card
- [ ] Card opens business URL in new tab on click
- [ ] No ad shown if city not in city-ads.json — graceful, no placeholder
- [ ] Date expiry respected — expired ads never shown
- [ ] Grade 2–5 users see no ads regardless of plan
- [ ] `/advertise` info page exists with contact method for interested businesses

## Files to Touch

- `app/ui/ads/city-ads.json` — ad data store
- `app/ui/app.js` — `_loadAds()`, `_shouldShowAd()`, `_renderAdCard()`,
  call after `_renderHome()` for free users
- `app/ui/styles.css` — `.ad-card`, `.ad-sponsored-chip` (distinct but not intrusive)
- `app/ui/index.html` — no structural change; card injected by JS

## Dependencies

- **P3-T031 (City + weather localization)** — REQUIRED; city detection is the input for ad matching
- P2-T013 (Subscription tier design) — plan check determines who sees ads
- P5-T004 (Feature gate) — `_shouldShowAd()` uses same plan-check pattern
- P4-T006 (Admin portal) — Phase 3 self-serve portal lives here
- P4-T009 can ship before P4-T006 — Phase 1 is fully manual

## Revenue Projection

| Stage | Cities | Advertisers/City | Rate | Monthly Revenue |
|---|---|---|---|---|
| Phase 1 (manual) | 5 | 2 | ₹2,000 | ₹20,000 |
| Phase 2 (semi-auto) | 15 | 3 | ₹3,000 | ₹1,35,000 |
| Phase 3 (self-serve) | 50 | 4 | ₹3,500 | ₹7,00,000 |

Phase 1 revenue can fund the first 6 months of infrastructure costs.
Phase 2 revenue exceeds projected subscription revenue until 2,000 paid subscribers.

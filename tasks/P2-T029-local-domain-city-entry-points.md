# Feature: Local Domain Strategy — City Entry Points + Brand Domain

**Priority:** P2 | **Type:** Branding / Distribution / SEO | **Complexity:** S | **Status:** Pending

> A parent in Pune forwarded `punekids.in` in her school WhatsApp group.
> Three other parents clicked it. They saw "Pune" in the URL, "Pune" in
> the header, and "43 students in Pune practicing this week." They signed up.
> This is the cheapest trust signal in the product.

---

## The Core Idea

Buy one brand domain + 4–6 city domains. All point to the same app via
Cloudflare (free). Each city URL pre-sets the city so the app instantly
shows local branding — no IP detection needed, no delay.

**Total annual cost: ₹4,900 for 6 domains.**
That is less than one month of one coaching center's ad spend.

---

## Why This Wins

### 1 — URL Bar is the First Trust Signal
Before a parent reads a single word of copy, they read the URL.
`punekids.in` communicates everything in 3 syllables:
- It's for kids ✓
- It's from Pune ✓
- It's not a big company ✓

No landing page copy can match what the URL says for free.

### 2 — SEO — Each Domain is a Separate Footprint
Google treats `punekids.in` and `nagpurkids.in` as different websites.
Parents searching:
- "maths practice app Pune" → `punekids.in` ranks
- "study app for class 6 Nagpur" → `nagpurkids.in` ranks
- "daily study app Hindi" → `rozpadho.in` ranks

One app, six SEO entry points, six separate ranking opportunities.
No competitor with one domain can match this without buying the same domains.

### 3 — WhatsApp Group Distribution
Parents share links in school/colony WhatsApp groups by city.
`punekids.in` shared in a Pune parent group = trusted source.
`donnibo.in` shared in the same group = "what is this random website?"
The city name in the URL IS the social proof.

### 4 — B2B Ad Pitch Changes Completely
Before: "Advertise on our study app — ₹2,000/month"
After: "Advertise on **PuneKids.in** — the Pune student platform — ₹2,000/month"

The second pitch sells itself. Coaching centers in Pune know Pune.
They can imagine "PuneKids.in" in a parent WhatsApp forward.
They cannot imagine "donnibo.in" being shared by parents.

---

## Recommended Domain List

### Phase 1 — Buy Immediately (₹4,200)

| Domain | Why | Annual Cost |
|---|---|---|
| `donnibo.in` | Brand home — long-term permanent address | ₹800 |
| `punekids.in` | Maharashtra's largest coaching market | ₹700 |
| `nagpurkids.in` | Vidarbha region — underserved, high intent | ₹700 |
| `indorekids.in` | MP's coaching hub, Kota-adjacent culture | ₹700 |
| `rozpadho.in` | *रोज़ पढ़ो* — national Hindi entry point, memorable | ₹700 |
| `rozmaths.in` | Subject-focused national fallback | ₹600 |

### Phase 2 — Add as Cities Grow (₹700/domain)
`surakids.in`, `jaipurkids.in`, `lucknowkids.in`, `hyderabadkids.in`,
`bhopal kids.in`, `nashikids.in`

### Do Not Buy
- `decashift.in` — brand is moving to Donnibo; avoid locking in old name
- Long domains (> 14 chars) — hard to type on mobile
- `.com` for these — `.in` signals Indian, costs less, better for local SEO
- Domain with hyphens — looks spam

---

## Technical Architecture (Zero Extra Code)

### How It Works

```
punekids.in  ──┐
nagpurkids.in ─┤  Cloudflare (free)  ──►  donnibo.in/?city=Pune
indorekids.in ─┤  Page Rules / Workers     donnibo.in/?city=Nagpur
rozpadho.in  ──┘                           donnibo.in/?city=Indore
                                           donnibo.in/  (brand home)
```

### Step 1 — Cloudflare Setup (free, 15 minutes)

1. Add all domains to Cloudflare (free plan)
2. Point nameservers from registrar to Cloudflare
3. Create Page Rules (free tier: 3 rules per domain):

```
Rule: punekids.in/*
Action: Forwarding URL (301)
Destination: https://donnibo.in/?city=Pune&ref=punekids
```

One rule per city domain. Done. No servers, no code, no deployments.

### Step 2 — App Reads City From URL Param

In `app.js` `init()`, before IP geolocation:

```js
function _getCityFromURL() {
  const params = new URLSearchParams(window.location.search);
  const city   = params.get('city');
  if (city) {
    // Override IP detection — city is already known from domain
    const loc = { city, region: '', country: 'India',
                  source: 'domain', ts: Date.now() };
    localStorage.setItem('ds_location', JSON.stringify(loc));
    // Clean URL (remove ?city=Pune from bar) without page reload
    window.history.replaceState({}, '', window.location.pathname);
    return loc;
  }
  return null;
}
```

Priority order in `_detectCity()`:
1. `?city=` URL param (from city domain redirect) — instant, no network call
2. `localStorage` cache (24h TTL, from prior visit or IP detection)
3. `ipapi.co` IP geolocation (fallback, first visit without city domain)

### Step 3 — GitHub Pages Custom Domain

Set `donnibo.in` as the single GitHub Pages custom domain:
- GitHub repo → Settings → Pages → Custom domain: `donnibo.in`
- This creates a `CNAME` file in the repo root
- All other city domains redirect to `donnibo.in` via Cloudflare (no GitHub involvement)

### Step 4 — HTTPS

Cloudflare handles HTTPS for all city domains automatically (free Universal SSL).
GitHub Pages handles HTTPS for `donnibo.in` (already provided by GitHub).
Zero SSL cert management.

---

## Ref Parameter for Analytics

Each city domain adds `?ref=punekids` alongside `?city=Pune`:

```js
// Store ref source for analytics
const ref = new URLSearchParams(window.location.search).get('ref');
if (ref) localStorage.setItem('ds_ref', ref);
```

This tells you which domain drove each signup. Over time you know:
- `punekids.in` → 340 signups
- `rozpadho.in` → 120 signups
- `nagpurkids.in` → 89 signups

Prioritize ad outreach in cities where the domain already has traction.

---

## Maintenance Complexity — Honestly Low

| Concern | Reality |
|---|---|
| "Multiple domains to manage" | Cloudflare dashboard: one redirect rule per domain, set once, never touched again |
| "Different codebases per city" | No. One codebase. City is a parameter, not a fork. |
| "Domain renewals" | Set auto-renew on registrar. One annual bill. |
| "HTTPS certificates" | Cloudflare provides free SSL for all domains automatically. |
| "Adding a new city" | Buy domain (5 min) → add Cloudflare redirect rule (2 min) → done. |
| "Removing a city" | Delete Cloudflare rule. Domain lapses at renewal. |

The only real ongoing cost is ₹700/year per domain at renewal.

---

## Domain Registration Recommendations

**Registrar:** GoDaddy India or Namecheap
- GoDaddy India often has `.in` domains at ₹599–799 first year
- Namecheap: $0.99 first year promos sometimes include `.in`
- **Always enable auto-renew** — losing `punekids.in` after building word-of-mouth on it is a disaster

**Cloudflare:** cloudflare.com → add site → free plan
- Free plan includes: unlimited redirects via Page Rules, DDoS protection, CDN, free SSL
- No credit card needed for free plan

---

## City-Domain-Aware Landing Page

When app loads via `punekids.in → donnibo.in/?city=Pune`, the landing page
reads the city and shows:

**Hero tagline:**
```
📍 Built for students in Pune
The daily practice habit your child needs.
```

**Social proof:**
```
127 students in Pune practiced this week
```

**Developer card:**
```
"I built this for students like the kids in my city.
No big company. No corporate team. Just a developer
who thinks Pune students deserve better study tools."
                                        — Abhishek
```

**Footer:**
```
PuneKids.in · Made with ❤️ for Pune students
```

The domain drives the entire local experience. From URL bar to footer,
the user sees their city — without the developer writing a single
city-specific page.

---

## Acceptance Criteria

- [ ] `donnibo.in` purchased and set as GitHub Pages custom domain
- [ ] HTTPS enabled and working on `donnibo.in`
- [ ] At least 3 city domains purchased (`punekids.in`, `nagpurkids.in`, `indorekids.in`)
- [ ] `rozpadho.in` purchased as Hindi national entry point
- [ ] All city domains added to Cloudflare (free plan)
- [ ] Cloudflare redirect rules set: each city domain → `donnibo.in/?city={City}&ref={domain}`
- [ ] `_getCityFromURL()` implemented — reads `?city=` param, stores to localStorage, cleans URL
- [ ] City param takes priority over IP geolocation in `_detectCity()`
- [ ] `?ref=` param stored in localStorage for source analytics
- [ ] Landing page shows city-specific hero text when city is detected from domain
- [ ] Footer shows city name when loaded via city domain
- [ ] HTTPS working on all city domains (Cloudflare SSL)
- [ ] Auto-renew enabled on all domains at registrar

## Files to Touch

- `app/ui/app.js` — `_getCityFromURL()` added to `init()`, priority detection order
- `CNAME` (repo root) — set to `donnibo.in` for GitHub Pages
- `app/ui/index.html` — city-aware hero tagline, footer city injection point (same spans as P2-T028)

## Dependencies

- P3-T031 (city + weather localization) — city detection logic; this task adds URL param as the highest-priority source
- P2-T028 (local brand voice) — city-aware landing copy ships together; both tasks edit the same HTML elements
- P2-T015 (landing page improvements) — all three land together as one cohesive local landing experience

## Budget

| Item | Cost |
|---|---|
| `donnibo.in` | ₹800/year |
| 4 city domains | ₹2,800/year |
| `rozpadho.in` | ₹700/year |
| Cloudflare | ₹0 (free plan) |
| GitHub Pages | ₹0 |
| SSL certificates | ₹0 (Cloudflare) |
| **Total Year 1** | **₹4,300/year** |

Break-even: **2.5 months of one coaching center ad placement.**
ROI: every city domain that drives a paying subscriber in month 1 pays for itself 10×.

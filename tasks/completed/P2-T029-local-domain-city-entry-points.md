# Feature: Local Domain Strategy — City Entry Points + Brand Domain

**Priority:** P2 | **Type:** Branding / Distribution / SEO | **Complexity:** S | **Status:** Pending

> A parent in Pune forwarded `punekids.in` in her school WhatsApp group.
> Three other parents clicked it. They saw "Pune" in the URL — the entire
> time they used the app. That is the trust signal. The URL never changes.

---

## The Core Idea

Buy one brand domain + 4–6 city domains. Deploy the app on **Cloudflare Pages**
(free) instead of GitHub Pages. Add all city domains as aliases to the same
deployment. Every domain serves the exact same app — no redirect, no URL change.
The city domain stays in the address bar from first click to sign-up to daily use.

App detects city from `window.location.hostname` — zero params, zero tricks,
nothing visible to anyone.

**Total annual cost: ₹4,300 for 6 domains. Hosting: ₹0.**

---

## Why No Redirects — The Critical Constraint

A redirect (301/302) changes the URL bar. `punekids.in` → `donnibo.in`
happens in a flash but every user sees it. The illusion is broken immediately:
- They know it's not a local site — it's a branded product with city domains as hooks
- Parents in India recognise this pattern from spam sites
- Trust destroyed before the first word of copy is read

**The rule: the city domain must stay in the address bar for the entire session.**
This requires the app to be served directly from each domain, not redirected from it.

---

## Why Cloudflare Pages (Not GitHub Pages)

GitHub Pages supports exactly **one** custom domain per repository. There is no
way to serve the same repo from `punekids.in` AND `nagpurkids.in` without redirects.

Cloudflare Pages solves this natively:

| Feature | GitHub Pages | Cloudflare Pages |
|---|---|---|
| Multiple custom domains | ❌ One only | ✅ Unlimited on same project |
| URL stays as city domain | ❌ Requires redirect | ✅ Native — no redirect needed |
| India CDN edge nodes | ❌ US-only servers | ✅ Mumbai, Chennai, Bangalore |
| Free bandwidth | ✅ Unlimited | ✅ Unlimited |
| Build from GitHub repo | ✅ Yes | ✅ Yes (same repo) |
| Deploy time | ~2 min | ~30 sec |
| Free SSL all domains | ✅ | ✅ |

Cloudflare Pages is strictly better for this use case. Migration takes 30 minutes.

---

## Recommended Domain List

### Phase 1 — Buy Now (₹4,300)

| Domain | Why | Annual Cost |
|---|---|---|
| `donnibo.in` | Brand home — permanent long-term address | ₹800 |
| `punekids.in` | Maharashtra's largest coaching market | ₹700 |
| `nagpurkids.in` | Vidarbha region — underserved, high intent | ₹700 |
| `indorekids.in` | MP coaching hub, Kota-adjacent culture | ₹700 |
| `rozpadho.in` | *रोज़ पढ़ो* — national Hindi entry, memorable | ₹700 |
| `rozmaths.in` | Subject-focused national fallback | ₹600 |

### Phase 2 — Add as Cities Get Users (₹700/domain each)
`surakids.in`, `jaipurkids.in`, `lucknowkids.in`, `hyderabadkids.in`,
`nashikkids.in`, `bhopalids.in`

### Do Not Buy
- `decashift.in` — brand moving to Donnibo; waste of money
- Domains longer than 14 characters — hard to type, hard to remember on mobile
- `.com` versions — `.in` signals Indian origin, costs less, ranks better on Indian Google
- Hyphenated domains — pattern-match to spam for Indian users

---

## Technical Architecture — No Redirects, URL Never Changes

### How It Works

```
User types punekids.in
        │
        ▼
Cloudflare Pages (same deployment)
        │
        ├── punekids.in   ──►  serves app, URL bar shows punekids.in  ✓
        ├── nagpurkids.in ──►  serves app, URL bar shows nagpurkids.in ✓
        ├── indorekids.in ──►  serves app, URL bar shows indorekids.in ✓
        └── donnibo.in    ──►  serves app, URL bar shows donnibo.in    ✓

All four: same HTML, same JS, same CSS. Zero redirects.
```

### Step 1 — Deploy to Cloudflare Pages (30 minutes, one-time)

1. Go to `pages.cloudflare.com` → Create project
2. Connect GitHub repo (`AbhishekSinha02/DecaShift`)
3. Set build output directory: `app/ui`
4. No build command (static files — just deploy as-is)
5. First deploy takes ~1 minute

### Step 2 — Add All City Domains to Same Project

In Cloudflare Pages → project → Custom domains → Add custom domain:
- Add `donnibo.in`
- Add `punekids.in`
- Add `nagpurkids.in`
- Add `indorekids.in`
- Add `rozpadho.in`

Cloudflare auto-provisions SSL for each. Done. Every domain now serves
the app with its own URL showing — permanently, no redirect.

### Step 3 — App Detects City from Hostname

```js
const CITY_DOMAINS = {
  'punekids.in':   { city: 'Pune',    region: 'Maharashtra' },
  'nagpurkids.in': { city: 'Nagpur',  region: 'Maharashtra' },
  'indorekids.in': { city: 'Indore',  region: 'Madhya Pradesh' },
  'surakids.in':   { city: 'Surat',   region: 'Gujarat' },
  'jaipurkids.in': { city: 'Jaipur',  region: 'Rajasthan' },
  'lucknowkids.in':{ city: 'Lucknow', region: 'Uttar Pradesh' },
  'rozpadho.in':   { city: null,      region: null },  // national — use IP fallback
};

function _getCityFromHostname() {
  const host = window.location.hostname;
  const match = CITY_DOMAINS[host];
  if (match && match.city) {
    const loc = { city: match.city, region: match.region,
                  country: 'India', source: 'hostname', ts: Date.now() };
    localStorage.setItem('ds_location', JSON.stringify(loc));
    localStorage.setItem('ds_ref', host); // source analytics
    return loc;
  }
  return null; // not a city domain — fall through to IP detection
}
```

Priority order in `_detectCity()`:
1. `window.location.hostname` match — instant, no network, no params (this task)
2. `localStorage` cache (24h TTL — from prior visit on same domain)
3. `ipapi.co` IP geolocation (first visit on `donnibo.in` or `rozpadho.in`)

Nothing in the URL. Nothing visible. City is silently known from the domain itself.

### Step 4 — Footer Shows Domain Name, Not Just City

When loaded from a city domain, footer reads:

```
PuneKids.in · Made with ❤️ for Pune students
```

```js
function _getFooterBrand() {
  const host  = window.location.hostname;
  const match = CITY_DOMAINS[host];
  if (match?.city) return `${host} · Made with ❤️ for ${match.city} students`;
  return `donnibo.in · Made with ❤️ for Indian students`;
}
```

The domain name in the footer reinforces what is already in the address bar.
Doubled trust signal, zero extra work.

---

## Source Analytics (Which Domain Drives Signups)

`ds_ref` is set in localStorage from `_getCityFromHostname()`:
- `punekids.in` → `ds_ref = "punekids.in"`
- `donnibo.in` → `ds_ref = "donnibo.in"`

On signup, include `ref` in the user profile written to Drive:
```js
user.signupRef = localStorage.getItem('ds_ref') || 'direct';
```

This tells you:
- `punekids.in` → 340 signups
- `rozpadho.in` → 120 signups
- `nagpurkids.in` → 89 signups

Prioritise ad outreach in cities where the domain already has traction.

---

## What the User Sees — End to End

Parent receives `punekids.in` link in Pune school WhatsApp group:

| Touchpoint | What they see | Trust signal |
|---|---|---|
| URL bar (always) | `punekids.in` | Local site ✓ |
| Hero | "📍 Built for students in Pune" | My city ✓ |
| Weather line | "Rainy evening in Pune ☁️" | Live, local ✓ |
| Student count | "127 students in Pune this week" | Real community ✓ |
| Ad card | Pune coaching center | Local resource ✓ |
| Footer | "PuneKids.in · Made with ❤️ for Pune students" | Confirms domain ✓ |
| Developer card | "I built this for students in my city" | Human, local ✓ |

Every layer says the same thing. The URL never changes throughout.

---

## Maintenance Complexity — Genuinely Low

| Concern | Reality |
|---|---|
| Multiple domains to maintain | Cloudflare Pages → Custom domains → list view. All visible in one screen. |
| Different codebases per city | No. One repo, one deployment. City is hostname, not a fork. |
| Adding a new city | Buy domain (5 min) → add to Cloudflare Pages (2 min) → add to `CITY_DOMAINS` dict (1 line) → push. |
| Domain renewals | Set auto-renew at registrar. One annual bill per domain. |
| SSL certs | Cloudflare auto-provisions and auto-renews. Zero management. |
| GitHub integration | Cloudflare Pages auto-deploys on every push to main. Same workflow as before. |

---

## Migration from GitHub Pages (One-Time, 30 Minutes)

1. Deploy to Cloudflare Pages (connect repo, set `app/ui` as root — 10 min)
2. Add all domains to Cloudflare Pages project (5 min)
3. Remove GitHub Pages custom domain setting from repo (2 min)
4. Update `CNAME` file or remove it — no longer needed (1 min)
5. Test all domains load correctly — done

After migration, GitHub is still the source of truth for code.
Cloudflare Pages auto-deploys on every `git push origin main`.
Workflow is unchanged. Just a better host.

---

## Acceptance Criteria

- [ ] App deployed to Cloudflare Pages from GitHub repo
- [ ] `donnibo.in` added as custom domain — loads app, URL stays `donnibo.in`
- [ ] `punekids.in`, `nagpurkids.in`, `indorekids.in` added — each stays in URL bar throughout session
- [ ] `rozpadho.in` added as national Hindi entry point
- [ ] `_getCityFromHostname()` implemented — reads hostname, stores to localStorage
- [ ] City homepage detection: hostname match overrides IP geolocation
- [ ] Footer shows domain name when loaded from a city domain
- [ ] `ds_ref` stored in localStorage from hostname for signup attribution
- [ ] Signup saves `signupRef` to user Drive profile
- [ ] HTTPS working on all domains (Cloudflare auto-SSL)
- [ ] Auto-renew enabled on all domains at registrar
- [ ] GitHub Pages custom domain removed (avoid conflict)

## Files to Touch

- `app/ui/app.js` — `_getCityFromHostname()`, `CITY_DOMAINS` map,
  updated `_detectCity()` priority order, footer brand string, signup ref capture
- `app/ui/index.html` — footer brand injection point (shared with P2-T028)
- `CNAME` (repo root) — remove or update once Cloudflare Pages is primary host

## Dependencies

- P3-T031 (city + weather) — city detection priority chain; hostname is the new top priority
- P2-T028 (local brand voice) — footer city string and developer card ship together
- P2-T015 (landing page) — all three land as one cohesive local landing experience

## Budget

| Item | Cost |
|---|---|
| `donnibo.in` | ₹800/year |
| 4 city domains | ₹2,800/year |
| `rozpadho.in` | ₹700/year |
| Cloudflare Pages | ₹0 (free — unlimited bandwidth) |
| SSL certificates | ₹0 (Cloudflare auto) |
| **Total Year 1** | **₹4,300/year** |

Break-even: 2.5 months of one coaching center ad placement.

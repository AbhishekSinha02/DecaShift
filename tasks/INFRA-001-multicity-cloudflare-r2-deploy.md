# INFRA-001: Multi-City Custom-Domain Deployment (Cloudflare Pages + R2)

**Priority:** 🟠 P2 — after FEAT-005 + a tested build. **Type:** Infrastructure + Code | **Complexity:** M–L | **Status:** Planned (not started)

> **Trigger:** user wants real per-city custom domains (Lucknow first, then more) without forking the
> codebase. Discussed 2026-06-03. **Do NOT start until the current build is tested and FEAT-005 item 5
> (brand config by hostname) is in place** — cities must be *config, not clones*
> ([[strategy_operating_model]]).

---

## The decision already locked (so we don't re-litigate)
- **Content stays PUBLIC.** Moat is the journey, not the content ([[strategy_positioning_growth_engine]]).
  A static client can't keep a secret, so do NOT build content auth/signed-URLs for launch. Only revisit
  signed URLs if competitor scraping becomes a *measured* problem.
- **Cities = config, not clones.** One codebase, one deploy updates every city. The Varanasi/Nagpur
  folder-copy POC was a proof only — the real engine is **FEAT-005 item 5**: one `city.json` +
  `hostname → config` resolver, zero hardcoded brand strings. The copy-clone approach must NOT become
  the deployment model.

## Why Cloudflare (vs Azure / AWS)
Architecturally identical (a serverless trust boundary + object storage), but for a solopreneur on
INR pricing Cloudflare wins: **R2 has no egress fees**, Workers/Pages **scale to zero**, generous free
tier, simplest setup. Azure (Functions+Blob) / AWS (Lambda+API GW+S3+CloudFront) = same idea, more
moving parts + egress cost. Already in the stack notes (static site + R2 + Upstash).

## Target architecture
```
Cloudflare Pages  → serves the ONE app build (app/ui) for every city domain
  ├── lucknow.<domain> / dailymath30.com / punekids.in ...  → same build
  └── hostname → city.json resolver picks brand (name/logo/colors/contact/coupon)
Cloudflare R2     → /content question bank (PUBLIC bucket; one shared source, all cities)
  └── app fetches /content/... same-origin (or R2 custom domain) — already the load path
(Upstash later)   → only if a real backend counter/state is needed at scale; not for launch
```
- The app already fetches content by absolute `/content/...` first (city POC proved this), so moving
  `/content` to an R2-backed path is a base-URL change, not an app rewrite. Item-4 stable content IDs
  (FEAT-005) make the move safe.

## Build order (high level — expand into a session brief when starting)
1. **FEAT-005 item 5 first** — brand config + hostname resolver, one city populated. (Prereq; without it
   multi-city = forking = the thing we're avoiding.)
2. **PWA manifest per-city decision** (FEAT-005 wrinkle: static vs per-domain dynamic manifest) — bakes
   at install time, decide before real installs.
3. **Host app on Cloudflare Pages**; point the first custom domain at it. Keep GitHub Pages as-is until
   parity confirmed (don't touch DNS/Pages config prematurely — standing rule).
4. **Move `/content` to R2** (public bucket + custom domain or same-origin route); flip the app's content
   base; verify lazy load + daily sprint still resolve.
5. **Add city #2** by config only (new hostname → new city.json row). No code copy. This is the test that
   the "config not clones" rule actually holds.

## Explicitly out of scope (for launch)
- Content authentication / signed URLs (content is public by decision).
- Upstash/Workers backend — not needed until there's real server-side state (counters, automated
  Razorpay webhook = ENH-011 Phase 2, separate).
- Per-city pricing / content overlays — deferred until Lucknow converts.

## Dependencies
- **Hard prereq: FEAT-005 item 5** (brand config) — and a tested build.
- Relates to [[strategy_operating_model]] (distributed-local, fragment public face) and
  [[strategy_pricing_lucknow_pilot]] (Lucknow city #1).
- Supersedes the folder-clone POC (Varanasi/Nagpur) as the deployment model.

# Operating Model — Distributed Local, Unified Engine

**Priority:** M1 | **Type:** Business Architecture / Strategy | **Status:** Locked (2026-06-02)

> **The thesis (founder's call, and it's the more survivable one):** In India, a big visible
> brand with a big earnings number is a *target* — it attracts competition, copycats, and
> regulatory "raised eyes" (doubly so with children's data). A scatter of modest, local,
> low-profile city operations is **not worth a funded competitor's time to attack**, and the
> real moat — local teacher/partner/parent trust, built city by city — is **economically
> un-clonable** by a national player chasing vanity metrics. Stay small-looking. Be many.

This doc is the business architecture. Pricing lives in `P2-T013`. City execution lives in
`LUCKNOW-LAUNCH-STRATEGY.md` and `M-T004`.

---

## The Core Architecture: Fragment the Face, Unify the Engine

The whole model rests on one separation:

| Layer | Strategy | Contents | Why |
|---|---|---|---|
| **Public face** (visible) | **Fragmented & local** | Per-city domain & local sub-brand (`lucknowkids.in`, `punekids.in`…), local owner, local interns/partners, local language mix, local channels | No single target. Low regulatory profile. Each city reads as a small local thing — invisible to national competitors. Downside-protected: a flopped city's skin is quietly retired with zero brand contamination. |
| **Backend engine** (invisible) | **Unified & hidden** | One codebase, one content engine, one billing rail (Razorpay), one data store, one replication playbook, one **private** aggregate dashboard | This is what makes it **manageable by a solopreneur** and **un-replicable**. The "difficulty to manage" of fragmentation only bites when cities are *truly* separate businesses. With one engine, 6 cities run as easily as 1. Also kills quality-drift: every local face serves the *same* app + content, never a degraded knock-off. |

**One line:** *Looks like many small local players from the outside; runs as one efficient
invisible machine on the inside.* Camouflage **and** leverage.

> ⚠️ This **reverses** the earlier "build one national master brand" idea — deliberately.
> That optimized for exit/enterprise value; this optimizes for **durable, defensible,
> owner-controlled cashflow that doesn't attract a fight.** Different game, chosen on purpose.

---

## Why the Moat Holds

- **Local human trust is the moat, not the app.** A competitor clones the app in weeks; they
  cannot clone 50 Lucknow teacher relationships, because building local trust city-by-city has
  unit economics that don't work for a funded player chasing big national numbers.
- **No big number to envy.** Distributed, modest, unpublicised earnings → nothing that triggers
  competitive FOMO or regulatory attention.
- **Distributed resilience.** One city dies → nothing else is touched. Every city is an
  isolated experiment (M-T004).
- **Kids'-data safety.** Privacy scrutiny falls hardest on big visible players. Staying local
  and low-profile is genuinely lower-risk here.

---

## City-Owner Model (the franchise layer)

| Element | Decision |
|---|---|
| **Ownership** | Each city has **one local owner/operator** who runs local strategy, interns, partners, channels. |
| **Revenue split** | Founder keeps the **major portion**. Owner gets a share that **evolves**: larger early (owner carries the risk + heavy lifting on an unproven city) → brand/product takes more once the playbook is proven and the owner is handed a working machine. |
| **Billing** | **Centralized through the founder's Razorpay — always.** Owner gets a *share*, never the customer relationship. Protects the brand, the data, and guarantees the founder's portion structurally (not on trust). Owner payout is a monthly distribution. |
| **Owner KPI** | Measured & paid on **trial→paid % and retention**, NOT raw signups. Prevents vanity-signup flooding. |
| **Local autonomy** | Owner localizes the *inputs* (which partner, which parent groups, language mix). The *engine/playbook* (trial → soft-lock → human close → coupon) stays identical. Standardize the machine, localize the fuel. |

---

## What the Solopreneur Holds vs Delegates

- **Now (solo phase):** founder builds + maintains the engine, owns billing/data, runs the
  private dashboard, signs city owners, keeps the content cadence (weekly, week-on-week — see
  below). Interns/owners on incentives = near-zero fixed cost.
- **Handover trigger (define it so it actually happens):** hand the matured product to a
  dedicated **dev team + marketing team** when, e.g. — **3 cities each past their Week-6
  conversion gate + combined ≥300 paid + monthly churn under ~6%.** Until that gate, "mature"
  is undefined and handover slips forever.
- **Handover insurance:** the CLAUDE.md discipline (atomic commits, task docs, schemas) is what
  keeps a solo-built vanilla codebase handover-able. Keep it religiously. Low profile ≠ no docs.

---

## Two Kinds of "Grip" (don't confuse them)

1. **Product grip — weekly content cadence.** Fresh practice content week-on-week keeps the
   product alive and the admin aware of movement. Already the plan.
2. **Business grip — weekly per-city funnel review.** One **private** dashboard across all
   cities: trials, **trial→paid %**, churn/retention, ARPU, owner payout. External
   fragmentation, **internal consolidation** — you cannot control what you can't see in one place.

A subscription business lives on **renewal, not first sale.** Weekly content + the Champion
live-exam tier are the retention engine; make retention an explicit owner KPI.

---

## Honest Tradeoffs (acknowledged, mitigated)

| Tradeoff | Mitigation |
|---|---|
| No consolidated brand → lower exit/enterprise value | Accepted on purpose — optimizing for cashflow + survivability, not exit |
| Fragmentation = operational drag | Killed by the unified invisible engine — one system, many faces |
| Quality could drift across local faces | Same app + same content engine everywhere → no drift possible |
| Key-person dependency (solo build) | Documentation discipline + a defined handover trigger |
| Could lose sight of aggregate numbers | One private internal dashboard, mandatory |

---

## Dependencies / Related
- `P2-T013-subscription-tier-design.md` — pricing, coupons, gate logic
- `LUCKNOW-LAUNCH-STRATEGY.md` — first city execution
- `M-T004-city-launch-playbook.md` — replication manual (Lucknow = city #1)
- `M-T002-referral-tracking-rep-performance.md` — owner/rep tracking feeds the private dashboard

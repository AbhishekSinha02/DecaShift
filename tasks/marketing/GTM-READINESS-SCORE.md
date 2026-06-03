# Go-to-Market Readiness Score (Sales & Marketing)

**Type:** Strategy Scorecard | **Maintained alongside** the product score in
`memory/launch_confidence_scores.md`. Re-score when asked for "confidence / readiness" so GTM
tracks over time the way the product does.

> **Why a separate score:** the product score (85/100) measures whether the app works. It says
> nothing about whether we can *sell* it. For a **paid** launch, go-to-market readiness — not
> product readiness — is the binding constraint.

---

## Scoring Parameters (fixed — compare across dates)

| # | Parameter | What it measures |
|---|---|---|
| S1 | Pricing & Packaging | Tier design, value–price fit, decoy/anchor logic, coupon system |
| S2 | Positioning & Differentiation | The story, vs-competitor wedge, product-backed claims |
| S3 | Acquisition Channels | Defined, low-cost, repeatable channels + proof of conversion |
| S4 | Sales Process & Conversion | Trial→paid mechanic, human close, payment rail, gating built |
| S5 | Distribution / Operating Model | City-franchise structure, owner model, replication playbook |
| S6 | Sales Enablement Assets | Scripts, templates, QR, rep kit, dashboard — built and in-hand |
| S7 | Unit Economics & Margin | Infra cost, ARPU, CAC, payback period |
| S8 | Retention & LTV | Renewal mechanics, content flywheel, churn risk |
| S9 | Team & Execution Capacity | Solopreneur bandwidth, reps hired, handover trigger |
| S10 | Measurement & Feedback Loop | Live instrumentation, ref tracking, decision gates |

---

## Score History

### 2026-06-02b — correction: signup friction already resolved
G10 (OAuth/email signup friction) was carried over stale from product failure F4. Verified in
`app-auth.js`: signup is User ID + password only — no email, no phone, no Google OAuth consent
(FEAT-002). The Drive write is server-side via Apps Script. Gate-demo→QR→signup is frictionless.
**S3 6→7; TOTAL 62→63; failures now 1 Critical · 3 High · 4 Medium · 1 Low.**

### 2026-06-02 — baseline (Lucknow pilot strategy designed, not executed)

| # | Parameter | Score | Notes |
|---|---|---|---|
| S1 | Pricing & Packaging | 7/10 | Finalized (annual-led decoy, sibling add-on, coupons, ₹1,199 floor). Strong, **unvalidated in market.** |
| S2 | Positioning & Differentiation | 8/10 | "The only app that's alive" + concept-first + visual; **product-backed** (4–5 differentiators live). Strongest asset. |
| S3 | Acquisition Channels | 7/10 | Right channels (gate, WhatsApp, teacher, partner) **and now frictionless end-to-end**: signup is User ID + password, no email/phone/OAuth (FEAT-002, verified in `app-auth.js`). Gate-demo→QR→signup is clean. Still **zero executed; no conversion proof.** |
| S4 | Sales Process & Conversion | 5/10 | Mechanic + demo script designed. **In-app paywall + Razorpay NOT built — can't collect money.** |
| S5 | Distribution / Operating Model | 6/10 | City-franchise + playbook documented, bounded-risk. **No city launched, no owner signed.** |
| S6 | Sales Enablement Assets | 5/10 | Demo script (M-T005) ✅, WhatsApp templates exist. Rep kit, QR cards, dashboard **not built.** |
| S7 | Unit Economics & Margin | 9/10 | **Best number.** Near-zero infra, margin healthy at floor, payback ≈ 1 conversion/city. |
| S8 | Retention & LTV | 7/10 | Weekly flywheel + live exams + 9/10 delight stack. **Renewal unproven, churn unmeasured.** |
| S9 | Team & Execution Capacity | 5/10 | Solopreneur can run pilot; interns on incentive. **No reps hired; single-person bottleneck.** |
| S10 | Measurement & Feedback Loop | 4/10 | Ref tracking + Week-6 gates designed. **Nothing live — would launch blind.** |
| | **TOTAL** | **63/100** | Strategy thinking ~8/10; execution readiness ~5/10. (+1 from baseline: signup friction confirmed already removed — FEAT-002.) |

**Blended paid-launch confidence: ~71/100** (product 85 gated by GTM 63 for a *paid* pilot).

---

## Sales & Marketing Failure Score

| # | Failure Point | Severity | Status |
|---|---|---|---|
| G1 | Trial→paid % at premium price unproven — the whole revenue thesis | 🔴 Critical | **Nature changed: it's a RATE, not a binary, driven by TWO engines (paid push + organic viral loop), not intern-dependent.** Timeline to 100 paid = reach × conversion% × viral-K. Still only *proven* by running the pilot — the pilot IS the experiment. |
| G2 | Can't collect money — Razorpay + new-pricing paywall not built | 🟠 High | P2-T013 code pending |
| G3 | Depends on hiring a *good* local rep/owner; weak one = dead city | 🟠 High | No rep hired; incentive model mitigates |
| G4 | Solopreneur bandwidth (build + content + sales + support) | 🟠 High | Mirrors product F5; handover trigger defined |
| G5 | No live funnel instrumentation — blind on drop-off | 🟡 Medium | M-T002 designed, not live |
| G6 | Word-of-mouth assumed, not proven (F7 loop live but unmeasured) | 🟡 Medium | **Being actively built into Engine 2:** success-card sharing to WhatsApp/FB + validation quests = deliberate viral loop (E-013/E-015 shipped). Lever = viral-K (share at peak emotion + recipient-pull card + frictionless landing). Measure K via ref attribution (= G5 build). Still unmeasured. |
| G7 | Single-city concentration — Lucknow cold pick risk | 🟡 Medium | Mitigated only with a Lucknow ground contact |
| G8 | Engaged child outruns weekly content | 🟡 Medium | Keep drop ahead of cohort |
| G9 | Reps over-discount → margin/perception erosion | 🟢 Low | Floor-price rule in code mitigates |
| ~~G10~~ | ~~OAuth signup friction~~ | ✅ Resolved | **Not a risk — FEAT-002 made signup User ID + password only; no email/phone/OAuth (verified `app-auth.js`). Gate-demo→signup is frictionless.** |

**1 Critical · 3 High · 4 Medium · 1 Low · 1 Resolved.**

---

## Fastest moves: 63 → 80

1. **G2 — build paywall + Razorpay** (S4 5→8). Can't earn until this exists.
2. **G5/S10 — wire ref-code tracking live** (S10 4→7). A pilot with no instrumentation burns a city.
3. **G1 — run the pilot and measure trial→paid.** The only way to resolve the Critical; not a
   planning problem, a shipping problem.

> ✅ Signup friction (old G10) already resolved by FEAT-002 — one fewer blocker than the baseline.

---

## How to Apply
When asked for confidence/readiness, score product (launch_confidence_scores.md) **and** this GTM
scorecard. For a paid launch, report the blended number gated by the lower of the two.

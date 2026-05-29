# Session: PENDING — Landing Page Phase 3: Carousel + Hero Fix + Pricing Removal

**Priority:** 1 ← TOP of queue
**Type:** Code / Design
**Est. Duration:** 3–4 hours across 5 atomic steps
**Tasks:** P2-T038 (partial), P2-T039, P2-T040, P2-T042 (partial)
**Trigger:** "start the session"
**Depends on:** Phase 2 done (commit e14da29) ✅

---

## Objective

Three things that must happen before any marketing:
1. Remove ALL "free" and pricing language from landing page — zero mentions
2. Replace static phone mockup with a 4-slide feature carousel (Flash Drills · Practice · Progress · Week Sets)
3. Make the hero self-contained above the fold on a 1440×900 laptop — no scroll needed to convert
4. Fix horizontal overflow on mobile (content shifting left)
5. Remove the city proof ticker (too explicit about local focus)

---

## Context / Decisions Locked

- No pricing on landing page — pricing is shown at paywall after trial expires, not upfront
- "Free" removed because it anchors expectations at ₹0 before the user has tried the product
- City ticker removed — local focus is an offline marketing strategy, not an on-page claim
- "How it works" (3 steps) removed — the feature carousel communicates this visually and is more compelling
- Hero on laptop must be above-fold complete: headline + CTAs + carousel all visible at 1440×900

---

## ATOMIC STEP 1 — Remove pricing, city ticker, "free" language
**Time:** ~30 min | **Files:** screen-landing.html, styles-landing.css

### 1a. Remove from screen-landing.html:
- The entire `<!-- ── Pricing ──` section (Free vs ₹79 plan grid)
- The `<!-- ── City proof ticker ──` section (`.lp-proof-bar` div)
- All `lp-stats` `<strong>₹0</strong>` stat item
- Hero trust pills: remove "✅ Free forever" and "✅ No credit card" — replace with:
  ```html
  <span class="lp-trust-pill">✅ Full access trial</span>
  <span class="lp-trust-pill">✅ No card needed</span>
  <span class="lp-trust-pill">✅ CBSE-aligned</span>
  ```
- Hero badge: "🇮🇳 Trusted by students across India · Grade 2–12" → keep as-is
- Footer: Remove pricing sub copy
- CTA block: Remove "Free forever" mention

### 1b. CTA button copy changes:
- "Start Free — Grades 2–12" → "Start your trial →"
- "Start 15-day Free Trial →" (pricing card) → removed (whole section removed)
- "Get Started Free →" (footer CTA) → "Get started →"
- "Answer more questions free →" → "Answer more questions →"

### 1c. Remove city ticker CSS from styles-landing.css:
- Delete `.lp-proof-bar`, `.lp-proof-label`, `.lp-proof-ticker`, `.lp-proof-dot`, `@keyframes lp-ticker`

### 1d. Remove count-up data-target attributes from stats that had ₹0:
- Keep the count-up for 6000+, 11, 6 — they're real stats
- Replace ₹0 stat with "Grade 2–12" as the 4th stat:
  ```html
  <div class="lp-stat"><strong>CBSE</strong><span>Aligned</span></div>
  ```

### ✅ COMMIT STEP 1
```
git commit -m "refactor(landing): remove all pricing/free language + city ticker"
git push origin main
```

---

## ATOMIC STEP 2 — Feature carousel (replace phone mockup)
**Time:** ~90 min | **Files:** screen-landing.html, styles-landing.css, app-auth.js

### 2a. Replace hero right column HTML

Remove everything inside `.lp-hero-right` (phone + badges).
Replace with:

```html
<div class="lp-hero-right">
  <div class="lp-carousel" id="lp-carousel">
    <div class="lp-carousel-track" id="lp-carousel-track">

      <!-- Slide 1: Flash Drills -->
      <div class="lp-slide">
        <div class="lp-slide-card lp-slide-drills">
          <div class="lp-slide-tag">⚡ Flash Drills</div>
          <div class="lp-slide-drill-grid">
            <div class="lp-sdc lp-sdc-correct">8 × 7 = 56 ✓</div>
            <div class="lp-sdc">12² = 144</div>
            <div class="lp-sdc lp-sdc-correct">F = ma ✓</div>
            <div class="lp-sdc">5³ = 125</div>
          </div>
          <div class="lp-slide-timer">⏱ 01:42 remaining</div>
        </div>
        <div class="lp-slide-text">
          <h3 class="lp-slide-title">Drill in 2 minutes flat.</h3>
          <p class="lp-slide-sub">Tables, squares, cubes, formulas — speed mode.</p>
        </div>
      </div>

      <!-- Slide 2: Daily Practice -->
      <div class="lp-slide">
        <div class="lp-slide-card lp-slide-quiz">
          <div class="lp-slide-tag">📖 Daily Practice</div>
          <div class="lp-slide-q">If 3x + 5 = 20, what is x?</div>
          <div class="lp-slide-opts">
            <div class="lp-sdo">x = 3</div>
            <div class="lp-sdo lp-sdo-correct">x = 5 ✓</div>
            <div class="lp-sdo">x = 7</div>
            <div class="lp-sdo">x = 4</div>
          </div>
          <div class="lp-slide-expl">Subtract 5 both sides: 3x = 15, x = 5</div>
        </div>
        <div class="lp-slide-text">
          <h3 class="lp-slide-title">10 questions. Instant explanation.</h3>
          <p class="lp-slide-sub">Every subject, every grade, every day.</p>
        </div>
      </div>

      <!-- Slide 3: Progress -->
      <div class="lp-slide">
        <div class="lp-slide-card lp-slide-progress">
          <div class="lp-slide-tag">📈 Your Progress</div>
          <div class="lp-slide-chart">
            <div class="lp-bar-row">
              <div class="lp-bar" style="height:35%"></div>
              <div class="lp-bar" style="height:45%"></div>
              <div class="lp-bar" style="height:40%"></div>
              <div class="lp-bar" style="height:55%"></div>
              <div class="lp-bar" style="height:65%"></div>
              <div class="lp-bar" style="height:72%"></div>
              <div class="lp-bar lp-bar-today" style="height:88%"></div>
            </div>
            <div class="lp-chart-label">Week 1 → Week 7 accuracy</div>
          </div>
          <div class="lp-slide-acc">88% this week <span class="lp-acc-delta">↑ 53%</span></div>
        </div>
        <div class="lp-slide-text">
          <h3 class="lp-slide-title">Watch accuracy climb week by week.</h3>
          <p class="lp-slide-sub">Every session logged. Every improvement visible.</p>
        </div>
      </div>

      <!-- Slide 4: Weekly Sets -->
      <div class="lp-slide">
        <div class="lp-slide-card lp-slide-week">
          <div class="lp-slide-tag">📅 This Week</div>
          <div class="lp-slide-week-pills">
            <div class="lp-wpill lp-wpill-done">M</div>
            <div class="lp-wpill lp-wpill-done">T</div>
            <div class="lp-wpill lp-wpill-done">W</div>
            <div class="lp-wpill lp-wpill-today">T</div>
            <div class="lp-wpill">F</div>
            <div class="lp-wpill">S</div>
            <div class="lp-wpill">S</div>
          </div>
          <div class="lp-slide-subjects">
            <span class="lp-sub-chip lp-sub-math">Math</span>
            <span class="lp-sub-chip lp-sub-sci">Science</span>
            <span class="lp-sub-chip lp-sub-eng">English</span>
            <span class="lp-sub-chip lp-sub-hin">Hindi</span>
          </div>
          <div class="lp-slide-note">New set unlocks Monday</div>
        </div>
        <div class="lp-slide-text">
          <h3 class="lp-slide-title">Fresh questions every Monday.</h3>
          <p class="lp-slide-sub">CBSE-aligned, curriculum-mapped, never repeated.</p>
        </div>
      </div>

    </div>
    <!-- Dots -->
    <div class="lp-carousel-dots" id="lp-carousel-dots">
      <button class="lp-dot lp-dot-active" data-slide="0"></button>
      <button class="lp-dot" data-slide="1"></button>
      <button class="lp-dot" data-slide="2"></button>
      <button class="lp-dot" data-slide="3"></button>
    </div>
  </div>
</div>
```

### 2b. Carousel CSS (add to styles-landing.css)

```css
/* ── Feature Carousel ─────────────────────────────────────────────── */
.lp-carousel {
  position: relative; width: 100%;
  display: flex; flex-direction: column; gap: 16px;
}
.lp-carousel-track {
  display: flex;
  transition: transform .5s cubic-bezier(.4,0,.2,1);
  will-change: transform;
}
.lp-slide {
  min-width: 100%; flex-shrink: 0;
  display: flex; flex-direction: column; gap: 20px;
}
.lp-slide-card {
  border-radius: 24px; padding: 24px;
  box-shadow: 0 12px 48px rgba(0,0,0,.12);
  transition: transform .28s, box-shadow .28s;
}
.lp-slide-card:hover { transform: translateY(-4px); box-shadow: 0 20px 64px rgba(0,0,0,.16); }

/* Slide backgrounds */
.lp-slide-drills   { background: linear-gradient(135deg,#1e3a8a,#1d4ed8); }
.lp-slide-quiz     { background: linear-gradient(135deg,#14532d,#16a34a); }
.lp-slide-progress { background: linear-gradient(135deg,#1e293b,#334155); }
.lp-slide-week     { background: linear-gradient(135deg,#4c1d95,#7c3aed); }

/* Slide tag */
.lp-slide-tag {
  font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
  color: rgba(255,255,255,.65); margin-bottom: 12px;
}

/* Slide text below card */
.lp-slide-text { padding: 0 4px; }
.lp-slide-title {
  font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800;
  color: #1e293b; margin: 0 0 6px; line-height: 1.2;
}
.lp-slide-sub { font-size: 14px; color: #64748b; margin: 0; }

/* Drill grid */
.lp-slide-drill-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
.lp-sdc {
  background: rgba(255,255,255,.1); color: rgba(255,255,255,.85);
  font-family: 'DM Mono', monospace; font-size: 13px;
  padding: 10px 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,.12);
}
.lp-sdc-correct { background: rgba(34,197,94,.2); color: #86efac; border-color: rgba(34,197,94,.3); }
.lp-slide-timer  { font-size: 12px; color: rgba(255,255,255,.5); font-family: 'DM Mono', monospace; }

/* Quiz slide */
.lp-slide-q { font-size: 14px; font-weight: 600; color: #fff; margin-bottom: 12px; line-height: 1.4; }
.lp-slide-opts { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
.lp-sdo {
  font-size: 12px; color: rgba(255,255,255,.75); background: rgba(255,255,255,.1);
  padding: 7px 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,.1);
}
.lp-sdo-correct { background: rgba(34,197,94,.2); color: #86efac; border-color: rgba(34,197,94,.3); font-weight: 600; }
.lp-slide-expl { font-size: 11px; color: rgba(255,255,255,.5); border-left: 2px solid rgba(59,130,246,.5); padding-left: 8px; line-height: 1.4; }

/* Progress chart */
.lp-slide-chart { margin-bottom: 12px; }
.lp-bar-row { display: flex; gap: 6px; align-items: flex-end; height: 80px; margin-bottom: 6px; }
.lp-bar { flex: 1; background: rgba(255,255,255,.2); border-radius: 4px 4px 0 0; transition: height .6s ease; }
.lp-bar-today { background: #3b82f6; }
.lp-chart-label { font-size: 10px; color: rgba(255,255,255,.4); font-family: 'DM Mono', monospace; }
.lp-slide-acc { font-size: 14px; font-weight: 700; color: #fff; }
.lp-acc-delta { font-size: 12px; color: #4ade80; margin-left: 6px; }

/* Week slide */
.lp-slide-week-pills { display: flex; gap: 6px; margin-bottom: 14px; }
.lp-wpill {
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(255,255,255,.12); color: rgba(255,255,255,.5);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700;
}
.lp-wpill-done  { background: rgba(255,255,255,.9); color: #7c3aed; }
.lp-wpill-today { background: #fff; color: #7c3aed; box-shadow: 0 0 0 3px rgba(255,255,255,.3); }
.lp-slide-subjects { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px; }
.lp-sub-chip { font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 100px; }
.lp-sub-math { background: rgba(59,130,246,.3); color: #93c5fd; }
.lp-sub-sci  { background: rgba(34,197,94,.3);  color: #86efac; }
.lp-sub-eng  { background: rgba(139,92,246,.3); color: #c4b5fd; }
.lp-sub-hin  { background: rgba(239,68,68,.3);  color: #fca5a5; }
.lp-slide-note { font-size: 11px; color: rgba(255,255,255,.4); }

/* Dots */
.lp-carousel-dots { display: flex; justify-content: center; gap: 8px; padding: 4px 0; }
.lp-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #cbd5e1; border: none; cursor: pointer;
  transition: all .25s; padding: 0;
}
.lp-dot-active { background: #3b82f6; width: 24px; border-radius: 4px; }
```

### 2c. Carousel JS in `_setupLanding()`

```js
const track   = document.getElementById('lp-carousel-track');
const dots    = document.querySelectorAll('.lp-dot');
let   current = 0;
let   autoTimer;

function goToSlide(n) {
  current = (n + 4) % 4;
  track.style.transform = `translateX(-${current * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('lp-dot-active', i === current));
}

function nextSlide() { goToSlide(current + 1); }
autoTimer = setInterval(nextSlide, 4000);

dots.forEach(d => d.addEventListener('click', () => {
  clearInterval(autoTimer);
  goToSlide(+d.dataset.slide);
  autoTimer = setInterval(nextSlide, 4000);
}));

// Touch/swipe support
const carousel = document.getElementById('lp-carousel');
if (carousel) {
  let tx = 0;
  carousel.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 40) {
      clearInterval(autoTimer);
      goToSlide(dx < 0 ? current + 1 : current - 1);
      autoTimer = setInterval(nextSlide, 4000);
    }
  }, { passive: true });
}
```

### ✅ COMMIT STEP 2
```
git commit -m "feat(landing): 4-slide feature carousel — Flash Drills, Practice, Progress, Week Sets"
git push origin main
```

---

## ATOMIC STEP 3 — Hero full-viewport + remove "How it works" section
**Time:** ~30 min | **Files:** styles-landing.css, screen-landing.html

### 3a. Hero fills viewport
```css
.lp-hero {
  min-height: calc(100vh - 64px);
  align-items: center;
  /* Remove padding-top: 136px → use top: 64px offset via margin or padding: 64px 64px 0 */
  padding: 80px 64px 60px;
}
```

### 3b. Move stats inline into hero left column (compact row)
Replace the separate `.lp-stats` section with a compact inline version inside `.lp-hero-left`, after trust pills:
```html
<div class="lp-hero-stats">
  <span>6,000+ questions</span>
  <span class="lp-hs-sep">·</span>
  <span>11 grades</span>
  <span class="lp-hs-sep">·</span>
  <span>6 subjects</span>
</div>
```
CSS:
```css
.lp-hero-stats { display: flex; gap: 8px; font-size: 12px; color: #94a3b8; flex-wrap: wrap; }
.lp-hs-sep { color: #cbd5e1; }
```

### 3c. Remove "How it works" section from HTML
Delete the entire `<div class="lp-section lp-how" id="lp-how">` block.

Update nav `href="#lp-how"` → `href="#lp-features"` (or just remove the nav link).

### 3d. Add `id="lp-features"` to first feature row
```html
<div class="lp-feature lp-feature-alt" id="lp-features">
```

### 3e. Hide scrollbar, fix overflow
```css
#screen-landing::-webkit-scrollbar { display: none; }
#screen-landing { scrollbar-width: none; overflow-x: hidden; }
```

### ✅ COMMIT STEP 3
```
git commit -m "feat(landing): full-viewport hero, inline stats, no-scroll bar, remove how-it-works"
git push origin main
```

---

## ATOMIC STEP 4 — Fix mobile overflow (content shift left)
**Time:** ~20 min | **Files:** styles-landing.css, styles-base.css

### 4a. Root overflow fix
```css
/* styles-base.css */
html, body { overflow-x: hidden; }
```

### 4b. Hide phone badges on mobile (they cause overflow)
```css
@media (max-width: 768px) {
  .lp-phone-badge { display: none; }
}
```

### 4c. Feature alt sections — fix padding on mobile
Already in responsive block but verify:
```css
@media (max-width: 768px) {
  .lp-feature-alt .lp-feature-visual { padding-right: 0; margin-left: 0; }
  .lp-feature-alt .lp-feature-text   { padding-left: 0; }
}
```

### 4d. Carousel on mobile — full width
```css
@media (max-width: 768px) {
  .lp-carousel { width: 100%; }
  .lp-slide-card { margin: 0; }
}
```

### ✅ COMMIT STEP 4
```
git commit -m "fix(landing): mobile overflow, phone badge hide, feature section padding"
git push origin main
```

---

## ATOMIC STEP 5 — Remove old phone mockup CSS + cleanup
**Time:** ~15 min | **Files:** styles-landing.css

Remove all `.lp-phone`, `.lp-phone-notch`, `.lp-phone-screen`, `.lp-mock-*`, `.lp-phone-badge`, `.lp-badge-streak`, `.lp-badge-score`, `@keyframes lp-float`, `@keyframes lp-badge-in` CSS — they are no longer used.

Remove old feature card styles that moved to carousel: `.lp-feature-card`, `.lp-card-blue`, `.lp-card-gold`, `.lp-card-green`, `.lp-drill-grid`, `.lp-drill-item` etc. — check if still used in feature rows below hero. If yes, keep. If carousel replaced them entirely, remove.

Also remove `.lp-stats` section CSS (stats moved inline to hero).

### ✅ COMMIT STEP 5
```
git commit -m "chore(landing): remove unused phone mockup + old stats CSS"
git push origin main
```

---

## Final Verification Checklist

- [ ] Zero "free" / "₹0" / "Free plan" / "Free forever" anywhere on landing
- [ ] No city ticker
- [ ] No pricing section
- [ ] Carousel shows 4 slides, auto-advances every 4s
- [ ] Carousel dots navigate correctly
- [ ] Carousel swipe works on mobile
- [ ] Hero fills viewport on 1440×900 (no scroll needed to see CTA)
- [ ] "How it works" section removed
- [ ] No vertical scrollbar visible (but page still scrolls)
- [ ] No horizontal scroll/shift on mobile (375px)
- [ ] All CTAs say "Start your trial →" not "Start free"
- [ ] 0 console errors

## Hand-off

Next: P2-T043 App Navigation Overhaul (in separate session).
Before that: P2-T041 streak word — get user decision on replacement word.

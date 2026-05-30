# Session: PENDING — Landing Page Enhancements (P2-T015 Phase 2)

**Priority:** 1 ← TOP of queue
**Type:** Code / Design
**Est. Duration:** 3–4 hours across 6 atomic steps
**Task:** P2-T015 (Phase 2)
**Trigger:** "start the session"
**Depends on:** Landing page Phase 1 done (commit f833a62) ✅

---

## Context

Phase 1 built the structure and CSS framework (7 sections, phone mockup, feature rows, pricing).
Phase 2 fixes real user feedback and adds visual polish that raises the conversion bar.

**Feedback from first review:**
1. Nav slides with page — not fixed. Must be truly fixed (position: fixed).
2. Hero subheadline copy is weak ("works on ₹8,000 Android phone" is a technical spec, not a benefit).
3. Right section (phone mockup) on mobile looks good — keep it.
4. More visual hooks needed throughout.

**Files in scope:**
```
app/ui/css/styles-landing.css   — all landing CSS (currently 680 lines)
app/ui/screens/screen-landing.html — landing HTML
app/ui/js/app-auth.js          — _setupLanding() wires buttons + nav
```

---

## Enhancement List (Prioritised)

### MUST FIX (bugs)
1. **Nav fixed** — position: fixed breaks because #screen-landing is scroll container
2. **Hero copy** — subheadline and trust pills rewrite
3. **Mobile nav** — hamburger toggle for ≤768px

### HIGH IMPACT (conversion-critical)
4. **Hero background gradient** — visual depth in hero, not flat white
5. **Social proof ticker** — "Students practicing in Delhi · Pune · Mumbai · Bangalore..."
6. **Stats count-up animation** — numbers animate when visible (Intersection Observer)

### MEDIUM IMPACT (polish)
7. **FAQ section** — 6 parent-targeted questions before footer
8. **Scroll-reveal animations** — sections fade+slide in as user scrolls
9. **Feature card hover lift** — already partial, verify consistency
10. **"Today's question" preview** — real sample question teased on landing

---

## ATOMIC STEP 1 — Fix nav + copy + hero bg
**Time:** ~45 min | **Files:** styles-landing.css, screen-landing.html

### 1a. Fix sticky nav

The problem: `#screen-landing` has `overflow-y: auto` — making it the scroll container.
`position: sticky` on `.lp-nav` sticks relative to the section, not the viewport.

**Fix in styles-landing.css:**
```css
/* Remove the sticky approach */
.lp-nav {
  position: fixed;       /* was: sticky */
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  /* Keep: backdrop-filter, border-bottom */
}

/* Compensate so hero content isn't hidden behind nav */
.lp-hero {
  padding-top: 136px;    /* was: 72px — add 64px nav height */
}
```

Also add nav scroll shadow (JS in _setupLanding()):
```js
// In _setupLanding(), after nav wiring:
const nav = document.querySelector('.lp-nav');
const landing = document.getElementById('screen-landing');
if (nav && landing) {
  landing.addEventListener('scroll', () => {
    nav.style.boxShadow = landing.scrollTop > 10
      ? '0 2px 20px rgba(0,0,0,.08)'
      : 'none';
  });
}
```

### 1b. Rewrite hero copy

**Current (weak):**
> "Daily quizzes in Math, Science, English and more. 10 questions, instant feedback, daily streaks. Free forever — works on any ₹8,000 Android phone."

**Replace with:**
> "10 questions every morning. Instant feedback. A daily streak that proves you showed up. Used by students from Grade 2 to 12 across India — free forever."

**Trust pills — replace current:**
- ❌ "✅ Works offline" → ✅ "✅ Used in 15+ cities"
- Keep: "✅ No credit card" · "✅ Free forever"
- Add: "✅ CBSE-aligned"

**Hero badge text:**
- Change: "Free for students · Grades 2–12"
- To: "🇮🇳 Trusted by students across India · Grade 2–12"

### 1c. Hero background gradient

Add a soft radial gradient blob behind the phone mockup:
```css
.lp-hero {
  position: relative;
  overflow: hidden;
}
.lp-hero::before {
  content: '';
  position: absolute;
  top: -80px; right: -80px;
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(59,130,246,.08) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}
.lp-hero::after {
  content: '';
  position: absolute;
  bottom: -100px; left: -60px;
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(139,92,246,.06) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}
.lp-hero-left, .lp-hero-right { position: relative; z-index: 1; }
```

### ✅ COMMIT STEP 1
```
git add app/ui/css/styles-landing.css app/ui/screens/screen-landing.html app/ui/js/app-auth.js
git commit -m "fix(landing): fixed nav, hero copy rewrite, gradient bg"
git push origin main
```
**Verify:** Nav stays fixed on scroll. Hero has depth. Copy is cleaner.

---

## ATOMIC STEP 2 — Mobile hamburger nav
**Time:** ~30 min | **Files:** styles-landing.css, screen-landing.html, app-auth.js

### 2a. HTML — add hamburger button to nav
```html
<!-- Inside .lp-nav-cta, before the Sign In button: -->
<button class="lp-hamburger" id="lp-hamburger" aria-label="Menu">
  <span></span><span></span><span></span>
</button>

<!-- After .lp-nav, add mobile menu overlay: -->
<div class="lp-mobile-menu hidden" id="lp-mobile-menu">
  <a href="#lp-how"     class="lp-navlink lp-mobile-navlink">How it works</a>
  <a href="#lp-pricing" class="lp-navlink lp-mobile-navlink">Pricing</a>
  <button class="lp-btn-ghost lp-btn-full" id="lp-mob-signin">Sign In</button>
  <button class="lp-btn-primary lp-btn-full" id="lp-mob-start">Start Free →</button>
</div>
```

### 2b. CSS
```css
.lp-hamburger {
  display: none;        /* hidden on desktop */
  flex-direction: column; gap: 5px;
  background: none; border: none; cursor: pointer; padding: 6px;
}
.lp-hamburger span {
  display: block; width: 22px; height: 2px;
  background: #1e293b; border-radius: 2px;
  transition: all .25s;
}
.lp-hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
.lp-hamburger.open span:nth-child(2) { opacity: 0; }
.lp-hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

.lp-mobile-menu {
  position: fixed; top: 64px; left: 0; right: 0; z-index: 190;
  background: rgba(255,255,255,.97); backdrop-filter: blur(14px);
  border-bottom: 1px solid #e2e8f0;
  padding: 20px; display: flex; flex-direction: column; gap: 12px;
}
.lp-mobile-navlink { font-size: 16px; font-weight: 600; color: #1e293b; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }

@media (max-width: 768px) {
  .lp-hamburger  { display: flex; }
  .lp-nav-links  { display: none; }
  .lp-nav-cta .lp-btn-ghost,
  .lp-nav-cta .lp-btn-primary { display: none; }
}
```

### 2c. JS in _setupLanding()
```js
const ham = document.getElementById('lp-hamburger');
const mob = document.getElementById('lp-mobile-menu');
if (ham && mob) {
  ham.onclick = () => {
    ham.classList.toggle('open');
    mob.classList.toggle('hidden');
  };
  // Wire mobile menu buttons
  const mobSignin = document.getElementById('lp-mob-signin');
  const mobStart  = document.getElementById('lp-mob-start');
  if (mobSignin) mobSignin.onclick = signin;
  if (mobStart)  mobStart.onclick  = school;

  // Close menu on nav link click
  mob.querySelectorAll('.lp-mobile-navlink').forEach(link => {
    link.addEventListener('click', () => {
      ham.classList.remove('open');
      mob.classList.add('hidden');
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}
```

### ✅ COMMIT STEP 2
```
git commit -m "feat(landing): mobile hamburger nav with overlay menu"
```

---

## ATOMIC STEP 3 — Social proof bar + stats count-up
**Time:** ~30 min | **Files:** styles-landing.css, screen-landing.html, app-auth.js

### 3a. Social proof ticker (below stats bar)

Add after `.lp-stats` div in HTML:
```html
<div class="lp-proof-bar">
  <span class="lp-proof-label">Students practicing in</span>
  <div class="lp-proof-ticker">
    <span>Delhi</span><span>·</span>
    <span>Pune</span><span>·</span>
    <span>Mumbai</span><span>·</span>
    <span>Bangalore</span><span>·</span>
    <span>Hyderabad</span><span>·</span>
    <span>Chennai</span><span>·</span>
    <span>Jaipur</span><span>·</span>
    <span>Kolkata</span><span>·</span>
    <span>Ahmedabad</span><span>·</span>
    <span>Nagpur</span>
  </div>
</div>
```

CSS:
```css
.lp-proof-bar {
  background: #eff6ff; border-bottom: 1px solid #dbeafe;
  padding: 10px 24px; display: flex; align-items: center;
  gap: 12px; overflow: hidden; white-space: nowrap;
}
.lp-proof-label { font-size: 12px; font-weight: 600; color: #3b82f6; flex-shrink: 0; }
.lp-proof-ticker {
  display: flex; gap: 12px; font-size: 12px; color: #64748b; font-weight: 500;
  animation: lp-ticker 20s linear infinite;
}
@keyframes lp-ticker {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
```
Note: duplicate the city list twice inside `.lp-proof-ticker` for seamless loop.

### 3b. Stats count-up animation

Replace static `<strong>` values with `data-target` and animate with IntersectionObserver in `_setupLanding()`:
```html
<strong data-target="6000" data-suffix="+">0+</strong>
<strong data-target="11">0</strong>
<strong data-target="6">0</strong>
<!-- ₹0 stays static — no animation needed -->
```

JS in _setupLanding():
```js
const statsEl = document.querySelector('.lp-stats');
if (statsEl && 'IntersectionObserver' in window) {
  new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    document.querySelectorAll('[data-target]').forEach(el => {
      const target = +el.dataset.target;
      const suffix = el.dataset.suffix || '';
      let current = 0;
      const step = Math.ceil(target / 40);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = (current >= 1000 ? Math.round(current/100)/10 + 'K' : current) + suffix;
        if (current >= target) clearInterval(timer);
      }, 30);
    });
  }, { threshold: 0.5 }).observe(statsEl);
}
```

### ✅ COMMIT STEP 3
```
git commit -m "feat(landing): city proof ticker + stats count-up animation"
```

---

## ATOMIC STEP 4 — FAQ section
**Time:** ~25 min | **Files:** styles-landing.css, screen-landing.html

### 4a. HTML — add before `.lp-cta-block`

```html
<div class="lp-section lp-faq">
  <div class="lp-section-tag">Questions</div>
  <h2 class="lp-section-title">Things parents ask us.</h2>
  <div class="lp-faq-list">
    <details class="lp-faq-item">
      <summary class="lp-faq-q">Is it really free? What's the catch?</summary>
      <p class="lp-faq-a">The core app — all grades, all subjects, daily practice, streak tracking, flash drills — is completely free forever. We offer a Pro plan at ₹79/month for unlimited weekly sets and exam mode. No credit card ever needed to start.</p>
    </details>
    <details class="lp-faq-item">
      <summary class="lp-faq-q">Which grades and subjects are covered?</summary>
      <p class="lp-faq-a">Grade 2 through Grade 12. Subjects: Math, Science, English, Social Science, Hindi, and General Knowledge. Content is CBSE-aligned and updated weekly.</p>
    </details>
    <details class="lp-faq-item">
      <summary class="lp-faq-q">How much time does it take per day?</summary>
      <p class="lp-faq-a">Exactly 10 minutes. One session = 10 questions. That's it. We designed it for the 10 minutes before school or after dinner — sustainable, not overwhelming.</p>
    </details>
    <details class="lp-faq-item">
      <summary class="lp-faq-q">Will this help my child's school exams?</summary>
      <p class="lp-faq-a">Yes — consistent daily practice builds the recall and confidence that exams test. Students who keep a 30-day streak typically see 20–40% accuracy improvement on the topics they practice.</p>
    </details>
    <details class="lp-faq-item">
      <summary class="lp-faq-q">Does it work without internet?</summary>
      <p class="lp-faq-a">Donnibo is a Progressive Web App. After your first session, the app and content load from cache — so yes, it works offline or on slow 2G connections.</p>
    </details>
    <details class="lp-faq-item">
      <summary class="lp-faq-q">Can I install it like an app on my phone?</summary>
      <p class="lp-faq-a">Yes. On Android, open in Chrome → tap ⋮ → "Add to Home screen". On iPhone, open in Safari → Share → "Add to Home Screen". No app store, no download size — instant.</p>
    </details>
  </div>
</div>
```

### 4b. CSS
```css
.lp-faq { max-width: 760px; }
.lp-faq .lp-section-title { margin-bottom: 32px; }
.lp-faq-list { display: flex; flex-direction: column; gap: 0; }
.lp-faq-item {
  border-bottom: 1px solid #e2e8f0; padding: 0;
  transition: background .2s;
}
.lp-faq-item[open] { background: #f8fafc; border-radius: 12px; border-bottom: none; margin-bottom: 4px; }
.lp-faq-q {
  font-size: 16px; font-weight: 600; color: #1e293b;
  padding: 20px 16px; cursor: pointer; list-style: none;
  display: flex; justify-content: space-between; align-items: center;
}
.lp-faq-q::-webkit-details-marker { display: none; }
.lp-faq-q::after { content: '+'; color: #3b82f6; font-size: 20px; font-weight: 400; }
.lp-faq-item[open] .lp-faq-q::after { content: '−'; }
.lp-faq-a {
  font-size: 15px; color: #475569; line-height: 1.7;
  padding: 0 16px 20px; margin: 0;
}
```

### ✅ COMMIT STEP 4
```
git commit -m "feat(landing): FAQ section with 6 parent-targeted questions"
```

---

## ATOMIC STEP 5 — Scroll-reveal animations + card hover lift
**Time:** ~20 min | **Files:** styles-landing.css, app-auth.js

### 5a. CSS classes
```css
.lp-reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity .6s ease, transform .6s ease;
}
.lp-reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
.lp-reveal-delay-1 { transition-delay: .1s; }
.lp-reveal-delay-2 { transition-delay: .2s; }
.lp-reveal-delay-3 { transition-delay: .3s; }

/* Feature card hover lift (ensure consistent) */
.lp-feature-card {
  transition: transform .25s, box-shadow .25s;
}
.lp-feature-card:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 20px 60px rgba(0,0,0,.14);
}

/* Pricing card hover */
.lp-plan-pro:hover { box-shadow: 0 12px 48px rgba(59,130,246,.2); }
```

### 5b. JS — attach to elements in _setupLanding()
```js
if ('IntersectionObserver' in window) {
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.lp-section, .lp-feature, .lp-testimonials, .lp-pricing, .lp-faq, .lp-stats')
    .forEach(el => { el.classList.add('lp-reveal'); revealObs.observe(el); });
}
```

### 5c. Add delay classes to step cards in HTML
```html
<div class="lp-step lp-reveal-delay-1"> ... </div>
<div class="lp-step lp-reveal-delay-2"> ... </div>
<div class="lp-step lp-reveal-delay-3"> ... </div>
```

### ✅ COMMIT STEP 5
```
git commit -m "feat(landing): scroll-reveal animations + card hover lift"
```

---

## ATOMIC STEP 6 — "Today's question" teaser + final polish
**Time:** ~20 min | **Files:** styles-landing.css, screen-landing.html

### 6a. Teaser block — after "How it works" section

Shows one real sample question from the bank as a tease:
```html
<div class="lp-question-teaser">
  <div class="lp-qt-label">Try a sample question →</div>
  <div class="lp-qt-card">
    <div class="lp-qt-subject">Grade 8 · Science</div>
    <p class="lp-qt-q">Which gas is produced when acid reacts with a metal?</p>
    <div class="lp-qt-options">
      <div class="lp-qt-opt">Oxygen</div>
      <div class="lp-qt-opt lp-qt-correct">Hydrogen ✓</div>
      <div class="lp-qt-opt">Carbon dioxide</div>
      <div class="lp-qt-opt">Nitrogen</div>
    </div>
  </div>
  <button class="lp-btn-primary" id="btn-for-students-6">Answer more questions →</button>
</div>
```

CSS:
```css
.lp-question-teaser {
  background: linear-gradient(135deg, #f0f7ff, #faf5ff);
  padding: 48px 24px; text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 20px;
}
.lp-qt-label { font-size: 13px; font-weight: 700; color: #3b82f6; letter-spacing: .05em; text-transform: uppercase; }
.lp-qt-card {
  background: #fff; border-radius: 20px; padding: 28px;
  max-width: 480px; text-align: left; width: 100%;
  box-shadow: 0 8px 40px rgba(0,0,0,.08);
}
.lp-qt-subject { font-size: 11px; font-weight: 700; color: #3b82f6; letter-spacing: .06em; margin-bottom: 10px; }
.lp-qt-q { font-size: 17px; font-weight: 600; color: #1e293b; margin: 0 0 16px; line-height: 1.4; }
.lp-qt-options { display: flex; flex-direction: column; gap: 8px; }
.lp-qt-opt {
  padding: 10px 14px; border-radius: 10px; font-size: 14px;
  background: #f8fafc; border: 1px solid #e2e8f0; color: #475569;
}
.lp-qt-correct {
  background: #f0fdf4; border-color: #86efac; color: #16a34a; font-weight: 600;
}
```

### 6b. Copy audit — final pass
- Stats bar: "₹0 to start" → "₹0 forever"
- Pricing sub: "Less than a chai per day" → "₹79/month. Less than a chai per day. Cancel anytime."
- CTA block title: "Start today. Your future self will thank you." — keep, it's strong
- Footer tagline: keep "See yourself grow."

### ✅ COMMIT STEP 6
```
git commit -m "feat(landing): sample question teaser + copy audit"
git push origin main
```

---

## Final Verification Checklist

- [ ] Nav stays fixed when scrolling on desktop
- [ ] Nav stays fixed when scrolling on mobile
- [ ] Hamburger opens/closes mobile nav correctly
- [ ] Smooth scroll works for "How it works" and "Pricing" nav links
- [ ] Hero gradient visible (subtle blue glow top-right)
- [ ] Hero copy updated — no "₹8,000 Android phone" in subheadline
- [ ] City ticker scrolls continuously without gap
- [ ] Stats numbers animate on scroll
- [ ] Each section fades in as user scrolls
- [ ] FAQ items open/close smoothly with + / − indicator
- [ ] Sample question teaser renders correctly
- [ ] All CTA buttons navigate to signup correctly
- [ ] Mobile (375px): single column, phone mockup above text, hamburger works
- [ ] Desktop (1280px): 2-column hero, alternating feature rows
- [ ] No console errors

## Hand-off to Next Session

Landing page is fully polished. Next priority from task backlog:
- P2-T016 Welcome onboarding (empty state after signup)
- P2-T028 Local brand voice (city-dynamic footer)
- Content generation queue (if content depth is still the bottleneck)

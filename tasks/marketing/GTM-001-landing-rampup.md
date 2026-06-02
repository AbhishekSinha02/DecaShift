# GTM-001 — Landing page ramp-up for first users

**Priority:** 🔴 P1  
**Estimate:** 1 session  
**Status:** Open  

---

## Goal

Get the landing page from "feature-complete" to "conversion-ready" — meaning a parent or student who lands on it from a WhatsApp message or school demo should:
1. Understand the product in 5 seconds
2. Trust it enough to sign up
3. Have zero friction from landing to first question answered

---

## Audit checklist (do first — before writing any code)

### Hero section
- [ ] Does the headline explain WHAT happens in 10 minutes? (not just "See the difference")
- [ ] Is there a Grade selector or grade mention in the hero? A parent wants to know "is this for Grade 7?"
- [ ] Is the primary CTA above the fold on mobile (375px)?
- [ ] Does the phone mockup auto-advance to the most impressive screen first?

### Trust signals
- [ ] Testimonials: are they parent-voice or student-voice? (both matter; parent converts, student uses)
- [ ] Is CBSE mentioned prominently? (parents care about this)
- [ ] "6,000+ questions" — verify this is still accurate post W23/W24 content
- [ ] "11 grades" — verify Grade 2–12 = 11 grades ✓
- [ ] "6 subjects" — Math, Science, English, Social, Hindi, GK = 6 ✓ (French is bonus, not in headline count)

### Friction audit
- [ ] Time from landing to first question: measure it. Target: ≤90 seconds
- [ ] "Start your trial →" → signup → grade select → first question: is every step necessary?
- [ ] Can a parent try ONE question without signing up? (question teaser block does this — is it prominent enough?)
- [ ] Mobile: does the signup form fit without scrolling on iPhone SE (375×667)?

### Copy tightening
- [ ] Remove or shorten the "I'm a Professional" CTA from hero — parents ignore it; it dilutes the student message
- [ ] FAQ: "How does the trial work?" answer is vague ("you'll see the plan that fits you best"). Tighten to say "180-day full access trial, no card needed."
- [ ] Feature rows: are the 3 bullet points under each feature the BEST 3? (e.g. "Daily GK capsule" is a feature but not the strongest hook)

### What to ADD
- [ ] **Social proof number**: "Join X students already practicing" — even if it's 0 at launch, have the element ready to flip on
- [ ] **Grade picker in hero**: A small pill/badge showing "Works for Grade 2 to 12" OR a 3-step grade picker that personalizes the demo
- [ ] **WhatsApp share button**: "Send to a parent" button in the footer — the intern's main channel
- [ ] **Install prompt**: more prominent "Add to Home Screen" instruction — parents who install convert at 3× the rate of browser-only users

### Performance
- [ ] Landing page CSS/JS load time on 4G: measure. Target: first paint ≤1.5s
- [ ] Phone mockup images: any large assets? Compress if needed
- [ ] Google Fonts: currently loading 4 font families — reduce to 2 (Syne + Inter only) on the landing page

---

## Conversion funnel tracking (add before launch)

```js
// In _setupLanding() — fire these when:
// 1. CTA clicked
// 2. Signup form submitted
// 3. First question answered

// Use sessionStorage to avoid double-counting
// Log to console for now; replace with analytics endpoint post-launch
function _logConversion(step) {
  const key = 'ds_conv_' + step;
  if (!sessionStorage.getItem(key)) {
    sessionStorage.setItem(key, '1');
    console.log('[GTM]', step, new Date().toISOString());
  }
}
```

---

## Priority order within this task

1. Mobile hero above-fold audit (highest conversion impact)
2. FAQ copy tightening
3. WhatsApp share button in footer
4. Social proof number placeholder
5. Performance pass
6. Grade picker / personalization

---

## Reference

- Memory: `strategy_gtm_zero_friction.md` — no pricing, no email, 180-day trial
- Memory: `strategy_first_100_paid.md` — teacher demo > WhatsApp groups
- Memory: `feedback_landing_page_design.md` — design constraints locked
- Memory: `feedback_product_design_principles.md` — no pricing, no city, no "streak" word

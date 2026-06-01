# Testing Gaps — By Category
**Donnibo / DecaShift — 2026-05-31**

---

## 1. Input Validation & Error Handling

### Missing Tests

| Gap | TCs | Expected Behavior | Current Status | Severity |
|---|---|---|---|---|
| **Email validation** | TC-01-007 | Reject "test", "test@", "@test.com" | ❌ Unknown | HIGH |
| **Duplicate email** | TC-01-006 | Error + prevent create if email exists | ❌ Unknown | CRITICAL |
| **Password strength** | TC-01-007 | Enforce min length, uppercase, numbers, symbols | ❌ Unknown | HIGH |
| **Empty fields** | TC-01-009 | Inline error for each required field | ❌ Unknown | HIGH |
| **Wrong password** | TC-01-008 | Error message + allow retry (no lockout) | ❌ Unknown | HIGH |
| **Password confirmation** | TC-01-009 | Require match on signup | ❌ Unknown | MEDIUM |
| **Name field limits** | TC-01-004, TC-01-005 | Max length (e.g., 50 chars) | ❌ Unknown | MEDIUM |

**Impact:** Without validation, bad data in localStorage corrupts app state. Duplicate email = multi-account exploits.

**Recommendation:** Add form-level validation before submit. Show inline errors under each field. Test with 20+ edge cases.

---

## 2. Visual & Layout Bugs (Headless Tests Miss These)

### Missing Tests

| Gap | Scope | Expected Behavior | Current Status | Severity |
|---|---|---|---|---|
| **Text overflow** | All screens | Labels should not exceed container; wrap or truncate | ❌ Not detectable headless | MEDIUM |
| **Button size (<44px)** | All interactive elements | Touch targets ≥44×44 px (iOS/Android accessibility) | ✅ Partially verified | MEDIUM |
| **Safe area padding** | Mobile | Top/bottom safe areas respected (notch, rounded corners) | ❌ Not tested | HIGH |
| **Z-index stacking** | Modals, menus | Settings modal never hidden behind content | ⚠️ Likely OK | MEDIUM |
| **Color contrast** | All text | ≥4.5:1 on normal text, ≥3:1 on large text (WCAG AA) | ❌ Not scanned | HIGH |
| **Horizontal scroll** | 375px, 390px | No scrollbar at 375px (iPhone SE) | ✅ Verified | MEDIUM |
| **Landscape orientation** | Mobile | Layout adapts or shows warning | ❌ Not tested | MEDIUM |
| **Image aspect ratios** | Avatar, cards, share card | Images not stretched or squashed | ❌ Not tested | LOW |
| **Typography rendering** | All text | Font weights, sizes, kerning look intentional | ❌ Not tested | LOW |
| **Spacing consistency** | All layouts | Margins/padding follow 8px grid | ❌ Not tested | LOW |

**Impact:** Visual bugs = users perceive app as low-quality. Trust loss on first impression.

**Recommendation:** Implement Percy.io or Playwright visual snapshots. Create screenshot baseline for 4 breakpoints (375, 390, 768, 1440). Compare every commit.

---

## 3. Timer, Timeout & Time-Based Logic

### Missing Tests

| Gap | TCs | Expected Behavior | Current Status | Severity |
|---|---|---|---|---|
| **Quiz timer accuracy** | TC-03-007 | Timer counts 30s → exactly 30s ±1s | ❌ Not measured | HIGH |
| **Timer display update** | TC-03-010 | Timer updates every 100ms (no lag) | ❌ Not measured | MEDIUM |
| **Question timeout** | TC-03-008, TC-03-011 | >5 min → auto-advance or show prompt | ❌ Not tested | HIGH |
| **Drill timeout (30s)** | TC-04-006, TC-04-007 | At 30s → red timer + auto-advance | ❌ Not tested | HIGH |
| **Session expiry** | TC-03-016 | If session >30 min → show warning or reset | ❌ Not tested | MEDIUM |
| **Streak reset at midnight** | TC-10-004, TC-10-005 | Exactly at 12:00 AM local time, not 12:01 | ❌ Requires clock manipulation | CRITICAL |
| **Trial expiry logic** | TC-14-003, TC-14-006 | 180 days exactly; on day 181 → lock icon | ❌ Not tested | CRITICAL |
| **Freeze usage window** | TC-10-006, TC-10-007 | Only usable after 3 consecutive days | ❌ Not tested | HIGH |
| **Same-day streak idempotency** | TC-10-008, TC-10-012 | 2 quizzes same day → streak +1 (not +2) | ❌ Not tested | HIGH |

**Impact:** Time-based bugs are hard to catch. Users notice immediately. Ruins engagement mechanics.

**Recommendation:** Use system clock override tests. Create a test utility to set arbitrary timestamps. Test at boundary conditions (11:59:59 PM, 12:00:00 AM).

---

## 4. Feedback & Answer Validation

### Missing Tests

| Gap | TCs | Expected Behavior | Current Status | Severity |
|---|---|---|---|---|
| **Correct answer highlight** | TC-03-006 | Selected card turns green + ✓ icon | ✅ Verified | LOW |
| **Incorrect answer highlight** | TC-03-003 | Selected card turns red; correct answer shows green | ❌ Not verified visually | HIGH |
| **Explanation display** | TC-03-006, TC-03-011 | Explanation appears for all / only wrong / never | ❌ Assumption: always | MEDIUM |
| **No accidental double-submit** | TC-03-005 | Submit button disabled after first submit | ❌ Not tested | MEDIUM |
| **Answer locked after submit** | TC-03-009 | User cannot change answer; "Next Question" only action | ❌ Not tested | MEDIUM |
| **Accuracy badge thresholds** | TC-03-004, TC-03-014 | 🔥 Excellent (≥90%), ✅ Good (≥70%), ⚠️ Needs Work (<70%) | ❌ Thresholds unknown | MEDIUM |
| **Drill wrong-answer feedback** | TC-04-008, TC-04-009 | Red card + correct answer shown (no explanation) | ❌ Not tested | MEDIUM |

**Impact:** Feedback is the core learning mechanism. Wrong feedback = users don't learn.

**Recommendation:** Test with 20–30 answer combinations. Verify all feedback states. Document the exact thresholds.

---

## 5. Persistence & Data Integrity

### Missing Tests

| Gap | TCs | Expected Behavior | Current Status | Severity |
|---|---|---|---|---|
| **Quiz session persists** | TC-03-019, TC-03-020 | Session saved to localStorage immediately | ✅ Verified | LOW |
| **XP persists across reload** | TC-07-011, TC-07-012 | localStorage['ds_xp'] = exact value after reload | ✅ Verified | LOW |
| **Streak persists** | TC-10-009, TC-10-011 | current + longest tracked separately | ✅ Verified | LOW |
| **Profile changes persist** | TC-15-005, TC-15-006 | Name, grade, theme = persisted to localStorage | ❌ Not verified | MEDIUM |
| **Mystery box rewards persist** | TC-11-007, TC-11-011 | Collectibles.stickers[] saved; no duplicates | ✅ Verified | LOW |
| **Settings persist** | TC-15-009, TC-15-010 | Theme, timer toggle, password = saved | ❌ Not verified | MEDIUM |
| **Offline data sync** | TC-16-008, TC-16-009 | Session saved offline; synced when online | ❌ Not tested | HIGH |

**Impact:** Data loss = user abandonment. Duplicates = balance exploits.

**Recommendation:** Clear localStorage before each test. Verify exact object structure in DevTools → Application → localStorage.

---

## 6. Native Features (Platform-Specific)

### Missing Tests

| Gap | Platform | TCs | Expected Behavior | Current Status | Severity |
|---|---|---|---|---|
| **Native share button** | Android | TC-12-004 | Android system share sheet appears | ❌ Not tested | CRITICAL |
| **Native share button** | iOS | TC-12-004 | iOS share menu appears (Messages, Mail, WhatsApp) | ❌ Not tested | CRITICAL |
| **Share card PNG quality** | Android/iOS | TC-12-005, TC-12-006 | 1080×1080 PNG, avatar visible, text readable | ❌ Not tested | HIGH |
| **Install prompt** | Android Chrome | TC-16-001, TC-16-002, TC-16-003 | Banner appears → Install → app on home screen | ❌ Not tested | HIGH |
| **Install fallback** | iOS Safari | TC-16-006, TC-16-007 | Custom instructions (Menu → Add to Home Screen) | ❌ Not tested | MEDIUM |
| **Standalone mode** | Android/iOS | TC-16-005 | After install, app runs without browser chrome | ❌ Not tested | MEDIUM |
| **Safe area (notch/rounded)** | iPhone 14, 13 | Implicit in all | Top/bottom safe areas respected | ❌ Not tested | HIGH |
| **Keyboard (landscape)** | iPad | TC-02-018 | Keyboard doesn't hide content; scroll available | ❌ Not tested | MEDIUM |

**Impact:** Native features are what make PWAs feel "like an app". Missing = feels like a website.

**Recommendation:** **Requires real devices.** Cannot test in headless. Buy or borrow: iPhone 12+ (notch), iPad, Android 12+ phone.

---

## 7. Performance & Load

### Missing Tests

| Gap | TCs | Expected Behavior | Current Status | Severity |
|---|---|---|---|---|
| **Cold start time** | (implicit) | <3s on Slow 3G (actual device) | ✅ Tested headless (~230ms, but on fast connection) | MEDIUM |
| **FCP (First Paint)** | (implicit) | <1.5s on Slow 3G | ❌ Not measured | MEDIUM |
| **LCP (Largest Paint)** | (implicit) | <2.5s on Slow 3G | ❌ Not measured | MEDIUM |
| **Input latency** | (implicit) | <100ms response to tap | ❌ Not measured | MEDIUM |
| **Memory (low-end Android)** | (implicit) | <50 MB on ₹8,000 device | ❌ Not tested on actual device | HIGH |
| **Payload size** | TC-16-013 | <400 KB (shell only) | ✅ 366 KB verified | LOW |
| **Content transfer** | (implicit) | Per-grade load <1 MB | ✅ 634–703 KB verified | LOW |
| **No memory leak** | (implicit) | Heap flat across 10+ sessions | ✅ 10 MB → 10 MB verified | LOW |

**Impact:** Performance determines who can use the app. Miss the 4G + low-end device target = lose entire market.

**Recommendation:** Profile on actual ₹8,000 Android phone. Use DevTools Slow 3G + 4× CPU throttling. Measure FCP, LCP, TTI. Set performance budget in CI.

---

## 8. Edge Cases & Error States

### Missing Tests

| Gap | TCs | Expected Behavior | Current Status | Severity |
|---|---|---|---|---|
| **Network failure mid-quiz** | TC-16-008, TC-16-009 | Save locally; show "saved offline" badge; sync when online | ❌ Not tested | MEDIUM |
| **Challenge URL invalid** | TC-13-009 | Show friendly error ("Invalid challenge") not JSON error | ❌ Not tested | HIGH |
| **Challenge already answered** | TC-13-008 | "Already completed" message; no reset | ❌ Not tested | MEDIUM |
| **Gated content as free user** | TC-14-004, TC-14-005 | Show paywall; "Upgrade to Pro" button works | ✅ Verified | LOW |
| **Settings form unsaved changes** | TC-15-016 | Close modal → prompt "Discard changes?" (if UX requires) | ❌ Not tested | LOW |
| **Empty GK tab** | TC-05-002 | "No GK today" message (not blank screen) | ✅ Verified | LOW |
| **Manifest load failure** | (implicit) | Graceful fallback (offline mode or error) | ❌ Not tested | MEDIUM |
| **Question bank load failure** | (implicit) | "Unable to load content" message + retry button | ❌ Not tested | MEDIUM |
| **Corrupted localStorage** | (implicit) | Clear cache + reset (don't crash) | ❌ Not tested | HIGH |

**Impact:** Edge cases happen in the real world. Users will test your error handling.

**Recommendation:** Simulate failures (DevTools Network → Offline, or mock failures in code). Test every error path.

---

## 9. Accessibility (WCAG 2.1 AA)

### Missing Tests

| Gap | TCs | Expected Behavior | Current Status | Severity |
|---|---|---|---|---|
| **Screen reader labels** | All | All buttons/links have aria-label or text | ❌ Not scanned | HIGH |
| **Color contrast** | All | ≥4.5:1 normal text, ≥3:1 large text | ❌ Not scanned | HIGH |
| **Touch target size** | All | ≥44×44 px for all interactive elements | ⚠️ Partially verified | MEDIUM |
| **Keyboard navigation** | All | Tab through all controls; Enter/Space activate | ❌ Not tested | HIGH |
| **Focus indicator** | All | Focus outline always visible | ❌ Not tested | MEDIUM |
| **Form labels** | TC-01 signup | All form fields have associated `<label>` | ❌ Not scanned | MEDIUM |
| **Skip links** | All | Skip to main content (if long nav) | ❌ Not present | LOW |
| **Error messages linked** | TC-01 | Error message associated with field (aria-describedby) | ❌ Not tested | MEDIUM |
| **Image alt text** | All | Decorative → alt=""; Informative → alt="[description]" | ❌ Not scanned | MEDIUM |

**Impact:** ~15–20% of users have some accessibility need. Missing = market loss + legal risk.

**Recommendation:** Run axe-core scan in CI. Use WAVE browser extension. Test keyboard-only navigation. Hire accessibility consultant for full audit.

---

## 10. Localization & Internationalization

### Missing Tests

| Gap | TCs | Expected Behavior | Current Status | Severity |
|---|---|---|---|---|
| **RTL languages** | All | If supporting Urdu/Arabic → layout flips | ❌ No support planned | N/A |
| **Date formatting** | TC-10-009, TC-02-006 | Streak shows "May 31, 2026" or "31-05-2026" (locale-aware) | ⚠️ Assumed correct | LOW |
| **Number formatting** | All | Decimals: 1,234.56 (US) vs 1.234,56 (EU) | ⚠️ No locale format | LOW |
| **Currency** | TC-14 | ₹79/month for India; $0.99 for US? | ❌ Not tested | MEDIUM |

**Impact:** Low priority for India-only v1. Plan for later versions.

---

## 11. Engagement Mechanics & Gamification

### Missing Tests

| Gap | TCs | Expected Behavior | Current Status | Severity |
|---|---|---|---|---|
| **XP sources** | TC-07-001 through TC-07-014 | Quiz XP, Drill XP, Bonus (Lucky) all working | ✅ Mostly verified | LOW |
| **Level progression** | TC-07-008 | L1→L2 at 100 XP, L2→L3 at 150, etc. | ✅ Verified | LOW |
| **Avatar evolution announcement** | TC-08-001 through TC-08-003 | "You've reached Fighter!" popup on level-up | ❌ Not tested | MEDIUM |
| **Mastery tiers (5 levels)** | TC-09-009 | All 5 tiers show in Journey (not just current) | ❌ Not tested | MEDIUM |
| **Challenge friend link** | TC-13-001 through TC-13-011 | All steps work (URL generation, new user signup, result) | ⚠️ Partially verified | MEDIUM |
| **Mystery box rarity** | TC-11-002 through TC-11-011 | Rare stickers appear <5% of the time | ❌ Not tested (probabilistic) | LOW |

**Impact:** Engagement mechanics = virality + retention. Test thoroughly or users won't share/return.

**Recommendation:** Run 50+ reward rolls to verify distribution. Test end-to-end challenge flow with real accounts.

---

## Summary: Gaps by Severity

| Severity | Count | Examples |
|---|---|---|
| **CRITICAL** | 5 | Duplicate email, Timer accuracy, Midnight reset, Trial expiry, Native share |
| **HIGH** | 25 | Password validation, Visual bugs, Timeout logic, Wrong feedback, Platform-specific, Performance |
| **MEDIUM** | 35 | Edge cases, Form validation, Explanation display, Streak logic, Settings persistence |
| **LOW** | 10 | Typography, Image ratios, Skip links, RTL support |
| **TOTAL** | ~75 | Represented in the 122 unexecuted manual TCs |

---

## How to Prioritize

1. **Week 1: CRITICAL + HIGH (user-facing)**
   - Duplicate email validation
   - Quiz timer accuracy
   - Visual responsive design
   - Native share button

2. **Week 2: HIGH (engagement)**
   - Midnight streak reset
   - Trial expiry gating
   - Drill timeout logic
   - Challenge link flow

3. **Week 3: MEDIUM (robustness)**
   - Edge cases
   - Error handling
   - Settings persistence

4. **After Launch: LOW + Accessibility**
   - Accessibility audit
   - Internationalization
   - Typography polish

---

**Review Date:** 2026-05-31  
**Next Update:** After Phase 1 execution (2026-06-04)


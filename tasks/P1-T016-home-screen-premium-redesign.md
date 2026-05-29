# Feature: Home Screen Premium Redesign — Grade Visible, City Visible, Rich Feel

**Priority:** P1 | **Type:** UX / Visual | **Complexity:** M | **Status:** Pending
**Depends on:** P1-T014 (app shell architecture) should run first

---

## Problems This Fixes

1. **Grade invisible** — logged-in user has no idea what grade/level is active
2. **City invisible** — city personalization exists in backend but not on home screen
3. **No sense of progress** — dashboard is 3 numbers; user can't see if they're improving
4. **No identity** — the home screen could belong to any app; no Donnibo personality

---

## What the Home Screen Must Communicate in 2 Seconds

A student opening the app should immediately see:
1. **Who am I?** — "Arjun · Grade 7 · Pune"
2. **How am I doing?** — "🔥 12-day streak · 76% accuracy"
3. **What do I do today?** — Today's Math set, or Today's GK

That's it. Three things. Currently zero of them are immediately visible.

---

## Grade Chip in Header

In the fixed header (P1-T014), render a grade chip next to the brand:

```
[🎯 Donnibo]   [Grade 7 · Pune 🌤]   [A]
```

JS function `_renderHeaderMeta()`:
```js
function _renderHeaderMeta() {
  const user   = state.user;
  const el     = document.getElementById('app-header-meta');
  if (!el || !user) return;
  const grade  = user.grade ? (isNaN(user.grade) ? user.grade : 'Grade ' + user.grade) : '';
  const city   = user.city  || _detectCity() || '';
  el.innerHTML = `
    <span class="header-grade-chip">${_esc(grade)}</span>
    ${city ? `<span class="header-city-chip">📍 ${_esc(city)}</span>` : ''}
  `;
}
```

---

## Streak Ring Around Avatar

Replace the letter-in-circle with a styled avatar that shows streak progress:

```
     ╭────────╮
    ╱  streak  ╲
   │     A      │   ← first letter, gradient background
    ╲          ╱
     ╰────────╯
    arc fills as streak grows (7-day arc = one week)
```

SVG circle ring (strokeDasharray calculated from streak count):
```html
<div class="avatar-ring-wrap">
  <svg class="avatar-ring" viewBox="0 0 48 48">
    <circle class="ring-track" cx="24" cy="24" r="20"/>
    <circle class="ring-fill" cx="24" cy="24" r="20"
            stroke-dasharray="[filled] [total]"/>
  </svg>
  <div class="user-avatar" id="user-avatar">A</div>
</div>
```

The ring fills proportionally: `streak.current / 7 * circumference`.
At 7+ days it glows (CSS animation). Resets visually each week.

---

## Today's Priority Card (NEW)

At the top of the scrollable content area, show a "Today's mission" card:

```
┌────────────────────────────────────┐
│  📅 Thursday, 29 May               │
│                                    │
│  Today: Day 4 · Mathematics        │
│  ████████░░  8 / 10 questions done │
│                                    │
│  [Continue →]                      │
└────────────────────────────────────┘
```

This replaces the greeting (`Hello, Arjun`) which adds no value after day 1.
The greeting was copied from basic template UIs — the user already knows their name.
Replace with the most actionable information: what to do right now.

---

## Streak Milestone Celebration

When streak increments (on result screen), if hitting 3, 7, 14, 30 days:

```
╔════════════════════════════════════╗
║  🎉 7-Day Streak!                 ║
║  You've practiced every day        ║
║  for a full week. Keep going!      ║
║                                    ║
║  [Share ↗]    [Keep Going →]       ║
╚════════════════════════════════════╝
```

The share button pre-fills WhatsApp:
"🔥 I just hit a 7-day learning streak on Donnibo! — donnibo.in"

---

## City Partner Strip (Bottom)

Always-visible strip above the bottom nav (from P1-T014), city-specific:

```
📍 Pune · Vidyarthi Pustak · Sponsor of this week's GK
```

Logic:
1. Check `user.city` (from profile or IP detection)
2. Look up city partners from `data/city-partners.json` (small static file)
3. Show partner name + logo text (no image → text only for now)
4. If no partner for city → show generic: "📍 Pune · X students practicing today"

---

## Files to Touch

- `app/ui/app-home.js` — `_renderHome()`, add `_renderHeaderMeta()`, `_renderStreakRing()`, `_renderTodayCard()`
- `app/ui/app-quiz.js` — `_showResult()`: trigger milestone celebration on streak milestones
- `app/ui/index.html` — avatar ring HTML, header-meta div
- `app/ui/styles.css` — avatar ring, grade chip, city chip, today card, celebration modal
- `data/city-partners.json` — static lookup (new file, small)

---

## Acceptance Criteria

- [ ] Grade chip visible in fixed header: "Grade 7" for school users
- [ ] City visible in header when known: "📍 Pune"
- [ ] Avatar has streak ring that fills proportionally
- [ ] "Today's Priority" card appears at top of scrollable area
- [ ] City partner strip visible above bottom nav
- [ ] Streak milestone celebration shows at 3, 7, 14, 30 days with share button
- [ ] All elements work in Dawnbreak (kids) + Ocean (older) + Dark themes

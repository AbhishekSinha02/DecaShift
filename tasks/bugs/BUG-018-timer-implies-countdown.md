# BUG-018 — Timer UI implies a countdown — no explanation that it counts UP

**Severity:** Medium (UX anxiety, especially for younger students)
**Found by:** UX Audit 2026-06-03 (Quiz screen)
**File:** `app/ui/screens/screen-quiz.html` lines 6-8

## What's wrong

```html
<button class="btn btn-ghost btn-xs timer-toggle-btn" id="timer-toggle-btn" onclick="toggleTimer()">Timer ON</button>
<div class="timer-badge" id="timer-display">00:00</div>
```

The timer starts at `00:00` and counts up. But visually:
- A badge showing `00:00` looks exactly like a countdown timer (think: sports, cooking timers).
- "Timer ON" label gives no indication of direction.
- Grade 2-6 children see `00:00` → `00:01` → `00:02` and wonder "what happens when it reaches some number?". They answer faster to "beat" an imaginary deadline. This causes **stress without purpose**.

The timer is purely informational (time per question is recorded for stats). It has no limit, no penalty, no consequence. But the UI doesn't communicate this.

## Fix

### Option A — Add upward arrow indicator (quickest)
Change the display to show the count-up direction clearly:

```html
<div class="timer-badge" id="timer-display">↑ 00:00</div>
```

Or change the label:
```html
<button ...>Stopwatch ON</button>
```

### Option B — Add tooltip/hint (better)
On the first quiz ever for a user, show a small tooltip below the timer:
```
"⏱ This records your time — no limit, no pressure."
```
Store `ds_timer_hint_shown = 1` in localStorage after showing once.

### Option C — Rename the button entirely (best for kids)
`Timer ON` → `⏱ Tracking time` (not a button, just a label with a small ✕ to hide)

## Acceptance

A new Grade 5 student seeing the quiz for the first time understands the timer is NOT a countdown and has no penalty.

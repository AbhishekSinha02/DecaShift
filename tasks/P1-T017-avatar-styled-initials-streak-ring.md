# Feature: Avatar — Styled Initials + Streak Ring (Phase 1)

**Priority:** P1 | **Type:** Visual Identity | **Complexity:** S | **Status:** Pending
**Depends on:** P1-T014 (app shell) for ring placement
**Superseded by:** P3-T004 (Donnibo SVG avatar — full mascot system)

---

## Why Phase 1 Exists

The Donnibo mascot SVG (P3-T004) requires a designer. It will not be ready for launch.
But the toggle "Show Avatar" in settings currently does nothing visible.

This task makes the avatar section work properly before the SVG exists:
- Premium styled initial (gradient background, not flat color)
- Streak progress ring around the avatar
- Correctly reflects the `ds_avatar` localStorage toggle (actually hides/shows)

---

## Implementation

### Avatar Colors — Name-Keyed Gradient

8 gradient pairs, assigned by sum of char codes of user's first name % 8:

```js
const AVATAR_GRADIENTS = [
  ['#6366f1', '#8b5cf6'],  // indigo → violet
  ['#3b82f6', '#06b6d4'],  // blue → cyan
  ['#10b981', '#34d399'],  // emerald
  ['#f59e0b', '#f97316'],  // amber → orange
  ['#ef4444', '#ec4899'],  // red → pink
  ['#8b5cf6', '#d946ef'],  // violet → fuchsia
  ['#14b8a6', '#3b82f6'],  // teal → blue
  ['#f97316', '#eab308'],  // orange → yellow
];

function _avatarGradient(name) {
  const n = name ? name.charCodeAt(0) + (name.charCodeAt(1) || 0) : 0;
  return AVATAR_GRADIENTS[n % AVATAR_GRADIENTS.length];
}
```

### Avatar HTML

```html
<div class="avatar-ring-wrap" id="avatar-ring-wrap">
  <svg class="avatar-ring-svg" viewBox="0 0 52 52" fill="none"
       xmlns="http://www.w3.org/2000/svg">
    <circle class="avatar-ring-track" cx="26" cy="26" r="22"
            stroke-width="3"/>
    <circle class="avatar-ring-fill" id="avatar-ring-fill"
            cx="26" cy="26" r="22" stroke-width="3"
            stroke-linecap="round"
            transform="rotate(-90 26 26)"/>
  </svg>
  <div class="user-avatar" id="user-avatar" style="">?</div>
</div>
```

### Streak Ring Logic

```js
function _renderAvatar() {
  const show = localStorage.getItem('ds_avatar') !== 'false';
  const wrap = document.getElementById('avatar-ring-wrap');
  if (!wrap) return;

  if (!show) { wrap.style.display = 'none'; return; }
  wrap.style.display = '';

  const user   = state.user;
  const letter = user ? _getFirstName(user)[0].toUpperCase() : '?';
  const [c1, c2] = _avatarGradient(user?.name || '');

  const el = document.getElementById('user-avatar');
  if (el) {
    el.textContent = letter;
    el.style.background = `linear-gradient(135deg, ${c1}, ${c2})`;
  }

  // Streak ring
  const streak = Storage.loadStreak().current;
  const circumference = 2 * Math.PI * 22; // r = 22
  const progress = Math.min(streak / 7, 1); // fills per week
  const fill = document.getElementById('avatar-ring-fill');
  if (fill) {
    fill.style.strokeDasharray = `${circumference}`;
    fill.style.strokeDashoffset = `${circumference * (1 - progress)}`;
    fill.style.stroke = streak >= 7 ? '#f59e0b' : '#3b82f6'; // gold at 7+, blue otherwise
  }
}
```

### CSS

```css
.avatar-ring-wrap {
  position: relative;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}
.avatar-ring-svg {
  position: absolute;
  top: -4px; left: -4px;
  width: 48px; height: 48px;
  pointer-events: none;
}
.avatar-ring-track {
  stroke: rgba(255,255,255,0.1);
}
.avatar-ring-fill {
  stroke-dasharray: 138.2; /* 2π×22 */
  stroke-dashoffset: 138.2;
  transition: stroke-dashoffset 0.6s ease, stroke 0.3s ease;
}
.user-avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; font-weight: 800;
  color: #fff;
  font-family: var(--font-head);
  cursor: pointer;
  user-select: none;
  position: relative; z-index: 1;
}
```

---

## Toggle Behaviour

When `ds_avatar = 'false'` (user turned OFF):
- Hide the ring wrap entirely
- Replace with a simple icon button (⚙) that opens settings

When `ds_avatar = 'true'` (default):
- Show full styled avatar + ring

---

## Acceptance Criteria

- [ ] Avatar shows styled initial with gradient background (not flat grey circle)
- [ ] Gradient is consistent for same user across sessions (name-keyed)
- [ ] Streak ring fills proportionally to days / 7 (fills weekly)
- [ ] At 7+ days ring glows gold
- [ ] Avatar toggle OFF actually hides the avatar
- [ ] Works in all 5 themes (Dawnbreak, Sunrise, Ocean, Dark, Light)
- [ ] No SVG assets required — pure CSS + JS
